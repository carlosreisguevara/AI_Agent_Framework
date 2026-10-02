# Tools, state, and memory

## Tools

A tool is anything the agent can call. Fewer, clearer tools beat many overlapping ones.

**Design each tool like an API for a new colleague:**

- Name it by what it does (`search_orders`, not `query_db`)
- One clear purpose; inputs with types, descriptions, and examples
- Return only what's needed, in a compact, readable shape
- Return actionable errors ("order id must be 8 digits"), not stack traces
- Mark side effects. Read-only tools are cheap to allow; write tools need scrutiny

**Permissions:** list every tool a node may use in `workflow.nodes[].tools`, and every tool the agent may use at all in `guardrails.permissions.tools_allowed`. The validator checks that nodes only use allowed tools. Grant the minimum.

| Tool class | Examples | Default policy |
|---|---|---|
| Read-only | search, fetch, list | Allow |
| Reversible write | create draft, add label | Allow with logging |
| Irreversible or external | send email, charge, delete, publish | **Approval node required** |

## State

State is what the workflow carries from step to step.

- **Run state:** inputs, user choices, drafts. Lives for one run. Keep it small and typed.
- **Session state:** things reused across runs in a visit (preferences chosen).
- **Persistent memory:** anything kept across sessions. Store only with a reason and user awareness. Prefer explicit, user-visible preferences over hidden inference.

Rules:
1. Pass structured data between nodes, not whole chat transcripts.
2. Record *which choice the user made*, not just the output, so you can replay and analyse it.
3. Decide retention up front. Default: delete run state when the run ends unless the user saves it.

## Context

The model sees only what you give it. For each `llm` node define:

- the instruction (short, specific, with an output format)
- the inputs it receives (from run state)
- the examples it needs (2 to 3 beat long rules)
- the output contract (JSON schema where a program consumes it)

Keep prompts in version control next to the spec and bump `agent.version` when they change.

## Model choice

Pick per node, not per agent. Cheap, fast models for classification and extraction; stronger models for drafting and reasoning. Record the choice in your scaffold config and in trace attributes so cost and quality can be compared.
