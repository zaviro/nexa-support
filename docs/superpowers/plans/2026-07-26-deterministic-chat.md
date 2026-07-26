# Deterministic Support Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static chat preview with an accessible lower-right launcher and a localized, deterministic, entirely client-side support-chat journey.

**Architecture:** Keep all chat state in one pure reducer module and keep the client boundary in `ChatShell`, which already composes at the end of `MarketingHome`. The reducer stores only the current in-memory conversation and a pending reply intent; `ChatShell` maps its semantic message keys to the existing locale catalog and uses one local timer to make the typing state perceptible. No route, API, storage adapter, server action, authentication flow, or remote service is introduced.

**Tech Stack:** Next.js App Router, React 19, TypeScript, existing locale provider/catalog, CSS, Vitest with Testing Library, and Playwright with axe-playwright.

## Global Constraints

- This is a local portfolio demo: do not call, configure, mock, or depend on an LLM, API, service, authentication provider, database, analytics endpoint, payment provider, or network endpoint.
- Do not add an API-key input or API-key handling; that presentation-only work belongs to Issue #8.
- Use the existing one-button locale toggle. At any time, expose only English or only Simplified Chinese chat copy and accessible names; do not render mixed bilingual chat UI.
- Keep chat history in React memory only. Do not read from or write to `localStorage`, `sessionStorage`, cookies, URL parameters, or an environment file; reloading must reset the conversation.
- Cover exactly four localized quick actions: pricing, refunds, product features, and contact a human. All free text, including text resembling a known topic, receives the deterministic localized fallback.
- The reducer must make `welcome`, `input`, `typing`, `answered`, and `pending` explicit phases. It must ignore a new submission while `typing` or `pending`.
- The accessible status must announce typing, the delivered reply, and pending human handoff. The non-modal panel must have a labelled dialog, Escape close behavior, focus return to the launcher, visible focus, and controls at least 44px in both dimensions.
- Preserve the existing `prefers-reduced-motion` override and keep the page free of horizontal overflow at 375px, 768px, and 1440px.
- Do not disturb the language-preference persistence already owned by `src/i18n/locale-storage.ts`; it is the only approved browser storage in this issue’s UI.

## File Structure

- Create `src/components/chat-state.ts`: pure chat types, initial state, deterministic reducer, and no React or browser APIs.
- Create `src/components/chat-state.test.ts`: reducer-level RED/GREEN coverage for recognized quick actions, unknown free text, pending guards, and open/close preservation.
- Modify `src/components/chat-shell.tsx`: client-only launcher/dialog behavior, local reply timer, locale lookup, focus management, and reducer integration.
- Create `src/components/chat-shell.test.tsx`: public component behavior for launcher semantics, typing duplicate prevention, local reply, and preserved in-memory messages.
- Modify `src/i18n/catalog.ts`: add typed English and Simplified Chinese labels, quick-action names, replies, fallback, and live-status copy under `chatShell`.
- Modify `src/styles/globals.css`: replace the static preview styles with responsive fixed launcher/dialog, message, status, and control styles.
- Modify `tests/e2e/marketing-journey.spec.ts`: replace the preview-specific tablet assertion with recognized-intent, fallback, refresh-reset, locale, accessibility, and 375px mobile browser evidence.

---

### Task 1: Deliver and verify the local deterministic chat journey

**Files:**

- Create: `src/components/chat-state.ts`
- Create: `src/components/chat-state.test.ts`
- Modify: `src/components/chat-shell.tsx`
- Create: `src/components/chat-shell.test.tsx`
- Modify: `src/i18n/catalog.ts`
- Modify: `src/styles/globals.css`
- Modify: `tests/e2e/marketing-journey.spec.ts`

**Interfaces:**

- Produces: `ChatIntent = "pricing" | "refunds" | "features" | "human" | "fallback"`.
- Produces: `ChatPhase = "welcome" | "input" | "typing" | "answered" | "pending"`.
- Produces: `ChatState` with `isOpen`, `phase`, `draft`, `pendingIntent`, and immutable semantic `messages`; messages carry either a visitor free-text value, a visitor quick-action intent, or an assistant reply intent.
- Produces: `initialChatState` and `transitionChat(state: ChatState, event: ChatEvent): ChatState`; `submit` moves a non-empty draft or quick action to `typing`, `resolve` appends a deterministic assistant reply, and guarded submissions leave the state unchanged.
- Consumes: `useLocale(): { locale; copy; setLocale }` and `copy.chatShell`; locale selection changes visible chat copy without persisting conversation data.
- Produces: `ChatShell(): JSX.Element`, a launcher button plus a labelled non-modal dialog while open. Closing and reopening keeps the current reducer state during the page lifetime; a page reload initializes `initialChatState`.

