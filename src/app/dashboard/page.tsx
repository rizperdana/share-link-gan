"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile, Link as LinkType } from "@/lib/types";
import MobilePreview from "@/components/MobilePreview";
import ImageUpload from "@/components/ImageUpload";
import DragDropLinks from "@/components/DragDropLinks";
import LinkForm from "@/components/dashboard/LinkForm";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import PostsTab from "@/components/dashboard/PostsTab";
import SubscribersTab from "@/components/dashboard/SubscribersTab";
import ShopTab from "@/components/dashboard/ShopTab";
import QrisTab from "@/components/dashboard/QrisTab";
import SocialLinksTab from "@/components/dashboard/SocialLinksTab";
import { THEMES, FONT_MAP, GOOGLE_FONTS_URL } from "@/lib/themes";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import LanguageSelector from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  const [activeTab, setActiveTab] = useState<"links" | "appearance" | "settings" | "analytics" | "posts" | "subscribers" | "shop" | "qris" | "social">("links");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  // Form states
  const [linkForm, setLinkForm] = useState({
    title: "",
    url: "",
    icon: "",
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
    qris_image_url: "",
    theme: "dark",
    social_links: {} as Record<string, string>,
    hide_branding: false,
    custom_footer_text: "",
    custom_footer_url: "",
    is_sensitive: false,
    enable_subscribers: false,
    bg_image_url: "",
    font_heading: "",
    font_body: "",
  });
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const { t } = useTranslation();

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
          qris_image_url: profileData.qris_image_url || "",
          theme: profileData.theme || "dark",
          social_links: profileData.social_links || {},
          hide_branding: profileData.hide_branding || false,
          custom_footer_text: profileData.custom_footer_text || "",
          custom_footer_url: profileData.custom_footer_url || "",
          is_sensitive: profileData.is_sensitive || false,
          enable_subscribers: profileData.enable_subscribers || false,
          bg_image_url: profileData.bg_image_url || "",
          font_heading: profileData.font_heading || "",
          font_body: profileData.font_body || "",
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
            qris_image_url: "",
            theme: "dark",
            social_links: {},
            hide_branding: false,
            custom_footer_text: "",
            custom_footer_url: "",
            is_sensitive: false,
            enable_subscribers: false,
            bg_image_url: "",
            font_heading: "",
            font_body: "",
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
    setShowLinkForm(true);
  };

  const openEditLink = (link: LinkType) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const saveLink = async (formData: any) => {
    setSaving(true);

    let url = formData.url;
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const linkData = {
      title: formData.title,
      url,
      icon: formData.icon,
      image_url: formData.image_url,
      scheduled_start: formData.scheduled_start
        ? new Date(formData.scheduled_start).toISOString()
        : null,
      scheduled_end: formData.scheduled_end
        ? new Date(formData.scheduled_end).toISOString()
        : null,
      tags: tagsArray,
      is_private: formData.is_private,
      private_pin: formData.is_private ? formData.private_pin : null,
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
    setShowLinkForm(false);
    setEditingLink(null);
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
        qris_image_url: profileForm.qris_image_url,
        theme: profileForm.theme,
        social_links: profileForm.social_links,
        hide_branding: profileForm.hide_branding,
        custom_footer_text: profileForm.custom_footer_text || null,
        custom_footer_url: profileForm.custom_footer_url || null,
        is_sensitive: profileForm.is_sensitive,
        enable_subscribers: profileForm.enable_subscribers,
        bg_image_url: profileForm.bg_image_url || null,
        font_heading: profileForm.font_heading || null,
        font_body: profileForm.font_body || null,
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
      qris_image_url: profile?.qris_image_url || "",
      theme: profile?.theme || "dark",
      social_links: profile?.social_links || {},
      hide_branding: profile?.hide_branding || false,
      custom_footer_text: profile?.custom_footer_text || "",
      custom_footer_url: profile?.custom_footer_url || "",
      is_sensitive: profile?.is_sensitive || false,
      enable_subscribers: profile?.enable_subscribers || false,
      bg_image_url: profile?.bg_image_url || "",
      font_heading: profile?.font_heading || "",
      font_body: profile?.font_body || "",
    });
  };

  const handleTabChange = (tab: "links" | "appearance" | "settings" | "analytics" | "posts" | "subscribers" | "shop" | "qris" | "social") => {
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
          <ThemeToggle />
          <LanguageSelector />
          {profile && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              {t("dashboard.view_page")}
            </a>
          )}
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            {t("dashboard.logout")}
          </button>
        </div>
      </div>

      <div className="dash-layout">
        {/* Sidebar Navigation */}
        <nav className="dash-sidebar">
          <div className="dash-sidebar-profile">
            <div className="dash-sidebar-avatar">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="" width={48} height={48} className="sidebar-avatar-img" unoptimized />
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
                share-link-gan.vercel.com/{profile?.username}
              </a>
            </div>
          </div>

          <div className="dash-sidebar-nav">
            <div className="dash-sidebar-group">
              <button className={`dash-nav-item ${activeTab === "links" ? "active" : ""}`} onClick={() => handleTabChange("links")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <span>{t("dashboard.links")}</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "appearance" ? "active" : ""}`} onClick={() => handleTabChange("appearance")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                <span>{t("dashboard.appearance")}</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "settings" ? "active" : ""}`} onClick={() => handleTabChange("settings")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>{t("dashboard.settings")}</span>
              </button>

              <div className="dash-sidebar-divider" />

              <button className={`dash-nav-item ${activeTab === "analytics" ? "active" : ""}`} onClick={() => handleTabChange("analytics")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span>{t("dashboard.analytics")}</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "posts" ? "active" : ""}`} onClick={() => handleTabChange("posts")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                <span>{t("dashboard.posts")}</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "subscribers" ? "active" : ""}`} onClick={() => handleTabChange("subscribers")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>{t("dashboard.subscribers")}</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "shop" ? "active" : ""}`} onClick={() => handleTabChange("shop")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span>Shop</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "qris" ? "active" : ""}`} onClick={() => handleTabChange("qris")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><path d="M14 14h2v2h-2z"/><path d="M20 14h2v2h-2z"/><path d="M14 20h2v2h-2z"/><path d="M20 20h2v2h-2z"/><path d="M17 17h2v2h-2z"/></svg>
                <span>QRIS</span>
              </button>
              <button className={`dash-nav-item ${activeTab === "social" ? "active" : ""}`} onClick={() => handleTabChange("social")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                <span>Socials</span>
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
                  bucket="sharelinkgan_bucket"
                  folder="profile"
                  shape="circle"
                  size={80}
                  label="Avatar"
                />
                <div className="dash-profile-info">
                  <h2>{profile?.display_name || profile?.username}</h2>
                  <p>share-link-gan.vercel.com/{profile?.username}</p>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                {!showLinkForm && (
                  <button className="btn btn-primary animate-fade-in-up" onClick={openAddLink} style={{ width: "100%", padding: "16px", borderRadius: "100px", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {t("dashboard.add_link")}
                  </button>
                )}
                {showLinkForm && (
                  <LinkForm
                    initialData={editingLink}
                    onSave={saveLink}
                    onCancel={() => { setShowLinkForm(false); setEditingLink(null); }}
                    saving={saving}
                  />
                )}
              </div>

              {links.length === 0 ? (
                <div className="dash-card" style={{ textAlign: "center", padding: "48px 24px", color: "var(--gray-400)" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  </div>
                  <p style={{ fontSize: "1rem" }}>{t("dashboard.no_links")}</p>
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
                        bucket="sharelinkgan_bucket"
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
                  {(() => {
                    const cats = [...new Set<string>(THEMES.map(t => t.category))];
                    return cats.map(cat => (
                      <div key={cat} style={{ marginBottom: 20 }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{cat}</h3>
                        <div className="theme-grid">
                          {THEMES.filter(t => t.category === cat).map(t => (
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
                    ));
                  })()}
                </div>

                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Fonts</h2>
                  {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                  <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Heading Font</label>
                      <select
                        className="form-input"
                        value={profileForm.font_heading}
                        onChange={(e) => setProfileForm({ ...profileForm, font_heading: e.target.value })}
                      >
                        <option value="">Theme Default</option>
                        {Object.entries(FONT_MAP).map(([key, family]) => (
                          <option key={key} value={key} style={{ fontFamily: family }}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--bg-primary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", fontFamily: profileForm.font_heading ? FONT_MAP[profileForm.font_heading] : "inherit", fontWeight: 700, fontSize: "1.1rem" }}>
                        Preview Heading
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Body Font</label>
                      <select
                        className="form-input"
                        value={profileForm.font_body}
                        onChange={(e) => setProfileForm({ ...profileForm, font_body: e.target.value })}
                      >
                        <option value="">Theme Default</option>
                        {Object.entries(FONT_MAP).map(([key, family]) => (
                          <option key={key} value={key} style={{ fontFamily: family }}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--bg-primary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", fontFamily: profileForm.font_body ? FONT_MAP[profileForm.font_body] : "inherit", fontSize: "0.9rem" }}>
                        Preview body text style
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dash-card dash-section">
                  <h2 className="dash-section-title">Custom Background</h2>
                  <p style={{ color: "var(--text-muted)", marginBottom: 12, fontSize: "0.85rem" }}>
                    Upload a custom background image. It will overlay on top of your theme's colors.
                  </p>
                  {profileForm.bg_image_url && (
                    <div style={{ marginBottom: 12, position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", maxHeight: 160 }}>
                      <img src={profileForm.bg_image_url} alt="Background" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setProfileForm({ ...profileForm, bg_image_url: "" })}
                        style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "white", border: "none", borderRadius: "var(--radius-full)", padding: "4px 12px", fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <ImageUpload
                    currentUrl={profileForm.bg_image_url}
                    onUpload={(url) => setProfileForm({ ...profileForm, bg_image_url: url })}
                    folder="backgrounds"
                    label={profileForm.bg_image_url ? "Change Background" : "Upload Background"}
                  />
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
                      <span>Mark as sensitive / adult content</span>
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
          {activeTab === "qris" && <QrisTab />}
          {activeTab === "social" && <SocialLinksTab />}
        </div>

        {/* Preview Panel */}
        <div className="dash-preview">
          <div className="mobile-preview-container">
            <MobilePreview profile={profileForm as any} links={links} />
          </div>
        </div>
      </div>
    </div>
  );
}
