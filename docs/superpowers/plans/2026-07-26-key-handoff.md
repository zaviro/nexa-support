# Safe API-Key Presentation and Human Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the deterministic local chat with a localized fictional human queue and a clearly non-functional, masked OpenAI API-key demonstration field that never handles a real secret.

**Architecture:** Keep all behavior inside the existing client `ChatShell`; the existing pure reducer continues to own semantic chat messages and the `pending` human-handoff phase, while component-local React state owns the visible settings disclosure and API-key draft. The localized catalog supplies every new visible string, CSS extends the fixed responsive dialog, and unit plus Playwright tests prove both user behavior and the absence of application network activity. No route, server action, API client, environment variable, storage adapter, authentication, or remote service is introduced.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind-generated global CSS, Vitest + Testing Library, Playwright + axe-playwright, Bun, devenv.

## Global Constraints

- This is a local fictional portfolio demo: do not call, configure, mock, or depend on an LLM, OpenAI, API, service, server action, analytics endpoint, authentication provider, database, payment provider, or any network endpoint.
- The OpenAI API-key field is presentation-only. Never send, validate, log, transform, persist, put in an environment variable, or otherwise expose its value; do not add `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`, a network client, a route handler, or any secret-related dependency.
- Show a visible localized `Demo / not connected` warning next to the field and explicitly tell users not to enter a real secret in both the UI and `README.md`.
- Keep the field only in `ChatShell` component memory. Clear it and close the settings disclosure whenever the chat closes through the launcher or Escape; refresh naturally remounts the component with an empty value. Do not use `localStorage`, `sessionStorage`, cookies, URL parameters, forms that submit remotely, or environment files. The existing `nexa-language:v1` locale preference remains the only approved browser storage.
- Retain the existing one-button English / Simplified Chinese locale toggle. At any time show exactly one locale’s chat text and accessible names; do not add a second language control or mixed bilingual UI.
- Selecting `Contact a human` remains deterministic and collects no contact details. Its localized pending state and assistant reply must identify a fictional queue position and expected response time, not imply a real support operation.
- Preserve the non-modal labelled dialog, polite atomic live status, Escape close and launcher-focus return, visible focus styles, `prefers-reduced-motion` override, and controls at least 44px in both dimensions.
- Preserve no-horizontal-overflow behavior at 375px, 768px, and 1440px. The final browser evidence must include the configured `mobile-chromium` project.

## File Structure

- Modify `src/components/chat-shell.tsx`: add component-local settings/key state, accessible settings disclosure, secure input attributes, centralized close cleanup, and no side-effect other than the existing local reply timer.
- Modify `src/components/chat-shell.test.tsx`: add public UI tests for the localized warning, password masking, component-memory clearing, and no `fetch` call after key entry.
- Modify `src/i18n/catalog.ts`: extend the typed `chatShell` copy for the settings control, API-key input, explicit demo warning, and concrete fictional human queue copy in English and Simplified Chinese.
- Modify `src/styles/globals.css`: style the settings trigger/panel, warning, and masked-field layout inside the existing fixed responsive chat shell without reducing target sizes or causing overflow.
- Modify `tests/e2e/marketing-journey.spec.ts`: cover the English and Chinese handoff state, masked key input, warning, close/refresh clearing, absence of post-entry app requests, axe coverage, and explicit 375px mobile viewport evidence.
- Modify `README.md`: replace the obsolete scaffold-only statement with a short accurate demo/security notice that says the chat is local and users must not enter a real API key or secret.

---

### Task 1: Deliver and verify safe demo-key presentation and fictional human handoff

**Files:**

- Modify: `src/components/chat-shell.tsx`
- Modify: `src/components/chat-shell.test.tsx`
- Modify: `src/i18n/catalog.ts`
- Modify: `src/styles/globals.css`
- Modify: `tests/e2e/marketing-journey.spec.ts`
- Modify: `README.md`

**Interfaces:**

- Consumes: existing `ChatState`, `transitionChat`, and `ChatPhase = "welcome" | "input" | "typing" | "answered" | "pending"` from `src/components/chat-state.ts`; do not add API-key data to the reducer or message history.
- Consumes: `useLocale(): { locale; copy; setLocale }` and the existing one-button locale selection; all new strings are read from `copy.chatShell`.
- Extends `SiteCopy["chatShell"]` with `settingsOpen`, `settingsClose`, `settingsLabel`, `apiKeyLabel`, `apiKeyPlaceholder`, `apiKeyWarning`, and `apiKeyDoNotUseRealSecret`, plus revised `pending` and `replies.human` values.
- Produces: `ChatShell(): JSX.Element` with only two ephemeral component-local values: `isSettingsOpen: boolean` and `apiKeyDraft: string`. `apiKeyDraft` is bound to exactly one native `type="password"` input and is reset to `""` by the shared chat-close action and initial render.
- Produces: an accessible fictional human-handoff result with no data-collection fields, queue position `3`, and an expected response time of `about 2 minutes` (with natural Simplified Chinese equivalents).

