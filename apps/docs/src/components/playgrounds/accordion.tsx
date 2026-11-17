"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { multiple: boolean; disabled: boolean };

const ITEMS = [
  { value: "item-1", q: "Is it accessible?", a: "Yes. It adheres to the WAI-ARIA design pattern." },
  { value: "item-2", q: "Is it styled?", a: "Yes. It comes with default styles." },
  { value: "item-3", q: "Can an agent open it?", a: "Yes. Each item is a disclosure on the agent bridge." },
];

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [value, setValue] = React.useState<unknown[]>(["item-1"]);
  React.useEffect(() => setValue(v.multiple ? ["item-1", "item-2"] : ["item-1"]), [v.multiple]);
  const shown = anatomy && value.length === 0 ? ["item-1"] : value;
  return (
    <Accordion
      aria-label="FAQ"
      className="w-full max-w-md"
      multiple={v.multiple}
      disabled={v.disabled}
      value={shown}
      onValueChange={(next, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        setValue(next);
      }}
    >
      {ITEMS.map((it) => (
        <AccordionItem key={it.value} value={it.value}>
          <AccordionHeader>
            <AccordionTrigger>{it.q}</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>{it.a}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L = [`import { Accordion, AccordionHeader, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "const faq = [");
  for (const it of ITEMS) L.push(`  { value: "${it.value}", question: "${it.q}", answer: "${it.a}" },`);
  L.push("]", "", "export function Faq() {", "  return (");
  const props = ['aria-label="FAQ"', v.multiple ? 'defaultValue={["item-1", "item-2"]}' : 'defaultValue={["item-1"]}'];
  if (v.multiple) props.push("multiple");
  if (v.disabled) props.push("disabled");
  if (refuse) {
    L.push("    <Accordion");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Accordion ${props.join(" ")}>`);
  }
  L.push(
    "      {faq.map((item) => (",
    "        <AccordionItem key={item.value} value={item.value}>",
    "          <AccordionHeader>",
    "            <AccordionTrigger>{item.question}</AccordionTrigger>",
    "          </AccordionHeader>",
    "          <AccordionPanel>{item.answer}</AccordionPanel>",
    "        </AccordionItem>",
    "      ))}",
    "    </Accordion>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "faq.tsx",
  refusable: true,
  controls: [
    { name: "multiple", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Close “Is it accessible?”", action: "close", target: "Is it accessible?" },
    { label: "Open “Is it styled?”", action: "open", target: "Is it styled?" },
  ],
  Demo,
  code,
});
