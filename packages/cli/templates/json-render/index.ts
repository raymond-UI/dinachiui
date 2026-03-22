// =============================================================================
// Raw definitions — for composition into existing json-render projects
// =============================================================================

// Component + action Zod schemas (pure Zod, no framework dependency)
export {
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
  type DinachiComponentName,
  type DinachiActionName,
} from "./catalog";

// Component implementations + action handlers (for custom registries)
export {
  dinachiComponents,
  dinachiActionHandlers,
  toastManager,
} from "./components";

// =============================================================================
// Pre-built catalog + registry — convenience for new projects
// =============================================================================

export {
  catalog,
  registry,
  handlers,
  executeAction,
  type DinachiCatalog,
} from "./registry";

// =============================================================================
// Type re-exports
// =============================================================================

export type { Spec } from "@json-render/react";
