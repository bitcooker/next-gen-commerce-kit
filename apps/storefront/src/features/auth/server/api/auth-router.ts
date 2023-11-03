import { TRPCError } from "@trpc/server";

import {
  createRemoveCartCookieOptions,
  getCartCookieValue,
} from "~/features/cart/server/cart-cookie";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getErrorMessage } from "~/utils/errors";
import { getCurrentCustomer } from "../../services/get-current-customer";

export const authRouter = createTRPCRouter({
  getCurrentCustomer: protectedProcedure.query(
    async ({ ctx: { authToken } }) => {
      try {
        return await getCurrentCustomer(authToken.sessionId);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: getErrorMessage(error) ?? "Unknown error",
        });
      }
    }
  ),
  prepareSignOut: protectedProcedure.mutation(
    ({ ctx: { cookies, setCookie } }) => {
      const cartId = getCartCookieValue(cookies);
      if (!cartId) return;
      setCookie(createRemoveCartCookieOptions());
    }
  ),
});
