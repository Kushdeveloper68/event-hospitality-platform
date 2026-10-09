import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById } from "../../api/eventApi";
import { getOverviewData } from "../../api/overViewApi";
import { getRooms } from "../../api/roomApi";
import { exportEventWorkbook } from "../../api/eventAnalyticsReportsApi";
import { EventContext } from "../../context/EventContext";
// Pages shown in tabs
import GuestMasterList from "../inventory/GuestMasterList";
import RoomInventoryManagement from "../inventory/RoomInventoryManagement";
import CheckInOprationDesk from "../inventory/CheckInOprationDesk";
import TransportCoordinationLogs from "../inventory/TransportCoordinationLogs";
import ServiceRequestLogs from "../inventory/ServiceRequestLogs";
import OprationalEventSchedule from "./OprationalEventSchedule";
import EventSummaryDashboards from "./EventSummaryDashboards";
import EventAdminstrativeSetting from "../settings/EventAdminstrativeSetting";
import TeamMemberManagement from "../inventory/TeamMemberManagement";

// ─── Constants & helpers ──────────────────────────────────────────────────────
const TABS = [
  { key: "overview", icon: "dashboard", label: "Overview" },
  { key: "guests", icon: "group", label: "Guests" },
  { key: "rooms", icon: "meeting_room", label: "Rooms" },
  { key: "checkin", icon: "how_to_reg", label: "Check-in" },
  { key: "transport", icon: "local_shipping", label: "Transport" },
  { key: "service", icon: "room_service", label: "Service" },
  { key: "schedule", icon: "schedule", label: "Schedule" },
  { key: "reports", icon: "analytics", label: "Reports" },
  { key: "team", icon: "groups", label: "Team" },
  { key: "settings", icon: "settings", label: "Settings" },
];

const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getEventStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "upcoming";
};

