import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile_id, link_id, event_type } = body;

    if (!profile_id || !event_type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