- [ ] **Step 1: Write the failing pure-state tests before creating the reducer**

Create `src/components/chat-state.test.ts` with these public state contracts. The last assertion names the production change that would break the test: removing the pending/typing guards from `transitionChat`.

```ts
import { describe, expect, test } from "vitest";
import { initialChatState, transitionChat } from "./chat-state";

describe("deterministic chat state", () => {
  test("answers a pricing quick action after the local typing state", () => {
    const typing = transitionChat(initialChatState, {
      type: "submit",
      intent: "pricing",
    });
    const answered = transitionChat(typing, { type: "resolve" });

    expect(typing.phase).toBe("typing");
    expect(answered.phase).toBe("answered");
    expect(answered.messages).toMatchObject([
      { sender: "visitor", intent: "pricing" },
      { sender: "assistant", intent: "pricing" },
    ]);
  });

  test("turns arbitrary submitted text into the localized fallback intent", () => {
    const typing = transitionChat(initialChatState, {
      type: "submit",
      text: "Where is the export endpoint?",
    });
    const answered = transitionChat(typing, { type: "resolve" });

    expect(answered.messages.at(-1)).toMatchObject({
      sender: "assistant",
      intent: "fallback",
    });
  });

  test("keeps the first request while a reply is typing or human handoff is pending", () => {
    const typing = transitionChat(initialChatState, {
      type: "submit",
      intent: "human",
    });
    const ignoredWhileTyping = transitionChat(typing, {
      type: "submit",
      intent: "pricing",
    });
    const pending = transitionChat(typing, { type: "resolve" });
    const ignoredWhilePending = transitionChat(pending, {
      type: "submit",
      intent: "refunds",
    });

    expect(ignoredWhileTyping).toBe(typing);
    expect(pending.phase).toBe("pending");
    expect(ignoredWhilePending).toBe(pending);
  });

  test("preserves messages when the launcher closes and reopens", () => {
    const answered = transitionChat(
      transitionChat(
        transitionChat(initialChatState, { type: "submit", intent: "features" }),
        { type: "resolve" },
      ),
      { type: "close" },
    );
    const reopened = transitionChat(answered, { type: "open" });

    expect(reopened.isOpen).toBe(true);
    expect(reopened.messages).toEqual(answered.messages);
  });
});
```

- [ ] **Step 2: Run the focused state test and verify RED**

Run: `bun run test:unit -- src/components/chat-state.test.ts`

Expected: FAIL because `./chat-state` does not exist. Do not create production code until the failure is specifically the missing module.

- [ ] **Step 3: Implement the minimal pure state machine**

Create `src/components/chat-state.ts` without React, timer, DOM, storage, or fetch imports. Use semantic message content rather than localized strings so changing locale changes the rendered text without mutating state. Implement the explicit event and guard shape below; `submit` must trim free text and ignore an empty submission, while all non-quick-action text queues `fallback`.

```ts
export type ChatIntent =
  | "pricing"
  | "refunds"
  | "features"
  | "human"
  | "fallback";
export type ChatPhase = "welcome" | "input" | "typing" | "answered" | "pending";
export type ChatMessage =
  | {
      id: number;
      sender: "visitor";
      intent: Exclude<ChatIntent, "fallback">;
    }
  | { id: number; sender: "visitor"; text: string }
  | { id: number; sender: "assistant"; intent: ChatIntent };

export type ChatEvent =
  | { type: "open" }
  | { type: "close" }
  | { type: "change"; value: string }
  | { type: "submit"; intent?: Exclude<ChatIntent, "fallback">; text?: string }
  | { type: "resolve" };

export type ChatState = {
  isOpen: boolean;
  phase: ChatPhase;
  draft: string;
  pendingIntent: ChatIntent | null;
  messages: readonly ChatMessage[];
};
```

Assign a monotonic message id from the current message count, append a visitor message at `submit`, and append the assistant message at `resolve`. `resolve` sets `pending` only for `human`; all other replies set `answered`. `close` and `open` alter only `isOpen`, thereby preserving draft and messages. `change` moves an opened, non-guarded conversation to `input`; it must not override `typing` or `pending`.

- [ ] **Step 4: Run the reducer test and verify GREEN**

Run: `bun run test:unit -- src/components/chat-state.test.ts`

Expected: all four tests pass, proving the response path is deterministic and the duplicate-request guard is observable without a browser.

- [ ] **Step 5: Write the failing accessible chat-shell component tests**

Create `src/components/chat-shell.test.tsx`. Use `LocaleProvider`, `userEvent`, and Vitest fake timers; do not mock the reducer or locale provider. The test should interact only through public button, dialog, textbox, and live-status semantics.

