"use client";

import type { Profile, Link as LinkType, Post, Product } from "@/lib/types";
import { IconLink, IconFileText, IconShoppingBag, IconHeart, IconArrowRight } from "@/components/Icons";
import { useState } from "react";
import { getThemeFont, FONT_MAP, GOOGLE_FONTS_URL } from "@/lib/themes";

export default function MobilePreview({
  profile,
  links,
  posts = [],
  products = [],
}: {
  profile: Profile;
  links: LinkType[];
  posts?: Post[];
  products?: Product[];
}) {
  const [activeTab, setActiveTab] = useState<"links" | "posts" | "shop" | "support">("links");

  const initials = (profile.display_name || profile.username || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const activeLinks = links.filter(l => l.is_active);
  const publishedPosts = posts.filter(p => p.is_published);
  const activeProducts = products.filter(p => p.is_active);
  const hasPosts = publishedPosts.length > 0;
  const hasProducts = activeProducts.length > 0;
  const hasQris = !!profile.qris_image_url;
  const showTabs = hasPosts || hasProducts || hasQris;

  const themeFont = getThemeFont(profile.theme || "dark");
  const headingFont = profile.font_heading ? FONT_MAP[profile.font_heading] : themeFont;
  const bodyFont = profile.font_body ? FONT_MAP[profile.font_body] : themeFont;

  return (
    <div className="phone-frame">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      <div className="phone-notch">
        <div className="phone-notch-camera" />
        <div className="phone-notch-speaker" />
      </div>
      <div className="phone-status-bar">
        <span>9:41</span>
        <div className="phone-status-right">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" /></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" /></svg>
        </div>
      </div>
      <div className="phone-content" data-theme={profile.theme || "dark"} style={{
        fontFamily: bodyFont,
        backgroundImage: profile.bg_image_url ? `url(${profile.bg_image_url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
        {profile.bg_image_url && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 0 }} />
        )}
        {/* Avatar */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", flex: 1 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "var(--accent-gradient, var(--purple))",
          display: "flex", alignItems: "center", justifyContent: "center", color: "white",
          fontSize: "1.2rem", fontWeight: 700, overflow: "hidden", marginBottom: 8, flexShrink: 0
        }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            initials
          )}
        </div>

        {/* Name */}
        <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 2, textAlign: "center", fontFamily: headingFont }}>
          {profile.display_name || profile.username}
        </div>
        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 4, textAlign: "center" }}>
          @{profile.username}
        </div>
        {profile.bio && (
          <div style={{ fontSize: "0.6rem", color: "var(--text-secondary)", marginBottom: 12, textAlign: "center", maxWidth: 220, lineHeight: 1.4 }}>
            {profile.bio.slice(0, 80)}{profile.bio.length > 80 ? "..." : ""}
          </div>
        )}

        {/* Tabs */}
        {showTabs && (
          <div style={{
            display: "flex", gap: 2, marginBottom: 10, background: "var(--bg-card)", borderRadius: 100,
            padding: 2, border: "1px solid var(--border-color)", width: "100%", overflow: "hidden"
          }}>
            <button
              onClick={() => setActiveTab("links")}
              style={{
                flex: 1, border: "none", padding: "5px 6px", borderRadius: 100, cursor: "pointer",
                fontSize: "0.55rem", fontWeight: 600, fontFamily: "inherit",
                background: activeTab === "links" ? "var(--accent)" : "transparent",
                color: activeTab === "links" ? "white" : "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 2, transition: "all 0.2s"
              }}
            >
              <IconLink size={8} />
            </button>
            {hasPosts && (
              <button
                onClick={() => setActiveTab("posts")}
                style={{
                  flex: 1, border: "none", padding: "5px 6px", borderRadius: 100, cursor: "pointer",
                  fontSize: "0.55rem", fontWeight: 600, fontFamily: "inherit",
                  background: activeTab === "posts" ? "var(--accent)" : "transparent",
                  color: activeTab === "posts" ? "white" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 2, transition: "all 0.2s"
                }}
              >
                <IconFileText size={8} />
              </button>
            )}
            {hasProducts && (
              <button
                onClick={() => setActiveTab("shop")}
                style={{
                  flex: 1, border: "none", padding: "5px 6px", borderRadius: 100, cursor: "pointer",
                  fontSize: "0.55rem", fontWeight: 600, fontFamily: "inherit",
                  background: activeTab === "shop" ? "var(--accent)" : "transparent",
                  color: activeTab === "shop" ? "white" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 2, transition: "all 0.2s"
                }}
              >
                <IconShoppingBag size={8} />
              </button>
            )}
            {hasQris && (
              <button
                onClick={() => setActiveTab("support")}
                style={{
                  flex: 1, border: "none", padding: "5px 6px", borderRadius: 100, cursor: "pointer",
                  fontSize: "0.55rem", fontWeight: 600, fontFamily: "inherit",
                  background: activeTab === "support" ? "var(--accent)" : "transparent",
                  color: activeTab === "support" ? "white" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 2, transition: "all 0.2s"
                }}
              >
                <IconHeart size={8} />
              </button>
            )}
          </div>
        )}

        {/* Links */}
        {activeTab === "links" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
            {activeLinks.map((link) => (
              <div key={link.id} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 100, fontSize: "0.65rem", fontWeight: 600, transition: "all 0.2s"
              }}>
                <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title}</span>
                <IconArrowRight size={8} />
              </div>
            ))}
            {activeLinks.length === 0 && (
              <div style={{ textAlign: "center", fontSize: "0.6rem", color: "var(--text-muted)", padding: 24 }}>
                No links yet
              </div>
            )}
          </div>
        )}

        {/* Posts */}
        {activeTab === "posts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
            {publishedPosts.slice(0, 3).map((post) => (
              <div key={post.id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 8, padding: "8px 10px", overflow: "hidden"
              }}>
                <div style={{ fontWeight: 600, fontSize: "0.65rem", marginBottom: 2 }}>{post.title}</div>
                {post.body && (
                  <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {post.body.replace(/<[^>]+>/g, "").slice(0, 60)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Shop */}
        {activeTab === "shop" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, width: "100%" }}>
            {activeProducts.slice(0, 4).map((prod) => (
              <div key={prod.id} style={{
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 8, overflow: "hidden"
              }}>
                {prod.image_url && (
                  <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                    <img src={prod.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.55rem", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{prod.title}</div>
                  <div style={{ fontWeight: 700, fontSize: "0.6rem", color: "var(--green)" }}>Rp {prod.price.toLocaleString("id-ID")}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* QRIS */}
        {activeTab === "support" && hasQris && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ background: "white", padding: 8, borderRadius: 8, display: "inline-block" }}>
              <img src={profile.qris_image_url!} alt="QRIS" style={{ width: 120, height: "auto" }} />
            </div>
            <div style={{ fontSize: "0.5rem", color: "var(--text-muted)", marginTop: 4 }}>Scan to pay</div>
          </div>
        )}

        {/* Footer */}
        {!profile.hide_branding && (
          <div style={{ marginTop: "auto", paddingTop: 16, fontSize: "0.5rem", color: "var(--text-muted)", textAlign: "center" }}>
            Share Link Gan
          </div>
        )}
        </div>{/* end z-index wrapper */}
      </div>
    </div>
  );
}
