import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventSummary, getEventKPIs } from "../../api/specificEventSummaryApi";
import { EventContext } from "../../context/EventContext";

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent = "primary", pulse = false }) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`size-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {pulse && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, colorClass = "bg-primary" }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
        <div>
          <h3 className="font-display text-card-h3 text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function Badge({ label, variant = "default" }) {
  const variants = {
    default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}>
      {label}
    </span>
  );
}

function ActivityItem({ log }) {
  const typeConfig = {
    "check-in": { icon: "how_to_reg", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    "check-out": { icon: "logout", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" },
    registration: { icon: "person_add", color: "text-primary", bg: "bg-primary/10" },
    service: { icon: "room_service", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    transport: { icon: "local_shipping", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    "room-assignment": { icon: "meeting_room", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    schedule: { icon: "schedule", color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20" },
  };
  const cfg = typeConfig[log.type] || { icon: "info", color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" };
  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <span className={`material-symbols-outlined text-lg ${cfg.color}`}>{cfg.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight line-clamp-1">
          {log.message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {log.priority === "high" || log.priority === "critical" ? (
            <Badge label={log.priority} variant="danger" />
          ) : null}
          <span className="text-[11px] text-slate-400">{timeAgo(log.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ item }) {
  const statusVariant = {
    Confirmed: "success",
    Active: "info",
    Pending: "warning",
    Cancelled: "danger",
  };
  const workstreamColors = {
    "Main Sessions": "border-l-primary",
    Transport: "border-l-amber-500",
    Catering: "border-l-emerald-500",
    Staffing: "border-l-purple-500",
    "Media/AV": "border-l-rose-500",
  };
  const fmt = (d) =>
    new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`border-l-4 ${workstreamColors[item.workstream] || "border-l-slate-300"} pl-3 py-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{item.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {fmt(item.startTime)} – {fmt(item.endTime)}
            {item.location && ` • ${item.location}`}
          </p>
        </div>
        <Badge label={item.status} variant={statusVariant[item.status] || "default"} />
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <Skeleton className="size-10 rounded-lg mb-3" />
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <Skeleton className="size-9 rounded-lg shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <Skeleton className="h-5 w-32 mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-4">
              <Skeleton className="h-3 w-28 mb-1" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
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
  useEffect(() => {
    if (!eventId) return;
    const interval = setInterval(async () => {
      try {
        const res = await getEventKPIs(eventId);
        if (res.success && data) {
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
                    services: {
                      ...prev.summary.services,
                      open: res.kpis.openServices,
                    },
                    transport: {
                      ...prev.summary.transport,
                      activeCount: res.kpis.activeTransports,
                    },
                    team: {
                      ...prev.summary.team,
                      active: res.kpis.activeStaff,
                    },
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
  }, [eventId, data]);

  // ── helpers ──────────────────────────────────────────────────────────────
  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const fmtTime = (d) =>
    d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

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

  const serviceTypeLabel = {
    housekeeping: "Housekeeping",
    maintenance: "Maintenance",
    fb: "Food & Beverage",
    valet: "Valet",
    other: "Other",
  };

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <span className="text-slate-500 font-medium">Loading event summary...</span>
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-8 flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <div>
            <h3 className="text-lg font-bold text-red-900 dark:text-red-200">Failed to load summary</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { event, summary } = data;
  const status = getEventStatus(event);

  const statusBadge = {
    live: (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
        <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
        Live
      </span>
    ),
    upcoming: (
      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
        Upcoming
      </span>
    ),
    completed: (
      <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold uppercase">
        Completed
      </span>
    ),
    active: (
      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
        Active
      </span>
    ),
  };

  const tabs = [
    { key: "overview", icon: "dashboard", label: "Overview" },
    { key: "guests", icon: "group", label: "Guests" },
    { key: "operations", icon: "settings", label: "Operations" },
    { key: "schedule", icon: "schedule", label: "Schedule" },
    { key: "activity", icon: "timeline", label: "Activity" },
  ];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-page-h1 text-slate-900 dark:text-white">
                {event?.name || "Event Summary"}
              </h1>
              {statusBadge[status]}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {event?.venue && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {event.venue}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {fmtDate(event?.startDate)}
                {event?.endDate && ` – ${fmtDate(event.endDate)}`}
              </span>
              {event?.isPrivate && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">lock</span>
                  Private
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {eventId && (
              <Link
                to={`/reports/${eventId}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">analytics</span>
                Get Full Report
              </Link>
            )}
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Updated {fmtTime(lastUpdated)}
              </span>
            )}
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-lg ${refreshing ? "animate-spin" : ""}`}>
                refresh
              </span>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 justify-center ${
              activeTab === t.key
                ? "bg-white dark:bg-slate-900 text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="group"
              label="Total Guests"
              value={summary.guests.total}
              sub={`${summary.guests.checkInRate}% checked in`}
              accent="primary"
              pulse={status === "live"}
            />
            <StatCard
              icon="how_to_reg"
              label="Checked In"
              value={summary.guests.checkedIn}
              sub={`${summary.guests.notCheckedIn} remaining`}
              accent="green"
            />
            <StatCard
              icon="pending_actions"
              label="Open Services"
              value={summary.services.open + summary.services.inProgress}
              sub={`${summary.services.urgent} urgent`}
              accent={summary.services.urgent > 0 ? "red" : "amber"}
            />
            <StatCard
              icon="directions_car"
              label="Active Transport"
              value={summary.transport.activeCount}
              sub={`${summary.transport.today} today`}
              accent="indigo"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="meeting_room"
              label="Rooms"
              value={`${summary.rooms.occupied}/${summary.rooms.total}`}
              sub={`${summary.rooms.occupancyRate}% occupancy`}
              accent="purple"
            />
            <StatCard
              icon="groups"
              label="Active Staff"
              value={summary.team.active}
              sub={`${summary.team.total} total`}
              accent="green"
            />
            <StatCard
              icon="schedule"
              label="Today's Schedule"
              value={summary.schedule.todaysItems.length}
              sub={`${summary.schedule.total} total activities`}
              accent="primary"
            />
            <StatCard
              icon="star"
              label="VIP Guests"
              value={summary.guests.vip}
              sub={`of ${summary.guests.total} total`}
              accent="amber"
            />
          </div>

          {/* Check-in progress */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <SectionHeader icon="how_to_reg" title="Check-in Progress" subtitle="Real-time guest arrival tracking" />
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {summary.guests.checkedIn} of {summary.guests.total} guests checked in
                </span>
                <span className="font-bold text-primary">{summary.guests.checkInRate}%</span>
              </div>
              <ProgressBar value={summary.guests.checkedIn} max={summary.guests.total} colorClass="bg-primary" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                {[
                  { label: "Checked In", value: summary.guests.checkedIn, color: "text-emerald-600" },
                  { label: "Pending", value: summary.guests.notCheckedIn, color: "text-amber-600" },
                  { label: "Arriving Today", value: summary.guests.arrivingToday, color: "text-primary" },
                  { label: "Departing Today", value: summary.guests.departingToday, color: "text-slate-600" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column: Activity + Today's Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader
                icon="dynamic_feed"
                title="Recent Activity"
                subtitle="Latest operational events"
                action={
                  <div className="flex items-center gap-1">
                    <span className="size-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Live</span>
                  </div>
                }
              />
              <div className="space-y-1 max-h-[320px] overflow-y-auto">
                {summary.activity.recent.length > 0 ? (
                  summary.activity.recent.map((log) => (
                    <ActivityItem key={log._id} log={log} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                    <p className="text-sm font-medium">No activity yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader
                icon="today"
                title="Today's Schedule"
                subtitle={`${summary.schedule.todaysItems.length} items today`}
              />
              <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {summary.schedule.todaysItems.length > 0 ? (
                  summary.schedule.todaysItems.map((item) => (
                    <ScheduleItem key={item._id} item={item} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                    <p className="text-sm font-medium">No activities scheduled today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GUESTS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "guests" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guest Breakdown Card */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="group" title="Guest Breakdown" subtitle="Arrival & check-in status" />
              <div className="space-y-4">
                {[
                  { label: "Checked In", value: summary.guests.checkedIn, max: summary.guests.total, color: "bg-emerald-500" },
                  { label: "Not Yet Arrived", value: summary.guests.notCheckedIn - summary.guests.arrivingToday, max: summary.guests.total, color: "bg-slate-300 dark:bg-slate-600" },
                  { label: "Arriving Today", value: summary.guests.arrivingToday, max: summary.guests.total, color: "bg-primary" },
                  { label: "Departing Today", value: summary.guests.departingToday, max: summary.guests.total, color: "bg-amber-400" },
                  { label: "VIP Guests", value: summary.guests.vip, max: summary.guests.total, color: "bg-yellow-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.value}
                        <span className="text-slate-400 font-normal ml-1">
                          ({item.max > 0 ? Math.round((Math.max(item.value,0) / item.max) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                    <ProgressBar value={Math.max(item.value, 0)} max={item.max} colorClass={item.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Summary Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4">
              <SectionHeader icon="bar_chart" title="Quick Stats" />
              <div className="space-y-3">
                {[
                  { icon: "groups", label: "Total Registered", value: summary.guests.total, accent: "text-primary" },
                  { icon: "how_to_reg", label: "Check-in Rate", value: `${summary.guests.checkInRate}%`, accent: "text-emerald-600" },
                  { icon: "star", label: "VIP Count", value: summary.guests.vip, accent: "text-amber-500" },
                  { icon: "flight_land", label: "Arriving Today", value: summary.guests.arrivingToday, accent: "text-primary" },
                  { icon: "flight_takeoff", label: "Departing Today", value: summary.guests.departingToday, accent: "text-slate-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-base">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className={`text-sm font-black ${item.accent}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Check-in Trend (hourly) */}
          {summary.trends.checkInByHour.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="trending_up" title="Check-in Trend" subtitle="Arrivals by hour (last 12h)" />
              <div className="flex items-end gap-1.5 h-32 mt-4">
                {summary.trends.checkInByHour.map((item, i) => {
                  const maxCount = Math.max(...summary.trends.checkInByHour.map((x) => x.count), 1);
                  const heightPct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1" title={`${item.hour}:00 — ${item.count} check-ins`}>
                      <span className="text-[10px] font-bold text-slate-500">{item.count}</span>
                      <div
                        className="w-full bg-primary rounded-t transition-all duration-500"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                      <span className="text-[9px] text-slate-400">{String(item.hour).padStart(2, "0")}h</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          OPERATIONS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "operations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service Requests */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="room_service" title="Service Requests" subtitle="All request statuses" />
              <div className="space-y-3 mt-2">
                {[
                  { label: "Open", value: summary.services.open, variant: "warning", icon: "fiber_new" },
                  { label: "In Progress", value: summary.services.inProgress, variant: "info", icon: "run_circle" },
                  { label: "Completed", value: summary.services.completed, variant: "success", icon: "check_circle" },
                  { label: "Cancelled", value: summary.services.cancelled, variant: "default", icon: "cancel" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-slate-400">{item.icon}</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                      <Badge label={item.label} variant={item.variant} />
                    </div>
                  </div>
                ))}
                {summary.services.urgent > 0 && (
                  <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30">
                    <span className="material-symbols-outlined text-red-600 text-base">priority_high</span>
                    <span className="text-sm font-bold text-red-700 dark:text-red-400">
                      {summary.services.urgent} urgent request{summary.services.urgent !== 1 ? "s" : ""} need attention
                    </span>
                  </div>
                )}
              </div>
              {/* Type Breakdown */}
              {Object.keys(summary.services.typeBreakdown).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">By Type</p>
                  <div className="space-y-2">
                    {Object.entries(summary.services.typeBreakdown).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">
                          {serviceTypeLabel[type] || type}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Transport */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="local_shipping" title="Transport" subtitle="Fleet coordination status" />
              <div className="space-y-3 mt-2">
                {[
                  { label: "Scheduled", value: summary.transport.scheduled, icon: "schedule", color: "text-slate-500" },
                  { label: "In Transit", value: summary.transport.inTransit, icon: "airport_shuttle", color: "text-primary" },
                  { label: "Arrived", value: summary.transport.arrived, icon: "check_circle", color: "text-emerald-600" },
                  { label: "Cancelled", value: summary.transport.cancelled, icon: "cancel", color: "text-slate-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-base ${item.color}`}>{item.icon}</span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Completion Rate</span>
                  <span className="font-bold">
                    {summary.transport.total > 0
                      ? Math.round((summary.transport.arrived / summary.transport.total) * 100)
                      : 0}%
                  </span>
                </div>
                <ProgressBar
                  value={summary.transport.arrived}
                  max={summary.transport.total}
                  colorClass="bg-emerald-500"
                />
              </div>
            </div>

            {/* Rooms */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="meeting_room" title="Room Inventory" subtitle="Occupancy overview" />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-4xl font-black text-primary">{summary.rooms.occupancyRate}%</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Occupancy Rate</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Total Rooms", value: summary.rooms.total },
                    { label: "Occupied", value: summary.rooms.occupied },
                    { label: "Available", value: summary.rooms.available },
                    { label: "Total Capacity", value: summary.rooms.totalCapacity },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                      <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
                {Object.keys(summary.rooms.typeBreakdown).length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">By Type</p>
                    {Object.entries(summary.rooms.typeBreakdown).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-xs py-1">
                        <span className="capitalize text-slate-600 dark:text-slate-400">{type}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <SectionHeader icon="badge" title="Team Overview" subtitle="Staff on duty and role distribution" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {summary.team.active} of {summary.team.total} staff active
                  </span>
                  <span className="font-bold text-emerald-600">{summary.team.activeRate}%</span>
                </div>
                <ProgressBar value={summary.team.active} max={summary.team.total} colorClass="bg-emerald-500" />
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Staff", value: summary.team.total, color: "text-slate-900 dark:text-white" },
                    { label: "On Duty", value: summary.team.active, color: "text-emerald-600" },
                    { label: "Off Duty", value: summary.team.inactive, color: "text-slate-400" },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                      <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Roles</p>
                {summary.team.roleDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {summary.team.roleDistribution.map((item) => (
                      <div key={item.role} className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-700 dark:text-slate-300">{item.role || "Unassigned"}</span>
                            <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                          </div>
                          <ProgressBar
                            value={item.count}
                            max={summary.team.total}
                            colorClass="bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No role data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCHEDULE TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total", value: summary.schedule.total, color: "text-slate-900 dark:text-white" },
              { label: "Confirmed", value: summary.schedule.confirmed, color: "text-emerald-600" },
              { label: "Active", value: summary.schedule.active, color: "text-primary" },
              { label: "Pending", value: summary.schedule.pending, color: "text-amber-600" },
              { label: "Cancelled", value: summary.schedule.cancelled, color: "text-slate-400" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center shadow-sm">
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's full list */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="today" title="Today's Activities" subtitle={`${summary.schedule.todaysItems.length} items scheduled`} />
              {summary.schedule.todaysItems.length > 0 ? (
                <div className="space-y-3">
                  {summary.schedule.todaysItems.map((item) => (
                    <ScheduleItem key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3">event_available</span>
                  <p className="font-medium">No activities scheduled for today</p>
                </div>
              )}
            </div>

            {/* Workstream breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="category" title="Workstreams" subtitle="Activity distribution" />
              {summary.schedule.workstreamBreakdown.length > 0 ? (
                <div className="space-y-4 mt-2">
                  {summary.schedule.workstreamBreakdown.map((item) => {
                    const colorMap = {
                      "Main Sessions": "bg-primary",
                      Transport: "bg-amber-500",
                      Catering: "bg-emerald-500",
                      Staffing: "bg-purple-500",
                      "Media/AV": "bg-rose-500",
                    };
                    return (
                      <div key={item.workstream}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.workstream}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                        </div>
                        <ProgressBar
                          value={item.count}
                          max={summary.schedule.total}
                          colorClass={colorMap[item.workstream] || "bg-slate-400"}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400 mt-4">No workstream data</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ACTIVITY TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "activity" && (
        <div className="space-y-6">
          {/* Activity KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="history" label="Total Logs" value={summary.activity.total} accent="primary" />
            <StatCard
              icon="priority_high"
              label="Critical Today"
              value={summary.activity.criticalToday}
              accent={summary.activity.criticalToday > 0 ? "red" : "green"}
            />
            <StatCard
              icon="how_to_reg"
              label="Check-in Events"
              value={summary.activity.byType?.["check-in"] || 0}
              accent="green"
            />
            <StatCard
              icon="room_service"
              label="Service Events"
              value={summary.activity.byType?.["service"] || 0}
              accent="amber"
            />
          </div>

          {/* Activity by type breakdown */}
          {Object.keys(summary.activity.byType).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <SectionHeader icon="bar_chart" title="Activity by Type" subtitle="All recorded log categories" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {Object.entries(summary.activity.byType).map(([type, count]) => {
                  const typeIcons = {
                    "check-in": { icon: "how_to_reg", accent: "green" },
                    "check-out": { icon: "logout", accent: "primary" },
                    registration: { icon: "person_add", accent: "primary" },
                    service: { icon: "room_service", accent: "amber" },
                    transport: { icon: "local_shipping", accent: "indigo" },
                    "room-assignment": { icon: "meeting_room", accent: "purple" },
                    schedule: { icon: "schedule", accent: "primary" },
                  };
                  const cfg = typeIcons[type] || { icon: "info", accent: "primary" };
                  return (
                    <StatCard
                      key={type}
                      icon={cfg.icon}
                      label={type.replace(/-/g, " ")}
                      value={count}
                      accent={cfg.accent}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Full activity feed */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <SectionHeader
              icon="timeline"
              title="Activity Feed"
              subtitle="Most recent 10 operational events"
              action={
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-base ${refreshing ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  Refresh
                </button>
              }
            />
            <div className="space-y-1">
              {summary.activity.recent.length > 0 ? (
                summary.activity.recent.map((log) => (
                  <ActivityItem key={log._id} log={log} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <span className="material-symbols-outlined text-5xl mb-3">timeline</span>
                  <p className="font-medium">No activity recorded yet</p>
                  <p className="text-sm mt-1">Activity will appear here as operations begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventSummaryDashboards;