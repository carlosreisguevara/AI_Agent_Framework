# Lifecycle

Ten stages. Each produces something concrete in the Agent Spec. Do them in order; loop back freely.

| # | Stage | Question it answers | Spec section | Skill | Doc |
|---|---|---|---|---|---|
| 1 | Discover | What problem, for whom, how will we know it worked? | `brief` | `agent-discovery` | [agent-brief](../02-design/agent-brief.md) |
| 2 | Choose architecture | Workflow, single agent, or multi-agent? | `architecture` | `architecture-selector` | [workflow-vs-agent](../01-foundations/workflow-vs-agent.md) |
| 3 | Design workflow | What are the steps and branches? | `workflow` | `workflow-designer` | [workflow-graph](../02-design/workflow-graph.md) |
| 4 | Design experience | What does the user see and do at each step? | `workflow.nodes[].ui` | `interaction-designer` | [interaction-modes](../03-experience/interaction-modes.md) |
| 5 | Plan guardrails | Where must a human approve? What can go wrong? | `guardrails` | `guardrails-designer` | [guardrails](../02-design/guardrails.md) |
| 6 | Plan instrumentation | What do we measure, and with which events? | `instrumentation` | `instrumentation-planner` | [event-taxonomy](../04-instrumentation/event-taxonomy.md) |
| 7 | Define evals | What does "good" look like, testably? | `evals` | `eval-designer` | [evals](../05-quality/evals.md) |
| 8 | Scaffold | Generate the code skeleton | (reads all) | `agent-scaffolder` | [tools-and-state](../02-design/tools-and-state.md) |
| 9 | Review | Is it ready to ship? | (reads all) | `launch-reviewer` | [launch-checklist](../05-quality/launch-checklist.md) |
| 10 | Iterate | What did usage teach us? | (updates all) | `agent-builder` | [iteration-loop](../06-operations/iteration-loop.md) |

## Rules of thumb

- Stages 1 to 3 are cheap. Spend time there. A wrong architecture costs far more than a wrong prompt.
- Stage 4 is where non-chat agents are won or lost. Ask of every step: *would a button beat a sentence here?*
- Stage 6 is derived from stage 3. If you can't name the event for a step, the step isn't well defined.
- Run `node scripts/spec.mjs validate` at the end of every stage.
