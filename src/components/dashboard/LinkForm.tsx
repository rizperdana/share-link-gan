import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import type { Link as LinkType } from "@/lib/types";

interface LinkFormProps {
  initialData?: LinkType | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

export default function LinkForm({ initialData, onSave, onCancel, saving }: LinkFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    url: initialData?.url || "",
    icon: initialData?.icon || "",
    image_url: initialData?.image_url || "",
    scheduled_start: initialData?.scheduled_start || "",
    scheduled_end: initialData?.scheduled_end || "",
    tags: initialData?.tags?.join(", ") || "",
    is_private: initialData?.is_private || false,
    private_pin: initialData?.private_pin || "",
  });

  const [activeTab, setActiveTab] = useState<string | null>(null);

  const toggleTab = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="link-form-card animate-fade-in-up" onSubmit={handleSubmit}>
      <div className="link-form-main">
        <input
          type="text"
          className="link-form-input-title"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="url"
          className="link-form-input-url"
          placeholder="Url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
      </div>

      <div className="link-form-toolbar">
        <button
          type="button"
          className={`link-toolbar-btn ${activeTab === "thumbnail" ? "active" : ""}`}
          onClick={() => toggleTab("thumbnail")}
          title="Thumbnail"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </button>
        <button
          type="button"
          className={`link-toolbar-btn ${activeTab === "icon" ? "active" : ""}`}
          onClick={() => toggleTab("icon")}
          title="Icon"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
        </button>
        <button
          type="button"
          className={`link-toolbar-btn ${activeTab === "tags" ? "active" : ""}`}
          onClick={() => toggleTab("tags")}
          title="Tags"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        </button>
        <button
          type="button"
          className={`link-toolbar-btn ${activeTab === "schedule" ? "active" : ""}`}
          onClick={() => toggleTab("schedule")}
          title="Schedule"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
        <button
          type="button"
          className={`link-toolbar-btn ${activeTab === "private" ? "active" : ""}`}
          onClick={() => toggleTab("private")}
          title="Private Link"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </button>
      </div>

      {activeTab === "thumbnail" && (
        <div className="link-form-accordion">
          <label className="form-label">Thumbnail Upload</label>
          <ImageUpload
            currentUrl={form.image_url}
            onUpload={(url) => setForm({ ...form, image_url: url })}
            bucket="avatars"
            folder="thumbnails"
            shape="square"
            size={64}
            label="Upload Thumbnail"
          />
        </div>
      )}

      {activeTab === "icon" && (
        <div className="link-form-accordion">
          <label className="form-label">Link Icon (Text/SVG string)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. SL or SVG code"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
      )}

      {activeTab === "tags" && (
        <div className="link-form-accordion">
          <label className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-input"
            placeholder="promo, social, work"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="link-form-accordion">
          <div className="form-row">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Show from</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.scheduled_start}
                onChange={(e) => setForm({ ...form, scheduled_start: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Hide after</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.scheduled_end}
                onChange={(e) => setForm({ ...form, scheduled_end: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "private" && (
        <div className="link-form-accordion">
          <label className="toggle-label" style={{ marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) => setForm({ ...form, is_private: e.target.checked })}
            />
            <span>Require PIN to unlock</span>
          </label>
          {form.is_private && (
            <input
              type="text"
              className="form-input"
              placeholder="Enter PIN (e.g. 1234)"
              value={form.private_pin}
              onChange={(e) => setForm({ ...form, private_pin: e.target.value })}
              maxLength={10}
            />
          )}
        </div>
      )}

      <div className="link-form-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : "Save"}
        </button>
      </div>
    </form>
  );
}
