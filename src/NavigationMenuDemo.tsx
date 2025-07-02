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
} from "@dinachi/components"

export default function NavigationMenuDemo() {
  const handleLinkClick = (href: string) => {
    console.log(`Navigating to: ${href}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Navigation Menu Demo</h2>
        <p className="text-muted-foreground mb-6">
          A collection of links and menus for website navigation with dropdown support.
        </p>
      </div>

      <div className="space-y-6">
        {/* Basic Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Navigation</h3>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" onClick={() => handleLinkClick("/")}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" onClick={() => handleLinkClick("/about")}>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" onClick={() => handleLinkClick("/contact")}>
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Navigation with Dropdowns */}
        <div>
          <h3 className="text-lg font-semibold mb-3">With Dropdown Menus</h3>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink 
                        href="/products/featured"
                        onClick={() => handleLinkClick("/products/featured")}
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Featured Product
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Our most popular and highly-rated product this month.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/products/electronics"
                        onClick={() => handleLinkClick("/products/electronics")}
                      >
                        <div className="text-sm font-medium leading-none">Electronics</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Latest gadgets and electronic devices.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/products/clothing"
                        onClick={() => handleLinkClick("/products/clothing")}
                      >
                        <div className="text-sm font-medium leading-none">Clothing</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Fashion and apparel for all occasions.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/products/home"
                        onClick={() => handleLinkClick("/products/home")}
                      >
                        <div className="text-sm font-medium leading-none">Home & Garden</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Everything for your home and garden needs.
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink
                        href="/services/web-design"
                        onClick={() => handleLinkClick("/services/web-design")}
                      >
                        <div className="text-sm font-medium leading-none">Web Design</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Custom website design and development services.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/services/consulting"
                        onClick={() => handleLinkClick("/services/consulting")}
                      >
                        <div className="text-sm font-medium leading-none">Consulting</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Expert advice and strategic planning.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/services/support"
                        onClick={() => handleLinkClick("/services/support")}
                      >
                        <div className="text-sm font-medium leading-none">Support</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          24/7 customer support and maintenance.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/services/training"
                        onClick={() => handleLinkClick("/services/training")}
                      >
                        <div className="text-sm font-medium leading-none">Training</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Professional training and workshops.
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-4">
                    <div className="grid gap-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium leading-none">Documentation</h4>
                        <ul className="grid gap-2">
                          <li>
                            <NavigationMenuLink
                              href="/docs/getting-started"
                              onClick={() => handleLinkClick("/docs/getting-started")}
                            >
                              <div className="text-sm font-medium leading-none">Getting Started</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Quick start guide and installation instructions.
                              </p>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink
                              href="/docs/api"
                              onClick={() => handleLinkClick("/docs/api")}
                            >
                              <div className="text-sm font-medium leading-none">API Reference</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Complete API documentation and examples.
                              </p>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-medium leading-none">Community</h4>
                        <ul className="grid gap-2">
                          <li>
                            <NavigationMenuLink
                              href="/community/forum"
                              onClick={() => handleLinkClick("/community/forum")}
                            >
                              <div className="text-sm font-medium leading-none">Forum</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Join discussions and get help from the community.
                              </p>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink
                              href="/community/discord"
                              onClick={() => handleLinkClick("/community/discord")}
                            >
                              <div className="text-sm font-medium leading-none">Discord</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Real-time chat with other developers.
                              </p>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/blog"
                  onClick={() => handleLinkClick("/blog")}
                >
                  Blog
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
        </div>

        {/* Compact Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Compact Layout</h3>
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  onClick={() => handleLinkClick("/")}
                  className="px-3 py-2 text-sm"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-3 py-2 text-sm">
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-2">
                    <li>
                      <NavigationMenuLink
                        href="/docs"
                        onClick={() => handleLinkClick("/docs")}
                        className="block px-2 py-1 text-sm"
                      >
                        Documentation
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/examples"
                        onClick={() => handleLinkClick("/examples")}
                        className="block px-2 py-1 text-sm"
                      >
                        Examples
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        href="/github"
                        onClick={() => handleLinkClick("/github")}
                        className="block px-2 py-1 text-sm"
                      >
                        GitHub
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
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
        </div>
      </div>
    </div>
  )
} 