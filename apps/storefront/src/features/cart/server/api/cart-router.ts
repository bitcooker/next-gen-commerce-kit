import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getErrorMessage } from "~/utils/errors";
import { addCartItem } from "../../services/add-cart-item";
import { getCart } from "../../services/get-cart";
import { createCartCookieOptions, getCartCookieValue } from "../cart-cookie";

export const cartRouter = createTRPCRouter({
  getCart: publicProcedure.query(
    async ({ ctx: { authToken, cookies, setCookie } }) => {
      const cartId = getCartCookieValue(cookies);
      if (!cartId) return null;
      try {
        const cart = await getCart({ cartId, sessionId: authToken?.sessionId });
        setCookie(createCartCookieOptions(cart.id));
        return cart;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: getErrorMessage(error) ?? "Unknown error",
        });
      }
    }
  ),
  addCartItem: publicProcedure
    .input(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().min(1),
        countryCode: z.string().min(2).max(2),
      })
    )
    .mutation(
      async ({
        input: { variantId, quantity, countryCode },
        ctx: { authToken, cookies, setCookie },
      }) => {
        try {
          const cartId = getCartCookieValue(cookies);
          const cart = await addCartItem({
            variantId,
            quantity,
            countryCode,
            cartId,
            sessionId: authToken?.sessionId,
          });
          setCookie(createCartCookieOptions(cart.id));
          return cart;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: getErrorMessage(error) ?? "Unknown error",
          });
        }
      }
    ),
});
