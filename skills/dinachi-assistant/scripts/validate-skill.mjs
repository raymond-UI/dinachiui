#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillDir = path.resolve(__dirname, "..");

const requiredFiles = [
  "SKILL.md",
  "references/components.md",
  "references/intent-map.md",
  "references/components.registry.json",
  "references/policies.json",
  "references/intent.schema.json",
  "references/recipe.schema.json",
  "references/question-policy.json",
  "scripts/suggest-components.mjs",
  "scripts/resolve-intent.mjs",
  "scripts/plan-recipe.mjs",
  "scripts/validate-recipe.mjs",
  "scripts/clarify-question.mjs",
  "scripts/route-mode.mjs",
  "scripts/audit-skill.mjs",
  "scripts/lib/shared.mjs",
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function parseFrontmatter(skillPath) {
  const content = fs.readFileSync(skillPath, "utf8");
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) fail("SKILL.md frontmatter is missing or malformed");

  const frontmatter = {};
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) fail(`Invalid frontmatter line: ${line}`);
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    frontmatter[key] = value;
  }
  return frontmatter;
}

function parseComponentMarkdown(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /^- `([a-z0-9-]+)`/gm;
  const slugs = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return slugs;
}

function parseRegistry(filePath) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(
      `Unable to parse references/components.registry.json: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!Array.isArray(parsed)) {
    fail("references/components.registry.json must be a JSON array.");
  }

  const slugs = [];
  parsed.forEach((entry, idx) => {
    if (!entry || typeof entry !== "object") {
      fail(`Registry entry at index ${idx} must be an object.`);
    }
    if (typeof entry.slug !== "string" || !entry.slug.trim()) {
      fail(`Registry entry at index ${idx} is missing a valid slug.`);
    }
    slugs.push(entry.slug);
  });

  return slugs;
}

function main() {
  for (const relativePath of requiredFiles) {
    const fullPath = path.join(skillDir, relativePath);
    if (!fs.existsSync(fullPath)) fail(`Missing required file: ${relativePath}`);
  }

  const skillPath = path.join(skillDir, "SKILL.md");
  const frontmatter = parseFrontmatter(skillPath);
  const allowed = new Set(["name", "description"]);
  const keys = Object.keys(frontmatter);

  for (const key of keys) {
    if (!allowed.has(key)) fail(`Unexpected frontmatter key: ${key}`);
  }
  if (!frontmatter.name) fail("Frontmatter missing name");
  if (!frontmatter.description) fail("Frontmatter missing description");

  const name = frontmatter.name;
  if (!/^[a-z0-9-]+$/.test(name)) fail("Name must be hyphen-case");
  if (name.length > 64) fail("Name exceeds 64 characters");

  const description = frontmatter.description;
  if (description.includes("<") || description.includes(">")) {
    fail("Description contains invalid angle bracket characters");
  }
  if (description.length > 1024) fail("Description exceeds 1024 characters");

  const mdSlugs = parseComponentMarkdown(path.join(skillDir, "references", "components.md"));
  const registrySlugs = parseRegistry(path.join(skillDir, "references", "components.registry.json"));

  if (mdSlugs.length === 0) fail("No components found in references/components.md");
  if (registrySlugs.length === 0) fail("No components found in references/components.registry.json");

  const seenMd = new Set();
  for (const slug of mdSlugs) {
    if (seenMd.has(slug)) fail(`Duplicate component in references/components.md: ${slug}`);
    seenMd.add(slug);
  }

  const seenRegistry = new Set();
  for (const slug of registrySlugs) {
    if (seenRegistry.has(slug)) fail(`Duplicate component in references/components.registry.json: ${slug}`);
    seenRegistry.add(slug);
  }

  const registrySet = new Set(registrySlugs);
  const mdMissingFromRegistry = mdSlugs.filter((slug) => !registrySet.has(slug));
  if (mdMissingFromRegistry.length > 0) {
    fail(
      `references/components.md contains slugs missing from registry: ${mdMissingFromRegistry.join(", ")}`,
    );
  }

  console.log("Skill validation passed.");
}

main();
