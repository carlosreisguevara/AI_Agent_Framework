# Workflow patterns

Composable building blocks. Combine them; don't invent new ones unless these fail.

| Pattern | Use when | Shape | Watch out for |
|---|---|---|---|
| **Prompt chain** | A task splits cleanly into sequential steps | A → B → C, optional check between | Errors compound; add a gate or check after risky steps |
| **Router** | Different inputs need different handling | Classify → branch | Misrouting. Include an "unsure" branch to a human or a default path |
| **Parallelize** | Independent sub-tasks, or you want several attempts | Fan out → merge (or vote) | Cost multiplies; define how results merge |
| **Orchestrator-workers** | Sub-tasks can't be predicted up front | Planner splits → workers run → synthesise | Needs budgets and traces |
| **Evaluator-optimizer** | Clear quality criteria and iterating helps | Generate → critique → revise, capped | Cap the loop; define "good enough" |
| **Human-in-the-loop** | Cost of error is high, or preference matters | Propose → human decides → continue | Placing gates well (see [guardrails](../02-design/guardrails.md)) |
| **Autonomous loop** | Open-ended task, trustworthy environment feedback | Plan → act → observe, repeat | Budgets, stop conditions, approval for risky actions |

## In the spec

| Pattern | Node types |
|---|---|
| Prompt chain | `llm` → `llm` → … |
| Router | `router` (model or rules) with a `when` on every edge |
| Parallelize | multiple edges from one node to nodes that rejoin |
| Human-in-the-loop | `choice`, `review`, or `approval` |
| Evaluator-optimizer | `llm` → `llm` (critic) → `router` → back edge, with a cap in your scaffold |

## Rules

1. Every loop has a cap (max iterations or a user exit).
2. Every router has a fallback edge.
3. Every `llm` step that can fail has a failure path (see [guardrails](../02-design/guardrails.md)).
4. Prefer deterministic code over a model call whenever the logic is simple and known.
