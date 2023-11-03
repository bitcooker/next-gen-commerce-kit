import {
  createSessionCookieHeader,
  medusa,
} from "~/integrations/medusa/client";
import { type Cart } from "~/types/cart";
import { transformMedusaCart } from "./cart-transformer";

export type AddCartItemOptions = {
  variantId: string;
  quantity: number;
  countryCode: string;
  cartId?: string;
  sessionId?: string;
};

export const addCartItem = async ({
  variantId,
  quantity,
  countryCode,
  cartId,
  sessionId,
}: AddCartItemOptions): Promise<Cart> => {
  try {
    const currentCartId =
      cartId || (await createCart({ countryCode, sessionId })).cart.id;
    const cartRes = await medusa.carts.lineItems.create(
      currentCartId,
      { variant_id: variantId, quantity },
      createSessionCookieHeader(sessionId)
    );
    return transformMedusaCart(cartRes.cart);
  } catch (error) {
    throw new Error(`Error adding variant with ID "${variantId}" to cart`, {
      cause: error,
    });
  }
};

type CreateCartOptions = {
  countryCode: string;
  sessionId?: string;
};

const createCart = ({ countryCode, sessionId }: CreateCartOptions) =>
  medusa.carts.create(
    { country_code: countryCode },
    createSessionCookieHeader(sessionId)
  );
