#!/usr/bin/env node

import { loadComponentRegistry, normalizeText, parseCliInput, printOutput, tokenize } from "./lib/shared.mjs";

const BUILD_VERBS = [
  "add",
  "install",
  "init",
  "integrate",
  "implement",
  "build",
  "create",
  "wire",
  "use",
];

const PLAN_HINTS = [
  "flow",
  "experience",
  "journey",
  "good",
  "best",
  "design",
  "plan",
  "strategy",
  "architecture",
  "generative ui",
  "ambiguous",
];

function routePrompt(prompt, slugs) {
  const normalized = normalizeText(prompt);
  const tokens = new Set(tokenize(prompt));
  const matchedSlugs = slugs.filter((slug) => normalized.includes(slug));

  const hasBuildVerb = BUILD_VERBS.some((verb) => tokens.has(verb));
  const hasPlanHint = PLAN_HINTS.some((hint) => normalized.includes(hint));

  if (matchedSlugs.length > 0 && hasBuildVerb) {
    return {
      mode: "build-now",
      reason: "Prompt includes explicit Dinachi components with direct implementation verbs.",
      matched_components: matchedSlugs,
    };
  }

  if (matchedSlugs.length >= 2) {
    return {
      mode: "build-now",
      reason: "Prompt includes multiple explicit Dinachi component slugs.",
      matched_components: matchedSlugs,
    };
  }

  if (hasPlanHint || matchedSlugs.length === 0) {
    return {
      mode: "plan-first",
      reason: "Prompt is broad or does not specify concrete component selection.",
      matched_components: matchedSlugs,
    };
  }

  return {
    mode: "plan-first",
    reason: "Default-safe routing for uncertain prompts.",
    matched_components: matchedSlugs,
  };
}

function formatHuman(result) {
  return [
    `Mode: ${result.mode}`,
    `Reason: ${result.reason}`,
    `Matched components: ${result.matched_components.join(", ") || "(none)"}`,
  ].join("\n");
}

function main() {
  const { jsonMode, message, parseError } = parseCliInput(process.argv);
  if (parseError) {
    console.error(`Error: ${parseError}`);
    process.exit(1);
  }
  if (!message) {
    console.error('Usage: route-mode.mjs --json "<prompt>"');
    process.exit(1);
  }

  const slugs = loadComponentRegistry().map((entry) => entry.slug);
  const result = routePrompt(message, slugs);
  printOutput(jsonMode, result, formatHuman);
}

main();
