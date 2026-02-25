"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Link as LinkType, Post } from "@/lib/types";

function getSocialIcon(platform: string) {
  switch (platform) {
    case "twitter":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "currentColor",
            color: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {platform.charAt(0).toUpperCase()}
        </div>
      );
  }
}

export default function ProfilePageClient({
  profile,
  links: initialLinks,
  posts,
}: {
  profile: Profile;
  links: LinkType[];
  posts: Post[];
}) {
  const supabase = createClient();
  const [showSensitive, setShowSensitive] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinLinkId, setPinLinkId] = useState<string | null>(null);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState("");

  // Filter links: active + schedule
  const now = new Date();
  const visibleLinks = initialLinks.filter((link) => {
    if (!link.is_active) return false;
    if (link.scheduled_start && new Date(link.scheduled_start) > now)
      return false;
    if (link.scheduled_end && new Date(link.scheduled_end) < now) return false;
    return true;
  });

  // Track page view
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profile.id, event_type: "page_view" }),
    }).catch(() => {});
  }, [profile.id]);

  const handleLinkClick = (link: LinkType) => {
    // Track click
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile_id: profile.id,
        link_id: link.id,
        event_type: "link_click",
      }),
    }).catch(() => {});

    // If private, prompt PIN
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
      setSubStatus("Subscribed! ✅");
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
        <h2>⚠️ Sensitive Content</h2>
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

  return (
    <div className="profile-page" data-theme={profile.theme || "dark"}>
      <div className="profile-container">
        {/* Avatar */}
        <div className="profile-avatar animate-fade-in-up">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
            />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div
          className="profile-info animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="profile-name">
            {profile.display_name || profile.username}
          </h1>
          <p className="profile-username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}

          {profile.social_links &&
            Object.keys(profile.social_links).length > 0 && (
              <div className="social-links">
                {Object.entries(profile.social_links).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={platform}
                      href={url as string}
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

        {/* Links */}
        <div className="profile-links">
          {visibleLinks.length > 0 ? (
            visibleLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="profile-link-card"
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                {link.is_private && <span className="link-badge">🔒</span>}
                {link.image_url ? (
                  <img
                    src={link.image_url}
                    alt=""
                    className="profile-link-thumbnail"
                  />
                ) : (
                  <span className="profile-link-icon">{link.icon}</span>
                )}
                <span className="profile-link-title">{link.title}</span>
                <span className="profile-link-arrow">→</span>
              </button>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "var(--space-2xl)",
              }}
            >
              <p>No links yet.</p>
            </div>
          )}
        </div>

        {/* Subscribe */}
        {profile.enable_subscribers && (
          <div
            className="profile-subscribe animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {!showSubscribe ? (
              <button
                className="btn btn-outline"
                onClick={() => setShowSubscribe(true)}
                style={{ width: "100%" }}
              >
                🔔 Subscribe for updates
              </button>
            ) : (
              <div className="subscribe-form">
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <button className="btn btn-primary" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>
            )}
            {subStatus && (
              <p
                style={{
                  fontSize: "0.85rem",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                {subStatus}
              </p>
            )}
          </div>
        )}

        {/* Posts */}
        {posts.length > 0 && (
          <div
            className="profile-posts animate-fade-in"
            style={{ animationDelay: "0.35s" }}
          >
            {posts.map((post) => (
              <div key={post.id} className="profile-post-card">
                <h3>{post.title}</h3>
                {post.body && <p>{post.body}</p>}
                {post.image_url && <img src={post.image_url} alt="" />}
                <span
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.5,
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="profile-footer animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
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

      {/* PIN Modal */}
      {pinLinkId && (
        <div className="modal-overlay" onClick={() => setPinLinkId(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 360 }}
          >
            <h2>🔒 Private Link</h2>
            <p style={{ color: "var(--gray-500)", marginBottom: 16 }}>
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
              <button
                className="btn btn-secondary"
                onClick={() => setPinLinkId(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePinSubmit}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
