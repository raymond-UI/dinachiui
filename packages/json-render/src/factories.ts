import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry } from "@json-render/react";
import {
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
  catalog as defaultCatalog,
  type DinachiComponentName,
} from "./catalog";
import { dinachiComponents, dinachiActionHandlers } from "./components";

// =============================================================================
// Factory: createDinachiCatalog
// =============================================================================

export interface CreateCatalogOptions {
  /** Subset of component names to include. Defaults to all. */
  components?: DinachiComponentName[];
  /** Additional custom component definitions to merge. */
  extend?: Record<string, { props: import("zod").ZodType; slots?: string[]; description?: string; example?: Record<string, unknown> }>;
  /** Whether to include default actions. Defaults to true. */
  includeActions?: boolean;
  /** Additional custom action definitions to merge. */
  extendActions?: Record<string, { params: import("zod").ZodType; description?: string }>;
}

/**
 * Create a DinachiUI catalog, optionally subsetting or extending components.
 *
 * @example
 * ```ts
 * // Full catalog
 * const catalog = createDinachiCatalog();
 *
 * // Form-only subset
 * const formCatalog = createDinachiCatalog({
 *   components: ["Input", "Select", "Checkbox", "Button", "Card"],
 * });
 * ```
 */
export function createDinachiCatalog(options?: CreateCatalogOptions) {
  const componentNames =
    options?.components ??
    (Object.keys(dinachiComponentDefinitions) as DinachiComponentName[]);

  const components: Record<string, (typeof dinachiComponentDefinitions)[DinachiComponentName]> = {};
  for (const name of componentNames) {
    if (name in dinachiComponentDefinitions) {
      components[name] = dinachiComponentDefinitions[name];
    }
  }

  if (options?.extend) {
    Object.assign(components, options.extend);
  }

  const actions =
    options?.includeActions !== false
      ? { ...dinachiActionDefinitions, ...options?.extendActions }
      : { ...options?.extendActions };

  return defineCatalog(schema, {
    components,
    actions,
  });
}

// =============================================================================
// Factory: createDinachiRegistry
// =============================================================================

export interface CreateRegistryOptions {
  /** Override specific action handlers. */
  actionOverrides?: Partial<typeof dinachiActionHandlers>;
  /** Override specific component implementations. */
  componentOverrides?: Partial<typeof dinachiComponents>;
}

/**
 * Create a registry from a DinachiUI catalog.
 *
 * @example
 * ```ts
 * const catalog = createDinachiCatalog();
 * const { registry, handlers, executeAction } = createDinachiRegistry(catalog);
 * ```
 */
export function createDinachiRegistry(
  catalog: ReturnType<typeof createDinachiCatalog>,
  options?: CreateRegistryOptions,
) {
  const catalogComponentNames = catalog.componentNames as string[];

  // Filter components to only those in the catalog
  const components: Record<string, (typeof dinachiComponents)[keyof typeof dinachiComponents]> = {};
  for (const name of catalogComponentNames) {
    const override = options?.componentOverrides?.[name as keyof typeof dinachiComponents];
    const original = dinachiComponents[name as keyof typeof dinachiComponents];
    if (override) {
      components[name] = override;
    } else if (original) {
      components[name] = original;
    }
  }

  const actionHandlers = {
    ...dinachiActionHandlers,
    ...options?.actionOverrides,
  };

  // Filter actions to only those in the catalog
  const catalogActionNames = catalog.actionNames as string[];
  const actions: Record<string, (typeof dinachiActionHandlers)[keyof typeof dinachiActionHandlers]> = {};
  for (const name of catalogActionNames) {
    const handler = actionHandlers[name as keyof typeof actionHandlers];
    if (handler) {
      actions[name] = handler;
    }
  }

  return defineRegistry(catalog as any, {
    components: components as any,
    actions: actions as any,
  });
}

export { defaultCatalog };
