"use client";

import Link from "next/link";
import { CopyCommand, Reveal, Words, useInView } from "./primitives";
import { cn } from "@/lib/utils";

export function CloseSection() {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.4, once: true });
  return (
    <section className="sec close">
      <Words parts={[["Start with one command."]]} />
      <Reveal className="ctas">
        <Link className="btn" href="/docs/installation">
          Get started
        </Link>
        <CopyCommand command="npx @dinachi/cli@latest init" />
      </Reveal>
      <div ref={ref} className={cn("wordmark", seen && "in")} aria-hidden>
        {Array.from("Dinachi").map((c, i) => (
          <span key={i} style={{ transitionDelay: `${i * 55}ms` }}>
            {c}
          </span>
        ))}
      </div>
      <footer className="foot">
        <a href="https://mzed.studio">Built by Mzed Studio</a>
        <nav aria-label="Footer">
          <Link href="/docs/installation">Docs</Link>
          <Link href="/docs/components">Components</Link>
          <a href="https://github.com/raymond-UI/dinachiUI" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </footer>
    </section>
  );
}
