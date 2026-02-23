"use client"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuViewport,
  NavigationMenuArrow,
  NavigationMenuBackdrop,
} from '@/components/ui/navigation-menu';

export function DefaultNavigationMenuExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 md:w-[400px]">
            <ul className="grid gap-3">
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Introduction</div>
                  <p className="text-xs text-muted-foreground">
                    Learn the basics and get up and running quickly.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Installation</div>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step guide to install and configure.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Typography</div>
                  <p className="text-xs text-muted-foreground">
                    Styles for headings, paragraphs, and lists.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 md:w-[400px]">
            <ul className="grid gap-3 md:grid-cols-2">
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Button</div>
                  <p className="text-xs text-muted-foreground">
                    Trigger actions and events.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Dialog</div>
                  <p className="text-xs text-muted-foreground">
                    Modal overlays for focused tasks.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Tabs</div>
                  <p className="text-xs text-muted-foreground">
                    Organize content into panels.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Select</div>
                  <p className="text-xs text-muted-foreground">
                    Pick from a list of options.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Documentation
          </NavigationMenuLink>
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

export function NavigationMenuWithArrowExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 md:w-[300px]">
            <ul className="grid gap-3">
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Analytics</div>
                  <p className="text-xs text-muted-foreground">
                    Track your key metrics in real time.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Automation</div>
                  <p className="text-xs text-muted-foreground">
                    Automate repetitive workflows easily.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Pricing
          </NavigationMenuLink>
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
}

export function NavigationMenuWithBackdropExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 md:w-[300px]">
            <ul className="grid gap-3">
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Documentation</div>
                  <p className="text-xs text-muted-foreground">
                    Guides and API references.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">
                  <div className="text-sm font-medium">Blog</div>
                  <p className="text-xs text-muted-foreground">
                    Latest news and updates.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            About
          </NavigationMenuLink>
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
}

export function SimpleNavigationMenuExample() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
