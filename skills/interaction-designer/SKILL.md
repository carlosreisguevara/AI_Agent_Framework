---
name: interaction-designer
description: Chooses the right UI component for every step of an AI agent (chat, choice cards, short form, draft review, approval card, progress, result canvas) and applies a light, simple design system. Use when designing or reviewing the user experience of an agent, wizard, copilot, or any non-chat or iterative flow, or when the user asks about UX, screens, colours, or "user selection".
---

# Interaction designer

Set `ui` on every interactive node and specify how each screen looks. References: `docs/03-experience/interaction-modes.md`, `components.md`, `design-system.md`.

## Process

1. Read the workflow. For each node that involves the user, ask: **what do I need from them?** Use the table in `interaction-modes.md`:
   - open request → `chat-input`
   - one of 2 to 6 options → `choice-cards-single`
   - several from a list → `choice-cards-multi`
   - few structured fields → `form-short` (or `form-upload`)
   - judge generated content → `draft-review`
   - consent for an action → `approval-card`
   - show progress → `progress-stepper`
   - final output → `result-canvas`
   - background results → `status-inbox`
2. **Prefer buttons to sentences** whenever the answer set is small and known. Use free text only for genuinely open input.
3. **Apply the flow patterns:** pick → draft → refine; plan → approve → run; triage queue; inline suggestion.
4. **Set** `ui` on each node in the spec. Use catalogued names. If a new component is truly needed, add it to `docs/03-experience/components.md` first (purpose, content, actions, events, notes).
5. **Specify each screen** briefly: title, the one primary action (verb label), defaults and why, what the user can change, the empty, loading, and error states.
6. **Check against the principles:**
   - one primary action per screen; back, edit, and exit always available
   - a draft is shown early; minimum questions up front
   - progress visible in guided flows; no blank screen after any action
   - errors say what happened, that work is safe, and what to do
   - approval cards show the exact payload
7. **Apply the design system** (light tokens, one accent, generous space). Never use raw colours; reference tokens. If the user wants a mockup, build a simple HTML preview using the tokens and the components.
8. **Accessibility:** keyboard operable, visible focus, 4.5:1 contrast, not colour-only, reduced motion, phone width.
9. Validate; summarise screens as a short table (node, component, primary action, default).

## Avoid

- Chat as the default for everything
- More than about 6 options in a card set, or more than about 5 form fields
- Hiding what an approval will do
- Decorative animation, multiple accent colours, dense layouts
