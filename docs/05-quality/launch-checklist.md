# Launch checklist

Run before every launch and major version. `launch-reviewer` walks this list against the spec. Mark each item pass, fail, or n/a with a note.

## Spec
- [ ] `node scripts/spec.mjs validate` passes with no errors; warnings reviewed
- [ ] Goal, users, out-of-scope are filled in and specific
- [ ] Architecture rationale explains why this is the simplest design
- [ ] Version bumped; changelog entry written

## Workflow
- [ ] Diagram generated from the spec and reviewed by someone who didn't write it
- [ ] Every loop capped, every router has a fallback
- [ ] Each step is one purpose; first value arrives early
- [ ] Autonomous steps have budgets (iterations, tools, tokens, time, cost)

## Experience
- [ ] Each interactive node uses a catalogued component, or a new one is documented
- [ ] Buttons used where choices are small and known; free text only where needed
- [ ] Back, edit, and exit available at every step
- [ ] Progress is visible; waits have status; no blank screens
- [ ] Error states are recoverable and in plain language
- [ ] Light design tokens used; no raw colours
- [ ] Keyboard-only run works; contrast checked; reduced motion respected
- [ ] Works at phone width

## Guardrails
- [ ] Irreversible or external actions are behind approval nodes showing the exact payload
- [ ] Tools are least-privilege; credentials never exposed to the model
- [ ] Untrusted content is treated as data, not instructions
- [ ] Failure path defined for each model and tool node
- [ ] Escalation route exists and is visible
- [ ] Data retention decided and stated to the user

## Instrumentation
- [ ] Every brief metric is computable from emitted events
- [ ] Events validate against the envelope schema in a test run
- [ ] No raw user text or direct identifiers in events
- [ ] Traces include tokens, model, node, and run ids
- [ ] Dashboards and alerts exist for health, funnel, quality, and cost

## Quality
- [ ] Eval set covers happy, edge, branch, failure, out-of-scope, adversarial
- [ ] Safety and gate scenarios pass 100%
- [ ] Overall pass rate meets the agreed bar
- [ ] A person other than the author tried it end to end

## Operations
- [ ] Cost per run is within budget; per-user and per-run limits set
- [ ] Rollback path known (previous version deployable)
- [ ] Owner named; review date set for the first-month metrics review
- [ ] Support knows what the agent does and how to escalate

## Decision

Ship, ship with conditions (list them), or hold. Record the decision and date in the spec's repo history.
