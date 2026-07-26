# Bilingual Marketing Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the untouched T3 page with a responsive Nexa Support marketing shell whose homepage, chat-shell preview, and login placeholder share one persistent English / Simplified Chinese preference.

**Architecture:** Keep the App Router pages server-rendered and place the smallest possible client boundary around locale state and the language control. A versioned, defensive local-storage adapter owns preference parsing and persistence; a pre-hydration locale script sets the document locale before paint, while React uses a stable server snapshot to avoid hydration errors. Focused marketing components consume one typed catalog, and Playwright verifies the route-level journey rather than component internals.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, Testing Library, Playwright Chromium.

## Global Constraints

- Brand and all interface assets are original to Nexa Support; do not copy Intercom logos, copy, screenshots, illustrations, or proprietary UI.
- Supported locales are exactly English (`en`) and Simplified Chinese (`zh-CN`); missing, malformed, inaccessible, or unsupported saved values fall back to English.
- Store only the language preference in `localStorage`; do not add analytics, telemetry, authentication, AI calls, databases, payments, or secret handling.
- Hero copy is exactly `Resolve customer questions instantly` / `立即解决客户问题` and `An AI support assistant for growing SaaS teams.` / `面向成长型 SaaS 团队的 AI 客服助手。`
- Headline outcomes are 70% automated, 24/7 online, and 30-second deployment, with localized labels.
- All trial and login actions target `/login`; Product and Pricing navigation target meaningful `#features` and `#pricing` homepage anchors; the logo targets `/#top`.
- Typography remains Geist Sans. Motion is restrained and disabled under `prefers-reduced-motion`.
- Target viewports are 375px, 768px, and 1440px with no page-level horizontal overflow.
- The chat in this issue is a localized non-interactive shell preview only; Issue #7 owns the interactive launcher and deterministic chat state machine.
- The login route in this issue is a localized branded placeholder only; Issue #9 owns fields, validation, and submission behavior.

---

## File Structure

- `next.config.js`: pins Next output tracing and Turbopack roots to the active worktree.
- `src/i18n/catalog.ts`: locale type, supported-locale list, and typed copy for shared navigation, homepage, chat shell, and login placeholder.
- `src/i18n/locale-storage.ts`: pure locale parsing plus defensive, versioned local-storage read/write functions.
- `src/i18n/locale-storage.test.ts`: unit coverage for valid, invalid, missing, and throwing storage behavior.
- `src/i18n/locale-provider.tsx`: the only locale client state boundary and document-language synchronization.
- `src/i18n/locale-script.tsx`: pre-hydration script that safely applies a valid saved locale before paint.
- `src/components/language-switcher.tsx`: accessible two-button language control.
- `src/components/site-header.tsx`: branded navigation and CTA.
- `src/components/marketing-home.tsx`: hero, outcomes, anchor preview sections, and footer.
- `src/components/chat-shell.tsx`: localized, non-interactive support-status preview for the future Issue #7 launcher.
- `src/app/page.tsx`: composes the homepage.
- `src/app/login/page.tsx`: composes the localized login placeholder.
- `src/app/layout.tsx`: metadata, locale provider, and pre-hydration script.
- `src/styles/globals.css`: Signal Desk tokens, responsive layout, focus styles, and reduced-motion behavior.
- `tests/e2e/marketing-journey.spec.ts`: mobile and desktop route, anchor, locale, persistence, fallback, hydration, and overflow journeys.
- `tests/e2e/scaffold.spec.ts`: removed once the real product journey supersedes the temporary scaffold smoke test.

### Task 1: Make locale persistence a small, tested domain

**Files:**
- Create: `src/i18n/catalog.ts`
- Create: `src/i18n/locale-storage.ts`
- Create: `src/i18n/locale-storage.test.ts`
- Modify: `next.config.js`

**Interfaces:**
- Produces: `type Locale = "en" | "zh-CN"`
- Produces: `SUPPORTED_LOCALES`, `DEFAULT_LOCALE`, `LANGUAGE_STORAGE_KEY`
- Produces: `parseLocale(value: unknown): Locale`
- Produces: `readStoredLocale(storage?: Pick<Storage, "getItem">): Locale`
- Produces: `writeStoredLocale(locale: Locale, storage?: Pick<Storage, "setItem">): void`
- Produces: `catalog: Record<Locale, SiteCopy>`

