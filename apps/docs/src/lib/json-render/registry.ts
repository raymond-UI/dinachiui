import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry } from "@json-render/react";
import { dinachiComponentDefinitions, dinachiActionDefinitions } from "./catalog";
import { dinachiComponents, dinachiActionHandlers } from "./components";

// Pre-built catalog — convenience for projects using only Dinachi components.
// For composition into an existing catalog, import raw definitions from "./catalog" instead.
export const catalog = defineCatalog(schema, {
  components: dinachiComponentDefinitions,
  actions: dinachiActionDefinitions,
});

export type DinachiCatalog = typeof catalog;

// Pre-built registry — convenience for projects using only Dinachi components.
// For composition into an existing registry, import raw maps from "./components" instead.
export const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: dinachiComponents,
  actions: dinachiActionHandlers,
});
