"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "~/i18n/locale-provider";

export function DecisionPath() {
  const { copy } = useLocale();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { decisionPath } = copy;

  return (
    <>
      <section
        aria-labelledby="testimonials-title"
        className="editorial-section testimonials-section"
      >
        <div className="section-heading">
          <h2 id="testimonials-title">{decisionPath.testimonialsTitle}</h2>
        </div>
        <div className="testimonial-ledger">
          {decisionPath.testimonials.map((testimonial) => (
            <figure className="testimonial" key={testimonial.attribution}>
              <figcaption>{decisionPath.testimonialLabel}</figcaption>
              <blockquote>{testimonial.quote}</blockquote>
              <p>{testimonial.attribution}</p>
            </figure>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="pricing-title"
        className="editorial-section pricing-section"
        id="pricing"
      >
        <div className="section-heading">
          <p className="section-kicker">{decisionPath.pricing.eyebrow}</p>
          <h2 id="pricing-title">{decisionPath.pricing.title}</h2>
          <p>{decisionPath.pricing.description}</p>
        </div>
        <div className="pricing-ledger">
          {decisionPath.pricing.plans.map((plan) => (
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
                <span>{plan.audience}</span>
              </div>
              <p className="price-plan__price">
                <strong>{plan.price}</strong>
                <span>{decisionPath.pricing.monthlySuffix}</span>
              </p>
              <p>{plan.description}</p>
              <Link
                className={`button ${plan.name === "Pro" ? "button--paper" : "button--outline"}`}
                href="/login"
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="faq-title"
        className="editorial-section faq-section"
      >
        <div className="section-heading">
          <p className="section-kicker">{decisionPath.faq.eyebrow}</p>
          <h2 id="faq-title">{decisionPath.faq.title}</h2>
        </div>
        <div className="faq-list">
          {decisionPath.faq.items.map((item) => {
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
                    {item.question}
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
                    {item.answer}
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
