import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { defineCatalog, buildUserPrompt } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import {
  dinachiComponentDefinitions,
  dinachiActionDefinitions,
} from "@/lib/json-render/catalog";

const catalog = defineCatalog(schema, {
  components: dinachiComponentDefinitions,
  actions: dinachiActionDefinitions,
});

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = openrouter(
  process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4-20250514",
);

const SYSTEM_PROMPT = catalog.prompt({
  customRules: [
    // Layout & spacing
    "Always wrap the root in a Box with padding='lg' for proper spacing",
    "Use gap scale consistently: xs=tight pairs (icon+label), sm=related items (form fields), md=standard groups, lg=major sections",
    "Use direction='row' for: metric cards, button groups, avatar+text, badge rows. Use direction='column' (default) for everything else",
    "Never nest more than 3 levels of containers — keep layouts flat and scannable",

    // Typography & visual hierarchy
    "One Text variant='h2' per page as the main title. Use h3 for section/card titles, h4 for sub-sections. Never skip heading levels",
    "Use variant='lead' for introductory paragraphs directly after the page heading",
    "Use variant='muted' for helper text, timestamps, secondary info, and descriptions below headings",
    "Pair a heading with a muted description using Box(gap='xs') — never leave headings floating alone",

    // Button hierarchy — one primary CTA per visible section
    "Button variant='default' = primary CTA (solid, bold — limit to ONE per section). variant='outline' or 'secondary' = secondary actions. variant='ghost' = tertiary/cancel/dismiss. variant='destructive' = dangerous actions (always pair with a confirmation dialog). variant='link' = navigation only",
    "Place action buttons in Box(direction='row', gap='sm', justify='end'). Put the primary action last (rightmost)",

    // Badge semantics
    "Badge variant='success' = active/complete/approved. 'warning' = pending/needs attention. 'destructive' = error/blocked/critical. 'info' = neutral information. 'secondary' = low-emphasis metadata. 'outline' = counts/tags",

    // Cards & content grouping
    "Group related content in Cards — always set a title. Use description for context/subtitle. Cards are ideal for: metric displays, form sections, profile blocks, list items",
    "For metric/stat displays: use Box(direction='row', gap='md') with Cards. Each Card gets a muted label + a large h3 number + an optional Badge for change indicator",

    // Forms
    "Group related form inputs in Fieldset with legend. Use Input type matching content: email, tel, number, url, password. Always set label on inputs — never rely on placeholder alone",
    "End forms with Box(direction='row', gap='sm', justify='end') containing a ghost/outline Cancel + default Submit button",

    // Component selection guidance
    "Use Tabs for mutually exclusive views (e.g., Profile/Security/Billing). Use Accordion for expandable FAQ or detail sections",
    "Use Dialog for critical confirmations and short focused forms. Use Drawer for filters, settings panels, or longer secondary content",
    "Use Separator sparingly — only between major content blocks. Prefer gap spacing over visual dividers",
    "Wrap lists longer than 5 items in ScrollArea(maxHeight='300px')",
    "Use Avatar + Text pairs for user references. Use Progress for completion tracking. Use Tooltip for non-essential help text",
  ],
});

export async function POST(request: Request) {
  const { prompt, context } = await request.json();

  const userPrompt = buildUserPrompt({
    prompt,
    state: context?.state,
  });

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    prompt: userPrompt,
    temperature: 0.5,
  });

  return result.toTextStreamResponse();
}
