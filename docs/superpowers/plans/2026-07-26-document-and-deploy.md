# Document and Deploy the Validated Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Issue #10-integrated Nexa Support portfolio into a reproducible, documented Vercel deployment with factual Chinese obstacle and URL evidence.

**Architecture:** Keep runtime behavior unchanged. The repository documentation becomes the durable setup, architecture, quality, branch-routing, and security reference; a separate Chinese report records only evidence-backed implementation obstacles. The existing `package.json` Node `24.x` engine and Bun lockfile remain the deployment contract; `vercel.json` retains its frozen Bun installation and gains an explicit `node --version && bun run build` build command so the deployed build log proves the runtime selected from `engines`. Vercel CLI links locally through the account already available to the worker, publishes previews from non-`main` refs and production only from `main`, and returns URLs that are recorded in Issue #11.

**Tech Stack:** Next.js 15, React 19, TypeScript, Bun 1.3.13, Node.js 24, devenv, Lefthook, GitHub Actions, Vercel CLI 57.0.0, GitHub CLI.

## Global Constraints

- This issue is blocked by #10. Do not edit documentation/configuration for this delivery, create an external deployment, or report a completion URL until #10 is integrated into the target history and `gh issue view 10 --json state --jq .state` returns `CLOSED`.
- The external Vercel deployment occurs only after the reviewed Issue #11 documentation/configuration commit has a fresh, clean `devenv test --no-tui` exit code of 0; focused checks, an earlier #10 run, or a stale HANDOFF result do not qualify.
- Preserve the deployment contract: `package.json` declares `"node": "24.x"`; `vercel.json` declares `"framework": "nextjs"`, `"installCommand": "bun install --frozen-lockfile"`, and `"buildCommand": "node --version && bun run build"`; do not add a `functions` block, a Bun Functions Runtime opt-in, build/runtime environment variables, analytics, telemetry, cookies, Sentry, credentials, secrets, or new runtime dependencies.
- `main` is the only production source. A non-`main` branch may receive a Vercel preview; use `bunx vercel deploy --yes` for previews and use `bunx vercel deploy --prod --yes` only after the exact reviewed commit is checked out on `main`.
- Use any already-authorized Vercel CLI session or existing project access. Do not request, print, save, commit, or pass a token. `.vercel/` is local ignored linkage metadata and must remain untracked.
- The obstacle report is Chinese and factual: every entry must name an actually observed obstacle, its concrete impact, the applied resolution, and a command/log/commit/URL reference. Omit uneventful phases and hypothetical risks.
- Do not invent a deployment URL. If `bunx vercel whoami`, project linking, or deployment is denied because no authorized account/team/project access exists, preserve the successful local evidence and report that specific external authorization block in Issue #11; this is the only acceptable no-URL outcome.

## File Structure

- Modify: `README.md` — durable Chinese/English-facing contributor documentation for the fixed environment, application boundaries/architecture, commands, hooks, skills, CI, Vercel routing, and deployment safety policy.
- Create: `docs/implementation-obstacles.md` — concise Chinese record of actual product, accessibility/browser, documentation, and Vercel-stage obstacles with evidence.
- Modify: `vercel.json` — retain Next.js detection and frozen Bun installation, and prepend `node --version` to the existing Bun build command for deployment-log evidence of the `package.json` Node 24 engine; do not configure Functions.
- Verify only: `package.json` — retain Bun lockfile installation metadata and Node 24.
- Verify without changing: `.github/workflows/quality.yml`, `devenv.nix`, `lefthook.yml`, `.gitignore`, and `HANDOFF.md` — use them as the source of truth for the quality gate, hooks, ignored Vercel metadata, and project history; do not duplicate or contradict their behavior.

---

### Task 1: Publish the reproducibility documentation and factual obstacle report

**Files:**

- Modify: `README.md`
- Create: `docs/implementation-obstacles.md`
- Modify: `vercel.json`
- Verify only: `package.json`, `devenv.nix`, `lefthook.yml`, `.github/workflows/quality.yml`, `.gitignore`

**Interfaces:**

