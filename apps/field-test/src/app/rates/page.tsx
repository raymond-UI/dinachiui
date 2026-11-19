import type { Metadata } from "next";
import { Rates } from "./rates";

export const metadata: Metadata = { title: "Rates" };

export default function Page() {
  return <Rates />;
}