- [ ] **Step 1: Write failing component tests for the public security and handoff contract**

  Extend `src/components/chat-shell.test.tsx` using `LocaleProvider`, `userEvent`, and the existing fake-timer setup. Interact only through roles, labels, and DOM properties; do not inspect React state or mock the reducer/locale provider. Add these tests after the existing tests:

  ```tsx
  test("shows a masked demo-only key field, never fetches, and clears it when chat closes", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(screen.getByRole("button", { name: "Open chat settings" }));
    const keyInput = screen.getByLabelText("OpenAI API key — demo only");

    expect(keyInput).toHaveAttribute("type", "password");
    expect(screen.getByText("Demo / not connected")).toBeVisible();
    expect(screen.getByText("Do not enter a real secret.")).toBeVisible();
    await user.type(keyInput, "sk-not-a-real-key");
    expect(keyInput).toHaveValue("sk-not-a-real-key");
    expect(fetchSpy).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Close support chat" }));
    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(screen.getByRole("button", { name: "Open chat settings" }));
    expect(screen.getByLabelText("OpenAI API key — demo only")).toHaveValue("");
  });

  test("announces a concrete fictional human queue without collecting contact details", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(screen.getByRole("button", { name: "Contact a human" }));
    await act(async () => vi.advanceTimersByTime(600));

    const dialog = screen.getByRole("dialog", { name: "Nexa Support" });
    expect(dialog.getByRole("status")).toHaveTextContent(
      "Demo handoff queue: position 3, expected response in about 2 minutes. No contact details are collected.",
    );
    expect(dialog.queryByLabelText(/email|phone|contact/i)).toBeNull();
  });
  ```

  Add `afterEach(() => vi.unstubAllGlobals())` alongside the existing timer cleanup. The first test must be RED because the current shell has no settings control or key field; the second must be RED because current copy lacks the required specific queue estimate.

- [ ] **Step 2: Run focused component tests and verify RED**

  Run:

  ```bash
  bun run test:unit -- src/components/chat-shell.test.tsx
  ```

  Expected: FAIL on missing `Open chat settings` and the absent concrete handoff copy. Do not weaken the public accessible-name, password-type, clearing, no-fetch, or no-contact assertions to accommodate the old UI.

- [ ] **Step 3: Add typed localized demo and queue copy**

  In `src/i18n/catalog.ts`, extend `SiteCopy["chatShell"]` and both catalog entries with the exact semantic fields named in **Interfaces**. Use these English values exactly:

  ```ts
  settingsOpen: "Open chat settings",
  settingsClose: "Close chat settings",
  settingsLabel: "Demo integration settings",
  apiKeyLabel: "OpenAI API key — demo only",
  apiKeyPlaceholder: "sk-…",
  apiKeyWarning: "Demo / not connected",
  apiKeyDoNotUseRealSecret: "Do not enter a real secret.",
  pending:
    "Demo handoff queue: position 3, expected response in about 2 minutes. No contact details are collected.",
  replies: {
    // retain pricing, refunds, features, and fallback values
    human:
      "You are in fictional demo queue position 3. A teammate would respond in about 2 minutes; no contact details are collected.",
  },
  ```

  Supply natural Simplified Chinese equivalents in the parallel `"zh-CN"` object, including an explicit warning not to enter a real secret, `演示 / 未连接`, queue position `3`, expected response `约 2 分钟`, and no-contact-data language. Do not change the existing language-provider API, add language state, or interpolate a key value into any copy.