- Consumes: `package.json` scripts and `engines.node = "24.x"`; `devenv.nix` task graph; Lefthook configuration; the `quality.yml` `devenv test --no-tui` CI job; and the existing ignored `.vercel` directory.
- Consumes: Issue #10’s closed, integrated accessibility/responsive result and Issue #11’s no-tracking/no-credentials deployment boundary.
- Produces: `README.md` as the single setup/operation entry point, `docs/implementation-obstacles.md` as the evidence-backed Chinese report, and a Vercel build log containing the Node runtime version emitted by `node --version`; none introduces a runtime integration or tells users to enter a secret.

- [ ] **Step 1: Verify the dependency and establish a factual evidence ledger before writing**

  Run the following read-only commands from the candidate Issue #11 branch:

  ```bash
  gh issue view 10 --comments --json number,state,title,url
  git status --short
  git log --oneline --decorate -20
  git branch --show-current
  bunx vercel --version
  ```

  Require Issue #10 to be `CLOSED`, its completed work to be present in the candidate history, and the worktree to contain no unrelated modifications before starting. Create a private working list from actual commits, test output, browser/accessibility fixes, Vercel dry-run/build output, and deployment commands; every eventual obstacle-report entry must cite one of those sources. Do not copy the scaffold-only obstacle report from `HANDOFF.md` as if it were a record of later product work.

- [ ] **Step 2: Expand `README.md` into the reproducible project guide**

  Retain the existing project description and `Demo security` warning, then add these exact sections and behavior:

  1. `## Architecture` explains that the App Router homepage composes local React/CSS/SVG portfolio surfaces, the locale preference is the only intentional browser storage, chat answers/handoff and login feedback are deterministic local demonstrations, and the project has no real AI, authentication, database, payment, analytics, telemetry, or secret-backed service.
  2. `## 环境与启动` states the host prerequisites (Nix + devenv; optional direnv), fixed Bun/Node 24 environment, `devenv shell`, optional `direnv allow`, `bun run hooks:install`, `bun run test:e2e:install`, and either `bun run dev` or `devenv up`. State that `.env` stays ignored and is not loaded by devenv.
  3. `## 质量与测试` lists the canonical `devenv test --no-tui` command and accurately says it performs frozen Bun installation, Lefthook/actionlint validation, Biome, TypeScript, Vitest, production build, and desktop/mobile Playwright. List the fast commands `bun run check`, `bun run typecheck`, `bun run test:unit`, `bun run build`, and `bun run test:e2e`, without claiming that any focused command replaces the canonical gate.
  4. `## Hooks、CI 与 Agent 技能` identifies Lefthook as the owner of pre-commit/pre-push checks, `.github/workflows/quality.yml` as the GitHub Actions quality entry point, `.codex/hooks.json` as advisory graph maintenance only, and `bun run agents:restore` as an explicit network recovery action for already-versioned skills.
  5. `## Vercel 部署` documents the checked-in contract exactly: `vercel.json` detects Next.js and runs `bun install --frozen-lockfile`; `package.json` requests Node.js 24; `vercel.json` intentionally has no Functions Runtime setting. Document the branch rule—`main` production and every other branch preview—and the commands `bunx vercel deploy --yes` and `bunx vercel deploy --prod --yes`. State that the latter is run only from `main` after a fresh passing `devenv test --no-tui`, with an already-authorized Vercel account; no token, environment variable, analytics, telemetry, or credentials are added.

  Keep links to `HANDOFF.md`, `docs/agents/development-workflow.md`, `docs/implementation-obstacles.md`, and GitHub Issues. Do not add stale hard-coded deployment URLs to the README: URLs belong to the contemporaneous Issue #11 evidence comment.

- [ ] **Step 3: Write `docs/implementation-obstacles.md` from observed evidence only**

  Create a concise Chinese document with the title `# 实施与部署障碍报告`, a one-sentence scope stating that it covers the actual Issue #2–#11 implementation period, and this table schema:

  ```md
  | 阶段 | 实际障碍 | 影响 | 解决方式 | 证据 |
  | --- | --- | --- | --- | --- |
  ```

  Add rows only after the corresponding event has occurred. Use the precise phase values `产品实现`、`无障碍与响应式`、`浏览器验证`、`文档与配置`、`Vercel 部署` when applicable. Each `证据` cell must contain a concrete commit SHA, command plus exit status, GitHub Actions run URL, Vercel deployment URL, or a short dated log reference. For a Vercel account/team/project authorization failure, record the exact CLI failure category, that no URL was produced, and that it prevented only external deployment—not the local gate—rather than presenting it as a resolved deployment. Do not add a row merely to make every phase appear; no obstacle is a valid absence.

