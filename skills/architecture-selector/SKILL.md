---
name: architecture-selector
description: Decides whether an AI agent should be a single model call, a fixed workflow, an autonomous agent, or multi-agent, and records the rationale in the Agent Spec. Use after discovery or whenever the user asks "should this be an agent?", "workflow or agent?", or proposes a multi-agent design.
---

# Architecture selector

Fill `architecture.type` and `architecture.rationale`. Reference: `docs/01-foundations/workflow-vs-agent.md` and `docs/01-foundations/patterns.md`.

## Process

1. Read the brief. List, on paper, the steps a person would take.
2. **Walk the decision tree** in order and stop at the first yes:
   1. One transformation (summarise, classify, extract)? → single model call; type `workflow` with one `llm` node
   2. Steps can be written in advance? → `workflow`
   3. Steps known but path varies by input? → `workflow` with `router`
   4. Number and order of steps truly unknowable (open research, debugging)? → `agent`, with budgets and gates
   5. Distinct jobs need different tools, permissions, or context, and a single agent demonstrably struggles? → `multi-agent`
3. **Consider hybrid.** If only one part needs autonomy, keep a workflow and mark that node as autonomous with a budget.
4. **Select patterns** from `patterns.md` (chain, router, parallelize, orchestrator-workers, evaluator-optimizer, human-in-the-loop) and name them.
5. **Write the rationale** (2 to 4 sentences): why this is the simplest design that works, which alternatives were rejected and why, and what evidence would justify moving up a level.
6. Validate and show the user the decision, with the trade-off table row for their choice (predictability, cost, latency, testability).

## Rules

- Default to the simpler option when torn. Autonomy must be earned by evidence.
- Multi-agent requires a written reason a single agent isn't enough.
- Every autonomous node needs a budget (iterations, tools, tokens, time, cost) noted for the guardrails stage.
- Pretend the user asked for "an agent" and the answer is "a workflow": say so plainly and explain the benefit.

## Output

```yaml
architecture:
  type: workflow
  rationale: <why simplest, what was rejected, what would change the decision>
```
