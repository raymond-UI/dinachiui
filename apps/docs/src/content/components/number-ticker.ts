import type { ComponentDoc } from "@/lib/component-pages/types";

export default {
  slug: "number-ticker",
  description: "A figure that rolls to its value the first time it lands.",
  usage: `import { NumberTicker } from "@/components/ui/number-ticker"

export function Total() {
  return <NumberTicker value={12480} className="text-4xl font-semibold" />
}`,

  examples: ["number-ticker-default", "number-ticker-variants", "number-ticker-format", "number-ticker-live"],

  parts: [
    {
      name: "NumberTicker",
      summary: "A span that animates to its value.",
      props: [
        { name: "value", type: "number", description: "The value to count to." },
        { name: "variant", type: "\"odometer\" | \"counter\" | \"flip\"", default: "\"odometer\"", description: "Rolling digit columns, an interpolated value, or a split-flap board." },
        { name: "from", type: "number", default: "0", description: "The value each column starts from." },
        { name: "decimals", type: "number", default: "0", description: "Decimal places to render." },
        { name: "locale", type: "string", description: "Locale for Intl.NumberFormat. Defaults to the user's locale." },
        { name: "format", type: "Intl.NumberFormatOptions", description: "Extra formatting, such as `{ style: \"currency\", currency: \"USD\" }`." },
        { name: "live", type: "boolean", default: "false", description: "Renders the figure instantly, with no roll. Use for values that change often." },
        { name: "stagger", type: "number", default: "0.03", description: "Seconds added per column, left to right; 0.03 to 0.08 works best. Ignored by `counter`." },
        { name: "duration", type: "number", default: "0.4", description: "Seconds for a column to settle." },
        { name: "bounce", type: "number", default: "0", description: "Spring overshoot, 0 to 1." },
        { name: "startOnView", type: "boolean", default: "true", description: "Counts when scrolled into view instead of on mount." },
        { name: "once", type: "boolean", default: "true", description: "Reveals only on first entering view. Later value changes still animate." },
      ],
    },
  ],

  notes: [
    {
      title: "Motion tier",
      body: "Needs [motion](https://motion.dev). `add --all` skips it; install with `add --motion` or by name.",
    },
    {
      title: "Variants",
      body: "- `odometer`: rolling digit columns. The default.\n- `counter`: when intermediate values matter, or the format is too complex to split into columns.\n- `flip`: departure boards and scoreboards.",
    },
    {
      title: "When to use it",
      body: "- A total, a result, or a stat on first paint.\n- For a value that changes more than once every few seconds, pass `live`.",
    },
    {
      title: "Behaviour",
      body: "- A carry rolls forward: 1,199 to 1,200 steps the ones column one place.\n- Columns keep their identity when digits are added or removed.\n- A value that changes mid-roll redirects without restarting.",
    },
    {
      title: "Non-Latin digits",
      body: "Locales with non-Latin digits, such as `ar-EG`, render and announce correctly but do not roll; the value updates in place.",
    },
  ],

  accessibility: [
    "Only the final formatted value is announced; moving parts are aria-hidden.",
    "Reduced motion, from the OS or `<MotionConfig reducedMotion=\"always\">`, renders the plain value.",
    "Under `<MotionConfig isStatic>` the ticker shows the real value.",
  ],
} satisfies ComponentDoc;
