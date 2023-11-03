import { medusa } from "~/integrations/medusa/client";
import { type ListProduct } from "~/types/product";

export const getPromotedProducts = async (): Promise<ListProduct[]> => {
  try {
    const productsRes = await medusa.products.list({
      fields: "id,handle,title,subtitle,thumbnail",
      expand: "",
      limit: 20,
    });
    return productsRes.products
      .filter((product) => product.handle)
      .map((product) => ({
        id: product.id,
        slug: product.handle ?? "",
        title: product.title,
        subtitle: product.subtitle,
        thumbnailUrl: product.thumbnail,
      }));
  } catch (error) {
    throw new Error("Error fetching promoted products", { cause: error });
  }
};
