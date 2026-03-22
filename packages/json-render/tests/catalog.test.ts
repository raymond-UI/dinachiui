import { describe, it, expect } from "vitest";
import {
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
  type DinachiComponentName,
  type DinachiActionName,
} from "../src/catalog";

// =============================================================================
// Component definitions
// =============================================================================

describe("catalog — component definitions", () => {
  const expectedComponents: DinachiComponentName[] = [
    "Box", "Text",
    "Button", "Input", "Textarea", "Checkbox", "Switch",
    "Radio", "Select", "Slider", "Toggle", "Label",
    "Badge", "Separator", "Skeleton", "Progress",
    "Card", "Tabs", "Accordion", "Dialog", "AlertDialog", "Tooltip",
    "Avatar", "Drawer", "Popover", "NumberField", "ToggleGroup",
    "Collapsible", "ScrollArea", "Fieldset",
  ];

  it("contains all 30 expected components", () => {
    const names = Object.keys(dinachiComponentDefinitions);
    for (const name of expectedComponents) {
      expect(names).toContain(name);
    }
    expect(names).toHaveLength(30);
  });

  it("every component has a description", () => {
    for (const [name, def] of Object.entries(dinachiComponentDefinitions)) {
      expect(def.description, `${name} should have a description`).toBeTruthy();
    }
  });

  it("every component has a props schema", () => {
    for (const [name, def] of Object.entries(dinachiComponentDefinitions)) {
      expect(def.props, `${name} should have props`).toBeDefined();
    }
  });

  it("components with examples parse against their schemas", () => {
    for (const [name, def] of Object.entries(dinachiComponentDefinitions)) {
      const d = def as Record<string, unknown>;
      if ("example" in d && d.example) {
        const result = def.props.safeParse(d.example);
        expect(result.success, `${name} example should parse: ${JSON.stringify(result)}`).toBe(true);
      }
    }
  });

  it("compound components declare default slot", () => {
    const withSlots = ["Box", "Card", "Tabs", "Dialog", "AlertDialog", "Drawer", "Popover", "Collapsible", "ScrollArea", "Fieldset"];
    for (const name of withSlots) {
      const def = dinachiComponentDefinitions[name as DinachiComponentName];
      expect((def as any).slots, `${name} should have slots`).toContain("default");
    }
  });

  it("form components have validation schema", () => {
    const formComponents = ["Input", "Textarea", "Checkbox", "Select", "Radio", "NumberField"];
    for (const name of formComponents) {
      const def = dinachiComponentDefinitions[name as DinachiComponentName];
      const result = def.props.safeParse({
        label: "Test",
        ...(name === "Select" || name === "Radio" ? { options: [] } : {}),
        ...(name === "NumberField" ? {} : {}),
        checks: [{ type: "required", message: "Required" }],
        validateOn: "blur",
      });
      expect(result.success, `${name} should accept validation props`).toBe(true);
    }
  });

  it("catalog.ts has no framework imports (pure Zod)", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const catalogPath = path.resolve(__dirname, "../src/catalog.ts");
    const content = fs.readFileSync(catalogPath, "utf-8");
    expect(content).not.toContain("@json-render/core");
    expect(content).not.toContain("@json-render/react");
    expect(content).toContain('from "zod"');
  });
});

// =============================================================================
// Action definitions
// =============================================================================

describe("catalog — action definitions", () => {
  const expectedActions: DinachiActionName[] = ["navigate", "submit", "showToast"];

  it("contains all 3 expected actions", () => {
    const names = Object.keys(dinachiActionDefinitions);
    for (const name of expectedActions) {
      expect(names).toContain(name);
    }
    expect(names).toHaveLength(3);
  });

  it("every action has a description", () => {
    for (const [name, def] of Object.entries(dinachiActionDefinitions)) {
      expect(def.description, `${name} should have a description`).toBeTruthy();
    }
  });

  it("every action has a params schema", () => {
    for (const [name, def] of Object.entries(dinachiActionDefinitions)) {
      expect(def.params, `${name} should have params`).toBeDefined();
    }
  });

  it("navigate params parse correctly", () => {
    const result = dinachiActionDefinitions.navigate.params.safeParse({
      url: "https://example.com",
      target: "_blank",
    });
    expect(result.success).toBe(true);
  });

  it("showToast params parse correctly", () => {
    const result = dinachiActionDefinitions.showToast.params.safeParse({
      title: "Success!",
      description: "Your form was submitted.",
      variant: "success",
      timeout: 3000,
    });
    expect(result.success).toBe(true);
  });
});

// =============================================================================
// Schema validation edge cases
// =============================================================================

describe("catalog — schema validation", () => {
  it("Button rejects unknown variant", () => {
    const result = dinachiComponentDefinitions.Button.props.safeParse({
      label: "Test",
      variant: "neon",
    });
    expect(result.success).toBe(false);
  });

  it("Input accepts all valid types", () => {
    for (const type of ["text", "email", "password", "number", "tel", "url"]) {
      const result = dinachiComponentDefinitions.Input.props.safeParse({
        type,
        placeholder: "test",
      });
      expect(result.success, `type "${type}" should be valid`).toBe(true);
    }
  });

  it("Select requires options array", () => {
    const result = dinachiComponentDefinitions.Select.props.safeParse({
      label: "Pick",
    });
    // options is required in the schema
    expect(result.success).toBe(false);
  });

  it("Progress value is required", () => {
    const result = dinachiComponentDefinitions.Progress.props.safeParse({});
    expect(result.success).toBe(false);
  });
});
