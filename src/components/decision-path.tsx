"use client";

import Link from "next/link";
import { useState } from "react";
import { catalog } from "~/i18n/catalog";
import { LocalizedText } from "~/i18n/localized-text";

export function DecisionPath() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const enDecisionPath = catalog.en.decisionPath;
  const zhCNDecisionPath = catalog["zh-CN"].decisionPath;

  return (
    <>
      <section
        aria-labelledby="testimonials-title"
        className="editorial-section testimonials-section"
      >
        <div className="section-heading">
          <h2 id="testimonials-title">
            <LocalizedText
              en={enDecisionPath.testimonialsTitle}
              zhCN={zhCNDecisionPath.testimonialsTitle}
            />
          </h2>
        </div>
        <div className="testimonial-ledger">
          {enDecisionPath.testimonials.map((testimonial, index) => {
            const zhCNTestimonial = zhCNDecisionPath.testimonials[index];

            return (
              <figure className="testimonial" key={testimonial.attribution}>
                <figcaption>
                  <LocalizedText
                    en={enDecisionPath.testimonialLabel}
                    zhCN={zhCNDecisionPath.testimonialLabel}
                  />
                </figcaption>
                <blockquote>
                  <LocalizedText
                    en={testimonial.quote}
                    zhCN={zhCNTestimonial?.quote ?? ""}
                  />
                </blockquote>
                <p>
                  <LocalizedText
                    en={testimonial.attribution}
                    zhCN={zhCNTestimonial?.attribution ?? ""}
                  />
                </p>
              </figure>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="pricing-title"
        className="editorial-section pricing-section"
        id="pricing"
      >
        <div className="section-heading">
          <p className="section-kicker">
            <LocalizedText
              en={enDecisionPath.pricing.eyebrow}
              zhCN={zhCNDecisionPath.pricing.eyebrow}
            />
          </p>
          <h2 id="pricing-title">
            <LocalizedText
              en={enDecisionPath.pricing.title}
              zhCN={zhCNDecisionPath.pricing.title}
            />
          </h2>
          <p>
            <LocalizedText
              en={enDecisionPath.pricing.description}
              zhCN={zhCNDecisionPath.pricing.description}
            />
          </p>
        </div>
        <div className="pricing-ledger">
          {enDecisionPath.pricing.plans.map((plan, index) => {
            const zhCNPlan = zhCNDecisionPath.pricing.plans[index];

            return (
              <article
                className={
                  plan.name === "Pro"
                    ? "price-plan--featured price-plan"
                    : "price-plan"
                }
                key={plan.name}
              >
                <div className="price-plan__heading">
                  <h3>{plan.name}</h3>
                  <span>
                    <LocalizedText
                      en={plan.audience}
                      zhCN={zhCNPlan?.audience ?? ""}
                    />
                  </span>
                </div>
                <p className="price-plan__price">
                  <strong>{plan.price}</strong>
                  <span>
                    <LocalizedText
                      en={enDecisionPath.pricing.monthlySuffix}
                      zhCN={zhCNDecisionPath.pricing.monthlySuffix}
                    />
                  </span>
                </p>
                <p>
                  <LocalizedText
                    en={plan.description}
                    zhCN={zhCNPlan?.description ?? ""}
                  />
                </p>
                <Link
                  className={`button ${plan.name === "Pro" ? "button--paper" : "button--outline"}`}
                  href="/login"
                >
                  <LocalizedText en={plan.cta} zhCN={zhCNPlan?.cta ?? ""} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="faq-title"
        className="editorial-section faq-section"
      >
        <div className="section-heading">
          <p className="section-kicker">
            <LocalizedText
              en={enDecisionPath.faq.eyebrow}
              zhCN={zhCNDecisionPath.faq.eyebrow}
            />
          </p>
          <h2 id="faq-title">
            <LocalizedText
              en={enDecisionPath.faq.title}
              zhCN={zhCNDecisionPath.faq.title}
            />
          </h2>
        </div>
        <div className="faq-list">
          {enDecisionPath.faq.items.map((item, index) => {
            const zhCNItem = zhCNDecisionPath.faq.items[index];
            const expanded = expandedId === item.id;

            return (
              <article className="faq-item" key={item.id}>
                <h3>
                  <button
                    aria-controls={`faq-answer-${item.id}`}
                    aria-expanded={expanded}
                    id={`faq-question-${item.id}`}
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    type="button"
                  >
                    <LocalizedText
                      en={item.question}
                      zhCN={zhCNItem?.question ?? ""}
                    />
                    <span aria-hidden="true" className="faq-item__indicator">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {expanded ? (
                  <section
                    aria-labelledby={`faq-question-${item.id}`}
                    id={`faq-answer-${item.id}`}
                  >
                    <LocalizedText
                      en={item.answer}
                      zhCN={zhCNItem?.answer ?? ""}
                    />
                  </section>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
