# Login Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/login` into a polished, accessible English / Simplified Chinese local-login placeholder that validates a form in the browser and clearly reports that authentication is not connected.

**Architecture:** Keep `src/app/login/page.tsx` as the route-level branded shell and add one client `LoginForm` component for transient form state, validation, and outcome messaging. The existing `LocaleProvider`, `LocalizedText`, and typed catalog remain the sole locale mechanism; the form never calls a route, server action, `fetch`, storage API, or authentication library.

**Tech Stack:** Next.js App Router, React 19, TypeScript, existing locale catalog/provider, CSS, Vitest with Testing Library, and Playwright with axe-playwright.

## Global Constraints

- This is a local portfolio demo: do not call, configure, mock, or depend on authentication, a session, API route, server action, network endpoint, database, analytics service, payment provider, cookies, `localStorage`, `sessionStorage`, URL data, secrets, or environment variables.
- Every submission must remain local: invalid input shows field-associated localized errors; valid input shows the localized `Demo only—authentication is not connected` outcome and creates no session or persisted data.
- Keep the existing one destination-named English / Simplified Chinese language-toggle button. At any moment only one locale may be visible and accessibility-exposed; direct `/login` visits must honour the saved language preference and navigation must preserve it.
- Retain the existing CTA destinations: hero `Start free`, header `Log in` and `Start free`, footer `Log in`, and both pricing `Start free` links all target `/login`.
- Use native email/password controls with `autocomplete="username"` and `autocomplete="current-password"`; include a native remember-me checkbox but do not act on, read, or persist it.
- Meet WCAG 2.2 AA using explicit labels, `aria-invalid`, per-field `aria-describedby`, visible focus, live outcome feedback, 44px-or-larger interactive targets, and no page-level horizontal overflow at 375px, 768px, or 1440px.
- Use the existing Signal Desk visual language and reduced-motion rule; do not introduce a fake account, password-reset, registration, social-login, SSO, or backend flow.
- Completion has exactly one independent code review and exactly one fresh final `devenv test --no-tui` run after any review fixes.

## File Structure

- Create `src/components/login-form.tsx`: client-only typed form state, local validation, accessible errors, and the non-authenticated success message.
- Create `src/components/login-form.test.tsx`: RED/GREEN component contracts for local invalid and valid form submission in both locales, including the no-storage/no-network boundary.
- Modify `src/i18n/catalog.ts`: extend the existing typed `login` copy with labels, validation messages, checkbox text, submit text, and the local-demo outcome in English and Simplified Chinese.
- Modify `src/app/login/page.tsx`: replace the static-only card action with `LoginForm` while retaining brand navigation, one `LanguageSwitcher`, and localized page framing.
- Modify `src/styles/globals.css`: add responsive, focus-visible form, error, checkbox, submit, and status styles within the existing login-card visual system.
- Modify `tests/e2e/marketing-journey.spec.ts`: replace the placeholder-only login assertions with CTA-to-form, invalid/valid local submission, direct-route locale, and 375px browser evidence.

---

### Task 1: Deliver the bilingual local-login form and prove its CTA journey

**Files:**

- Create: `src/components/login-form.tsx`
- Create: `src/components/login-form.test.tsx`
- Modify: `src/i18n/catalog.ts`
- Modify: `src/app/login/page.tsx`
- Modify: `src/styles/globals.css`
- Modify: `tests/e2e/marketing-journey.spec.ts`

**Interfaces:**

- Consumes: `useLocale(): { locale: Locale; copy: SiteCopy; setLocale(locale: Locale): void }` from `src/i18n/locale-provider.tsx`; only `copy.login` supplies visible and accessible form copy.
- Extends: `SiteCopy["login"]` with `emailLabel`, `emailRequired`, `emailInvalid`, `passwordLabel`, `passwordRequired`, `rememberMe`, `submit`, and `demoOutcome`, all `string` values in both catalog locales.
- Produces: `LoginForm(): React.JSX.Element`, a client component containing one `noValidate` native form with `email`, `password`, and `remember` controls. It owns transient `values`, `errors`, and `submitted` state only.
- Produces: `validateLogin(values: { email: string; password: string }): { email?: "required" | "invalid"; password?: "required" }`, a module-local pure helper used before any valid result is displayed. An email is valid only when `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` matches its trimmed value; password is required after trimming but has no invented length or complexity policy.

