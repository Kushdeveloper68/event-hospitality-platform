import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
    bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-600 dark:bg-blue-500",
    pulse: true,
  },
  upcoming: {
    label: "Upcoming",
    bg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-600 dark:bg-emerald-500",
    pulse: false,
  },
  completed: {
    label: "Completed",
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800",
    dot: "bg-slate-400 dark:bg-slate-500",
    pulse: false,
  },
};

const ACTIVITY_CONFIG = {
  "check-in": {
    icon: "how_to_reg",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  "check-out": {
    icon: "logout",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  registration: {
    icon: "person_add",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  service: {
    icon: "room_service",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
  transport: {
    icon: "local_shipping",
    color: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  "room-assignment": {
    icon: "meeting_room",
    color: "text-violet-700 dark:text-violet-300",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  schedule: {
    icon: "schedule",
    color: "text-teal-700 dark:text-teal-300",
    bg: "bg-teal-50 dark:bg-teal-500/10",
  },
};

// ─── UI primitives ──────────────────────────────────────────────────────────

function MetricCard({ icon, label, value, sub, accent = "blue", trend, loading }) {
  const accentMap = {
    blue: {
      icon: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
      value: "text-slate-950 dark:text-slate-50",
    },
    green: {
      icon: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      value: "text-slate-950 dark:text-slate-50",
    },
    amber: {
      icon: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
      value: "text-slate-950 dark:text-slate-50",
    },
    red: {
      icon: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300",
      value: "text-red-700 dark:text-red-300",
    },
    purple: {
      icon: "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300",
      value: "text-slate-950 dark:text-slate-50",
    },
    indigo: {
      icon: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
      value: "text-slate-950 dark:text-slate-50",
    },
  };

  const colors = accentMap[accent] || accentMap.blue;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-0 top-0 h-px bg-slate-100 dark:bg-slate-800" />

      <div className="mb-5 flex items-start justify-between gap-3">
        <div className={`flex size-10 items-center justify-center rounded-xl ${colors.icon}`}>
          <span className="material-symbols-outlined text-[21px]">{icon}</span>
        </div>

        {trend !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-bold ${
              trend >= 0
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300"
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {trend >= 0 ? "trending_up" : "trending_down"}
            </span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500 dark:text-slate-400">
        {label}
      </p>

      {loading ? (
        <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
      ) : (
        <h3 className={`text-[30px] font-extrabold leading-none tracking-tight ${colors.value}`}>
          {value ?? 0}
        </h3>
      )}

      {sub && !loading && (
        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{sub}</p>
      )}
    </div>
  );
}

function ActivityItem({ log }) {
  const cfg = ACTIVITY_CONFIG[log.type] || {
    icon: "info",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  };

  return (
    <div className="flex gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
        <span className={`material-symbols-outlined text-[18px] ${cfg.color}`}>
          {cfg.icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold leading-5 text-slate-800 dark:text-slate-200">
          {log.message || "System activity"}
        </p>

        <div className="mt-1 flex min-w-0 items-center gap-2">
          {log.event?.name && (
            <span className="max-w-[150px] truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {log.event.name}
            </span>
          )}

          {(log.priority === "high" || log.priority === "critical") && (
            <span className="rounded bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-700 dark:text-red-300">
              {log.priority}
            </span>
          )}

          <span className="ml-auto shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">
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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cfg.bg}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
      {cfg.label}
    </span>
  );
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <p className="font-bold text-slate-700 dark:text-slate-300">{title}</p>
      {desc && <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{desc}</p>}
      {action}
    </div>
  );
}

function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

function MainOprationDashboard() {
  const { user } = useAuth();

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
      <div className="flex h-screen overflow-hidden bg-[#f7f8fa] dark:bg-slate-950">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="h-[72px] shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-5 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                <div className="size-9 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 md:p-7">
            <div className="mb-7">
              <div className="mb-2 h-9 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-56 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
              ))}
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
              <div className="h-96 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 xl:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error && !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fa] dark:bg-slate-950 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 dark:border-red-500/30 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined text-[25px]">error</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Failed to load dashboard
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-bold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f8fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ── Top Bar ── */}
        <header className="z-20 h-[72px] shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex h-full items-center justify-between gap-5 px-5 md:px-7">
            <Link to="/" className="flex shrink-0 items-center gap-2.5">
              <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl">
                <img
                  src="/event-logo-with-icon-dark-bg-removebg-preview.png"
                  alt="EventCure Logo"
                  loading="lazy"
                  className="size-full object-contain"
                />
              </div>
              <span className="hidden text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:block">
                EventCure
              </span>
            </Link>

            <div className="ml-auto flex items-center gap-2 md:gap-4">
              {lastUpdated && (
                <div className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 lg:flex">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}

              <button
                onClick={() => fetchData(true)}
                disabled={refreshing}
                className="flex size-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50"
                title="Refresh dashboard"
              >
                <span className={`material-symbols-outlined text-[20px] ${refreshing ? "animate-spin" : ""}`}>
                  refresh
                </span>
              </button>

              <button
                className="relative flex size-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {metrics.serviceRequests > 0 && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white dark:border-slate-900 bg-red-500" />
                )}
              </button>

              <div className="hidden h-7 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-bold leading-4 text-slate-800 dark:text-slate-200">
                    {user?.name || "Operator"}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
                    {user?.organizationName || "Operations"}
                  </p>
                </div>

                <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 text-xs font-bold text-white dark:text-slate-900">
                  {(user?.name || "O").charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Dashboard Content ── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto max-w-[1600px] p-5 md:p-7 xl:p-8">
            {/* ── Non-blocking error ── */}
            {error && data && (
              <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-amber-800 dark:text-amber-300">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="material-symbols-outlined text-[19px]">warning</span>
                  <span className="truncate text-sm font-medium">{error}</span>
                </div>
                <button
                  onClick={() => fetchData(true)}
                  className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ── Page header ── */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
                  Operations
                </p>
                <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
                  Operations Dashboard
                </h1>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Welcome back,{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user?.name || "Operator"}
                  </span>
                  {user?.organizationName ? ` · ${user.organizationName}` : ""}
                </p>
              </div>

              <Link
                to="/create-event"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-sm font-bold text-white dark:text-slate-900 shadow-sm transition hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[19px]">add</span>
                New Event
              </Link>
            </div>

            {/* ── First-time empty state ── */}
            {!loading && data && metrics.totalEvents === 0 && (
              <div className="mb-7 overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-white dark:bg-slate-900">
                <div className="flex flex-col items-center px-6 py-12 text-center">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <span className="material-symbols-outlined text-[29px]">calendar_add_on</span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    Create your first event
                  </h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Track guests, rooms, team and service requests from one
                    operations workspace.
                  </p>
                  <Link
                    to="/create-event"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-2.5 text-sm font-bold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                  >
                    <span className="material-symbols-outlined text-[19px]">add</span>
                    Create New Event
                  </Link>
                </div>
              </div>
            )}

            {/* ── KPI row ── */}
            <section className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  At a glance
                </p>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  Live operational overview
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <MetricCard
                  icon="calendar_today"
                  label="Total Events"
                  value={metrics.totalEvents}
                  sub={`${metrics.activeEvents || 0} live now`}
                  accent="blue"
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
                  sub={
                    metrics.checkedInGuests
                      ? `${metrics.checkedInGuests} checked in`
                      : undefined
                  }
                  accent={metrics.pendingCheckIns > 10 ? "amber" : "blue"}
                  loading={!data}
                />
                <MetricCard
                  icon="room_service"
                  label="Service Requests"
                  value={metrics.serviceRequests}
                  accent={metrics.serviceRequests > 5 ? "red" : "blue"}
                  sub="open & in-progress"
                  loading={!data}
                />
              </div>
            </section>

            {/* ── Live events ── */}
            {activeEventStats.length > 0 && (
              <section className="mb-8">
                <SectionHeader
                  eyebrow="Live operations"
                  title="Active events"
                  action={
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-500" />
                      Live
                    </span>
                  }
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {activeEventStats.map((ev) => (
                    <div
                      key={ev._id}
                      className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none transition hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_10px_30px_rgba(15,23,42,0.07)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    >
                      <div className="border-b border-slate-100 dark:border-slate-800 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">
                              {ev.name}
                            </h3>
                            {ev.venue && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                <span className="truncate">{ev.venue}</span>
                              </p>
                            )}
                          </div>
                          <EventStatusBadge status="in_progress" />
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            {
                              icon: "how_to_reg",
                              label: "Checked In",
                              value: ev.stats.checkedIn,
                              color: "text-emerald-700 dark:text-emerald-300",
                            },
                            {
                              icon: "group",
                              label: "Total Guests",
                              value: ev.stats.totalGuests,
                              color: "text-blue-700 dark:text-blue-300",
                            },
                            {
                              icon: "room_service",
                              label: "Open Services",
                              value: ev.stats.openServices,
                              color: ev.stats.openServices > 0 ? "text-amber-700 dark:text-amber-300" : "text-slate-500 dark:text-slate-400",
                            },
                            {
                              icon: "local_shipping",
                              label: "Transport",
                              value: ev.stats.activeTransport,
                              color: "text-indigo-700 dark:text-indigo-300",
                            },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className={`material-symbols-outlined text-[17px] ${stat.color}`}>
                                  {stat.icon}
                                </span>
                                <p className={`text-xl font-extrabold ${stat.color}`}>
                                  {stat.value}
                                </p>
                              </div>
                              <p className="mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              Check-in progress
                            </span>
                            <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">
                              {ev.stats.checkInRate}%
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-700"
                              style={{ width: `${ev.stats.checkInRate}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to={`/events/${ev._id}/overview`}
                          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                        >
                          Manage Event
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Activity + events ── */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {/* Recent activity */}
              <div className="flex min-h-[480px] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 dark:text-slate-500">
                      Timeline
                    </p>
                    <h2 className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-slate-100">
                      Recent Activity
                    </h2>
                  </div>

                  <button
                    onClick={() => fetchData(true)}
                    disabled={refreshing}
                    className="rounded-lg px-2 py-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 transition hover:bg-blue-50 dark:hover:bg-blue-500/10 disabled:opacity-50"
                  >
                    {refreshing ? "Refreshing…" : "Refresh"}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                  {recentActivity.length === 0 ? (
                    <EmptyState
                      icon="dynamic_feed"
                      title="No activity yet"
                      desc="Activity will appear once operations begin."
                    />
                  ) : (
                    <div>
                      {paginatedActivity.map((log) => (
                        <ActivityItem key={log._id} log={log} />
                      ))}
                    </div>
                  )}
                </div>

                {totalActivityPages > 1 && (
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span>
                      Page {activityPage + 1} of {totalActivityPages}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setActivityPage((p) => Math.max(0, p - 1))}
                        disabled={activityPage === 0}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined text-[17px]">chevron_left</span>
                      </button>
                      <button
                        onClick={() =>
                          setActivityPage((p) =>
                            Math.min(totalActivityPages - 1, p + 1),
                          )
                        }
                        disabled={activityPage === totalActivityPages - 1}
                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined text-[17px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Events */}
              <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none xl:col-span-2">
                <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 dark:text-slate-500">
                        Schedule
                      </p>
                      <h2 className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-slate-100">
                        Events
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[17px] text-slate-400 dark:text-slate-500">
                          search
                        </span>
                        <input
                          value={eventSearch}
                          onChange={(e) => setEventSearch(e.target.value)}
                          placeholder="Search events..."
                          className="h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-100 sm:w-44"
                        />
                      </div>

                      <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                        {["all", "in_progress", "upcoming", "completed"].map((s) => (
                          <button
                            key={s}
                            onClick={() => setEventStatusFilter(s)}
                            className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold transition ${
                              eventStatusFilter === s
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                          >
                            {s === "all"
                              ? "All"
                              : s === "in_progress"
                                ? "Live"
                                : s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>

                      <Link
                        to="/events"
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        View all
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
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
                          <Link
                            to="/create-event"
                            className="mt-5 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-xs font-bold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                          >
                            Create Event
                          </Link>
                        ) : null
                      }
                    />
                  ) : (
                    <table className="w-full min-w-[680px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
                          {["Event Name", "Venue", "Date", "Status", ""].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400 dark:text-slate-500"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredEvents.map((ev) => (
                          <tr
                            key={ev._id}
                            className="group border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                  <span className="material-symbols-outlined text-[17px]">
                                    calendar_today
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <div className="max-w-[190px] truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                                    {ev.name}
                                  </div>
                                  {ev.isPrivate && (
                                    <div className="mt-0.5 flex items-center gap-0.5 text-[9px] font-medium text-slate-400 dark:text-slate-500">
                                      <span className="material-symbols-outlined text-[12px]">lock</span>
                                      Private
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="max-w-[180px] truncate px-5 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                              {ev.venue || "—"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                              {fmtDate(ev.startDate)}
                              {ev.endDate && ` – ${fmtDate(ev.endDate)}`}
                            </td>

                            <td className="px-5 py-4">
                              <EventStatusBadge status={ev.status} />
                            </td>

                            <td className="px-5 py-4 text-right">
                              <Link
                                to={`/events/${ev._id}/overview`}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 opacity-0 transition group-hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                              >
                                Manage
                                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {filteredEvents.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    <span>
                      Showing {filteredEvents.length} of {upcomingEvents.length} events
                    </span>
                    <Link to="/events" className="font-bold text-blue-700 dark:text-blue-300 hover:underline">
                      See all events
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* ── Operational summary ── */}
            <section className="mt-8">
              <SectionHeader eyebrow="Operational health" title="Overview & quick actions" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* Check-in */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Overall Check-in</p>
                      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">Across all events</p>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <span className="material-symbols-outlined text-[19px]">how_to_reg</span>
                    </div>
                  </div>

                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                      {metrics.checkedInGuests ?? 0}
                    </span>
                    <span className="pb-1 text-sm font-medium text-slate-400 dark:text-slate-500">
                      / {metrics.totalGuests ?? 0}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{
                        width: `${
                          metrics.totalGuests
                            ? Math.round(
                                (metrics.checkedInGuests / metrics.totalGuests) * 100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {metrics.totalGuests
                      ? `${Math.round(
                          (metrics.checkedInGuests / metrics.totalGuests) * 100,
                        )}% check-in rate across all events`
                      : "No guests registered yet"}
                  </p>
                </div>

                {/* Event breakdown */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Event Breakdown</p>
                      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">Current portfolio status</p>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      <span className="material-symbols-outlined text-[19px]">pie_chart</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Live Now",
                        value: metrics.activeEvents,
                        color: "bg-emerald-500",
                        textColor: "text-emerald-700 dark:text-emerald-300",
                      },
                      {
                        label: "Upcoming",
                        value: metrics.upcomingEventsCount,
                        color: "bg-blue-600 dark:bg-blue-500",
                        textColor: "text-blue-700 dark:text-blue-300",
                      },
                      {
                        label: "Completed",
                        value: metrics.completedEvents,
                        color: "bg-slate-400 dark:bg-slate-500",
                        textColor: "text-slate-600 dark:text-slate-400",
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-1.5 flex justify-between text-[11px]">
                          <span className="font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                          <span className={`font-extrabold ${item.textColor}`}>
                            {item.value ?? 0}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                            style={{
                              width: `${
                                metrics.totalEvents
                                  ? Math.round(
                                      ((item.value || 0) / metrics.totalEvents) * 100,
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

                {/* Quick actions */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:shadow-none">
                  <div className="mb-4">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Quick Actions</p>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">Jump to common workflows</p>
                  </div>

                  <div className="space-y-1">
                    {[
                      {
                        icon: "add_circle",
                        label: "Create New Event",
                        to: "/create-event",
                        accent: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10",
                      },
                      {
                        icon: "calendar_today",
                        label: "View All Events",
                        to: "/events",
                        accent: "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10",
                      },
                      {
                        icon: "analytics",
                        label: "Analytics & Reports",
                        to: "/analytics",
                        accent: "text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10",
                      },
                      {
                        icon: "settings",
                        label: "Platform Settings",
                        to: "/settings",
                        accent: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
                      },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <span
                          className={`flex size-8 items-center justify-center rounded-lg ${item.accent}`}
                        >
                          <span className="material-symbols-outlined text-[17px]">
                            {item.icon}
                          </span>
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-950 dark:group-hover:text-slate-50">
                          {item.label}
                        </span>
                        <span className="material-symbols-outlined ml-auto text-[16px] text-slate-300 dark:text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                          arrow_forward
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}


export default MainOprationDashboard;