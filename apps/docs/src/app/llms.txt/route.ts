import { NextResponse } from "next/server";
import { buildLlmsTxt } from "@/lib/llms-txt";

export async function GET() {
  return new NextResponse(await buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
