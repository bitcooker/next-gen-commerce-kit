import { type FC, type PropsWithChildren } from "react";

import { CartDrawer } from "~/features/cart/components/cart-drawer";
import { Header } from "./header";

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <CartDrawer />
    </>
  );
};
