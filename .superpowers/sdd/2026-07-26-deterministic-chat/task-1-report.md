# Task 1 Implementation Report

## Status

Implemented and locally verified the Issue #7 deterministic support-chat journey.
The controller still owns the single independent implementation review and the
one post-review `devenv test --no-tui` run.

## Commits

- `f623f67 feat: add deterministic support chat`
- This report is committed in the follow-up documentation commit.

## Changed files

- `docs/superpowers/plans/2026-07-26-deterministic-chat.md`
- `src/components/chat-state.ts`
- `src/components/chat-state.test.ts`
- `src/components/chat-shell.tsx`
- `src/components/chat-shell.test.tsx`
- `src/i18n/catalog.ts`
- `src/styles/globals.css`
- `tests/e2e/marketing-journey.spec.ts`
- `graphify-out/.graphify_labels.json`
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/graph.html`
- `graphify-out/graph.json`
- `graphify-out/manifest.json`
- `.superpowers/sdd/2026-07-26-deterministic-chat/task-1-report.md`

## Delivered behavior

- Added a pure deterministic reducer with explicit `welcome`, `input`,
  `typing`, `answered`, and `pending` phases.
- Added semantic, immutable in-memory messages for quick actions, visitor free
  text, and assistant intents.
- Added guarded submissions during typing and pending handoff.
- Replaced the static preview with a fixed lower-right launcher and labelled,
  non-modal support dialog.
- Added four quick actions, labelled free-text submission, a 600 ms local
  typing timer, live announcements, Escape close, focus return, and
  close/reopen preservation.
- Added exclusive English and Simplified Chinese chat copy resolved at render
  time from semantic state.
- Added responsive fixed-panel styling, 44 px controls, internal scrolling,
  long-text wrapping, visible focus reuse, hover/active feedback, and preserved
  reduced-motion behavior.
- Added recognized, fallback, reload-reset, no-chat-storage, Chinese-only,
  pending-handoff, axe, brand-translation, overflow, and mobile-browser
  coverage.

## TDD RED/GREEN evidence

### Pure state

- RED: `bun run test:unit -- src/components/chat-state.test.ts`
  - Exit 1.
  - Vitest failed specifically because `./chat-state` did not exist.
- GREEN: `bun run test:unit -- src/components/chat-state.test.ts`
  - Exit 0.
  - 1 file passed; 4 tests passed.

### Accessible component

- RED: `bun run test:unit -- src/components/chat-shell.test.tsx`
  - Exit 1.
  - Both tests failed because the old static preview had no accessible
    `Open support chat` button.
- Initial GREEN investigation:
  - Vitest 4.1.10 plus user-event 14.6.1 deadlocked under the literal default
    fake-timer setup, including in a disposable inert-button reproduction.
  - Bound, async, and restricted fake-timer adapters all reproduced the
    deadlock. This matches Testing Library user-event issue #1115 and its still
    open Vitest auto-detection PR #1304.
  - The controller authorized the smallest test-only correction:
    `vi.useFakeTimers({ shouldAdvanceTime: true })`. `userEvent` and every public
    semantic assertion remain intact.
  - The installed Testing Library version also required `within(dialog)` for
    scoped role queries.
- GREEN: `bun run test:unit -- src/components/chat-shell.test.tsx`
  - Exit 0.
  - 1 file passed; 2 tests passed.
- Combined focused GREEN:
  `bun run test:unit -- src/components/chat-state.test.ts src/components/chat-shell.test.tsx && bun run check && bun run typecheck`
  - Exit 0.
  - 2 files passed; 6 tests passed; Biome clean; TypeScript clean.

### Browser

- The first two focused attempts did not count as product RED:
  - The worktree lacked a local dependency tree required by Turbopack.
  - The worktree lacked its ignored project-local Chromium cache.
  - Corrected with `bun install --frozen-lockfile` and
    `bun run test:e2e:install`.
- Focused command:
  `bun run test:e2e -- --grep "local recognized and fallback chat journeys|mobile chat"`
  - Exit 0 once the environment was valid.
  - 4/4 passed across desktop and mobile Chromium. Because the component RED
    had already forced the implementation, these new focused journeys passed
    on their first valid browser execution rather than producing a product
    assertion RED.
- Integration RED: `bun run test:e2e`
  - Exit 1.
  - 40/42 passed.
  - Axe failed in both projects because the chat's semantic `<header>` created
    a duplicate page-level banner landmark.
- Evidence-driven fix:
  - Changed only the dialog's visual header wrapper from `<header>` to a neutral
    `<div>`; the dialog remains labelled by its `<h2>`.
- Targeted GREEN:
  `bun run test:e2e -- --grep "automated WCAG"`
  - Exit 0; 2/2 passed.
- Full browser GREEN: `bun run test:e2e`
  - Exit 0; 42/42 passed in 25.5 seconds.

## Mobile browser proof

The final Playwright output explicitly includes:

- `[mobile-chromium] completes local recognized and fallback chat journeys without persistence`
- `[mobile-chromium] keeps the mobile chat inside the viewport through pending handoff`

The mobile chat test sets a 375 px viewport, opens the English dialog, verifies
the launcher and dialog bounding boxes stay between x=0 and x=375, verifies
`document.documentElement.scrollWidth <= window.innerWidth`, completes
`Contact a human`, and observes the localized pending status. The same test
also passes in the desktop project, and the complete viewport matrix remains
green at 375 px, 768 px, and 1440 px for both locales.

## Final focused verification

- `bun run test:unit && bun run check && bun run typecheck`
  - Exit 0.
  - 7 unit-test files passed; 35 tests passed.
  - Biome checked 35 files with no fixes required.
  - TypeScript completed with no errors.
- `bun run test:e2e`
  - Exit 0.
  - 42/42 desktop/mobile Chromium tests passed.
- `git diff --check`
  - Exit 0 before the implementation commit.
- Pre-commit Lefthook/Biome
  - Exit 0; 7 staged source/test files checked.
- The full `devenv test --no-tui` gate was intentionally not run. The
  controller requested exactly one full run after independent review.

## Graph update

- Command: `graphify update .`
- Exit 0.
- Updated graph: 1,286 nodes, 1,268 edges, 179 communities.
- The graph now records `ChatShell()` connections to `transitionChat()` and
  `useLocale()`, plus the new chat state types and implementation plan.
- Graphify warned that `metadata.json`, `hooks.json`, and `skills-lock.json`
  produced zero nodes and remain absent from the graph. These are pre-existing
  metadata/config inputs rather than Task 1 source failures.

## Self-review

- Product boundary: no fetch, network client, LLM, service, authentication,
  database, API-key, contact collection, analytics, telemetry, or payment work.
- Persistence boundary: chat source contains no `localStorage`,
  `sessionStorage`, cookie, URL, or environment persistence. The existing
  language preference remains the only approved storage.
- Locale boundary: `ChatShell` reads one active `copy.chatShell` catalog and
  never renders paired bilingual localized nodes. E2E proves the Chinese
  launcher/fallback exist while the English equivalents do not.
- Reducer boundary: free text is trimmed and always maps to `fallback`; quick
  actions map to their semantic intent; typing/pending duplicate submissions
  return the identical state object; message IDs grow from message count.
- Accessibility boundary: native buttons/form/input, labelled non-modal
  dialog, labelled input, polite atomic status, disabled guarded controls,
  Escape close, launcher focus return, 44 px controls, visible focus,
  translation protection, and zero axe violations in both locales.
- React boundary: reducer is framework-free; the client component hoists static
  intents, derives display state during render, and cleans up its local timer
  and keyboard listener. No data-fetching or storage effect was introduced.
- UI review: checked against the fresh Vercel Web Interface Guidelines. Added
  input `name`/`autocomplete` and explicit hover/active feedback. URL-synced
  panel state was deliberately rejected because it conflicts with the
  authoritative page-memory-only/reset requirement.
- Mutation check: removing intent mapping, fallback mapping, typing/pending
  guards, close/reopen preservation, launcher/dialog semantics, disabled
  typing controls, local replies, reset behavior, locale exclusivity, pending
  status, viewport bounds, or axe compliance causes an existing test to fail.

## Concerns and handoff

- Independent implementation review is still required exactly once.
- The controller must run the one canonical `devenv test --no-tui` gate after
  any verified review fixes.
- The component test uses the controller-authorized
  `shouldAdvanceTime: true` test-only configuration because of the documented
  upstream Vitest/user-event deadlock.
- A concurrent Issue #6 dev server briefly occupied port 3000 and served its
  stale static preview. The Issue #6 agent confirmed it was no longer needed
  and stopped it before the fresh successful browser runs.
- Playwright/Next emitted repeated `NO_COLOR` versus `FORCE_COLOR` warnings;
  they did not affect test results.

## Independent review fix round

- The independent review identified that opening the non-modal dialog left focus
  on the launcher and that the mobile evidence asserted only horizontal bounds.
- RED: the new keyboard regression test failed because the opened dialog title
  did not have focus; the launcher remained focused.
- GREEN: the dialog title is now programmatically focusable and receives focus
  when the launcher opens the dialog. Escape still closes the dialog and returns
  focus to the launcher without adding a focus trap.
- The regression test covers keyboard Enter open, title focus, `aria-expanded`,
  `aria-modal="false"`, polite/atomic live status attributes, Escape closure,
  and restored launcher focus.
- The 375 px mobile test now asserts each launcher and dialog has positive
  width/height, non-negative x/y, and right/bottom edges within the 375 × 900
  viewport before completing the human-handoff pending journey.
- Fresh verification after the fix:
  - `bun run test:unit && bun run check && bun run typecheck`: exit 0;
    7 files and 36 tests passed, Biome clean, TypeScript clean.
  - `bun run test:e2e -- --grep "mobile chat"`: exit 0; desktop and
    `mobile-chromium` cases passed.
  - `bun run test:e2e`: exit 0; 42/42 cases passed.
  - `graphify update .`: exit 0; no code-graph topology changes, with the
    existing three zero-node metadata/config warnings retained.
- The independent review was not re-requested, and `devenv test --no-tui`
  remains intentionally deferred to the controller's single post-review gate.
