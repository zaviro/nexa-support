import Link from "next/link";
import { LanguageSwitcher } from "~/components/language-switcher";
import { LoginForm } from "~/components/login-form";
import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";

const BRAND_NAME = "Nexa Support";

function BrandedLoginTitle({ title }: { title: string }) {
  const [beforeBrand, afterBrand] = title.split(BRAND_NAME);

  return (
    <>
      {beforeBrand}
      <span translate="no">{BRAND_NAME}</span>
      {afterBrand}
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="login-page" id="main-content" tabIndex={-1}>
      <nav aria-labelledby="demo-navigation-label" className="login-page__nav">
        <span className="visually-hidden" id="demo-navigation-label">
          <LocalizedText en="Demo navigation" zhCN="演示导航" />
        </span>
        <Link className="login-page__brand" href="/#top" translate="no">
          Nexa Support
        </Link>
        <LanguageSwitcher />
      </nav>

      <section aria-labelledby="login-title" className="login-card">
        <div aria-hidden="true" className="login-card__index">
          N—DEMO
        </div>
        <p className="section-kicker">
          <span aria-hidden="true">00</span>
          <LocalizedText en="Demo access" zhCN="演示入口" />
        </p>
        <h1 id="login-title">
          <LocalizedText
            en={<BrandedLoginTitle title={catalog.en.login.title} />}
            zhCN={<BrandedLoginTitle title={catalog["zh-CN"].login.title} />}
          />
        </h1>
        <p className="login-card__description">
          <LocalizedText
            en={catalog.en.login.description}
            zhCN={catalog["zh-CN"].login.description}
          />
        </p>
        <LoginForm />
        <div className="login-card__notice">
          <span aria-hidden="true">↳</span>
          <p>
            <LocalizedText
              en="No account data is requested or stored on this page."
              zhCN="此页面不会请求或存储任何账户数据。"
            />
          </p>
        </div>
        <Link className="button button--quiet" href="/#top">
          <span aria-hidden="true">←</span>
          <LocalizedText
            en={catalog.en.login.backToHome}
            zhCN={catalog["zh-CN"].login.backToHome}
          />
        </Link>
      </section>

      <p className="login-page__footnote">
        <LocalizedText
          en="Authentication arrives in a later product issue."
          zhCN="认证功能将在后续产品任务中实现。"
        />
      </p>
    </main>
  );
}
