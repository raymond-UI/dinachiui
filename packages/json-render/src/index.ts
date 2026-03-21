// Catalog (component schemas + action definitions)
export {
  catalog,
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
  type DinachiCatalog,
  type DinachiComponentName,
  type DinachiActionName,
} from "./catalog";

// Registry (React component implementations + action handlers)
export {
  dinachiComponents,
  dinachiActionHandlers,
  toastManager,
} from "./components";

// Factory functions
export {
  createDinachiCatalog,
  createDinachiRegistry,
  type CreateCatalogOptions,
  type CreateRegistryOptions,
} from "./factories";

// Re-export useful types from json-render
export type { Spec, UIElement } from "@json-render/core";
