# Glossary

| Term | Meaning |
|---|---|
| **Agent Spec** | The single YAML file describing one agent. Source of truth. |
| **Workflow** | LLM calls and tools orchestrated through predefined code paths. |
| **Agent** | A system where the LLM decides its own next steps and tool use. |
| **Archetype** | The overall shape of the experience: conversational, guided, copilot, background, event-triggered, multi-agent. |
| **Node** | One step in the workflow graph. Has a type, optional UI, tools, and events. |
| **Edge** | A transition between nodes, optionally labelled with a `when` condition. |
| **Interactive node** | A node where the user acts: `choice`, `form`, `review`, `approval`, `display`. Must declare a `ui` component. |
| **Gate** | A point where a human must approve before the agent proceeds. |
| **Session** | One user visit. May contain several runs. |
| **Run** | One execution of the workflow from `run_started` to `run_completed` or `run_abandoned`. |
| **Product event** | A named, structured record of something the user or agent did, used for usage analytics. |
| **Trace / span** | A technical record of model calls, tool calls, latency, and tokens (OpenTelemetry). |
| **Eval** | A repeatable test scenario with a pass criterion. |
| **Time to value** | Time from `run_started` to the user getting something usable. |
| **Edit rate** | Share of drafts the user edits. A proxy for first-draft quality. |
| **Escalation** | Handing off to a human or a non-AI path when the agent can't help. |
