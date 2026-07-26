# Domain Docs

How engineering skills consume this repository's domain documentation.

## Before exploring, read these

- `CONTEXT.md` at the repository root, when it exists.
- Relevant ADRs under `docs/adr/`, when they exist.

If either location does not exist, proceed silently. Domain-modeling workflows create them only when the project resolves terminology or architectural decisions that need durable documentation.

## Layout

This is a single-context repository:

```text
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Vocabulary

Use terminology defined in `CONTEXT.md` consistently in specs, ticket titles, tests, and implementation. If a needed concept is missing, note the gap instead of inventing competing synonyms.

## Architectural decisions

If proposed work contradicts an existing ADR, surface the conflict explicitly rather than silently overriding the recorded decision.
