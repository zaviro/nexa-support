import Link from "next/link";
import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";
import { ChatShell } from "./chat-shell";
import { SiteHeader } from "./site-header";

function RouteMap() {
  return (
    <div aria-hidden="true" className="route-map">
      <div className="route-map__caption">
        <span className="route-map__pulse" />
        <LocalizedText en="Live support route" zhCN="实时客服路径" />
      </div>

      <svg
        className="route-map__line route-map__line--desktop"
        preserveAspectRatio="none"
        viewBox="0 0 760 420"
      >
        <title>Decorative support route</title>
        <path d="M72 98 C235 98 155 202 344 205 S482 320 694 320" />
      </svg>
      <svg
        className="route-map__line route-map__line--mobile"
        preserveAspectRatio="none"
        viewBox="0 0 320 610"
      >
        <title>Decorative support route</title>
        <path d="M62 46 C62 168 250 122 250 260 S70 355 70 492 S235 535 262 566" />
      </svg>

      <article className="route-card route-card--ask">
        <div className="route-card__meta">
          <span>01</span>
          <strong>
            <LocalizedText en="Ask" zhCN="提问" />
          </strong>
        </div>
        <p>
          <LocalizedText
            en="Can I change my plan today?"
            zhCN="我今天可以更改套餐吗？"
          />
        </p>
        <span className="route-card__source">
          <LocalizedText en="Customer" zhCN="客户" />
        </span>
      </article>

      <article className="route-card route-card--route">
        <div className="route-card__meta">
          <span>02</span>
          <strong>
            <LocalizedText en="Route" zhCN="分流" />
          </strong>
        </div>
        <p>
          <LocalizedText
            en="Plan policy found. Account context attached."
            zhCN="已找到套餐政策，并附上账户信息。"
          />
        </p>
        <span className="route-card__source">
          <LocalizedText en="Nexa AI" zhCN="Nexa AI" />
        </span>
      </article>

      <article className="route-card route-card--resolve">
        <div className="route-card__meta">
          <span>03</span>
          <strong>
            <LocalizedText en="Resolve" zhCN="解决" />
          </strong>
        </div>
        <p>
          <LocalizedText
            en="Yes. Here is the exact next step."
            zhCN="可以。以下是具体的下一步操作。"
          />
        </p>
        <span className="route-card__source">
          <LocalizedText en="Answer delivered" zhCN="答案已送达" />
        </span>
      </article>
    </div>
  );
}

