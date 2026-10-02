# Workflow vs agent

**Start with the simplest thing that works.** Sometimes that is a single model call, sometimes a fixed workflow. Add autonomy only when you can show the task needs it.

- **Workflow:** the steps are decided by your code. The model fills in individual steps. Predictable, testable, cheaper, easier to explain.
- **Agent:** the model decides what to do next and which tools to call, in a loop. Flexible, but costlier, slower, and harder to test and control.

## Decision tree

1. Can you write the steps down in advance? → **Workflow.**
2. Is it a single transformation (summarise, classify, extract)? → **One model call**, no agent.
3. Are the steps known but the path varies by input? → **Workflow with a router.**
4. Are the number and order of steps genuinely unknowable up front (open-ended research, debugging)? → **Agent**, with budgets and gates.
5. Do distinct jobs need different tools, permissions, or context? → **Multi-agent**, only after a single agent clearly struggles.

## Cost of autonomy

| | Workflow | Agent | Multi-agent |
|---|---|---|---|
| Predictability | High | Medium | Low |
| Cost per run | Low | Medium to high | High |
| Latency | Low | Variable | Highest |
| Testability | Easy | Hard | Hardest |
| Debuggability | Easy | Needs good traces | Needs very good traces |

## Hybrid is normal

Most real agents are **workflows with one autonomous step**. Example: a fixed intake form → an agent that researches within a budget → a review step → approval. Model that as a workflow and mark the autonomous node with a step budget (max tool calls, max tokens, timeout).

## Write down the rationale

`architecture.rationale` in the spec must say *why this is the simplest design that works* and what would make you move up a level. The validator requires it.

## Checklist

- [ ] I tried (on paper) to write the steps as a fixed workflow
- [ ] Every autonomous step has a budget and a stop condition
- [ ] I can say what evidence would justify more autonomy later
