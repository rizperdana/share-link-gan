"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { useTranslation } from "@/lib/i18n";
import { IconQris, IconScan, IconHeart, IconExternalLink, IconCopy } from "@/components/Icons";

export default function QrisTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrisUrl, setQrisUrl] = useState("");
  const [donationLink, setDonationLink] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("qris_image_url, donation_link")
      .eq("id", user.id)
      .single();

    if (profile) {
      setQrisUrl(profile.qris_image_url || "");
      setDonationLink(profile.donation_link || "");
    }
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        qris_image_url: qrisUrl || null,
        donation_link: donationLink || null,
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: t("qris_tab.fail") + error.message });
    } else {
      setMessage({ type: "success", text: t("qris_tab.success") });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemoveQris = async () => {
    if (!confirm(t("qris_tab.remove_confirm"))) return;
    setQrisUrl("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ qris_image_url: null }).eq("id", user.id);
    setMessage({ type: "success", text: t("qris_tab.removed") });
    setTimeout(() => setMessage(null), 3000);
  };

  const copyDonationLink = () => {
    if (donationLink) {
      navigator.clipboard.writeText(donationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
          <IconQris size={24} /> {t("qris_tab.title")}
        </h1>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 16 }}>
          {message.text}
        </div>
      )}

      {/* QRIS Section */}
      <div className="dash-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <IconScan size={20} />
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("qris_tab.qris_code")}</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
          {t("qris_tab.qris_desc")}
        </p>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <ImageUpload
              currentUrl={qrisUrl}
              onUpload={(url) => setQrisUrl(url)}
              bucket="sharelinkgan_bucket"
              folder="qris"
              shape="square"
              size={180}
              label={t("qris_tab.upload")}
            />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            {qrisUrl ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: 16,
                  textAlign: "center",
                }}>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "var(--success)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    marginBottom: 8,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("qris_tab.active")}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {t("qris_tab.active_desc")}
                  </p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={handleRemoveQris} style={{ alignSelf: "flex-start" }}>
                  {t("qris_tab.remove")}
                </button>
              </div>
            ) : (
              <div style={{
                background: "var(--bg-primary)",
                border: "2px dashed var(--border-color)",
                borderRadius: "var(--radius-sm)",
                padding: 24,
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}>
                <IconQris size={32} />
                <p style={{ marginTop: 8, fontWeight: 600 }}>{t("qris_tab.no_uploaded")}</p>
                <p style={{ fontSize: "0.75rem", marginTop: 4 }}>
                  {t("qris_tab.get_qris")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donation Link Section */}
      <div className="dash-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <IconHeart size={20} />
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{t("qris_tab.donation_link")}</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>
          {t("qris_tab.donation_desc")}
        </p>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">{t("qris_tab.donation_url")}</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="url"
              className="form-input"
              placeholder="https://saweria.co/username"
              value={donationLink}
              onChange={(e) => setDonationLink(e.target.value)}
              style={{ flex: 1 }}
            />
            {donationLink && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={copyDonationLink}
                style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}
              >
                <IconCopy size={14} />
                {copied ? t("qris_tab.copied") : t("qris_tab.copy")}
              </button>
            )}
          </div>
        </div>

        {donationLink && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg-primary)", borderRadius: "var(--radius-sm)",
            padding: "10px 14px", border: "1px solid var(--border-color)",
            fontSize: "0.8rem", color: "var(--text-secondary)",
          }}>
            <IconExternalLink size={14} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {donationLink}
            </span>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {saving ? <span className="spinner" /> : t("qris_tab.save")}
      </button>

      {/* Info Card */}
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
        <strong style={{ color: "var(--text-primary)" }}>{t("qris_tab.how_it_works")}</strong>
        <ul style={{ marginTop: 8, paddingLeft: 18 }}>
          <li>{t("qris_tab.hw_1")}</li>
          <li>{t("qris_tab.hw_2")}</li>
          <li>{t("qris_tab.hw_3")}</li>
          <li>{t("qris_tab.hw_4")}</li>
        </ul>
      </div>
    </div>
  );
}
