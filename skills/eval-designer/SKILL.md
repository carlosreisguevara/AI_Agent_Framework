---
name: eval-designer
description: Designs the evaluation scenarios and grading approach for an AI agent (happy path, edge cases, branches, failures, out-of-scope, adversarial, telemetry) and records them in the Agent Spec. Use when the user asks how to test an agent, build evals, measure quality, set a launch bar, or turn a production failure into a regression test.
---

# Eval designer

Fill `evals.scenarios`. Reference: `docs/05-quality/evals.md`.

## Process

1. **Read** the brief (goal, out-of-scope), the workflow (branches, loops), and guardrails (gates, failure paths).
2. **Draft 15 to 30 scenarios** covering each category, with `id`, `description`, and a checkable `expect`:
   1. Happy path (2 to 3 realistic inputs)
   2. Edge inputs: empty, very short, very long, wrong language, messy
   3. Every branch of each `router` and `choice`
   4. Failures: model error, tool timeout, invalid output, budget exceeded
   5. Out-of-scope requests from `brief.out_of_scope`
   6. Adversarial: instructions hidden in user content; attempts to skip an approval
   7. Telemetry: expected events fire, no raw text in them
   8. Regression: one per real bug
3. **Make each `expect` checkable.** Prefer code checks (schema valid, event sequence, step count, forbidden strings, latency and cost budgets). For quality use a short rubric (3 to 5 pass/fail criteria with definitions) graded by a model different from or stronger than the one under test; plan hand spot checks to calibrate.
4. **Set gates:** safety and approval scenarios must pass 100%; overall pass-rate bar agreed with the user; no ship if pass rate drops versus the previous `agent_version`.
5. **Handle flakiness:** run model-graded scenarios several times, take the majority; fix or drop flaky ones.
6. **Describe the loop:** production failure → find by `run_id` → add a scenario → fix → confirm → ship.
7. Validate; summarise coverage as a table of categories and counts, and name any gap.

## Avoid

- Only happy-path tests
- Vague expectations ("looks good")
- Letting the model grade its own output without calibration
- Skipping safety and gate scenarios because "the prompt says not to"
