#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillDir = path.resolve(__dirname, "..");

const requiredFiles = [
  "SKILL.md",
  "agents/openai.yaml",
  "references/components.md",
  "references/workflows.md",
  "references/intent-map.md",
  "references/troubleshooting.md",
  "references/maintainer-checklist.md",
  "scripts/suggest-components.mjs",
  "scripts/audit-skill.mjs",
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

  const componentsMd = fs.readFileSync(path.join(skillDir, "references", "components.md"), "utf8");
  const regex = /^- `([a-z0-9-]+)`/gm;
  const seen = new Set();
  let count = 0;
  let match;
  while ((match = regex.exec(componentsMd)) !== null) {
    count += 1;
    if (seen.has(match[1])) fail(`Duplicate component in references/components.md: ${match[1]}`);
    seen.add(match[1]);
  }
  if (count === 0) fail("No components found in references/components.md");

  console.log("Skill validation passed.");
}

main();
