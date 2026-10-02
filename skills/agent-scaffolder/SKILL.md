---
name: agent-scaffolder
description: Generates a code skeleton for an AI agent from a validated Agent Spec, with one handler per workflow node, state types, event emission, trace spans, budgets, and an eval runner stub. Use when the spec is validated and the user wants to start implementing. Targets the Claude API / Agent SDK by default but keeps the structure stack-neutral.
---

# Agent scaffolder

Turn a validated spec into a project skeleton. Never scaffold from an invalid spec: run `node scripts/spec.mjs validate <spec>` first. Reference: `docs/02-design/tools-and-state.md` and `docs/04-instrumentation/`.

## Ask once

1. Language and runtime (default: what the repo already uses; otherwise TypeScript)
2. Model provider (default: Claude via the official SDK; check current model IDs and SDK docs before writing calls, don't rely on memory)
3. UI surface (web app, CLI, chat host, none yet)

## Layout to generate

```
agents/<agent-id>/
├── agent-spec.yaml          # the source of truth (copy, don't fork)
├── CHANGELOG.md
├── src/
│   ├── workflow.<ext>       # the graph as data + the runner
│   ├── nodes/<node_id>.<ext>   # one handler per node
│   ├── state.<ext>          # typed run state (inputs, choices, drafts)
│   ├── tools/               # one file per allowed tool (least privilege)
│   ├── prompts/<node_id>.md # prompts, versioned with the spec
│   ├── events.<ext>         # emit(event, props) with the envelope; PII guard
│   ├── tracing.<ext>        # OpenTelemetry spans per run and node
│   └── budgets.<ext>        # iteration, token, time, cost caps
├── ui/                      # components named by each node's `ui`
└── evals/
    ├── scenarios/           # from spec.evals.scenarios
    └── run.<ext>            # runner and graders (stubs)
```

## Rules for the generated code

- **The graph drives the runner.** Load nodes and edges from the spec so code and spec can't diverge; a test asserts they match.
- **One handler per node**, small and pure where possible; interactive nodes return a UI request and wait for the user's response.
- **Events:** emit `run_started`, `step_started`, `step_completed`, node-type events, `run_completed` or `run_abandoned`, using the envelope from `schemas/event.schema.json`. Drop or redact any prop containing raw text unless `pii_in_events` is true.
- **Tracing:** root `invoke_agent` span, a span per node, child spans for model and tool calls with token counts. Respect `trace_content`.
- **Guardrails in code:** tools limited to `tools_allowed`; approval nodes block until approved; every loop capped; failure paths implemented per node.
- **Secrets** from environment variables, never in the repo, never visible to the model.
- **Structured outputs:** validate model output against a schema before use.
- **No invented features.** Stubs say `TODO` with a pointer to the spec section.

## Finish

1. Run type check and the eval stubs
2. Show a map: node id → file → ui component → events emitted
3. List what is stubbed and what the user must supply (keys, data, UI host)
4. Tell the user to re-run `launch-reviewer` once the stubs are filled
