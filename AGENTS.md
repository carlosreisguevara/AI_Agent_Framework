# AGENTS.md

Guidance for coding agents working in this repo.

- The **Agent Spec** (`templates/agent-spec.yaml`, schema in `schemas/`) is the source of truth. Never describe an agent's workflow, events, or UI in prose without also reflecting it in the spec.
- After editing any spec, run `node scripts/spec.mjs validate <file>` and fix errors before finishing.
- Keep docs short and practical: purpose, rules, a checklist, an example. Link rather than repeat.
- Skills live in `skills/<name>/SKILL.md` with `name` and `description` frontmatter. The description decides when the skill triggers, so state what it does and when to use it. Keep each `SKILL.md` under 500 lines; put detail in docs and link to it.
- If you change a node type, event name, or UI component, update `scripts/spec.mjs`, `schemas/`, and the matching doc together.
- Never put secrets, real user data, or raw user text in examples or events.