- [ ] **Step 1: Write failing locale-storage tests**

```ts
import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_LOCALE,
  LANGUAGE_STORAGE_KEY,
  parseLocale,
  readStoredLocale,
  writeStoredLocale,
} from "./locale-storage";

describe("locale storage", () => {
  it.each([
    ["en", "en"],
    ["zh-CN", "zh-CN"],
    [null, DEFAULT_LOCALE],
    ["fr", DEFAULT_LOCALE],
    ['{"locale":"zh-CN"}', DEFAULT_LOCALE],
  ] as const)("parses %s as %s", (stored, expected) => {
    expect(parseLocale(stored)).toBe(expected);
  });

  it("falls back to English when storage cannot be read", () => {
    const storage = { getItem: vi.fn(() => { throw new Error("blocked"); }) };
    expect(readStoredLocale(storage)).toBe("en");
  });

  it("stores only the selected locale under the versioned key", () => {
    const storage = { setItem: vi.fn() };
    writeStoredLocale("zh-CN", storage);
    expect(storage.setItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, "zh-CN");
  });

  it("does not throw when storage cannot be written", () => {
    const storage = { setItem: vi.fn(() => { throw new Error("quota"); }) };
    expect(() => writeStoredLocale("en", storage)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `bun run test:unit src/i18n/locale-storage.test.ts`

Expected: FAIL because `locale-storage.ts` does not exist.

- [ ] **Step 3: Implement the minimal storage contract**

```ts
export const DEFAULT_LOCALE = "en" as const;
export const LANGUAGE_STORAGE_KEY = "nexa-language:v1";
export type Locale = "en" | "zh-CN";

export function parseLocale(value: unknown): Locale {
  return value === "zh-CN" || value === "en" ? value : DEFAULT_LOCALE;
}

