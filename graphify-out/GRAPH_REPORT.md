# Graph Report - issue-6-decision-path  (2026-07-26)

## Corpus Check
- 195 files · ~113,474 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1278 nodes · 1253 edges · 180 communities (99 shown, 81 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `881980c6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- server.cjs
- [Analysis Title]
- Testing Skills With Subagents
- scripts
- devDependencies
- Issue tracker: GitHub
- compilerOptions
- Subagent-Driven Development
- Test-Driven Development (TDD)
- What You Must Do When Invoked
- Visual Companion Guide
- Creation Log: Systematic Debugging Skill
- Code Review Reception
- Testing CLAUDE.md Skills Documentation
- Root Cause Tracing
- Systematic Debugging
- 5. Re-render Optimization
- Persuasion Principles for Skill Design
- Finishing a Development Branch
- Using Git Worktrees
- 7. JavaScript Performance
- Quick Reference
- Returns: "OK" or lists conflicts
- Writing Skills
- Dispatching Parallel Agents
- Find Skills
- Process
- Defense-in-Depth Validation
- 6. Rendering Performance
- Writing Plans
- 3. Server-Side Performance
- Executing Plans
- Condition-Based Waiting
- Sections
- Verification Before Completion
- helper.js
- to-spec/SKILL.md
- render-graphs.js
- graphify reference: extra exports and benchmark
- Brainstorming Ideas Into Designs
- Web Application Testing
- Issue tracker: GitHub
- stop-server.sh
- Frontend Design
- 1. Eliminating Waterfalls
- 2. Bundle Size Optimization
- Agent skills
- using-superpowers/SKILL.md
- React Best Practices
- Skill Discovery Optimization (SDO)
- Bulletproofing Skills Against Rationalization
- graphify reference: query, path, explain
- Development workflow
- Domain Docs
- Pressure Test 1: Emergency Production Fix
- Pressure Test 2: Sunk Cost + Exhaustion
- Pressure Test 3: Authority + Social Pressure
- React Best Practices
- Skill structure
- 8. Advanced Patterns
- Web Interface Guidelines
- Anti-Patterns
- Testing All Skill Types
- RED-GREEN-REFACTOR for Skills
- Nexa Support
- Pi Tool Mapping
- async-cheap-condition-before-await.md
- Prefer Statically Analyzable Paths
- server-hoist-static-io.md
- is_server_ready
- File Organization
- Skill Types
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- next.config.js
- Global Constraints
- vercel.json
- start-server.sh
- Antigravity CLI (`agy`) Tool Mapping
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- spec-document-reviewer-prompt.md
- review-package
- sdd-workspace
- task-brief
- find-polluter.sh
- test-academic.md
- advanced-effect-event-deps.md
- advanced-event-handler-refs.md
- advanced-init-once.md
- advanced-use-latest.md
- async-api-routes.md
- async-dependencies.md
- async-parallel.md
- async-suspense-boundaries.md
- bundle-barrel-imports.md
- bundle-conditional.md
- bundle-defer-third-party.md
- bundle-dynamic-imports.md
- bundle-preload.md
- client-event-listeners.md
- client-localstorage-schema.md
- client-passive-event-listeners.md
- client-swr-dedup.md
- js-batch-dom-css.md
- js-cache-function-results.md
- js-cache-property-access.md
- js-cache-storage.md
- js-combine-iterations.md
- js-early-exit.md
- js-flatmap-filter.md
- js-hoist-regexp.md
- js-index-maps.md
- js-length-check-first.md
- js-min-max-loop.md
- js-request-idle-callback.md
- js-set-map-lookups.md
- js-tosorted-immutable.md
- rendering-activity.md
- rendering-animate-svg-wrapper.md
- rendering-conditional-render.md
- rendering-content-visibility.md
- rendering-hoist-jsx.md
- rendering-hydration-no-flicker.md
- rendering-hydration-suppress-warning.md
- rendering-resource-hints.md
- rendering-script-defer-async.md
- rendering-svg-precision.md
- rendering-usetransition-loading.md
- rerender-defer-reads.md
- rerender-dependencies.md
- rerender-derived-state.md
- rerender-derived-state-no-effect.md
- rerender-functional-setstate.md
- rerender-lazy-state-init.md
- rerender-memo.md
- rerender-memo-with-default-value.md
- rerender-move-effect-to-event.md
- rerender-no-inline-components.md
- rerender-simple-expression-in-memo.md
- rerender-split-combined-hooks.md
- rerender-transitions.md
- rerender-use-deferred-value.md
- rerender-use-ref-transient-values.md
- server-after-nonblocking.md
- server-auth-actions.md
- server-cache-lru.md
- server-dedup-props.md
- server-parallel-fetching.md
- server-parallel-nested-fetching.md
- server-serialization.md
- _template.md
- plan-document-reviewer-prompt.md
- extraction-spec.md
- Skill authoring best practices
- scaffold.spec.ts
- Nexa Support 工程交接
- File Structure
- Q: 整个行动中似乎遇到不少问题花了一段时间，出了什么问题？是有什么我们之前的计划没有安排好的吗？
- Q: 这次的经验是否让你对devenv有了什么新的理解？此外，你对脚手架有什么看法？如果下次我希望构建一个类似的脚手架，或在此基础上进行一些更改，应该怎么做会比较好？有哪些东西是我们这次初始化用到的？
- Q: Where are Issue #2 scaffolding, quality gates, and the next implementation entry point?
- marketing-journey.spec.ts
- Decision Path Implementation Plan
- 4. Client-Side Data Fetching
- anthropic-best-practices.md
- Checklist for effective Skills
- Core principles
- Anti-patterns to avoid

## God Nodes (most connected - your core abstractions)
1. `Writing Skills` - 22 edges
2. `compilerOptions` - 21 edges
3. `scripts` - 20 edges
4. `5. Re-render Optimization` - 16 edges
5. `Testing Skills With Subagents` - 16 edges
6. `7. JavaScript Performance` - 15 edges
7. `handleRequest()` - 14 edges
8. `Code Review Reception` - 14 edges
9. `Test-Driven Development (TDD)` - 13 edges
10. `Visual Companion Guide` - 12 edges

## Surprising Connections (you probably didn't know these)
- `LocaleProbe()` --calls--> `useLocale()`  [EXTRACTED]
  src/i18n/locale-provider.test.tsx → src/i18n/locale-provider.tsx
- `DecisionPath()` --calls--> `useLocale()`  [EXTRACTED]
  src/components/decision-path.tsx → src/i18n/locale-provider.tsx
- `LanguageSwitcher()` --calls--> `useLocale()`  [EXTRACTED]
  src/components/language-switcher.tsx → src/i18n/locale-provider.tsx
- `SupportDashboard()` --calls--> `filterDashboardConversations()`  [EXTRACTED]
  src/components/support-dashboard.tsx → src/components/support-dashboard-data.ts
- `SupportDashboard()` --calls--> `useLocale()`  [EXTRACTED]
  src/components/support-dashboard.tsx → src/i18n/locale-provider.tsx

## Import Cycles
- None detected.

## Communities (180 total, 81 thin omitted)

### Community 0 - "server.cjs"
Cohesion: 0.06
Nodes (55): bootstrapPage(), brandMarkup(), broadcast(), browserLauncherForPlatform(), chmodOwnerOnly(), clients, companionUrl(), computeAcceptKey() (+47 more)

### Community 1 - "[Analysis Title]"
Cohesion: 0.15
Nodes (13): Advanced: Skills with executable code, [Analysis Title], Build evaluations first, Conditional workflow pattern, Develop Skills iteratively with the agent, Evaluation and iteration, Examples pattern, Executive summary (+5 more)

### Community 2 - "Testing Skills With Subagents"
Cohesion: 0.05
Nodes (39): Codex App Finishing, Environment Detection, Subagent dispatch requires multi-agent support, Additional Gemini CLI tools, Gemini CLI Tool Mapping, Instructions file, Parallel dispatch, Personal skills directory (+31 more)

### Community 3 - "scripts"
Cohesion: 0.05
Nodes (40): next, ct3aMetadata, initVersion, dependencies, next, react, react-dom, @t3-oss/env-nextjs (+32 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (39): @axe-core/playwright, @biomejs/biome, jsdom, lefthook, devDependencies, @axe-core/playwright, @biomejs/biome, jsdom (+31 more)

### Community 5 - "Issue tracker: GitHub"
Cohesion: 0.06
Nodes (30): Before exploring, read these, Domain Docs, File structure, Flag ADR conflicts, Use the glossary's vocabulary, Conventions, Issue tracker: GitHub, Pull requests as a triage surface (+22 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (34): **/*.cjs, dom, dom.iterable, ES2022, generated, **/*.js, next-env.d.ts, .next/types/**/*.ts (+26 more)

### Community 7 - "Subagent-Driven Development"
Cohesion: 0.06
Nodes (26): Code Reviewer Prompt Template, Example Output, Common Rationalizations, Example, How to Request, Red Flags, Requesting Code Review, When to Request Review (+18 more)

### Community 8 - "Test-Driven Development (TDD)"
Cohesion: 0.06
Nodes (29): Common Rationalizations, Debugging Integration, Example: Bug Fix, Final Rule, Good Tests, GREEN - Minimal Code, Overview, Red Flags - STOP and Start Over (+21 more)

### Community 9 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 10 - "Visual Companion Guide"
Cohesion: 0.10
Nodes (19): Browser Events Format, Cards (visual designs), Cleaning Up, CSS Classes Available, Design Tips, File Naming, How It Works, Mock elements (wireframe building blocks) (+11 more)

### Community 11 - "Creation Log: Systematic Debugging Skill"
Cohesion: 0.10
Nodes (19): Bulletproofing Elements, Creation Log: Systematic Debugging Skill, Enhancement 1: TDD Reference, Extraction Decisions, Final Outcome, Initial Version, Iterations, Key Insight (+11 more)

### Community 12 - "Code Review Reception"
Cohesion: 0.12
Nodes (16): Acknowledging Correct Feedback, Code Review Reception, Common Mistakes, Forbidden Responses, From External Reviewers, From your human partner, GitHub Thread Replies, Gracefully Correcting Your Pushback (+8 more)

### Community 13 - "Testing CLAUDE.md Skills Documentation"
Cohesion: 0.12
Nodes (16): Documentation Variants to Test, Expected Results, Next Steps, NULL (Baseline - no skills doc), Scenario 1: Time Pressure + Confidence, Scenario 2: Sunk Cost + Works Already, Scenario 3: Authority + Speed Bias, Scenario 4: Familiarity + Efficiency (+8 more)

### Community 14 - "Root Cause Tracing"
Cohesion: 0.12
Nodes (15): 1. Observe the Symptom, 2. Find Immediate Cause, 3. Ask: What Called This?, 4. Keep Tracing Up, 5. Find Original Trigger, Adding Stack Traces, Finding Which Test Causes Pollution, Key Principle (+7 more)

### Community 15 - "Systematic Debugging"
Cohesion: 0.12
Nodes (15): Common Rationalizations, Overview, Phase 1: Root Cause Investigation, Phase 2: Pattern Analysis, Phase 3: Hypothesis and Testing, Phase 4: Implementation, Quick Reference, Red Flags - STOP and Follow Process (+7 more)

### Community 16 - "5. Re-render Optimization"
Cohesion: 0.12
Nodes (16): 5.10 Subscribe to Derived State, 5.11 Use Functional setState Updates, 5.12 Use Lazy State Initialization, 5.13 Use Transitions for Non-Urgent Updates, 5.14 Use useDeferredValue for Expensive Derived Renders, 5.15 Use useRef for Transient Values, 5.1 Calculate Derived State During Rendering, 5.2 Defer State Reads to Usage Point (+8 more)

### Community 17 - "Persuasion Principles for Skill Design"
Cohesion: 0.12
Nodes (15): 1. Authority, 2. Commitment, 3. Scarcity, 4. Social Proof, 5. Unity, 6. Reciprocity, 7. Liking, Ethical Use (+7 more)

### Community 18 - "Finishing a Development Branch"
Cohesion: 0.13
Nodes (14): Common Rationalizations, Finishing a Development Branch, If your human partner asks to discard the work, Option 1: Merge Locally, Option 2: Push and Create PR, Option 3: Keep As-Is, Overview, Quick Reference (+6 more)

### Community 19 - "Using Git Worktrees"
Cohesion: 0.13
Nodes (14): 1a. Native Worktree Tools (preferred), 1b. Git Worktree Fallback, Common Rationalizations, Create the Worktree, Directory Selection, Overview, Quick Reference, Report (+6 more)

### Community 20 - "7. JavaScript Performance"
Cohesion: 0.13
Nodes (15): 7.10 Hoist RegExp Creation, 7.11 Use flatMap to Map and Filter in One Pass, 7.12 Use Loop for Min/Max Instead of Sort, 7.13 Use Set/Map for O(1) Lookups, 7.14 Use toSorted() Instead of sort() for Immutability, 7.1 Avoid Layout Thrashing, 7.2 Build Index Maps for Repeated Lookups, 7.3 Cache Property Access in Loops (+7 more)

### Community 21 - "Quick Reference"
Cohesion: 0.13
Nodes (14): 1. Eliminating Waterfalls (CRITICAL), 2. Bundle Size Optimization (CRITICAL), 3. Server-Side Performance (HIGH), 4. Client-Side Data Fetching (MEDIUM-HIGH), 5. Re-render Optimization (MEDIUM), 6. Rendering Performance (MEDIUM), 7. JavaScript Performance (LOW-MEDIUM), 8. Advanced Patterns (LOW) (+6 more)

### Community 22 - "Returns: "OK" or lists conflicts"
Cohesion: 0.18
Nodes (11): Avoid assuming tools are installed, Create verifiable intermediate outputs, MCP tool references, Next steps, Package dependencies, Returns: "OK" or lists conflicts, Runtime environment, Technical notes (+3 more)

### Community 23 - "Writing Skills"
Cohesion: 0.13
Nodes (15): Code Examples, Common Rationalizations for Skipping Testing, Directory Structure, Discovery Workflow, Flowchart Usage, Match the Form to the Failure, Overview, Skill Creation Checklist (TDD Adapted) (+7 more)

### Community 24 - "Dispatching Parallel Agents"
Cohesion: 0.14
Nodes (13): 1. Identify Independent Domains, 2. Create Focused Agent Tasks, 3. Dispatch in Parallel, 4. Review and Integrate, Agent Prompt Structure, Common Mistakes, Dispatching Parallel Agents, Overview (+5 more)

### Community 25 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 26 - "Process"
Cohesion: 0.15
Nodes (12): 1. Gather context, 2. Explore the codebase (optional), 3. Draft vertical slices, 4. Quiz the user, 5. Publish the tickets to the configured tracker, Acceptance criteria, Blocked by, <NN> — <Ticket title> (+4 more)

### Community 27 - "Defense-in-Depth Validation"
Cohesion: 0.17
Nodes (11): Applying the Pattern, Defense-in-Depth Validation, Example from Session, Key Insight, Layer 1: Entry Point Validation, Layer 2: Business Logic Validation, Layer 3: Environment Guards, Layer 4: Debug Instrumentation (+3 more)

### Community 28 - "6. Rendering Performance"
Cohesion: 0.17
Nodes (12): 6.10 Use React DOM Resource Hints, 6.11 Use useTransition Over Manual Loading States, 6.1 Animate SVG Wrapper Instead of SVG Element, 6.2 CSS content-visibility for Long Lists, 6.3 Hoist Static JSX Elements, 6.4 Optimize SVG Precision, 6.5 Prevent Hydration Mismatch Without Flickering, 6.6 Suppress Expected Hydration Mismatches (+4 more)

### Community 29 - "Writing Plans"
Cohesion: 0.17
Nodes (11): Bite-Sized Task Granularity, Execution Handoff, File Structure, No Placeholders, Overview, Plan Document Header, Scope Check, Self-Review (+3 more)

### Community 30 - "3. Server-Side Performance"
Cohesion: 0.18
Nodes (10): 3.10 Use after() for Non-Blocking Operations, 3.1 Authenticate Server Actions Like API Routes, 3.2 Avoid Duplicate Serialization in RSC Props, 3.3 Avoid Shared Module State for Request Data, 3.4 Cross-Request LRU Caching, 3.5 Hoist Static I/O to Module Level, 3.6 Minimize Serialization at RSC Boundaries, 3.7 Parallel Data Fetching with Component Composition (+2 more)

### Community 31 - "Executing Plans"
Cohesion: 0.20
Nodes (9): Executing Plans, Overview, Remember, Step 1: Load and Review Plan, Step 2: Execute Tasks, Step 3: Complete Development, The Process, When to Revisit Earlier Steps (+1 more)

### Community 32 - "Condition-Based Waiting"
Cohesion: 0.20
Nodes (9): Common Mistakes, Condition-Based Waiting, Core Pattern, Implementation, Overview, Quick Patterns, Real-World Impact, When Arbitrary Timeout IS Correct (+1 more)

### Community 33 - "Sections"
Cohesion: 0.20
Nodes (9): 1. Eliminating Waterfalls (async), 2. Bundle Size Optimization (bundle), 3. Server-Side Performance (server), 4. Client-Side Data Fetching (client), 5. Re-render Optimization (rerender), 6. Rendering Performance (rendering), 7. JavaScript Performance (js), 8. Advanced Patterns (advanced) (+1 more)

### Community 34 - "Verification Before Completion"
Cohesion: 0.20
Nodes (9): Common Failures, Key Patterns, Overview, Rationalization Prevention, Red Flags - STOP, The Gate Function, The Iron Law, Verification Before Completion (+1 more)

### Community 35 - "helper.js"
Cohesion: 0.42
Nodes (7): connect(), nextReconnectDelay(), reloadAfterRecovery(), sessionKey(), setStatus(), showTombstone(), websocketUrl()

### Community 36 - "to-spec/SKILL.md"
Cohesion: 0.22
Nodes (8): Further Notes, Implementation Decisions, Out of Scope, Problem Statement, Process, Solution, Testing Decisions, User Stories

### Community 37 - "render-graphs.js"
Cohesion: 0.33
Nodes (8): combineGraphs(), { execSync }, extractDotBlocks(), extractGraphBody(), fs, main(), path, renderToSvg()

### Community 38 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 39 - "Brainstorming Ideas Into Designs"
Cohesion: 0.25
Nodes (7): After the Design, Anti-Pattern: "This Is Too Simple To Need A Design", Brainstorming Ideas Into Designs, Checklist, Process Flow, The Process, Visual Companion

### Community 40 - "Web Application Testing"
Cohesion: 0.25
Nodes (7): Best Practices, Common Pitfall, Decision Tree: Choosing Your Approach, Example: Using with_server.py, Reconnaissance-Then-Action Pattern, Reference Files, Web Application Testing

### Community 41 - "Issue tracker: GitHub"
Cohesion: 0.25
Nodes (7): Conventions, Issue tracker: GitHub, Pull requests as a triage surface, Repository, Ticket relationships, When a skill says "fetch the relevant ticket", When a skill says "publish to the issue tracker"

### Community 42 - "stop-server.sh"
Cohesion: 0.43
Nodes (4): command_has_server_id(), is_brainstorm_server(), mark_stopped(), stop-server.sh script

### Community 43 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground it in the subject, More on writing in design, Process: brainstorm, explore, plan, critique, build, critique again, Restraint and self-critique

### Community 44 - "1. Eliminating Waterfalls"
Cohesion: 0.29
Nodes (7): 1.1 Check Cheap Conditions Before Async Flags, 1.2 Defer Await Until Needed, 1.3 Dependency-Based Parallelization, 1.4 Prevent Waterfall Chains in API Routes, 1.5 Promise.all() for Independent Operations, 1.6 Strategic Suspense Boundaries, 1. Eliminating Waterfalls

### Community 45 - "2. Bundle Size Optimization"
Cohesion: 0.29
Nodes (7): 2.1 Avoid Barrel File Imports, 2.2 Conditional Module Loading, 2.3 Defer Non-Critical Third-Party Libraries, 2.4 Dynamic Imports for Heavy Components, 2.5 Prefer Statically Analyzable Paths, 2.6 Preload Based on User Intent, 2. Bundle Size Optimization

### Community 46 - "Agent skills"
Cohesion: 0.33
Nodes (5): Agent skills, Development workflow, Domain docs, graphify, Issue tracker

### Community 47 - "using-superpowers/SKILL.md"
Cohesion: 0.33
Nodes (5): Platform Adaptation, Red Flags, Skill Priority, The Rule, User Instructions

### Community 48 - "React Best Practices"
Cohesion: 0.33
Nodes (5): Creating a New Rule, Getting Started, React Best Practices, Rule File Structure, Structure

### Community 49 - "Skill Discovery Optimization (SDO)"
Cohesion: 0.33
Nodes (6): 1. Rich Description Field, 2. Keyword Coverage, 3. Descriptive Naming, 4. Token Efficiency (Critical), 5. Cross-Referencing Other Skills, Skill Discovery Optimization (SDO)

### Community 50 - "Bulletproofing Skills Against Rationalization"
Cohesion: 0.33
Nodes (6): Address "Spirit vs Letter" Arguments, Build Rationalization Table, Bulletproofing Skills Against Rationalization, Close Every Loophole Explicitly, Create Red Flags List, Update SDO for Violation Symptoms

### Community 51 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 52 - "Development workflow"
Cohesion: 0.33
Nodes (5): Development workflow, Enforcement boundary, Environment and quality, Start here, Superpowers sequence

### Community 53 - "Domain Docs"
Cohesion: 0.33
Nodes (5): Architectural decisions, Before exploring, read these, Domain Docs, Layout, Vocabulary

### Community 54 - "Pressure Test 1: Emergency Production Fix"
Cohesion: 0.40
Nodes (4): Choose A, B, or C, Pressure Test 1: Emergency Production Fix, Scenario, Your Options

### Community 55 - "Pressure Test 2: Sunk Cost + Exhaustion"
Cohesion: 0.40
Nodes (4): Choose A, B, or C, Pressure Test 2: Sunk Cost + Exhaustion, Scenario, Your Options

### Community 56 - "Pressure Test 3: Authority + Social Pressure"
Cohesion: 0.40
Nodes (4): Choose A, B, or C, Pressure Test 3: Authority + Social Pressure, Scenario, Your Options

### Community 57 - "React Best Practices"
Cohesion: 0.40
Nodes (4): Abstract, React Best Practices, References, Table of Contents

### Community 58 - "Skill structure"
Cohesion: 0.20
Nodes (10): Avoid deeply nested references, Naming conventions, Pattern 1: High-level guide with references, Pattern 2: Domain-specific organization, Pattern 3: Conditional details, Progressive disclosure patterns, Skill structure, Structure longer reference files with table of contents (+2 more)

### Community 59 - "8. Advanced Patterns"
Cohesion: 0.40
Nodes (5): 8.1 Do Not Put Effect Events in Dependency Arrays, 8.2 Initialize App Once, Not Per Mount, 8.3 Store Event Handlers in Refs, 8.4 useEffectEvent for Stable Callback Refs, 8. Advanced Patterns

### Community 60 - "Web Interface Guidelines"
Cohesion: 0.40
Nodes (4): Guidelines Source, How It Works, Usage, Web Interface Guidelines

### Community 61 - "Anti-Patterns"
Cohesion: 0.40
Nodes (5): Anti-Patterns, ❌ Code in Flowcharts, ❌ Generic Labels, ❌ Multi-Language Dilution, ❌ Narrative Example

### Community 62 - "Testing All Skill Types"
Cohesion: 0.40
Nodes (5): Discipline-Enforcing Skills (rules/requirements), Pattern Skills (mental models), Reference Skills (documentation/APIs), Technique Skills (how-to guides), Testing All Skill Types

### Community 63 - "RED-GREEN-REFACTOR for Skills"
Cohesion: 0.40
Nodes (5): GREEN: Write Minimal Skill, Micro-Test Wording Before Full Scenarios, RED-GREEN-REFACTOR for Skills, RED: Write Failing Test (Baseline), REFACTOR: Close Loopholes

### Community 64 - "Nexa Support"
Cohesion: 0.40
Nodes (4): Agent 技能, Nexa Support, 环境, 质量命令

### Community 66 - "Pi Tool Mapping"
Cohesion: 0.50
Nodes (3): Pi Tool Mapping, Subagents, Task lists

### Community 68 - "Prefer Statically Analyzable Paths"
Cohesion: 0.50
Nodes (3): File-System Paths, Import Paths, Prefer Statically Analyzable Paths

### Community 70 - "is_server_ready"
Cohesion: 0.67
Nodes (3): is_server_ready(), main(), Wait for server to be ready by polling the port.

### Community 71 - "File Organization"
Cohesion: 0.50
Nodes (4): File Organization, Self-Contained Skill, Skill with Heavy Reference, Skill with Reusable Tool

### Community 72 - "Skill Types"
Cohesion: 0.50
Nodes (4): Pattern, Reference, Skill Types, Technique

### Community 73 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 74 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 75 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 77 - "Global Constraints"
Cohesion: 0.33
Nodes (5): Global Constraints, Interactive Support Dashboard Implementation Plan, Task 1: Dashboard fixture and selection model, Task 2: Interactive bilingual dashboard, Task 3: Browser behavior and responsive evidence

### Community 78 - "vercel.json"
Cohesion: 0.50
Nodes (3): framework, installCommand, $schema

### Community 158 - "Skill authoring best practices"
Cohesion: 0.22
Nodes (9): Avoid time-sensitive information, Common patterns, Content guidelines, Implement feedback loops, Skill authoring best practices, Template pattern, Use consistent terminology, Use workflows for complex tasks (+1 more)

### Community 165 - "scaffold.spec.ts"
Cohesion: 0.06
Nodes (37): geist, metadata, ChatShell(), DecisionPath(), LanguageSwitcher(), MarketingHome(), SiteHeader(), ActivityVisualization (+29 more)

### Community 168 - "Nexa Support 工程交接"
Cohesion: 0.11
Nodes (17): 10. 下一位 Superpowers Agent, 1. 本轮边界, 2. 最终产品范围, 3. 已完成的工程脚手架, 4. 项目内 Agent 技能, 5. 新环境复现, 6. 验证证据, 7. Git 与 GitHub 状态 (+9 more)

### Community 169 - "File Structure"
Cohesion: 0.22
Nodes (8): Bilingual Marketing Journey Implementation Plan, File Structure, Global Constraints, Task 1: Make locale persistence a small, tested domain, Task 2: Prove the bilingual route journey before building it, Task 3: Build the locale boundary and shared bilingual shell, Task 4: Replace the scaffold with the Signal Desk marketing experience, Task 5: Review the real UI and close Issue #3 with fresh evidence

### Community 170 - "Q: 整个行动中似乎遇到不少问题花了一段时间，出了什么问题？是有什么我们之前的计划没有安排好的吗？"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 整个行动中似乎遇到不少问题花了一段时间，出了什么问题？是有什么我们之前的计划没有安排好的吗？, Source Nodes

### Community 171 - "Q: 这次的经验是否让你对devenv有了什么新的理解？此外，你对脚手架有什么看法？如果下次我希望构建一个类似的脚手架，或在此基础上进行一些更改，应该怎么做会比较好？有哪些东西是我们这次初始化用到的？"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: 这次的经验是否让你对devenv有了什么新的理解？此外，你对脚手架有什么看法？如果下次我希望构建一个类似的脚手架，或在此基础上进行一些更改，应该怎么做会比较好？有哪些东西是我们这次初始化用到的？, Source Nodes

### Community 172 - "Q: Where are Issue #2 scaffolding, quality gates, and the next implementation entry point?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Where are Issue #2 scaffolding, quality gates, and the next implementation entry point?, Source Nodes

### Community 174 - "Decision Path Implementation Plan"
Cohesion: 0.29
Nodes (6): Decision Path Implementation Plan, Execution Handoff, File Structure, Global Constraints, Self-Review, Task 1: Ship the localized trust, pricing, and FAQ decision path

### Community 175 - "4. Client-Side Data Fetching"
Cohesion: 0.40
Nodes (5): 4.1 Deduplicate Global Event Listeners, 4.2 Use Passive Event Listeners for Scrolling Performance, 4.3 Use SWR for Automatic Deduplication, 4.4 Version and Minimize localStorage Data, 4. Client-Side Data Fetching

### Community 176 - "anthropic-best-practices.md"
Cohesion: 0.40
Nodes (4): [Analysis Title], Executive summary, Key findings, Recommendations

### Community 177 - "Checklist for effective Skills"
Cohesion: 0.50
Nodes (4): Checklist for effective Skills, Code and scripts, Core quality, Testing

### Community 178 - "Core principles"
Cohesion: 0.50
Nodes (4): Concise is key, Core principles, Set appropriate degrees of freedom, Test with all models you plan to use

### Community 179 - "Anti-patterns to avoid"
Cohesion: 0.67
Nodes (3): Anti-patterns to avoid, Avoid offering too many options, Avoid Windows-style paths

## Knowledge Gaps
- **817 isolated node(s):** `crypto`, `http`, `fs`, `path`, `OPCODES` (+812 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **81 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `quality` (2× useful, score=1.999788438)
- `scaffold.spec.ts` (2× useful, score=1.999788438) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React Best Practices` connect `React Best Practices` to `1. Eliminating Waterfalls`, `2. Bundle Size Optimization`, `4. Client-Side Data Fetching`, `5. Re-render Optimization`, `7. JavaScript Performance`, `8. Advanced Patterns`, `6. Rendering Performance`, `3. Server-Side Performance`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Why does `7. JavaScript Performance` connect `7. JavaScript Performance` to `React Best Practices`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `crypto`, `http`, `fs` to the rest of the system?**
  _817 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05868118572292801 - nodes in this community are weakly interconnected._
- **Should `Testing Skills With Subagents` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._