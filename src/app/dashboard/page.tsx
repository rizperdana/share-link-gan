"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile, Link as LinkType } from "@/lib/types";
import MobilePreview from "@/components/MobilePreview";
import ImageUpload from "@/components/ImageUpload";
import DragDropLinks from "@/components/DragDropLinks";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import PostsTab from "@/components/dashboard/PostsTab";
import SubscribersTab from "@/components/dashboard/SubscribersTab";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modal and Tab states
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "settings" | "analytics" | "posts" | "subscribers">("links");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  // Form states
  const [linkForm, setLinkForm] = useState({
    title: "",
    url: "",
    icon: "🔗",
    image_url: "",
    scheduled_start: "",
    scheduled_end: "",
    tags: "" as string,
    is_private: false,
    private_pin: "",
  });
  const [profileForm, setProfileForm] = useState({
    username: "",
    display_name: "",
    bio: "",
    avatar_url: "",
    theme: "dark",
    social_links: {} as Record<string, string>,
    hide_branding: false,
    custom_footer_text: "",
    custom_footer_url: "",
    is_sensitive: false,
    enable_subscribers: false,
  });
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      console.log("fetchData started");
      const { data, error: authError } = await supabase.auth.getUser();
      console.log("getUser finished:", { data, authError });

      const user = data?.user;

      if (!user) {
        console.log("No user, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("Getting profile for:", user?.id);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id || "")
        .single();

      console.log("Profile fetch result:", { profileData, profileError });

      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          username: profileData.username || "",
          display_name: profileData.display_name || "",
          bio: profileData.bio || "",
          avatar_url: profileData.avatar_url || "",
          theme: profileData.theme || "dark",
          social_links: profileData.social_links || {},
          hide_branding: profileData.hide_branding || false,
          custom_footer_text: profileData.custom_footer_text || "",
          custom_footer_url: profileData.custom_footer_url || "",
          is_sensitive: profileData.is_sensitive || false,
          enable_subscribers: profileData.enable_subscribers || false,
        });
      } else {
        // Auto-provision if profile is missing
        console.log("Profile missing, auto-provisioning");
        const emailPrefix =
          user?.email?.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "") || "user";
        const randomSuffix = Math.floor(Math.random() * 10000);
        const generatedUsername = `${emailPrefix}_${randomSuffix}`;

        const newProfile = {
          id: user?.id || "",
          username: generatedUsername,
          display_name: user?.user_metadata?.full_name || "",
          avatar_url: user?.user_metadata?.avatar_url || "",
        };

        const { error: insertError } = await supabase
          .from("profiles")
          .insert(newProfile);

        if (insertError) {
          console.error(
            "Failed to auto-provision profile:",
            insertError.message,
            insertError.code,
            insertError.details,
          );
          setFatalError(
            `Failed to create your profile: ${insertError.message} (Code: ${insertError.code})`,
          );
          setLoading(false);
          return;
        } else {
          setProfile({
            ...newProfile,
            bio: null,
            created_at: new Date().toISOString(),
          });
          setProfileForm({
            username: newProfile.username,
            display_name: newProfile.display_name,
            bio: "",
            avatar_url: newProfile.avatar_url,
            theme: "dark",
            social_links: {},
            hide_branding: false,
            custom_footer_text: "",
            custom_footer_url: "",
            is_sensitive: false,
            enable_subscribers: false,
          });
        }
      }

      console.log("Getting links for:", user?.id);
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user?.id || "")
        .order("sort_order", { ascending: true });

      if (linksError) {
        console.error("Failed to fetch links:", linksError);
      }

      console.log("Links found:", linksData?.length);
      if (linksData) setLinks(linksData);
      setLoading(false);
    } catch (err: any) {
      console.error("CRASH IN FETCHDATA:", err);
      setFatalError(err.message || String(err));
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Link CRUD ---

  const openAddLink = () => {
    setEditingLink(null);
    setLinkForm({
      title: "",
      url: "",
      icon: "🔗",
      image_url: "",
      scheduled_start: "",
      scheduled_end: "",
      tags: "",
      is_private: false,
      private_pin: "",
    });
    setShowLinkModal(true);
  };

  const openEditLink = (link: LinkType) => {
    setEditingLink(link);
    setLinkForm({
      title: link.title,
      url: link.url,
      icon: link.icon,
      image_url: link.image_url || "",
      scheduled_start: link.scheduled_start
        ? new Date(link.scheduled_start).toISOString().slice(0, 16)
        : "",
      scheduled_end: link.scheduled_end
        ? new Date(link.scheduled_end).toISOString().slice(0, 16)
        : "",
      tags: (link.tags || []).join(", "),
      is_private: link.is_private || false,
      private_pin: link.private_pin || "",
    });
    setShowLinkModal(true);
  };

  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let url = linkForm.url;
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const tagsArray = linkForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const linkData = {
      title: linkForm.title,
      url,
      icon: linkForm.icon,
      image_url: linkForm.image_url,
      scheduled_start: linkForm.scheduled_start
        ? new Date(linkForm.scheduled_start).toISOString()
        : null,
      scheduled_end: linkForm.scheduled_end
        ? new Date(linkForm.scheduled_end).toISOString()
        : null,
      tags: tagsArray,
      is_private: linkForm.is_private,
      private_pin: linkForm.is_private ? linkForm.private_pin : null,
    };

    if (editingLink) {
      const { error } = await supabase
        .from("links")
        .update(linkData)
        .eq("id", editingLink?.id || "");

      if (error) {
        showMessage("error", error.message);
      } else {
        showMessage("success", "Link updated!");
      }
    } else {
      const maxOrder =
        links.length > 0 ? Math.max(...links.map((l) => l.sort_order)) + 1 : 0;
      const { error } = await supabase.from("links").insert({
        user_id: profile?.id || "",
        ...linkData,
        sort_order: maxOrder,
      });

      if (error) {
        showMessage("error", error.message);
      } else {
        showMessage("success", "Link added!");
      }
    }

    setSaving(false);
    setShowLinkModal(false);
    fetchData();
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Delete this link?")) return;

    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) {
      showMessage("error", error.message);
    } else {
      showMessage("success", "Link deleted!");
      fetchData();
    }
  };

  const toggleLink = async (link: LinkType) => {
    const { error } = await supabase
      .from("links")
      .update({ is_active: !link.is_active })
      .eq("id", link?.id || "");

    if (error) {
      showMessage("error", error.message);
    } else {
      fetchData();
    }
  };

  const handleReorder = async (reordered: LinkType[]) => {
    setLinks(reordered);
    // Persist new sort orders
    for (const link of reordered) {
      await supabase
        .from("links")
        .update({ sort_order: link.sort_order })
        .eq("id", link.id);
    }
  };

  // --- Profile ---

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profileForm.username.toLowerCase(),
        display_name: profileForm.display_name,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        theme: profileForm.theme,
        social_links: profileForm.social_links,
        hide_branding: profileForm.hide_branding,
        custom_footer_text: profileForm.custom_footer_text || null,
        custom_footer_url: profileForm.custom_footer_url || null,
        is_sensitive: profileForm.is_sensitive,
        enable_subscribers: profileForm.enable_subscribers,
      })
      .eq("id", profile?.id || "");

    if (error) {
      showMessage("error", error.message);
    } else {
      showMessage("success", "Profile updated!");
    }

    setSaving(false);
    fetchData();
  };

  // --- Auth ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (fatalError) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "var(--danger)", marginBottom: "1rem" }}>
            Dashboard Error
          </h2>
          <p style={{ marginBottom: "1.5rem", color: "var(--gray-500)" }}>
            {fatalError}
          </p>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout & Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--gray-50)",
        }}
      >
        <div
          className="spinner"
          style={{
            borderColor: "var(--gray-300)",
            borderTopColor: "var(--purple)",
            width: 32,
            height: 32,
          }}
        />
      </div>
    );
  }

  const openProfileForm = () => {
    setProfileForm({
      username: profile?.username || "",
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
      avatar_url: profile?.avatar_url || "",
      theme: profile?.theme || "dark",
      social_links: profile?.social_links || {},
      hide_branding: profile?.hide_branding || false,
      custom_footer_text: profile?.custom_footer_text || "",
      custom_footer_url: profile?.custom_footer_url || "",
      is_sensitive: profile?.is_sensitive || false,
      enable_subscribers: profile?.enable_subscribers || false,
    });
  };

  const handleTabChange = (tab: "links" | "appearance" | "settings" | "analytics" | "posts" | "subscribers") => {
    setActiveTab(tab);
    if (tab === "appearance" || tab === "settings") {
      openProfileForm();
    }
  };

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <div className="dash-topbar">
        <div className="dash-topbar-logo">ShareLinkGan</div>
        <div className="dash-topbar-actions">
          {profile && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              View my page →
            </a>
          )}
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dash-layout">
        {/* Sidebar Navigation */}
        <nav className="dash-sidebar">
          <div className="dash-sidebar-profile">
            <div className="dash-sidebar-avatar">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" />
              ) : (
                <span>{(profile?.display_name || profile?.username || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="dash-sidebar-info">
              <span className="dash-sidebar-name">{profile?.display_name || profile?.username}</span>
              <a
                href={`/${profile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="dash-sidebar-link"
              >
                sharelinkgan.com/{profile?.username}
              </a>
            </div>
          </div>

          <div className="dash-sidebar-nav">
            <div className="dash-sidebar-group">
              <button className={`dash-nav-item ${activeTab === "links" ? "active" : ""}`} onClick={() => handleTabChange("links")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <span>Links</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "appearance" ? "active" : ""}`} onClick={() => handleTabChange("appearance")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                <span>Appearance</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => handleTabChange("settings")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>Settings</span>
              </button>

              <div className="dash-sidebar-divider" />

              <button className={`dash-nav-item ${activeTab === "analytics" ? "active" : ""}`} onClick={() => handleTabChange("analytics")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span>Analytics</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "posts" ? "active" : ""}`} onClick={() => handleTabChange("posts")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span>Posts</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "subscribers" ? "active" : ""}`} onClick={() => handleTabChange("subscribers")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Subscribers</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="dash-main">
          {/* Messages */}
          {message && (
            <div className={`alert alert-${message.type}`} style={{ marginBottom: 24 }}>{message.text}</div>
          )}

          {activeTab === "links" && (
            <div className="animate-fade-in-up">
              <div className="dash-profile-header">
                <ImageUpload
                  currentUrl={profileForm.avatar_url}
                  onUpload={(url) => {
                    setProfileForm({ ...profileForm, avatar_url: url });
                    const saveAvatar = async () => {
                      const { data: { user } } = await supabase.auth.getUser();
                      if (user) {
                        await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
                        fetchData();
                      }
                    };
                    saveAvatar();
                  }}
                  bucket="avatars"
                  folder="profile"
                  shape="circle"
                  size={80}
                  label="Avatar"
                />
                <div className="dash-profile-info">
                  <h2>{profile?.display_name || profile?.username}</h2>
                  <p>sharelinkgan.com/{profile?.username}</p>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <button className="btn btn-primary" onClick={openAddLink} style={{ width: "100%", padding: "16px", borderRadius: "100px", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add new link
                </button>
              </div>

              {links.length === 0 ? (
                <div className="dash-card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--gray-400)" }}>
                  <p style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📎</p>
                  <p style={{ fontSize: "1rem" }}>Show the world who you are. Add a link to get started.</p>
                </div>
              ) : (
                <DragDropLinks
                  links={links}
                  onReorder={handleReorder}
                  onEdit={openEditLink}
                  onDelete={deleteLink}
                  onToggle={toggleLink}
                />
              )}
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="animate-fade-in-up">
              <div className="dashboard-header">
                <h1>Appearance</h1>
              </div>
              <form onSubmit={saveProfile}>
                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Profile</h2>
                  <div className="form-group-flex">
                    <div style={{ marginRight: 24 }}>
                      <ImageUpload
                        currentUrl={profileForm.avatar_url}
                        onUpload={(url) => setProfileForm({ ...profileForm, avatar_url: url })}
                        bucket="avatars"
                        folder="profile"
                        shape="circle"
                        size={96}
                        label="Pick an image"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="profile-display-name">Profile Title</label>
                        <input
                          id="profile-display-name"
                          type="text"
                          className="form-input"
                          placeholder="Your name"
                          value={profileForm.display_name}
                          onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="profile-bio">Bio</label>
                        <textarea
                          id="profile-bio"
                          className="form-input"
                          placeholder="Tell something about yourself..."
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                          rows={3}
                          style={{ resize: "vertical" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Themes</h2>
                  <div className="theme-grid">
                    {[
                      { value: "dark", label: "Dark", bg: "#1a1a2e", bar1: "#e94560", bar2: "#0f3460", bar3: "#533483" },
                      { value: "light", label: "Light", bg: "#f8f9fa", bar1: "#2d8840", bar2: "#6c63ff", bar3: "#e0e0e0" },
                      { value: "neon", label: "Neon", bg: "#0a0a14", bar1: "#00ff41", bar2: "#ff00ff", bar3: "#00d4ff" },
                      { value: "glass", label: "Glass", bg: "linear-gradient(135deg, #667eea, #764ba2)", bar1: "rgba(255,255,255,0.3)", bar2: "rgba(255,255,255,0.2)", bar3: "rgba(255,255,255,0.15)" },
                    ].map((t) => (
                      <div
                        key={t.value}
                        className={`theme-card ${profileForm.theme === t.value ? "active" : ""}`}
                        onClick={() => setProfileForm({ ...profileForm, theme: t.value })}
                      >
                        <div className="theme-card-preview" style={{ background: t.bg }}>
                          <div className="theme-card-swatch" style={{ background: t.bar1 }} />
                          <div className="theme-card-swatch" style={{ background: t.bar2 }} />
                          <div className="theme-card-swatch" style={{ background: t.bar3 }} />
                        </div>
                        <div className="theme-card-label">{t.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Social Links</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-social-twitter">Twitter / X</label>
                    <input
                      id="profile-social-twitter"
                      type="text"
                      className="form-input"
                      placeholder="https://twitter.com/yourname"
                      value={profileForm.social_links?.twitter || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, twitter: e.target.value } })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-social-instagram">Instagram</label>
                    <input
                      id="profile-social-instagram"
                      type="text"
                      className="form-input"
                      placeholder="https://instagram.com/yourname"
                      value={profileForm.social_links?.instagram || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, instagram: e.target.value } })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-social-github">GitHub</label>
                    <input
                      id="profile-social-github"
                      type="text"
                      className="form-input"
                      placeholder="https://github.com/yourname"
                      value={profileForm.social_links?.github || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, github: e.target.value } })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="profile-social-linkedin">LinkedIn</label>
                    <input
                      id="profile-social-linkedin"
                      type="text"
                      className="form-input"
                      placeholder="https://linkedin.com/in/yourname"
                      value={profileForm.social_links?.linkedin || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, linkedin: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="sticky-save-bar">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner" /> : "Save Appearance"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-fade-in-up">
              <div className="dashboard-header">
                <h1>Settings</h1>
              </div>
              <form onSubmit={saveProfile}>
                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Branding</h2>
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={profileForm.hide_branding}
                      onChange={(e) => setProfileForm({ ...profileForm, hide_branding: e.target.checked })}
                    />
                    <span>Hide "Powered by ShareLinkGan" footer</span>
                  </label>
                </div>

                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Custom Footer</h2>
                  <div className="form-group">
                    <label className="form-label">Footer text</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Visit my website"
                      value={profileForm.custom_footer_text}
                      onChange={(e) => setProfileForm({ ...profileForm, custom_footer_text: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Footer link URL</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="https://yoursite.com"
                      value={profileForm.custom_footer_url}
                      onChange={(e) => setProfileForm({ ...profileForm, custom_footer_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Content & Subscribers</h2>
                  <div className="form-group">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={profileForm.is_sensitive}
                        onChange={(e) => setProfileForm({ ...profileForm, is_sensitive: e.target.checked })}
                      />
                      <span>🔞 Mark as sensitive / adult content</span>
                    </label>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={profileForm.enable_subscribers}
                        onChange={(e) => setProfileForm({ ...profileForm, enable_subscribers: e.target.checked })}
                      />
                      <span>Allow visitors to subscribe for updates</span>
                    </label>
                  </div>
                </div>

                <div className="sticky-save-bar">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner" /> : "Save Settings"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "posts" && <PostsTab />}
          {activeTab === "subscribers" && <SubscribersTab />}
        </div>

        {/* Preview Panel */}
        <div className="dash-preview">
          <MobilePreview profileForm={profileForm} links={links} />
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      {showLinkModal && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingLink ? "Edit Link" : "Add New Link"}</h2>
            <form onSubmit={saveLink}>
              <div className="form-group">
                <label className="form-label" htmlFor="link-icon">Icon (emoji)</label>
                <input
                  id="link-icon"
                  type="text"
                  className="form-input"
                  placeholder="🔗"
                  value={linkForm.icon}
                  onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                  maxLength={2}
                  style={{ width: "80px", fontSize: "1.5rem", textAlign: "center" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="link-title">Title</label>
                <input
                  id="link-title"
                  type="text"
                  className="form-input"
                  placeholder="My Website"
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="link-url">URL</label>
                <input
                  id="link-url"
                  type="text"
                  className="form-input"
                  placeholder="https://example.com"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thumbnail (optional)</label>
                <ImageUpload
                  currentUrl={linkForm.image_url}
                  onUpload={(url) => setLinkForm({ ...linkForm, image_url: url })}
                  bucket="avatars"
                  folder="thumbnails"
                  shape="square"
                  size={64}
                  label="Upload"
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label" htmlFor="link-tags">Tags (comma separated)</label>
                <input
                  id="link-tags"
                  type="text"
                  className="form-input"
                  placeholder="promo, social, work"
                  value={linkForm.tags}
                  onChange={(e) => setLinkForm({ ...linkForm, tags: e.target.value })}
                />
              </div>

              {/* Schedule */}
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="link-start">Show from (optional)</label>
                  <input
                    id="link-start"
                    type="datetime-local"
                    className="form-input"
                    value={linkForm.scheduled_start}
                    onChange={(e) => setLinkForm({ ...linkForm, scheduled_start: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="link-end">Hide after (optional)</label>
                  <input
                    id="link-end"
                    type="datetime-local"
                    className="form-input"
                    value={linkForm.scheduled_end}
                    onChange={(e) => setLinkForm({ ...linkForm, scheduled_end: e.target.value })}
                  />
                </div>
              </div>

              {/* Private */}
              <div className="form-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={linkForm.is_private}
                    onChange={(e) => setLinkForm({ ...linkForm, is_private: e.target.checked })}
                  />
                  <span>🔒 Private link (require PIN to unlock)</span>
                </label>
                {linkForm.is_private && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter PIN (e.g. 1234)"
                    value={linkForm.private_pin}
                    onChange={(e) => setLinkForm({ ...linkForm, private_pin: e.target.value })}
                    maxLength={10}
                    style={{ marginTop: 12 }}
                  />
                )}
              </div>
              <div className="modal-actions" style={{ marginTop: 32 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLinkModal(false)} style={{ padding: "12px 24px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: "12px 24px" }}>
                  {saving ? <span className="spinner" /> : editingLink ? "Save Changes" : "Add Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
