"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Link as LinkType, Post, Product } from "@/lib/types";
import { getThemeFont, FONT_MAP, GOOGLE_FONTS_URL } from "@/lib/themes";
import Image from "next/image";
import DOMPurify from "dompurify";
import {
  IconLock,
  IconArrowRight,
  IconWhatsapp,
  IconScan,
  IconHeart,
  IconTag,
  IconCalendar,
  IconLink,
  IconFileText,
  IconShoppingBag,
  IconExternalLink,
  IconInstagram,
  IconTiktok,
  IconTelegram,
  IconTwitter,
  IconFacebook,
  IconYoutube,
  IconLinkedin,
} from "@/components/Icons";

function buildSocialUrl(platform: string, value: string) {
  if (value.startsWith("http")) return value;
  switch (platform) {
    case "instagram": return `https://instagram.com/${value}`;
    case "tiktok": return `https://tiktok.com/@${value}`;
    case "whatsapp": return `https://wa.me/${value.replace(/\D/g, "")}`;
    case "telegram": return `https://t.me/${value}`;
    case "twitter": return `https://x.com/${value}`;
    case "facebook": return `https://facebook.com/${value}`;
    case "youtube": return `https://youtube.com/@${value}`;
    case "linkedin": return `https://linkedin.com/in/${value}`;
    default: return value;
  }
}

function getSocialIcon(platform: string) {
  switch (platform) {
    case "twitter": return <IconTwitter size={22} />;
    case "instagram": return <IconInstagram size={22} />;
    case "linkedin": return <IconLinkedin size={22} />;
    case "tiktok": return <IconTiktok size={22} />;
    case "whatsapp": return <IconWhatsapp size={22} />;
    case "telegram": return <IconTelegram size={22} />;
    case "facebook": return <IconFacebook size={22} />;
    case "youtube": return <IconYoutube size={22} />;
    default: return <IconLink size={22} />;
  }
}

