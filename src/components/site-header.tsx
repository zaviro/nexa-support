"use client";

import Link from "next/link";
import { useLocale } from "~/i18n/locale-provider";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  const { copy } = useLocale();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/#top">
          Nexa Support
        </Link>
        <nav aria-label="Primary navigation" className="site-header__nav">
          <Link href="/#features">{copy.navigation.product}</Link>
          <Link href="/#pricing">{copy.navigation.pricing}</Link>
        </nav>
        <div className="site-header__actions">
          <LanguageSwitcher />
          <Link href="/login">{copy.navigation.logIn}</Link>
          <Link className="site-header__primary-action" href="/login">
            {copy.navigation.startFree}
          </Link>
        </div>
      </div>
    </header>
  );
}