- [ ] **Step 4: Make the Vercel build evidence explicit without broadening runtime behavior**

  In `vercel.json`, retain the existing fields and add the following third field exactly:

  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "nextjs",
    "installCommand": "bun install --frozen-lockfile",
    "buildCommand": "node --version && bun run build"
  }
  ```

  `node --version` is intentionally build-log-only evidence that Vercel honored `package.json`’s `engines.node = "24.x"`; `bun run build` retains the repository’s existing `next build` command. It must not be replaced with a Functions Runtime declaration, `--env`, `--build-env`, a token, an instrumentation package, or an analytics/telemetry command. Then run:

  ```bash
  bunx vercel deploy --dry --yes
  ```

  Confirm the dry-run output selects the Next.js preset and includes the tracked Bun lockfile/deployment source. Re-read `package.json` and `vercel.json` to confirm Node `24.x`, `bun install --frozen-lockfile`, `node --version && bun run build`, and the absence of `functions`, `runtime`, `--env`, `--build-env`, `--token`, analytics, telemetry, or credential additions.

- [ ] **Step 5: Run documentation/configuration checks and commit the reviewed candidate**

  Run:

  ```bash
  git add -N docs/implementation-obstacles.md
  bun run check
  bun run typecheck
  bun run build
  git diff --check
  ```

  Expected: all commands exit 0 and `git diff --check` reports no whitespace errors. Inspect `git diff -- README.md docs/implementation-obstacles.md package.json vercel.json` to confirm that all docs describe the actual project and that no unexpected runtime/configuration change slipped in. Stage only the files changed by this task and commit the documentation/configuration candidate:

  ```bash
  git add README.md docs/implementation-obstacles.md vercel.json
  git commit -m "docs: document reproducible Vercel delivery"
  ```

  Never stage `.vercel/`, `.env*`, a token file, deployment logs containing a secret, or unrelated generated output.

## Independent Review

- [ ] **Request exactly one fresh review of the documentation/configuration candidate**

  Give one reviewer Issue #11, this plan, the changed-file list, the Step 4 dry-run output, and the Step 5 command output. The reviewer must verify:

  - README coverage is accurate for devenv/direnv, Bun commands, architecture, tests, hooks, skill recovery, CI, and Vercel;
  - every obstacle-report row is actually evidenced and written concisely in Chinese, while no hypothetical obstacle is presented as fact;
  - Node 24, frozen Bun installation, the `node --version && bun run build` evidence command, Next.js detection, `main` production routing, and other-branch preview routing match the checked-in configuration and commands;
  - there is no Functions Runtime opt-in, analytics, telemetry, cookie tracking, Sentry, real credential, token, `.env`, or dependency addition;
  - `.vercel/` remains ignored and all URL claims are absent until a real CLI result exists.

  Address only confirmed findings. If a finding changes documentation or configuration behavior, rerun `bun run check`, `bun run typecheck`, `bun run build`, and `git diff --check`, amend the candidate commit, and do not request another independent review.

## Final Verification and Deployment Evidence

- [ ] **Step 1: Run the fresh clean local quality gate after review fixes**

  Confirm `git status --short` contains no unexpected tracked changes, then run exactly once after all review corrections:

  ```bash
  devenv test --no-tui
  ```

  Expected: exit code 0 after frozen installation, configuration validation, Biome, TypeScript, Vitest, production Next.js build, and desktop/mobile Playwright. Preserve the complete command output and commit SHA as Issue #11 evidence. Do not begin an external deployment before this command passes.

- [ ] **Step 2: Link and prove Vercel authorization without creating or exposing credentials**

  Run:

  ```bash
  bunx vercel whoami
  bunx vercel link --yes
  ```

  Use the existing logged-in account and its accessible team/project. Confirm the link only creates ignored `.vercel/` metadata and that `git status --short` does not show it. If `whoami`, linking, or project access is denied, add a precise Chinese `Vercel 部署` obstacle row with the failure category and local-gate evidence, post the same limitation to Issue #11, and stop external deployment; do not fabricate a URL or attempt a token-based workaround.

- [ ] **Step 3: Create, inspect, and record the preview deployment**

  From the reviewed commit on a branch other than `main`, run:

  ```bash
  bunx vercel deploy --yes
  ```

  Copy the returned preview URL, then run:

  ```bash
  bunx vercel inspect <preview-url> --wait --format=json
  bunx vercel inspect <preview-url> --logs
  ```

  Require a ready deployment and logs that show Node.js 24 and the frozen Bun install/build succeeding without a Functions Runtime warning or opt-in. Visit the returned preview URL and perform a minimal smoke check of `/` and `/login`; it must load the validated local portfolio rather than an error page. Record the preview URL, commit SHA, inspected ready state, Node/Bun build evidence, smoke-check result, and final local-gate result in an Issue #11 comment. Add a `Vercel 部署` obstacle row only if this sequence exposed a real obstacle and resolution.

- [ ] **Step 4: Publish and inspect production only from integrated `main`**

  After the exact reviewed commit is integrated into `main`, check out `main`, verify it contains the reviewed SHA, ensure the local worktree is clean, and do not rerun the production command from a feature branch. Run:

  ```bash
  git branch --show-current
  git merge-base --is-ancestor <reviewed-sha> HEAD
  bunx vercel deploy --prod --yes
  ```

  Require the first command to output `main` and the second to exit 0 before accepting the returned production URL. Then run:

  ```bash
  bunx vercel inspect <production-url> --wait --format=json
  bunx vercel inspect <production-url> --logs
  ```

  Confirm the deployment is ready, its production build used Node 24 and `bun install --frozen-lockfile`, and no Bun Functions Runtime opt-in appears. Open `<production-url>/` and `<production-url>/login` to confirm the public result is reachable. Post a final Issue #11 comment containing the production URL, preview URL, exact `main` SHA, local-gate exit 0, CI run URL/status, inspection/build evidence, and any factual Vercel obstacle/resolution. This comment is the authoritative visible URL record; do not replace it with a guessed custom-domain URL.

- [ ] **Step 5: Confirm CI and graph freshness, then finalize the issue evidence**

  Push the reviewed `main` commit through the normal repository workflow, wait for the `.github/workflows/quality.yml` run triggered on `main`, and record its successful URL in the final Issue #11 comment. Run:

  ```bash
  gh run list --branch main --workflow quality.yml --limit 1
  graphify update .
  git status --short
  ```

  Expected: the newest `main` quality workflow is successful; graphify completes; and the worktree shows only expected ignored local Vercel metadata, if any. Do not commit `.vercel/` or unreviewed graph artifacts. Issue #11 is ready to close only when its final comment contains the real preview/production URLs (or the precise authorization block), fresh local and CI quality evidence, and the obstacle report is committed.

## Plan Self-Review

- Spec coverage: the one documentation/configuration task covers environment/direnv, Bun commands, architecture, testing, hooks, skills, CI, Vercel routing, Node 24, frozen Bun installation, and a factual Chinese obstacle report. The independent review checks exactly those requirements and the no-tracking/no-credential boundary.
- Deployment ordering: external Vercel work is explicitly gated on #10 being closed and integrated, review completion, and a fresh clean `devenv test --no-tui` pass; previews are non-`main`, while production requires the reviewed SHA on `main`.
- Evidence and failure behavior: preview and production are inspected, smoke-tested, and recorded as actual Issue #11 URLs. The only graceful no-deploy path is a verified Vercel account/team/project authorization block, which is reported without a fabricated URL.
- Placeholder and consistency check: every touched/verified file, command, branch rule, record location, evidence field, security constraint, and Vercel CLI invocation is explicit. `<preview-url>`, `<production-url>`, and `<reviewed-sha>` are values returned or established by the preceding required steps, not invented constants.

Plan complete and saved to `docs/superpowers/plans/2026-07-26-document-and-deploy.md`. Execute its one documentation/configuration task, one independent review, then the final local, CI, and Vercel deployment evidence gates in that order.
