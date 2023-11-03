import { atom, useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useEffect, useRef, type FC } from "react";

import { Button } from "~/components/button";
import { useCartQuery } from "../hooks/use-cart-query";

const cartDrawerOpen = atom(false);
export const useCartDrawerOpen = () => useAtom(cartDrawerOpen);

export const CartDrawer: FC = () => {
  const { t } = useTranslation(["common"]);
  const [open, setOpen] = useCartDrawerOpen();
  const { data: cart } = useCartQuery();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div
      className={`drawer drawer-end fixed inset-0 ${
        !open ? "pointer-events-none" : ""
      }`}
    >
      <input
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        readOnly
      />
      <div className="drawer-side grid-rows-[100%]">
        <div className="drawer-overlay" onClick={close}></div>
        <div className="grid w-4/5 grid-rows-[auto_1fr] gap-4 bg-base-100 p-4 text-base-content md:w-1/2 lg:w-1/3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{t("cartDrawer.title")}</h2>
            <Button
              ref={closeButtonRef}
              size="small"
              type="button"
              onClick={close}
            >
              {t("cartDrawer.closeLabel")}
            </Button>
          </div>
          {cart ? (
            <ul className="grid content-start gap-2 overflow-y-auto overscroll-contain pe-4">
              {cart.items.map((item) => (
                <li key={item.id} className="grid grid-cols-4 gap-4">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      width={1680}
                      height={2100}
                      sizes="150px"
                      className="rounded-btn h-auto w-full"
                    />
                  ) : (
                    <div></div>
                  )}
                  <div className="col-span-3">
                    <p className="text-lg">
                      {item.title} - {item.description}
                    </p>
                    <p className="flex justify-between">
                      <span>{item.quantity}&times;</span>
                      <span className="font-bold">
                        {t("formattedPrice", {
                          value: item.totalPrice.amount,
                          currency: item.totalPrice.currencyCode,
                        })}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t("cartDrawer.emptyText")}</p>
          )}
          {cart && (
            <p className="flex justify-between text-lg">
              <span>{t("cartDrawer.totalLabel")}</span>
              <span className="font-bold">
                {t("formattedPrice", {
                  value: cart.totalPrice.amount,
                  currency: cart.totalPrice.currencyCode,
                })}
              </span>
            </p>
          )}
          <div>
            <Button variant="primary" type="button" disabled={!cart}>
              {t("cartDrawer.checkoutLabel")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