export default function ProfilePageClient({
  profile,
  links: initialLinks,
  posts,
  products,
}: {
  profile: Profile;
  links: LinkType[];
  posts: Post[];
  products: Product[];
}) {
  const supabase = createClient();
  const [showSensitive, setShowSensitive] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinLinkId, setPinLinkId] = useState<string | null>(null);
  const [pinPostId, setPinPostId] = useState<string | null>(null);
  const [unlockedPosts, setUnlockedPosts] = useState<Set<string>>(new Set());
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState("");
  const [activeTab, setActiveTab] = useState<"links" | "posts" | "shop" | "support">("links");
  const [shopCategory, setShopCategory] = useState<string>("all");

  // Filter links: active + schedule
  const now = new Date();
  const visibleLinks = initialLinks.filter((link) => {
    if (!link.is_active) return false;
    if (link.scheduled_start && new Date(link.scheduled_start) > now) return false;
    if (link.scheduled_end && new Date(link.scheduled_end) < now) return false;
    return true;
  });

  const visiblePosts = posts.filter((post) => {
    if (!post.is_published) return false;
    if (post.scheduled_start && new Date(post.scheduled_start) > now) return false;
    if (post.scheduled_end && new Date(post.scheduled_end) < now) return false;
    return true;
  });

  const activeProducts = products.filter(p => p.is_active);
  const productCategories = [...new Set(activeProducts.map(p => p.category || "general"))];
  const filteredProducts = shopCategory === "all"
    ? activeProducts
    : activeProducts.filter(p => (p.category || "general") === shopCategory);

  // Track page view
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profile.id, event_type: "page_view" }),
    }).catch(() => {});
  }, [profile.id]);

  const handleLinkClick = (link: LinkType) => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: profile.id,
        link_id: link.id,
        event_type: "link_click",
      }),
    }).catch(() => {});

    if (link.is_private && link.private_pin) {
      setPinLinkId(link.id);
      setPinInput("");
      return;
    }

    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const handlePinSubmit = () => {
    const link = visibleLinks.find((l) => l.id === pinLinkId);
    if (link && pinInput === link.private_pin) {
      window.open(link.url, "_blank", "noopener,noreferrer");
      setPinLinkId(null);
    } else {
      setPinInput("");
    }
  };

  const handlePostPinSubmit = () => {
    const post = visiblePosts.find((p) => p.id === pinPostId);
    if (post && pinInput === post.private_pin) {
      setUnlockedPosts((prev) => {
        const next = new Set(prev);
        next.add(post.id);
        return next;
      });
      setPinPostId(null);
    } else {
      setPinInput("");
    }
  };

  const handleSubscribe = async () => {
    if (!subEmail || !subEmail.includes("@")) return;
    const { error } = await supabase.from("subscribers").insert({
      profile_id: profile.id,
      email: subEmail,
    });
    if (error) {
      setSubStatus(
        error.message.includes("duplicate")
          ? "Already subscribed!"
          : error.message,
      );
    } else {
      setSubStatus("Subscribed!");
      setSubEmail("");
    }
    setTimeout(() => setSubStatus(""), 3000);
  };

  const initials = (profile.display_name || profile.username)
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Sensitive content gate
  if (profile.is_sensitive && !showSensitive) {
    return (
      <div className="sensitive-warning">
        <h2 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Sensitive Content
        </h2>
        <p>
          This profile has been marked as containing sensitive or adult
          material. You must be 18+ to proceed.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setShowSensitive(true)}
        >
          I understand, continue
        </button>
      </div>
    );
  }

  // Determine which tabs to show
  const hasPosts = visiblePosts.length > 0;
  const hasProducts = activeProducts.length > 0;
  const hasQris = !!profile.qris_image_url;
  const hasDonation = !!profile.donation_link;
  const hasSupport = hasQris || hasDonation;
  const showTabs = hasPosts || hasProducts || hasSupport;

  const themeFont = getThemeFont(profile.theme || "dark");
  const headingFont = profile.font_heading ? FONT_MAP[profile.font_heading] : themeFont;
  const bodyFont = profile.font_body ? FONT_MAP[profile.font_body] : themeFont;

  return (
    <div className="profile-page" data-theme={profile.theme || "dark"} style={{ fontFamily: bodyFont }}>
      {/* Google Fonts loader */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      {/* Animated background */}
      <div className="profile-bg-animation" />
      {/* Custom background image */}
      {profile.bg_image_url && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: `url(${profile.bg_image_url})`,
          backgroundSize: "cover", backgroundPosition: "center",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
        </div>
      )}

      <div className="profile-container">
        {/* Avatar */}
        <div className="profile-avatar profile-animate" style={{ animationDelay: "0s" }}>
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              width={96}
              height={96}
              className="profile-avatar-img"
              unoptimized
            />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div className="profile-info profile-animate" style={{ animationDelay: "0.05s" }}>
          <h1 className="profile-name" style={{ fontFamily: headingFont }}>
            {profile.display_name || profile.username}
          </h1>
          <p className="profile-username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          {profile.social_links &&
            Object.keys(profile.social_links).length > 0 && (
              <div className="social-links">
                {Object.entries(profile.social_links).map(([platform, value]) => {
                  if (!value) return null;
                  return (
                    <a
                      key={platform}
                      href={buildSocialUrl(platform, value as string)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      title={platform}
                    >
                      {getSocialIcon(platform)}
                    </a>
                  );
                })}
              </div>
            )}
        </div>

        {/* Tab Navigation */}
        {showTabs && (
          <div className="profile-tabs profile-animate" style={{ animationDelay: "0.1s" }}>
            <button
              className={`profile-tab-btn ${activeTab === "links" ? "active" : ""}`}
              onClick={() => setActiveTab("links")}
            >
              <IconLink size={16} />
              <span>Links</span>
            </button>
            {hasPosts && (
              <button
                className={`profile-tab-btn ${activeTab === "posts" ? "active" : ""}`}
                onClick={() => setActiveTab("posts")}
              >
                <IconFileText size={16} />
                <span>Posts</span>
              </button>
            )}
            {hasProducts && (
              <button
                className={`profile-tab-btn ${activeTab === "shop" ? "active" : ""}`}
                onClick={() => setActiveTab("shop")}
              >
                <IconShoppingBag size={16} />
                <span>Shop</span>
              </button>
            )}
            {hasSupport && (
              <button
                className={`profile-tab-btn ${activeTab === "support" ? "active" : ""}`}
                onClick={() => setActiveTab("support")}
              >
                <IconHeart size={16} />
                <span>Support</span>
              </button>
            )}
          </div>
        )}

        {/* Links Tab */}
        {activeTab === "links" && (
          <div className="profile-links profile-tab-content">
            {visibleLinks.length > 0 ? (
              visibleLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="profile-link-card profile-animate"
                  style={{ animationDelay: `${0.15 + index * 0.06}s` }}
                >
                  {link.is_private && (
                    <span className="link-badge">
                      <IconLock size={12} />
                    </span>
                  )}
                  {link.image_url ? (
                    <div className="profile-link-thumbnail" style={{ position: "relative", width: 40, height: 40, overflow: "hidden", borderRadius: "8px", flexShrink: 0 }}>
                      <Image
                        src={link.image_url}
                        alt={link.title}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <span className="profile-link-icon-wrap">
                      <IconLink size={18} />
                    </span>
                  )}
                  <span className="profile-link-title">{link.title}</span>
                  <span className="profile-link-arrow">
                    <IconArrowRight size={16} />
                  </span>
                </button>
              ))
            ) : (
              <div className="profile-empty-state">
                <IconLink size={32} />
                <p>No links yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="profile-posts profile-tab-content">
            {visiblePosts.map((post, index) => {
              const isLocked = post.is_private && !unlockedPosts.has(post.id);

              return (
                <div
                  key={post.id}
                  className="profile-post-card profile-animate"
                  style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                >
                  {/* Post image hero */}
                  {post.image_url && !isLocked && (
                    <div className="profile-post-image">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="profile-post-body">
                    <div className="profile-post-header">
                      <h3 className="profile-post-title">{post.title}</h3>
                      {post.is_private && isLocked && (
                        <span className="profile-post-badge">
                          <IconLock size={12} />
                          Private
                        </span>
                      )}
                    </div>

                    {isLocked ? (
                      <div className="profile-post-locked">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => { setPinPostId(post.id); setPinInput(""); }}
                          style={{ borderRadius: "100px", display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          <IconLock size={14} />
                          Enter PIN to Unlock
                        </button>
                      </div>
                    ) : (
                      <>
                        {post.body && (
                          <div
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
                            className="profile-post-content"
                          />
                        )}
                        {post.link_id && (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ width: "100%", display: "flex", justifyContent: "center", gap: "6px" }}
                            onClick={() => {
                              const l = initialLinks.find(l => l.id === post.link_id);
                              if (l) window.open(l.url, "_blank");
                            }}
                          >
                            <IconExternalLink size={14} />
                            View Attached Link
                          </button>
                        )}
                      </>
                    )}

                    <div className="profile-post-footer">
                      <span className="profile-post-date">
                        <IconCalendar size={12} />
                        {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="profile-post-tags">
                          {post.tags.map(tag => (
                            <span key={tag} className="profile-tag">
                              <IconTag size={10} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === "shop" && (
          <div className="profile-shop profile-tab-content">
            {/* Category filter */}
            {productCategories.length > 1 && (
              <div className="profile-shop-categories profile-animate" style={{ animationDelay: "0.1s" }}>
                <button
                  className={`profile-category-btn ${shopCategory === "all" ? "active" : ""}`}
                  onClick={() => setShopCategory("all")}
                >
                  All
                </button>
                {productCategories.map(cat => (
                  <button
                    key={cat}
                    className={`profile-category-btn ${shopCategory === cat ? "active" : ""}`}
                    onClick={() => setShopCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <div className="profile-shop-grid">
              {filteredProducts.map((prod, index) => (
                <div
                  key={prod.id}
                  className="profile-product-card profile-animate"
                  style={{ animationDelay: `${0.1 + index * 0.06}s` }}
                >
                  {prod.image_url && (
                    <div className="profile-product-image">
                      <Image src={prod.image_url} alt={prod.title} fill style={{ objectFit: "cover" }} unoptimized />
                    </div>
                  )}
                  <div className="profile-product-info">
                    <span className="profile-product-category">{prod.category || "general"}</span>
                    <h3 className="profile-product-title">{prod.title}</h3>
                    {prod.description && (
                      <p className="profile-product-desc">{prod.description}</p>
                    )}
                    <div className="profile-product-price">
                      Rp {prod.price.toLocaleString("id-ID")}
                    </div>
                    <div className="profile-product-actions">
                      {prod.checkout_link ? (
                        <a
                          href={prod.checkout_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          <IconExternalLink size={14} />
                          Buy Now
                        </a>
                      ) : hasQris ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setActiveTab("support")}
                          style={{ flex: 1, justifyContent: "center" }}
                        >
                          <IconScan size={14} />
                          Pay via QRIS
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support / QRIS Tab */}
        {activeTab === "support" && hasSupport && (
          <div className="profile-support profile-tab-content profile-animate" style={{ animationDelay: "0.1s" }}>
            {hasQris && (
              <div className="profile-qris-card" style={{ marginBottom: hasDonation ? 16 : 0 }}>
                <div className="profile-qris-header">
                  <IconScan size={24} />
                  <h2>Scan to Pay</h2>
                  <p>Scan this QRIS code with any e-wallet or banking app.</p>
                </div>
                <div className="profile-qris-image">
                  <img src={profile.qris_image_url!} alt="QRIS Code" />
                </div>
                <div className="profile-qris-footer">
                  <IconScan size={16} />
                  <span>GoPay · OVO · DANA · ShopeePay · Bank Transfer</span>
                </div>
              </div>
            )}
            {hasDonation && (
              <div style={{ textAlign: "center" }}>
                <a
                  href={profile.donation_link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 8, fontSize: "1rem", padding: "14px 32px" }}
                >
                  <IconHeart size={18} />
                  Send a Donation
                </a>
              </div>
            )}
          </div>
        )}

        {/* Subscribe */}
        {profile.enable_subscribers && (
          <div className="profile-subscribe profile-animate" style={{ animationDelay: "0.4s" }}>
            {showSubscribe ? (
              <div className="profile-subscribe-form">
                <input
                  type="email"
                  className="profile-subscribe-input"
                  placeholder="your@email.com"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <button className="btn btn-primary btn-sm" onClick={handleSubscribe}>
                  Subscribe
                </button>
                {subStatus && <span className="profile-subscribe-status">{subStatus}</span>}
              </div>
            ) : (
              <button
                className="btn btn-outline btn-sm profile-subscribe-trigger"
                onClick={() => setShowSubscribe(true)}
              >
                Get updates from {profile.display_name || profile.username}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="profile-footer profile-animate" style={{ animationDelay: "0.5s" }}>
          {profile.custom_footer_text ? (
            <p>
              {profile.custom_footer_url ? (
                <a
                  href={profile.custom_footer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.custom_footer_text}
                </a>
              ) : (
                profile.custom_footer_text
              )}
            </p>
          ) : !profile.hide_branding ? (
            <p>
              Powered by <a href="/">Share Link Gan</a>
            </p>
          ) : null}
        </div>
      </div>

      {/* PIN Modal for Links */}
      {pinLinkId && (
        <div className="modal-overlay" onClick={() => setPinLinkId(null)}>
          <div className="modal profile-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <IconLock size={20} />
              <h2 style={{ margin: 0 }}>Private Link</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Enter the PIN to access this link.
            </p>
            <input
              type="password"
              className="form-input"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setPinLinkId(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePinSubmit}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal for Posts */}
      {pinPostId && (
        <div className="modal-overlay" onClick={() => setPinPostId(null)}>
          <div className="modal profile-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <IconLock size={20} />
              <h2 style={{ margin: 0 }}>Private Post</h2>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>
              Enter the PIN to read this post.
            </p>
            <input
              type="password"
              className="form-input"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePostPinSubmit()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setPinPostId(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePostPinSubmit}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
