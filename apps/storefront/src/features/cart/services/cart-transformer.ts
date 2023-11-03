import { type StoreCartsRes } from "@medusajs/medusa";

import { type Cart } from "~/types/cart";

export const transformMedusaCart = (cart: StoreCartsRes["cart"]): Cart => {
  const currencyCode = cart.region.currency_code.toUpperCase();
  return {
    id: cart.id,
    totalPrice: { amount: (cart.total ?? 0) / 100, currencyCode },
    shippingPrice:
      typeof cart.shipping_total === "number"
        ? { amount: cart.shipping_total / 100, currencyCode }
        : null,
    discount:
      typeof cart.discount_total === "number"
        ? { amount: cart.discount_total / 100, currencyCode }
        : null,
    items: cart.items.map((item) => ({
      id: item.id,
      cartId: item.cart_id,
      productId: item.variant?.product_id ?? null,
      productSlug: item.variant?.product?.handle ?? null,
      variantId: item.variant_id,
      title: item.title,
      description: item.description,
      thumbnailUrl: item.thumbnail,
      quantity: item.quantity,
      unitPrice: { amount: item.unit_price / 100, currencyCode },
      totalPrice: { amount: (item.total ?? 0) / 100, currencyCode },
      discount:
        typeof item.discount_total === "number"
          ? { amount: item.discount_total / 100, currencyCode }
          : null,
    })),
  };
};
