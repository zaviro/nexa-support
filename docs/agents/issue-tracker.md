# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Repository

- **GitHub repository:** `zaviro/nexa-support`
- **Remote:** `origin`

## Conventions

- **Create an issue:** `gh issue create --title "..." --body "..."`.
- **Read an issue:** `gh issue view <number> --comments`.
- **List issues:** `gh issue list --state open --json number,title,body,labels,comments`.
- **Comment on an issue:** `gh issue comment <number> --body "..."`.
- **Apply or remove labels:** `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- **Close an issue:** `gh issue close <number> --comment "..."`.

Infer the repository from `git remote -v`; `gh` resolves `origin` automatically from this checkout.

## Pull requests as a triage surface

**PRs as a request surface: no.**

## When a skill says "publish to the issue tracker"

Create a GitHub issue in `zaviro/nexa-support`.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Ticket relationships

- Publish a spec as the parent issue.
- Publish implementation tickets in dependency order.
- Prefer GitHub sub-issues for parent-child relationships and native issue dependencies for blocking edges.
- If those APIs are unavailable, use `Parent: #<number>` and `Blocked by: #<number>` in issue bodies.
