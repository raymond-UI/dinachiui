import { describe, it, expect } from "vitest";
import {
  catalog,
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
  type DinachiComponentName,
  type DinachiActionName,
} from "../src/catalog";
import { createDinachiCatalog } from "../src/factories";

// =============================================================================
// Component definitions
// =============================================================================

describe("catalog — component definitions", () => {
  const expectedComponents: DinachiComponentName[] = [
    "Button", "Input", "Textarea", "Checkbox", "Switch",
    "Radio", "Select", "Slider", "Toggle", "Label",
    "Badge", "Separator", "Skeleton", "Progress",
    "Card", "Tabs", "Accordion", "Dialog", "AlertDialog", "Tooltip",
  ];

  it("contains all 20 expected components", () => {
    const names = Object.keys(dinachiComponentDefinitions);
    for (const name of expectedComponents) {
      expect(names).toContain(name);
    }
    expect(names).toHaveLength(20);
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
    const withSlots = ["Card", "Tabs", "Dialog", "AlertDialog"];
    for (const name of withSlots) {
      const def = dinachiComponentDefinitions[name as DinachiComponentName];
      expect((def as any).slots, `${name} should have slots`).toContain("default");
    }
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
// Catalog instance
// =============================================================================

describe("catalog — defineCatalog instance", () => {
  it("catalog has componentNames", () => {
    expect((catalog as any).componentNames).toBeDefined();
    expect((catalog as any).componentNames.length).toBeGreaterThan(0);
  });

  it("catalog has actionNames", () => {
    expect((catalog as any).actionNames).toBeDefined();
    expect((catalog as any).actionNames.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// Factory: createDinachiCatalog
// =============================================================================

describe("createDinachiCatalog", () => {
  it("returns full catalog by default", () => {
    const cat = createDinachiCatalog();
    expect((cat as any).componentNames).toHaveLength(20);
    expect((cat as any).actionNames).toHaveLength(3);
  });

  it("subsets to specified components", () => {
    const cat = createDinachiCatalog({
      components: ["Button", "Input", "Card"],
    });
    const names = (cat as any).componentNames as string[];
    expect(names).toHaveLength(3);
    expect(names).toContain("Button");
    expect(names).toContain("Input");
    expect(names).toContain("Card");
  });

  it("excludes actions when includeActions=false", () => {
    const cat = createDinachiCatalog({ includeActions: false });
    expect((cat as any).actionNames).toHaveLength(0);
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
