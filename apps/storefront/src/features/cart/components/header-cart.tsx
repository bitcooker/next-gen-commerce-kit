import { useTranslation } from "next-i18next";
import { type FC } from "react";

import { Button } from "~/components/button";
import { useCartQuery } from "../hooks/use-cart-query";
import { useCartDrawerOpen } from "./cart-drawer";

export const HeaderCart: FC = () => {
  const { t } = useTranslation(["common"]);
  const [, setCartDrawerOpen] = useCartDrawerOpen();
  const { data: cart, isInitialLoading: isLoadingCart } = useCartQuery();
  const cartItemsCount = cart?.items.length ?? 0;

  if (isLoadingCart)
    return <Button size="small" loading disabled className="w-24"></Button>;

  const handleClick = () => setCartDrawerOpen(true);

  return (
    <Button size="small" type="button" className="gap-2" onClick={handleClick}>
      {t("headerCart.label")}
      {cartItemsCount > 0 && (
        <div className="badge-secondary badge">{cartItemsCount}</div>
      )}
    </Button>
  );
};
