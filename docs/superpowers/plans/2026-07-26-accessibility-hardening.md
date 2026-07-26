# Accessibility and Responsive Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the assembled Nexa Support homepage, dashboard, decision path, chat, and local login placeholder as one WCAG 2.2 AA, keyboard-usable, reduced-motion, overflow-free product journey.

**Architecture:** Keep every product surface local and preserve the existing component boundaries. Add one focused Playwright acceptance suite that drives the public English and Simplified Chinese interfaces through both configured Chromium projects at exact 375px, 768px, and 1440px widths, attaches screenshots to the Playwright report, and runs axe against opened/invalid/live states; make only the four concrete semantic, focus, and layout corrections named below. Issue #9 owns login behavior, so execution begins only after its reviewed commit is integrated into `main` and this branch is rebased onto it.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, CSS, Vitest/Testing Library, Playwright Chromium, `@axe-core/playwright`, Bun, devenv, and graphify.

## Global Constraints

- Issue #10 is blocked by Issue #9. Do not begin product or test edits from the current pre-#9 branch; wait until `agent/issue-9-login` is reviewed, freshly verified, committed, and integrated into `main`, then rebase `agent/issue-10-hardening` onto that updated `main`.
- Integrate the already-built local demo only. Do not add, call, configure, mock, or persist data through AI, authentication, sessions, API routes, server actions, databases, payments, analytics, contact collection, or any other real service.
- Preserve the existing security boundaries: chat history remains page-memory-only; the masked API-key draft is never sent, validated, logged, stored, or written to an environment file; login validation remains local and never creates a session.
- Support exactly English (`en`) and Simplified Chinese (`zh-CN`) through the existing locale catalog/provider. The language preference remains the only approved browser storage.
- Meet WCAG 2.2 AA for semantics, keyboard operation, visible focus, field errors, expanded states, live status, and text/control contrast.
- The complete `/` and `/login` surfaces must have no page-level horizontal overflow at exactly 375px, 768px, or 1440px. Do not satisfy this by clipping the page or hiding inaccessible content.
- Automated axe evidence is mandatory for both locales, including the opened FAQ/chat/settings states and invalid login state. The focused suite must report no axe violations, which is stricter than Issue #10's no-serious-violations minimum and includes automated color-contrast checks.
- Browser evidence is mandatory under both existing Playwright projects, `desktop-chromium` and `mobile-chromium`, at all three exact widths: 375px, 768px, and 1440px. Each matrix case attaches homepage and login screenshots to the Playwright report.
- `prefers-reduced-motion: reduce` must reduce all non-essential CSS transition and animation durations to at most `0.01ms`, use one animation iteration, and disable smooth scrolling.
- Execution has exactly one independently testable hardening task, exactly one independent review, and exactly one final `devenv test --no-tui` quality-gate run after all review fixes.

---

## File Structure

- Create `tests/e2e/accessibility-hardening.spec.ts`: the single Issue #10 acceptance suite for keyboard order/focus, semantics, axe, reduced motion, exact viewport containment, and attached desktop/mobile screenshots.
- Modify `tests/e2e/marketing-journey.spec.ts`: retain product journey assertions but move its generic contrast, axe, reduced-motion, skip-link, target-size, and 375/768/1440 acceptance checks into the focused hardening suite so each requirement has one owner.
- Modify `src/components/login-form.tsx`: focus the first invalid field after local validation while preserving the Issue #9 no-network/no-storage behavior.
- Modify `src/components/support-dashboard.tsx`: make the polite conversation-detail update atomic.
- Modify `src/components/chat-shell.tsx`: associate the non-modal dialog with its localized welcome description while preserving Escape close and launcher focus return.
- Modify `src/styles/globals.css`: remove page-level overflow clipping and add explicit containment for existing grids, cards, controls, and fixed chat UI; retain the global visible-focus and reduced-motion rules.
- Update `graphify-out/`: refresh the repository graph after the reviewed code is final.

### Task 1: Harden and prove the complete local journey

**Files:**