export function readStoredLocale(
  storage: Pick<Storage, "getItem"> = window.localStorage,
): Locale {
  try {
    return parseLocale(storage.getItem(LANGUAGE_STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeStoredLocale(
  locale: Locale,
  storage: Pick<Storage, "setItem"> = window.localStorage,
): void {
  try {
    storage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // The preference remains in component memory when storage is unavailable.
  }
}
```

Define `SiteCopy` and the complete English and Chinese Issue #3 catalog in `catalog.ts`; do not add untranslated placeholders.

- [ ] **Step 4: Pin Next roots to the active checkout**

```js
/** @type {import("next").NextConfig} */
const config = {
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
};
```

This is executable configuration, verified by the build and E2E commands below rather than a source-text test.

- [ ] **Step 5: Verify GREEN and static checks**

Run: `bun run test:unit src/i18n/locale-storage.test.ts && bun run typecheck && bun run build`

Expected: 4 locale behaviors pass, TypeScript exits 0, the build exits 0, and Next no longer reports multiple-lockfile root inference.

- [ ] **Step 6: Commit**

```bash
git add next.config.js src/i18n/catalog.ts src/i18n/locale-storage.ts src/i18n/locale-storage.test.ts
git commit -m "feat: define bilingual locale domain"
```

### Task 2: Prove the bilingual route journey before building it

**Files:**
- Create: `tests/e2e/marketing-journey.spec.ts`
- Delete: `tests/e2e/scaffold.spec.ts`

**Interfaces:**
- Consumes: `LANGUAGE_STORAGE_KEY = "nexa-language:v1"`
- Defines the observable names and route behavior that Tasks 3–4 must satisfy.

- [ ] **Step 1: Write the failing desktop journey**

```ts
test("navigates the English marketing journey and login placeholder", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Resolve customer questions instantly", level: 1 })).toBeVisible();
  await expect(page.getByText("70%")).toBeVisible();

  await page.getByRole("link", { name: "Product" }).click();
  await expect(page).toHaveURL(/#features$/);
  await expect(page.getByRole("heading", { name: "Support that follows the question", level: 2 })).toBeVisible();

  await page.getByRole("link", { name: "Start free" }).first().click();
  await expect(page).toHaveURL("/login");
  await expect(page.getByRole("heading", { name: "Welcome to the Nexa Support demo", level: 1 })).toBeVisible();
});
```

- [ ] **Step 2: Write the failing locale persistence and invalid-value journeys**

```ts
test("persists Simplified Chinese across routes and reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "简体中文" }).click();
  await expect(page.getByRole("heading", { name: "立即解决客户问题", level: 1 })).toBeVisible();
  await expect(page.getByText("支持在线")).toBeVisible();
  await page.getByRole("link", { name: "登录" }).click();
  await expect(page.getByRole("heading", { name: "欢迎体验 Nexa Support 演示", level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "欢迎体验 Nexa Support 演示", level: 1 })).toBeVisible();
});

test("falls back to English without hydration errors for an invalid saved locale", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration/i.test(message.text())) hydrationErrors.push(message.text());
  });
  await page.addInitScript(() => localStorage.setItem("nexa-language:v1", "fr"));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Resolve customer questions instantly", level: 1 })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});
```

- [ ] **Step 3: Add a viewport invariant shared by both Playwright projects**

```ts
test("keeps the marketing shell inside the viewport", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
```

- [ ] **Step 4: Run tests and verify RED**

Run: `bun run test:e2e -- tests/e2e/marketing-journey.spec.ts`

Expected: FAIL on the missing Nexa heading, routes, controls, and anchors.

- [ ] **Step 5: Commit the executable specification**

```bash
git add tests/e2e/marketing-journey.spec.ts tests/e2e/scaffold.spec.ts
git commit -m "test: specify bilingual marketing journey"
```

### Task 3: Build the locale boundary and shared bilingual shell

**Files:**
- Create: `src/i18n/locale-provider.tsx`
- Create: `src/i18n/locale-script.tsx`
- Create: `src/components/language-switcher.tsx`
- Create: `src/components/site-header.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `useLocale(): { locale: Locale; copy: SiteCopy; setLocale(locale: Locale): void }`
- Produces: `<LocaleProvider>`, `<LocaleScript>`, `<LanguageSwitcher>`, and `<SiteHeader>`
- Consumes: `catalog`, `readStoredLocale`, and `writeStoredLocale`

- [ ] **Step 1: Implement a hydration-safe external locale store**

Use `useSyncExternalStore` with a stable English server snapshot, a single custom `nexa-language-change` event, and a client snapshot cached by the raw stored string. `setLocale` must write the versioned key, update `<html lang>` and `<html data-locale>`, and dispatch the custom event. Do not attach one global listener per translated element.

- [ ] **Step 2: Add the pre-hydration document-locale script**

The inline script must:

```js
try {
  var value = localStorage.getItem("nexa-language:v1");
  var locale = value === "zh-CN" ? "zh-CN" : "en";
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
} catch (_) {
  document.documentElement.lang = "en";
  document.documentElement.dataset.locale = "en";
}
```

Keep this script static and local; it must not interpolate user content or make a network request.

- [ ] **Step 3: Build the accessible language and navigation controls**

`LanguageSwitcher` is a labelled group with `English` and `简体中文` buttons using `aria-pressed`. `SiteHeader` exposes `Product`, `Pricing`, `Log in`, and `Start free`, with the exact anchors and `/login` targets in Global Constraints. Mobile navigation remains inline and horizontally scroll-free; do not add a menu state before it is needed.

- [ ] **Step 4: Wire the root layout**

Update metadata to Nexa Support, render `LocaleScript` before the interactive shell, wrap children with `LocaleProvider`, and keep the server `<html lang="en">` snapshot deterministic.

- [ ] **Step 5: Run focused checks**

Run: `bun run test:unit && bun run typecheck`

Expected: locale unit tests and TypeScript pass with no React hook or hydration warnings.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/i18n/locale-provider.tsx src/i18n/locale-script.tsx src/components/language-switcher.tsx src/components/site-header.tsx
git commit -m "feat: add persistent locale shell"
```

### Task 4: Replace the scaffold with the Signal Desk marketing experience

**Files:**
- Create: `src/components/marketing-home.tsx`
- Create: `src/components/chat-shell.tsx`
- Create: `src/app/login/page.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/styles/globals.css`

**Interfaces:**
- Consumes: `useLocale()` and `<SiteHeader>`
- Produces: semantic `#top`, `#features`, and `#pricing` landmarks plus a localized `/login` placeholder

- [ ] **Step 1: Build the semantic homepage**

Compose:

```tsx
<>
  <SiteHeader />
  <main id="main-content">
    <section id="top" aria-labelledby="hero-title">{/* hero + route visualization */}</section>
    <section aria-label={copy.outcomes.label}>{/* 70% / 24/7 / 30 seconds */}</section>
    <section id="features" aria-labelledby="features-title">{/* Issue #4/#5 preview */}</section>
    <section id="pricing" aria-labelledby="pricing-title">{/* Issue #6 preview */}</section>
  </main>
  <footer>{/* brand, short promise, route links */}</footer>
  <ChatShell />
</>
```

The hero visualization is code-native: three conversation cards connected by one route line labelled Ask, Route, Resolve. It is decorative/product storytelling, not a fake third-party screenshot.

- [ ] **Step 2: Build the localized login placeholder**

Render a `main` landmark, logo link to `/#top`, language switcher, localized level-one heading, short demo-only explanation, and a link back to the homepage. Do not add form inputs or submission behavior owned by Issue #9.

- [ ] **Step 3: Apply the Signal Desk token system**

```css
:root {
  --paper: #f4f7f2;
  --surface: #ffffff;
  --ink: #15241d;
  --evergreen: #234c3c;
  --signal: #6268ef;
  --route: #d8f06a;
  --coral: #ff8d72;
  --line: #ccd8d0;
}
```

Use a precise editorial grid, 18–22px body leading, high-contrast focus rings, restrained radii, and one asymmetric route visualization. The outcomes form a ruled strip rather than three generic gradient cards. At 375px the header wraps cleanly, hero becomes one column, message cards stay within the viewport, and all tap targets remain at least 44px.

- [ ] **Step 4: Add reduced-motion behavior**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 5: Run the browser specification and iterate only on observed failures**

Run: `bun run test:e2e -- tests/e2e/marketing-journey.spec.ts`

Expected: all tests pass in desktop Chromium and Pixel 7 projects; the invalid saved locale logs no hydration error.

- [ ] **Step 6: Run fast checks**

Run: `bun run check && bun run typecheck && bun run test:unit`

Expected: all commands exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/app/login/page.tsx src/components/marketing-home.tsx src/components/chat-shell.tsx src/styles/globals.css
git commit -m "feat: ship bilingual marketing shell"
```

### Task 5: Review the real UI and close Issue #3 with fresh evidence

**Files:**
- Modify as findings require: Issue #3 files only
- Update: `graphify-out/`

**Interfaces:**
- Consumes: complete Issue #3 implementation
- Produces: browser screenshots/review notes, current knowledge graph, and a green canonical quality gate

- [ ] **Step 1: Run visual review at all acceptance widths**

Start the app with `bun run dev`, inspect 375px, 768px, and 1440px, and capture screenshots. Check hierarchy, wrapping, anchor landing positions, focus visibility, contrast, and that the route visualization is the sole strong decorative signature.

- [ ] **Step 2: Run Web Interface Guidelines review**

Review semantic landmarks, heading order, link/button roles, `aria-pressed`, language changes, 44px targets, visible focus, reduced motion, and overflow. Record and fix only concrete findings.

- [ ] **Step 3: Run code review and address verified findings**

Use `requesting-code-review`; for each finding use `receiving-code-review` before changing code. Re-run the smallest affected test after every correction.

- [ ] **Step 4: Refresh the graph**

Run: `graphify update .`

Expected: AST update succeeds and `graphify-out/graph.json` reflects the new source files.

- [ ] **Step 5: Run the canonical completion gate**

Run: `devenv test --no-tui`

Expected: frozen install, configuration checks, Biome, TypeScript, Vitest, production build, and both Playwright projects all exit 0.

- [ ] **Step 6: Commit review fixes and graph output**

```bash
git add src tests graphify-out docs/superpowers/plans/2026-07-26-bilingual-marketing-journey.md
git commit -m "chore: verify bilingual marketing journey"
```

- [ ] **Step 7: Finish the branch**

Use `finishing-a-development-branch` and present the required merge / PR / keep-as-is choices. Do not push the feature branch or close Issue #3 until the owner selects the integration path and CI evidence is available.

