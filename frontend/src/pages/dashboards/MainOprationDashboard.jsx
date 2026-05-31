import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getFullDashboard,
  getDashboardMetrics,
  getRecentActivity,
} from "../../api/mainOprationDashboardApi";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const timeAgo = (ts) => {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const STATUS_CONFIG = {
  in_progress: {
    label: "In Progress",
    bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-500",
    pulse: true,
  },
  upcoming: {
    label: "Upcoming",
    bg: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300",
    dot: "bg-primary",
    pulse: false,
  },
  completed: {
    label: "Completed",
    bg: "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400",
    dot: "bg-gray-400 dark:bg-gray-500",
    pulse: false,
  },
};

const ACTIVITY_CONFIG = {
  "check-in": {
    icon: "how_to_reg",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  "check-out": { icon: "logout", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
  registration: {
    icon: "person_add",
    color: "text-primary",
    bg: "bg-primary/10 dark:bg-primary/20",
  },
  service: { icon: "room_service", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  transport: {
    icon: "local_shipping",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
  },
  "room-assignment": {
    icon: "meeting_room",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  schedule: { icon: "schedule", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent = "primary",
  trend,
  loading,
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  };

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className={`size-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold ${
              trend >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {trend >= 0 ? "trending_up" : "trending_down"}
            </span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-1">
          {label}
        </p>
        {loading ? (
          <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        ) : (
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">
            {value ?? 0}
          </h3>
        )}
        {sub && !loading && (
          <p className="text-xs text-neutral-muted mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

function ActivityItem({ log }) {
  const cfg = ACTIVITY_CONFIG[log.type] || {
    icon: "info",
    color: "text-slate-500",
    bg: "bg-slate-100",
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div
        className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}
      >
        <span className={`material-symbols-outlined text-lg ${cfg.color}`}>
          {cfg.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1">
          {log.message || "System activity"}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {log.event?.name && (
            <span className="text-[10px] text-neutral-muted font-medium truncate max-w-30">
              {log.event.name}
            </span>
          )}
          {log.priority === "high" || log.priority === "critical" ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700">
              {log.priority}
            </span>
          ) : null}
          <span className="text-[10px] text-neutral-muted ml-auto shrink-0">
            {timeAgo(log.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

function EventStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg}`}
    >
      <span
        className={`size-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`}
      />
      {cfg.label}
    </span>
  );
}

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">
        {icon}
      </span>
      <div>
        <p className="font-bold text-gray-600 dark:text-gray-300">{title}</p>
        {desc && <p className="text-sm text-neutral-muted mt-1">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function MainOprationDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters / search
  const [eventSearch, setEventSearch] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("all");
  const [activityPage, setActivityPage] = useState(0);
  const ACTIVITY_PAGE_SIZE = 5;

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const res = await getFullDashboard();
      if (res.success) {
        setData(res);
        setLastUpdated(new Date());
      } else {
        setError(res.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh metrics every 90 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!data) return;
      try {
        const res = await getDashboardMetrics();
        if (res.success) {
          setData((prev) => (prev ? { ...prev, metrics: res.metrics } : prev));
          setLastUpdated(new Date());
        }
      } catch (_) {
        // silent fail
      }
    }, 90000);
    return () => clearInterval(interval);
  }, [data]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const metrics = data?.metrics || {};
  const upcomingEvents = data?.upcomingEvents || [];
  const recentActivity = data?.recentActivity || [];
  const activeEventStats = data?.activeEventStats || [];

  const filteredEvents = upcomingEvents.filter((ev) => {
    const matchSearch =
      !eventSearch ||
      ev.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (ev.venue || "").toLowerCase().includes(eventSearch.toLowerCase());
    const matchStatus =
      eventStatusFilter === "all" || ev.status === eventStatusFilter;
    return matchSearch && matchStatus;
  });

  const paginatedActivity = recentActivity.slice(
    activityPage * ACTIVITY_PAGE_SIZE,
    (activityPage + 1) * ACTIVITY_PAGE_SIZE,
  );
  const totalActivityPages = Math.ceil(
    recentActivity.length / ACTIVITY_PAGE_SIZE,
  );

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="flex items-center gap-3 mb-8">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              <span className="text-neutral-muted font-medium">
                Loading dashboard…
              </span>
            </div>
            {/* skeleton metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900/50 p-5 rounded-xl border border-neutral-border animate-pulse h-28"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-neutral-border animate-pulse h-96" />
              <div className="xl:col-span-2 bg-white dark:bg-slate-900/50 rounded-xl border border-neutral-border animate-pulse h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error && !data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex items-center justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-10 flex flex-col items-center text-center gap-4 max-w-md">
              <span className="material-symbols-outlined text-5xl text-red-400">
                error
              </span>
              <div>
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
                  Failed to load dashboard
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  {error}
                </p>
              </div>
              <button
                onClick={() => fetchData()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  refresh
                </span>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── Top Navbar ── */}
        <header className="h-16 bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted text-xl">
                search
              </span>
              <input
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Search events, guests, or tasks..."
                type="text"
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Last updated */}
            {lastUpdated && (
              <span className="text-xs text-neutral-muted hidden md:block">
                Updated{" "}
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {/* Refresh */}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-neutral-muted disabled:opacity-50 transition-colors"
              title="Refresh dashboard"
            >
              <span
                className={`material-symbols-outlined ${refreshing ? "animate-spin" : ""}`}
              >
                refresh
              </span>
            </button>
            {/* Notifications */}
            <button className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative text-neutral-muted">
              <span className="material-symbols-outlined">notifications</span>
              {metrics.serviceRequests > 0 && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              )}
            </button>
            <div className="h-8 w-px bg-neutral-border dark:bg-slate-800 mx-2" />
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none dark:text-white">
                  {user?.name || "Operator"}
                </p>
                <p className="text-[10px] text-neutral-muted mt-1 uppercase font-bold tracking-tight">
                  {user?.organizationName || "Operations"}
                </p>
              </div>
              <div className="size-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {(user?.name || "O").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ── Dashboard Content ── */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* ── Error banner (non-blocking) ── */}
          {error && data && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-200 px-4 py-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">
                  warning
                </span>
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={() => fetchData(true)}
                className="text-sm font-bold underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* ── Page title ── */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Operations Dashboard
              </h1>
              <p className="text-sm text-neutral-muted mt-1">
                Welcome back,{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {user?.name || "Operator"}
                </span>{" "}
                · {user?.organizationName || ""}
              </p>
            </div>
            <Link to="/create-event">
              <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-primary/90 shadow-sm transition-all">
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                New Event
              </button>
            </Link>
          </div>

          {/* ── Metric Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard
              icon="calendar_today"
              label="Total Events"
              value={metrics.totalEvents}
              sub={`${metrics.activeEvents || 0} live now`}
              accent="primary"
              loading={!data}
            />
            <MetricCard
              icon="play_circle"
              label="Active Events"
              value={metrics.activeEvents}
              sub={`${metrics.upcomingEventsCount || 0} upcoming`}
              accent="green"
              loading={!data}
            />
            <MetricCard
              icon="group"
              label="Guests Today"
              value={metrics.guestsToday}
              sub={`${metrics.totalGuests || 0} total registered`}
              accent="indigo"
              loading={!data}
            />
            <MetricCard
              icon="pending_actions"
              label="Pending Check-ins"
              value={metrics.pendingCheckIns}
              accent={metrics.pendingCheckIns > 10 ? "amber" : "primary"}
              sub={
                metrics.checkedInGuests
                  ? `${metrics.checkedInGuests} checked in`
                  : undefined
              }
              loading={!data}
            />
            <MetricCard
              icon="room_service"
              label="Service Requests"
              value={metrics.serviceRequests}
              accent={metrics.serviceRequests > 5 ? "red" : "primary"}
              sub="open & in-progress"
              loading={!data}
            />
          </div>

          {/* ── Active Events Live Panel ── */}
          {activeEventStats.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-neutral-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                Live Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEventStats.map((ev) => (
                  <div
                    key={ev._id}
                    className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                          {ev.name}
                        </h3>
                        {ev.venue && (
                          <p className="text-xs text-neutral-muted mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              location_on
                            </span>
                            {ev.venue}
                          </p>
                        )}
                      </div>
                      <EventStatusBadge status="in_progress" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        {
                          icon: "how_to_reg",
                          label: "Checked In",
                          value: ev.stats.checkedIn,
                          color: "text-emerald-600",
                        },
                        {
                          icon: "group",
                          label: "Total Guests",
                          value: ev.stats.totalGuests,
                          color: "text-primary",
                        },
                        {
                          icon: "room_service",
                          label: "Open Services",
                          value: ev.stats.openServices,
                          color:
                            ev.stats.openServices > 0
                              ? "text-amber-600"
                              : "text-gray-500",
                        },
                        {
                          icon: "local_shipping",
                          label: "Transport",
                          value: ev.stats.activeTransport,
                          color: "text-indigo-600",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-gray-50 dark:bg-slate-800 rounded-lg p-2.5 text-center"
                        >
                          <p className={`text-lg font-black ${stat.color}`}>
                            {stat.value}
                          </p>
                          <p className="text-[10px] text-neutral-muted font-medium">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Check-in progress bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-muted font-medium">
                          Check-in Progress
                        </span>
                        <span className="font-bold text-primary">
                          {ev.stats.checkInRate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-700"
                          style={{ width: `${ev.stats.checkInRate}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      to={`/events/${ev._id}/overview`}
                      className="mt-4 flex items-center justify-center gap-1 w-full py-2 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        open_in_new
                      </span>
                      Manage Event
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Main Grid: Activity + Events Table ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* ── Recent Activity ── */}
            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-base dark:text-white">Recent Activity</h2>
                  <span className="size-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="text-primary text-xs font-bold hover:underline disabled:opacity-50"
                >
                  {refreshing ? "Refreshing…" : "Refresh"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto max-h-105 custom-scrollbar p-3">
                {recentActivity.length === 0 ? (
                  <EmptyState
                    icon="dynamic_feed"
                    title="No activity yet"
                    desc="Activity will appear once operations begin."
                  />
                ) : (
                  <div className="space-y-1">
                    {paginatedActivity.map((log) => (
                      <ActivityItem key={log._id} log={log} />
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalActivityPages > 1 && (
                <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-neutral-muted">
                  <span>
                    Page {activityPage + 1} of {totalActivityPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActivityPage((p) => Math.max(0, p - 1))}
                      disabled={activityPage === 0}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() =>
                        setActivityPage((p) =>
                          Math.min(totalActivityPages - 1, p + 1),
                        )
                      }
                      disabled={activityPage === totalActivityPages - 1}
                      className="px-2 py-1 rounded border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Events Table ── */}
            <div className="xl:col-span-2 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-bold text-base dark:text-white">Events</h2>
                <div className="flex items-center gap-2">
                  {/* Status filter tabs */}
                  {["all", "in_progress", "upcoming", "completed"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setEventStatusFilter(s)}
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                        eventStatusFilter === s
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-slate-800 text-neutral-muted hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {s === "all"
                        ? "All"
                        : s === "in_progress"
                          ? "Live"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                  <Link
                    to="/events"
                    className="text-primary text-xs font-bold hover:underline ml-2"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                {filteredEvents.length === 0 ? (
                  <EmptyState
                    icon="event"
                    title={
                      eventSearch || eventStatusFilter !== "all"
                        ? "No matching events"
                        : "No events yet"
                    }
                    desc={
                      eventSearch || eventStatusFilter !== "all"
                        ? "Try adjusting your search or filter."
                        : "Create your first event to get started."
                    }
                    action={
                      !eventSearch && eventStatusFilter === "all" ? (
                        <Link to="/create-event">
                          <button className="mt-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                            Create Event
                          </button>
                        </Link>
                      ) : null
                    }
                  />
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        {["Event Name", "Venue", "Date", "Status", ""].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-6 py-3 text-[10px] font-bold text-neutral-muted uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-border dark:divide-gray-800">
                      {filteredEvents.map((ev) => (
                        <tr
                          key={ev._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                              {ev.name}
                            </div>
                            {ev.isPrivate && (
                              <div className="text-[10px] text-neutral-muted flex items-center gap-0.5 mt-0.5">
                                <span className="material-symbols-outlined text-xs">
                                  lock
                                </span>
                                Private
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-muted">
                            <span className="line-clamp-1">
                              {ev.venue || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-neutral-muted whitespace-nowrap">
                            {fmtDate(ev.startDate)}
                            {ev.endDate && ` – ${fmtDate(ev.endDate)}`}
                          </td>
                          <td className="px-6 py-4">
                            <EventStatusBadge status={ev.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link to={`/events/${ev._id}/overview`}>
                              <button className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-all shadow-sm opacity-0 group-hover:opacity-100">
                                Manage
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {filteredEvents.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-neutral-muted">
                  <span>
                    Showing {filteredEvents.length} of {upcomingEvents.length}{" "}
                    events
                  </span>
                  <Link
                    to="/events"
                    className="text-primary font-bold hover:underline"
                  >
                    See all events →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Summary Stats Row ── */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check-in overview */}
            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Overall Check-in
                </h3>
                <span className="material-symbols-outlined text-primary">
                  how_to_reg
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                {metrics.checkedInGuests ?? 0}
                <span className="text-sm font-normal text-neutral-muted ml-1">
                  / {metrics.totalGuests ?? 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3 mb-2">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      metrics.totalGuests
                        ? Math.round(
                            (metrics.checkedInGuests / metrics.totalGuests) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-neutral-muted">
                {metrics.totalGuests
                  ? `${Math.round(
                      (metrics.checkedInGuests / metrics.totalGuests) * 100,
                    )}% check-in rate across all events`
                  : "No guests registered yet"}
              </p>
            </div>

            {/* Event breakdown */}
            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Event Breakdown
                </h3>
                <span className="material-symbols-outlined text-primary">
                  pie_chart
                </span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Live Now",
                    value: metrics.activeEvents,
                    color: "bg-emerald-500",
                    textColor: "text-emerald-600",
                  },
                  {
                    label: "Upcoming",
                    value: metrics.upcomingEventsCount,
                    color: "bg-primary",
                    textColor: "text-primary",
                  },
                  {
                    label: "Completed",
                    value: metrics.completedEvents,
                    color: "bg-gray-400",
                    textColor: "text-gray-600",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-muted font-medium">
                        {item.label}
                      </span>
                      <span className={`font-bold ${item.textColor}`}>
                        {item.value ?? 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-700`}
                        style={{
                          width: `${
                            metrics.totalEvents
                              ? Math.round(
                                  ((item.value || 0) / metrics.totalEvents) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  {
                    icon: "add_circle",
                    label: "Create New Event",
                    to: "/create-event",
                    accent: "text-primary",
                  },
                  {
                    icon: "calendar_today",
                    label: "View All Events",
                    to: "/events",
                    accent: "text-indigo-600",
                  },
                  {
                    icon: "analytics",
                    label: "Analytics & Reports",
                    to: "/analytics",
                    accent: "text-purple-600",
                  },
                  {
                    icon: "settings",
                    label: "Platform Settings",
                    to: "/settings",
                    accent: "text-gray-600",
                  },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${item.accent}`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    <span className="material-symbols-outlined text-sm text-neutral-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── FAB: Create Event ── */}
      <Link to="/create-event">
        <button className="fixed bottom-8 right-8 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group z-50">
          <span className="material-symbols-outlined text-3xl">add</span>
          <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Create New Event
          </span>
        </button>
      </Link>
    </div>
  );
}

export default MainOprationDashboard;
