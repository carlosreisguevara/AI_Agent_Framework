# Usage metrics

Define metrics once, in terms of events, so everyone computes them the same way. Compare **by `agent_version`** to see whether a change helped.

## Core set

| Metric | Definition (from events) | Reads as |
|---|---|---|
| **Starts** | count of `run_started` | Demand |
| **Completion rate** | `run_completed` ÷ `run_started` | Does it work end to end? |
| **Step drop-off** | for each node: runs that `step_started` but never `step_completed` ÷ runs that started it | Where users get stuck |
| **Time to value** | median time from `run_started` to `draft_accepted` or `run_completed` | Is it fast? |
| **First-draft acceptance** | `draft_accepted` with `attempt = 1` and `edited = false` ÷ drafts shown | Output quality |
| **Edit rate** | runs with `draft_edited` ÷ runs with a draft | Output quality (lower is better) |
| **Regenerate rate** | `draft_regenerated` ÷ drafts shown | Output quality, frustration |
| **Default acceptance** | `option_selected` with `was_default` ÷ all `option_selected` | Are defaults well chosen? |
| **Approval rate** | `approval_given` ÷ (given + rejected) | Trust and proposal quality |
| **Edit-before-approve rate** | approvals with `edited_before_approval` ÷ approvals | Proposal quality |
| **Error rate** | `error_raised` ÷ `step_started`, by node | Reliability |
| **Escalation rate** | `escalated` ÷ `run_started` | Coverage gaps |
| **Satisfaction** | `feedback_given` with up ÷ all feedback | Perceived value |
| **Cost per completed run** | sum of `cost_usd` over runs ÷ `run_completed` | Unit economics |
| **Return rate** | users with runs in 2 of the last 4 weeks ÷ users with runs | Habit and retention |

## Segment by

`agent_version`, `archetype`, entry point, user cohort (new vs returning), and, for guided flows, key choices (for example tone).

## Dashboards (minimum)

1. **Health:** starts, completion rate, error rate, p95 latency, cost per run, by version
2. **Funnel:** per-node step funnel with drop-off
3. **Quality:** first-draft acceptance, edit rate, regenerate rate, satisfaction
4. **Choices:** distribution of options selected, default acceptance
5. **Cost:** cost per run, tokens per run, top expensive nodes

Keep the dashboards in the repo (as saved queries or definitions) beside the spec.

## Targets

Set targets in `brief.success_metrics` before launch. Review weekly in the first month. A metric with no owner and no target is decoration.

## Caution

- Small samples mislead; report counts alongside rates
- Abandonment can mean "got what they needed from the first screen"; check with qualitative feedback
- Don't optimise one metric alone (fast but low quality, high approval because users stopped reading)
