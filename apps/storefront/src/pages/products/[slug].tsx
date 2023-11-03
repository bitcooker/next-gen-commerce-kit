import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ChangeEventHandler } from "react";
import { Button } from "~/components/button";

import { DefaultLayout } from "~/components/default-layout";
import { useCartDrawerOpen } from "~/features/cart/components/cart-drawer";
import { useAddCartItem } from "~/features/cart/hooks/use-add-cart-item";
import { getProductDetailsBySlug } from "~/features/catalog/services/get-product-details";

type ProductPageParams = { slug: string };
type ProductPageProps = {
  product: Exclude<Awaited<ReturnType<typeof getProductDetailsBySlug>>, null>;
};

const ProductPage: NextPage<ProductPageProps> = ({ product }) => {
  const { t } = useTranslation(["catalog", "common"]);
  const router = useRouter();
  const [, setCartDrawerOpen] = useCartDrawerOpen();
  const { mutate: addCartItem, isLoading: isAddingCartItem } = useAddCartItem();

  const selectedVariant =
    product.variants.find((variant) => variant.id === router.query.variant) ??
    product.variants[0];

  const handleChangeVariant: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    void router.replace({
      pathname: router.pathname,
      query: { ...router.query, variant: event.target.value },
    });
  };

  const handleClickAddToCart = () => {
    if (!selectedVariant) return;
    addCartItem(
      {
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode: "DE",
      },
      {
        onSuccess() {
          setCartDrawerOpen(true);
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>{`${product.title}  - ${t("appName", { ns: "common" })}`}</title>
        <meta name="description" content={product.description ?? ""} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultLayout>
        <div className="container mx-auto grid gap-6 px-4 py-12">
          <div>
            <h1 className="text-5xl font-bold text-accent">{product.title}</h1>
            {product.subtitle && (
              <p className="mt-4 text-2xl">{product.subtitle}</p>
            )}
          </div>
          <div className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ul className="grid gap-6">
              {product.imageUrls.map((imageUrl, index) => (
                <li key={imageUrl}>
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    width={1680}
                    height={2100}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="rounded-btn h-auto w-full"
                  />
                </li>
              ))}
            </ul>
            <div className="grid gap-6 lg:col-span-2">
              {product.description && (
                <p className="text-lg">{product.description}</p>
              )}
              {product.variants.length > 0 && (
                <div className="form-control">
                  <label htmlFor="product-variant-select" className="label">
                    {t("variant.variantLabel")}
                  </label>
                  <select
                    id="product-variant-select"
                    className="select-bordered select w-full max-w-xs"
                    value={selectedVariant?.id}
                    onChange={handleChangeVariant}
                  >
                    {product.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedVariant && (
                <>
                  <p className="text-xl font-bold">
                    {t("formattedPrice", {
                      ns: "common",
                      value: selectedVariant.price?.amount,
                      currency: selectedVariant.price?.currencyCode,
                    })}
                  </p>
                  <div>
                    <Button
                      variant="primary"
                      loading={isAddingCartItem}
                      type="button"
                      disabled={isAddingCartItem}
                      onClick={handleClickAddToCart}
                    >
                      {t("variant.addToCartLabel")}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default ProductPage;

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<
  ProductPageProps,
  ProductPageParams
> = async ({ locale, params }) => {
  if (!locale) throw new Error("Missing locale");
  if (!params || !params.slug) return { revalidate: 60, notFound: true };
  const product = await getProductDetailsBySlug(params.slug, {
    currencyCode: "EUR",
  });
  if (!product) return { revalidate: 60, notFound: true };
  return {
    revalidate: 60,
    props: {
      ...(await serverSideTranslations(locale, ["catalog", "common"])),
      product,
    },
  };
};
