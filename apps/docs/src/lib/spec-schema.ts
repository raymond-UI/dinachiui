import { z } from "zod";

const actionBindingSchema = z.object({
  action: z.string(),
  params: z.record(z.unknown()).optional(),
});

/**
 * AI SDK has a known bug with z.record(z.object(...)) — nested records
 * stream as empty {}. Using z.array() instead gives proper incremental
 * streaming where each element arrives one by one.
 *
 * The AI generates elements as an array with explicit `key` fields.
 * We convert to a Record<string, UIElement> before passing to the Renderer.
 */
const uiElementSchema = z.object({
  key: z.string().describe("Unique identifier for this element"),
  type: z.string().describe("Component name from the catalog"),
  props: z.record(z.unknown()).describe("Component props"),
  children: z
    .array(z.string())
    .optional()
    .describe("Keys of child elements for container components"),
  on: z
    .record(z.union([actionBindingSchema, z.array(actionBindingSchema)]))
    .optional()
    .describe("Event bindings mapping event names to actions"),
});

export const specSchema = z.object({
  root: z.string().describe("Key of the root element"),
  elements: z
    .array(uiElementSchema)
    .describe("Flat array of UI elements"),
  state: z
    .record(z.unknown())
    .optional()
    .describe("Initial state values for two-way bindings"),
});

export type SpecSchema = z.infer<typeof specSchema>;
export type UIElementSchema = z.infer<typeof uiElementSchema>;
