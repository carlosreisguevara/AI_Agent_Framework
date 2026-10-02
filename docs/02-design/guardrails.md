# Guardrails

Guardrails are decided at design time and recorded in `guardrails` in the spec.

## 1. Where to put human approval

Approval is a UX cost; spend it where it buys safety.

| Situation | Policy |
|---|---|
| Read-only or easily undone | No gate. Show what happened; offer undo |
| Draft the user will review anyway | The `review` node is the gate |
| Irreversible, external, costly, or sends something as the user | **`approval` node, before the action** |
| Agent has standing access to powerful tools | Gate **before the run** (approve the plan and the scope) |
| One-off actions with a clear preview | Gate **after the draft**, per action |

**An approval card must show the payload**: recipient, diff, amount, or the exact tool call. A card that hides what is being approved teaches users to click through. Offer *approve*, *edit*, and *reject*, not just yes/no.

## 2. Scope and refusal

- Fill `brief.out_of_scope`. For each item decide: refuse, redirect, or escalate.
- The agent states what it can do up front (suggested starting points beat a blank box).

## 3. Failure paths

For every `llm` and `tool` node decide what the user sees on failure. Pick from:

| Strategy | Use when |
|---|---|
| `show-error-with-retry` | Transient errors; user can try again |
| `fallback-manual` | Offer a manual way to finish (the user picks or types) |
| `fallback-simpler` | Retry with a simpler or cheaper method |
| `skip-and-continue` | The step is optional |
| `escalate` | Needs a human or non-AI path |

Set `failure_paths.default` plus per-node overrides. Messages say what happened, what is safe, and what to do next, in plain language.

## 4. Budgets

Any autonomous or looping step has caps: max iterations, max tool calls, max tokens, timeout, and a cost ceiling per run. When a cap hits, stop and show progress plus options, not a blank error.

## 5. Safety checklist

- [ ] Untrusted input (user text, documents, web pages) is treated as data, never as instructions to the agent
- [ ] Tools use least privilege; credentials are never visible to the model
- [ ] Irreversible actions sit behind an `approval` node
- [ ] Sensitive data is minimised, and redacted in events and traces
- [ ] Output that a program consumes is validated against a schema
- [ ] Rate and cost limits per user and per run
- [ ] There's a visible way to stop a run and to reach a human
- [ ] An audit log records who approved what and when

## 6. Escalation

`guardrails.escalation` states where the user goes when the agent can't help (a person, a form, a help article). Emit `escalated` when it happens and track the rate.
