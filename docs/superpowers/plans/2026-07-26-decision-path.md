# Decision Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an honest, localized testimonial, pricing, and accessible FAQ decision path to the Nexa Support homepage.

**Architecture:** Keep `MarketingHome` as the server-rendered homepage composition and replace its current static pricing block with one focused client `DecisionPath` component. That component reads the existing locale context, owns only the currently expanded FAQ id in memory, and uses the typed catalog for every locale-specific string; no request, storage, payment, authentication, or network boundary is introduced.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Vitest/Testing Library (existing suite), Playwright, axe-playwright, Bun, devenv.

## Global Constraints

- This is a local portfolio demo: do not add real services, payments, authentication, network calls, analytics, secret handling, databases, or persistence.
- Keep exactly one destination-named English / Simplified Chinese language-toggle button; only one locale may be visible and accessibility-exposed at once.
- Use original Nexa Support content only; fictional customer evidence must visibly say `Demo testimonial` in English and `演示评价` in Simplified Chinese.
- Display only `Starter` at `¥99/month` and `Pro` at `¥299/month`; do not add an annual toggle, calculator, checkout, discounts, hidden price mechanics, or contractual claims.
- Both pricing CTAs must be normal links to `/login` (the existing local placeholder route).
- The five FAQ topics are AI answers, human takeover, deployment, refunds, and data privacy; disclose the local-demo boundary rather than implying live policy, data processing, or service commitments.
- FAQ controls must be native `button` elements with `aria-expanded`, `aria-controls`, visible `:focus-visible` styling, Enter/Space keyboard operation, and only the selected answer visibly rendered.
- Preserve the existing WCAG 2.2 AA, `prefers-reduced-motion`, 44px target, and no-horizontal-overflow requirements at 375px, 768px, and 1440px.
- Full completion verification is exactly one fresh `devenv test --no-tui` run after the independent code review and any resulting changes.

## File Structure

- Create: `src/components/decision-path.tsx` — locale-aware, in-memory FAQ accordion plus the testimonials and two fixed pricing plans.
- Modify: `src/components/marketing-home.tsx` — compose `DecisionPath` after the feature narrative and remove the duplicated static pricing section.
- Modify: `src/i18n/catalog.ts` — add the complete typed English and Simplified Chinese decision-path copy, including disclosures, price labels, CTA labels, and FAQ ids/questions/answers.
- Modify: `src/styles/globals.css` — add responsive testimonial, price, and FAQ styles that preserve current editorial tokens and expose focused FAQ controls.
- Modify: `tests/e2e/marketing-journey.spec.ts` — assert the truthful decision path, localized disclosure, CTA destinations, observable keyboard accordion transition, accessibility scan, mobile controls, and viewport evidence.

---

### Task 1: Ship the localized trust, pricing, and FAQ decision path

**Files:**
- Create: `src/components/decision-path.tsx`
- Modify: `src/components/marketing-home.tsx:1-8, 275-362`
- Modify: `src/i18n/catalog.ts:3-59, 135-139, 215-219`
- Modify: `src/styles/globals.css:909-990, 1238-1420`
- Modify: `tests/e2e/marketing-journey.spec.ts:1-20, after the English journey test, before the viewport matrix`

**Interfaces:**
- Consumes: `useLocale(): { locale: Locale; copy: SiteCopy; setLocale(locale: Locale): void }` from `src/i18n/locale-provider.tsx` and Next `Link` for local `/login` navigation.
- Produces: `DecisionPath(): React.JSX.Element`, rendered by `MarketingHome`; it exposes `#pricing`, a `Pricing`/`价格` heading, two `/login` links, and five `button` controls whose ids are `faq-question-${id}` and whose answer regions are `faq-answer-${id}`.
- Extends: `SiteCopy` with `decisionPath: { testimonialLabel: string; testimonialsTitle: string; testimonials: readonly { quote: string; attribution: string }[]; pricing: { eyebrow: string; title: string; description: string; monthlySuffix: string; plans: readonly { name: "Starter" | "Pro"; audience: string; description: string; price: "¥99" | "¥299"; cta: string }[] }; faq: { eyebrow: string; title: string; items: readonly { id: "ai-answers" | "human-takeover" | "deployment" | "refunds" | "data-privacy"; question: string; answer: string }[] } }`.

