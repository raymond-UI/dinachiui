import { codeify as c, codeifyBlock } from "./codeify";
import type { ComponentPageData } from "./index";
import type { KeyDoc } from "./types";

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const fence = (lang: string, code: string) => "```" + lang + "\n" + code.trim() + "\n```";
const keys = (k: KeyDoc) => k.keys.map((x) => `\`${x}\``).join(k.range ? " to " : " / ");

/**
 * The whole page as markdown: Copy page, the `.md` route and `llms-full.txt`. Same order
 * as the page, with what the page folds away (every prop, the source) written out.
 */
export function pageMarkdown(page: ComponentPageData, { source = true } = {}): string {
  const { doc } = page;
  const out: string[] = [];
  const add = (...lines: (string | false | undefined)[]) => out.push(...lines.filter((l): l is string => !!l), "");

  add(`# ${page.title}`, doc.description, `Source page: ${page.url}`);

  add(
    "## Installation",
    fence("bash", page.install),
    "Adds to your project:",
    page.files.map((f) => `- \`${f}\``).join("\n"),
    page.dependencies.length > 0 && "Installs:",
    page.dependencies.length > 0 && page.dependencies.map((d) => `- \`${d.name}\` ${d.version}`).join("\n"),
  );

  add("## Usage", fence("tsx", doc.usage));

  if (doc.anatomy) {
    add("## Anatomy", fence("tsx", doc.anatomy), doc.parts.map((p) => `- \`${p.name}\`: ${c(p.summary)}`).join("\n"));
  }

  if (page.examples.length) {
    add("## Examples");
    for (const ex of page.examples) add(`### ${ex.title}`, ex.description, fence("tsx", ex.code));
  }

  if (doc.notes?.length) {
    add("## Notes");
    for (const note of doc.notes) add(`### ${note.title}`, codeifyBlock(note.body.trim()));
  }

  add("## API reference", doc.agent && "Props marked **agent** change what an agent reads or may do.");
  for (const part of doc.parts) {
    add(`### ${part.name}`, c(part.summary));
    if (!part.props.length) {
      add("Takes the props of the element it renders.");
      continue;
    }
    add(
      [
        "| Prop | Type | Default | Description |",
        "| --- | --- | --- | --- |",
        ...part.props.map(
          (p) =>
            `| \`${p.name}\`${p.agent ? " **agent**" : ""} | \`${cell(p.type)}\` | ${p.default ? `\`${cell(p.default)}\`` : "-"} | ${cell(c(p.description))} |`,
        ),
      ].join("\n"),
    );
  }

  if (doc.agent) {
    const a = doc.agent;
    add(
      "## Agent",
      `Inside an \`AgentProvider\`, ${page.title} appears in \`agent.snapshot()\` as \`${a.kind}\`.`,
      "Reads:",
      a.reads.map((r) => `- \`${r.field}\`: ${c(r.means)}`).join("\n"),
      "Actions:",
      a.actions.map((x) => `- \`${x.call}\`: ${c(x.does)}`).join("\n"),
      c(a.refusal),
      fence("ts", a.example),
    );
  }

  if (doc.accessibility?.length || doc.keyboard?.length) {
    add(
      "## Accessibility",
      doc.accessibility?.length ? doc.accessibility.map((a) => `- ${c(a)}`).join("\n") : undefined,
      doc.keyboard?.length ? "### Keyboard" : undefined,
      doc.keyboard?.length
        ? ["| Keys | Does |", "| --- | --- |", ...doc.keyboard.map((k) => `| ${keys(k)} | ${cell(c(k.does))} |`)].join("\n")
        : undefined,
    );
  }

  if (source && page.source) add("## Source", `\`${page.files[0]}\``, fence("tsx", page.source));

  return out.join("\n").trim() + "\n";
}
