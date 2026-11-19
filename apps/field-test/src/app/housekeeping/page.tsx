import type { Metadata } from "next";
import { Housekeeping } from "./housekeeping";

export const metadata: Metadata = { title: "Housekeeping" };

export default function Page() {
  return <Housekeeping />;
}
