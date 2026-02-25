"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Subscriber } from "@/lib/types";

export default function SubscribersTab() {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const supabase = createClient();
  const router = useRouter();

  const fetchSubscribers = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    setSubscribers(data || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const exportCSV = () => {
    const csv = [
      "email,subscribed_at",
      ...subscribers.map((s) => `${s.email},${s.created_at}`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in-up">
        <div className="dashboard-header">
          <h1>👥 Subscribers</h1>
          <div className="dashboard-nav">
            <button
              className="btn btn-outline btn-sm"
              onClick={exportCSV}
              disabled={subscribers.length === 0}
            >
              📥 Export CSV
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
        ) : subscribers.length === 0 ? (
          <div
            className="dash-card"
            style={{
              textAlign: "center",
              padding: "48px 24px",
              color: "var(--gray-400)",
            }}
          >
            <p style={{ fontSize: "2.5rem", marginBottom: 8 }}>📭</p>
            <p>
              No subscribers yet. Enable subscribers in Settings to let visitors
              subscribe.
            </p>
          </div>
        ) : (
          <div className="dash-card">
            <div
              style={{
                fontSize: "0.85rem",
                color: "var(--gray-500)",
                marginBottom: 16,
              }}
            >
              {subscribers.length} subscriber
              {subscribers.length !== 1 ? "s" : ""}
            </div>
            {subscribers.map((sub) => (
              <div key={sub.id} className="analytics-link-row">
                <span>{sub.email}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>
                  {new Date(sub.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
