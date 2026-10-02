# Iteration loop

Launch is the start of learning. Run this loop weekly for the first month, then monthly.

## The loop

1. **Observe:** open the health, funnel, quality, and cost dashboards, comparing by `agent_version`
2. **Find the biggest gap:** the node with the highest drop-off, the highest regenerate or error rate, or the costliest step
3. **Look at real runs:** a handful of traces and (with consent) examples; talk to a user if you can
4. **Hypothesise:** one change, one expected metric movement ("pre-select the top 3 highlights → default acceptance up, time to value down")
5. **Change the spec first:** update workflow, UI, events, and evals together; validate
6. **Test:** run evals; add a scenario for the problem you're fixing
7. **Ship as a new version:** bump `agent.version`
8. **Compare:** after enough runs, compare the metric against the previous version
9. **Keep or roll back**

## Changes and the version number

| Change | Bump |
|---|---|
| Prompt wording, copy, minor UI polish | patch |
| New or removed node, new tool, new model, changed gate | minor |
| New archetype behaviour, breaking change to events or data | major |

Keep a `CHANGELOG.md` per agent with: what changed, why, the metric you expect to move, and the result once known.

## Where to look first

| Symptom | Likely cause | Try |
|---|---|---|
| High drop-off at a form | Too many or unclear fields | Fewer fields, defaults, examples |
| High regenerate rate | Weak first draft or missing context | Better inputs earlier, better examples, ask one clarifying choice |
| Low default acceptance | Poor defaults | Learn from selections; reorder options |
| High edit rate in one section | Prompt misses a requirement | Add it to the prompt and an eval |
| Approval rate near 100% with no edits | Rubber stamping, or gate too cautious | Check payload visibility; relax for low risk |
| Approval rate low | Poor proposals | Improve planning step; show reasoning |
| Rising cost per run | Longer contexts, extra retries | Trim context, cache, cheaper model for easy nodes |
| Rising escalations | Coverage gap | Review reasons; extend scope or improve the handoff |
| Users abandon after result | Result not usable as-is, or fine as-is | Check feedback and edit rate to tell which |

## Retire or merge

Review quarterly. If completion is low, usage is falling, and fixes haven't helped, retire the agent or fold it into another. Announce, export what users need, and remove access to its tools.
