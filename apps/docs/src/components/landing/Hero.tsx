"use client";

import Link from "next/link";
import { components } from "@/lib/component-metadata";
import { AgentStage } from "./AgentStage";
import { CopyCommand, Reveal, Words } from "./primitives";

export function Hero() {
  return (
    <section className="sec hero">
      <Words
        as="h1"
        parts={[
          ["Built for people.", "l1"],
          ["Ready for agents.", "l2 pixel"],
        ]}
      />
      <Reveal as="p" className="lede" delay={240}>
        {components.length} React components on Base UI. An AI agent can use them too, and a person approves anything risky.
      </Reveal>
      <Reveal className="ctas" delay={340}>
        <Link className="btn" href="/docs/installation">
          Get started
        </Link>
        <CopyCommand command="npx @dinachi/cli@latest init" />
      </Reveal>
      <AgentStage />
    </section>
  );
}