- [ ] **Step 4: Implement the component-local settings surface and close cleanup**

  In `src/components/chat-shell.tsx`:

  1. Import `useState` and initialize `const [isSettingsOpen, setIsSettingsOpen] = useState(false)` and `const [apiKeyDraft, setApiKeyDraft] = useState("")` inside `ChatShell`. Do not place either value in `ChatState`, a ref intended for persistence, context, storage, or an environment variable.
  2. Create one `closeChat()` callback that dispatches `{ type: "close" }`, calls `setApiKeyDraft("")`, and calls `setIsSettingsOpen(false)`. Use it for the open launcher’s close branch and Escape handler before returning focus to `launcherRef`; opening the chat must not restore an earlier key.
  3. In the chat header, add one native `type="button"` settings trigger with `aria-controls="chat-demo-settings"`, `aria-expanded={isSettingsOpen}`, and its accessible name from `copy.chatShell.settingsOpen` or `copy.chatShell.settingsClose`. It changes only `isSettingsOpen`. It is not a second locale control.
  4. When settings are open, render a labelled region such as `<section aria-label={copy.chatShell.settingsLabel} id="chat-demo-settings">` containing a native `<label htmlFor="chat-api-key">`, a controlled `<input>`, and visible warning text. The input must use all of `id="chat-api-key"`, `type="password"`, `value={apiKeyDraft}`, `onChange={(event) => setApiKeyDraft(event.currentTarget.value)}`, `autoComplete="off"`, `spellCheck={false}`, `inputMode="text"`, and `placeholder={copy.chatShell.apiKeyPlaceholder}`. It must have no `name` attribute, no form submission handler, and no effect triggered by its value.
  5. Render both warning strings in the settings region at all times it is open; do not hide the `Demo / not connected` label in a tooltip, placeholder, aria-only text, or after input. Do not display the typed key elsewhere, derive a key preview, call `console`, or branch on its content.
  6. Continue using the existing reducer’s `human → pending` transition. Render the revised localized `pending` live status and `replies.human` message only; do not add contact inputs, a submit action, or any real queue request.

  Do not change the existing local 600ms reply timer except to preserve its cleanup. The finished module must have no import or reference to `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`, `console`, `process.env`, `localStorage`, `sessionStorage`, cookies, a server action, or a network library.

- [ ] **Step 5: Extend responsive settings styles without weakening existing chat behavior**

  In `src/styles/globals.css`, add focused styles under the existing `.chat-shell` block:

  - Make the header accommodate the existing brand/title and new settings trigger without fixed-width children; use a layout that can wrap at 375px.
  - Give the settings trigger, key input, and any close/settings button `min-width: 2.75rem` and `min-height: 2.75rem`; reuse the project button/input focus treatment and `touch-action: manipulation`.
  - Add a bordered `.chat-shell__settings` region and a visually distinct but normal-text-AA warning treatment for the `Demo / not connected` and do-not-use-real-secret copy. Allow warning text to wrap with `overflow-wrap: anywhere`.
  - Make the key input `min-width: 0; width: 100%` inside a grid/flex item so its password content cannot cause horizontal overflow.
  - Keep the shell fixed, its current `width: min(24rem, calc(100vw - 2rem))`, `100dvh`-based maximum height, internally scrollable messages, launcher position, existing hover/focus styles, and the global reduced-motion override intact.

- [ ] **Step 6: Run focused unit, formatting, and type checks and verify GREEN**

  Run:

  ```bash
  bun run test:unit -- src/components/chat-shell.test.tsx
  bun run check
  bun run typecheck
  ```

  Expected: all chat-shell tests pass; Biome and TypeScript exit 0. The test suite proves the key is masked, warning copy is visible, no component `fetch` call occurs, close clears the value, and a human handoff is a specific fictional queue without contact collection.

- [ ] **Step 7: Update durable user documentation with the real-secret warning**

  In `README.md`, replace the first paragraph’s obsolete claim that the product is unimplemented with a concise current-project description. Add a `## Demo security` section with this Chinese warning:

  ```md
  聊天窗中的 OpenAI API Key 输入框仅用于展示未来集成位置，未连接、不会发送、校验、记录、保存或写入环境变量。请勿输入真实 API Key 或任何真实密钥。
  ```

  State in the same section that the human handoff is fictional, uses only a local queue estimate, and collects no contact details. Do not document any setup path that would cause a user to supply a secret.

