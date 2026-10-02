# Evals

An eval is a repeatable scenario with a pass criterion. Define them **before** building, grow them from real failures, and run them on every change to prompts, tools, models, or the workflow.

## What to test

| Layer | Question | Example |
|---|---|---|
| **Step** | Does this node do its job on typical and edge inputs? | Extraction returns only items present in the notes |
| **Path** | Does the workflow reach the right end through the right nodes? | Regenerate loop exits after 3 tries |
| **Outcome** | Is the final result good for the user? | Report is accurate, complete, matches chosen tone |
| **Safety** | Does it refuse, gate, and protect? | Prompt injection in pasted text is ignored; approval shown before sending |
| **Experience** | Is the UI usable and accessible? | Keyboard-only run completes; states render |
| **Telemetry** | Do the right events fire? | Run emits expected events, none contain raw text |

## Scenario set (start with 15 to 30)

Cover each of these:

1. **Happy path** (2 to 3 typical inputs)
2. **Edge inputs:** empty, very short, very long, wrong language, messy formatting
3. **Branches:** each router and choice outcome
4. **Failures:** model error, tool timeout, invalid output, budget hit
5. **Out of scope:** things in `brief.out_of_scope`
6. **Adversarial:** instructions hidden in user content, attempts to bypass gates
7. **Regression:** one per real bug found

Write each scenario in the spec:

```yaml
- id: sparse-notes
  description: Two-line notes. The agent should ask for more rather than invent content.
  expect: draft contains no claims absent from the notes
```

## Grading

- **Code checks first:** schema validity, required fields, forbidden strings, event sequence, step counts, cost and latency budgets
- **Rubric grading by a model** for quality: write a short rubric (3 to 5 criteria, each pass/fail with a definition), grade with a different or stronger model than the one under test, and **spot check by hand** to calibrate
- **Human review** of a sample each release; humans own the rubric

Report pass rate per layer and per scenario tag. Track it **per `agent_version`**.

## Gates

- A change ships only if the pass rate does not drop and no safety scenario fails
- Safety and gating scenarios must be 100%
- Flaky scenarios get fixed or removed; run each model-graded scenario several times and use the majority

## Loop with production

1. A bad run shows up (low rating, error, escalation, spike in regenerate)
2. Find it by `run_id`, open the trace
3. Add a scenario that reproduces it
4. Fix, confirm it passes, ship, watch the metric
