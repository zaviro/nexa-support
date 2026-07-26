# Task 1 Implementation Report

## Status

- Implemented Issue #9 Task 1 as a presentation-only bilingual login form.
- Added local missing/malformed validation, field-associated localized errors,
  a native remember checkbox, and a truthful non-authenticated result.
- Preserved all six `/login` CTA targets, the single destination-named locale
  toggle, direct-route locale behavior, and English return navigation.
- Added responsive Signal Desk styling with 44px controls and verified the
  375px route has no horizontal overflow.
- Introduced no authentication, session, request, cookie, form storage, URL,
  environment, or secret behavior. The pre-existing locale preference remains
  the only storage interaction.
- Updated graphify to 1,336 nodes, 1,338 edges, and 189 communities.

## Commits

- `3853334 feat: complete local login placeholder`
- This report is committed in a follow-up documentation commit.

## Tests

- Component RED:
  `bun run test:unit -- src/components/login-form.test.tsx`
  - Exit 1 because `./login-form` did not exist.
- Component GREEN:
  `bun run test:unit -- src/components/login-form.test.tsx`
  - Exit 0; 1 file and 3 tests passed.
- Mobile browser RED:
  - The 375px contract failed with an 18.39px remember checkbox.
  - The native checkbox hit box was increased to 44×44 CSS pixels.
- Final focused desktop:
  `PLAYWRIGHT_BROWSERS_PATH=../../.cache/ms-playwright bunx playwright test --project=desktop-chromium --grep "login placeholder|navigates the English marketing journey|persists Simplified Chinese"`
  - Exit 0; 3/3 passed.
- Final focused mobile:
  `PLAYWRIGHT_BROWSERS_PATH=../../.cache/ms-playwright bunx playwright test --project=mobile-chromium --grep "login placeholder|marketing shell inside the viewport"`
  - Exit 0; 8/8 passed.
- Final component/static gate:
  `bun run test:unit -- src/components/login-form.test.tsx && bun run check && bun run typecheck && git diff --check`
  - Exit 0; 3/3 component tests passed, Biome checked 40 files, TypeScript
    completed without errors, and the diff had no whitespace errors.
- `graphify update .`
  - Exit 0; tracked report, HTML, JSON, and manifest outputs updated.
- Pre-commit Lefthook/Biome:
  - Exit 0; 6 staged source/test files checked.

## Concerns

- Exactly one independent implementation review remains for the controller.
- The controller must run the one canonical post-review
  `devenv test --no-tui`; it was intentionally not run here.
- The worktree initially lacked dependencies and its ignored Chromium cache.
  `bun install --frozen-lockfile` restored dependencies. The browser download
  retried after a TLS reset and then timed out, so focused tests used the main
  checkout's existing exact Playwright Chromium revision `1234`.
- Next/Playwright repeatedly emitted the existing `NO_COLOR` versus
  `FORCE_COLOR` warning; it did not affect the focused results.
- Graphify repeated its existing zero-node warning for `metadata.json`,
  `hooks.json`, and `skills-lock.json`.

## Review Fix Round

- Addressed the actionable first-frame locale finding in `d9821a9 fix: harden
  login locale and contrast`.
- Static login controls now use the established paired `LocalizedText` pattern,
  so the pre-hydration `html[data-locale]` stylesheet selects the stored
  language for labels, checkbox text, and submit text. Validation and result
  messages remain hydrated `useLocale()` output because they do not exist in
  the first frame.
- The language switcher now derives its destination from the document locale,
  which is set before paint, rather than the hydration-safe English React
  snapshot. A stored Chinese page therefore writes `en` when its visible
  destination is English.
- Corrected the login contrast failure with a 2px evergreen default border and
  `--error: #8a5948` for invalid borders and small error text. Browser evidence
  measures the rendered values against the actual surface: default border about
  9.68:1, invalid border and error text about 5.83:1. The coral inset remains a
  supplemental invalid-state cue rather than the sole indicator.

### Regression Evidence

- RED: the blocked-hydration browser test could not find the Chinese email
  field on a stored-`zh-CN` direct `/login` route; the form initially rendered
  English copy.
- RED: the language-switcher unit test clicked visible `English` under a
  pre-hydration Chinese document locale and observed stored `zh-CN`, not `en`.
- RED: the rendered default login border measured 1.468:1 against the surface,
  below the 3:1 non-text state threshold.
- GREEN unit/static:
  `bun run test:unit -- src/components/login-form.test.tsx src/components/site-header.test.tsx && bun run check && bun run typecheck && git diff --check`
  - Exit 0; 7 tests passed, Biome checked 40 files, TypeScript and whitespace
    checks passed.
- GREEN focused desktop:
  `PLAYWRIGHT_BROWSERS_PATH=../../.cache/ms-playwright bunx playwright test --project=desktop-chromium --grep "login placeholder|stored Chinese login|login field states|navigates the English marketing journey|persists Simplified Chinese"`
  - Exit 0; 5/5 passed, including pre-hydration copy/destination and rendered
    contrast measurements.
- GREEN focused mobile:
  `PLAYWRIGHT_BROWSERS_PATH=../../.cache/ms-playwright bunx playwright test --project=mobile-chromium --grep "login placeholder|marketing shell inside the viewport"`
  - Exit 0; 8/8 passed.
- `graphify update .`
  - Exit 0; refreshed graph outputs to 1,337 nodes, 1,344 edges, and 190
    communities.

### Scope Note

- Per controller instruction, this round did not run `devenv test --no-tui`
  and did not request a second independent review.
