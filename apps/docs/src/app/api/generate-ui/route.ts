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
    "Always wrap the root in a Box with padding='lg' for proper spacing",
    "Use consistent gap: 'sm' for tight grouping, 'md' for standard, 'lg' for sections",
    "Start with a clear heading (Text variant='h3' or 'h2')",
    "Group related content in Cards",
    "Pair primary buttons with outline/ghost cancel buttons",
    "Use Badge for status indicators (success, warning, info variants)",
    "Place action buttons in Box(direction='row', gap='sm', justify='end')",
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
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
