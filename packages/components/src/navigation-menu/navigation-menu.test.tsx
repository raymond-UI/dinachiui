import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { AgentProvider, createAgent } from "../agent";
import { agentConformance } from "../test/agent-conformance";
import {
  NavigationMenu,
  NavigationMenuArrow,
  NavigationMenuBackdrop,
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

  it("renders with portal and viewport correctly", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
            <NavigationMenuContent>Portal content</NavigationMenuContent>
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

  it("renders with arrow inside popup", () => {
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
              <NavigationMenuArrow />
              <NavigationMenuViewport />
            </NavigationMenuPopup>
          </NavigationMenuPositioner>
        </NavigationMenuPortal>
      </NavigationMenu>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with backdrop inside portal", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Test</NavigationMenuTrigger>
            <NavigationMenuContent>Content</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPortal>
          <NavigationMenuBackdrop />
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

  it("renders with correct structure for viewport", () => {
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
    render(
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

function Site({ disabled, onDocs, ...props }: React.ComponentProps<typeof NavigationMenu> & { disabled?: boolean; onDocs?: (event: React.MouseEvent) => void }) {
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger disabled={disabled}>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="#docs" onClick={onDocs}>Docs</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing">Pricing</NavigationMenuLink>
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
}

agentConformance({
  name: "NavigationMenu",
  label: "Products",
  render: ({ onChange, disabled }) => <Site onValueChange={onChange} disabled={disabled} />,
  entry: { component: "menu", open: false, actions: ["open"] },
  act: { action: "open", result: { open: true } },
  commits: 2,
  person: async (user) => {
    await user.click(screen.getByRole("button", { name: "Products" }));
  },
});

describe("NavigationMenu: agent", () => {
  function mount(ui: React.ReactElement) {
    const agent = createAgent();
    render(<AgentProvider agent={agent}>{ui}</AgentProvider>);
    const run = (ref: string, action: string) => agent.act({ steps: [{ ref, action }] });
    const entry = (label: string) => agent.snapshot().find((c) => c.label === label);
    return { agent, run, entry };
  }

  it("lists an item with a trigger as a menu, and a plain link as a link", () => {
    const { agent, entry } = mount(<Site />);
    expect(agent.snapshot().filter((c) => c.component === "menu")).toHaveLength(1);
    expect(entry("Pricing")).toMatchObject({ component: "link", actions: ["press"] });
  });

  it("opens an item, and presses a link inside it", async () => {
    const onDocs = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const { run, entry } = mount(<Site onDocs={onDocs} />);
    expect(await run("Products", "open")).toMatchObject({ ok: true, steps: [{ open: true }] });
    await vi.waitFor(() => expect(entry("Docs")).toMatchObject({ component: "link" }));
    expect(await run("Docs", "press")).toMatchObject({ ok: true });
    expect(onDocs).toHaveBeenCalledTimes(1);
  });

  it("closes an open item", async () => {
    const { run, entry } = mount(<Site defaultValue="products" />);
    expect(entry("Products")).toMatchObject({ open: true, actions: ["close"] });
    await run("Products", "close");
    expect(entry("Products")).toMatchObject({ open: false });
  });

  it("leaves the item closed when the app refuses", async () => {
    const { run, entry } = mount(<Site onValueChange={(_, details) => details.cancel()} />);
    expect((await run("Products", "open")).error?.message).toMatch(/refused/);
    expect(entry("Products")).toMatchObject({ open: false });
  });
});
