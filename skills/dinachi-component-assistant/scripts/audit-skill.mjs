#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const skillDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(skillDir, "..", "..");

const files = {
  referenceComponents: path.join(skillDir, "references", "components.md"),
  cliRegistry: path.join(repoRoot, "packages", "cli", "src", "utils", "registry.ts"),
  docsMetadata: path.join(repoRoot, "apps", "docs", "src", "lib", "component-metadata.ts"),
  docsContentDir: path.join(repoRoot, "apps", "docs", "content", "components"),
};

function unique(values) {
  return [...new Set(values)];
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function diff(left, right) {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

function parseReferenceComponents(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const found = [];
  const regex = /^- `([a-z0-9-]+)`/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    found.push(match[1]);
  }
  return found;
}

function parseCliComponents(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const start = content.indexOf("export function getComponentRegistry()");
  const end = content.indexOf("export async function getConfig()");
  const block = start >= 0 && end > start ? content.slice(start, end) : content;

  const found = [];
  const regex = /^ {4}'?([a-z0-9-]+)'?: \{$/gm;
  let match;
  while ((match = regex.exec(block)) !== null) {
    found.push(match[1]);
  }
  return found;
}

function parseDocsMetadataComponents(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const found = [];
  const regex = /slug:\s*"([a-z0-9-]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    found.push(match[1]);
  }
  return found;
}

function parseDocsContentComponents(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx?$/, ""));
}

function printGroup(label, values) {
  if (values.length === 0) return;
  console.log(`${label} (${values.length})`);
  values.forEach((value) => console.log(`  - ${value}`));
}

function main() {
  for (const [key, filePath] of Object.entries(files)) {
    if (key === "docsContentDir") continue;
    if (!fs.existsSync(filePath)) {
      console.error(`Missing required file: ${filePath}`);
      process.exit(2);
    }
  }
  if (!fs.existsSync(files.docsContentDir)) {
    console.error(`Missing required directory: ${files.docsContentDir}`);
    process.exit(2);
  }

  const referenceRaw = parseReferenceComponents(files.referenceComponents);
  const cliRaw = parseCliComponents(files.cliRegistry);
  const metadataRaw = parseDocsMetadataComponents(files.docsMetadata);
  const docsRaw = parseDocsContentComponents(files.docsContentDir);

  const reference = unique(referenceRaw);
  const cli = unique(cliRaw);
  const metadata = unique(metadataRaw);
  const docs = unique(docsRaw);

  const referenceDuplicates = sorted(referenceRaw.filter((item, idx) => referenceRaw.indexOf(item) !== idx));
  const cliMissingFromReference = sorted(diff(cli, reference));
  const referenceMissingFromCli = sorted(diff(reference, cli));

  const cliMissingDocsPage = sorted(diff(cli, docs));
  const docsMissingCli = sorted(diff(docs, cli));
  const metadataMissingDocs = sorted(diff(metadata, docs));
  const docsMissingMetadata = sorted(diff(docs, metadata));
  const cliMissingMetadata = sorted(diff(cli, metadata));

  console.log("Dinachi Skill Audit");
  console.log("===================");
  console.log(`Reference components: ${reference.length}`);
  console.log(`CLI components: ${cli.length}`);
  console.log(`Docs pages: ${docs.length}`);
  console.log(`Docs metadata entries: ${metadata.length}`);
  console.log("");

  const blockingIssues = [];
  if (referenceDuplicates.length > 0) {
    blockingIssues.push("Duplicate component slugs found in references/components.md");
  }
  if (cliMissingFromReference.length > 0) {
    blockingIssues.push("Reference list is missing one or more CLI components");
  }
  if (referenceMissingFromCli.length > 0) {
    blockingIssues.push("Reference list contains non-CLI components");
  }

  if (blockingIssues.length > 0) {
    console.log("Blocking issues:");
    blockingIssues.forEach((issue) => console.log(`  - ${issue}`));
    console.log("");
  }

  printGroup("Reference duplicates", referenceDuplicates);
  printGroup("CLI missing from reference", cliMissingFromReference);
  printGroup("Reference missing from CLI", referenceMissingFromCli);

  console.log("");
  console.log("Coverage warnings (non-blocking):");
  printGroup("CLI components without docs page", cliMissingDocsPage);
  printGroup("Docs pages without CLI component", docsMissingCli);
  printGroup("Metadata without docs page", metadataMissingDocs);
  printGroup("Docs page without metadata", docsMissingMetadata);
  printGroup("CLI components without metadata", cliMissingMetadata);

  if (
    cliMissingDocsPage.length === 0 &&
    docsMissingCli.length === 0 &&
    metadataMissingDocs.length === 0 &&
    docsMissingMetadata.length === 0 &&
    cliMissingMetadata.length === 0
  ) {
    console.log("  - none");
  }

  if (blockingIssues.length > 0) {
    process.exit(1);
  }

  console.log("");
  console.log("Audit passed (blocking checks).");
}

main();
