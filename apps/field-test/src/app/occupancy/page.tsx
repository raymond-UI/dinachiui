import type { Metadata } from "next";
import { Occupancy } from "./occupancy";

export const metadata: Metadata = { title: "Occupancy" };

export default function Page() {
  return <Occupancy />;
}