- [x] **Step 1: Write the failing end-to-end decision-path journey**

  Add this test to `tests/e2e/marketing-journey.spec.ts`; it intentionally expects markup and behavior that do not yet exist:

  ```ts
  test("shows truthful localized decision information and an observable FAQ accordion", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Demo testimonial", { exact: true })).toHaveCount(2);
    await expect(page.getByText("¥99", { exact: true })).toBeVisible();
    await expect(page.getByText("¥299", { exact: true })).toBeVisible();
    await expect(page.getByText("/ month", { exact: true })).toHaveCount(2);
    const pricing = page.locator("#pricing");
    const pricingLinks = pricing.getByRole("link", {
      name: "Start free",
      exact: true,
    });
    await expect(pricingLinks).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(pricingLinks.nth(index)).toHaveAttribute("href", "/login");
    }

    const aiAnswer = page.getByRole("button", {
      name: "How does Nexa answer questions?",
      exact: true,
    });
    await expect(aiAnswer).toHaveAttribute("aria-expanded", "false");
    await aiAnswer.focus();
    await page.keyboard.press("Enter");
    await expect(aiAnswer).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#faq-answer-ai-answers")).toBeVisible();
    await expect(aiAnswer).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Space");
    await expect(aiAnswer).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#faq-answer-ai-answers")).toHaveCount(0);

    await page.getByRole("button", { name: "简体中文", exact: true }).click();
    await expect(page.getByText("演示评价", { exact: true })).toHaveCount(2);
    await expect(page.getByRole("heading", { name: "常见问题", level: 2 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Nexa 如何回答问题？" })).toBeVisible();

    const chinesePricingLinks = page.locator("#pricing").getByRole("link", {
      name: "免费试用",
      exact: true,
    });
    await expect(chinesePricingLinks).toHaveCount(2);
    for (let index = 0; index < 2; index += 1) {
      await expect(chinesePricingLinks.nth(index)).toHaveAttribute("href", "/login");
    }
  });
  ```

- [x] **Step 2: Run the focused test and verify it fails for the missing decision path**

  Run: `bun run test:e2e -- --project=chromium --grep "truthful localized decision information"`

  Expected: FAIL because no `Demo testimonial` disclosure or FAQ button exists yet.

- [x] **Step 3: Add the typed localized decision-path content**

  Extend `SiteCopy` and both `catalog` entries with the exact `decisionPath` shape above. Use two clearly fictional attributions (for example, `A. Rivera · Fictional product lead` / `A. Rivera · 虚构产品负责人` and `M. Zhou · Fictional support manager` / `M. Zhou · 虚构客服经理`) and the two disclosure labels exactly as specified in Global Constraints. Give every plan an explicit monthly suffix from the catalog and give every FAQ an id from the union type; English questions must include `How does Nexa answer questions?`, and its Chinese equivalent must be `Nexa 如何回答问题？`.

- [x] **Step 4: Implement the isolated local interaction and compose it into the homepage**

  Create `src/components/decision-path.tsx` as a client component. Initialize `const [expandedId, setExpandedId] = useState<string | null>(null);`, map the localized fixtures, and make each question button toggle its own id:

  ```tsx
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
        <section aria-labelledby="testimonials-title" className="editorial-section testimonials-section">
          <div className="section-heading">
            <p className="section-kicker">{decisionPath.testimonialLabel}</p>
            <h2 id="testimonials-title">{decisionPath.testimonialsTitle}</h2>
          </div>
          <div className="testimonial-ledger">
            {decisionPath.testimonials.map((testimonial) => (
              <figure key={testimonial.attribution} className="testimonial">
                <figcaption>{decisionPath.testimonialLabel}</figcaption>
                <blockquote>{testimonial.quote}</blockquote>
                <p>{testimonial.attribution}</p>
              </figure>
            ))}
          </div>
        </section>
        <section aria-labelledby="pricing-title" className="editorial-section pricing-section" id="pricing">
          <div className="section-heading"><h2 id="pricing-title">{decisionPath.pricing.title}</h2></div>
          <div className="pricing-ledger">
            {decisionPath.pricing.plans.map((plan) => (
              <article key={plan.name} className="price-plan">
                <h3>{plan.name}</h3>
                <p className="price-plan__price"><strong>{plan.price}</strong><span>{decisionPath.pricing.monthlySuffix}</span></p>
                <p>{plan.description}</p>
                <Link className="button button--outline" href="/login">{plan.cta}</Link>
              </article>
            ))}
          </div>
        </section>
        <section aria-labelledby="faq-title" className="editorial-section faq-section">
          <div className="section-heading"><h2 id="faq-title">{decisionPath.faq.title}</h2></div>
          <div className="faq-list">
            {decisionPath.faq.items.map((item) => {
              const expanded = expandedId === item.id;
              return <article key={item.id} className="faq-item">
                <h3><button aria-controls={`faq-answer-${item.id}`} aria-expanded={expanded} id={`faq-question-${item.id}`} onClick={() => setExpandedId(expanded ? null : item.id)} type="button">{item.question}</button></h3>
                {expanded ? <div aria-labelledby={`faq-question-${item.id}`} id={`faq-answer-${item.id}`}>{item.answer}</div> : null}
              </article>;
            })}
          </div>
        </section>
      </>
    );
  }
  ```

  Replace the existing static `<section id="pricing">` in `MarketingHome` with `<DecisionPath />`; do not leave duplicate `pricing-title` or `#pricing` landmarks.

