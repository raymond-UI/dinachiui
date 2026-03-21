// Catalog (component schemas + action definitions)
export {
  catalog,
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
  type DinachiCatalog,
  type DinachiComponentName,
  type DinachiActionName,
} from "./catalog";

// Components + Actions (raw, for advanced usage)
export {
  dinachiComponents,
  dinachiActionHandlers,
  toastManager,
} from "./components";

// Pre-built registry via defineRegistry()
export { registry, handlers, executeAction } from "./registry";

// Re-export React providers and Renderer from json-render
export {
  Renderer,
  JSONUIProvider,
  StateProvider,
  ActionProvider,
  VisibilityProvider,
  useUIStream,
} from "@json-render/react";

// Re-export core utilities
export { buildUserPrompt } from "@json-render/core";

// Re-export useful types from json-render
export type { Spec, UIElement } from "@json-render/core";
export type { UseUIStreamOptions, UseUIStreamReturn } from "@json-render/react";
