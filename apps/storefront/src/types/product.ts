import { type Price } from "./price";

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrls: string[];
  thumbnailUrl: string | null;
  variants: Variant[];
};

export type ListProduct = Pick<
  Product,
  "id" | "slug" | "title" | "subtitle" | "thumbnailUrl"
>;

export type Variant = {
  id: string;
  productId: string;
  sku: string | null;
  title: string;
  price: Price | null;
};