- [ ] **Step 1: Write the failing localized component tests before creating the form**

Create `src/components/login-form.test.tsx`. Render `LoginForm` inside the real `LocaleProvider`; do not mock the locale provider, form validation, `fetch`, or storage. The checks below establish that feedback is local, labels point to native controls, errors are field-associated, the remember choice is presentation-only, and success is not an authenticated state.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { LoginForm } from "./login-form";

function renderForm() {
  return render(
    <LocaleProvider>
      <LoginForm />
    </LocaleProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => window.localStorage.clear());

  test("associates localized missing and malformed errors without a request", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(window, "fetch");
    renderForm();

    await user.click(screen.getByRole("button", { name: "Continue to demo" }));
    expect(screen.getByRole("textbox", { name: "Email address" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter your email address.", { exact: true })).toHaveAttribute("id", "login-email-error");
    expect(screen.getByLabelText("Password")).toHaveAttribute("aria-describedby", "login-password-error");

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "nexa@invalid");
    await user.type(screen.getByLabelText("Password"), "local-only");
    await user.click(screen.getByRole("button", { name: "Continue to demo" }));
    expect(screen.getByText("Enter a valid email address.", { exact: true })).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("reports the localized no-authentication outcome and does not persist the form", async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    renderForm();

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "person@example.com");
    await user.type(screen.getByLabelText("Password"), "local-only");
    await user.click(screen.getByRole("checkbox", { name: "Remember me" }));
    await user.click(screen.getByRole("button", { name: "Continue to demo" }));

    expect(screen.getByRole("status")).toHaveTextContent("Demo only—authentication is not connected.");
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeChecked();
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  test("switches the complete form to Simplified Chinese without exposing English copy", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "简体中文" }));
    expect(screen.getByRole("textbox", { name: "邮箱地址" })).toBeVisible();
    expect(screen.getByRole("button", { name: "继续体验演示" })).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "Email address" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused component test and verify RED**

Run: `bun run test:unit -- src/components/login-form.test.tsx`

Expected: FAIL because `./login-form` does not exist. Do not add production code until the failure specifically identifies the missing module.

- [ ] **Step 3: Add typed local form copy and implement the smallest client boundary**

In `src/i18n/catalog.ts`, replace the current three-field `login` shape with the exact interface below and populate both locales. Keep the existing title, description, and back-home wording. Use these exact English values and natural Simplified Chinese equivalents: `Email address`, `Enter your email address.`, `Enter a valid email address.`, `Password`, `Enter your password.`, `Remember me`, `Continue to demo`, and `Demo only—authentication is not connected.`

```ts
login: {
  title: string;
  description: string;
  emailLabel: string;
  emailRequired: string;
  emailInvalid: string;
  passwordLabel: string;
  passwordRequired: string;
  rememberMe: string;
  submit: string;
  demoOutcome: string;
  backToHome: string;
}
```

Create `src/components/login-form.tsx` with `"use client"`, `useState`, and `useLocale()`. Make `validateLogin` return error keys for blank trimmed email/password and malformed nonblank email using the exact regex defined in this task. On `onSubmit`, call `event.preventDefault()`, calculate errors, clear `submitted` for invalid data, and return without any browser, network, or authentication side effect. On valid data, set an empty error object and `submitted` to `true`; do not disable fields, redirect, mutate the URL, or imply a user is signed in. Changing either text control clears that field's error and clears a previous result; the native checkbox changes its local checked state only.

Render a `<form noValidate>` with:

```tsx
<label htmlFor="login-email">{copy.login.emailLabel}</label>
<input
  aria-describedby={errors.email ? "login-email-error" : undefined}
  aria-invalid={Boolean(errors.email)}
  autoComplete="username"
  id="login-email"
  name="email"
  type="email"
/>
{errors.email ? <p id="login-email-error" role="alert">{emailError}</p> : null}
```

Mirror that exact association for `login-password`, `type="password"`, `name="password"`, and `autoComplete="current-password"`; use a native `name="remember" type="checkbox"` with the localized label. The submit control is a native `type="submit"` button. Render `copy.login.demoOutcome` only after valid submit as `<p className="login-form__outcome" role="status" aria-live="polite">`; never put passwords or the entered email in feedback, markup, logging, an error, or a request.

In `src/app/login/page.tsx`, import and render `<LoginForm />` directly after the current description. Retain the branded title helper, the existing `LanguageSwitcher` in the demo navigation, the truthful page notice, back-home link, and footnote. Remove only the old card-level standalone signal button so the form is the primary action and the page still has exactly one language-toggle button.

- [ ] **Step 4: Add responsive form presentation without changing the route’s visual system**

In `src/styles/globals.css`, preserve `.login-page`, `.login-card`, and existing token usage. Add `.login-form`, `.login-form__field`, `.login-form__label`, `.login-form__input`, `.login-form__error`, `.login-form__remember`, `.login-form__submit`, and `.login-form__outcome` rules. Inputs and submit must be `width: 100%`, have a minimum height of `2.75rem`, use the existing surface/ink/line/evergreen/signal variables, and have visible focus through the existing global `:focus-visible` rule. Make errors clearly distinct using `var(--coral)` without relying on color alone, reserve enough layout space to avoid jumps where practical, and use `overflow-wrap: anywhere` for the outcome. At the existing narrow breakpoint, keep the card width within `calc(100vw - 2 * var(--page-gutter))`, stack the checkbox label normally, and avoid fixed widths or horizontal scrolling. Do not add transitions beyond existing motion preferences.

- [ ] **Step 5: Run focused unit, formatting, and type checks and verify GREEN**

Run: `bun run test:unit -- src/components/login-form.test.tsx && bun run check && bun run typecheck`

Expected: all three localized component contracts pass, Biome reports no errors, and TypeScript accepts the extended `SiteCopy.login` catalog shape.

- [ ] **Step 6: Write the failing browser journey for CTA, validation, direct-route locale, and mobile evidence**

In `tests/e2e/marketing-journey.spec.ts`, extend the existing English and Chinese route journeys instead of duplicating generic CTA helpers. Add a named test `validates the local login placeholder without authentication` that does the following through public roles and labels:

```ts
await page.goto("/");
const startFree = page.getByRole("link", { name: "Start free", exact: true });
await expect(startFree).toHaveCount(4); // hero, header, and two pricing links
await expect(page.getByRole("link", { name: "Log in", exact: true })).toHaveCount(2); // header and footer
await expect(page.locator("#pricing").getByRole("link", { name: "Start free", exact: true })).toHaveCount(2);
await startFree.first().click();
await expect(page).toHaveURL("/login");

await page.getByRole("button", { name: "Continue to demo" }).click();
await expect(page.getByText("Enter your email address.", { exact: true })).toBeVisible();
await expect(page.getByText("Enter your password.", { exact: true })).toBeVisible();
await page.getByRole("textbox", { name: "Email address" }).fill("nexa@invalid");
await page.getByLabel("Password").fill("local-only");
await page.getByRole("button", { name: "Continue to demo" }).click();
await expect(page.getByText("Enter a valid email address.", { exact: true })).toBeVisible();

await page.getByRole("textbox", { name: "Email address" }).fill("person@example.com");
await page.getByRole("checkbox", { name: "Remember me" }).check();
await page.getByRole("button", { name: "Continue to demo" }).click();
await expect(page.getByRole("status")).toHaveText("Demo only—authentication is not connected.");
expect(await page.evaluate(() => ({ ...localStorage }))).toEqual({});
```

The executable test must verify all six promised CTA targets (hero, header Log in, header Start free, footer Log in, and two pricing links) use `/login`: retain the existing `expectEveryLinkToNavigate` checks for both visible link names, and retain the `#pricing` scoped assertion for its two `Start free` links.

Add a direct-route locale assertion with `page.addInitScript(() => localStorage.setItem("nexa-language:v1", "zh-CN"))`, then `page.goto("/login")`; assert `邮箱地址`, `密码`, `记住我`, `继续体验演示`, and the sole `English` destination toggle are visible while the English email field is absent. Submit blank Chinese fields and assert the localized email/password errors. Toggle to English, confirm the English control appears, and navigate `Back to homepage`; assert the English homepage heading to prove route navigation uses the one stored locale preference.

In the existing 375px Mobile Chrome test, navigate directly to `/login`, fill valid values, submit, and assert the status is visible. Measure the email input, password input, checkbox, submit, and language toggle; each must be at least 44 CSS pixels in its relevant interactive dimension (both for controls with box dimensions). Also assert `document.documentElement.scrollWidth <= window.innerWidth`. Run the exact focused desktop and mobile commands below.

- [ ] **Step 7: Make the focused browser evidence pass**

Run: `bun run test:e2e -- --project=chromium --grep "login placeholder|navigates the English marketing journey|persists Simplified Chinese"`

Expected: PASS. The output demonstrates all CTA targets reach `/login`, invalid and valid local form states, `role="status"` demo outcome, and both direct and navigated locale behavior without authenticated state.

Run: `bun run test:e2e -- --project="Mobile Chrome" --grep "login placeholder|marketing shell inside the viewport"`

Expected: PASS. The Mobile Chrome output demonstrates valid local submit visibility, 44px control targets, and no 375px horizontal overflow.

- [ ] **Step 8: Conduct exactly one independent review, then run the final full quality gate once**

Use `requesting-code-review` once for this completed task. Give the reviewer Issue #9 acceptance criteria, the changed-file list, the focused unit and both Playwright outputs, and these non-negotiable boundaries: no authentication/session/network/storage beyond the pre-existing locale preference; exactly one locale toggle; field-associated localized validation; and all promised CTAs targeting `/login`.

For each concrete review finding, use `receiving-code-review`; if it identifies a defect, use `systematic-debugging` before editing. Apply only justified fixes. Do not request a second independent review.

After all review fixes are complete, run exactly once: `devenv test --no-tui`

Expected: exit code 0 after frozen installation, Lefthook and workflow checks, Biome, TypeScript, unit tests, production build, desktop Chromium, and Mobile Chrome. Preserve its Mobile Chrome output as the final browser evidence.

- [ ] **Step 9: Update the graph and commit the independently testable task**

Run: `graphify update .`

Expected: the knowledge graph captures `LoginForm`, its locale/catalog dependencies, route composition, and browser tests with no generated authentication relationship.

```bash
git add src/components/login-form.tsx src/components/login-form.test.tsx src/i18n/catalog.ts src/app/login/page.tsx src/styles/globals.css tests/e2e/marketing-journey.spec.ts docs/superpowers/plans/2026-07-26-login-placeholder.md graphify-out
git commit -m "feat: complete local login placeholder"
```

## Self-Review

- Spec coverage: Task 1 covers the polished login route; email, password, and remember-me semantics; local missing/malformed validation; field-associated localized errors; valid no-auth outcome; every stated CTA target; direct-route and cross-route locale persistence; the single language toggle; unit and desktop/mobile browser evidence; exactly one independent review; and exactly one final canonical gate.
- Placeholder scan: No TBD/TODO, deferred implementation, or generic test instruction remains. The validation regex, state boundaries, catalogue fields, accessible DOM relationships, expected commands, and mobile assertions are explicit.
- Type consistency: `SiteCopy.login` supplies every `LoginForm` string, `LoginForm` consumes `useLocale`, `login-email-error` and `login-password-error` match their field associations, and the Playwright labels match the catalog values named by the component tests.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-26-login-placeholder.md`. Execute this one task with the existing issue workflow: one independent code review, then one final `devenv test --no-tui` verification run.
