import { useTranslation } from "next-i18next";
import Link from "next/link";
import { type FC } from "react";

export type HeaderLogoProps = {
  className?: string;
};

export const HeaderLogo: FC<HeaderLogoProps> = ({ className = "" }) => {
  const { t } = useTranslation(["common"]);
  return (
    <Link href="/" className={`text-xl font-bold ${className}`}>
      {t("appName")}
    </Link>
  );
};
