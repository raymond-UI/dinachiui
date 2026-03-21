import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";
import { dinachiComponents, dinachiActionHandlers } from "./components";

export const { registry, handlers, executeAction } = defineRegistry(catalog, {
  components: dinachiComponents as any,
  actions: dinachiActionHandlers as any,
});
