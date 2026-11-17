/*
 * The one document behind a component page. The page, Copy page, the `.md` route,
 * `llms.txt`, the sitemap and the metadata are all rendered from it, so they cannot
 * disagree. Title and category come from the component inventory; files and packages
 * come from the CLI registry; example code comes from the examples registry.
 *
 * Strings marked "inline markdown" may use `code`, **bold** and [links](/docs/...).
 */

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  /** Inline markdown, one or two short sentences. */
  description: string;
  /** The agent reads this prop, or it changes what the agent can do. */
  agent?: boolean;
}

export interface PartDoc {
  /** The exported name, e.g. `SelectTrigger`. */
  name: string;
  /** Inline markdown, one short sentence. */
  summary: string;
  props: PropDoc[];
}

export interface KeyDoc {
  keys: string[];
  /** Render the keys as a range, `A … Z`. */
  range?: boolean;
  does: string;
}

export interface AgentDoc {
  /** The `component` value the element has in `agent.snapshot()`. */
  kind: string;
  reads: { field: string; means: string }[];
  actions: { call: string; does: string }[];
  /** Inline markdown: how the app refuses an agent's change, and what refuses on its own. */
  refusal: string;
  /** An `agent.act()` call that works against the playground. */
  example: string;
}

export interface NoteDoc {
  title: string;
  /** Block markdown: paragraphs, lists, fenced code. */
  body: string;
}

export interface ComponentDoc {
  slug: string;
  /** One line under the title. Also the meta description, the search hit and the llms.txt entry. */
  description: string;
  /** The smallest complete use: imports plus one component. */
  usage: string;
  /** The parts as a JSX tree, no props. Omit for single-element components. */
  anatomy?: string;
  /** Examples-registry `componentId`s, shown under Examples. */
  examples: string[];
  /** Every exported part, root first. */
  parts: PartDoc[];
  /** Guidance that does not fit a prop: composition, gotchas, migration. */
  notes?: NoteDoc[];
  /** Present when the component registers with the agent bridge. */
  agent?: AgentDoc;
  keyboard?: KeyDoc[];
  /** Inline markdown, one fact per line. */
  accessibility?: string[];
}
