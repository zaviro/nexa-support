# Feature Stories and Support Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage explain AI answers, human takeover, and support analytics through three localized code-native interface visuals and an ordered visitor-question → AI-answer → human-takeover workflow.

**Architecture:** Replace the static feature ledger in `MarketingHome` with one focused client component, `FeatureWorkflowSection`, which reads the already-selected `locale` and a new typed `featureWorkflow` catalog branch. Keep all fixture content, cards, and lightweight SVG/CSS visualizations local to the component; it introduces no routes, API calls, persistence, credentials, third-party images, or product state. Extend the existing public Playwright marketing journey to verify the visible English and Simplified Chinese content, semantic workflow order, keyboard-safe landmarks, and 375px/768px/1440px layout bounds.

**Tech Stack:** Next.js App Router, React 19, TypeScript, existing locale provider/catalog, CSS, inline SVG, Vitest + Testing Library, Playwright, axe-playwright.

## Global Constraints

- Build a local fictional portfolio demo only: no AI/network requests, authentication, persistence, analytics, databases, payments, or third-party product screenshots.
- Use original semantic React, CSS, and lightweight inline SVG primitives; do not copy Intercom logos, copy, illustrations, customer identities, or interface assets.
- The section must present exactly these concepts: AI answers, human takeover, and support analytics; each gets a localized title, one-sentence explanation, and distinct interface visual.
- The workflow must visibly communicate this exact order: visitor question, AI answer, human takeover.
- Use the existing single locale preference and render copy from `catalog[locale]`; do not add a second switcher, locale route, or side-by-side/bilingual feature copy.
- Preserve the existing page hierarchy, dashboard, hero outcomes (`70%`, `24/7`, `30 seconds`), header/footer navigation, and `/login` route.
- Meet WCAG 2.2 AA intent: semantic headings/sections, meaningful text alternatives for non-decorative visual information, decorative SVGs hidden from assistive technology, visible focus, contrast-safe colors, and `prefers-reduced-motion` support.
- Make every layout safe at 375px, 768px, and 1440px with no horizontal page overflow; any future interactive control must be keyboard-operable and at least 44px high.
- Do not modify the existing dirty `graphify-out/.graphify_learning.json`, `graphify-out/reflections/LESSONS.md`, or `graphify-out/memory/` learning file. Run `graphify update .` only after code changes and stage only generated graph files that do not overlap those protected dirty files.
- Completion requires a fresh `devenv test --no-tui` run; do not rely on the earlier handoff evidence.

---

## File Structure

- Create `src/components/feature-workflow.tsx` — the localized section composition, three original visual primitives, and the semantic three-step workflow.
- Create `src/components/feature-workflow.test.tsx` — focused observable-content tests for the default English render and the selected Simplified Chinese render.
- Modify `src/components/marketing-home.tsx` — replace only the current `#features` static ledger with `<FeatureWorkflowSection />`, keeping the anchor and its position between the dashboard and pricing.
- Modify `src/i18n/catalog.ts` — add a typed `featureWorkflow` branch to `SiteCopy` with all English and Simplified Chinese headings, one-sentence feature descriptions, visual labels, and workflow step text.
- Modify `src/styles/globals.css` — replace the obsolete `.feature-ledger` / `.feature-row*` rules with responsive feature-story and workflow styles plus reduced-motion coverage.
- Modify `tests/e2e/marketing-journey.spec.ts` — assert the public feature content, English/Chinese workflow order, accessibility scan scope, and no-overflow bounds at the three required viewports.

## Task 1: Ship localized feature stories and the support workflow

**Files:**
- Create: `src/components/feature-workflow.tsx`
- Create: `src/components/feature-workflow.test.tsx`
- Modify: `src/components/marketing-home.tsx`
- Modify: `src/i18n/catalog.ts`
- Modify: `src/styles/globals.css`
- Modify: `tests/e2e/marketing-journey.spec.ts`

