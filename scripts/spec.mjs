#!/usr/bin/env node
// Agent Spec tool: validate | mermaid | events
// Usage: node scripts/spec.mjs <validate|mermaid|events> <path-to-agent-spec.yaml>
import { readFileSync } from "node:fs";
import yaml from "js-yaml";

const NODE_TYPES = ["llm", "tool", "deterministic", "router", "choice", "form", "review", "approval", "display", "end"];
const INTERACTIVE = ["choice", "form", "review", "approval", "display"];
// Keep in sync with docs/03-experience/components.md
const UI_CATALOGUE = ["chat-input", "choice-cards-single", "choice-cards-multi", "form-short", "form-upload", "draft-review", "approval-card", "progress-stepper", "result-canvas", "status-inbox", "error-banner"];
const TOP_LEVEL =["spec_version", "agent", "brief", "architecture", "workflow", "guardrails", "instrumentation", "evals"];

// Events derived automatically from node type. Keep in sync with docs/04-instrumentation/event-taxonomy.md
const NODE_EVENTS = {
  choice: ["option_selected"],
  form: ["form_submitted"],
  review: ["draft_edited", "draft_regenerated", "draft_accepted"],
  approval: ["approval_given", "approval_rejected"],
  llm: ["error_raised"],
  tool: ["error_raised"],
};
const RUN_EVENTS = ["run_started", "run_completed", "run_abandoned", "escalated", "feedback_given"];

function load(path) {
  return yaml.load(readFileSync(path, "utf8"));
}

function validate(spec) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);

  for (const k of TOP_LEVEL) if (!spec?.[k]) err(`missing top-level section: ${k}`);
  if (errors.length) return { errors, warnings };

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.agent.id ?? "")) err("agent.id must be kebab-case");
  if (!/^\d+\.\d+\.\d+$/.test(spec.agent.version ?? "")) err("agent.version must be semver");
  if (!["conversational", "guided", "copilot", "background", "event-triggered", "multi-agent"].includes(spec.agent.archetype))
    err(`agent.archetype invalid: ${spec.agent.archetype}`);
  if (!spec.brief.success_metrics?.length) err("brief.success_metrics needs at least one metric");
  if (!spec.architecture.rationale) err("architecture.rationale is required");

  const nodes = spec.workflow.nodes ?? [];
  const ids = new Set();
  for (const n of nodes) {
    if (ids.has(n.id)) err(`duplicate node id: ${n.id}`);
    ids.add(n.id);
    if (!NODE_TYPES.includes(n.type)) err(`node ${n.id}: invalid type "${n.type}"`);
    if (INTERACTIVE.includes(n.type) && !n.ui) err(`node ${n.id}: interactive type "${n.type}" must declare ui`);
    if (n.ui && !UI_CATALOGUE.includes(n.ui)) warnings.push(`node ${n.id}: ui "${n.ui}" is not in the component catalogue (add it to docs/03-experience/components.md and UI_CATALOGUE)`);
    if (n.type !== "end" && !n.next?.length) err(`node ${n.id}: non-end node needs at least one next`);
    if (n.type === "end" && n.next?.length) err(`node ${n.id}: end node cannot have next`);
    if (["choice", "router"].includes(n.type) && (n.next?.length ?? 0) > 1 && n.next.some((e) => !e.when))
      err(`node ${n.id}: branching ${n.type} needs a "when" on every edge`);
  }
  if (!ids.has(spec.workflow.entry)) err(`workflow.entry "${spec.workflow.entry}" is not a node`);
  for (const n of nodes) for (const e of n.next ?? []) if (!ids.has(e.to)) err(`node ${n.id}: edge to unknown node "${e.to}"`);
  if (!nodes.some((n) => n.type === "end")) err("workflow needs at least one end node");

  // reachability
  const seen = new Set();
  const stack = [spec.workflow.entry];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id) || !byId[id]) continue;
    seen.add(id);
    for (const e of byId[id].next ?? []) stack.push(e.to);
  }
  for (const n of nodes) if (!seen.has(n.id)) err(`node ${n.id}: unreachable from entry`);

  // every node must be able to reach an end (no dead loops)
  const canEnd = new Set(nodes.filter((n) => n.type === "end").map((n) => n.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const n of nodes) if (!canEnd.has(n.id) && (n.next ?? []).some((e) => canEnd.has(e.to))) (canEnd.add(n.id), (changed = true));
  }
  for (const n of nodes) if (!canEnd.has(n.id)) err(`node ${n.id}: cannot reach any end node (dead loop)`);

  // guardrails
  for (const a of spec.guardrails.approvals ?? []) {
    if (!byId[a]) err(`guardrails.approvals references unknown node "${a}"`);
    else if (byId[a].type !== "approval") err(`guardrails.approvals: node "${a}" must be type approval`);
  }
  for (const n of nodes) if (n.type === "approval" && !(spec.guardrails.approvals ?? []).includes(n.id))
    warnings.push(`approval node ${n.id} is not listed in guardrails.approvals`);
  for (const n of nodes) for (const t of n.tools ?? [])
    if (!(spec.guardrails.permissions?.tools_allowed ?? []).includes(t)) err(`node ${n.id}: tool "${t}" not in guardrails.permissions.tools_allowed`);

  if (spec.instrumentation.pii_in_events === true) warnings.push("instrumentation.pii_in_events is true: confirm consent and retention policy");
  if (spec.architecture.type === "agent" && spec.agent.archetype !== "conversational" && !spec.guardrails.approvals?.length)
    warnings.push("autonomous agent with no approval gates: confirm this is intended");
  if (!spec.evals.scenarios?.length) err("evals.scenarios needs at least one scenario");
  return { errors, warnings };
}