```tsx
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { ChatShell } from "./chat-shell";

afterEach(() => vi.useRealTimers());

describe("ChatShell", () => {
  test("announces a local pricing reply and prevents duplicate submission while typing", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<LocaleProvider><ChatShell /></LocaleProvider>);

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    const dialog = screen.getByRole("dialog", { name: "Nexa Support" });
    await user.click(dialog.getByRole("button", { name: "Pricing" }));

    expect(dialog.getByRole("status")).toHaveTextContent("Nexa Support is typing");
    expect(dialog.getByRole("button", { name: "Refunds" })).toBeDisabled();
    await act(async () => vi.advanceTimersByTime(600));

    expect(dialog.getByText("Starter is ¥99/month and Pro is ¥299/month in this local demo.")).toBeVisible();
  });

  test("keeps a completed message when the panel closes and opens again", async () => {
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<LocaleProvider><ChatShell /></LocaleProvider>);

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(screen.getByRole("button", { name: "Product features" }));
    await act(async () => vi.advanceTimersByTime(600));
    await user.click(screen.getByRole("button", { name: "Close support chat" }));
    await user.click(screen.getByRole("button", { name: "Open support chat" }));

    expect(screen.getByText("Nexa Support demonstrates AI answers, human handoff, and support analytics.")).toBeVisible();
  });
});
```

- [ ] **Step 6: Run the focused component test and verify RED**

Run: `bun run test:unit -- src/components/chat-shell.test.tsx`

Expected: FAIL because the current static shell exposes neither the launcher nor the dialog/quick-action contract. Correct only test setup failures; do not make the test pass by weakening its public assertions.

- [ ] **Step 7: Implement localization and the minimal client shell**

Extend `SiteCopy["chatShell"]` in `src/i18n/catalog.ts` so both locales include this exact typed shape:

```ts
chatShell: {
  title: string;
  launcherOpen: string;
  launcherClose: string;
  welcome: string;
  inputLabel: string;
  inputPlaceholder: string;
  send: string;
  typing: string;
  pending: string;
  quickActions: Record<"pricing" | "refunds" | "features" | "human", string>;
  replies: Record<ChatIntent, string>;
}
```

Use these English copy values and natural Simplified Chinese equivalents in the same fields: launcher `Open support chat` / `Close support chat`; quick actions `Pricing`, `Refunds`, `Product features`, `Contact a human`; welcome `Hi — choose a topic or type a question. This demo replies locally.`; typing `Nexa Support is typing…`; pending `Demo human handoff pending. No contact details are collected.`; pricing reply `Starter is ¥99/month and Pro is ¥299/month in this local demo.`; refund reply `Refund requests are reviewed by a teammate; this demo does not collect account details.`; features reply `Nexa Support demonstrates AI answers, human handoff, and support analytics.`; human reply `You are in the demo handoff queue. No contact details are collected.`; fallback reply `I can help with pricing, refunds, product features, or a human handoff in this demo.`

Convert `ChatShell` to a `"use client"` component that uses `useReducer(transitionChat, initialChatState)` and `useLocale()`. It must:

- render a 44px-or-larger lower-right launcher with `aria-expanded` and the destination action name;
- conditionally render `role="dialog"`, `aria-modal="false"`, and an accessible `Nexa Support` title while opened;
- render the welcome, semantic message history, four quick-action native buttons, a native `<form>` with labelled `<input>`, and an `aria-live="polite" aria-atomic="true"` `role="status"` element;
- dispatch only a local `window.setTimeout` at 600ms when `phase === "typing"`, clear it on effect cleanup, and dispatch `{ type: "resolve" }`; never call `fetch`, use a server action, or create a network client;
- disable quick actions, input, and submit controls in `typing` and `pending`, and have the reducer discard duplicate submit events as its second guard;
- close on Escape, return focus to the launcher after close, and preserve messages on close/reopen; do not focus-trap because the dialog is non-modal;
- map assistant intents and visitor quick-action intents through `copy.chatShell`, while visitor free text is rendered as text rather than HTML.

Replace the old preview CSS in `src/styles/globals.css` with a fixed, right/bottom launcher and a fixed panel above it. Give the panel `width: min(24rem, calc(100vw - 2rem))`, a `max-height` based on `100dvh`, an internally scrollable message area, word breaking for free text, and no fixed child width that can overflow. At the existing narrow breakpoint retain the fixed launcher/dialog pattern instead of changing `.chat-shell` to document-flow preview content. Reuse the project focus style and reduced-motion rule; do not add animation that depends on motion.

- [ ] **Step 8: Run focused unit, formatting, and type checks and verify GREEN**

Run: `bun run test:unit -- src/components/chat-state.test.ts src/components/chat-shell.test.tsx && bun run check && bun run typecheck`

