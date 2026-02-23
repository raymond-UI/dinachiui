#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillDir = path.resolve(__dirname, "..");

const componentsFile = path.join(skillDir, "references", "components.md");
const intentMapFile = path.join(skillDir, "references", "intent-map.md");

function normalize(input) {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function compact(input) {
  return normalize(input).replace(/[\s-]/g, "");
}

function tokens(input) {
  return normalize(input).split(" ").filter(Boolean);
}

function parseComponents(md) {
  const values = [];
  const regex = /^- `([a-z0-9-]+)`/gm;
  let match;
  while ((match = regex.exec(md)) !== null) {
    values.push(match[1]);
  }
  return values;
}

function parseIntentMap(md) {
  const rows = [];
  const regex = /^- `([^`]+)`: `([^`]+)`$/gm;
  let match;
  while ((match = regex.exec(md)) !== null) {
    const phrase = normalize(match[1]);
    const components = match[2].split(",").map((v) => v.trim()).filter(Boolean);
    if (phrase && components.length > 0) {
      rows.push({ phrase, components });
    }
  }
  return rows;
}

function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[a.length][b.length];
}

function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes("--json");
  const queryText = args.filter((arg) => arg !== "--json").join(" ").trim();

  if (!queryText) {
    console.error("Usage: suggest-components.mjs [--json] <natural-language request>");
    process.exit(1);
  }

  const componentsMd = fs.readFileSync(componentsFile, "utf8");
  const intentMd = fs.readFileSync(intentMapFile, "utf8");

  const components = parseComponents(componentsMd);
  const intents = parseIntentMap(intentMd);

  const qNorm = normalize(queryText);
  const qCompact = compact(queryText);
  const qTokens = new Set(tokens(queryText));

  const score = new Map();
  const reason = new Map();

  function add(component, points, why) {
    score.set(component, (score.get(component) ?? 0) + points);
    if (!reason.has(component)) reason.set(component, new Set());
    reason.get(component).add(why);
  }

  for (const component of components) {
    const slugNorm = normalize(component);
    const slugCompact = compact(component);
    const slugTokens = component.split("-").filter(Boolean);

    if (qNorm === slugNorm) add(component, 120, "exact");
    if (qNorm.includes(slugNorm)) add(component, 85, "contains-slug");
    if (qCompact.includes(slugCompact)) add(component, 75, "contains-compact");

    let overlap = 0;
    for (const token of slugTokens) {
      if (qTokens.has(token)) overlap += 1;
    }
    if (overlap > 0) {
      add(component, overlap * 24, `token-overlap:${overlap}`);
    }

    const distance = levenshtein(qCompact, slugCompact);
    if (distance <= 2) {
      add(component, 35 - distance * 8, `typo-distance:${distance}`);
    }
  }

  for (const entry of intents) {
    if (!qNorm.includes(entry.phrase)) continue;
    entry.components.forEach((component, idx) => {
      if (!components.includes(component)) return;
      add(component, 70 - idx * 8, `intent:${entry.phrase}`);
    });
  }

  const ranked = [...score.entries()]
    .filter(([, points]) => points > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([component, points]) => ({
      component,
      score: points,
      reasons: [...(reason.get(component) ?? [])],
    }));

  if (jsonMode) {
    console.log(
      JSON.stringify(
        {
          query: queryText,
          suggestions: ranked,
          totalComponents: components.length,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`Query: ${queryText}`);
  if (ranked.length === 0) {
    console.log("No strong matches found.");
    console.log(`Available components: ${components.length}`);
    return;
  }

  console.log("Suggestions:");
  ranked.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.component} (score ${item.score})`);
    console.log(`   reasons: ${item.reasons.join(", ")}`);
  });
}

main();
