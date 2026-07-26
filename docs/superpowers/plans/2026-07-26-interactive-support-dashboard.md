# Interactive Support Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a code-native, bilingual support dashboard whose visible conversation state changes through a useful local interaction and remains legible at 375px, 768px, and 1440px.

**Architecture:** A focused client component owns the selected conversation and queue filter while immutable fixture data and locale-aware labels remain in a separate module. `MarketingHome` composes the dashboard between the headline outcomes and feature narrative. Playwright verifies the public state transition and viewport invariants; Vitest verifies fixture selection behavior without coupling to React internals.

**Tech Stack:** Next.js App Router, React 19, TypeScript, localized catalog data, CSS, lightweight inline SVG, Vitest, Testing Library, Playwright.

## Global Constraints

- Use only semantic React, CSS, and lightweight SVG primitives; do not use a flattened product screenshot.
- Use local fictional fixture data only; do not add a server, database, analytics, or persistence.
- Preserve the agreed `70% automated`, `24/7 online`, and `30-second deployment` outcomes.
- Provide English and Simplified Chinese visible copy and accessible labels through the existing single locale control.
- Keep the page free of horizontal overflow at 375px, 768px, and 1440px.
- Browser tests must assert a visible dashboard state change, not component structure or implementation details.

---

### Task 1: Dashboard fixture and selection model

**Files:**
- Create: `src/components/support-dashboard-data.ts`
- Create: `src/components/support-dashboard-data.test.ts`

**Interfaces:**
- Produces: `DashboardQueue = "all" | "ai" | "human"`
- Produces: `DashboardConversation` with `id`, `customer`, `topic`, `queue`, `waitTime`, localized `preview`, localized `summary`, and localized `status`
- Produces: `dashboardConversations: readonly DashboardConversation[]`
- Produces: `filterDashboardConversations(queue: DashboardQueue): readonly DashboardConversation[]`

- [ ] **Step 1: Write the failing fixture behavior tests**

