import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventSummary, getEventKPIs } from "../../api/specificEventSummaryApi";
import { EventContext } from "../../context/EventContext";

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";
const BTN_PRIMARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
const BTN_SECONDARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

const TONE_CHIP = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const TONE_TEXT = {
  blue: "text-blue-700 dark:text-blue-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  amber: "text-amber-700 dark:text-amber-300",
  red: "text-red-700 dark:text-red-300",
  violet: "text-violet-700 dark:text-violet-300",
  indigo: "text-indigo-700 dark:text-indigo-300",
  slate: "text-slate-600 dark:text-slate-300",
};

const TONE_BAR = {
  blue: "bg-blue-600 dark:bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-400",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  slate: "bg-slate-300 dark:bg-slate-600",
};

const SERVICE_TYPE_LABEL = {
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
  fb: "Food & Beverage",
  valet: "Valet",
  other: "Other",
};

const SCHEDULE_STATUS = {
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  Active: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
  Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  Cancelled: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
};

const WORKSTREAM_BORDER = {
  "Main Sessions": "border-l-blue-600 dark:border-l-blue-400",
  Transport: "border-l-amber-500",
  Catering: "border-l-emerald-500",
  Staffing: "border-l-violet-500",
  "Media/AV": "border-l-rose-500",
};

const WORKSTREAM_BAR = {
  "Main Sessions": "blue",
  Transport: "amber",
  Catering: "emerald",
  Staffing: "violet",
  "Media/AV": "rose",
};

