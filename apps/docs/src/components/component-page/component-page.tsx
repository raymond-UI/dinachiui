import * as React from "react";
import "./component-page.css";
import { Badge } from "@/components/ui/badge";
import { ComponentIcon } from "@/components/component-icon";
import { ComponentActions } from "@/components/reusables/ComponentActions";
import { exampleComponents } from "@/lib/examples-registry";
import { highlight } from "@/lib/component-pages/highlight";
import { pageMarkdown } from "@/lib/component-pages/markdown";
import type { ComponentPageData } from "@/lib/component-pages";
import type { KeyDoc } from "@/lib/component-pages/types";
import { AgentTag } from "./shared";
import { ApiAccordion, CodeCard, ExampleCode, ExampleTabs, InstallBar, KeyboardBlock } from "./islands";
import { Blocks, Inline } from "./prose";
import { playgrounds } from "@/components/playgrounds";
import type { WorkbenchShell } from "./workbench-types";

/*
 * One component page, rendered on the server from the page data. Everything a reader or
 * a crawler could want is in the HTML: closed accordion panels and inactive tabs are
 * mounted and hidden, not left out.
 */

const previews = exampleComponents as Record<string, React.ComponentType>;

function shellOf(page: ComponentPageData): WorkbenchShell {
  const { doc } = page;
  return {
    slug: doc.slug,
    parts: doc.parts.map(({ name, summary }) => ({ name, summary })),
    files: page.files,
    dependencies: page.dependencies,
    usesAgent: page.usesAgent,
    source: page.source,
    anatomy: doc.anatomy,
    agent: doc.agent && { kind: doc.agent.kind, example: doc.agent.example },
  };
}