- Create: `tests/e2e/accessibility-hardening.spec.ts`
- Modify: `tests/e2e/marketing-journey.spec.ts`
- Modify: `src/components/login-form.tsx`
- Modify: `src/components/support-dashboard.tsx`
- Modify: `src/components/chat-shell.tsx`
- Modify: `src/styles/globals.css`
- Update: `graphify-out/`

**Interfaces:**

- Consumes: Issue #9's reviewed `LoginForm`, including `Email address`, `Password`, `Remember me`, `Continue to demo`, field-associated localized errors, and `role="status"` demo outcome.
- Preserves: `LoginForm` performs only local state transitions and never calls `fetch`, a server action, storage, authentication, or session APIs.
- Produces: invalid login submission focuses `#login-email` when email is invalid or missing, otherwise `#login-password` when password alone is missing.
- Produces: `.support-dashboard__detail[aria-live="polite"][aria-atomic="true"]`.
- Produces: `#support-chat[role="dialog"][aria-describedby="chat-shell-description"]` and localized welcome copy with `id="chat-shell-description"`.
- Produces: `tests/e2e/accessibility-hardening.spec.ts`, executed unchanged by both configured Playwright projects; each exact-width test calls `page.setViewportSize({ width, height: 900 })`.
- Produces: Playwright attachments named `<project>-<locale>-<width>-home.png` and `<project>-<locale>-<width>-login.png`.

- [ ] **Step 1: Wait for Issue #9, then rebase this worktree onto its integrated commit**

Do not inspect or copy the in-progress Issue #9 working tree as implementation input. After its owner reports the Issue #9 review, fresh `devenv test --no-tui`, commit, and integration are complete, run from `/home/zaviro/workspace/selfwebsite/.worktrees/issue-10-hardening`:

```bash
git status --short
ISSUE_9_SHA=$(git rev-parse agent/issue-9-login)
git merge-base --is-ancestor "$ISSUE_9_SHA" main
git rebase main
git merge-base --is-ancestor "$ISSUE_9_SHA" HEAD
git status --short
```

Expected: the first status is clean because this plan is already committed; both `merge-base --is-ancestor` commands exit 0; the rebase succeeds; the final status is clean. Confirm the rebased tree contains `src/components/login-form.tsx`, `src/components/login-form.test.tsx`, and the Issue #9 browser journey before continuing. If `main` does not yet contain `ISSUE_9_SHA`, stop—Issue #10 remains blocked.

Record the review base for Task 2:

```bash
git rev-parse HEAD > /tmp/nexa-issue-10-base-sha
```

- [ ] **Step 2: Write the focused hardening suite and verify the four new contracts are RED**

Create `tests/e2e/accessibility-hardening.spec.ts` with the imports, constants, and helpers below. Use only public roles, labels, and stable component classes already owned by the product; do not add test-only attributes to production markup.

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

const viewports = [375, 768, 1440] as const;
const locales = [
  {
    storageValue: "en",
    faq: "How does Nexa answer questions?",
    launcher: "Open support chat",
    settings: "Open chat settings",
    email: "Email address",
    password: "Password",
    submit: "Continue to demo",
  },
  {
    storageValue: "zh-CN",
    faq: "Nexa 如何回答问题？",
    launcher: "打开客服聊天",
    settings: "打开聊天设置",
    email: "邮箱地址",
    password: "密码",
    submit: "继续体验演示",
  },
] as const;

async function setLocale(page: Page, locale: "en" | "zh-CN") {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: "nexa-language:v1", value: locale },
  );
}

async function expectVisibleFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  const style = await locator.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      outlineStyle: computed.outlineStyle,
      outlineWidth: Number.parseFloat(computed.outlineWidth),
    };
  });
  expect(style.outlineStyle).not.toBe("none");
  expect(style.outlineWidth).toBeGreaterThanOrEqual(2);
}

async function expectAxeClean(page: Page) {
  const violations = (await new AxeBuilder({ page }).analyze()).violations.map(
    ({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target),
    }),
  );
  expect(violations).toEqual([]);
}

