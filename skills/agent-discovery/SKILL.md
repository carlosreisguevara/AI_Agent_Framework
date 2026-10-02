---
name: agent-discovery
description: Interviews the user to define what an AI agent is for, who uses it, how success is measured, and what is out of scope, then writes the agent and brief sections of the Agent Spec and picks an archetype. Use at the start of any agent project, when requirements are vague, or when the user says "I want an agent that...".
---

# Agent discovery

Produce the `agent` and `brief` sections of the spec. Reference: `docs/02-design/agent-brief.md` and `docs/01-foundations/archetypes.md`.

## Process

1. **Read first.** Use anything the user has already said, existing docs, or the repo. Only ask what's missing.
2. **Interview in small batches** (2 to 3 questions at a time), most important first:
   1. What does the user do today, and what's painful?
   2. What does "done" look like; what do they walk away with?
   3. Who uses it and when do they reach for it?
   4. How often and how long should a run take?
   5. Must the user be present while it runs? Should it ever act without asking?
   6. What data or systems does it need, and who controls access?
   7. What's the worst thing it could do? Who is hurt if it's wrong?
   8. How will we know it works after launch?
3. **Pick the archetype** using the order in `archetypes.md`: background/event-triggered if the user needn't be present; guided if the output is reviewed and edited; copilot if embedded in another tool; conversational if open-ended; multi-agent only with clear evidence. State the choice and the one-line reason.
4. **Draft the brief:**
   - `goal`: one outcome sentence, not technology
   - `users`: who, and the moment of need
   - `success_metrics`: 1 to 3, with targets; pair value with quality and cost (see `docs/04-instrumentation/metrics.md`)
   - `out_of_scope`: at least two items
5. **Write** `agent.id` (kebab-case), `name`, `version: 0.1.0`, `archetype`, `summary`.
6. **Validate** and read the brief back to the user in 4 lines for confirmation.

## Quality bar

- Goal passes the test "could a user say this outcome happened?"
- Every metric can be computed from events the workflow will emit
- Out-of-scope list is specific (actions, data, topics), not generic

## Avoid

- Solutioning during discovery (no prompts, no tools yet)
- Asking all questions at once
- Accepting "users will like it" as a metric
