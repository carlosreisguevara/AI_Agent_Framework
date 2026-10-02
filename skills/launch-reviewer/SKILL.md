---
name: launch-reviewer
description: Reviews an AI agent's Agent Spec (and code, if present) against the launch checklist covering spec quality, workflow, UX, guardrails, instrumentation, evals, and operations, and returns a ship, ship-with-conditions, or hold decision with specific fixes. Use before launching or releasing a new agent version, or when the user asks "is this ready?", "review my agent", or "audit this design".
---

# Launch reviewer

Audit objectively against `docs/05-quality/launch-checklist.md`. Be specific, and be willing to say hold.

## Process

1. **Run the tools:**
   ```bash
   node scripts/spec.mjs validate <spec>
   node scripts/spec.mjs mermaid  <spec>
   node scripts/spec.mjs events   <spec>
   ```
   Errors are automatic holds. Review every warning.
2. **Read the spec end to end,** then the code and eval results if they exist. Don't assume something exists because the spec says so; verify.
3. **Go section by section** (Spec, Workflow, Experience, Guardrails, Instrumentation, Quality, Operations). For each item mark **pass**, **fail**, **n/a**, or **unknown** with a one-line reason pointing to the file or spec path.
4. **Check the cross-links that usually break:**
   - every brief metric is computable from emitted events
   - every irreversible action sits behind an `approval` node with a visible payload
   - every `llm` and `tool` node has a failure path
   - every interactive node uses a catalogued `ui`
   - tools used ⊆ tools allowed
   - no raw user text in events or default traces
   - safety and gate evals exist and pass
5. **Decide:**
   - **Hold:** any validation error, any failed safety or gating item, an unmeasurable success metric, no failure path on a critical node
   - **Ship with conditions:** only non-safety items fail; list each with an owner and date
   - **Ship:** all pass or n/a
6. **Report** concisely:
   - decision and the 3 most important reasons
   - table of failed and unknown items with the fix for each
   - what's strong (briefly)
   - the diagram and next review date

## Avoid

- Rubber-stamping; "unknown" is not a pass
- Reviewing the prose and skipping the tools
- Vague findings; every fail names a file or spec path and a concrete change