```ts
import { describe, expect, test } from "vitest";
import {
  dashboardConversations,
  filterDashboardConversations,
} from "./support-dashboard-data";

describe("support dashboard data", () => {
  test("filters the visible inbox by queue", () => {
    expect(filterDashboardConversations("human").map(({ id }) => id)).toEqual([
      "conv-refund",
    ]);
  });

  test("provides bilingual details for every conversation", () => {
    for (const conversation of dashboardConversations) {
      expect(conversation.preview.en).not.toBe("");
      expect(conversation.preview["zh-CN"]).not.toBe("");
      expect(conversation.summary.en).not.toBe("");
      expect(conversation.summary["zh-CN"]).not.toBe("");
    }
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `bun run test:unit -- src/components/support-dashboard-data.test.ts`

Expected: FAIL because `support-dashboard-data` does not exist.

- [ ] **Step 3: Implement the minimal typed fixture model**

Create three realistic conversations covering billing, product setup, and a refund handoff. Implement `filterDashboardConversations` as:

```ts
export function filterDashboardConversations(queue: DashboardQueue) {
  return queue === "all"
    ? dashboardConversations
    : dashboardConversations.filter(
        (conversation) => conversation.queue === queue,
      );
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `bun run test:unit -- src/components/support-dashboard-data.test.ts`

Expected: 2 tests pass with no warnings.

- [ ] **Step 5: Commit the model**

```bash
git add src/components/support-dashboard-data.ts src/components/support-dashboard-data.test.ts
git commit -m "feat: add support dashboard fixtures"
```

### Task 2: Interactive bilingual dashboard

**Files:**
- Create: `src/components/support-dashboard.tsx`
- Modify: `src/components/marketing-home.tsx`
- Modify: `src/i18n/catalog.ts`
- Modify: `src/styles/globals.css`
- Create: `src/components/support-dashboard.test.tsx`

**Interfaces:**
- Consumes: `dashboardConversations` and `filterDashboardConversations(queue)`
- Produces: `SupportDashboard(): JSX.Element`
- Behavior: queue tabs update the visible conversation list; selecting a conversation updates the visible detail heading, summary, status, and activity visualization

- [ ] **Step 1: Write the failing component interaction test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { SupportDashboard } from "./support-dashboard";

describe("SupportDashboard", () => {
  test("updates visible details when a conversation is selected", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <SupportDashboard />
      </LocaleProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open Maya Chen conversation" }),
    );

    expect(
      screen.getByRole("heading", { name: "Refund request", level: 3 }),
    ).toBeVisible();
    expect(screen.getByText("Waiting for a teammate")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the component test and verify RED**

Run: `bun run test:unit -- src/components/support-dashboard.test.tsx`

Expected: FAIL because `SupportDashboard` does not exist.

- [ ] **Step 3: Implement the semantic client component**

Use a labelled `<section>`, a tab-like group of native `<button>` filters, an inbox `<ul>`, selectable conversation `<button>` controls, a detail `<article aria-live="polite">`, metric cards, and a decorative inline `<svg aria-hidden="true">`. Read `locale` from the existing `useLocale()` provider and select localized fixture values with `localized[locale]`. Keep selected conversation valid when a filter changes by selecting the first conversation in the filtered queue.

- [ ] **Step 4: Compose and localize the dashboard**

Add a `dashboard` section to `SiteCopy` containing the section title, description, region label, queue labels, metric labels, inbox label, detail labels, and selection accessible-name template. Render `<SupportDashboard />` between `.outcomes-section` and `.features-section`. Add responsive CSS using grid at wide widths, a stacked layout below 68rem, and a horizontally wrapping filter group rather than an overflowing strip.

- [ ] **Step 5: Run focused checks and verify GREEN**

Run: `bun run test:unit -- src/components/support-dashboard.test.tsx src/components/support-dashboard-data.test.ts`

Expected: all focused tests pass.

Run: `bun run check && bun run typecheck`

Expected: both commands exit 0.

- [ ] **Step 6: Commit the dashboard**

```bash
git add src/components/support-dashboard.tsx src/components/support-dashboard.test.tsx src/components/marketing-home.tsx src/i18n/catalog.ts src/styles/globals.css
git commit -m "feat: add interactive support dashboard"
```

### Task 3: Browser behavior and responsive evidence

**Files:**
- Modify: `tests/e2e/marketing-journey.spec.ts`
- Modify: `src/styles/globals.css`

**Interfaces:**
- Consumes: the public localized dashboard controls and visible detail state
- Produces: browser evidence for selection, locale switching, accessibility, and 375px/768px/1440px overflow safety

- [ ] **Step 1: Write the failing browser journey**

```ts
test("changes the visible dashboard conversation", async ({ page }) => {
  await page.goto("/");
  const dashboard = page.getByRole("region", {
    name: "Nexa Support dashboard",
  });

  await dashboard
    .getByRole("button", { name: "Open Maya Chen conversation" })
    .click();

  await expect(
    dashboard.getByRole("heading", { name: "Refund request", level: 3 }),
  ).toBeVisible();
  await expect(dashboard.getByText("Waiting for a teammate")).toBeVisible();
});
```

Add assertions in the existing locale journey that the Chinese dashboard region and a Chinese conversation control are visible. Extend each 375px/768px/1440px viewport test to assert the dashboard bounding box stays within the viewport.

- [ ] **Step 2: Run the focused Playwright test and verify RED**

Run: `bun run test:e2e -- --grep "changes the visible dashboard conversation"`

Expected: FAIL until the final accessible names and visible state match the public contract.

- [ ] **Step 3: Adjust only public semantics and responsive CSS needed by the failing evidence**

Ensure every interactive control is at least 44px high, selected controls expose `aria-pressed`, status changes are inside the dashboard live region, and the 375px layout uses a single column without internal fixed widths.

- [ ] **Step 4: Run browser, accessibility, and full quality verification**

Run: `bun run test:e2e`

Expected: all Chromium desktop and mobile projects pass, including axe checks.

Run: `graphify update .`

Expected: graph artifacts update successfully.

Run: `devenv test --no-tui`

Expected: formatting, types, unit tests, production build, and Chromium E2E all pass.

- [ ] **Step 5: Commit browser evidence and graph update**

```bash
git add tests/e2e/marketing-journey.spec.ts src/styles/globals.css graphify-out
git commit -m "test: verify support dashboard journey"
```
