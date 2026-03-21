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

// Re-export React providers and Renderer from json-render
// IMPORTANT: Consumers must use these re-exports (not direct @json-render/react imports)
// to avoid dual-package context mismatches when zod versions differ.
export {
  Renderer,
  JSONUIProvider,
  StateProvider,
  ActionProvider,
  VisibilityProvider,
} from "@json-render/react";

// Re-export useful types from json-render
export type { Spec, UIElement } from "@json-render/core";
