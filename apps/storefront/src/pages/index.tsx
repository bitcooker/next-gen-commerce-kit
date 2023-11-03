import { type GetStaticProps, type NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Button } from "~/components/button";

import { DefaultLayout } from "~/components/default-layout";
import { ProductCard } from "~/features/catalog/components/product-card";
import { getPromotedProducts } from "~/features/catalog/services/get-promoted-products";

type HomePageProps = {
  promotedProducts: Awaited<ReturnType<typeof getPromotedProducts>>;
};

const HomePage: NextPage<HomePageProps> = ({ promotedProducts }) => {
  const { t } = useTranslation(["home", "common"]);

  return (
    <>
      <Head>
        <title>{t("appName", { ns: "common" })}</title>
        <meta name="description" content="E-commerce project template" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultLayout>
        <div className="hero bg-base-200">
          <div className="hero-content py-12 text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-accent">
                {t("hero.title")}
              </h1>
              <p className="mt-6">{t("hero.text")}</p>
              <Button variant="primary" className="mt-6">
                {t("hero.ctaLabel")}
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto grid gap-6 px-4 py-12">
          <h2 className="text-center text-3xl text-accent">
            {t("promotedProducts.heading")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {promotedProducts.map((product) => (
              <ProductCard
                key={product.id}
                href={`/products/${encodeURIComponent(product.slug)}`}
                title={product.title}
                subtitle={product.subtitle ?? undefined}
                imageUrl={product.thumbnailUrl ?? undefined}
                imageWidth={1680}
                imageHeight={2100}
                imageSizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<HomePageProps> = async ({
  locale,
}) => {
  if (!locale) throw new Error("Missing locale");
  const promotedProducts = await getPromotedProducts();
  return {
    revalidate: 60,
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
      promotedProducts,
    },
  };
};
