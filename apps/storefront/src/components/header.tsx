import { type FC } from "react";

import { UserMenu } from "~/features/auth/components/user-menu";
import { HeaderCart } from "~/features/cart/components/header-cart";
import { HeaderLogo } from "./header-logo";
import { LanguageSwitcher } from "./language-switcher";

export const Header: FC = () => {
  return (
    <header className="container mx-auto flex items-center justify-end gap-4 p-4">
      <HeaderLogo className="mr-auto" />
      <HeaderCart />
      <LanguageSwitcher />
      <UserMenu />
    </header>
  );
};
