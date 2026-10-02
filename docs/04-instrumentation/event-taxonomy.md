# Event taxonomy

Two layers of telemetry, kept separate:

| Layer | Answers | Audience | Format |
|---|---|---|---|
| **Product events** (this doc) | What did users do? Is the agent useful? | Product, design, analytics | Named events with the envelope in [`schemas/event.schema.json`](../../schemas/event.schema.json) |
| **Traces** ([tracing.md](tracing.md)) | What did the system do, how slowly, at what cost? | Engineering | OpenTelemetry spans |

They join on `run_id` (and `session_id`).

## Naming

`object_action`, snake_case, past tense: `draft_accepted`, `option_selected`. One meaning per name. Don't encode values in names (`tone_formal_selected` → `option_selected` with `props.option_id`).

## Envelope (on every event)

`event`, `ts`, `agent_id`, `agent_version`, `session_id`, `run_id`, `user_hash`, plus `node_id`, `step_index`, `duration_ms` where applicable, and `props` for the rest.

## Core events

| Event | Fires when | Key `props` |
|---|---|---|
| `run_started` | A run begins | `entry_point`, `archetype`, `trigger` (user/schedule/event) |
| `step_started` | A node begins | n/a (`node_id`) |
| `step_completed` | A node finishes | `outcome` (ok/failed/skipped), `duration_ms` |
| `option_selected` | User picks from a `choice` | `option_id(s)`, `was_default`, `offered_count` |
| `form_submitted` | User submits a `form` | `fields_filled`, `validation_errors` |
| `draft_edited` | User edits a draft | `edit_size_bucket` (small/medium/large) |
| `draft_regenerated` | User asks for another draft | `reason`, `attempt` |
| `draft_accepted` | User accepts a draft | `attempt`, `edited` (bool) |
| `approval_given` | User approves an action | `action_type`, `edited_before_approval` |
| `approval_rejected` | User rejects an action | `action_type`, `reason` |
| `error_raised` | A node fails | `error_class`, `recovered` (bool) |
| `escalated` | Handed to a human/non-AI path | `reason`, `from_node` |
| `feedback_given` | User rates the outcome | `rating` (up/down), `reason_code` |
| `run_completed` | Run reached an end node | `steps_taken`, `total_duration_ms`, `cost_usd` |
| `run_abandoned` | Run ended without completing (timeout or exit) | `last_node_id`, `idle_ms` |

Auto-derived per node type: see [workflow-graph.md](../02-design/workflow-graph.md). Generate your agent's list:

```bash
node scripts/spec.mjs events my-agent.yaml
```

Add agent-specific events in `workflow.nodes[].events` or `instrumentation.extra_events`; keep them rare and documented.

## Privacy rules

1. **No raw user text** in product events by default. Log lengths, counts, buckets, and IDs.
2. `user_hash` is a salted hash, never the raw identifier. No emails or names.
3. If `pii_in_events: true`, record the consent basis and retention in the spec's notes, and restrict access.
4. Free-text feedback goes to a separate, access-controlled store, not the event stream.
5. Honour opt-out and deletion requests; design deletion by `user_hash`.

## Quality rules

- **Emit from the server** where possible; client events get blocked and lost.
- Make events **idempotent** (stable `event_id` or `run_id + node_id + step_index`) so retries don't double count.
- **Version your events:** `agent_version` plus additive changes. Rename = new event, deprecate the old.
- **Sample nothing** at first. Low volume, high value.
- Keep an **event dictionary** (the generated table is a good start) in the repo and update it in the same change as the code.

## Verification checklist

- [ ] Every success metric in the brief can be computed from emitted events
- [ ] Every interactive node emits its decision event
- [ ] Every run ends in `run_completed` or `run_abandoned`
- [ ] A test run produces events that validate against the envelope schema
- [ ] No event contains raw user content (spot check)