const ACTIVITY_TYPES = {
  "check-in": { icon: "how_to_reg", tone: "emerald" },
  "check-out": { icon: "logout", tone: "slate" },
  registration: { icon: "person_add", tone: "blue" },
  service: { icon: "room_service", tone: "amber" },
  transport: { icon: "local_shipping", tone: "indigo" },
  "room-assignment": { icon: "meeting_room", tone: "violet" },
  schedule: { icon: "schedule", tone: "teal" },
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";
const fmtTime = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");
const timeAgo = (ts) => {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (Number.isNaN(m)) return "";
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Building blocks ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function Card({ icon, title, subtitle, action, children, className = "" }) {
  return (
    <section className={`flex min-w-0 flex-col ${CARD} ${className}`}>
      <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="material-symbols-outlined text-[19px]">{icon}</span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h3>
            {subtitle && <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="flex-1 p-5 pt-4 sm:p-6 sm:pt-5">{children}</div>
    </section>
  );
}

function StatCard({ icon, label, value, sub, tone = "blue", live = false }) {
  return (
    <div className={`p-5 ${CARD}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONE_CHIP[tone]}`}>
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">{value}</p>
        {live && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        )}
      </div>
      {sub && <p className="mt-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

function StatStrip({ items, cols = 4 }) {
  const colCls = cols === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none ${colCls}`}>
      {items.map((it) => (
        <div key={it.label} className="bg-white p-4 dark:bg-slate-900 sm:p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            {it.icon && <span className={`material-symbols-outlined text-[16px] ${TONE_TEXT[it.tone] || ""}`}>{it.icon}</span>}
            {it.label}
          </p>
          <p className="mt-2 text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50 sm:text-[28px]">
            {it.value}
          </p>
          {it.sub && <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">{it.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function ProgressRow({ label, value = 0, max = 0, tone = "blue", showPct = true }) {
  const v = Math.max(Number(value) || 0, 0);
  const pct = max > 0 ? Math.min(Math.round((v / max) * 100), 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        <span className="shrink-0 font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
          {v}
          {showPct && <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{pct}%</span>}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={`h-full rounded-full transition-all duration-700 ${TONE_BAR[tone] || TONE_BAR.blue}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, tone }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 text-sm last:border-0 dark:border-slate-800">
      <span className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
        {icon && <span className="material-symbols-outlined text-[18px] text-slate-400">{icon}</span>}
        {label}
      </span>
      <span className={`font-extrabold tabular-nums ${tone ? TONE_TEXT[tone] : "text-slate-900 dark:text-slate-100"}`}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, tone = "slate" }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3.5 text-center dark:bg-slate-800/60">
      <p className={`text-xl font-extrabold tabular-nums ${TONE_TEXT[tone]}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function EmptyState({ icon = "inbox", message, hint }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{message}</p>
      {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

function ActivityItem({ log }) {
  const cfg = ACTIVITY_TYPES[log.type] || { icon: "info", tone: "slate" };
  const critical = log.priority === "high" || log.priority === "critical";
  return (
    <div className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONE_CHIP[cfg.tone]}`}>
        <span className="material-symbols-outlined text-[19px]">{cfg.icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">{log.message}</p>
        <div className="mt-1 flex items-center gap-2">
          {critical && (
            <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              {log.priority}
            </span>
          )}
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{timeAgo(log.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ item }) {
  return (
    <div className={`rounded-xl border border-slate-100 border-l-4 bg-slate-50/60 py-2.5 pl-3.5 pr-3 dark:border-slate-800 dark:bg-slate-800/30 ${WORKSTREAM_BORDER[item.workstream] || "border-l-slate-300"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {fmtTime(item.startTime)} – {fmtTime(item.endTime)}
            {item.location && ` · ${item.location}`}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            SCHEDULE_STATUS[item.status] || "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-36 p-5 ${CARD}`}>
            <Skeleton className="mb-4 h-3 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className={`h-80 p-6 ${CARD}`}>
            <Skeleton className="mb-5 h-5 w-40" />
            {[...Array(4)].map((__, j) => (
              <Skeleton key={j} className="mb-3 h-10 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
function EventSummaryDashboards() {
  const { eventId: paramEventId } = useParams();
  const { event: contextEvent } = useContext(EventContext) || {};
  const eventId = paramEventId || contextEvent?._id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // ── fetch full data ──────────────────────────────────────────────────────
  const fetchData = useCallback(
    async (quiet = false) => {
      if (!eventId) {
        setError("No event selected. Please navigate to an event workspace.");
        setLoading(false);
        return;
      }
      try {
        if (!quiet) setLoading(true);
        else setRefreshing(true);
        setError(null);

        const res = await getEventSummary(eventId);
        if (res.success) {
          setData(res);
          setLastUpdated(new Date());
        } else {
          setError(res.message || "Failed to load event summary");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh KPIs every 60 seconds
  const hasData = !!data;
  useEffect(() => {
    if (!eventId || !hasData) return undefined;
    const interval = setInterval(async () => {
      try {
        const res = await getEventKPIs(eventId);
        if (res.success) {
          setData((prev) =>
            prev
              ? {
                  ...prev,
                  summary: {
                    ...prev.summary,
                    guests: {
                      ...prev.summary.guests,
                      checkedIn: res.kpis.checkedIn,
                      checkInRate: res.kpis.checkInRate,
                      total: res.kpis.totalGuests,
                    },
                    services: { ...prev.summary.services, open: res.kpis.openServices },
                    transport: { ...prev.summary.transport, activeCount: res.kpis.activeTransports },
                    team: { ...prev.summary.team, active: res.kpis.activeStaff },
                  },
                }
              : prev
          );
          setLastUpdated(new Date());
        }
      } catch (_) {
        // silent fail for background refresh
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [eventId, hasData]);

  const getEventStatus = (event) => {
    if (!event) return "unknown";
    const now = new Date();
    const start = event.startDate ? new Date(event.startDate) : null;
    const end = event.endDate ? new Date(event.endDate) : null;
    if (start && end && now >= start && now <= end) return "live";
    if (start && now < start) return "upcoming";
    if (end && now > end) return "completed";
    return "active";
  };

  const tabs = [
    { key: "overview", icon: "dashboard", label: "Overview" },
    { key: "guests", icon: "group", label: "Guests" },
    { key: "operations", icon: "settings", label: "Operations" },
    { key: "schedule", icon: "schedule", label: "Schedule" },
    { key: "activity", icon: "timeline", label: "Activity" },
  ];

  // ── Loading / error ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span className="material-symbols-outlined text-[25px]">error</span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Failed to load summary</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
        <button onClick={() => fetchData()} className={`${BTN_PRIMARY} mt-6`}>
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { event, summary } = data;
  const status = getEventStatus(event);
  const g = summary.guests || {};
  const sv = summary.services || {};
  const tr = summary.transport || {};
  const rm = summary.rooms || {};
  const tm = summary.team || {};
  const sc = summary.schedule || {};
  const ac = summary.activity || {};
  const trends = summary.trends || {};

  const todaysItems = sc.todaysItems || [];
  const recent = ac.recent || [];
  const activityByType = ac.byType || {};
  const hourly = trends.checkInByHour || [];
  const maxHourly = Math.max(...hourly.map((x) => x.count), 1);
  const notYetArrived = Math.max((g.notCheckedIn || 0) - (g.arrivingToday || 0), 0);
  const transportRate = tr.total > 0 ? Math.round((tr.arrived / tr.total) * 100) : 0;

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Reports</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">Event summary</h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Operational snapshot for {event?.name || "this event"}
            {lastUpdated && <span className="text-slate-400 dark:text-slate-500"> · Updated {fmtTime(lastUpdated)}</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => fetchData(true)} disabled={refreshing} className={BTN_SECONDARY}>
            <span className={`material-symbols-outlined text-[19px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          {eventId && (
            <Link to={`/reports/${eventId}`} className={BTN_PRIMARY}>
              <span className="material-symbols-outlined text-[19px]">analytics</span>
              Get full report
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => fetchData(true)} className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Section switcher */}
      <div className="flex w-fit max-w-full overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800" role="tablist" aria-label="Summary sections">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              activeTab === t.key
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div aria-busy={refreshing} className={`transition-opacity ${refreshing ? "opacity-60" : ""}`}>
        {/* ═════════ OVERVIEW ═════════ */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon="group" label="Total guests" value={g.total ?? 0} sub={`${g.checkInRate ?? 0}% checked in`} tone="blue" live={status === "live"} />
              <StatCard icon="how_to_reg" label="Checked in" value={g.checkedIn ?? 0} sub={`${g.notCheckedIn ?? 0} remaining`} tone="emerald" />
              <StatCard
                icon="pending_actions"
                label="Open services"
                value={(sv.open || 0) + (sv.inProgress || 0)}
                sub={`${sv.urgent || 0} urgent`}
                tone={sv.urgent > 0 ? "red" : "amber"}
              />
              <StatCard icon="directions_car" label="Active transport" value={tr.activeCount ?? 0} sub={`${tr.today ?? 0} today`} tone="indigo" />
            </div>

            <StatStrip
              items={[
                { icon: "meeting_room", label: "Rooms", value: `${rm.occupied ?? 0}/${rm.total ?? 0}`, sub: `${rm.occupancyRate ?? 0}% occupancy`, tone: "violet" },
                { icon: "groups", label: "Active staff", value: tm.active ?? 0, sub: `${tm.total ?? 0} total`, tone: "emerald" },
                { icon: "schedule", label: "Today's schedule", value: todaysItems.length, sub: `${sc.total ?? 0} total activities`, tone: "blue" },
                { icon: "star", label: "VIP guests", value: g.vip ?? 0, sub: `of ${g.total ?? 0} total`, tone: "amber" },
              ]}
            />

            <Card icon="how_to_reg" title="Check-in progress" subtitle="Guest arrival tracking">
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {g.checkedIn ?? 0} of {g.total ?? 0} guests checked in
                </span>
                <span className="text-lg font-extrabold tabular-nums text-blue-700 dark:text-blue-300">{g.checkInRate ?? 0}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-700 dark:bg-blue-500"
                  style={{ width: `${Math.min(g.checkInRate || 0, 100)}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <MiniStat label="Checked in" value={g.checkedIn ?? 0} tone="emerald" />
                <MiniStat label="Pending" value={g.notCheckedIn ?? 0} tone="amber" />
                <MiniStat label="Arriving today" value={g.arrivingToday ?? 0} tone="blue" />
                <MiniStat label="Departing today" value={g.departingToday ?? 0} tone="slate" />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card icon="dynamic_feed" title="Recent activity" subtitle="Latest operational events">
                <div className="-mx-2 max-h-[22rem] space-y-0.5 overflow-y-auto">
                  {recent.length > 0 ? recent.map((log) => <ActivityItem key={log._id} log={log} />) : <EmptyState icon="inbox" message="No activity yet" />}
                </div>
              </Card>

              <Card icon="today" title="Today's schedule" subtitle={`${todaysItems.length} item${todaysItems.length === 1 ? "" : "s"} today`}>
                <div className="max-h-[22rem] space-y-2.5 overflow-y-auto">
                  {todaysItems.length > 0 ? (
                    todaysItems.map((item) => <ScheduleItem key={item._id} item={item} />)
                  ) : (
                    <EmptyState icon="event_busy" message="No activities scheduled today" />
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═════════ GUESTS ═════════ */}
        {activeTab === "guests" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card icon="group" title="Guest breakdown" subtitle="Arrival and check-in status" className="lg:col-span-2">
                <div className="space-y-4">
                  <ProgressRow label="Checked in" value={g.checkedIn} max={g.total} tone="emerald" />
                  <ProgressRow label="Not yet arrived" value={notYetArrived} max={g.total} tone="slate" />
                  <ProgressRow label="Arriving today" value={g.arrivingToday} max={g.total} tone="blue" />
                  <ProgressRow label="Departing today" value={g.departingToday} max={g.total} tone="amber" />
                  <ProgressRow label="VIP guests" value={g.vip} max={g.total} tone="yellow" />
                </div>
              </Card>

              <Card icon="bar_chart" title="Quick stats">
                <DetailRow icon="groups" label="Total registered" value={g.total ?? 0} tone="blue" />
                <DetailRow icon="how_to_reg" label="Check-in rate" value={`${g.checkInRate ?? 0}%`} tone="emerald" />
                <DetailRow icon="star" label="VIP count" value={g.vip ?? 0} tone="amber" />
                <DetailRow icon="flight_land" label="Arriving today" value={g.arrivingToday ?? 0} tone="blue" />
                <DetailRow icon="flight_takeoff" label="Departing today" value={g.departingToday ?? 0} />
              </Card>
            </div>

            {hourly.length > 0 && (
              <Card icon="trending_up" title="Check-in trend" subtitle="Arrivals by hour (last 12h)">
                <div className="flex h-44 items-end gap-1.5 border-b border-slate-200 pt-4 dark:border-slate-800 sm:gap-2">
                  {hourly.map((item, i) => {
                    const heightPct = Math.round((item.count / maxHourly) * 100);
                    return (
                      <div
                        key={i}
                        className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
                        title={`${String(item.hour).padStart(2, "0")}:00 — ${item.count} check-ins`}
                      >
                        <span className="text-[11px] font-bold tabular-nums text-slate-600 dark:text-slate-300">{item.count}</span>
                        <div
                          className="w-full max-w-[44px] rounded-t-md bg-blue-600 transition-all duration-500 group-hover:bg-blue-700 dark:bg-blue-500 dark:group-hover:bg-blue-400"
                          style={{ height: `${Math.max(heightPct, 3)}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-1.5 sm:gap-2">
                  {hourly.map((item, i) => (
                    <span key={i} className="flex-1 text-center text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                      {String(item.hour).padStart(2, "0")}h
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ═════════ OPERATIONS ═════════ */}
        {activeTab === "operations" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card icon="room_service" title="Service requests" subtitle="All request statuses">
                <DetailRow icon="fiber_new" label="Open" value={sv.open ?? 0} tone="amber" />
                <DetailRow icon="run_circle" label="In progress" value={sv.inProgress ?? 0} tone="blue" />
                <DetailRow icon="check_circle" label="Completed" value={sv.completed ?? 0} tone="emerald" />
                <DetailRow icon="cancel" label="Cancelled" value={sv.cancelled ?? 0} />
                {sv.urgent > 0 && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/30 dark:bg-red-500/10">
                    <span className="material-symbols-outlined text-[18px] text-red-600 dark:text-red-400">priority_high</span>
                    <span className="text-sm font-bold text-red-700 dark:text-red-300">
                      {sv.urgent} urgent request{sv.urgent !== 1 ? "s" : ""} need attention
                    </span>
                  </div>
                )}
                {Object.keys(sv.typeBreakdown || {}).length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">By type</p>
                    {Object.entries(sv.typeBreakdown).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between py-1 text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-400">{SERVICE_TYPE_LABEL[type] || type}</span>
                        <span className="font-extrabold tabular-nums text-slate-900 dark:text-slate-100">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card icon="local_shipping" title="Transport" subtitle="Fleet coordination status">
                <DetailRow icon="schedule" label="Scheduled" value={tr.scheduled ?? 0} />
                <DetailRow icon="airport_shuttle" label="In transit" value={tr.inTransit ?? 0} tone="blue" />
                <DetailRow icon="check_circle" label="Arrived" value={tr.arrived ?? 0} tone="emerald" />
                <DetailRow icon="cancel" label="Cancelled" value={tr.cancelled ?? 0} />
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <ProgressRow label="Completion rate" value={tr.arrived} max={tr.total} tone="emerald" />
                </div>
              </Card>

              <Card icon="meeting_room" title="Room inventory" subtitle="Occupancy overview">
                <div className="mb-4 rounded-xl bg-slate-50 py-5 text-center dark:bg-slate-800/60">
                  <p className="text-4xl font-extrabold tracking-tight tabular-nums text-blue-700 dark:text-blue-300">{rm.occupancyRate ?? 0}%</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Occupancy rate</p>
                </div>
                <DetailRow label="Total rooms" value={rm.total ?? 0} />
                <DetailRow label="Occupied" value={rm.occupied ?? 0} />
                <DetailRow label="Available" value={rm.available ?? 0} tone="emerald" />
                <DetailRow label="Total capacity" value={rm.totalCapacity ?? 0} />
                {Object.keys(rm.typeBreakdown || {}).length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">By type</p>
                    {Object.entries(rm.typeBreakdown).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between py-1 text-xs">
                        <span className="font-medium capitalize text-slate-600 dark:text-slate-400">{type}</span>
                        <span className="font-extrabold tabular-nums text-slate-900 dark:text-slate-100">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <Card icon="badge" title="Team overview" subtitle="Staff on duty and role distribution">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {tm.active ?? 0} of {tm.total ?? 0} staff active
                    </span>
                    <span className="font-extrabold tabular-nums text-emerald-700 dark:text-emerald-300">{tm.activeRate ?? 0}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${Math.min(tm.activeRate || 0, 100)}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <MiniStat label="Total staff" value={tm.total ?? 0} />
                    <MiniStat label="On duty" value={tm.active ?? 0} tone="emerald" />
                    <MiniStat label="Off duty" value={tm.inactive ?? 0} />
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Top roles</p>
                  {(tm.roleDistribution || []).length > 0 ? (
                    <div className="space-y-3">
                      {tm.roleDistribution.map((item) => (
                        <ProgressRow key={item.role || "unassigned"} label={item.role || "Unassigned"} value={item.count} max={tm.total} tone="blue" showPct={false} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No role data available</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═════════ SCHEDULE ═════════ */}
        {activeTab === "schedule" && (
          <div className="space-y-5">
            <StatStrip
              cols={5}
              items={[
                { icon: "event_note", label: "Total", value: sc.total ?? 0, tone: "blue" },
                { icon: "check_circle", label: "Confirmed", value: sc.confirmed ?? 0, tone: "emerald" },
                { icon: "play_circle", label: "Active", value: sc.active ?? 0, tone: "indigo" },
                { icon: "pending", label: "Pending", value: sc.pending ?? 0, tone: "amber" },
                { icon: "cancel", label: "Cancelled", value: sc.cancelled ?? 0, tone: "red" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card icon="today" title="Today's activities" subtitle={`${todaysItems.length} item${todaysItems.length === 1 ? "" : "s"} scheduled`} className="lg:col-span-2">
                {todaysItems.length > 0 ? (
                  <div className="space-y-2.5">
                    {todaysItems.map((item) => (
                      <ScheduleItem key={item._id} item={item} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="event_available" message="No activities scheduled for today" />
                )}
              </Card>

              <Card icon="category" title="Workstreams" subtitle="Activity distribution">
                {(sc.workstreamBreakdown || []).length > 0 ? (
                  <div className="space-y-4">
                    {sc.workstreamBreakdown.map((item) => (
                      <ProgressRow key={item.workstream} label={item.workstream} value={item.count} max={sc.total} tone={WORKSTREAM_BAR[item.workstream] || "slate"} showPct={false} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="category" message="No workstream data" />
                )}
              </Card>
            </div>
          </div>
        )}

        {/* ═════════ ACTIVITY ═════════ */}
        {activeTab === "activity" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "history", label: "Total logs", value: ac.total ?? 0, tone: "blue" },
                { icon: "priority_high", label: "Critical today", value: ac.criticalToday ?? 0, tone: ac.criticalToday > 0 ? "red" : "emerald" },
                { icon: "how_to_reg", label: "Check-in events", value: activityByType["check-in"] || 0, tone: "emerald" },
                { icon: "room_service", label: "Service events", value: activityByType["service"] || 0, tone: "amber" },
              ]}
            />

            {Object.keys(activityByType).length > 0 && (
              <Card icon="bar_chart" title="Activity by type" subtitle="All recorded log categories">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {Object.entries(activityByType).map(([type, count]) => {
                    const cfg = ACTIVITY_TYPES[type] || { icon: "info", tone: "slate" };
                    return (
                      <div key={type} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONE_CHIP[cfg.tone]}`}>
                          <span className="material-symbols-outlined text-[19px]">{cfg.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xl font-extrabold leading-none tabular-nums text-slate-950 dark:text-slate-50">{count}</p>
                          <p className="mt-1 truncate text-[11px] font-semibold capitalize text-slate-500 dark:text-slate-400">{type.replace(/-/g, " ")}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            <Card
              icon="timeline"
              title="Activity feed"
              subtitle="Most recent 10 operational events"
              action={
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
                >
                  <span className={`material-symbols-outlined text-[16px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
                  Refresh
                </button>
              }
            >
              <div className="-mx-2 space-y-0.5">
                {recent.length > 0 ? (
                  recent.map((log) => <ActivityItem key={log._id} log={log} />)
                ) : (
                  <EmptyState icon="timeline" message="No activity recorded yet" hint="Activity will appear here as operations begin." />
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventSummaryDashboards;