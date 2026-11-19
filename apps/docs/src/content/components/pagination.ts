import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "pagination",
  description: "Moves through the pages of a list.",
  usage: `import { useState } from "react"
import { Pagination } from "@/components/ui/pagination"

export function Orders() {
  const [page, setPage] = useState(1)
  return <Pagination aria-label="Orders" count={25} page={page} onPageChange={setPage} />
}`,

  examples: ["pagination-default", "pagination-compact", "pagination-links"],

  parts: [
    {
      name: "Pagination",
      summary: "The `<nav>` and everything in it. The parts are rendered for you.",
      props: [
        { name: "count", type: "number", description: "How many pages there are.", agent: true },
        { name: "page", type: "number", description: "Controlled page, from 1.", agent: true },
        { name: "defaultPage", type: "number", default: "1", description: "Starting page when uncontrolled." },
        { name: "onPageChange", type: "(page, details) => void", description: "Runs on every change, for people and agents. `details.cancel()` refuses it.", agent: true },
        { name: "getHref", type: "(page: number) => string", description: "Each page's URL. Pages and arrows then render as links." },
        { name: "variant", type: '"full" | "compact"', default: '"full"', description: "`compact` reads Page 6 of 25, with the number as the jump field." },
        { name: "size", type: '"default" | "lg"', default: '"default"', description: "`lg` makes every target 44px, for touch." },
        { name: "disabled", type: "boolean", default: "false", description: "Blocks people and agents.", agent: true },
        { name: "aria-label", type: "string", default: '"Pagination"', description: "Names the nav. Say what it pages, such as Orders, when a screen has more than one." },
      ],
    },
  ],

  notes: [
    {
      title: "A bar that holds still",
      body: "Past seven pages the bar always has seven slots, each as wide as the widest page number, so the arrows stay under the pointer as you page. `pageItems(page, count)` returns those slots, with `\"gap\"` where pages are skipped, for a bar of your own.",
    },
    {
      title: "Jumping",
      body: "A gap opens a field for any page. Enter goes, Esc puts the gap back, and leaving the field goes too. Numbers past either end go to the first or last page.",
    },
    {
      title: "Links",
      body: "With `getHref`, pages are links, and opening one in a new tab leaves this page alone. A jump or an agent's change loads the page's URL. Call `details.cancel()` in `onPageChange` to route the change yourself; the browser then stays where it is.",
    },
    {
      title: "Phone and desktop",
      body: 'Below 768px use `variant="compact"` and `size="lg"`: one line, 44px targets, and the page number to tap for the jump field.',
    },
  ],

  agent: {
    kind: "number",
    reads: [
      { field: "label", means: 'The aria-label, "Pagination" by default.' },
      { field: "value", means: "The current page." },
      { field: "min, max", means: "1 and the page count." },
    ],
    actions: [
      { call: "setValue(12)", does: "Goes to a page." },
      { call: "increment(1)", does: "Goes forward a page, or as many as given." },
      { call: "decrement(1)", does: "Goes back a page, or as many as given." },
    ],
    refusal:
      "An agent's change runs through onPageChange like anyone's. isAgentChange(details) is true for it; details.cancel() refuses it. A page past either end is refused with the range, and a value or step that is not a whole number is refused too.",
    example: `await agent.act({
  steps: [{ ref: "Orders", action: "setValue", args: [12] }],
})`,
  },

  keyboard: [
    { keys: ["Tab"], does: "Moves through the arrows and pages" },
    { keys: ["Enter"], does: "Goes to the page typed in a jump field" },
    { keys: ["Esc"], does: "Closes a jump field without moving" },
  ],

  accessibility: [
    'A `<nav>` landmark, named "Pagination" unless you name it.',
    'The current page has `aria-current="page"`, and every page is named, such as Page 6.',
    "The arrows are named Previous page and Next page, and are disabled at either end.",
    "A jump returns focus to the new current page, and Esc to the gap it came from.",
    "An arrow that disables at the first or last page hands focus to that page.",
  ],
} satisfies ComponentDoc;