async function expectInsideViewport(page: Page, locator: Locator) {
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds === null) {
    throw new Error("Expected a visible surface for viewport evidence.");
  }
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    await page.evaluate(() => window.innerWidth),
  );
}
```

Add one test named `exposes atomic status and dialog description semantics`:

```ts
test("exposes atomic status and dialog description semantics", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".support-dashboard__detail")).toHaveAttribute(
    "aria-atomic",
    "true",
  );
  await page.getByRole("button", { name: "Open support chat" }).click();
  const chat = page.getByRole("dialog", { name: "Nexa Support" });
  await expect(chat).toHaveAttribute(
    "aria-describedby",
    "chat-shell-description",
  );
  await expect(chat.locator("#chat-shell-description")).toHaveText(
    "Hi — choose a topic or type a question. This demo replies locally.",
  );
});
```

Add one test named `moves invalid login focus to the first field needing attention`:

```ts
test("moves invalid login focus to the first field needing attention", async ({
  page,
}) => {
  await page.goto("/login");
  const email = page.getByRole("textbox", {
    name: "Email address",
    exact: true,
  });
  const password = page.getByLabel("Password", { exact: true });
  const submit = page.getByRole("button", {
    name: "Continue to demo",
    exact: true,
  });

  await submit.click();
  await expectVisibleFocus(email);
  await email.fill("person@example.com");
  await submit.click();
  await expectVisibleFocus(password);
  await expect(email).toHaveAttribute("aria-invalid", "false");
  await expect(password).toHaveAttribute(
    "aria-describedby",
    "login-password-error",
  );
});
```

Add one test named `does not mask horizontal overflow at the page boundary`:

```ts
test("does not mask horizontal overflow at the page boundary", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "clip");
});
```

Run:

```bash
bun run test:e2e -- tests/e2e/accessibility-hardening.spec.ts --project=desktop-chromium --grep "atomic status|invalid login focus|mask horizontal"
```

Expected: FAIL for four specific pre-hardening facts: missing dashboard `aria-atomic`, missing chat `aria-describedby`, submit retaining focus instead of focusing the first invalid login field, and `body` computing to `overflow-x: clip`. Correct selector/setup errors until these are assertion failures; do not weaken the contracts.

- [ ] **Step 3: Implement the minimal semantic, focus, and containment corrections**

In `src/components/login-form.tsx`, add `useRef` to the existing React import and create:

```ts
const emailRef = useRef<HTMLInputElement>(null);
const passwordRef = useRef<HTMLInputElement>(null);
```

Attach the refs to the existing email and password inputs. In `onSubmit`, immediately after `setSubmitted(false)` in the invalid branch, focus the first invalid control in document order:

```ts
if (nextErrors.email !== undefined) {
  emailRef.current?.focus();
} else {
  passwordRef.current?.focus();
}
```

Do not change Issue #9's validation regex, localized messages, values, checkbox state, outcome, or no-network/no-storage boundary.

In `src/components/support-dashboard.tsx`, add `aria-atomic="true"` beside the existing `aria-live="polite"` on `.support-dashboard__detail`. Keep the current selected-conversation state and localized content unchanged.

In `src/components/chat-shell.tsx`, add `aria-describedby="chat-shell-description"` to `#support-chat`, and add `id="chat-shell-description"` to the existing localized `.chat-shell__welcome`. Keep `role="dialog"`, `aria-modal="false"`, title focus on open, Escape close, and launcher focus return unchanged.

In `src/styles/globals.css`:

- remove `overflow-x: clip` from `body`;
- add `max-width: 100%` and `min-width: 0` to `.site-header__inner`, `.support-dashboard__workspace`, `.support-dashboard__inbox`, `.support-dashboard__detail`, `.feature-workflow__story`, `.feature-workflow__story-copy`, `.feature-workflow__visual`, `.editorial-section`, `.pricing-ledger`, `.testimonial-ledger`, `.faq-list`, `.site-footer`, `.login-card`, `.login-form`, `.chat-shell`, and their direct grid/flex children where the existing selector does not already provide it;
- add `overflow-wrap: anywhere` to user-facing form errors/outcomes, dashboard detail text, FAQ answers, chat messages/settings warnings, and long localized button/label text;
- keep `width: min(24rem, calc(100vw - 2rem))` and `max-height: calc(100dvh - 7.75rem)` on `.chat-shell`;
- keep all interactive controls at a minimum 44px target and preserve the existing `:focus-visible` ring;
- retain the global reduced-motion override exactly at `0.01ms`, one iteration, and `scroll-behavior: auto`.

