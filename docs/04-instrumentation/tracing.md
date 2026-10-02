# Tracing and cost

Traces tell engineers what the system did. Use **OpenTelemetry GenAI semantic conventions** so any backend (Datadog, Grafana, Honeycomb, Langfuse-style tools) understands your data.

> The conventions for model calls are fairly stable. The agent and multi-agent conventions are still evolving. Pin the version you use in your scaffold and review on upgrades.

## Span structure

One trace per run (`trace_id` = or linked to `run_id`):

```
invoke_agent <agent_id>                 ← root span for the run
├── step <node_id>                      ← one per workflow node (custom span)
│   ├── chat <model>                    ← model call (gen_ai.operation.name = chat)
│   └── execute_tool <tool_name>        ← tool call
└── step <node_id> …
```

Human steps (choice, review, approval) appear as spans too, with the wait time, so you can separate system latency from human think time.

## Attributes to set

| Attribute | On | Notes |
|---|---|---|
| `gen_ai.operation.name` | model/agent spans | `chat`, `invoke_agent`, `execute_tool` |
| `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.response.model` | model spans | Needed to compare models |
| `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens` | model spans | Basis of cost |
| `gen_ai.agent.name` / `gen_ai.agent.id` | agent spans | Use the spec's `agent.id` |
| custom: `agent.version`, `workflow.node_id`, `run.id`, `session.id` | all | Joins traces to product events |
| error type / status | on failure | Use standard span status |

## Content capture

Prompt and response bodies often contain PII, so they are **off by default**, controlled by `instrumentation.trace_content`. Enable only in debugging environments or with consent, with redaction and short retention. When off, still record sizes (token counts) and structure.

## Cost

- Compute cost per span from tokens × model price (keep prices in config, not code)
- Roll up to **cost per run** and put it on `run_completed` as `cost_usd`
- Set per-run and per-user budgets; emit `error_raised` with `error_class: budget_exceeded` when hit
- Track cost per *successful* run, not per call, because retries and abandoned runs are real cost

## Operational signals

Alert on: error rate per node, p95 latency per node, cost per run drift, token growth per run, spike in `run_abandoned`, spike in `draft_regenerated`. Alert on **changes after a version bump** by comparing against the previous `agent_version`.

## Debugging workflow

1. Find the run by `run_id` from a user report or an event
2. Open its trace; find the slow or failing node
3. Compare with a good run of the same version
4. Turn the failure into an eval scenario (see [evals](../05-quality/evals.md))