- [x] **Step 5: Style and make the interaction responsive without creating a fake transaction flow**

  In `src/styles/globals.css`, reuse `--surface`, `--evergreen`, `--ink`, `--line`, the existing editorial grid, and the current `.pricing-ledger` / `.price-plan` visual language. Add `.testimonial-ledger`, `.testimonial`, `.faq-section`, `.faq-list`, `.faq-item`, and `.faq-item button` rules. Make FAQ buttons full-width with at least 44px height, `text-align: left`, `touch-action: manipulation`, and an explicit 3px `:focus-visible` outline. At `max-width: 34rem`, stack testimonial and pricing columns; at 375px, 768px, and 1440px ensure the FAQ answer and both price cards remain inside the document viewport. Keep all answer expansion immediate under `prefers-reduced-motion: reduce`.

- [x] **Step 6: Make the focused browser test pass and add mobile evidence**

  Run: `bun run test:e2e -- --project=chromium --grep "truthful localized decision information"`

  Expected: PASS; it verifies the English and Chinese disclosures, both fixed prices, `/login` pricing CTA targets, FAQ `aria-expanded` state, Enter/Space behavior, answer visibility, and focus outline.

  Then add a mobile assertion to the existing 375px section of `tests/e2e/marketing-journey.spec.ts` that checks every visible `.faq-item button` is at least 44px in both dimensions and that `document.documentElement.scrollWidth <= window.innerWidth`. Run: `bun run test:e2e -- --project="Mobile Chrome" --grep "truthful localized decision information|keeps visible Chinese controls|marketing shell inside the viewport at 375px"`

  Expected: PASS and Playwright output records passing Mobile Chrome evidence for the interactive accordion, targets, and no-overflow condition.

- [ ] **Step 7: Review the completed task once, then run the single full quality gate**

  Use `requesting-code-review` for this one task and provide the reviewer the Issue #6 acceptance criteria, the changed-file list, and the focused Playwright output. Address only concrete findings, using `receiving-code-review` and `systematic-debugging` if a finding identifies a defect. Do not request another independent review after fixes.

  Run once, after review changes are complete: `devenv test --no-tui`

  Expected: exit code 0 after frozen install, formatting, types, unit tests, production build, desktop Chromium, and Mobile Chrome Playwright projects. Its Mobile Chrome output is the final browser evidence for Issue #6.

- [x] **Step 8: Update the graph and commit the independently testable task**

  Run: `graphify update .`

  Expected: the project graph reflects the new decision-path component and its relationships without introducing product behavior outside the local demo.

  ```bash
  git add src/components/decision-path.tsx src/components/marketing-home.tsx src/i18n/catalog.ts src/styles/globals.css tests/e2e/marketing-journey.spec.ts docs/superpowers/plans/2026-07-26-decision-path.md graphify-out
  git commit -m "feat: complete homepage decision path"
  ```

## Self-Review

- Spec coverage: Task 1 covers two localized, visibly disclosed fictional testimonials; the exact two monthly plans; `/login` CTAs; all five required FAQ subjects; keyboard and expanded-state behavior; focused and mobile browser evidence; one review; and the final canonical gate.
- Placeholder scan: No TBD/TODO/implementation-later placeholders are present; all test, data, component, styling, review, verification, and graph-update instructions are concrete.
- Type consistency: `DecisionPath` consumes the existing locale hook, `SiteCopy.decisionPath` is the source of all localized content, and FAQ `id` is consistently used in state, DOM ids, and Playwright selectors.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-26-decision-path.md`. Execute this one task with the existing issue workflow: one independent code review, then one final `devenv test --no-tui` verification run.