Do not add a blanket `overflow: hidden`, negative translation, scale, or smaller font size to force the matrix green.

- [ ] **Step 4: Run the four RED contracts and verify GREEN**

Run:

```bash
bun run test:e2e -- tests/e2e/accessibility-hardening.spec.ts --project=desktop-chromium --grep "atomic status|invalid login focus|mask horizontal"
```

Expected: PASS. The dashboard update is atomic, the chat dialog has a localized description, invalid login focus follows document order with a visible ring, and page overflow is no longer hidden at the body boundary.

- [ ] **Step 5: Add keyboard, axe, reduced-motion, and exact viewport evidence to the same suite**

Add a test named `keeps the complete keyboard path logical and visibly focused`. It must use `page.keyboard.press("Tab")` rather than direct `.focus()` for traversal:

- On `/login`, assert the exact order is skip link → Nexa Support home link → locale toggle → email → password → remember-me → submit → back-home link. Activate blank submit with `Enter`, assert focus moves to email, and assert both fields reference their rendered errors.
- On `/`, traverse the header in DOM order, activate each dashboard queue/conversation button with Enter or Space, toggle the first FAQ with Enter and Space while checking `aria-expanded`, open chat with its launcher, assert the dialog title receives focus, Tab through settings, quick actions, textbox, and submit, then press Escape and assert focus returns to the launcher.
- Call `expectVisibleFocus` for each critical focused control.

Add a test named `has no automated WCAG violations across both localized journeys`. For each entry in `locales`:

1. set the locale before navigation;
2. open the matching FAQ, chat, and chat settings on `/`;
3. run `expectAxeClean(page)`;
4. navigate to `/login`, submit the blank form so both localized errors render, and run `expectAxeClean(page)` again.

This axe pass must scan the full page; do not exclude, disable, or downgrade `color-contrast`, landmark, heading, label, ARIA, focus, or target-size rules.

Add a test named `disables non-essential motion when reduced motion is requested`:

```ts
test("disables non-essential motion when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const offenders = await page.locator("body *").evaluateAll((elements) =>
    elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const durations = [
        ...style.animationDuration.split(","),
        ...style.transitionDuration.split(","),
      ].map((duration) => {
        const value = Number.parseFloat(duration);
        return duration.trim().endsWith("ms") ? value : value * 1000;
      });
      const tooLong = durations.some((duration) => duration > 0.01);
      const repeats = style.animationIterationCount
        .split(",")
        .some((count) => count === "infinite" || Number.parseFloat(count) > 1);
      return tooLong || repeats
        ? [
            {
              animationDuration: style.animationDuration,
              animationIterationCount: style.animationIterationCount,
              tag: element.tagName,
              transitionDuration: style.transitionDuration,
            },
          ]
        : [];
    }),
  );
  expect(offenders).toEqual([]);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
```

For every `width` in `viewports` and every entry in `locales`, add a named matrix test:

```ts
for (const width of viewports) {
  for (const locale of locales) {
    test(`keeps ${locale.storageValue} inside ${width}px and records evidence`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await setLocale(page, locale.storageValue);
      await page.goto("/");
      await page.getByRole("button", { name: locale.faq }).click();
      await page.getByRole("button", { name: locale.launcher }).click();
      await page.getByRole("button", { name: locale.settings }).click();

      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= window.innerWidth &&
            document.body.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      for (const surface of [
        page.locator("main"),
        page.locator(".support-dashboard"),
        page.locator(".feature-workflow"),
        page.locator(".pricing-section"),
        page.locator(".faq-section"),
        page.getByRole("dialog", { name: "Nexa Support" }),
      ]) {
        await expectInsideViewport(page, surface);
      }
      await testInfo.attach(
        `${testInfo.project.name}-${locale.storageValue}-${width}-home.png`,
        { body: await page.screenshot({ fullPage: true }), contentType: "image/png" },
      );

      await page.goto("/login");
      await page.getByRole("button", { name: locale.submit }).click();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= window.innerWidth &&
            document.body.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expectInsideViewport(page, page.locator(".login-card"));
      await expectInsideViewport(page, page.locator(".login-form"));
      await testInfo.attach(
        `${testInfo.project.name}-${locale.storageValue}-${width}-login.png`,
        { body: await page.screenshot({ fullPage: true }), contentType: "image/png" },
      );
    });
  }
}
```

