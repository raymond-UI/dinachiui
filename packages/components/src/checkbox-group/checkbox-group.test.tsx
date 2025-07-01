import { render, screen } from "@testing-library/react";
import { CheckboxGroup } from "./checkbox-group";
import { Checkbox } from "../checkbox/checkbox";

describe("CheckboxGroup", () => {
  it("should render correctly", () => {
    render(
      <CheckboxGroup>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should handle default values", () => {
    render(
      <CheckboxGroup defaultValue={["item1"]}>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("checkbox", { name: "Item 1" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Item 2" })).not.toBeChecked();
  });

  it("should handle controlled state", () => {
    const mockOnValueChange = vi.fn();
    render(
      <CheckboxGroup value={["item1"]} onValueChange={mockOnValueChange}>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("checkbox", { name: "Item 1" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Item 2" })).not.toBeChecked();
  });

  it("should handle disabled state", () => {
    render(
      <CheckboxGroup disabled defaultValue={["item1"]}>
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
        <label>
          <Checkbox value="item2" />
          Item 2
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-disabled");
  });

  it("should support parent checkbox with allValues", () => {
    const fruits = ['apple', 'banana', 'orange'];
    render(
      <CheckboxGroup allValues={fruits}>
        <label>
          <Checkbox parent />
          All Fruits
        </label>
        <label>
          <Checkbox value="apple" />
          Apple
        </label>
        <label>
          <Checkbox value="banana" />
          Banana
        </label>
      </CheckboxGroup>
    );
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("should apply custom className", () => {
    render(
      <CheckboxGroup className="custom-class">
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByRole("group")).toHaveClass("custom-class");
  });

  it("should forward all props to base component", () => {
    render(
      <CheckboxGroup data-testid="checkbox-group" aria-label="Test group">
        <label>
          <Checkbox value="item1" />
          Item 1
        </label>
      </CheckboxGroup>
    );
    expect(screen.getByTestId("checkbox-group")).toHaveAttribute("aria-label", "Test group");
  });
});
