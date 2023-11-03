import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { getToken } from "next-auth/jwt";

import { getCartCookieValue } from "~/features/cart/server/cart-cookie";
import { MedusaCredentialsProvider } from "~/integrations/medusa/auth-provider";
import {
  createSessionCookieHeader,
  medusa,
} from "~/integrations/medusa/client";
import { getErrorMessage } from "~/utils/errors";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // Declare more properties exposed to client (e.g. `useSession`) via `session` callback.
    } & DefaultSession["user"];
  }

  interface User {
    sessionId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    sessionId: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      /**
       * Here we can transfer data from authenticated user returned by provider
       * to JWT holding the session data. For example, we store the Medusa.js
       * session ID to use it later in tRPC procedures.
       */
      if (user) {
        token.sessionId = user.sessionId;
      }
      return token;
    },
    session({ session, token }) {
      /**
       * Here we can expose session data to the client (e.g. `useSession` hook).
       * For example, we expose the Medusa.js user ID for client-side usage.
       */
      if (session.user && token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      /**
       * Here we can execute side effects when users sign out.
       * For example, we delete the Medusa.js session.
       */
      if (!token) return;
      try {
        await medusa.auth.deleteSession(
          createSessionCookieHeader(token.sessionId)
        );
      } catch (error) {
        console.error(
          "❌ AuthOptions.events.signOut: Error deleting Medusa.js session - ",
          getErrorMessage(error) ?? "Unknown error"
        );
      }
    },
  },
  providers: [
    MedusaCredentialsProvider({
      async onSuccess(user, req) {
        /**
         * Here we can execute side effects after successful sign in which
         * require access to request headers (e.g. cookies).
         * For example, we associate a possibly existing shopping cart with
         * the authorized user.
         */
        const cartId = getCartCookieValue(
          (req.headers?.cookie ?? "") as string
        );
        if (!cartId) return;
        try {
          await medusa.carts.update(
            cartId,
            { customer_id: user.id },
            createSessionCookieHeader(user.sessionId)
          );
        } catch (error) {
          console.error(
            "❌ AuthOptions.MedusaCredentialsProvider.onSuccess: Error updating customer ID for existing cart - ",
            getErrorMessage(error) ?? "Unknown error"
          );
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

/**
 * Wrapper for `getToken` to get the JWT holding session data.
 *
 * @see https://next-auth.js.org/configuration/options#jwt-helper
 */
export const getAuthToken = (req: GetServerSidePropsContext["req"]) =>
  getToken({ req });
