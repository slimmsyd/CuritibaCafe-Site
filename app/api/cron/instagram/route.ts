import { NextResponse } from "next/server";
import { syncInstagramFeed } from "@/app/lib/instagram-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/**
 * Weekly Instagram sync — called by Vercel Cron or manually:
 * curl -H "Authorization: Bearer $CRON_SECRET" https://yoursite.com/api/cron/instagram
 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncInstagramFeed();

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}