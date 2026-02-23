#!/usr/bin/env node

import {
  clamp,
  loadComponentRegistry,
  loadPolicies,
  normalizeText,
  parseCliInput,
  printOutput,
  stableHash,
  tokenize,
  uniq,
  validateWithSchema,
  loadSchema,
} from "./lib/shared.mjs";

function indexBySlug(registry) {
  return new Map(registry.map((entry) => [entry.slug, entry]));
}

function componentScore(prompt, tokens, component, matchedIntents) {
  const normalized = normalizeText(prompt);
  let score = 0;
  const reasons = [];

  if (normalized.includes(component.slug)) {
    score += 92;
    reasons.push("direct-component-match");
  }

  const keywords = Array.isArray(component.keywords) ? component.keywords : [];
  const overlap = keywords.reduce((count, keyword) => {
    const kt = tokenize(keyword);
    return count + (kt.some((token) => tokens.has(token)) ? 1 : 0);
  }, 0);
  if (overlap > 0) {
    score += Math.min(38, overlap * 9);
    reasons.push(`keyword-overlap:${overlap}`);
  }

  const capabilities = Array.isArray(component.capabilities) ? component.capabilities : [];
  for (const intent of matchedIntents) {
    const targetCaps = Array.isArray(intent.targetCapabilities) ? intent.targetCapabilities : [];
    const capOverlap = targetCaps.filter((cap) => capabilities.includes(cap)).length;
    if (capOverlap > 0) {
      score += capOverlap * 10;
      reasons.push(`intent-capability:${intent.type}:${capOverlap}`);
    }
  }

  return {
    slug: component.slug,
    score: Math.round(clamp(score, 0, 99)),
    reasons: uniq(reasons),
    directMatch: normalized.includes(component.slug),
  };
}

function detectMatchedIntents(prompt, policies) {
  const normalized = normalizeText(prompt);
  const tokens = new Set(tokenize(prompt));
  const intents = Array.isArray(policies.intents) ? policies.intents : [];

  return intents
    .filter((intent) => intent.type !== "component_request")
    .filter((intent) => {
      const hints = Array.isArray(intent.hints) ? intent.hints : [];
      return hints.some((hint) => {
        const hintNorm = normalizeText(hint);
        if (!hintNorm) return false;
        if (normalized.includes(hintNorm)) return true;
        const hintTokens = tokenize(hintNorm);
        return hintTokens.some((token) => tokens.has(token));
      });
    })
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
}

function buildCandidates(prompt, registry, policies, matchedIntents) {
  const tokens = new Set(tokenize(prompt));
  const scored = registry
    .map((component) => componentScore(prompt, tokens, component, matchedIntents))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const normalized = normalizeText(prompt);
  const unsupportedAliases = policies.unsupportedAliases ?? {};
  for (const [alias, alternatives] of Object.entries(unsupportedAliases)) {
    if (!normalized.includes(alias)) continue;
    alternatives.forEach((slug, idx) => {
      if (scored.find((item) => item.slug === slug)) return;
      scored.push({
        slug,
        score: 62 - idx * 7,
        reasons: [`suggested-alternative:${alias}`],
        directMatch: false,
      });
    });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, policies.candidateLimit ?? 8);
}

