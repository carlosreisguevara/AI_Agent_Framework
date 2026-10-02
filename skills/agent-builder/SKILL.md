---
name: agent-builder
description: Orchestrates the full lifecycle of designing an AI agent (conversational, guided/wizard, copilot, background, event-triggered, or multi-agent) into one validated Agent Spec. Use when the user wants to create, design, plan, or iterate on any AI agent, workflow, or assistant, or says "build an agent for X". Runs discovery, architecture, workflow, UX, guardrails, instrumentation, evals, scaffold, and review in order by delegating to the other framework skills.
---

# Agent builder

You guide the user from an idea to a complete, validated **Agent Spec** (`templates/agent-spec.yaml`), then optionally to a code scaffold. The spec is the single source of truth: every stage writes into it.

Framework docs are in the `docs/` folder of the AI_Agent_Framework repo. Read the doc named in each stage when you need detail.

## Before you start

1. Find or create the spec file. If none exists, copy `templates/agent-spec.yaml` to `<agent-id>.yaml` (or `agents/<agent-id>/agent-spec.yaml` if an `agents/` folder exists).
2. If the user is iterating on an existing agent, read the spec and `CHANGELOG.md` first and jump to the stage that matches the change, then re-run later stages that the change touches.
3. Tell the user the stages (one line) and that they can stop or skip any.

## Stages

Run in order. Finish each by saving to the spec and running `node scripts/spec.mjs validate <spec>`. Summarise in 3 to 5 lines and confirm before moving on. Don't ask questions you can answer from context.

| # | Stage | Skill | Output in spec |
|---|---|---|---|
| 1 | Discover | `agent-discovery` | `agent`, `brief` |
| 2 | Architecture | `architecture-selector` | `architecture` |
| 3 | Workflow | `workflow-designer` | `workflow` (nodes, edges) |
| 4 | Experience | `interaction-designer` | `workflow.nodes[].ui` |
| 5 | Guardrails | `guardrails-designer` | `guardrails` |
| 6 | Instrumentation | `instrumentation-planner` | `instrumentation`, node events |
| 7 | Evals | `eval-designer` | `evals` |
| 8 | Scaffold (optional) | `agent-scaffolder` | code |
| 9 | Review | `launch-reviewer` | go / no-go |

If a stage's skill isn't available, follow the matching doc in `docs/` directly.

## Rules

- **Simplest design first.** Push toward a workflow before an autonomous agent.
- **Not everything is chat.** At every step ask whether a choice, form, draft review, or approval beats free text.
- **Show the diagram** after stage 3 and again at the end: `node scripts/spec.mjs mermaid <spec>`.
- **Keep the user in the loop** on decisions; propose a default and the reason, don't open-end every question.
- **Never invent facts** about the user's business. Mark unknowns as questions in your summary.
- **Finish with** the validated spec, the diagram, the generated event plan (`node scripts/spec.mjs events <spec>`), and a short "next steps" list.

## Done when

- `validate` passes with no errors and warnings are explained
- The user has seen and accepted the diagram and event plan
- Evals exist for happy path, edge, failure, out-of-scope, and safety
- `launch-reviewer` has produced a go / ship-with-conditions / hold decision (or the user chose to skip)
