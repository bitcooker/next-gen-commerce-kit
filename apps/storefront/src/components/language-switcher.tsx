import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";

import { ButtonDropdown } from "./button-dropdown";

export const LanguageSwitcher: FC = () => {
  const { t } = useTranslation(["common"]);
  const router = useRouter();
  return (
    /*
     * Setting locale as key forces React to recreate element on language change
     * which ensures that DaisyUI dropdown is closed after selecting a language.
     */
    <ButtonDropdown
      key={router.locale}
      size="small"
      label={t(`languages.${router.locale ?? "en"}`)}
      options={(router.locales ?? []).map((selectableLocale) => ({
        key: selectableLocale,
        element: (
          <Link
            href={{ pathname: router.pathname, query: router.query }}
            locale={selectableLocale}
            replace
          >
            {t(`languages.${selectableLocale}`)}
          </Link>
        ),
      }))}
    />
  );
};
