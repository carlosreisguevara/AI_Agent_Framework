---
name: guardrails-designer
description: Designs an AI agent's safety and control layer: human approval gates, tool permissions, failure paths, budgets, scope limits, and escalation, recorded in the Agent Spec. Use when an agent takes real actions, uses tools or sensitive data, loops autonomously, or when the user asks about safety, approvals, permissions, risk, or "what if it goes wrong".
---

# Guardrails designer

Fill `guardrails` and add `approval` nodes where needed. Reference: `docs/02-design/guardrails.md` and `docs/02-design/tools-and-state.md`.

## Process

1. **Inventory actions.** List every tool and side effect across nodes. Classify: read-only / reversible write / irreversible or external.
2. **Place approvals** using `guardrails.md`:
   - irreversible, external, costly, or sends as the user → add an `approval` node *before* the action and list its id in `guardrails.approvals`
   - standing access to powerful tools → approve the plan and scope before the run
   - draft the user reviews anyway → the `review` node is the gate
   Each approval shows the exact payload (recipient, diff, amount, tool call) with approve, edit, and reject.
3. **Permissions.** Set `guardrails.permissions.tools_allowed` to the minimum set; every `nodes[].tools` entry must be in it (validator enforces). Note data access and retention.
4. **Failure paths.** For each `llm` and `tool` node choose: `show-error-with-retry`, `fallback-manual`, `fallback-simpler`, `skip-and-continue`, or `escalate`. Set `failure_paths.default` plus overrides.
5. **Budgets.** For any autonomous or looping step set caps: iterations, tool calls, tokens, time, cost per run. Say what the user sees when a cap hits (progress plus options).
6. **Scope.** Turn each `brief.out_of_scope` item into refuse, redirect, or escalate.
7. **Untrusted input.** State that user content, documents, and web pages are data, never instructions; note any tool that reads external content and the protections applied.
8. **Escalation.** Fill `guardrails.escalation` with a real route.
9. Run the safety checklist in `guardrails.md`; validate; summarise residual risks in 3 bullets.

## Avoid

- Gating everything (users stop reading) or nothing
- Approval cards that hide the payload
- Giving the model credentials, or granting broad tools "just in case"
- Unbounded loops
