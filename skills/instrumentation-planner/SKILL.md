---
name: instrumentation-planner
description: Plans event tracking, tracing, and usage metrics for an AI agent by deriving them from its workflow graph, with privacy rules and dashboards. Use when the user asks about analytics, event tracking, telemetry, observability, metrics, cost tracking, usage, or "how will we know it's working", or when finishing an agent design.
---

# Instrumentation planner

Fill `instrumentation` and node-level `events`. References: `docs/04-instrumentation/event-taxonomy.md`, `tracing.md`, `metrics.md`, and `schemas/event.schema.json`.

## Process

1. **Start from the metrics.** Read `brief.success_metrics`. For each, write the formula in terms of events (see the metric definitions in `metrics.md`). Any metric you can't compute → add the missing event.
2. **Generate the baseline plan:**
   ```bash
   node scripts/spec.mjs events <spec>
   ```
   It lists run events plus per-node events derived from node types. Review it with the user.
3. **Add only necessary custom events** in `nodes[].events` or `instrumentation.extra_events` (object_action, past tense, one meaning). Document each: when it fires and its `props`.
4. **Define props** for key events using the taxonomy (for example `option_id`, `was_default`, `attempt`, `edit_size_bucket`, `error_class`, `cost_usd`). Use IDs, counts, and buckets, never raw text.
5. **Privacy.** Keep `pii_in_events: false` unless there is a documented need and consent basis. Use `user_hash`. Keep `trace_content: false` outside debugging. Route free-text feedback to a separate protected store.
6. **Tracing.** Specify OpenTelemetry GenAI spans: `invoke_agent` root, a span per node, `chat` and `execute_tool` children; attributes for model, tokens, agent id and version, `run.id`, `workflow.node_id`. Pin the convention version.
7. **Cost.** Compute cost per span from tokens and price config; roll up to `cost_usd` on `run_completed`; define per-run and per-user budgets.
8. **Dashboards and alerts.** Propose the five minimum dashboards (health, funnel, quality, choices, cost) and alerts (error rate per node, p95 latency, cost drift, abandonment and regenerate spikes after a version bump).
9. **Verification plan:** a test run emits events that validate against the envelope schema; every interactive node emits its decision event; every run ends in `run_completed` or `run_abandoned`; spot check for raw text.
10. Validate; give the user the event table and the metric formulas.

## Avoid

- Instrumenting after the fact; derive from the workflow
- Logging raw prompts or user text in product events
- Renaming events or node ids casually (breaks history)
- Client-only events for anything that matters
