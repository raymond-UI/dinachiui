import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { 
  Toolbar,
  ToolbarRoot,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarGroup,
  ToolbarInput
} from "./toolbar";

describe("Toolbar", () => {
  describe("ToolbarRoot", () => {
    it("renders correctly", () => {
      render(<ToolbarRoot data-testid="toolbar">Test toolbar</ToolbarRoot>);
      expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<ToolbarRoot data-testid="toolbar" className="custom-class">Test</ToolbarRoot>);
      expect(screen.getByTestId("toolbar")).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ToolbarRoot ref={ref}>Test</ToolbarRoot>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("ToolbarButton", () => {
    it("renders as button", () => {
      render(
        <ToolbarRoot>
          <ToolbarButton>Click me</ToolbarButton>
        </ToolbarRoot>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("handles click events", async () => {
      const handleClick = vi.fn();
      render(
        <ToolbarRoot>
          <ToolbarButton onClick={handleClick}>Click me</ToolbarButton>
        </ToolbarRoot>
      );
      
      await userEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies custom className", () => {
      render(
        <ToolbarRoot>
          <ToolbarButton className="custom-button">Test</ToolbarButton>
        </ToolbarRoot>
      );
      expect(screen.getByRole("button")).toHaveClass("custom-button");
    });

    it("can be disabled", () => {
      render(
        <ToolbarRoot>
          <ToolbarButton disabled>Disabled button</ToolbarButton>
        </ToolbarRoot>
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("ToolbarLink", () => {
    it("renders as link", () => {
      render(
        <ToolbarRoot>
          <ToolbarLink href="/test">Test link</ToolbarLink>
        </ToolbarRoot>
      );
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToolbarRoot>
          <ToolbarLink href="/test" className="custom-link">Test</ToolbarLink>
        </ToolbarRoot>
      );
      expect(screen.getByRole("link")).toHaveClass("custom-link");
    });

    it("forwards href correctly", () => {
      render(
        <ToolbarRoot>
          <ToolbarLink href="/test">Test link</ToolbarLink>
        </ToolbarRoot>
      );
      expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
    });
  });

  describe("ToolbarSeparator", () => {
    it("renders separator", () => {
      render(
        <ToolbarRoot>
          <ToolbarSeparator data-testid="separator" />
        </ToolbarRoot>
      );
      expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("applies vertical orientation by default", () => {
      render(
        <ToolbarRoot>
          <ToolbarSeparator data-testid="separator" />
        </ToolbarRoot>
      );
      expect(screen.getByTestId("separator")).toHaveClass("h-4", "w-px");
    });

    it("applies horizontal orientation when specified", () => {
      render(
        <ToolbarRoot>
          <ToolbarSeparator data-testid="separator" orientation="horizontal" />
        </ToolbarRoot>
      );
      expect(screen.getByTestId("separator")).toHaveClass("h-px", "w-full");
    });

    it("applies custom className", () => {
      render(
        <ToolbarRoot>
          <ToolbarSeparator data-testid="separator" className="custom-separator" />
        </ToolbarRoot>
      );
      expect(screen.getByTestId("separator")).toHaveClass("custom-separator");
    });
  });

  describe("ToolbarGroup", () => {
    it("renders group container", () => {
      render(
        <ToolbarRoot>
          <ToolbarGroup data-testid="group">Group content</ToolbarGroup>
        </ToolbarRoot>
      );
      expect(screen.getByTestId("group")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToolbarRoot>
          <ToolbarGroup data-testid="group" className="custom-group">Test</ToolbarGroup>
        </ToolbarRoot>
      );
      expect(screen.getByTestId("group")).toHaveClass("custom-group");
    });

    it("can contain multiple toolbar items", () => {
      render(
        <ToolbarRoot>
          <ToolbarGroup>
            <ToolbarButton>Button 1</ToolbarButton>
            <ToolbarButton>Button 2</ToolbarButton>
          </ToolbarGroup>
        </ToolbarRoot>
      );
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });
  });

  describe("ToolbarInput", () => {
    it("renders input element", () => {
      render(
        <ToolbarRoot>
          <ToolbarInput placeholder="Search..." />
        </ToolbarRoot>
      );
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(
        <ToolbarRoot>
          <ToolbarInput className="custom-input" />
        </ToolbarRoot>
      );
      expect(screen.getByRole("textbox")).toHaveClass("custom-input");
    });

    it("handles value changes", async () => {
      const handleChange = vi.fn();
      render(
        <ToolbarRoot>
          <ToolbarInput onChange={handleChange} />
        </ToolbarRoot>
      );
      
      await userEvent.type(screen.getByRole("textbox"), "test");
      expect(handleChange).toHaveBeenCalled();
    });

    it("can be disabled", () => {
      render(
        <ToolbarRoot>
          <ToolbarInput disabled />
        </ToolbarRoot>
      );
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-disabled", "true");
    });

    it("forwards placeholder correctly", () => {
      render(
        <ToolbarRoot>
          <ToolbarInput placeholder="Enter text..." />
        </ToolbarRoot>
      );
      expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Enter text...");
    });
  });

  describe("Composite toolbar", () => {
    it("renders complete toolbar with all components", () => {
      render(
        <Toolbar data-testid="toolbar">
          <ToolbarGroup>
            <ToolbarButton>Bold</ToolbarButton>
            <ToolbarButton>Italic</ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <ToolbarButton>Left</ToolbarButton>
            <ToolbarButton>Center</ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarInput placeholder="Search..." />
          <ToolbarLink href="/help">Help</ToolbarLink>
        </Toolbar>
      );

      expect(screen.getByTestId("toolbar")).toBeInTheDocument();
      expect(screen.getAllByRole("button")).toHaveLength(4);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });
}); 