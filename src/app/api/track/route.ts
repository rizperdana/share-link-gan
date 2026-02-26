import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Simple in-memory rate limiter (per-IP, resets every minute)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // max 60 requests per minute per IP
const RATE_WINDOW = 60_000; // 1 minute in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// UUID v4 validation
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(val: unknown): val is string {
  return typeof val === "string" && UUID_RE.test(val);
}

const ALLOWED_EVENTS = new Set(["page_view", "link_click"]);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const body = await request.json();
    const { profile_id, link_id, event_type } = body;

    // Validate required fields
    if (!profile_id || !event_type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Validate UUID format
    if (!isValidUUID(profile_id)) {
      return NextResponse.json({ error: "Invalid profile_id" }, { status: 400 });
    }
    if (link_id && !isValidUUID(link_id)) {
      return NextResponse.json({ error: "Invalid link_id" }, { status: 400 });
    }

    // Whitelist event types
    if (!ALLOWED_EVENTS.has(event_type)) {
      return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
    }

    // Detect device from User-Agent
    const ua = request.headers.get("user-agent") || "";
    let device = "desktop";
    if (/mobile|android|iphone/i.test(ua)) device = "mobile";
    else if (/tablet|ipad/i.test(ua)) device = "tablet";

    const referrer = request.headers.get("referer") || null;
    const country = request.headers.get("x-vercel-ip-country") || null;

    const supabase = await createClient();

    await supabase.from("analytics_events").insert({
      profile_id,
      link_id: link_id || null,
      event_type,
      referrer,
      country,
      device,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
