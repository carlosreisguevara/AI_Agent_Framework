# Archetypes

The archetype sets the shape of the whole experience. Pick one primary archetype; mix interaction modes inside it.

| Archetype | Shape | Primary UI | Typical triggers | Example |
|---|---|---|---|---|
| **conversational** | Open-ended dialogue | Chat | User message | Support assistant, tutor |
| **guided** | Stepwise, user selects and edits, model drafts | Choice cards, forms, draft review | User starts a flow | Report builder, onboarding wizard, plan generator |
| **copilot** | Embedded in another tool, suggests in context | Inline suggestions, side panel | User context changes | Writing assistant, form filler |
| **background** | Runs unattended, reports back | Status, results inbox, notifications | Schedule or user kick-off | Weekly digest, data cleanup |
| **event-triggered** | Reacts to system events | Notifications, approval queue | Webhook, new record, new email | Ticket triage, alert summariser |
| **multi-agent** | Several specialised agents coordinated | Usually hidden behind one of the above | Any | Research team, code review board |

## Choosing

Ask in this order:

1. **Does the user need to be present while it runs?** No → background or event-triggered.
2. **Is the output a thing they will review and edit?** Yes → guided (draft-review loop).
3. **Is the work embedded in another tool they're already using?** Yes → copilot.
4. **Is the input open-ended and the path unknown?** Yes → conversational.
5. **Do several roles with different tools genuinely need to cooperate?** Yes → multi-agent, but hide it from the user.

## What each archetype needs to get right

- **conversational:** clear scope statement, suggested prompts, graceful out-of-scope handling, easy escalation.
- **guided:** a visible progress indicator, back and edit at every step, sensible defaults, one primary action per screen.
- **copilot:** never block the host tool; suggestions must be dismissible and cheap to ignore.
- **background:** a way to see status, cancel, and get results; notify only on what matters; a clear "needs your input" state.
- **event-triggered:** idempotency (same event twice does not act twice), an approval queue for risky actions, an audit log.
- **multi-agent:** one accountable owner for the final answer, per-agent traces, and cost caps.

## Common mistake

Defaulting to chat. If the user is choosing between a few options, a card is faster and less error-prone than a typed reply. Reserve free text for genuinely open input.
