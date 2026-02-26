"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import { IconShoppingBag, IconPen, IconTrash, IconPlus, IconWhatsapp } from "@/components/Icons";
import type { Product } from "@/lib/types";

export default function ShopTab() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    image_url: "",
    checkout_link: "",
    category: "general",
    is_active: true,
  });

  const supabase = createClient();
  const router = useRouter();

  const categories = ["general", "digital", "physical", "service", "food", "fashion", "other"];

  const fetchData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("profile_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      price: 0,
      image_url: "",
      checkout_link: "",
      category: "general",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      title: product.title,
      description: product.description || "",
      price: product.price,
      image_url: product.image_url || "",
      checkout_link: product.checkout_link || "",
      category: product.category || "general",
      is_active: product.is_active,
    });
    setShowModal(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const prodData = {
      title: form.title,
      description: form.description || null,
      price: form.price,
      image_url: form.image_url || null,
      checkout_link: form.checkout_link || null,
      category: form.category || "general",
      is_active: form.is_active,
    };

    if (editing) {
      await supabase.from("products").update(prodData).eq("id", editing.id);
    } else {
      await supabase.from("products").insert({ ...prodData, profile_id: user.id });
    }

    setSaving(false);
    setShowModal(false);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  const toggleActive = async (prod: Product) => {
    await supabase
      .from("products")
      .update({ is_active: !prod.is_active })
      .eq("id", prod.id);
    fetchData();
  };

  return (
    <>
      <div className="animate-fade-in-up">
        <div className="dashboard-header">
          <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}><IconShoppingBag size={24} /> Shop Products</h1>
          <div className="dashboard-nav">
            <button className="btn btn-primary btn-sm" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconPlus size={16} /> Add Product
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
        ) : products.length === 0 ? (
          <div
            className="dash-card"
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--gray-400)",
            }}
          >
            <div style={{ marginBottom: 8, color: "var(--gray-400)" }}><IconShoppingBag size={48} /></div>
            <p>
              No products yet. Add physical or digital products to sell to your audience.
            </p>
          </div>
        ) : (
          <div className="product-list" style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
            {products.map((prod) => (
              <div key={prod.id} className="dash-card auth-card" style={{ padding: 16 }}>
                {prod.image_url && (
                  <img
                    src={prod.image_url}
                    alt={prod.title}
                    style={{
                      width: "100%",
                      borderRadius: "var(--radius-sm)",
                      marginBottom: 12,
                      aspectRatio: "1/1",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: "0.7rem", background: "var(--accent)", color: "white", padding: "2px 8px", borderRadius: "100px", textTransform: "capitalize" }}>
                    {prod.category || "general"}
                  </span>
                </div>
                <h3 style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: 4 }}>
                  {prod.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 8, height: 40, overflow: "hidden" }}>
                  {prod.description}
                </p>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--green)", marginBottom: 12 }}>
                  Rp {prod.price.toLocaleString("id-ID")}
                </div>

                <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
                  <label className="toggle-label" style={{ margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={prod.is_active}
                      onChange={() => toggleActive(prod)}
                    />
                    <span style={{ fontSize: "0.8rem" }}>{prod.is_active ? "Active" : "Hidden"}</span>
                  </label>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(prod)}
                      style={{ padding: "4px 8px" }}
                    >
                      <IconPen size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProduct(prod.id)}
                      style={{ padding: "4px 8px" }}
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Edit Product" : "New Product"}</h2>
            <form onSubmit={saveProduct}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="E-book, Course, Merchandise..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Price (IDR)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="50000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {categories.map(c => (
                      <option key={c} value={c} style={{ textTransform: "capitalize" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="What are you selling?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <ImageUpload
                  currentUrl={form.image_url}
                  onUpload={(url) => setForm({ ...form, image_url: url })}
                  bucket="sharelinkgan_bucket"
                  folder="products"
                  shape="square"
                  size={100}
                  label="Upload"
                />
              </div>
              <div className="form-group">
                <label className="form-label">External Checkout Link (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://wa.me/... or Shopee link"
                  value={form.checkout_link}
                  onChange={(e) => setForm({ ...form, checkout_link: e.target.value })}
                />
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
                    "Add Product"
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