function mermaid(spec) {
  const icon = { llm: "🧠", tool: "🔧", deterministic: "⚙️", router: "🔀", choice: "👆", form: "📝", review: "✏️", approval: "✅", display: "🖥️", end: "🏁" };
  const lines = ["flowchart TD"];
  for (const n of spec.workflow.nodes) {
    const label = `${icon[n.type] ?? ""} ${n.title}`.trim().replaceAll('"', "'");
    const sub = n.ui ? `<br/><i>${n.ui}</i>` : "";
    const shape = n.type === "end" ? `(["${label}"])` : ["router", "choice"].includes(n.type) ? `{"${label}${sub}"}` : `["${label}${sub}"]`;
    lines.push(`  ${n.id}${shape}`);
  }
  for (const n of spec.workflow.nodes) for (const e of n.next ?? [])
    lines.push(e.when ? `  ${n.id} -->|${e.when}| ${e.to}` : `  ${n.id} --> ${e.to}`);
  const human = spec.workflow.nodes.filter((n) => INTERACTIVE.includes(n.type)).map((n) => n.id);
  lines.push("  classDef human fill:#EEF4FF,stroke:#3B6FE0,color:#1B2A4A;");
  lines.push("  classDef auto fill:#F7F7F5,stroke:#B8B8B0,color:#333;");
  lines.push("  classDef stop fill:#EAF6EE,stroke:#4C9A6A,color:#1E4D31;");
  for (const n of spec.workflow.nodes) lines.push(`  class ${n.id} ${n.type === "end" ? "stop" : human.includes(n.id) ? "human" : "auto"};`);
  return lines.join("\n");
}

function events(spec) {
  const rows = [];
  for (const e of RUN_EVENTS) rows.push({ event: e, node: "(run)", source: "run" });
  for (const n of spec.workflow.nodes) {
    if (n.type !== "end") {
      rows.push({ event: "step_started", node: n.id, source: "auto" });
      rows.push({ event: "step_completed", node: n.id, source: "auto" });
    }
    for (const e of NODE_EVENTS[n.type] ?? []) rows.push({ event: e, node: n.id, source: "auto" });
    for (const e of n.events ?? []) rows.push({ event: e, node: n.id, source: "custom" });
  }
  for (const e of spec.instrumentation.extra_events ?? []) rows.push({ event: e, node: "(any)", source: "custom" });
  return rows;
}

const [cmd, path] = process.argv.slice(2);
if (!cmd || !path || !["validate", "mermaid", "events"].includes(cmd)) {
  console.error("Usage: node scripts/spec.mjs <validate|mermaid|events> <agent-spec.yaml>");
  process.exit(2);
}
const spec = load(path);
if (cmd === "validate") {
  const { errors, warnings } = validate(spec);
  warnings.forEach((w) => console.log(`warn  ${w}`));
  errors.forEach((e) => console.log(`error ${e}`));
  console.log(errors.length ? `\nINVALID: ${errors.length} error(s)` : "\nOK: spec is valid");
  process.exit(errors.length ? 1 : 0);
} else if (cmd === "mermaid") {
  console.log(mermaid(spec));
} else {
  console.log("| event | node | source |\n|---|---|---|");
  for (const r of events(spec)) console.log(`| ${r.event} | ${r.node} | ${r.source} |`);
}
