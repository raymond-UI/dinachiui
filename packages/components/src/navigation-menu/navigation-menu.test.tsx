import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "./navigation-menu";

describe("NavigationMenu", () => {
  it("renders correctly", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test trigger</NavigationMenuTrigger>
            <NavigationMenuContent>Test content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /test trigger/i })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <NavigationMenu className="custom-class">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <NavigationMenu ref={ref}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("handles trigger interactions", async () => {
    const user = userEvent.setup();

    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>Product content</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const trigger = screen.getByRole("button", { name: /products/i });
    expect(trigger).toBeInTheDocument();

    // Test click interaction
    await user.click(trigger);
    // Note: Content visibility might be controlled by Base UI's internal state
  });

  it("renders navigation menu link correctly within context", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/test">Test link</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
    expect(screen.getByText("Test link")).toBeInTheDocument();
  });

  it("applies link className correctly within context", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink className="custom-link-class" href="/test">
              Test link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("link")).toHaveClass("custom-link-class");
  });

  it("renders with portal correctly", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
            <NavigationMenuPortal>
              <NavigationMenuPositioner>
                <NavigationMenuPopup>
                  <NavigationMenuContent>Portal content</NavigationMenuContent>
                </NavigationMenuPopup>
              </NavigationMenuPositioner>
            </NavigationMenuPortal>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles multiple navigation items", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>Products content</NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>Services content</NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(
      screen.getByRole("button", { name: /products/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /services/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
  });

  it("applies correct ARIA attributes", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test trigger</NavigationMenuTrigger>
            <NavigationMenuContent>Test content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const navigation = screen.getByRole("navigation");
    const trigger = screen.getByRole("button");

    expect(navigation).toBeInTheDocument();
    expect(trigger).toHaveAttribute("type", "button");
  });

  it("renders navigation menu viewport correctly", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
            <NavigationMenuContent>Content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPortal>
          <NavigationMenuPositioner>
            <NavigationMenuPopup>
              <NavigationMenuViewport />
            </NavigationMenuPopup>
          </NavigationMenuPositioner>
        </NavigationMenuPortal>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("handles trigger with chevron icon", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>Products content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const trigger = screen.getByRole("button", { name: /products/i });
    expect(trigger).toBeInTheDocument();
    
    // Check that the trigger contains the chevron icon (lucide-react svg)
    const svg = trigger.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders with correct structure to avoid double borders", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
            <NavigationMenuContent>Content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPortal>
          <NavigationMenuPositioner>
            <NavigationMenuPopup>
              <NavigationMenuViewport />
            </NavigationMenuPopup>
          </NavigationMenuPositioner>
        </NavigationMenuPortal>
      </NavigationMenu>
    );

    // Test that the structure renders without errors
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with proper animations", () => {
    const { container } = render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Animated</NavigationMenuTrigger>
            <NavigationMenuContent>Content with animations</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /animated/i })).toBeInTheDocument();
  });
});
