import {
  createSessionCookieHeader,
  medusa,
} from "~/integrations/medusa/client";
import { type Cart } from "~/types/cart";
import { transformMedusaCart } from "./cart-transformer";

export type GetCartOptions = {
  cartId: string;
  sessionId?: string;
};

export const getCart = async ({
  cartId,
  sessionId,
}: GetCartOptions): Promise<Cart> => {
  try {
    const cartRes = await medusa.carts.retrieve(
      cartId,
      createSessionCookieHeader(sessionId)
    );
    return transformMedusaCart(cartRes.cart);
  } catch (error) {
    throw new Error(`Error fetching cart for ID "${cartId}"`, { cause: error });
  }
};