**Interfaces:**
- Consumes: `useLocale(): { locale: Locale; copy: SiteCopy; setLocale(locale: Locale): void }` from `src/i18n/locale-provider.tsx`.
- Extends: `SiteCopy` with `featureWorkflow: { eyebrow: string; title: string; description: string; stories: { aiAnswers: FeatureStoryCopy; humanTakeover: FeatureStoryCopy; analytics: FeatureStoryCopy }; workflow: { eyebrow: string; title: string; description: string; steps: readonly [WorkflowStepCopy, WorkflowStepCopy, WorkflowStepCopy] } }`, where `FeatureStoryCopy = { title: string; description: string; visualLabel: string }` and `WorkflowStepCopy = { title: string; description: string }`.
- Produces: `FeatureWorkflowSection(): JSX.Element`, a client component that renders `section#features`, three `article` feature stories, and an ordered `<ol>` workflow from `copy.featureWorkflow`.
- Public browser contract: English exposes headings `Answer with context`, `Keep the handoff human`, `See where questions land`, and ordered labels `Visitor question`, `AI answer`, `Human takeover`; Simplified Chinese exposes their catalog equivalents and no English feature-story heading is visible after the locale toggle.

- [x] **Step 1: Write the failing focused component tests**

Create `src/components/feature-workflow.test.tsx` with one English render test and one selected-Chinese render test. Mock `useLocale` rather than testing the locale store; the component test should prove the section’s public localized output, not `localStorage` behavior already covered elsewhere.

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { catalog } from "~/i18n/catalog";
import { FeatureWorkflowSection } from "./feature-workflow";

const { useLocale } = vi.hoisted(() => ({ useLocale: vi.fn() }));

vi.mock("~/i18n/locale-provider", () => ({ useLocale }));

