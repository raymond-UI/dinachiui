import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SKILL_ROOT = path.resolve(__dirname, "..", "..");
export const REFERENCE_ROOT = path.join(SKILL_ROOT, "references");

export function loadJson(relativePath) {
  const filePath = path.join(REFERENCE_ROOT, relativePath);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function loadComponentRegistry() {
  const registry = loadJson("components.registry.json");
  if (!Array.isArray(registry)) {
    throw new Error("references/components.registry.json must be an array.");
  }
  return registry.filter(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      typeof entry.slug === "string" &&
      Array.isArray(entry.capabilities),
  );
}

export function loadPolicies() {
  const policies = loadJson("policies.json");
  if (!policies || typeof policies !== "object") {
    throw new Error("references/policies.json must be a JSON object.");
  }
  return policies;
}

export function loadSchema(name) {
  return loadJson(name);
}

export function readComponentSlugs() {
  return loadComponentRegistry().map((entry) => entry.slug);
}

export function normalizeText(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(input) {
  return normalizeText(input).split(" ").filter(Boolean);
}

export function parseCliInput(argv) {
  const args = argv.slice(2);
  let jsonMode = false;
  let threshold = 0.65;
  const messageParts = [];
  let parseError = null;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--json") {
      jsonMode = true;
      continue;
    }

    if (arg === "--threshold") {
      const raw = args[i + 1];
      if (raw === undefined) {
        parseError = "Missing value for --threshold. Expected a number between 0 and 1.";
        break;
      }
      if (raw.startsWith("--")) {
        parseError = `Invalid --threshold value '${raw}'. Expected a number between 0 and 1.`;
        break;
      }
      const numeric = Number(raw);
      if (!Number.isFinite(numeric) || numeric <= 0 || numeric >= 1) {
        parseError = `Invalid --threshold value '${raw}'. Expected a number between 0 and 1.`;
        break;
      }
      threshold = numeric;
      i += 1;
      continue;
    }

    messageParts.push(arg);
  }

  const message = messageParts.join(" ").trim();
  return { jsonMode, threshold, message, parseError };
}

export function stableHash(input) {
  const text = String(input ?? "");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function uniq(values) {
  return [...new Set(values)];
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function printOutput(jsonMode, payload, humanFormatter) {
  if (jsonMode) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log(humanFormatter(payload));
}

function pushError(errors, pathLabel, code, message) {
  errors.push({ path: pathLabel, code, message });
}

function typeOfValue(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function validateNode(value, schema, pathLabel, errors) {
  if (!schema || typeof schema !== "object") return;

  if (Array.isArray(schema.type)) {
    const actual = typeOfValue(value);
    if (!schema.type.includes(actual)) {
      pushError(errors, pathLabel, "SCHEMA_TYPE_MISMATCH", `Expected one of ${schema.type.join(", ")}, got ${actual}.`);
      return;
    }
  } else if (schema.type) {
    const actual = typeOfValue(value);
    if (actual !== schema.type) {
      pushError(errors, pathLabel, "SCHEMA_TYPE_MISMATCH", `Expected ${schema.type}, got ${actual}.`);
      return;
    }
  }

  if (schema.enum && !schema.enum.includes(value)) {
    pushError(errors, pathLabel, "SCHEMA_ENUM_MISMATCH", `Value '${value}' must be one of ${schema.enum.join(", ")}.`);
  }

  if (schema.type === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength) {
      pushError(errors, pathLabel, "SCHEMA_MIN_LENGTH", `String must have length >= ${schema.minLength}.`);
    }
  }

  if (schema.type === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) {
      pushError(errors, pathLabel, "SCHEMA_MINIMUM", `Number must be >= ${schema.minimum}.`);
    }
    if (typeof schema.maximum === "number" && value > schema.maximum) {
      pushError(errors, pathLabel, "SCHEMA_MAXIMUM", `Number must be <= ${schema.maximum}.`);
    }
  }

  if (schema.type === "object") {
    const props = schema.properties ?? {};
    const required = Array.isArray(schema.required) ? schema.required : [];
    for (const key of required) {
      if (!(key in value)) {
        pushError(errors, `${pathLabel}.${key}`, "SCHEMA_REQUIRED", "Missing required field.");
      }
    }

    for (const [key, childSchema] of Object.entries(props)) {
      if (!(key in value)) continue;
      validateNode(value[key], childSchema, `${pathLabel}.${key}`, errors);
    }
  }

  if (schema.type === "array") {
    if (typeof schema.minItems === "number" && value.length < schema.minItems) {
      pushError(errors, pathLabel, "SCHEMA_MIN_ITEMS", `Array must contain at least ${schema.minItems} item(s).`);
    }
    if (schema.items) {
      value.forEach((item, idx) => validateNode(item, schema.items, `${pathLabel}[${idx}]`, errors));
    }
  }
}

export function validateWithSchema(value, schema) {
  const errors = [];
  validateNode(value, schema, "$", errors);
  return errors;
}
