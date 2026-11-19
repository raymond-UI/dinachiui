import type { Metadata } from "next";
import { Invoice } from "@/components/examples/table-examples";

// Table's stack layout answers to the viewport, so the docs stage shows it in an
// iframe this wide rather than at the page's own width.
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Search = Promise<{ density?: string; dividers?: string }>;

export default async function TableFrame({ searchParams }: { searchParams: Search }) {
  const { density, dividers } = await searchParams;
  return (
    <>
      <style>{"html,body{background:transparent}"}</style>
      <div data-frame className="px-4 py-3">
        <Invoice
          brief
          stack
          density={density === "compact" ? "compact" : "comfortable"}
          dividers={dividers === "none" ? "none" : "rows"}
        />
      </div>
    </>
  );
}
