#!/usr/bin/env node

import {
  clamp,
  loadComponentRegistry,
  loadPolicies,
  parseCliInput,
  printOutput,
  stableHash,
  uniq,
  validateWithSchema,
  loadSchema,
} from "./lib/shared.mjs";

function parseInput(message) {
  let parsed;
  try {
    parsed = JSON.parse(message);
  } catch {
    throw new Error("Expected JSON input for --json argument.");
  }

  const envelope = parsed?.intent_envelope ?? parsed;
  if (!envelope || typeof envelope !== "object") {
    throw new Error("Input must be an IntentEnvelope or GuidanceDecision JSON object.");
  }

  const decisionStatus = typeof parsed?.status === "string" ? parsed.status : null;
  if (decisionStatus && decisionStatus !== "resolved") {
    throw new Error(
      `GuidanceDecision.status is '${decisionStatus}'. Resolve clarification/rejection before planning a recipe.`,
    );
  }

  const schemaErrors = validateWithSchema(envelope, loadSchema("intent.schema.json"));
  if (schemaErrors.length > 0) {
    throw new Error(`IntentEnvelope schema validation failed (${schemaErrors.length} error(s)).`);
  }

  const candidates = Array.isArray(parsed?.candidates)
    ? parsed.candidates
        .map((candidate) => (typeof candidate?.slug === "string" ? candidate.slug : ""))
        .filter(Boolean)
    : [];

  return {
    envelope,
    candidates: uniq(candidates),
    decision_status: decisionStatus,
  };
}

function buildIntentMap(policies) {
  const intents = Array.isArray(policies.intents) ? policies.intents : [];
  return new Map(intents.map((intent) => [intent.type, intent]));
}

function buildRegistryMap(registry) {
  return new Map(registry.map((component) => [component.slug, component]));
}

function pickByCapabilities(registry, capabilities, exclude = new Set()) {
  const target = new Set(capabilities ?? []);
  return registry
    .filter((component) => !exclude.has(component.slug))
    .map((component) => {
      const overlap = (component.capabilities ?? []).filter((cap) => target.has(cap)).length;
      return { component, overlap };
    })
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.component.slug.localeCompare(b.component.slug))
    .map((entry) => entry.component.slug);
}

function buildComponents(envelope, candidates, registry, intentMap, policies) {
  const selected = [];
  const seen = new Set();
  const registryMap = buildRegistryMap(registry);

  const addComponent = (slug, role, rationale) => {
    if (!registryMap.has(slug)) return;
    if (seen.has(slug)) return;
    seen.add(slug);
    selected.push({ slug, role, rationale });
  };

  for (const intent of envelope.intents) {
    if (intent.type !== "component_request") continue;
    const entities = Array.isArray(intent.entities) ? intent.entities : [];
    entities.forEach((slug) =>
      addComponent(slug, "requested", "Direct user-requested Dinachi component."),
    );
  }

  candidates.slice(0, 3).forEach((slug) =>
    addComponent(slug, "suggested", "High-confidence resolver candidate."),
  );

  for (const intent of envelope.intents) {
    if (intent.type === "component_request") continue;
    const policy = intentMap.get(intent.type);
    if (!policy) continue;

    const preferred = Array.isArray(policy.preferredComponents)
      ? policy.preferredComponents
      : [];
    let candidatesForIntent = preferred.filter((slug) => registryMap.has(slug));

    if (candidatesForIntent.length === 0) {
      candidatesForIntent = pickByCapabilities(
        registry,
        Array.isArray(policy.targetCapabilities) ? policy.targetCapabilities : [],
        seen,
      );
    }

    candidatesForIntent.slice(0, 2).forEach((slug) =>
      addComponent(slug, "intent-derived", `Added for intent type '${intent.type}'.`),
    );
  }

  const hasDangerous = envelope.intents.some((intent) => intent.type === "dangerous_action");
  if (hasDangerous) {
    const confirmCandidates = registry.filter((component) => component.supportsConfirmation === true);
    const preferred = confirmCandidates.find((component) => component.slug === "alert-dialog") ?? confirmCandidates[0];
    if (preferred) {
      addComponent(preferred.slug, "safety", "Auto-added confirmation guard for destructive workflow.");
    }
  }

  if (selected.length === 0 && registryMap.has("card")) {
    addComponent("card", "fallback", "Fallback container when no specific component mapping is available.");
  }

  return selected;
}

function buildActions(envelope, intentMap) {
  const actions = [];
  const seen = new Set();
  const intentTypes = envelope.intents.map((intent) => intent.type);

  for (const intentType of intentTypes) {
    const policy = intentMap.get(intentType);
    if (!policy) continue;
    const intentActions = Array.isArray(policy.actions) ? policy.actions : [];
    intentActions.forEach((action) => {
      const id = action?.id;
      if (typeof id !== "string" || id.length === 0 || seen.has(id)) return;
      seen.add(id);
      actions.push({
        id,
        type: action.type ?? "action",
        label: action.label ?? id,
        side_effect: action.side_effect === true,
        requires_confirmation: action.requires_confirmation === true,
      });
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: "view",
      type: "view",
      label: "View",
      side_effect: false,
      requires_confirmation: false,
    });
  }

  return actions;
}

