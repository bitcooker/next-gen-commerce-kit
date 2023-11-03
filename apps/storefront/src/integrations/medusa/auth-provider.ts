import { type RequestInternal, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getErrorMessage } from "~/utils/errors";
import { getSessionId, medusa } from "./client";

export type MedusaCredentialsProviderOptions = {
  onSuccess?: (
    user: User,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
  ) => void | Promise<void>;
  onError?: (
    error: unknown,
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
  ) => void | Promise<void>;
};

/**
 * Next-Auth provider supporting login with Medusa.js credentials.
 *
 * Provides Medusa.js session ID as part of authorized user data.
 * Shape of user: `{ id: string; email: string; sessionId: string }`
 *
 * @param options Configuration options.
 */
export const MedusaCredentialsProvider = (
  options?: MedusaCredentialsProviderOptions
) =>
  CredentialsProvider({
    id: "medusa",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials?.password) return null;
      try {
        const auth = await medusa.auth.authenticate({
          email: credentials.email,
          password: credentials.password,
        });
        const sessionId = getSessionId(auth);
        if (!sessionId) throw new Error("Missing session ID");
        const user = {
          id: auth.customer.id,
          email: auth.customer.email,
          sessionId,
        };
        await options?.onSuccess?.(user, req);
        return user;
      } catch (error) {
        console.error(
          "❌ MedusaCredentialsProvider.authorize:",
          getErrorMessage(error) ?? "Unknown error"
        );
        await options?.onError?.(error, req);
        return null;
      }
    },
  });