export function MarketingHome() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section aria-labelledby="hero-title" className="hero-section" id="top">
          <div className="hero-section__copy">
            <p className="section-kicker">
              <span aria-hidden="true">N—01</span>
              <LocalizedText
                en="A clearer route through support"
                zhCN="更清晰的客服解决路径"
              />
            </p>
            <h1 id="hero-title">
              <LocalizedText
                en={catalog.en.hero.title}
                zhCN={catalog["zh-CN"].hero.title}
              />
            </h1>
            <p className="hero-section__description">
              <LocalizedText
                en={catalog.en.hero.description}
                zhCN={catalog["zh-CN"].hero.description}
              />
            </p>
            <div className="hero-section__actions">
              <Link className="button button--signal" href="/login">
                <LocalizedText
                  en={catalog.en.hero.primaryAction}
                  zhCN={catalog["zh-CN"].hero.primaryAction}
                />
              </Link>
              <Link className="button button--quiet" href="#features">
                <LocalizedText
                  en={catalog.en.hero.secondaryAction}
                  zhCN={catalog["zh-CN"].hero.secondaryAction}
                />
                <span aria-hidden="true">↘</span>
              </Link>
            </div>
            <p className="hero-section__note">
              <span aria-hidden="true" className="hero-section__note-mark">
                ↳
              </span>
              <LocalizedText
                en="One question. One visible path to resolution."
                zhCN="一个问题，一条清晰可见的解决路径。"
              />
            </p>
          </div>
          <RouteMap />
        </section>

        <section aria-labelledby="outcomes-title" className="outcomes-section">
          <h2 className="visually-hidden" id="outcomes-title">
            <LocalizedText
              en={catalog.en.outcomes.label}
              zhCN={catalog["zh-CN"].outcomes.label}
            />
          </h2>
          <div className="outcome">
            <strong>{catalog.en.outcomes.automated.value}</strong>
            <span>
              <LocalizedText
                en={catalog.en.outcomes.automated.label}
                zhCN={catalog["zh-CN"].outcomes.automated.label}
              />
            </span>
          </div>
          <div className="outcome">
            <strong>{catalog.en.outcomes.online.value}</strong>
            <span>
              <LocalizedText
                en={catalog.en.outcomes.online.label}
                zhCN={catalog["zh-CN"].outcomes.online.label}
              />
            </span>
          </div>
          <div className="outcome">
            <strong>
              <LocalizedText
                en={catalog.en.outcomes.deployment.value}
                zhCN={catalog["zh-CN"].outcomes.deployment.value}
              />
            </strong>
            <span>
              <LocalizedText
                en={catalog.en.outcomes.deployment.label}
                zhCN={catalog["zh-CN"].outcomes.deployment.label}
              />
            </span>
          </div>
        </section>

        <section
          aria-labelledby="features-title"
          className="editorial-section features-section"
          id="features"
        >
          <div className="section-heading">
            <p className="section-kicker">
              <span aria-hidden="true">N—02</span>
              <LocalizedText en="Product preview" zhCN="产品预览" />
            </p>
            <h2 id="features-title">
              <LocalizedText
                en={catalog.en.features.title}
                zhCN={catalog["zh-CN"].features.title}
              />
            </h2>
            <p>
              <LocalizedText
                en={catalog.en.features.description}
                zhCN={catalog["zh-CN"].features.description}
              />
            </p>
          </div>

          <div className="feature-ledger">
            <article className="feature-row">
              <span className="feature-row__number">01</span>
              <div>
                <h3>
                  <LocalizedText
                    en="Answer with context"
                    zhCN="结合上下文回答"
                  />
                </h3>
                <p>
                  <LocalizedText
                    en="Turn product knowledge into a direct, useful first response."
                    zhCN="将产品知识转化为直接、实用的首次回复。"
                  />
                </p>
              </div>
              <span className="feature-row__tag">
                <LocalizedText en="AI answer" zhCN="AI 回答" />
              </span>
            </article>
            <article className="feature-row">
              <span className="feature-row__number">02</span>
              <div>
                <h3>
                  <LocalizedText
                    en="Keep the handoff human"
                    zhCN="顺畅转接人工"
                  />
                </h3>
                <p>
                  <LocalizedText
                    en="Pass the question and its context to a teammate when judgment matters."
                    zhCN="需要人工判断时，将问题及其上下文一并交给团队成员。"
                  />
                </p>
              </div>
              <span className="feature-row__tag">
                <LocalizedText en="Handoff" zhCN="人工接管" />
              </span>
            </article>
            <article className="feature-row">
              <span className="feature-row__number">03</span>
              <div>
                <h3>
                  <LocalizedText
                    en="See where questions land"
                    zhCN="掌握问题去向"
                  />
                </h3>
                <p>
                  <LocalizedText
                    en="Give the team a readable view of recurring questions and outcomes."
                    zhCN="让团队清楚了解重复问题及其处理结果。"
                  />
                </p>
              </div>
              <span className="feature-row__tag">
                <LocalizedText en="Team view" zhCN="团队视图" />
              </span>
            </article>
          </div>
        </section>

        <section
          aria-labelledby="pricing-title"
          className="editorial-section pricing-section"
          id="pricing"
        >
          <div className="section-heading">
            <p className="section-kicker">
              <span aria-hidden="true">N—03</span>
              <LocalizedText en="Pricing preview" zhCN="价格预览" />
            </p>
            <h2 id="pricing-title">
              <LocalizedText
                en={catalog.en.pricing.title}
                zhCN={catalog["zh-CN"].pricing.title}
              />
            </h2>
            <p>
              <LocalizedText
                en={catalog.en.pricing.description}
                zhCN={catalog["zh-CN"].pricing.description}
              />
            </p>
          </div>

          <div className="pricing-ledger">
            <article className="price-plan">
              <div className="price-plan__heading">
                <h3>Starter</h3>
                <span>
                  <LocalizedText
                    en="For focused support"
                    zhCN="适合专注型客服"
                  />
                </span>
              </div>
              <p className="price-plan__price">
                <strong>¥99</strong>
                <span>
                  <LocalizedText en="/ month" zhCN="/ 月" />
                </span>
              </p>
              <p>
                <LocalizedText
                  en="A clear starting point for a growing SaaS team."
                  zhCN="为成长中的 SaaS 团队提供清晰的起点。"
                />
              </p>
              <Link className="button button--outline" href="/login">
                <LocalizedText
                  en={catalog.en.navigation.startFree}
                  zhCN={catalog["zh-CN"].navigation.startFree}
                />
              </Link>
            </article>
            <article className="price-plan price-plan--featured">
              <div className="price-plan__heading">
                <h3>Pro</h3>
                <span>
                  <LocalizedText
                    en="For a scaling team"
                    zhCN="适合扩展中的团队"
                  />
                </span>
              </div>
              <p className="price-plan__price">
                <strong>¥299</strong>
                <span>
                  <LocalizedText en="/ month" zhCN="/ 月" />
                </span>
              </p>
              <p>
                <LocalizedText
                  en="More room for teams with a growing support rhythm."
                  zhCN="为客服节奏不断增长的团队提供更多空间。"
                />
              </p>
              <Link className="button button--paper" href="/login">
                <LocalizedText
                  en={catalog.en.navigation.startFree}
                  zhCN={catalog["zh-CN"].navigation.startFree}
                />
              </Link>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__brand">
          <Link href="/#top">Nexa Support</Link>
          <p>
            <LocalizedText
              en={catalog.en.footer.promise}
              zhCN={catalog["zh-CN"].footer.promise}
            />
          </p>
        </div>
        <nav aria-label="Footer navigation" className="site-footer__nav">
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
          <Link href="/login">
            <LocalizedText
              en={catalog.en.navigation.logIn}
              zhCN={catalog["zh-CN"].navigation.logIn}
            />
          </Link>
        </nav>
        <p className="site-footer__note">
          <LocalizedText
            en="Demo experience · No customer data collected"
            zhCN="演示体验 · 不收集客户数据"
          />
        </p>
      </footer>
      <ChatShell />
    </>
  );
}
