# Component catalogue

The `ui` value on an interactive node names one of these. Use them as-is before inventing new ones. If you add one, add it here. Styling comes from the [design system](design-system.md).

Each entry: **purpose · content · actions · events · states · notes**.

## `chat-input`
- **Purpose:** open-ended text from the user.
- **Content:** textarea, 2 to 4 suggested prompts when empty, a one-line scope statement.
- **Actions:** send (primary).
- **Events:** `step_completed`; log message length, never content, unless `pii_in_events: true`.
- **Notes:** always show what the agent can and can't do.

## `choice-cards-single`
- **Purpose:** pick exactly one of 2 to 6 options.
- **Content:** cards with a title and one-line description; recommended option pre-selected and labelled.
- **Actions:** continue (primary), back.
- **Events:** `option_selected` with `props.option_id`, `props.was_default`.
- **Notes:** more than 6 options → group or search instead.

## `choice-cards-multi`
- **Purpose:** pick several from a generated or fixed list.
- **Content:** selectable cards with checkboxes; select-all and clear; count of selected.
- **Actions:** continue (disabled until at least min selected), back.
- **Events:** `option_selected` with `props.option_ids`, `props.selected_count`, `props.offered_count`.
- **Notes:** pre-select the model's top picks; let the user add their own.

## `form-short`
- **Purpose:** collect a few structured fields (up to about 5).
- **Content:** labelled inputs, helper text, sensible defaults, inline validation.
- **Actions:** continue (primary).
- **Events:** `form_submitted` with `props.fields_filled`, `props.validation_errors`.
- **Notes:** ask only what changes the output.

## `form-upload`
- **Purpose:** file or long paste.
- **Content:** drop zone, accepted types and size limits, paste option, preview of what was received.
- **Actions:** continue, replace.
- **Events:** `form_submitted` with `props.file_type`, `props.size_bucket`.
- **Notes:** state retention ("deleted when you finish").

## `draft-review`
- **Purpose:** the user judges generated content: edit, accept, or regenerate.
- **Content:** editable draft; side controls for quick adjustments (shorter, more formal); a visible "regenerate" with optional guidance.
- **Actions:** accept (primary), regenerate, back.
- **Events:** `draft_edited` (`props.edit_size_bucket`), `draft_regenerated` (`props.reason`), `draft_accepted`.
- **Notes:** the best quality signal you have. Cap regenerates (for example 3) and offer manual editing as the exit.

## `approval-card`
- **Purpose:** consent for one specific action.
- **Content:** what will happen, to what/whom, the exact payload (recipient, diff, amount), effect and reversibility.
- **Actions:** approve (primary), edit, reject.
- **Events:** `approval_given`, `approval_rejected` with `props.action_type`, `props.edited_before_approval`.
- **Notes:** never hide the payload. Keep risky approvals separate from routine ones.

## `progress-stepper`
- **Purpose:** orient the user in a guided flow, or show job progress.
- **Content:** step names, current step, completed steps (clickable to go back), plain-language status line.
- **Actions:** back to a completed step; cancel for long jobs.
- **Events:** none of its own; steps emit their own.

## `result-canvas`
- **Purpose:** present the finished output and next actions.
- **Content:** the result, summary of choices made, copy / download / share, "start another", and a light feedback prompt.
- **Actions:** copy or download (primary), start over.
- **Events:** `feedback_given` (`props.rating`), then `run_completed` fires on leaving or on primary action.
- **Notes:** ask for feedback once, lightly (thumbs plus optional reason).

## `status-inbox`
- **Purpose:** results and requests from background or event-driven agents.
- **Content:** list grouped by "Needs you", "Done", "Failed"; each row shows what, when, and the next action.
- **Actions:** open, approve in bulk where safe, dismiss.
- **Events:** `step_completed` for each decision; `escalated` when handed to a human.

## `error-banner`
- **Purpose:** recover from failure.
- **Content:** what happened, that user work is safe, and what to do.
- **Actions:** retry (primary), use the manual route, contact a human.
- **Events:** `error_raised` with `props.error_class`, never raw messages containing user data.
