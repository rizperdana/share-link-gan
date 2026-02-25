"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Link as LinkType } from "@/lib/types";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  uniqueReferrers: string[];
  topLinks: { id: string; title: string; clicks: number }[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  dailyViews: { date: string; views: number; clicks: number }[];
}

export default function AnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Calculate date cutoff
    let since: string | null = null;
    if (timeRange === "7d") {
      since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (timeRange === "30d") {
      since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    let query = supabase
      .from("analytics_events")
      .select("*")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });

    if (since) {
      query = query.gte("created_at", since);
    }

    const { data: events } = await query;

    // Fetch user's links for titles
    const { data: links } = await supabase
      .from("links")
      .select("id, title")
      .eq("user_id", user.id);

    const linkMap: Record<string, string> = {};
    (links || []).forEach((l: any) => {
      linkMap[l.id] = l.title;
    });

    if (!events || events.length === 0) {
      setData({
        totalViews: 0,
        totalClicks: 0,
        uniqueReferrers: [],
        topLinks: [],
        deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
        dailyViews: [],
      });
      setLoading(false);
      return;
    }

    const views = events.filter((e) => e.event_type === "page_view");
    const clicks = events.filter((e) => e.event_type === "link_click");

    // Top links
    const linkClicks: Record<string, number> = {};
    clicks.forEach((c) => {
      if (c.link_id) linkClicks[c.link_id] = (linkClicks[c.link_id] || 0) + 1;
    });
    const topLinks = Object.entries(linkClicks)
      .map(([id, count]) => ({
        id,
        title: linkMap[id] || "Deleted Link",
        clicks: count,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Device breakdown
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    events.forEach((e) => {
      const d = e.device as keyof typeof devices;
      if (d in devices) devices[d]++;
    });

    // Daily views
    const dailyMap: Record<string, { views: number; clicks: number }> = {};
    events.forEach((e) => {
      const day = e.created_at.split("T")[0];
      if (!dailyMap[day]) dailyMap[day] = { views: 0, clicks: 0 };
      if (e.event_type === "page_view") dailyMap[day].views++;
      else dailyMap[day].clicks++;
    });
    const dailyViews = Object.entries(dailyMap)
      .map(([date, d]) => ({ date, ...d }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Unique referrers
    const refs = new Set<string>();
    events.forEach((e) => {
      if (e.referrer) {
        try {
          refs.add(new URL(e.referrer).hostname);
        } catch {
          refs.add(e.referrer);
        }
      }
    });

    setData({
      totalViews: views.length,
      totalClicks: clicks.length,
      uniqueReferrers: Array.from(refs).slice(0, 10),
      topLinks,
      deviceBreakdown: devices,
      dailyViews,
    });
    setLoading(false);
  }, [supabase, router, timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const maxDailyValue = data
    ? Math.max(...data.dailyViews.map((d) => d.views + d.clicks), 1)
    : 1;

  return (
    <div className="animate-fade-in-up">
        <div className="dashboard-header">
          <h1>📊 Analytics</h1>
          <div className="dashboard-nav">
            {(["7d", "30d", "all"] as const).map((range) => (
              <button
                key={range}
                className={`btn btn-sm ${timeRange === range ? "btn-primary" : "btn-outline"}`}
                onClick={() => setTimeRange(range)}
              >
                {range === "7d"
                  ? "7 Days"
                  : range === "30d"
                    ? "30 Days"
                    : "All Time"}
              </button>
            ))}
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
        ) : !data ? null : (
          <>
            {/* Stats Cards */}
            <div className="analytics-stats">
              <div className="analytics-stat-card">
                <div className="analytics-stat-number">{data.totalViews}</div>
                <div className="analytics-stat-label">Views</div>
              </div>
              <div className="analytics-stat-card">
                <div className="analytics-stat-number">{data.totalClicks}</div>
                <div className="analytics-stat-label">Clicks</div>
              </div>
              <div className="analytics-stat-card">
                <div className="analytics-stat-number">
                  {data.totalViews > 0
                    ? ((data.totalClicks / data.totalViews) * 100).toFixed(1) +
                      "%"
                    : "0%"}
                </div>
                <div className="analytics-stat-label">CTR</div>
              </div>
            </div>

            {/* Daily Chart */}
            {data.dailyViews.length > 0 && (
              <div className="dash-card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontWeight: 700 }}>
                  Daily Activity
                </h3>
                <div className="analytics-chart">
                  {data.dailyViews.map((day) => (
                    <div key={day.date} className="analytics-bar-group">
                      <div
                        className="analytics-bar analytics-bar-views"
                        style={{
                          height: `${(day.views / maxDailyValue) * 120}px`,
                        }}
                        title={`${day.views} views`}
                      />
                      <div
                        className="analytics-bar analytics-bar-clicks"
                        style={{
                          height: `${(day.clicks / maxDailyValue) * 120}px`,
                        }}
                        title={`${day.clicks} clicks`}
                      />
                      <span className="analytics-bar-label">
                        {day.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="analytics-legend">
                  <span>
                    <span className="analytics-dot analytics-dot-views" /> Views
                  </span>
                  <span>
                    <span className="analytics-dot analytics-dot-clicks" />{" "}
                    Clicks
                  </span>
                </div>
              </div>
            )}

            {/* Top Links */}
            {data.topLinks.length > 0 && (
              <div className="dash-card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Top Links</h3>
                {data.topLinks.map((link, i) => (
                  <div key={link.id} className="analytics-link-row">
                    <span className="analytics-link-rank">#{i + 1}</span>
                    <span className="analytics-link-title">{link.title}</span>
                    <span className="analytics-link-clicks">
                      {link.clicks} clicks
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Device & Referrers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              <div className="dash-card">
                <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Devices</h3>
                {Object.entries(data.deviceBreakdown).map(([device, count]) => (
                  <div key={device} className="analytics-link-row">
                    <span style={{ textTransform: "capitalize" }}>
                      {device}
                    </span>
                    <span style={{ fontWeight: 700 }}>{count}</span>
                  </div>
                ))}
              </div>

              {data.uniqueReferrers.length > 0 && (
                <div className="dash-card">
                  <h3 style={{ marginBottom: 16, fontWeight: 700 }}>
                    Top Referrers
                  </h3>
                  {data.uniqueReferrers.map((ref) => (
                    <div key={ref} className="analytics-link-row">
                      <span>{ref}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
    </div>
  );
}
