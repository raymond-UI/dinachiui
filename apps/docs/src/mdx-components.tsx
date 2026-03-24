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

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  pre: CodeBlock,
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
