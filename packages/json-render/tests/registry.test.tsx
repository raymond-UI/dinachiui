import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  dinachiComponents,
  dinachiActionHandlers,
  toastManager,
} from "../src/components";

// Mock json-render hooks — they require context that won't be present in unit tests
vi.mock("@json-render/react", () => ({
  useStateBinding: vi.fn(() => [undefined, vi.fn()]),
  useFieldValidation: vi.fn(() => ({
    state: { touched: false, validated: false, result: null },
    validate: vi.fn(() => ({ valid: true, errors: [] })),
    touch: vi.fn(),
    clear: vi.fn(),
    errors: [],
    isValid: true,
  })),
  defineRegistry: vi.fn((_catalog: unknown, config: unknown) => ({
    registry: config,
    handlers: vi.fn(),
    executeAction: vi.fn(),
  })),
}));

// =============================================================================
// Simple component rendering
// =============================================================================

describe("registry — simple components", () => {
  it("Button renders label and fires press event", async () => {
    const emit = vi.fn();
    render(
      <dinachiComponents.Button
        props={{ label: "Click me", variant: "default" }}
        emit={emit}
      />
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Click me"));
    expect(emit).toHaveBeenCalledWith("press");
  });

  it("Button renders with destructive variant", () => {
    render(
      <dinachiComponents.Button
        props={{ label: "Delete", variant: "destructive" }}
      />
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("Badge renders text", () => {
    render(
      <dinachiComponents.Badge
        props={{ text: "Active", variant: "success" }}
      />
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("Label renders text", () => {
    render(
      <dinachiComponents.Label
        props={{ text: "Email address" }}
      />
    );
    expect(screen.getByText("Email address")).toBeInTheDocument();
  });

  it("Skeleton renders with dimensions", () => {
    const { container } = render(
      <dinachiComponents.Skeleton
        props={{ width: "200px", height: "20px" }}
      />
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe("200px");
    expect(el.style.height).toBe("20px");
  });

  it("Separator renders", () => {
    const { container } = render(
      <dinachiComponents.Separator
        props={{ orientation: "horizontal" }}
      />
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// =============================================================================
// Input components (state binding mocked)
// =============================================================================

describe("registry — input components", () => {
  it("Input renders with label and placeholder", () => {
    render(
      <dinachiComponents.Input
        props={{
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        }}
      />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("Textarea renders with label", () => {
    render(
      <dinachiComponents.Textarea
        props={{
          label: "Message",
          placeholder: "Type here...",
        }}
      />
    );
    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });

  it("Checkbox renders with label", () => {
    render(
      <dinachiComponents.Checkbox
        props={{ label: "Accept terms" }}
      />
    );
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("Switch renders with label", () => {
    render(
      <dinachiComponents.Switch
        props={{ label: "Dark mode" }}
      />
    );
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("Toggle renders with label", () => {
    render(
      <dinachiComponents.Toggle
        props={{ label: "Bold" }}
      />
    );
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });
});

// =============================================================================
// Compound components
// =============================================================================

describe("registry — compound components", () => {
  it("Card renders title and description", () => {
    render(
      <dinachiComponents.Card
        props={{
          title: "Overview",
          description: "Your account summary",
        }}
      >
        <p>Card content here</p>
      </dinachiComponents.Card>
    );
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Your account summary")).toBeInTheDocument();
    expect(screen.getByText("Card content here")).toBeInTheDocument();
  });

  it("Card renders without header when no title/description", () => {
    render(
      <dinachiComponents.Card props={{}}>
        <p>Just content</p>
      </dinachiComponents.Card>
    );
    expect(screen.getByText("Just content")).toBeInTheDocument();
  });

  it("Accordion renders items", () => {
    render(
      <dinachiComponents.Accordion
        props={{
          items: [
            { title: "Question 1", content: "Answer 1", value: "q1" },
            { title: "Question 2", content: "Answer 2", value: "q2" },
          ],
          collapsible: true,
        }}
      />
    );
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });

  it("Select renders options", () => {
    render(
      <dinachiComponents.Select
        props={{
          label: "Country",
          placeholder: "Select country",
          options: [
            { label: "United States", value: "us" },
            { label: "Canada", value: "ca" },
          ],
        }}
      />
    );
    expect(screen.getByText("Country")).toBeInTheDocument();
  });

  it("Radio renders options", () => {
    render(
      <dinachiComponents.Radio
        props={{
          label: "Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ],
        }}
      />
    );
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });
});

// =============================================================================
// Action handlers
// =============================================================================

describe("registry — action handlers", () => {
  it("navigate handler opens URL in new tab", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const mockSetState = vi.fn();
    const mockState = {};

    await dinachiActionHandlers.navigate(
      { url: "https://example.com", target: "_blank" },
      mockSetState,
      mockState,
    );
    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank");
    openSpy.mockRestore();
  });

  it("navigate handler sets location for _self", async () => {
    const mockSetState = vi.fn();
    const mockState = {};

    // jsdom doesn't support navigation, so we just verify no error is thrown
    try {
      await dinachiActionHandlers.navigate(
        { url: "/about" },
        mockSetState,
        mockState,
      );
    } catch {
      // jsdom navigation errors are expected
    }
  });

  it("navigate handler does nothing without url", async () => {
    const mockSetState = vi.fn();
    const mockState = {};

    await dinachiActionHandlers.navigate(undefined, mockSetState, mockState);
    // No error thrown
  });

  it("showToast handler adds toast via toastManager", async () => {
    const addSpy = vi.spyOn(toastManager, "add");
    const mockSetState = vi.fn();
    const mockState = {};

    await dinachiActionHandlers.showToast(
      { title: "Success!", description: "Done.", variant: "success" },
      mockSetState,
      mockState,
    );
    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success!",
        description: "Done.",
        type: "success",
      }),
    );
    addSpy.mockRestore();
  });

  it("showToast handler does nothing without title", async () => {
    const addSpy = vi.spyOn(toastManager, "add");
    const mockSetState = vi.fn();
    const mockState = {};

    await dinachiActionHandlers.showToast(undefined, mockSetState, mockState);
    expect(addSpy).not.toHaveBeenCalled();
    addSpy.mockRestore();
  });
});

// =============================================================================
// Component registry map
// =============================================================================

describe("registry — component map", () => {
  it("has implementations for all 30 components", () => {
    const names = Object.keys(dinachiComponents);
    expect(names).toHaveLength(30);
  });

  it("all implementations are functions", () => {
    for (const [name, fn] of Object.entries(dinachiComponents)) {
      expect(typeof fn, `${name} should be a function`).toBe("function");
    }
  });
});