These cases intentionally run under both configured projects. The Playwright report must therefore show `desktop-chromium` and `mobile-chromium` evidence for 375px, 768px, and 1440px—not only each project's default device width.

- [ ] **Step 6: Move generic acceptance checks out of the journey suite without losing coverage**

In `tests/e2e/marketing-journey.spec.ts`, delete only checks now owned more completely by `accessibility-hardening.spec.ts`:

- the `AxeBuilder` import and local contrast helper functions;
- `keeps the signal color at normal-text AA contrast`;
- `has no automated WCAG violations in either locale`;
- `offers a visible keyboard skip link on every surface`;
- the dashboard-only reduced-motion portion after its hover/focus assertions;
- the final nested 375/768/1440 viewport matrix.

Retain the product behavior tests for navigation, locale persistence, dashboard interaction, feature workflow, decision path, chat responses/security, login invalid/valid submission, 44px controls, and hover feedback. Do not remove a journey assertion merely because axe scans the same element.

- [ ] **Step 7: Run focused task verification under both browser projects**

Run:

```bash
bun run test:e2e -- tests/e2e/accessibility-hardening.spec.ts
```

Expected: all hardening tests pass under both `desktop-chromium` and `mobile-chromium`. Confirm the output lists the six exact viewport/locale cases per project and that the HTML report contains 24 screenshot attachments: 2 projects × 3 widths × 2 locales × 2 routes.

Run:

```bash
bun run test:unit && bun run check && bun run typecheck && bun run test:e2e
```

Expected: Vitest, Biome, TypeScript, and the complete functional plus hardening Playwright suite pass. This is focused task verification, not the final canonical `devenv test`.

- [ ] **Step 8: Refresh the graph and commit the independently testable hardening task**

Run:

```bash
graphify update .
git add docs/superpowers/plans/2026-07-26-accessibility-hardening.md tests/e2e/accessibility-hardening.spec.ts tests/e2e/marketing-journey.spec.ts src/components/login-form.tsx src/components/support-dashboard.tsx src/components/chat-shell.tsx src/styles/globals.css graphify-out
git commit -m "fix: harden accessibility and responsive journeys"
```

Expected: graphify records the integrated login, dashboard, chat, and hardening-test relationships; the commit contains no Playwright report, screenshot artifact, secret, service integration, or unrelated change.

### Task 2: Perform exactly one independent implementation and UI review

**Files:**

- Review: the committed Task 1 range and its Playwright report
- Modify only for verified findings: the Task 1 files listed above
- Update after review fixes: `graphify-out/`

**Interfaces:**

- Consumes: base SHA stored in `/tmp/nexa-issue-10-base-sha`, current Task 1 `HEAD`, Issue #10 acceptance criteria, this plan, focused test output, and attached screenshots.
- Produces: one read-only review with Critical/Important/Minor findings and a merge-readiness verdict.
- Produces: verified fixes only; there is no second independent review.

- [ ] **Step 1: Request one fresh review covering code and rendered UI**

Use `requesting-code-review` exactly once. Set:

```bash
BASE_SHA=$(cat /tmp/nexa-issue-10-base-sha)
HEAD_SHA=$(git rev-parse HEAD)
git diff --stat "$BASE_SHA".."$HEAD_SHA"
```

Give the reviewer the two SHAs, Issue #10, this plan, and the Playwright HTML-report path. Require the reviewer to:

- use `web-design-guidelines` to fetch the current Vercel Web Interface Guidelines and report applicable findings with `file:line` evidence;
- inspect the 375px, 768px, and 1440px English/Chinese attachments from both `desktop-chromium` and `mobile-chromium`;
- verify keyboard order, visible focus, labels/errors, `aria-expanded`, dialog description, atomic live status, heading/landmark structure, axe results, AA contrast, reduced motion, and real containment without clipping;
- verify all existing local-only security and persistence boundaries;
- reject any proposal to add a real service or expand product scope.

