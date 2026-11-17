import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "card",
  description: "A bordered surface grouping a heading, content and actions.",
  usage: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UsageCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Requests this billing period.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">12,480</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">View details</Button>
      </CardFooter>
    </Card>
  )
}`,
  anatomy: `<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>`,

  examples: ["card-footer", "card-default", "card-variations", "card-interactive"],

  parts: [
    {
      name: "Card",
      summary: "The bordered, rounded surface.",
      props: [{ name: "className", type: "string", description: "Merged over the card classes." }],
    },
    {
      name: "CardHeader",
      summary: "Stacks title and description, padded.",
      props: [],
    },
    {
      name: "CardTitle",
      summary: "The heading, rendered as an `h3`.",
      props: [{ name: "children", type: "ReactNode", description: "The title text." }],
    },
    {
      name: "CardDescription",
      summary: "Muted text under the title.",
      props: [],
    },
    {
      name: "CardContent",
      summary: "The body, without top padding.",
      props: [],
    },
    {
      name: "CardFooter",
      summary: "A vertically centred flex row for actions.",
      props: [],
    },
  ],

  notes: [
    {
      title: "Heading level",
      body: "`CardTitle` is always an `h3`. To change it, edit the copied file or put your own heading in `CardHeader`.",
    },
    {
      title: "Spacing",
      body: "Every part is a padded div and any can be left out. `CardContent` and `CardFooter` have no top padding; add `pt-6` when one comes first.",
    },
    {
      title: "Agents",
      body: "- Not registered with the agent bridge.\n- Inside an [`AgentProvider`](/docs/components/agent), `data-agent-in=\"Billing\"` on a Card names the container its controls are listed `in`.\n- An action attached to a card through `useAgentAction` is listed as a `region`, named by its `aria-label` or else its first heading, the `CardTitle`.",
    },
  ],

  accessibility: [
    "Card has no role; its CardTitle heading gives it structure.",
    "For a clickable card, put the link or button on the title.",
  ],
} satisfies ComponentDoc;
