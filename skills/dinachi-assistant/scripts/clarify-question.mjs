#!/usr/bin/env node

import { loadJson, parseCliInput, printOutput } from "./lib/shared.mjs";

function parseMessagePayload(rawMessage) {
  const trimmed = rawMessage.trim();
  if (!trimmed) {
    return { prompt: "", candidates: [], status: null, reason: "", intents: [] };
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      return {
        prompt: "",
        candidates: parsed.map((slug) => ({ slug, score: null })).filter((item) => typeof item.slug === "string"),
        status: null,
        reason: "",
        intents: [],
      };
    }

    if (parsed && typeof parsed === "object") {
      const candidates = Array.isArray(parsed.candidates)
        ? parsed.candidates
            .map((candidate) => {
              if (typeof candidate === "string") return { slug: candidate, score: null };
              return {
                slug: typeof candidate?.slug === "string" ? candidate.slug : "",
                score: Number.isFinite(candidate?.score) ? candidate.score : null,
              };
            })
            .filter((item) => item.slug.length > 0)
        : [];

      const intents = Array.isArray(parsed?.intent_envelope?.intents)
        ? parsed.intent_envelope.intents
            .map((intent) => (typeof intent?.type === "string" ? intent.type : ""))
            .filter(Boolean)
        : [];

      return {
        prompt: typeof parsed.prompt === "string" ? parsed.prompt : "",
        candidates,
        status: typeof parsed.status === "string" ? parsed.status : null,
        reason: typeof parsed.reason === "string" ? parsed.reason : "",
        intents,
      };
    }
  } catch {
    return { prompt: trimmed, candidates: [], status: null, reason: "", intents: [] };
  }

  return { prompt: trimmed, candidates: [], status: null, reason: "", intents: [] };
}

function topCandidates(candidates) {
  return [...candidates]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || a.slug.localeCompare(b.slug))
    .slice(0, 4);
}

function chooseIntentQuestion(payload, policy) {
  if (!Array.isArray(payload.intents) || payload.intents.length === 0) return null;
  const intentQuestions = policy.intentQuestions ?? {};
  for (const intentType of payload.intents) {
    const cfg = intentQuestions[intentType];
    if (!cfg) continue;
    return {
      question: cfg.question,
      options: Array.isArray(cfg.options) ? cfg.options : policy.fallbackOptions,
      reason: payload.reason || policy.statusMessages?.clarify || "Resolver requested clarification.",
    };
  }
  return null;
}

function buildCandidateQuestion(payload, policy) {
  if (!Array.isArray(payload.candidates) || payload.candidates.length === 0) return null;
  const ranked = topCandidates(payload.candidates);
  if (ranked.length === 1) {
    return {
      question: policy.singleCandidateQuestion,
      options: [ranked[0].slug, ...(policy.singleCandidateOptions ?? [])].slice(0, 4),
      reason: payload.reason || policy.statusMessages?.clarify || "Single strong candidate found.",
    };
  }

  const delta = (ranked[0].score ?? 0) - (ranked[1].score ?? 0);
  const threshold = Number(policy.deltaThreshold ?? 8);
  const reasonTemplate = delta <= threshold
    ? policy.candidateReasonCloseTemplate
    : policy.candidateReasonWide;
  const reasonCore = String(reasonTemplate ?? "Choose the primary component direction.");
  const reason = reasonCore
    .replace("{top}", ranked[0].slug)
    .replace("{next}", ranked[1].slug);

  return {
    question: policy.candidateQuestion,
    options: ranked.map((entry) => entry.slug),
    reason: payload.reason ? `${reason} Context: ${payload.reason}` : reason,
  };
}

function buildClarification(payload, policy) {
  if (payload.status === "reject") {
    return {
      question: policy.candidateQuestion,
      options: topCandidates(payload.candidates).map((entry) => entry.slug),
      reason: payload.reason || policy.statusMessages?.reject || "Unsupported direction.",
    };
  }

  const fromCandidates = buildCandidateQuestion(payload, policy);
  if (fromCandidates) return fromCandidates;

  const fromIntent = chooseIntentQuestion(payload, policy);
  if (fromIntent) return fromIntent;

  return {
    question: policy.fallbackQuestion,
    options: Array.isArray(policy.fallbackOptions) ? policy.fallbackOptions : [],
    reason: payload.reason || policy.statusMessages?.clarify || "Need one preference to proceed.",
  };
}

function formatHuman(response) {
  return [
    `Question: ${response.question}`,
    `Options: ${response.options.join(", ")}`,
    `Reason: ${response.reason}`,
  ].join("\n");
}

function main() {
  const { jsonMode, message, parseError } = parseCliInput(process.argv);
  if (parseError) {
    console.error(`Error: ${parseError}`);
    process.exit(1);
  }
  if (!message) {
    console.error("Usage: clarify-question.mjs --json '<prompt or GuidanceDecision JSON>'");
    process.exit(1);
  }

  const payload = parseMessagePayload(message);
  const questionPolicy = loadJson("question-policy.json");
  const response = buildClarification(payload, questionPolicy);
  printOutput(jsonMode, response, formatHuman);
}

main();