function buildIntentEnvelope(prompt, candidates, matchedIntents, policies) {
  const normalized = normalizeText(prompt);
  const explicitEntities = candidates.filter((candidate) => candidate.directMatch).map((candidate) => candidate.slug);

  const intents = [];
  if (explicitEntities.length > 0) {
    intents.push({
      id: `intent_${intents.length + 1}`,
      type: "component_request",
      confidence: 0.92,
      entities: uniq(explicitEntities).sort(),
      constraints: [],
      required_data: [],
      priority: 1,
    });
  }

  matchedIntents.forEach((intent) => {
    intents.push({
      id: `intent_${intents.length + 1}`,
      type: intent.type,
      confidence: 0.78,
      entities: [],
      constraints: Array.isArray(intent.constraints) ? uniq(intent.constraints).sort() : [],
      required_data: Array.isArray(intent.requiredData) ? uniq(intent.requiredData).sort() : [],
      priority: intent.priority ?? intents.length + 1,
    });
  });

  const ambiguities = [];
  const topScore = candidates[0]?.score ?? 0;
  const secondScore = candidates[1]?.score ?? 0;
  const scoreGapThreshold = policies?.clarification?.scoreGapThreshold ?? 10;
  const minTopScore = policies?.clarification?.minTopScore ?? 60;

  if (candidates.length === 0) ambiguities.push("no_candidates");
  if (topScore < minTopScore) ambiguities.push("low_top_score");
  if (candidates.length > 1 && topScore - secondScore < scoreGapThreshold && explicitEntities.length === 0) {
    ambiguities.push("close_candidates");
  }

  const unsupportedAliases = policies.unsupportedAliases ?? {};
  Object.keys(unsupportedAliases).forEach((alias) => {
    if (normalized.includes(alias)) {
      ambiguities.push(`unsupported_alias:${alias}`);
    }
  });

  const confidence = Number(clamp((candidates[0]?.score ?? 0) / 100, 0.2, 0.95).toFixed(2));
  const envelope = {
    request_id: `req_${stableHash(prompt)}`,
    intents,
    ambiguities: uniq(ambiguities),
    confidence,
  };

  const schemaErrors = validateWithSchema(envelope, loadSchema("intent.schema.json"));
  if (schemaErrors.length > 0) {
    return {
      ...envelope,
      ambiguities: uniq([...envelope.ambiguities, "intent_schema_warning"]),
    };
  }

  return envelope;
}

function buildDecision(prompt, registry, policies) {
  const matchedIntents = detectMatchedIntents(prompt, policies);
  const candidates = buildCandidates(prompt, registry, policies, matchedIntents);
  const envelope = buildIntentEnvelope(prompt, candidates, matchedIntents, policies);

  const normalized = normalizeText(prompt);
  const unsupportedAliases = policies.unsupportedAliases ?? {};
  for (const [alias, alternatives] of Object.entries(unsupportedAliases)) {
    if (!normalized.includes(alias)) continue;
    return {
      status: "reject",
      reason: `Unsupported direct component alias: ${alias}`,
      options: alternatives,
      candidates,
      intent_envelope: envelope,
    };
  }

  const threshold = Number(policies.confidenceThreshold ?? 0.65);
  if (envelope.confidence < threshold || envelope.ambiguities.length > 0) {
    return {
      status: "clarify",
      reason: "Need a tighter target before planning to reduce implementation churn.",
      question: "Which primary workflow should this generated UI optimize first?",
      options: candidates.slice(0, 4).map((candidate) => candidate.slug),
      candidates,
      intent_envelope: envelope,
    };
  }

  return {
    status: "resolved",
    reason: "Strong candidate set found with adequate confidence.",
    candidates,
    intent_envelope: envelope,
  };
}

function formatHuman(decision) {
  const lines = [
    `Status: ${decision.status}`,
    `Reason: ${decision.reason}`,
    `Request ID: ${decision.intent_envelope.request_id}`,
    `Confidence: ${decision.intent_envelope.confidence}`,
  ];

  if (decision.question) lines.push(`Question: ${decision.question}`);
  if (decision.options?.length) lines.push(`Options: ${decision.options.join(", ")}`);

  if (Array.isArray(decision.candidates) && decision.candidates.length > 0) {
    lines.push("Candidates:");
    decision.candidates.forEach((candidate, idx) => {
      lines.push(`  ${idx + 1}. ${candidate.slug} (${candidate.score}) [${candidate.reasons.join(", ")}]`);
    });
  }
  return lines.join("\n");
}

function main() {
  const { jsonMode, threshold, message, parseError } = parseCliInput(process.argv);
  if (parseError) {
    console.error(`Error: ${parseError}`);
    process.exit(1);
  }
  if (!message) {
    console.error("Usage: resolve-intent.mjs --json \"<prompt>\" [--threshold 0.65]");
    process.exit(1);
  }

  const policies = loadPolicies();
  policies.confidenceThreshold = Number.isFinite(threshold) ? threshold : policies.confidenceThreshold;
  const registry = loadComponentRegistry();
  const decision = buildDecision(message, registry, policies);
  printOutput(jsonMode, decision, formatHuman);
}

main();