describe("FeatureWorkflowSection", () => {
  test("shows three English feature stories and the ordered workflow", () => {
    useLocale.mockReturnValue({ locale: "en", copy: catalog.en });
    render(<FeatureWorkflowSection />);

    const section = screen.getByRole("region", {
      name: "Support that follows the question",
    });
    expect(within(section).getAllByRole("article")).toHaveLength(3);
    expect(within(section).getByRole("heading", { name: "Answer with context", level: 3 })).toBeVisible();
    expect(within(section).getByRole("heading", { name: "Keep the handoff human", level: 3 })).toBeVisible();
    expect(within(section).getByRole("heading", { name: "See where questions land", level: 3 })).toBeVisible();
    expect(within(section).getByRole("list").getByText("Visitor question")).toBeVisible();
    expect(within(section).getByRole("list").getByText("AI answer")).toBeVisible();
    expect(within(section).getByRole("list").getByText("Human takeover")).toBeVisible();
  });

  test("renders only the selected Simplified Chinese feature copy", () => {
    useLocale.mockReturnValue({ locale: "zh-CN", copy: catalog["zh-CN"] });
    render(<FeatureWorkflowSection />);

    expect(screen.getByRole("region", { name: "让支持跟随每一个问题" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "结合上下文回答", level: 3 })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Answer with context", level: 3 })).toHaveCount(0);
    expect(screen.getByText("访客提问", { exact: true })).toBeVisible();
    expect(screen.getByText("AI 回答", { exact: true })).toBeVisible();
    expect(screen.getByText("人工接管", { exact: true })).toBeVisible();
  });
});
```

- [x] **Step 2: Run the focused component test and verify RED**

Run: `bun run test:unit -- src/components/feature-workflow.test.tsx`

Expected: FAIL because `./feature-workflow` and the `featureWorkflow` catalog branch do not exist.

- [x] **Step 3: Add the typed locale copy and the semantic component**

Add the `FeatureStoryCopy`, `WorkflowStepCopy`, and `featureWorkflow` fields to `src/i18n/catalog.ts`; populate both locales completely. Use the existing English feature titles and Chinese equivalents, retain one concise explanation per item, and use workflow labels exactly as the public contract. Keep all copy selection in `FeatureWorkflowSection` via `const { copy } = useLocale()` so only the active locale is rendered by this component.

Create `src/components/feature-workflow.tsx` as a `"use client"` component. Its outer `<section id="features" aria-labelledby="features-title" className="feature-workflow">` contains a heading block, then three `<article>` stories in this fixed order: AI answers, human takeover, analytics. Give each story an `h3`, exactly one description paragraph, and an adjacent visual with a visible text label plus an inline `svg aria-hidden="true"`:

```tsx
const stories = [
  { key: "aiAnswers", visual: <AnswerVisual /> },
  { key: "humanTakeover", visual: <HandoffVisual /> },
  { key: "analytics", visual: <AnalyticsVisual /> },
] as const;
```

Implement original, non-interactive visual primitives: an answer card with question-to-answer connector, a handoff card with a clearly labelled escalation queue and teammate avatar initials, and a small analytics card with CSS metric bars plus a lightweight SVG trend line. Use fictional labels and numeric values only. For visual labels that repeat the story title, use visible text rather than inaccessible icon-only meaning; mark paths, circles, and decorative connector SVGs `aria-hidden="true"`.

After the stories, add a workflow subsection with its own `h3` and a native `<ol className="feature-workflow__steps">`. Render `copy.featureWorkflow.workflow.steps` in catalog order, assigning visual step numbers `01`, `02`, and `03` with `aria-hidden="true"`. Do not create buttons, state, API seams, or a fourth marketing route.

- [x] **Step 4: Compose the section and implement responsive, motion-safe styling**

In `src/components/marketing-home.tsx`, import `FeatureWorkflowSection` and replace the whole existing static `.features-section` / `.feature-ledger` block with `<FeatureWorkflowSection />`. Do not change the adjacent dashboard, pricing, footer, or chat shell.

In `src/styles/globals.css`, remove the obsolete `.feature-ledger`, `.feature-row`, `.feature-row__number`, `.feature-row__tag`, and their narrow-screen overrides. Add focused styles for:

```css
.feature-workflow { /* section width, border, and responsive vertical rhythm */ }
.feature-workflow__stories { /* three-story grid; one column below 68rem */ }
.feature-workflow__story { /* article grid with copy and its code-native visual */ }
.feature-workflow__visual { /* bounded surface; min-width: 0; overflow: clip */ }
.feature-workflow__steps { /* ordered three-step grid; one column below 48rem */ }
```

Use `minmax(0, …)` grid columns and `min-width: 0` on text/visual children; do not use fixed widths that exceed the mobile viewport. At 375px stack a story’s visual below its copy, preserve readable labels, and keep the workflow order top-to-bottom. At 768px retain generous spacing without a horizontal strip. At 1440px show the three stories as a deliberate editorial grid with varied visual surface treatments, not three cloned cards. Put any hover/transition rules behind the existing `@media (prefers-reduced-motion: no-preference)` pattern and retain a stable non-animated state when motion is reduced.

- [x] **Step 5: Run focused tests and static checks to verify GREEN**

Run: `bun run test:unit -- src/components/feature-workflow.test.tsx`

Expected: both localized component tests pass.

Run: `bun run check && bun run typecheck`

Expected: both commands exit 0 with no formatting or TypeScript errors.

- [x] **Step 6: Add failing public browser assertions, then make them pass**

Extend `tests/e2e/marketing-journey.spec.ts` with a browser-level test that uses the public section landmark and ordered list rather than CSS classes:

```ts
test("explains the three support capabilities in workflow order", async ({ page }) => {
  await page.goto("/");
  const features = page.getByRole("region", {
    name: "Support that follows the question",
  });

  await expect(features.getByRole("article")).toHaveCount(3);
  await expect(features.getByRole("heading", { name: "Answer with context", level: 3 })).toBeVisible();
  await expect(features.getByRole("heading", { name: "Keep the handoff human", level: 3 })).toBeVisible();
  await expect(features.getByRole("heading", { name: "See where questions land", level: 3 })).toBeVisible();
  await expect(features.getByRole("list").getByRole("listitem")).toHaveText([
    /Visitor question/,
    /AI answer/,
    /Human takeover/,
  ]);
});
```

In the existing Simplified Chinese locale journey, assert the Chinese `#features` region, one Chinese feature heading, and the three ordered Chinese workflow labels; assert the English feature heading has count zero after toggling. In the existing 375px/768px/1440px viewport loop, assert the `#features` bounding box has `x >= 0` and `x + width <= viewport width`, then run the existing axe scan with the completed section on the page. Do not inspect internal CSS classes or SVG path data.

Run: `bun run test:e2e -- --grep "three support capabilities"`

Expected: FAIL before the component and public labels exist, then PASS after Steps 3–4 and the assertions match the finished accessible UI.

Run: `bun run test:e2e`

Expected: both desktop Chromium and mobile Chromium projects pass, including the feature-flow locale and viewport evidence.

- [x] **Step 7: Update the graph and commit the independently testable deliverable**

Run: `graphify update .`

Expected: the code graph updates successfully without editing the protected dirty graphify learning files.

Review `git status --short` before staging. The graph update is required for repository freshness, but leave every pre-existing graphify learning artifact unstaged; do not stage `graphify-out/.graphify_learning.json`, `graphify-out/reflections/LESSONS.md`, or `graphify-out/memory/query_20260726_093246_how_should_devenv__bun__codex_agent_skills__global.md`.

```bash
git add src/components/feature-workflow.tsx src/components/feature-workflow.test.tsx src/components/marketing-home.tsx src/i18n/catalog.ts src/styles/globals.css tests/e2e/marketing-journey.spec.ts
git commit -m "feat: add localized support feature workflow"
```

## Independent Review Gate

- [ ] Request an independent code review after Task 1 using `requesting-code-review`; give the reviewer Issue #5’s acceptance criteria, this plan, the staged diff, and the fresh focused test/browser outputs.
- [ ] Require the reviewer to verify: all three distinct original visuals exist; no real service, secret, route, or persistence was introduced; active-locale-only feature copy is used; `<ol>` order is visitor question → AI answer → human takeover; landmarks and SVG semantics are correct; and the feature layout cannot overflow at 375px, 768px, or 1440px.
- [ ] If feedback is actionable, use `receiving-code-review` and verify each claim against the code/tests before changing it. For any failure or unexpected browser result, use `systematic-debugging` before a fix, then rerun the smallest failed command followed by the affected Playwright test.

## Final Verification

- [ ] Run the canonical fresh gate only after the review gate is resolved:

```bash
devenv test --no-tui
```

Expected: frozen install, configuration validation, Biome, TypeScript, Vitest, production build, and desktop/mobile Chromium Playwright all exit 0.

- [ ] Record the command’s exit status and the mobile Chromium feature-flow evidence in the issue/PR handoff. Do not claim Issue #5 is complete if the full gate has not passed in the current workspace.

## Plan Self-Review

- Spec coverage: Task 1 maps every Issue #5 acceptance criterion to a localized feature story, a distinct code-native visual, an ordered workflow, semantic responsive markup, and English/Chinese browser assertions. The global constraints preserve the portfolio-demo boundaries and single locale behavior.
- Placeholder scan: no unresolved placeholders or unspecified test steps remain; all implementation and verification actions name concrete files, contracts, commands, and expected results.
- Interface consistency: `FeatureWorkflowSection` consumes the existing `useLocale` return shape, its `featureWorkflow` fields are defined in `SiteCopy`, and the browser tests target the section’s public role, headings, and list order.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-26-feature-workflow.md`. Two execution options:

1. Subagent-Driven (recommended) — dispatch a fresh subagent for Task 1, then conduct the independent review and final verification gates.
2. Inline Execution — execute Task 1 in the current session using `executing-plans`, with the review gate and full verification afterward.
