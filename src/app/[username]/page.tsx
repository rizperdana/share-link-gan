import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio")
    .eq("username", username)
    .single();

  if (!profile) {
    return { title: "User Not Found" };
  }

  return {
    title: `${profile.display_name || username} — Share Link Gan`,
    description:
      profile.bio || `Check out ${profile.display_name || username}'s links`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <ProfileClient profile={profile} links={links || []} posts={posts || []} />
  );
}
