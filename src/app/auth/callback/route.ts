import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!error && authData.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", authData.user.id)
        .single();

      // If no profile, create one (e.g. they signed up via Google)
      if (!profile) {
        const metadata = authData.user.user_metadata;

        // Generate a random username, handling potentially existing prefixes
        const emailPrefix =
          authData.user.email?.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "") ||
          "user";
        const randomSuffix = Math.floor(Math.random() * 10000);
        const generatedUsername = `${emailPrefix}_${randomSuffix}`;

        await supabase.from("profiles").insert({
          id: authData.user.id,
          username: generatedUsername,
          display_name: metadata?.full_name || "",
          avatar_url: metadata?.avatar_url || "",
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