- [ ] **Step 8: Add failing end-to-end safety, localization, and mobile evidence**

  Extend `tests/e2e/marketing-journey.spec.ts` with these public journeys; retain the existing locale persistence and general axe tests.

  1. Add an English key/handoff test that loads `/`, opens chat and settings, asserts the input is `type="password"`, sees `Demo / not connected` and `Do not enter a real secret.`, types `sk-not-a-real-key`, then asserts no application-originated request occurs. Register the request listener after `page.goto` and ignore only the known development HMR path `/_next/webpack-hmr`; after a 250ms observation window, assert the recorded request list is empty. Then close/reopen settings and assert the field is empty; reload, reopen chat/settings, and assert it is empty again.
  2. In that journey, select `Contact a human`, wait for the status, and assert exactly the English position-3/about-two-minutes/no-contact string. Assert no email, phone, or contact textbox is present.
  3. Extend the existing Simplified Chinese locale journey: open the Chinese chat/settings surface, assert the Chinese warning and `type="password"`, select `联系人工`, assert the Chinese position-3/about-two-minutes/no-contact pending status, and assert the English settings warning and English handoff status have count zero. This proves the feature still uses the one global locale toggle rather than rendering mixed language text.
  4. Add a `mobile chat settings and handoff stay in the 375px viewport` test. Set `375 × 900`, open English chat and settings, assert the launcher, dialog, settings region, key input, and warning all have bounding boxes inside the viewport, then select human handoff and assert the status. Assert `document.documentElement.scrollWidth <= window.innerWidth`. This test must be runnable by both configured projects and its Playwright output must include `mobile-chromium`.
  5. In the existing axe loop, open settings as well as chat before each analysis, so both locales scan the new warning, password control, and labelled region. Extend the existing 44px product-control audit to include visible `.chat-shell button` and `.chat-shell input` after opening settings in both locales.

- [ ] **Step 9: Run focused browser evidence, fix only demonstrated defects, then run the browser suite**

  First run:

  ```bash
  bun run test:e2e -- --grep "demo key|human queue|mobile chat settings"
  ```

  Expected before the implementation is complete: RED because the settings region, masking contract, concrete queue copy, request assertion, or mobile controls do not yet exist. After implementing the preceding steps, run the same command and correct only observed test, semantics, responsive, or accessibility failures.

  Then run:

  ```bash
  bun run test:e2e
  ```

  Expected: all desktop and mobile browser tests pass. Confirm the output explicitly contains the new `mobile chat settings and handoff stay in the 375px viewport` test under `mobile-chromium`; that is the required mobile-browser evidence.

- [ ] **Step 10: Request exactly one independent implementation review**

  Request one fresh reviewer to inspect the completed Task 1 diff against Issue #8, this plan, and the focused unit/browser outputs. The reviewer must check all of the following:

  - no secret leaves `ChatShell` memory or appears in a reducer, message, locale string, storage, URL, environment file, log, or network request;
  - no LLM, OpenAI client, API route, server action, or network primitive was introduced;
  - the input is password-masked, visibly marked `Demo / not connected`, and explicitly says not to enter a real secret in both locales and the README;
  - launcher and Escape close paths both clear the input and settings disclosure;
  - human handoff remains localized, fictional, deterministic, specific about position/time, and free of contact collection;
  - only the existing single language toggle controls locale; dialog/live status, keyboard behavior, target sizes, axe assertions, and 375px mobile evidence remain valid.

  Address only verified findings. If a finding changes behavior, first add or strengthen a failing regression test, then make the smallest correction. Do not request a second independent review.

- [ ] **Step 11: Refresh the graph, run the final full quality gate, and commit**

  Run:

  ```bash
  graphify update .
  devenv test --no-tui
  ```

  Expected: graphify updates successfully; the final full `devenv test --no-tui` gate exits 0 after frozen install, configuration validation, Biome, TypeScript, all Vitest tests, production build, and complete desktop/mobile Playwright coverage. Do not claim completion from focused tests alone.

  Commit the independently reviewed result:

  ```bash
  git add README.md src/components/chat-shell.tsx src/components/chat-shell.test.tsx src/i18n/catalog.ts src/styles/globals.css tests/e2e/marketing-journey.spec.ts graphify-out
  git commit -m "feat: add safe chat key demo and handoff"
  ```

## Plan Self-Review

- Spec coverage: Task 1 covers localized fictional position/time handoff with no contact collection; an accessible password-masked OpenAI key field; visible `Demo / not connected` and do-not-use-real-secret UI copy; React-memory-only value handling; close and refresh clearing; no application request after typing; durable README warning; single-locale behavior; 44px controls; axe; and explicit 375px mobile browser evidence.
- Security boundary: the plan prohibits key transmission, validation, logging, persistence, environment usage, and all real LLM/network integration; it also states the exact source-level primitives that must not be introduced.
- Task boundary: source, copy, documentation, unit tests, browser evidence, one independent review, graph update, and the final full `devenv test --no-tui` gate form one independently testable deliverable. There is exactly one task and exactly one independent review.
- Placeholder and consistency check: every changed file, interface name, required copy value, test assertion, command, review criterion, and final verification command is defined above; no later step relies on an undefined helper or another task.
