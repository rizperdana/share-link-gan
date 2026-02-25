"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import type { Post, Link as LinkType } from "@/lib/types";

export default function PostsTab() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    image_url: "",
    link_id: "",
    is_published: true,
    scheduled_start: "",
    scheduled_end: "",
    tags: "",
    is_private: false,
    private_pin: "",
  });

  const supabase = createClient();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const [{ data: postsData }, { data: linksData }] = await Promise.all([
      supabase
        .from("posts")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("links")
        .select("id, title")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true }),
    ]);

    setPosts(postsData || []);
    setLinks(linksData || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: "",
      body: "",
      image_url: "",
      link_id: "",
      is_published: true,
      scheduled_start: "",
      scheduled_end: "",
      tags: "",
      is_private: false,
      private_pin: "",
    });
    setShowModal(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title,
      body: post.body || "",
      image_url: post.image_url || "",
      link_id: post.link_id || "",
      is_published: post.is_published,
      scheduled_start: post.scheduled_start ? new Date(post.scheduled_start).toISOString().slice(0, 16) : "",
      scheduled_end: post.scheduled_end ? new Date(post.scheduled_end).toISOString().slice(0, 16) : "",
      tags: post.tags ? post.tags.join(", ") : "",
      is_private: post.is_private || false,
      private_pin: post.private_pin || "",
    });
    setShowModal(true);
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const postData = {
      title: form.title,
      body: form.body || null,
      image_url: form.image_url || null,
      link_id: form.link_id || null,
      is_published: form.is_published,
      scheduled_start: form.scheduled_start ? new Date(form.scheduled_start).toISOString() : null,
      scheduled_end: form.scheduled_end ? new Date(form.scheduled_end).toISOString() : null,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      is_private: form.is_private,
      private_pin: form.is_private ? form.private_pin || null : null,
    };

    if (editing) {
      await supabase.from("posts").update(postData).eq("id", editing.id);
    } else {
      await supabase.from("posts").insert({ ...postData, profile_id: user.id });
    }

    setSaving(false);
    setShowModal(false);
    fetchData();
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    fetchData();
  };

  const togglePublish = async (post: Post) => {
    await supabase
      .from("posts")
      .update({ is_published: !post.is_published })
      .eq("id", post.id);
    fetchData();
  };

  return (
    <>
      <div className="animate-fade-in-up">
        <div className="dashboard-header">
          <h1>📝 Posts</h1>
          <div className="dashboard-nav">
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              + New Post
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
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
        ) : posts.length === 0 ? (
          <div
            className="dash-card"
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--gray-400)",
            }}
          >
            <p style={{ fontSize: "2.5rem", marginBottom: 8 }}>📝</p>
            <p>
              No posts yet. Create a post to share updates with your audience.
            </p>
          </div>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <div key={post.id} className="dash-card post-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        marginBottom: 4,
                      }}
                    >
                      {post.title}
                    </h3>
                    <span
                      style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}
                    >
                      {new Date(post.created_at).toLocaleDateString()} ·{" "}
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                    {post.is_private && <span style={{ marginLeft: 8, fontSize: "0.75rem", background: "var(--bg-card)", padding: "2px 6px", borderRadius: 4, color: "var(--warning)" }}>🔒 Private</span>}
                    {post.tags && post.tags.length > 0 && (
                      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                        {post.tags.map(tag => (
                          <span key={tag} style={{ fontSize: "0.7rem", background: "var(--purple)", color: "white", padding: "2px 6px", borderRadius: 4 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => togglePublish(post)}
                    >
                      {post.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(post)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deletePost(post.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {post.body && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--gray-600)",
                      lineHeight: 1.5,
                    }}
                  >
                    {post.body}
                  </p>
                )}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt=""
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      marginTop: 8,
                      maxHeight: 200,
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Edit Post" : "New Post"}</h2>
            <form onSubmit={savePost}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Post title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Body</label>
                <textarea
                  className="form-input"
                  placeholder="Write your update..."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={5}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image (optional)</label>
                <ImageUpload
                  currentUrl={form.image_url}
                  onUpload={(url) => setForm({ ...form, image_url: url })}
                  bucket="sharelinkgan_bucket"
                  folder="posts"
                  shape="square"
                  size={80}
                  label="Upload"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Attach a link (optional)</label>
                <select
                  className="form-input"
                  value={form.link_id}
                  onChange={(e) =>
                    setForm({ ...form, link_id: e.target.value })
                  }
                >
                  <option value="">None</option>
                  {links.map((link) => (
                    <option key={link.id} value={link.id}>
                      {link.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) =>
                      setForm({ ...form, is_published: e.target.checked })
                    }
                  />
                  <span>Publish immediately</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Schedule Start</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={form.scheduled_start}
                    onChange={(e) => setForm({ ...form, scheduled_start: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Schedule End</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={form.scheduled_end}
                    onChange={(e) => setForm({ ...form, scheduled_end: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="news, update, event"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ background: "var(--bg-card)", padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <label className="toggle-label" style={{ marginBottom: form.is_private ? 12 : 0 }}>
                  <input
                    type="checkbox"
                    checked={form.is_private}
                    onChange={(e) => setForm({ ...form, is_private: e.target.checked })}
                  />
                  <span>Private Post (Require PIN to view)</span>
                </label>
                {form.is_private && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Secret PIN"
                    value={form.private_pin}
                    onChange={(e) => setForm({ ...form, private_pin: e.target.value })}
                    required
                  />
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="spinner" />
                  ) : editing ? (
                    "Save Changes"
                  ) : (
                    "Create Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