Expected: both new test files pass, Biome reports no formatting/lint errors, and TypeScript reports no type errors.

- [ ] **Step 9: Write the failing end-to-end recognized, fallback, reset, locale, and mobile evidence**

In `tests/e2e/marketing-journey.spec.ts`, replace `keeps the tablet chat preview clear of the support route` with the following public journey. Keep the existing axe and language-persistence coverage; expand the language journey to assert the Chinese launcher and Chinese fallback response so chat copy is proven single-locale.

```ts
test("completes local recognized and fallback chat journeys without persistence", async ({ page }) => {
  await page.goto("/");
  const storageBefore = await page.evaluate(() => ({ ...localStorage }));
  await page.getByRole("button", { name: "Open support chat" }).click();
  const chat = page.getByRole("dialog", { name: "Nexa Support" });

  await chat.getByRole("button", { name: "Pricing" }).click();
  await expect(chat.getByRole("status")).toHaveText(/typing/i);
  await expect(chat.getByText("Starter is ¥99/month and Pro is ¥299/month in this local demo.")).toBeVisible();

  await chat.getByRole("textbox", { name: "Your question" }).fill("Where is the export endpoint?");
  await chat.getByRole("button", { name: "Send" }).click();
  await expect(chat.getByText("I can help with pricing, refunds, product features, or a human handoff in this demo.")).toBeVisible();
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(storageBefore);

  await page.reload();
  await page.getByRole("button", { name: "Open support chat" }).click();
  await expect(chat.getByText("Where is the export endpoint?")).toHaveCount(0);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(storageBefore);
});
```

Add a second browser test that sets a 375px-wide viewport, opens the English panel, verifies both the launcher and dialog remain within the viewport and `document.documentElement.scrollWidth <= window.innerWidth`, completes `Contact a human`, and checks the pending status. This test runs in the configured `mobile-chromium` Pixel 7 project as well as desktop Chromium, providing recorded mobile-browser evidence in the normal Playwright report. Add the chat dialog to the existing axe loop after it is opened in both locales, and extend the brand-name translation check so the dialog title keeps `translate="no"`.

- [ ] **Step 10: Run focused browser tests and verify RED**

Run: `bun run test:e2e -- --grep "local recognized and fallback chat journeys|mobile chat"`

Expected: FAIL against the static preview because it has no launcher, dialog, or local reply journey. If it fails for a stale development server, stop it and rerun before changing product code.

- [ ] **Step 11: Make only evidence-driven semantic and responsive corrections, then run the browser suite**

Run: `bun run test:e2e`

Expected: both `desktop-chromium` and `mobile-chromium` pass the recognized, fallback, pending-handoff, locale, axe, overflow, and 375px evidence. Confirm the Playwright output explicitly includes the new mobile chat test under `mobile-chromium`.

- [ ] **Step 12: Request exactly one independent implementation code review**

Request one fresh reviewer to inspect the completed Task 1 diff against Issue #7 and this plan. The review must specifically check for prohibited persistence/network/API-key work, reducer guard correctness, locale exclusivity, accessible dialog/live-status behavior, and the mobile browser assertions. Address only verified review findings, with TDD for any behavior correction; do not open a second implementation review for this task.

- [ ] **Step 13: Run final graph and full quality verification after review fixes**

Run: `graphify update .`

Expected: the repository graph updates successfully after the code changes.

Run: `devenv test --no-tui`

Expected: frozen install, configuration validation, Biome, TypeScript, unit tests, production build, and the complete desktop/mobile Chromium suite all exit 0. This is the final full gate; do not claim completion from earlier focused checks.

- [ ] **Step 14: Commit the independently reviewed implementation**

```bash
git add src/components/chat-state.ts src/components/chat-state.test.ts src/components/chat-shell.tsx src/components/chat-shell.test.tsx src/i18n/catalog.ts src/styles/globals.css tests/e2e/marketing-journey.spec.ts graphify-out
git commit -m "feat: add deterministic support chat"
```

## Plan Self-Review

- Spec coverage: Task 1 covers launcher open/close preservation, four localized quick actions, deterministic free-text fallback, explicit reducer phases and pending guards, duplicate prevention, live announcements, no chat persistence, reducer tests, recognized/fallback browser journeys, and mobile evidence.
- Deliberate exclusions: no real LLM, service, network request, API key, authentication, contact collection, database, telemetry, or persistence is planned. The pre-existing language preference remains the only approved storage.
- Task boundary: the complete reducer, UI, localization, style, tests, review, and final full gate form one independently testable implementation deliverable, so execution has exactly one independent implementation review.
- Placeholder and consistency check: all referenced file paths, interfaces, state names, command lines, public English test copy, and expected results are defined above; no later step depends on an undefined function or a separate task.
