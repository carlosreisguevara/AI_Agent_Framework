# Agent brief

A brief is half a page that makes the rest of the design possible. It lives in the `brief` section of the spec.

## Fields

| Field | Write |
|---|---|
| `goal` | The outcome the user gets, in one sentence. Not "uses AI to…" |
| `users` | Who, and in what situation. Name the moment they reach for this agent |
| `success_metrics` | 1 to 3 metrics with targets. They must be measurable with the events you'll emit |
| `out_of_scope` | What the agent must refuse or hand off. Prevents scope creep and unsafe behaviour |

## Discovery questions

Ask these, in roughly this order:

1. What does the user do today, and what is painful about it?
2. What does "done" look like? What does the user walk away with?
3. How often will this run, and how long should it take?
4. Does the user need to be present? Should it ever act without asking?
5. What systems, data, or documents does it need? Who owns access?
6. What is the worst thing it could do? Who is hurt if it's wrong?
7. Where must a human decide, and where is automation welcome?
8. How will we know it's working after launch?
9. What would make us shut it down?

## Good metrics

Pair a **value** metric with a **quality** metric and a **cost** metric:

| Kind | Examples |
|---|---|
| Value | completion rate, time to value, tasks per user per week |
| Quality | edit rate, regenerate rate, thumbs-down rate, escalation rate |
| Cost | cost per completed run, tokens per run |

## Smells

- Goal describes the technology, not the outcome
- No out-of-scope list
- Success measured by "users like it"
- Metrics you have no event for