export async function ComponentPage({ page, footer }: { page: ComponentPageData; footer?: React.ReactNode }) {
  const { doc } = page;
  const Playground = playgrounds[doc.slug];

  return (
    <div className="cp @container">
      <header className="mb-6 flex flex-col gap-5 @4xl:flex-row @4xl:items-end @4xl:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <ComponentIcon slug={doc.slug} className="size-6 text-muted-foreground [--icon-fill:.2] [stroke-width:1.1]" />
            <h1 className="text-[28px] font-semibold leading-none tracking-tight">{page.title}</h1>
            {page.category === "Motion" && <Badge size="sm">Animated</Badge>}
          </div>
          <p className="mt-2 max-w-xl text-pretty text-sm text-muted-foreground">{doc.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
            <ComponentActions
              quiet
              title={page.title}
              description={doc.description}
              slug={`components/${doc.slug}`}
              rawContent=""
              markdown={pageMarkdown(page)}
              sourceUrl={page.sourceUrl}
            />
          </div>
        </div>
        {/* Pulled down so its centre lines up with the action row beside it. */}
        <div className="@4xl:-mb-2.5">
          <InstallBar command={page.install} />
        </div>
      </header>

      <Playground {...shellOf(page)} />

      <Section id="usage" title="Usage">
        <CodeCard code={doc.usage} html={await highlight(doc.usage)} />
      </Section>

      {page.examples.length > 0 && (
        <Section id="examples" title="Examples">
          <ExampleTabs
            items={await Promise.all(
              page.examples.map(async (ex) => {
                const Preview = previews[ex.id];
                return {
                  id: ex.id,
                  title: ex.title,
                  panel: (
                    <div className="overflow-hidden rounded-2xl border bg-card">
                      <div className="cp-stage flex min-h-[200px] items-center justify-center overflow-hidden px-6 py-10">
                        {Preview && <Preview />}
                      </div>
                      <ExampleCode code={ex.code} html={await highlight(ex.code)} description={ex.description} />
                    </div>
                  ),
                };
              }),
            )}
          />
        </Section>
      )}

      {doc.notes?.length ? (
        <Section id="notes" title="Notes">
          <div className="space-y-8">
            {doc.notes.map((n) => (
              <div key={n.title}>
                <h3 className="mb-2 text-[15px] font-medium">{n.title}</h3>
                <Blocks body={n.body} />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section id="api" title="API">
        <ApiAccordion
          parts={doc.parts.map((part) => ({
            name: part.name,
            summary: <Inline text={part.summary} />,
            body: part.props.length ? (
              <div className="divide-y border-t text-[13px]">
                {part.props.map((p) => (
                  <div key={p.name} className="grid gap-x-4 gap-y-1 py-2.5 md:grid-cols-[180px_220px_1fr]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
                      <span className="flex items-center gap-1.5 font-mono text-[12.5px]">
                        {p.name}
                        {p.agent && <AgentTag />}
                      </span>
                      <span className="break-words font-mono text-xs text-[var(--part)]">
                        {p.type}
                        {p.default && <span className="text-muted-foreground"> = {p.default}</span>}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      <Inline text={p.description} />
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="border-t py-2.5 text-[13px] text-muted-foreground">Takes the props of the element it renders.</p>
            ),
          }))}
        />
      </Section>

      {doc.agent && (
        <Section id="agent" title="Agent">
          <p className="mb-5 text-[14px] text-muted-foreground">
            Inside an <code className="font-mono text-foreground">AgentProvider</code>, it appears in{" "}
            <code className="font-mono text-foreground">agent.snapshot()</code> as{" "}
            <code className="font-mono text-[var(--agent)]">{doc.agent.kind}</code>.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <Rows title="Reads" rows={doc.agent.reads.map((r) => [r.field, r.means])} />
            <Rows title="Actions" rows={doc.agent.actions.map((a) => [a.call, a.does])} />
          </div>
          <p className="mb-4 mt-6 text-[14px] leading-relaxed text-muted-foreground">
            <Inline text={doc.agent.refusal} />
          </p>
          <CodeCard code={doc.agent.example} html={await highlight(doc.agent.example, "ts")} />
        </Section>
      )}

      {(doc.accessibility?.length || doc.keyboard?.length) && (
        <Section id="accessibility" title="Accessibility">
          {doc.accessibility?.length ? (
            <ul className="space-y-2 text-[14px] text-muted-foreground">
              {doc.accessibility.map((a) => (
                <li key={a} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                  <span>
                    <Inline text={a} />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {doc.keyboard?.length ? (
            <KeyboardBlock count={doc.keyboard.length}>
              <KeyRows keys={doc.keyboard} />
            </KeyboardBlock>
          ) : null}
        </Section>
      )}

      {footer && <div className="mt-16 max-w-[860px]">{footer}</div>}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mx-0 mt-14 max-w-[860px] md:mt-16">
      <h2 id={id} className="mb-3 scroll-mt-24 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Rows({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-medium">{title}</h3>
      <div className="divide-y border-t">
        {rows.map(([k, v]) => (
          <div key={k} className="py-2.5 text-[13px]">
            <code className="font-mono text-[12.5px] text-foreground">{k}</code>
            <p className="mt-0.5 text-muted-foreground">
              <Inline text={v} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyRows({ keys }: { keys: KeyDoc[] }) {
  return (
    <div className="divide-y border-t">
      {keys.map(({ keys: k, range, does }) => (
        <div
          key={k.join() + does}
          className="grid min-h-12 grid-cols-[120px_1fr] items-center gap-3 py-1.5 text-[13.5px] text-muted-foreground md:grid-cols-[170px_1fr]"
        >
          <span className="flex flex-wrap items-center gap-1.5">
            {k.map((key, i) => (
              <React.Fragment key={key}>
                {i > 0 && range && <span>…</span>}
                <kbd className="inline-grid h-6 min-w-6 place-items-center rounded-md border border-b-2 bg-card px-1.5 font-mono text-[11.5px] text-foreground">
                  {key}
                </kbd>
              </React.Fragment>
            ))}
          </span>
          <Inline text={does} />
        </div>
      ))}
    </div>
  );
}
