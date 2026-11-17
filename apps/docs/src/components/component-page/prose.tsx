import * as React from "react";
import Link from "next/link";
import { codeify } from "@/lib/component-pages/codeify";
import { highlight } from "@/lib/component-pages/highlight";

/*
 * The small markdown the content files use, rendered on the server: `code`, **bold** and
 * [links](/docs/...) inline; paragraphs, lists and fenced code in a note body.
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

export function Inline({ text }: { text: string }) {
  return (
    <>
      {codeify(text).split(INLINE).map((tok, i) => {
        if (!tok) return null;
        if (tok.startsWith("`") && tok.endsWith("`"))
          return (
            <code key={i} className="font-mono text-[0.92em] text-foreground">
              {tok.slice(1, -1)}
            </code>
          );
        if (tok.startsWith("**") && tok.endsWith("**"))
          return (
            <strong key={i} className="font-medium text-foreground">
              {tok.slice(2, -2)}
            </strong>
          );
        const link = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (link) {
          const [, label, href] = link;
          const cls = "text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground";
          return href.startsWith("/") ? (
            <Link key={i} href={href} className={cls}>
              <Inline text={label} />
            </Link>
          ) : (
            <a key={i} href={href} className={cls} target="_blank" rel="noreferrer">
              <Inline text={label} />
            </a>
          );
        }
        return <React.Fragment key={i}>{tok}</React.Fragment>;
      })}
    </>
  );
}

type Block = { kind: "p"; text: string } | { kind: "ul"; items: string[] } | { kind: "code"; lang: string; code: string };

function parse(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.trim().split("\n");
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) code.push(lines[i]);
      i++;
      blocks.push({ kind: "code", lang: fence[1] || "tsx", code: code.join("\n") });
    } else if (/^[-*] /.test(line)) {
      const items: string[] = [];
      for (; i < lines.length && /^[-*] /.test(lines[i]); i++) items.push(lines[i].slice(2));
      blocks.push({ kind: "ul", items });
    } else if (!line.trim()) {
      i++;
    } else {
      const para: string[] = [];
      for (; i < lines.length && lines[i].trim() && !/^([-*] |```)/.test(lines[i]); i++) para.push(lines[i]);
      blocks.push({ kind: "p", text: para.join(" ") });
    }
  }
  return blocks;
}

export async function Blocks({ body }: { body: string }) {
  const blocks = await Promise.all(
    parse(body).map(async (b) =>
      b.kind === "code" ? { ...b, html: await highlight(b.code, b.lang === "bash" ? "bash" : b.lang === "ts" ? "ts" : "tsx") } : b,
    ),
  );
  return (
    <div className="space-y-3 text-[14px] leading-relaxed text-muted-foreground">
      {blocks.map((b, i) =>
        b.kind === "p" ? (
          <p key={i}>
            <Inline text={b.text} />
          </p>
        ) : b.kind === "ul" ? (
          <ul key={i} className="space-y-1.5">
            {b.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div
            key={i}
            className="cp-shiki mx-0 max-w-none overflow-x-auto rounded-xl border bg-card px-4 py-3 font-mono text-[12.5px] leading-[1.7]"
            dangerouslySetInnerHTML={{ __html: "html" in b ? b.html : "" }}
          />
        ),
      )}
    </div>
  );
}
