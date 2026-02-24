import { Button } from "@/components/ui/button";
import { Tile } from "./Tile";

export function CodeExampleTile() {
  return (
    <Tile className="lg:col-span-2 h-full" delay={0.25}>
      <div className="grid grid-cols-1 md:grid-cols-5 h-full">
        {/* Code side */}
        <div className="md:col-span-3 flex flex-col">
          <div className="pl-8 pb-4 pt-6">
            <h3 className="text-lg font-medium font-pixel mb-1">
              Render prop pattern
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compose elements with Base UI&apos;s{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                render
              </code>{" "}
              prop — no{" "}
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                asChild
              </code>{" "}
              needed.
            </p>
          </div>
          <div className="flex w-full pl-8 pt-5 h-full">
            <div className="w-full rounded-tl-md bg-muted border border-border overflow-hidden font-mono text-[13px] leading-relaxed">
              <div className="p-5 overflow-x-auto">
                <div>
                  <span className="text-purple-400">import</span>
                  <span className="text-foreground">{" { "}</span>
                  <span className="text-yellow-600 dark:text-yellow-300">
                    Button
                  </span>
                  <span className="text-foreground">{" } "}</span>
                  <span className="text-purple-400">from</span>
                  <span className="text-green-600 dark:text-green-300">
                    {" "}
                    &apos;@/components/ui/button&apos;
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-blue-500 dark:text-blue-300">
                    {"<"}
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-300">
                    Button
                  </span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-600 dark:text-cyan-300">
                    variant
                  </span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-green-600 dark:text-green-300">
                    &quot;outline&quot;
                  </span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-600 dark:text-cyan-300">
                    render
                  </span>
                  <span className="text-muted-foreground">
                    ={"{"}
                    {"<"}
                  </span>
                  <span className="text-red-500 dark:text-red-300">a</span>
                  <span className="text-muted-foreground"> </span>
                  <span className="text-cyan-600 dark:text-cyan-300">href</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-green-600 dark:text-green-300">
                    &quot;/contact&quot;
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    /{">"}{"}"}
                  </span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-300">
                    {">"}
                  </span>
                </div>
                <div className="pl-4">
                  <span className="text-foreground">Contact us</span>
                </div>
                <div>
                  <span className="text-blue-500 dark:text-blue-300">
                    {"</"}
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-300">
                    Button
                  </span>
                  <span className="text-blue-500 dark:text-blue-300">
                    {">"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Preview side */}
        <div className="md:col-span-2 p-8 flex flex-col justify-center md:border-l border-border/40">
          <div className="text-xs text-muted-foreground/50 font-mono uppercase tracking-wider mb-6">
            Preview
          </div>
          <div className="flex flex-col items-start gap-4">
            <div className="rounded-xl border border-border/40 bg-muted/30 p-8 w-full flex items-center justify-center">
              <Button variant="outline" render={<a href="/contact" />}>
                Contact us
              </Button>
            </div>
            <span className="text-xs text-muted-foreground/50 font-mono">
              Renders as{" "}
              <code className="bg-muted px-1 py-0.5 rounded">{"<a>"}</code>{" "}
              with button styles
            </span>
          </div>
        </div>
      </div>
    </Tile>
  );
}
