import Link from "next/link";
import { LanguageSwitcher } from "~/components/language-switcher";
import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";

export default function LoginPage() {
  return (
    <main className="login-page">
      <nav aria-label="Demo navigation" className="login-page__nav">
        <Link className="login-page__brand" href="/#top">
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
            en={catalog.en.login.title}
            zhCN={catalog["zh-CN"].login.title}
          />
        </h1>
        <p className="login-card__description">
          <LocalizedText
            en={catalog.en.login.description}
            zhCN={catalog["zh-CN"].login.description}
          />
        </p>
        <div className="login-card__notice">
          <span aria-hidden="true">↳</span>
          <p>
            <LocalizedText
              en="No account data is requested or stored on this page."
              zhCN="此页面不会请求或存储任何账户数据。"
            />
          </p>
        </div>
        <Link className="button button--signal" href="/#top">
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
