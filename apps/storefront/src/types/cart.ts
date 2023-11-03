import { type Price } from "./price";

export type Cart = {
  id: string;
  items: CartItem[];
  totalPrice: Price;
  shippingPrice: Price | null;
  discount: Price | null;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string | null;
  productSlug: string | null;
  variantId: string | null;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  quantity: number;
  unitPrice: Price;
  totalPrice: Price;
  discount: Price | null;
};
