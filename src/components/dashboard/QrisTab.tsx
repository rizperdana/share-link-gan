"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
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
      setMessage({ type: "error", text: "Failed to save: " + error.message });
    } else {
      setMessage({ type: "success", text: "QRIS & donation settings saved!" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRemoveQris = async () => {
    if (!confirm("Remove your QRIS image?")) return;
    setQrisUrl("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ qris_image_url: null }).eq("id", user.id);
    setMessage({ type: "success", text: "QRIS image removed" });
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
          <IconQris size={24} /> QRIS & Donations
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
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>QRIS Code</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>
          Upload your QRIS barcode image. Visitors can scan it with any e-wallet (GoPay, OVO, DANA, ShopeePay, etc.) or banking app to send tips or payments.
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
              label="Upload QRIS"
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
                    QRIS Active
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Your QRIS code will appear on your profile&apos;s &quot;Support&quot; tab
                  </p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={handleRemoveQris} style={{ alignSelf: "flex-start" }}>
                  Remove QRIS
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
                <p style={{ marginTop: 8, fontWeight: 600 }}>No QRIS uploaded</p>
                <p style={{ fontSize: "0.75rem", marginTop: 4 }}>
                  Get your QRIS from your bank or e-wallet app
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
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Donation Link</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>
          Add an external donation link (e.g., Saweria, Trakteer, Ko-fi, PayPal.me). This will appear as a button on your profile&apos;s Support tab alongside QRIS.
        </p>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">Donation URL</label>
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
                {copied ? "Copied!" : "Copy"}
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
        {saving ? <span className="spinner" /> : "Save Changes"}
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
        <strong style={{ color: "var(--text-primary)" }}>How it works:</strong>
        <ul style={{ marginTop: 8, paddingLeft: 18 }}>
          <li>Your QRIS code and donation link appear on the <strong>&quot;Support&quot;</strong> tab of your public profile</li>
          <li>QRIS works with all Indonesian e-wallets and banking apps</li>
          <li>Products without a checkout link or WhatsApp number will show a &quot;Pay via QRIS&quot; button</li>
          <li>Donation links support platforms like Saweria, Trakteer, Ko-fi, etc.</li>
        </ul>
      </div>
    </div>
  );
}
