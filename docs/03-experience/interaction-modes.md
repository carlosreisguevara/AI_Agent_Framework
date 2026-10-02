# Interaction modes

Not every step should be a chat message. Choose the lightest interaction that gets the job done, and mix modes within one agent.

## Pick by what you need from the user

| You need… | Use | Node type | `ui` component |
|---|---|---|---|
| An open-ended request or follow-up | Chat | `form` or free input | `chat-input` |
| One pick from 2 to 6 options | Single-choice cards | `choice` | `choice-cards-single` |
| Several picks from a list | Multi-choice cards | `choice` | `choice-cards-multi` |
| A few structured fields | Short form | `form` | `form-short` |
| A file or a long paste | Upload / paste area | `form` | `form-upload` |
| Judgement on generated content | Draft review (edit, accept, regenerate) | `review` | `draft-review` |
| Consent for a specific action | Approval card | `approval` | `approval-card` |
| Visibility into a running job | Progress / status | `display` | `progress-stepper` |
| The finished result | Result canvas (copy, download, next action) | `display` | `result-canvas` |

Full component specs: [components.md](components.md).

## Principles

1. **Buttons beat sentences** when the answer set is small and known. They're faster, unambiguous, and measurable (`option_selected`).
2. **Show a draft early.** Reacting to a draft is easier than answering questions. Ask the minimum, draft, then refine.
3. **Always offer an exit and a back.** Users can go back, edit earlier choices, or stop at any step.
4. **Defaults over blank fields.** Pre-select the likely option; explain it in one line.
5. **One primary action per screen.** Secondary actions are visually quieter.
6. **Show your work lightly.** Say what the agent is doing in plain words ("Reading your notes…"), not internals.
7. **Keep users oriented.** Progress indicator for guided flows; a summary of choices made so far.
8. **Explain, then act, for consequential steps.** Approval cards state the exact action and its effect.
9. **Make errors recoverable.** Say what happened, that nothing was lost, and what to do next. Offer retry and a manual route.
10. **Respect attention.** Background agents notify only when something needs the user or is done.

## Flow patterns

- **Pick → draft → refine:** `choice` → `llm` → `review` loop. The workhorse for guided agents.
- **Plan → approve → run:** `llm` (plan) → `approval` → autonomous/`tool` steps → `display`. For agents with real-world effects.
- **Triage queue:** event-triggered agent proposes → items wait in a queue → user approves or edits in batches.
- **Inline suggestion:** copilot proposes a change in place → accept, edit, or dismiss.

## Streaming and latency

- Stream text drafts as they arrive; show structure (headings, steps) before details.
- For waits over ~3 seconds show a progress state with what's happening; over ~15 seconds let the user leave and be notified.
- Never leave a blank screen after an action.

## Accessibility

- All choices operable by keyboard; visible focus states
- Don't rely on colour alone; pair with text or icons
- Contrast at least 4.5:1 for body text
- Respect reduced-motion preferences
- Announce status changes to screen readers (live regions)
