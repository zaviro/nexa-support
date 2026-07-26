# Development workflow

This document is the operating contract for the later implementation agent.

## Start here

1. Read `AGENTS.md` and `HANDOFF.md`.
2. Read GitHub issue #1 and the current unblocked implementation issue.
3. Start with issue #2 while it remains open. Existing files are evidence to verify, not proof that its acceptance criteria are complete.
4. Do not rerun grilling, `to-spec`, or `to-tickets` unless the project owner changes the agreed scope.

## Superpowers sequence

For each issue, use the project-local skills in this order where applicable:

1. `using-superpowers`
2. `writing-plans`
3. `test-driven-development`
4. `executing-plans` or `subagent-driven-development`
5. `frontend-design` and `vercel-react-best-practices` for product UI work
6. `web-design-guidelines` and `webapp-testing` for UI review and browser evidence
7. `requesting-code-review` and `receiving-code-review`
8. `verification-before-completion`
9. `finishing-a-development-branch`

Use `systematic-debugging` before changing code in response to a failure. Use worktrees only after `main` has a real commit; the current unborn branch cannot anchor one.

## Environment and quality

- Enter the pinned environment with `devenv shell`, or approve `.envrc` once with `direnv allow`.
- Start the declared web process with `devenv up`.
- Run the canonical full gate with `devenv test --no-tui`.
- Run the fast local checks with `bun run check`, `bun run typecheck`, and `bun run test:unit`.
- Install the project-local Chromium cache with `bun run test:e2e:install`, then run `bun run test:e2e`.
- Restore skills only when needed with `bun run agents:restore`; this is an explicit network operation and must not run automatically on shell entry.

The API-key field planned for the demo is presentation-only. Never send, validate, log, persist, or write its value to an environment file.

## Enforcement boundary

- Lefthook owns `pre-commit` and `pre-push`.
- GitHub Actions runs the reproducible full gate through devenv.
- `.codex/hooks.json` is an optional graphify guard and is not a quality gate.
- `.agents/`, `.codex/`, `AGENTS.md`, and `skills-lock.json` are versioned inputs. devenv does not generate or rewrite them.
- Secrets remain outside Nix evaluation. Do not enable devenv dotenv integration without a specific security review.
