import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { type FC } from "react";

import { Button } from "~/components/button";
import { ButtonDropdown } from "~/components/button-dropdown";
import { api } from "~/utils/api";
import { useSignOut } from "../hooks/use-sign-out";

export const UserMenu: FC = () => {
  const { t } = useTranslation(["common"]);
  const { data: sessionData, status: sessionStatus } = useSession();
  const isLoadingSession = sessionStatus === "loading";
  const { data: customer, isInitialLoading: isLoadingCustomer } =
    api.auth.getCurrentCustomer.useQuery(
      undefined, // no input
      { enabled: !isLoadingSession && !!sessionData }
    );
  const { mutate: signOut } = useSignOut();

  if (isLoadingSession || isLoadingCustomer)
    return <Button size="small" loading disabled className="w-24"></Button>;

  if (!customer)
    return (
      <Button size="small" type="button" onClick={() => void signIn()}>
        {t("userMenu.signInLabel")}
      </Button>
    );

  return (
    <ButtonDropdown
      size="small"
      label={`${customer.firstName ?? ""} ${customer.lastName ?? ""}`}
      options={[
        {
          key: "signOut",
          element: (
            <button type="button" onClick={() => signOut()}>
              {t("userMenu.signOutLabel")}
            </button>
          ),
        },
      ]}
    />
  );
};
