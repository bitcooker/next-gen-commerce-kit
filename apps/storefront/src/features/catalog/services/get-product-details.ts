import { medusa } from "~/integrations/medusa/client";
import { type Product } from "~/types/product";

export type GetProductDetailsOptions = {
  currencyCode: string;
};

export const getProductDetailsBySlug = async (
  slug: string,
  { currencyCode }: GetProductDetailsOptions
): Promise<Product | null> => {
  try {
    const productsRes = await medusa.products.list({
      handle: slug,
      currency_code: currencyCode.toLowerCase(),
    });
    const product = productsRes.products[0];
    if (!product) return null;
    return {
      id: product.id,
      slug: product.handle ?? "",
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      imageUrls: product.images.map((image) => image.url),
      thumbnailUrl: product.thumbnail,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        productId: variant.product_id,
        sku: variant.sku,
        title: variant.title,
        price:
          "calculated_price" in variant &&
          typeof variant.calculated_price === "number"
            ? { amount: variant.calculated_price / 100, currencyCode }
            : null,
      })),
    };
  } catch (error) {
    throw new Error(`Error fetching product details for slug "${slug}"`, {
      cause: error,
    });
  }
};