- [ ] **Step 2: Evaluate and address only verified findings**

Use `receiving-code-review` for every finding. Check it against the code, Issue #10, and browser evidence before editing. For a real defect, use `systematic-debugging`, add or tighten the smallest failing assertion in `accessibility-hardening.spec.ts` or the existing component test first, watch it fail for the reported reason, implement the minimal correction, and rerun the affected unit/browser command until green.

Do not request another independent review. Do not run `devenv test` in this task.

After all accepted fixes:

```bash
bun run test:unit && bun run check && bun run typecheck
bun run test:e2e -- tests/e2e/accessibility-hardening.spec.ts
graphify update .
git add tests/e2e/accessibility-hardening.spec.ts tests/e2e/marketing-journey.spec.ts src/components/login-form.tsx src/components/support-dashboard.tsx src/components/chat-shell.tsx src/styles/globals.css graphify-out
git diff --cached --quiet || git commit -m "fix: address accessibility hardening review"
```

Expected: focused checks pass, graphify reflects any review correction, and either a review-fix commit is created or the index is clean because the reviewer found no actionable defect.

### Task 3: Run the one final canonical quality gate

**Files:**

- Verify only: the complete rebased, reviewed repository

**Interfaces:**

- Consumes: reviewed Task 1 implementation, any verified Task 2 fixes, updated graph, and clean worktree.
- Produces: the sole final reproducible evidence for frozen install, configuration checks, Biome, TypeScript, Vitest, production build, and the complete desktop/mobile Playwright suite.

- [ ] **Step 1: Confirm final preconditions, then run `devenv test` exactly once**

Run:

```bash
git status --short
devenv test --no-tui
```

Expected: status is clean before verification. The one final command exits 0 after frozen installation, Lefthook and Actions configuration validation, Biome, TypeScript, unit tests, production build, Chromium installation, functional journeys, automated axe scans, keyboard/reduced-motion checks, and both `desktop-chromium` and `mobile-chromium` exact-width evidence. Preserve the terminal output and Playwright report for Issue #10 completion evidence.

Do not edit code, tests, graph output, or documentation after this successful run. If the command fails, report the actual failure and keep Issue #10 incomplete; use `systematic-debugging` before changing anything, then treat the next complete `devenv test --no-tui` as a new final-verification attempt rather than claiming success from partial checks.

## Plan Self-Review

- Spec coverage: Task 1 covers 375/768/1440 containment, logical keyboard use and visible focus, landmarks/headings/labels/errors/expanded/dialog/live semantics, axe-backed contrast and accessibility, reduced motion, critical Chromium journeys, and integration of the Issue #9 login form.
- Dependency coverage: execution explicitly waits for Issue #9's reviewed and verified commit, proves it is in `main`, rebases Issue #10, and verifies the Issue #9 SHA is an ancestor before any hardening edit.
- Evidence coverage: both configured desktop/mobile Chromium projects execute every exact-width matrix case, both locales are covered, and 24 named route screenshots are attached to the Playwright report.
- Task boundary: there is exactly one independently testable hardening task, one independent review, and one final canonical quality-gate task.
- Scope boundary: no real service, authentication/session, persistence, secret handling, network request, backend, analytics, payment, or contact collection is introduced.
- Placeholder scan: all file paths, selectors, public English contracts, commands, viewport sizes, screenshot counts, review inputs, and expected outcomes are explicit; there are no deferred implementation placeholders.
- Type and naming consistency: `chat-shell-description`, `login-email-error`, `login-password-error`, `desktop-chromium`, `mobile-chromium`, locale storage values, and the 375/768/1440 matrix names match the integrated interfaces referenced throughout the plan.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-26-accessibility-hardening.md`. Execute it only after Issue #9 is reviewed, freshly verified, committed, and integrated into `main`; then rebase this worktree and follow Task 1 → one review → one final `devenv test --no-tui`.
