import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "button",
  description: "Starts an action, for people and agents.",
  usage: `import { Button } from "@/components/ui/button"

export function SaveButton() {
  return <Button onClick={() => save()}>Save changes</Button>
}`,

  examples: ["button-variants", "button-default", "button-sizes", "button-icon", "button-icon-tooltip"],

  parts: [
    {
      name: "Button",
      summary: "Base UI's button with the Dinachi variants.",
      props: [
        {
          name: "variant",
          type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
          default: '"default"',
          description: "The visual style.",
        },
        {
          name: "size",
          type: '"default" | "sm" | "lg" | "icon"',
          default: '"default"',
          description: "Height and padding. `icon` is square, for a single icon.",
        },
        {
          name: "render",
          type: "ReactElement | (props, state) => ReactElement",
          description: "Swap the element, keep the behaviour.",
        },
        {
          name: "nativeButton",
          type: "boolean",
          default: "true, or false with render",
          description: "Whether the rendered element is a real `<button>`. Set true when `render` is a button.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Blocks clicks and agent presses.",
          agent: true,
        },
        {
          name: "focusableWhenDisabled",
          type: "boolean",
          default: "false",
          description: "Keeps a disabled button in the tab order, for loading states.",
        },
        {
          name: "type",
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          description: 'Pass `"submit"` to submit the form.',
        },
        { name: "className", type: "string", description: "Merged over the variant classes." },
      ],
    },
  ],

  notes: [
    {
      title: "Submitting a form",
      body: 'Unlike a native `<button>`, Button does not submit by default. Pass `type="submit"`.',
    },
    {
      title: "Rendering another element",
      body: "- With `render`, `nativeButton` defaults to false and the element gets `role=\"button\"` and keyboard handling.\n- Pass `nativeButton` when `render` is itself a `<button>`, such as another component's trigger.\n- For a link, style an `<a>` with `buttonVariants()`. Rendered through Button, it is announced as a button.",
    },
    {
      title: "Loading states",
      body: "Pair `disabled` with `focusableWhenDisabled` to keep focus on the button. If its text changes, point `aria-labelledby` at the text so the change is announced.",
    },
    {
      title: "Agents",
      body: "- Not registered with the agent bridge. Inside an [`AgentProvider`](/docs/components/agent) it is read from the page as a `button`, named by its text or `aria-label`, and takes `press`.\n- A disabled button refuses.\n- Set `data-agent-confirm` to a reason to require approval for each press.",
    },
  ],

  keyboard: [{ keys: ["Enter", "Space"], does: "Activates the button" }],

  accessibility: [
    "A native button, or role=\"button\" when nativeButton is false.",
    "Name an icon-only button with aria-label; a tooltip does not name it. The agent reads the same name.",
    "A disabled button leaves the tab order unless focusableWhenDisabled is set.",
    "Reduced motion turns off the press animation.",
  ],
} satisfies ComponentDoc;