const timeAgo = (ts) => {
  if (!ts) return "";
  const t = new Date(ts).getTime();
  if (Number.isNaN(t)) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const STATUS_BADGE = {
  live: {
    label: "Live",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500 animate-pulse",
  },
  upcoming: {
    label: "Upcoming",
    cls: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completed",
    cls: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

// ─── Small UI pieces ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function StatusBadge({ startDate, endDate }) {
  const c = STATUS_BADGE[getEventStatus(startDate, endDate)];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${c.cls}`}
    >
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function MetaChip({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
      <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">{icon}</span>
      {children}
    </span>
  );
}

function KpiCard({ icon, label, value, suffix, tone = "blue", progress, foot }) {
  const chip = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  }[tone];
  const bar = {
    blue: "bg-blue-600 dark:bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    indigo: "bg-indigo-500",
  }[tone];

  return (
    <div className={`flex flex-col p-5 ${CARD}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${chip}`}>
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">
          {value}
        </span>
        {suffix && <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{suffix}</span>}
      </div>
      {progress != null && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${bar}`}
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
      {foot && <div className="mt-auto pt-3 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{foot}</div>}
    </div>
  );
}

// Shown on Overview while a new event still has rooms, guests or team missing
function SetupChecklist({ eventId, metrics }) {
  const items = [
    {
      key: "rooms",
      label: "Add your rooms",
      done: (metrics?.rooms?.total || 0) > 0,
      desc: "Set up the room inventory you'll assign guests to.",
      icon: "meeting_room",
      path: `/events/${eventId}/rooms`,
    },
    {
      key: "guests",
      label: "Add your guests",
      done: (metrics?.guests?.total || 0) > 0,
      desc: "Add individually, or import a CSV for large lists.",
      icon: "group",
      path: `/events/${eventId}/guests`,
    },
    {
      key: "team",
      label: "Add your team",
      done: (metrics?.staff?.active || 0) > 0,
      desc: "Bring in the people who'll run this event with you.",
      icon: "badge",
      path: `/events/${eventId}/team`,
    },
  ];
  const completedCount = items.filter((i) => i.done).length;
  const nextKey = items.find((i) => !i.done)?.key;

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-blue-500/30 dark:bg-slate-900 dark:shadow-none">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
              Getting started
            </p>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Let's get this event ready
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Complete these steps so your team and guests can start using this event.
            </p>
          </div>
          <span className="mt-2 shrink-0 text-sm font-extrabold tabular-nums text-slate-700 dark:text-slate-300 sm:mt-0">
            {completedCount} of {items.length} done
          </span>
        </div>

        <div className="my-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500"
            style={{ width: `${(completedCount / items.length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {items.map((item, i) => (
            <Link
              key={item.key}
              to={item.path}
              className={`group flex items-start gap-3.5 rounded-xl border p-4 transition ${
                item.done
                  ? "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                  : item.key === nextKey
                    ? "border-blue-300 bg-blue-50/60 hover:border-blue-400 dark:border-blue-500/40 dark:bg-blue-500/10"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
              }`}
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  item.done
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.done ? "check_circle" : item.icon}</span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {i + 1}. {item.label}
                  </p>
                  {item.key === nextKey && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white dark:bg-blue-500">
                      Next
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.done ? "Done — click to manage" : item.desc}
                </p>
              </div>
              <span className="material-symbols-outlined mt-0.5 text-[18px] text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400">
                arrow_forward
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`h-40 p-5 ${CARD}`}>
            <Skeleton className="mb-4 h-3 w-28" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="mt-5 h-2 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={`h-96 p-6 lg:col-span-2 ${CARD}`}>
          <Skeleton className="mb-5 h-5 w-44" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="mb-3 h-10 w-full" />
          ))}
        </div>
        <div className={`h-96 p-6 ${CARD}`}>
          <Skeleton className="mb-5 h-5 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-950">
      <div className="h-16 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-[1440px] space-y-3 px-4 py-6 sm:px-6 lg:px-8">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <OverviewSkeleton />
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
function EventWorkspaceShell() {
  const { user } = useAuth();
  const { eventId, tab, "*": rest } = useParams();
  const activeTab = tab || "overview";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  // Room totals straight from the Rooms API — the same numbers the Rooms tab shows
  const [roomStats, setRoomStats] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);
  const [overviewSyncedAt, setOverviewSyncedAt] = useState(null);
  const [exportingData, setExportingData] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);

  const exportMessageTimerRef = useRef(null);
  const eventReq = useRef(0);
  const overviewReq = useRef(0);
  const tabsRef = useRef(null);

  // ── Loaders (stale responses are ignored) ──────────────────────────────────
  const loadEvent = useCallback(async () => {
    const id = ++eventReq.current;
    try {
      setLoading(true);
      const res = await getEventById(eventId);
      if (id !== eventReq.current) return;
      if (res.success) {
        setEvent(res.event);
        setError(null);
      } else {
        setError(res.message || "Failed to load event");
      }
    } catch (err) {
      if (id !== eventReq.current) return;
      console.error("Error loading event:", err);
      setError("Error loading event");
    } finally {
      if (id === eventReq.current) setLoading(false);
    }
  }, [eventId]);

  const loadOverview = useCallback(async () => {
    const id = ++overviewReq.current;
    try {
      setOverviewLoading(true);
      setOverviewError(null);
      const [res, roomsRes] = await Promise.all([
        getOverviewData(eventId),
        // limit 1: we only need the event-wide `stats`, not the room list
        getRooms({ eventId, page: 1, limit: 1 }).catch(() => null),
      ]);
      if (id !== overviewReq.current) return;
      setRoomStats(roomsRes?.success && roomsRes.stats ? roomsRes.stats : null);
      if (res.success) {
        setOverviewData(res);
        setOverviewSyncedAt(new Date());
      } else {
        setOverviewError(res.message || "Failed to sync dashboard data");
      }
    } catch (err) {
      if (id !== overviewReq.current) return;
      console.error("Error loading overview data:", err);
      setOverviewError("Dashboard synchronization failed. Please check your connection.");
    } finally {
      if (id === overviewReq.current) setOverviewLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      setOverviewData(null);
      setRoomStats(null);
      loadEvent();
    }
  }, [eventId, loadEvent]);

  useEffect(() => {
    if (eventId && activeTab === "overview") {
      loadOverview();
    }
  }, [eventId, activeTab, loadOverview]);

  useEffect(() => {
    return () => {
      if (exportMessageTimerRef.current) window.clearTimeout(exportMessageTimerRef.current);
    };
  }, []);

  // Keep the active tab visible in the scrollable tab bar (mobile)
  useEffect(() => {
    const nav = tabsRef.current;
    const el = nav?.querySelector('[aria-current="page"]');
    if (nav && el) {
      nav.scrollTo({
        left: el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, [activeTab, loading]);

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExportData = async () => {
    if (exportingData || !eventId) return;
    try {
      setExportingData(true);
      setExportMessage(null);
      const result = await exportEventWorkbook(eventId, event?.name || "event");
      setExportMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });
    } catch (err) {
      console.error("Error exporting event workbook:", err);
      setExportMessage({ type: "error", text: "Failed to export event data" });
    } finally {
      setExportingData(false);
      if (exportMessageTimerRef.current) window.clearTimeout(exportMessageTimerRef.current);
      exportMessageTimerRef.current = window.setTimeout(() => setExportMessage(null), 4000);
    }
  };

  // ── Loading / error ────────────────────────────────────────────────────────
  if (loading) return <ShellSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="material-symbols-outlined text-[25px]">error</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Couldn't load this event</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
          <div className="mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row">
            <Link
              to="/events"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Back to directory
            </Link>
            <button
              type="button"
              onClick={loadEvent}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Overview derived data ──────────────────────────────────────────────────
  const m = overviewData?.metrics || {};
  const guests = m.guests || {};
  const checkInPct = guests.total > 0 ? Math.round(((guests.checkedIn || 0) / guests.total) * 100) : 0;
  // Room numbers: prefer the Rooms API stats (same source as the Rooms tab); fall back to the overview metrics
  const roomsTotal = roomStats ? roomStats.total || 0 : m.rooms?.total || 0;
  const bedsTotal = roomStats?.totalCapacity || 0;
  const bedsFilled = roomStats?.totalOccupancy || 0;
  const occupancyPct = roomStats
    ? bedsTotal > 0
      ? Math.round((bedsFilled / bedsTotal) * 100)
      : 0
    : m.rooms?.occupancyRate || 0;
  const roomMetrics = { ...m, rooms: { ...(m.rooms || {}), total: roomsTotal, occupancyRate: occupancyPct } };
  const setupIncomplete =
    !!overviewData &&
    (roomsTotal === 0 || (m.guests?.total || 0) === 0 || (m.staff?.active || 0) === 0);
  const activity = overviewData?.recentActivity || [];
  const pendingServices = m.services?.pending || 0;

  const iconBtn =
    "relative flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100";

  return (
    <EventContext.Provider value={{ event, setEvent }}>
      <div className="relative flex min-h-screen flex-col bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/* ── Export toast ── */}
        {exportMessage && (
          <div
            role="status"
            className={`fixed bottom-4 left-4 right-4 z-[60] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
              exportMessage.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {exportMessage.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="min-w-0">{exportMessage.text}</span>
          </div>
        )}

        {/* ── Global navbar ── */}
        <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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

            <div className="flex items-center gap-1.5 md:gap-2">
              <Link to="/notifications" title="Notifications" aria-label="Notifications" className={iconBtn}>
                <span className="material-symbols-outlined text-[21px]">notifications</span>
              </Link>
              <button
                type="button"
                disabled
                title="Help center — coming soon"
                aria-label="Help (coming soon)"
                className="flex size-9 cursor-not-allowed items-center justify-center rounded-xl text-slate-300 dark:text-slate-600"
              >
                <span className="material-symbols-outlined text-[21px]">help_outline</span>
              </button>

              <div className="mx-1 hidden h-7 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-bold leading-4 text-slate-800 dark:text-slate-200">{user?.name || "Operator"}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                    {user?.organizationName || "Operations"}
                  </p>
                </div>
                <div className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                  {(user?.name || "O").charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Event context ── */}
        <section className="bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-[1440px] px-4 pb-5 pt-5 sm:px-6 lg:px-8 lg:pb-6">
            <Link
              to="/events"
              className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              All events
            </Link>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h1 className="line-clamp-2 text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
                    {event?.name}
                  </h1>
                  <StatusBadge startDate={event?.startDate} endDate={event?.endDate} />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  {event?.venue && <MetaChip icon="location_on">{event.venue}</MetaChip>}
                  <MetaChip icon="calendar_today">
                    {formatDate(event?.startDate)}
                    {event?.endDate && ` – ${formatDate(event.endDate)}`}
                  </MetaChip>
                  {event?.isPrivate && <MetaChip icon="lock">Private event</MetaChip>}
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportData}
                disabled={exportingData}
                className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:w-auto"
              >
                <span className={`material-symbols-outlined text-[19px] ${exportingData ? "animate-spin" : ""}`}>
                  {exportingData ? "progress_activity" : "download"}
                </span>
                {exportingData ? "Exporting…" : "Export Data"}
              </button>
            </div>
          </div>
        </section>

        {/* ── Sticky tab bar ── */}
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="mx-auto max-w-[1440px] px-2 sm:px-6 lg:px-8">
            <nav
              ref={tabsRef}
              aria-label="Event sections"
              className="hide-scrollbar relative flex gap-1 overflow-x-auto"
            >
              {TABS.map((t) => {
                const active = activeTab === t.key;
                return (
                  <Link
                    key={t.key}
                    to={`/events/${eventId}/${t.key}`}
                    aria-current={active ? "page" : undefined}
                    className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3.5 text-sm font-bold whitespace-nowrap transition ${
                      active
                        ? "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300"
                        : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── Main content ── */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* ═════════ OVERVIEW ═════════ */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    Event overview
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {overviewSyncedAt
                      ? `Synced at ${overviewSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : "Live operational snapshot"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadOverview}
                  disabled={overviewLoading}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className={`material-symbols-outlined text-[18px] ${overviewLoading ? "animate-spin" : ""}`}>
                    refresh
                  </span>
                  {overviewLoading ? "Syncing…" : "Refresh"}
                </button>
              </div>

              {overviewError && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="material-symbols-outlined text-[19px]">warning</span>
                    <span className="text-sm font-medium">{overviewError}</span>
                  </div>
                  <button
                    onClick={loadOverview}
                    className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline"
                  >
                    Retry sync
                  </button>
                </div>
              )}

              {!overviewData && overviewLoading ? (
                <OverviewSkeleton />
              ) : !overviewData ? null : (
                <div
                  aria-busy={overviewLoading}
                  className={`space-y-5 transition-opacity duration-300 ${overviewLoading ? "opacity-60" : "opacity-100"}`}
                >
                  {setupIncomplete && <SetupChecklist eventId={eventId} metrics={roomMetrics} />}

                  {/* KPIs */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                      icon="how_to_reg"
                      label="Check-in progress"
                      value={guests.checkedIn || 0}
                      suffix={`/ ${guests.total || 0}`}
                      tone="emerald"
                      progress={checkInPct}
                      foot={guests.total > 0 ? `${checkInPct}% of guests checked in` : "No guests registered yet"}
                    />
                    <KpiCard
                      icon="meeting_room"
                      label="Room occupancy"
                      value={`${occupancyPct}%`}
                      tone="blue"
                      progress={occupancyPct}
                      foot={
                        roomsTotal === 0
                          ? "No rooms added yet"
                          : roomStats
                            ? `${bedsFilled} of ${bedsTotal} beds filled · ${roomsTotal} room${roomsTotal === 1 ? "" : "s"}`
                            : `${roomsTotal} rooms in inventory`
                      }
                    />
                    <KpiCard
                      icon="pending_actions"
                      label="Pending service"
                      value={pendingServices}
                      suffix="requests"
                      tone={pendingServices > 0 ? "amber" : "emerald"}
                      foot={
                        pendingServices > 0 ? (
                          <>
                            Awaiting response —{" "}
                            <Link
                              to={`/events/${eventId}/service`}
                              className="font-bold text-blue-700 hover:underline dark:text-blue-300"
                            >
                              view requests
                            </Link>
                          </>
                        ) : (
                          "No pending service requests"
                        )
                      }
                    />
                    <KpiCard
                      icon="directions_bus"
                      label="Transport load"
                      value={m.transport?.active || 0}
                      suffix="active"
                      tone="indigo"
                      foot={
                        <>
                          Active or scheduled shuttles —{" "}
                          <Link
                            to={`/events/${eventId}/transport`}
                            className="font-bold text-blue-700 hover:underline dark:text-blue-300"
                          >
                            manage
                          </Link>
                        </>
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* Recent activity */}
                    <section className={`min-w-0 overflow-hidden lg:col-span-2 ${CARD}`}>
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                        <div>
                          <h3 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                            Recent guest activity
                          </h3>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            Latest operational events for this event
                          </p>
                        </div>
                        <Link
                          to={`/events/${eventId}/reports`}
                          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-blue-700 transition hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
                        >
                          View full logs
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </Link>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                              {["Guest", "Type", "Details", "Staff", "Time"].map((h, i) => (
                                <th
                                  key={h}
                                  className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${
                                    i === 4 ? "text-right" : ""
                                  }`}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activity.length > 0 ? (
                              activity.map((log) => (
                                <tr key={log._id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                                  <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {log.relatedGuest?.fullName?.substring(0, 2).toUpperCase() || "??"}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="max-w-[160px] truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                                          {log.relatedGuest?.fullName || "System"}
                                        </p>
                                        <p className="max-w-[160px] truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                          {log.relatedGuest?.groupName || "Log entry"}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span
                                      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                        log.type === "check-in"
                                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                          : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                                      }`}
                                    >
                                      {(log.type || "Activity").replace(/-/g, " ")}
                                    </span>
                                  </td>
                                  <td className="max-w-[240px] px-5 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    <span className="line-clamp-2">{log.message || "Updated event status"}</span>
                                  </td>
                                  <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {log.relatedStaff?.name || "Automated"}
                                  </td>
                                  <td
                                    className="whitespace-nowrap px-5 py-3.5 text-right text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400"
                                    title={log.timestamp ? new Date(log.timestamp).toLocaleString() : undefined}
                                  >
                                    {timeAgo(log.timestamp) ||
                                      (log.timestamp
                                        ? new Date(log.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : "—")}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="px-6 py-14 text-center">
                                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                    <span className="material-symbols-outlined text-[24px]">dynamic_feed</span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No recent activity</p>
                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Activity will appear once operations begin.
                                  </p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:px-6">
                        {activity.length > 0 ? `Showing latest ${activity.length} activities` : "No activity to display"}
                      </div>
                    </section>

                    {/* Side column */}
                    <div className="space-y-5">
                      <div className={`p-5 ${CARD}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                            Team on duty
                          </p>
                          <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                            <span className="material-symbols-outlined text-[19px]">badge</span>
                          </div>
                        </div>
                        <p className="mt-3 text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">
                          {m.staff?.active || 0}
                        </p>
                        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">Active staff members</p>
                      </div>

                      <div className={`p-5 ${CARD}`}>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                            Audit logs
                          </p>
                          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[19px]">description</span>
                          </div>
                        </div>
                        <p className="mt-3 text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">
                          {m.logs?.total || 0}
                        </p>
                        <Link
                          to={`/events/${eventId}/reports`}
                          className="mt-4 flex h-9 w-full items-center justify-center rounded-lg border border-slate-200 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          View analytics
                        </Link>
                      </div>

                      <div className={`p-3 ${CARD}`}>
                        <p className="px-2 pb-2 pt-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                          Quick actions
                        </p>
                        {[
                          { icon: "how_to_reg", label: "Open check-in desk", to: "checkin" },
                          { icon: "group", label: "Manage guests", to: "guests" },
                          { icon: "schedule", label: "View schedule", to: "schedule" },
                        ].map((a) => (
                          <Link
                            key={a.to}
                            to={`/events/${eventId}/${a.to}`}
                            className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          >
                            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              <span className="material-symbols-outlined text-[17px]">{a.icon}</span>
                            </span>
                            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-slate-100">
                              {a.label}
                            </span>
                            <span className="material-symbols-outlined ml-auto text-[16px] text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-400">
                              arrow_forward
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "guests" && (
            <div className="space-y-6">
              {/* back link when inside a sub-route like add/edit */}
              {rest && (
                <Link
                  to={`/events/${eventId}/guests`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline dark:text-blue-300"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Guest List
                </Link>
              )}
              {/* pass rest so the guest list can render add/edit form when needed */}
              <GuestMasterList extraPath={rest || ""} eventId={eventId} />
            </div>
          )}

          {activeTab === "rooms" && (
            <div className="space-y-6">
              <RoomInventoryManagement />
            </div>
          )}

          {activeTab === "checkin" && (
            <div className="space-y-6">
              <CheckInOprationDesk eventId={eventId} />
            </div>
          )}

          {activeTab === "transport" && (
            <div className="space-y-6">
              <TransportCoordinationLogs eventId={eventId} />
            </div>
          )}

          {activeTab === "service" && (
            <div className="space-y-6">
              <ServiceRequestLogs eventId={eventId} />
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="space-y-6">
              <OprationalEventSchedule />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <EventSummaryDashboards />
            </div>
          )}

          {activeTab === "team" && (
            <div className="space-y-6">
              <TeamMemberManagement eventId={eventId} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <EventAdminstrativeSetting />
            </div>
          )}
        </main>
      </div>
    </EventContext.Provider>
  );
}

export default EventWorkspaceShell;