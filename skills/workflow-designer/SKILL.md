---
name: workflow-designer
description: Designs an AI agent's workflow as a validated node-and-edge graph in the Agent Spec and renders it as a Mermaid diagram. Use when the user wants to map, visualise, or redesign an agent's steps, branches, loops, or human touchpoints, or asks for a "visual workflow".
---

# Workflow designer

Fill `workflow` (entry, nodes, edges). Reference: `docs/02-design/workflow-graph.md` and `docs/01-foundations/patterns.md`.

## Process

1. **List the steps** from the brief and architecture as plain sentences. Mark which need the user (choose, fill, review, approve) and which are automatic.
2. **Reduce.** Merge steps that share a purpose; split any with "and" in the title. Aim for 3 to 7 user-facing steps in a guided flow. Put the first value-producing step as early as possible.
3. **Assign node types:** `llm`, `tool`, `deterministic`, `router`, `choice`, `form`, `review`, `approval`, `display`, `end`. Prefer `deterministic` over `llm` when the logic is simple and known.
4. **Write nodes** with stable `snake_case` ids (they become `node_id` in events; never rename later without a version note), human titles, and `next` edges.
5. **Label branches:** every edge out of a branching `choice` or `router` needs `when`. Every router has a fallback edge.
6. **Make loops explicit.** A regenerate loop goes `review → generate → review` with a `when: regenerate` edge. Note the cap (for example 3) in the node title or a comment.
7. **Add a human before irreversible actions** (`approval` node), and list tools on the nodes that use them.
8. **Validate, then render:**
   ```bash
   node scripts/spec.mjs validate <spec>
   node scripts/spec.mjs mermaid  <spec>
   ```
   Show the diagram in a ```mermaid fenced block. Blue nodes = human acts, grey = automatic, green = end.
9. **Walk through it with the user:** trace the happy path, then one failure and one loop. Adjust.

## Checks

- Every node reachable from `entry` and able to reach an `end` (the validator enforces this)
- Every interactive node (`choice`, `form`, `review`, `approval`, `display`) has a `ui` (filled by `interaction-designer`)
- No node does two things
- Failure behaviour is noted for each `llm` and `tool` node (handled in `guardrails-designer`)

## Avoid

- Drawing the diagram by hand; generate it from the spec so it can't drift
- Free-text steps where a `choice` would be clearer and measurable
- A router for a distinction that doesn't change the handling
