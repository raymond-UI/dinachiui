import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { MdxLink } from "@/components/mdx/MdxLink";
import { H2, H3, H4 } from "@/components/mdx/Heading";
import { Steps, Step } from "@/components/mdx/Steps";
import {
  MdxTabs,
  MdxTabList,
  MdxTabTrigger,
  MdxTabContent,
} from "@/components/mdx/Tabs";
import {
  MdxTable,
  MdxTableHead,
  MdxTableBody,
  MdxTableRow,
  MdxTableCell,
} from "@/components/mdx/Table";
import { MdxCollapsible } from "@/components/mdx/Collapsible";
import { ComponentPreview } from "@/components/mdx/ComponentPreview";
import { PropsTable } from "@/components/mdx/PropsTable";
import { InstallCommand } from "@/components/mdx/InstallCommand";
import { InstallTabs } from "@/components/mdx/InstallTabs";
import { DocCard, DocCardGrid } from "@/components/mdx/DocCard";
import { ComparisonGrid } from "@/components/mdx/ComparisonGrid";
import { ColorSwatch, ColorGrid } from "@/components/mdx/ColorSwatch";
import { PackageManagerTabs } from "@/components/mdx/PackageManagerTabs";

function MdxTh({ children }: { children: ReactNode }) {
  return <MdxTableCell header>{children}</MdxTableCell>;
}

// Preflight strips margins from p/ul/ol and markers from lists, and nothing puts them
// back, so prose runs together and bullets render as bare lines.
function MdxP({ children }: { children: ReactNode }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>;
}

function MdxUl({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 ml-6 list-disc space-y-2 marker:text-muted-foreground/50">
      {children}
    </ul>
  );
}

function MdxOl({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-4 ml-6 list-decimal space-y-2 marker:text-muted-foreground">
      {children}
    </ol>
  );
}

function MdxLi({ children }: { children: ReactNode }) {
  return <li className="pl-1.5 leading-7">{children}</li>;
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  pre: CodeBlock,
  p: MdxP,
  ul: MdxUl,
  ol: MdxOl,
  li: MdxLi,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  hr: () => <hr className="my-10 border-border" />,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mt-4 border-l-2 border-border pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  h2: H2,
  h3: H3,
  h4: H4,
  // Markdown tables → styled components
  table: MdxTable,
  thead: MdxTableHead,
  tbody: MdxTableBody,
  tr: MdxTableRow,
  td: MdxTableCell,
  th: MdxTh,
  Callout,
  Steps,
  Step,
  Tabs: MdxTabs,
  TabList: MdxTabList,
  TabTrigger: MdxTabTrigger,
  TabContent: MdxTabContent,
  Table: MdxTable,
  TableHead: MdxTableHead,
  TableBody: MdxTableBody,
  TableRow: MdxTableRow,
  TableCell: MdxTableCell,
  Collapsible: MdxCollapsible,
  ComponentPreview,
  PropsTable,
  InstallCommand,
  InstallTabs,
  DocCard,
  DocCardGrid,
  ComparisonGrid,
  ColorSwatch,
  ColorGrid,
  PackageManagerTabs,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
