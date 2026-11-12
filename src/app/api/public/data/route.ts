import { NextResponse } from "next/server";
import { fetchPublicSiteBundle } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const bundle = await fetchPublicSiteBundle();
  return NextResponse.json(bundle, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
