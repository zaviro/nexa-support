import Link from "next/link";
import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/#top">
          Nexa Support
        </Link>
        <nav
          aria-labelledby="primary-navigation-label"
          className="site-header__nav"
        >
          <span className="visually-hidden" id="primary-navigation-label">
            <LocalizedText en="Primary navigation" zhCN="主导航" />
          </span>
          <Link href="#features">
            <LocalizedText
              en={catalog.en.navigation.product}
              zhCN={catalog["zh-CN"].navigation.product}
            />
          </Link>
          <Link href="#pricing">
            <LocalizedText
              en={catalog.en.navigation.pricing}
              zhCN={catalog["zh-CN"].navigation.pricing}
            />
          </Link>
        </nav>
        <div className="site-header__actions">
          <LanguageSwitcher />
          <Link href="/login">
            <LocalizedText
              en={catalog.en.navigation.logIn}
              zhCN={catalog["zh-CN"].navigation.logIn}
            />
          </Link>
          <Link className="site-header__primary-action" href="/login">
            <LocalizedText
              en={catalog.en.navigation.startFree}
              zhCN={catalog["zh-CN"].navigation.startFree}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