function buildBindings(envelope, intentMap) {
  const bindings = [];
  const seen = new Set();
  for (const intent of envelope.intents) {
    const policy = intentMap.get(intent.type);
    if (!policy) continue;
    const requiredData = Array.isArray(policy.requiredData) ? policy.requiredData : [];
    requiredData.forEach((source) => {
      const key = `${intent.type}:${source}`;
      if (seen.has(key)) return;
      seen.add(key);
      bindings.push({
        source,
        target: intent.type,
        required: true,
      });
    });
  }
  return bindings;
}

function buildStates(envelope, intentMap) {
  const states = new Set(["idle"]);
  for (const intent of envelope.intents) {
    const policy = intentMap.get(intent.type);
    if (!policy) continue;
    const defaultStates = Array.isArray(policy.defaultStates) ? policy.defaultStates : [];
    defaultStates.forEach((state) => {
      if (typeof state === "string" && state.length > 0) {
        states.add(state);
      }
    });
  }
  return [...states];
}

function buildLayout(envelope) {
  const sections = [
    {
      id: "main",
      title: "Main Workflow",
      description: "Primary generated interaction path.",
    },
  ];

  const intentTypes = new Set(envelope.intents.map((intent) => intent.type));
  if (intentTypes.has("async_feedback")) {
    sections.push({
      id: "feedback",
      title: "Async Feedback",
      description: "Progress and completion feedback states.",
    });
  }
  if (intentTypes.has("confirm_action") || intentTypes.has("dangerous_action")) {
    sections.push({
      id: "confirmation",
      title: "Confirmation",
      description: "User confirmation guard for sensitive actions.",
    });
  }

  return {
    type: "stack",
    sections,
  };
}

function inferGoal(envelope, components) {
  const explicit = envelope.intents.find(
    (intent) => intent.type === "component_request" && Array.isArray(intent.entities) && intent.entities.length > 0,
  );
  if (explicit) {
    return `Generate UI using requested Dinachi components: ${explicit.entities.join(", ")}.`;
  }

  const intentTypes = envelope.intents.map((intent) => intent.type);
  if (intentTypes.length > 0) {
    return `Generate a Dinachi workflow optimized for intents: ${uniq(intentTypes).join(", ")}.`;
  }

  return `Generate a Dinachi UI with components: ${components.map((component) => component.slug).join(", ")}.`;
}

function buildRecipe(input, registry, policies) {
  const { envelope, candidates, decision_status } = input;
  const intentMap = buildIntentMap(policies);
  const components = buildComponents(envelope, candidates, registry, intentMap, policies);
  const actions = buildActions(envelope, intentMap);
  const bindings = buildBindings(envelope, intentMap);
  const states = buildStates(envelope, intentMap);
  const layout = buildLayout(envelope);

  const sourceIntents = new Set(envelope.intents.map((intent) => intent.type));
  if (sourceIntents.has("dangerous_action")) {
    sourceIntents.add(policies?.safety?.confirmIntent ?? "confirm_action");
  }

  const recipe = {
    recipe_id: `recipe_${stableHash(envelope.request_id)}`,
    goal: inferGoal(envelope, components),
    layout,
    components,
    actions,
    bindings,
    states,
    metadata: {
      source_request_id: envelope.request_id,
      source_intents: [...sourceIntents],
      confidence: Number(clamp(Number(envelope.confidence ?? 0.5), 0, 1).toFixed(2)),
      ambiguities: Array.isArray(envelope.ambiguities) ? envelope.ambiguities : [],
      ...(decision_status ? { decision_status } : {}),
    },
  };

  const recipeSchemaErrors = validateWithSchema(recipe, loadSchema("recipe.schema.json"));
  if (recipeSchemaErrors.length > 0) {
    throw new Error(`Generated recipe failed schema validation (${recipeSchemaErrors.length} error(s)).`);
  }

  return recipe;
}

function formatHuman(recipe) {
  return [
    `Recipe ID: ${recipe.recipe_id}`,
    `Goal: ${recipe.goal}`,
    `Components: ${recipe.components.map((component) => component.slug).join(", ")}`,
    `Actions: ${recipe.actions.map((action) => action.id).join(", ")}`,
    `States: ${recipe.states.join(", ")}`,
  ].join("\n");
}

function main() {
  const { jsonMode, message, parseError } = parseCliInput(process.argv);
  if (parseError) {
    console.error(`Error: ${parseError}`);
    process.exit(1);
  }
  if (!message) {
    console.error("Usage: plan-recipe.mjs --json '<IntentEnvelope or GuidanceDecision JSON>'");
    process.exit(1);
  }

  try {
    const input = parseInput(message);
    const recipe = buildRecipe(input, loadComponentRegistry(), loadPolicies());
    printOutput(jsonMode, recipe, formatHuman);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
