"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  IconInstagram, IconTiktok, IconWhatsapp, IconTelegram,
  IconTwitter, IconFacebook, IconYoutube, IconLinkedin
} from "@/components/Icons";

const SOCIAL_PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: IconInstagram, placeholder: "username", prefix: "https://instagram.com/" },
  { id: "tiktok", name: "TikTok", icon: IconTiktok, placeholder: "username", prefix: "https://tiktok.com/@" },
  { id: "whatsapp", name: "WhatsApp", icon: IconWhatsapp, placeholder: "62812345678", prefix: "https://wa.me/" },
  { id: "telegram", name: "Telegram", icon: IconTelegram, placeholder: "username", prefix: "https://t.me/" },
  { id: "twitter", name: "X (Twitter)", icon: IconTwitter, placeholder: "username", prefix: "https://x.com/" },
  { id: "facebook", name: "Facebook", icon: IconFacebook, placeholder: "username", prefix: "https://facebook.com/" },
  { id: "youtube", name: "YouTube", icon: IconYoutube, placeholder: "channelname", prefix: "https://youtube.com/@" },
  { id: "linkedin", name: "LinkedIn", icon: IconLinkedin, placeholder: "username", prefix: "https://linkedin.com/in/" },
];

export default function SocialLinksTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("social_links")
      .eq("id", user.id)
      .single();

    if (profile) {
      setSocialLinks(profile.social_links || {});
    }
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Clean up empty links
    const cleanLinks: Record<string, string> = {};
    Object.keys(socialLinks).forEach(key => {
      if (socialLinks[key] && socialLinks[key].trim() !== "") {
        cleanLinks[key] = socialLinks[key].trim();
      }
    });

    const { error } = await supabase
      .from("profiles")
      .update({ social_links: cleanLinks })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: "Failed to save: " + error.message });
    } else {
      setMessage({ type: "success", text: "Social links updated!" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLinkChange = (id: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "48px" }}>
        <div className="spinner" style={{ borderColor: "var(--gray-300)", borderTopColor: "var(--purple)", width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="dashboard-header">
        <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <IconInstagram size={24} /> Social Links
        </h1>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 16 }}>
          {message.text}
        </div>
      )}

      <div className="dash-card" style={{ padding: "24px", marginBottom: "24px" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px", lineHeight: 1.6 }}>
          Add your social media profiles here. These icons will appear beautifully at the bottom of your profile page.
          Just enter your <strong>username</strong> or <strong>phone number</strong>, and we'll handle the links automatically!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {SOCIAL_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.id} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <Icon size={18} /> {platform.name}
                </label>
                  <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: 12,
                      color: "var(--text-muted)",
                      display: "flex"
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{
                      position: "absolute",
                      left: 36,
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      pointerEvents: "none",
                      userSelect: "none"
                    }}>
                      {platform.prefix}
                    </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={platform.placeholder}
                      value={socialLinks[platform.id] || ""}
                      onChange={(e) => handleLinkChange(platform.id, e.target.value.replace(platform.prefix, ""))}
                      style={{ paddingLeft: `calc(40px + ${platform.prefix.length * 7.5}px)` }}
                    />
                  </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {saving ? <span className="spinner" /> : "Save Social Links"}
      </button>

      <div style={{
        marginTop: 24,
        padding: 16,
        background: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-sm)",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        lineHeight: 1.6,
      }}>
        <strong style={{ color: "var(--text-primary)" }}>Pro-Tip:</strong>
        <ul style={{ marginTop: 8, paddingLeft: 18 }}>
          <li>For WhatsApp, use country code e.g. <code>628...</code> instead of <code>08...</code> (no + sign).</li>
          <li>For other apps, just type your exact username without the `@` symbol unless specified.</li>
          <li>We only show social icons that you have explicitly filled out.</li>
        </ul>
      </div>
    </div>
  );
}
