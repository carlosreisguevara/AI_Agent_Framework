# AI Agent Framework

Docs, skills, and tooling for designing **any kind of AI agent**: chat, guided wizards, copilots, background jobs, event-driven automations.

Every agent is designed as one file, the **Agent Spec** (`templates/agent-spec.yaml`). The spec holds the brief, the workflow graph, the UI of each step, the guardrails, the events, and the evals. Skills and docs all read and write that one file, so the visual workflow, the UX, and the instrumentation never drift apart.

## Principles

1. **Simplest thing that works.** Prefer a workflow over an autonomous agent. Add autonomy only where the task needs it.
2. **Not everything is chat.** Use choices, forms, drafts, and approvals when they beat free text.
3. **Design the workflow visually first.** The diagram is generated from the spec.
4. **Instrument by design.** Events are derived from the workflow, not bolted on.
5. **The human stays in control.** Gates sit where actions are costly or irreversible.
6. **Light, simple, accessible UI.** One accent colour, generous whitespace, one primary action per screen.
7. **Evals before launch.** If it isn't tested, it isn't done.

## Lifecycle

```
Discover → Choose architecture → Design workflow → Design experience
        → Plan guardrails → Plan instrumentation → Define evals → Scaffold → Review → Launch → Iterate
```

Each stage has a doc in `docs/` and a skill in `skills/`. The `agent-builder` skill runs the whole sequence.

## Layout

| Path | What |
|---|---|
| `docs/00-start-here` | Lifecycle map, glossary |
| `docs/01-foundations` | Workflow vs agent, archetypes, patterns |
| `docs/02-design` | Brief, workflow graph, tools and state, guardrails |
| `docs/03-experience` | Interaction modes, components, light design system |
| `docs/04-instrumentation` | Event taxonomy, tracing, metrics |
| `docs/05-quality` | Evals, launch checklist |
| `docs/06-operations` | Iteration loop |
| `templates/` | Starting files, copy and fill in |
| `schemas/` | JSON Schema for the spec and for events |
| `skills/` | One skill per lifecycle stage (open `SKILL.md` format) |
| `scripts/spec.mjs` | Validate a spec, render its diagram, derive its event plan |
| `examples/` | Worked reference agents |

## Quickstart

```bash
npm install
cp templates/agent-spec.yaml my-agent.yaml      # or ask the agent-builder skill to interview you
node scripts/spec.mjs validate my-agent.yaml    # structural checks
node scripts/spec.mjs mermaid  my-agent.yaml    # paste into any Mermaid renderer
node scripts/spec.mjs events   my-agent.yaml    # the event plan, derived from the workflow
```

See `examples/guided-report-builder/` for a complete non-chat agent.

## Using the skills

Copy or symlink the folders in `skills/` into your tool's skills directory (for Claude Code: `.claude/skills/` in a project, or `~/.claude/skills/` for all projects). Then ask for what you want, for example: *"Use agent-builder to design an agent that triages support emails."*
