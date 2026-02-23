#!/usr/bin/env node

import {
  loadComponentRegistry,
  loadPolicies,
  loadSchema,
  parseCliInput,
  printOutput,
  validateWithSchema,
} from "./lib/shared.mjs";

function parseRecipe(message) {
  try {
    return JSON.parse(message);
  } catch {
    throw new Error("Expected JSON string input for UIRecipe.");
  }
}

function validateRecipe(recipe, registry, policies) {
  const errors = [];
  const warnings = [];
  const fixes = [];
  const registryMap = new Map(registry.map((entry) => [entry.slug, entry]));

  const schemaErrors = validateWithSchema(recipe, loadSchema("recipe.schema.json"));
  schemaErrors.forEach((error) => {
    errors.push({
      code: error.code,
      message: error.message,
      path: error.path,
    });
  });

  const components = Array.isArray(recipe.components) ? recipe.components : [];
  const actions = Array.isArray(recipe.actions) ? recipe.actions : [];
  const bindings = Array.isArray(recipe.bindings) ? recipe.bindings : [];
  const states = Array.isArray(recipe.states) ? recipe.states : [];
  const sourceIntents = Array.isArray(recipe?.metadata?.source_intents)
    ? recipe.metadata.source_intents
    : [];

  const seen = new Set();
  const duplicates = new Set();
  components.forEach((component, idx) => {
    const slug = component?.slug;
    if (typeof slug !== "string") return;
    if (!registryMap.has(slug)) {
      errors.push({
        code: "UNKNOWN_COMPONENT_SLUG",
        message: `Unknown Dinachi component slug: ${slug}`,
        path: `components[${idx}].slug`,
      });
      fixes.push(`Replace '${slug}' with a slug from components.registry.json.`);
    }
    if (seen.has(slug)) {
      duplicates.add(slug);
    }
    seen.add(slug);
  });

  if (duplicates.size > 0) {
    warnings.push({
      code: "DUPLICATE_COMPONENTS",
      message: `Duplicate component slugs: ${[...duplicates].join(", ")}`,
      path: "components",
    });
    fixes.push("Deduplicate repeated component slugs.");
  }

  if (bindings.length === 0) {
    warnings.push({
      code: "EMPTY_BINDINGS",
      message: "No bindings found. Generated UI may miss state wiring.",
      path: "bindings",
    });
    fixes.push("Add bindings for required data flows.");
  }

  if (states.length === 0) {
    warnings.push({
      code: "EMPTY_STATES",
      message: "No states found. Add states for runtime clarity.",
      path: "states",
    });
    fixes.push("Add at least idle/loading/success/error states when relevant.");
  }

  const hasSideEffectAction = actions.some((action) => action?.side_effect === true);
  const confirmIntent = policies?.safety?.confirmIntent ?? "confirm_action";
  const confirmProperty = policies?.safety?.confirmComponentProperty ?? "supportsConfirmation";

  if (hasSideEffectAction) {
    if (!sourceIntents.includes(confirmIntent)) {
      errors.push({
        code: "SIDE_EFFECT_CONFIRM_INTENT_REQUIRED",
        message: `Side-effect actions require '${confirmIntent}' in metadata.source_intents.`,
        path: "metadata.source_intents",
      });
      fixes.push(`Include '${confirmIntent}' in metadata.source_intents.`);
    }

    const hasConfirmComponent = components.some((component) => {
      const slug = component?.slug;
      if (!registryMap.has(slug)) return false;
      return registryMap.get(slug)?.[confirmProperty] === true;
    });

    if (!hasConfirmComponent) {
      errors.push({
        code: "SIDE_EFFECT_CONFIRM_COMPONENT_REQUIRED",
        message: "Side-effect actions require a confirmation-capable component.",
        path: "components",
      });
      fixes.push("Add alert-dialog or another supportsConfirmation component.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    fixes: [...new Set(fixes)],
  };
}

function formatHuman(report) {
  const lines = [`Valid: ${report.valid}`];
  if (report.errors.length > 0) {
    lines.push("Errors:");
    report.errors.forEach((error, idx) =>
      lines.push(`  ${idx + 1}. [${error.code}] ${error.message} (${error.path})`),
    );
  }
  if (report.warnings.length > 0) {
    lines.push("Warnings:");
    report.warnings.forEach((warning, idx) =>
      lines.push(`  ${idx + 1}. [${warning.code}] ${warning.message} (${warning.path})`),
    );
  }
  if (report.fixes.length > 0) {
    lines.push("Fixes:");
    report.fixes.forEach((fix, idx) => lines.push(`  ${idx + 1}. ${fix}`));
  }
  return lines.join("\n");
}

function main() {
  const { jsonMode, message, parseError } = parseCliInput(process.argv);
  if (parseError) {
    console.error(`Error: ${parseError}`);
    process.exit(1);
  }
  if (!message) {
    console.error("Usage: validate-recipe.mjs --json '<UIRecipe JSON>'");
    process.exit(1);
  }

  try {
    const report = validateRecipe(parseRecipe(message), loadComponentRegistry(), loadPolicies());
    printOutput(jsonMode, report, formatHuman);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
