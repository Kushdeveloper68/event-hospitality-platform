import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getFullAnalytics, getKPISummary } from "../../api/organizationAnalyticsDashboardsApi";

// ─── Utility helpers ──────────────────────────────────────────────────────────

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

const fmtNum = (n) =>
  n == null ? "—" : Number(n).toLocaleString();

const statusColors = {
  in_progress: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Live",
  },
  upcoming: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    label: "Upcoming",
  },
  completed: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-500",
    dot: "bg-slate-400",
    label: "Completed",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
    />
  );
}

function KPICard({ icon, label, value, sub, accent = "primary", trend, pulse = false }) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
    red: "bg-red-100 text-red-600 dark:bg-red-900/30",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className={`size-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {pulse && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </span>
        )}
        {trend != null && !pulse && (
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
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children, action }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="material-symbols-outlined text-primary text-xl">
              {icon}
            </span>
          )}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── Mini bar chart (pure CSS/SVG, no lib) ─────────────────────────────────────
function BarChart({ data, colorClass = "fill-primary", height = 180 }) {
  if (!data || !data.length)
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        No data
      </div>
    );

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const barW = Math.max(8, Math.floor(600 / data.length) - 4);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width="100%"
        height={height + 30}
        viewBox={`0 0 ${data.length * (barW + 4)} ${height + 30}`}
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const barH = Math.max(3, Math.round((d.count / maxVal) * height));
          return (
            <g key={i}>
              <rect
                x={i * (barW + 4)}
                y={height - barH}
                width={barW}
                height={barH}
                rx={3}
                className={colorClass}
                opacity={0.85}
              />
              {data.length <= 14 && (
                <text
                  x={i * (barW + 4) + barW / 2}
                  y={height + 18}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  {d.label?.split(" ")[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Line chart (pure SVG) ─────────────────────────────────────────────────────
function LineChart({ data, colorClass = "stroke-primary", height = 160 }) {
  if (!data || !data.length)
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        No data
      </div>
    );

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const W = 600;
  const H = height;
  const pad = 10;
  const step = (W - pad * 2) / Math.max(data.length - 1, 1);

  const pts = data.map((d, i) => ({
    x: pad + i * step,
    y: H - pad - ((d.count / maxVal) * (H - pad * 2)),
  }));

  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD =
    `M ${pts[0].x} ${H - pad} ` +
    pts.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${pts[pts.length - 1].x} ${H - pad} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H + 20}`}
        width="100%"
        height={H + 20}
        preserveAspectRatio="none"
      >
        {/* area fill */}
        <path d={areaD} className="fill-primary/10" />
        {/* line */}
        <path
          d={pathD}
          className={colorClass}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* dots */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            className="fill-white stroke-primary"
            strokeWidth="2"
          />
        ))}
        {/* x-axis labels — show every 3rd */}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 6) !== 0) return null;
          return (
            <text
              key={i}
              x={pts[i].x}
              y={H + 16}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── Progress bar row ──────────────────────────────────────────────────────────
function ProgressRow({ label, value, pct, max, colorClass = "bg-primary" }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
          {label}
        </span>
        <span className="font-bold text-slate-900 dark:text-white tabular-nums">
          {fmtNum(value)}
          <span className="text-slate-400 font-normal ml-1">({pct}%)</span>
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.upcoming;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.bg} ${c.text}`}
    >
      {status === "in_progress" && (
        <span className={`size-1.5 rounded-full animate-pulse ${c.dot}`} />
      )}
      {c.label}
    </span>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ icon = "analytics", message = "No data available yet." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
      <span className="material-symbols-outlined text-5xl">{icon}</span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// ─── Full page skeleton ───────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 h-28"
          >
            <Skeleton className="size-10 rounded-lg mb-3" />
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-64"
          >
            <Skeleton className="h-5 w-40 mb-4" />
            <Skeleton className="h-40 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrganizationAnalyticsDashboards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [exportMsg, setExportMsg] = useState("");

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(
    async (quiet = false) => {
      try {
        if (!quiet) setLoading(true);
        else setRefreshing(true);
        setError(null);

        const filters = {};
        if (dateRange.startDate) filters.startDate = dateRange.startDate;
        if (dateRange.endDate) filters.endDate = dateRange.endDate;

        const res = await getFullAnalytics(filters);

        if (res.success) {
          setData(res);
          setLastUpdated(new Date());
        } else {
          setError(res.message || "Failed to load analytics");
        }
      } catch (err) {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dateRange]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── auto-refresh KPIs every 60s ───────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!data) return;
      const res = await getKPISummary();
      if (res.success) {
        setData((prev) =>
          prev ? { ...prev, kpiSummary: res.kpiSummary } : prev
        );
        setLastUpdated(new Date());
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [data]);

  // ── CSV export ─────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (!data?.topEvents?.length) return;
    const headers = [
      "Event Name",
      "Venue",
      "Start Date",
      "Status",
      "Guests",
      "Checked In",
      "Check-in Rate",
      "Services",
      "Transports",
    ];
    const rows = data.topEvents.map((ev) => [
      `"${ev.name}"`,
      `"${ev.venue || ""}"`,
      fmtDate(ev.startDate),
      ev.status,
      ev.guests,
      ev.checkedIn,
      `${ev.checkInRate}%`,
      ev.services,
      ev.transports,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg("CSV exported successfully!");
    setTimeout(() => setExportMsg(""), 3000);
  };

  // ── tabs config ────────────────────────────────────────────────────────────
  const tabs = [
    { key: "overview", icon: "dashboard", label: "Overview" },
    { key: "guests", icon: "group", label: "Guests" },
    { key: "services", icon: "room_service", label: "Services" },
    { key: "operations", icon: "settings", label: "Operations" },
    { key: "events", icon: "calendar_today", label: "Events" },
  ];

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <span className="text-slate-500 font-medium">
            Loading organization analytics…
          </span>
        </div>
        <PageSkeleton />
      </div>
    );
  }

  // ── ERROR ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 max-w-[1440px] mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-8 flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-5xl text-red-400">
            error
          </span>
          <div>
            <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
              Failed to load analytics
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
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

  const {
    kpiSummary: kpi,
    monthlyCheckIn,
    guestRegistration,
    serviceBreakdown,
    roomOccupancy,
    transportStats,
    teamStats,
    activityStats,
    topEvents,
    vipStats,
  } = data;

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              Performance Overview
            </p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Organization Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Cross-event performance metrics across all your managed events.
              {lastUpdated && (
                <span className="ml-2 text-slate-400">
                  Last updated:{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date range filters */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">
                calendar_month
              </span>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, startDate: e.target.value }))
                }
                className="text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
              />
              <span className="text-slate-400 text-xs">→</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, endDate: e.target.value }))
                }
                className="text-xs bg-transparent outline-none text-slate-700 dark:text-slate-300"
              />
            </div>

            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-lg ${
                  refreshing ? "animate-spin" : ""
                }`}
              >
                refresh
              </span>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>

            <div className="flex">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-l-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  download
                </span>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Export success msg */}
        {exportMsg && (
          <div className="mt-3 flex items-center gap-2 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 rounded-lg px-4 py-2 text-sm font-medium">
            <span className="material-symbols-outlined text-base">
              check_circle
            </span>
            {exportMsg}
          </div>
        )}
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
            <span className="material-symbols-outlined text-[18px]">
              {t.icon}
            </span>
            <span className="hidden md:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6">

          {/* KPI Row 1 — Events */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="calendar_today"
              label="Total Events"
              value={fmtNum(kpi.totalEvents)}
              sub="All time"
              accent="primary"
            />
            <KPICard
              icon="event_available"
              label="Active Events"
              value={fmtNum(kpi.activeEvents)}
              sub="Currently running"
              accent="green"
              pulse={kpi.activeEvents > 0}
            />
            <KPICard
              icon="upcoming"
              label="Upcoming"
              value={fmtNum(kpi.upcomingEvents)}
              accent="primary"
            />
            <KPICard
              icon="event_busy"
              label="Completed"
              value={fmtNum(kpi.completedEvents)}
              accent="slate"
            />
          </div>

          {/* KPI Row 2 — Operational */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="group"
              label="Total Guests"
              value={fmtNum(kpi.totalGuests)}
              sub={`${kpi.checkInRate}% checked in`}
              accent="indigo"
            />
            <KPICard
              icon="how_to_reg"
              label="Checked In"
              value={fmtNum(kpi.checkedInGuests)}
              sub={`${kpi.totalGuests - kpi.checkedInGuests} pending`}
              accent="green"
            />
            <KPICard
              icon="pending_actions"
              label="Open Services"
              value={fmtNum(kpi.openServices)}
              sub={`${kpi.serviceResolutionRate}% resolved`}
              accent={kpi.openServices > 0 ? "amber" : "green"}
            />
            <KPICard
              icon="badge"
              label="Active Staff"
              value={fmtNum(kpi.activeStaff)}
              accent="purple"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Monthly check-in trend */}
            <SectionCard
              title="Guest Check-in Volume"
              subtitle="Monthly comparison of arrival traffic"
              icon="show_chart"
            >
              {monthlyCheckIn?.data?.length ? (
                <>
                  <LineChart data={monthlyCheckIn.data} height={160} />
                  {monthlyCheckIn.yoyChange != null && (
                    <p className="text-xs text-slate-500 mt-2">
                      vs prior 6 months:{" "}
                      <span
                        className={`font-bold ${
                          monthlyCheckIn.yoyChange >= 0
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {monthlyCheckIn.yoyChange >= 0 ? "+" : ""}
                        {monthlyCheckIn.yoyChange}%
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <EmptyState icon="show_chart" message="No check-in data yet." />
              )}
            </SectionCard>

            {/* Guest registration trend */}
            <SectionCard
              title="Guest Registration Trend"
              subtitle="New registrations per month"
              icon="person_add"
            >
              {guestRegistration?.data?.length ? (
                <>
                  <BarChart
                    data={guestRegistration.data}
                    colorClass="fill-indigo-500"
                    height={160}
                  />
                  {guestRegistration.yoyChange != null && (
                    <p className="text-xs text-slate-500 mt-2">
                      vs prior 6 months:{" "}
                      <span
                        className={`font-bold ${
                          guestRegistration.yoyChange >= 0
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {guestRegistration.yoyChange >= 0 ? "+" : ""}
                        {guestRegistration.yoyChange}%
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <EmptyState
                  icon="person_add"
                  message="No registration data yet."
                />
              )}
            </SectionCard>
          </div>

          {/* Service + VIP summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Service breakdown */}
            <SectionCard
              title="Service Requests"
              subtitle="Breakdown by category"
              icon="room_service"
            >
              {serviceBreakdown?.byType?.length ? (
                <div className="space-y-3">
                  {serviceBreakdown.byType.map((item) => (
                    <ProgressRow
                      key={item.type}
                      label={item.label}
                      value={item.count}
                      pct={item.pct}
                      colorClass="bg-primary"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState icon="room_service" message="No service requests." />
              )}
            </SectionCard>

            {/* Room occupancy */}
            <SectionCard
              title="Room Occupancy"
              subtitle="Overall utilization"
              icon="meeting_room"
            >
              <div className="flex flex-col items-center py-4 mb-4">
                <div className="relative size-28 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
                    <circle
                      cx="50" cy="50" r="40"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                    />
                    <circle
                      cx="50" cy="50" r="40"
                      fill="transparent"
                      stroke="#2463eb"
                      strokeWidth="12"
                      strokeDasharray={`${(roomOccupancy?.overallOccupancy / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center z-10">
                    <span className="text-2xl font-black text-primary">
                      {roomOccupancy?.overallOccupancy || 0}%
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Occupied
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Total Rooms", val: roomOccupancy?.totalRooms },
                  { label: "Occupied", val: roomOccupancy?.occupiedRooms },
                  { label: "Available", val: roomOccupancy?.availableRooms },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1"
                  >
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {fmtNum(item.val)}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* VIP analytics */}
            <SectionCard title="VIP Analytics" subtitle="High-value guest tracking" icon="star">
              <div className="space-y-4">
                {[
                  {
                    label: "Total VIP Guests",
                    value: fmtNum(vipStats?.totalVIP),
                    icon: "star",
                    color: "text-amber-500",
                  },
                  {
                    label: "VIP Checked In",
                    value: fmtNum(vipStats?.checkedInVIP),
                    icon: "how_to_reg",
                    color: "text-emerald-600",
                  },
                  {
                    label: "VIP Rate",
                    value: `${vipStats?.vipRate || 0}%`,
                    icon: "percent",
                    color: "text-primary",
                  },
                  {
                    label: "VIP Check-in Rate",
                    value: `${vipStats?.vipCheckInRate || 0}%`,
                    icon: "verified",
                    color: "text-purple-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-base ${item.color}`}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-sm font-black ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          GUESTS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "guests" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard icon="group" label="Total Guests" value={fmtNum(kpi.totalGuests)} accent="primary" />
            <KPICard icon="how_to_reg" label="Checked In" value={fmtNum(kpi.checkedInGuests)} sub={`${kpi.checkInRate}% rate`} accent="green" />
            <KPICard icon="star" label="VIP Guests" value={fmtNum(vipStats?.totalVIP)} sub={`${vipStats?.vipRate || 0}% of total`} accent="amber" />
            <KPICard icon="verified" label="VIP Check-in" value={`${vipStats?.vipCheckInRate || 0}%`} accent="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Monthly Check-in Trend" subtitle="Arrivals over the past 12 months" icon="trending_up">
              {monthlyCheckIn?.data?.length ? (
                <LineChart data={monthlyCheckIn.data} height={200} />
              ) : (
                <EmptyState icon="trending_up" message="No check-in history." />
              )}
            </SectionCard>

            <SectionCard title="Monthly Registrations" subtitle="New guests registered per month" icon="person_add">
              {guestRegistration?.data?.length ? (
                <BarChart data={guestRegistration.data} colorClass="fill-indigo-500" height={200} />
              ) : (
                <EmptyState icon="person_add" message="No registration history." />
              )}
            </SectionCard>
          </div>

          <SectionCard title="Check-in Summary" subtitle="Overall guest arrival status" icon="how_to_reg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <ProgressRow label="Checked In" value={kpi.checkedInGuests} pct={kpi.checkInRate} colorClass="bg-emerald-500" />
                <ProgressRow label="Not Yet Arrived" value={kpi.totalGuests - kpi.checkedInGuests} pct={100 - kpi.checkInRate} colorClass="bg-slate-300 dark:bg-slate-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Guests", value: kpi.totalGuests, color: "text-slate-900 dark:text-white" },
                  { label: "Checked In", value: kpi.checkedInGuests, color: "text-emerald-600" },
                  { label: "VIP Guests", value: vipStats?.totalVIP, color: "text-amber-500" },
                  { label: "Check-in Rate", value: `${kpi.checkInRate}%`, color: "text-primary" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className={`text-2xl font-black ${item.color}`}>{fmtNum(item.value)}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICES TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard icon="receipt_long" label="Total Requests" value={fmtNum(serviceBreakdown?.totalRequests)} accent="primary" />
            <KPICard icon="pending_actions" label="Open / In Progress" value={fmtNum(kpi.openServices)} accent="amber" />
            <KPICard icon="check_circle" label="Completed" value={fmtNum(kpi.completedServices)} accent="green" />
            <KPICard icon="percent" label="Resolution Rate" value={`${kpi.serviceResolutionRate}%`} accent="purple" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="By Request Type" subtitle="Volume per service category" icon="category">
              {serviceBreakdown?.byType?.length ? (
                <div className="space-y-3">
                  {serviceBreakdown.byType.map((item) => (
                    <ProgressRow key={item.type} label={item.label} value={item.count} pct={item.pct} colorClass="bg-primary" />
                  ))}
                </div>
              ) : (
                <EmptyState icon="category" message="No service data." />
              )}
            </SectionCard>

            <SectionCard title="By Status" subtitle="Current request pipeline" icon="pip">
              {serviceBreakdown?.byStatus?.length ? (
                <div className="space-y-3">
                  {serviceBreakdown.byStatus.map((item) => {
                    const colorMap = {
                      open: "bg-amber-400",
                      in_progress: "bg-primary",
                      completed: "bg-emerald-500",
                      cancelled: "bg-slate-300",
                    };
                    return (
                      <ProgressRow
                        key={item.status}
                        label={item.status.replace("_", " ")}
                        value={item.count}
                        pct={item.pct}
                        colorClass={colorMap[item.status] || "bg-slate-400"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon="pip" message="No status data." />
              )}
            </SectionCard>

            <SectionCard title="By Urgency" subtitle="Priority distribution" icon="priority_high">
              {serviceBreakdown?.byUrgency?.length ? (
                <div className="space-y-3">
                  {serviceBreakdown.byUrgency.map((item) => {
                    const colorMap = {
                      emergency: "bg-red-600",
                      high: "bg-red-400",
                      medium: "bg-amber-400",
                      low: "bg-emerald-400",
                    };
                    return (
                      <ProgressRow
                        key={item.urgency}
                        label={item.urgency}
                        value={item.count}
                        pct={item.pct}
                        colorClass={colorMap[item.urgency] || "bg-slate-400"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon="priority_high" message="No urgency data." />
              )}
            </SectionCard>

            <SectionCard title="Activity Log (30 Days)" subtitle="Daily operational events" icon="timeline">
              {activityStats?.dailyTrend?.length ? (
                <BarChart data={activityStats.dailyTrend} colorClass="fill-primary" height={180} />
              ) : (
                <EmptyState icon="timeline" message="No activity logs." />
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          OPERATIONS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "operations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard icon="meeting_room" label="Total Rooms" value={fmtNum(roomOccupancy?.totalRooms)} sub={`${roomOccupancy?.overallOccupancy || 0}% occupied`} accent="purple" />
            <KPICard icon="local_shipping" label="Total Transports" value={fmtNum(transportStats?.totalTransports)} sub={`${transportStats?.completionRate || 0}% complete`} accent="indigo" />
            <KPICard icon="badge" label="Total Staff" value={fmtNum(teamStats?.total)} sub={`${teamStats?.activeRate || 0}% active`} accent="green" />
            <KPICard icon="history" label="Activity Logs" value={fmtNum(activityStats?.total)} accent="primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Transport status */}
            <SectionCard title="Transport Status" subtitle="Fleet breakdown" icon="local_shipping">
              {transportStats?.byStatus?.length ? (
                <div className="space-y-3">
                  {transportStats.byStatus.map((item) => {
                    const colorMap = {
                      scheduled: "bg-primary",
                      in_transit: "bg-amber-400",
                      arrived: "bg-emerald-500",
                      cancelled: "bg-slate-300",
                    };
                    return (
                      <ProgressRow
                        key={item.status}
                        label={item.status.replace("_", " ")}
                        value={item.count}
                        pct={item.pct}
                        colorClass={colorMap[item.status] || "bg-slate-400"}
                      />
                    );
                  })}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Today Scheduled</span>
                    <span className="font-bold text-primary">{fmtNum(transportStats.todayCount)}</span>
                  </div>
                </div>
              ) : (
                <EmptyState icon="local_shipping" message="No transport data." />
              )}
            </SectionCard>

            {/* Team distribution */}
            <SectionCard title="Team Roles" subtitle="Top role distribution" icon="groups">
              {teamStats?.byRole?.length ? (
                <div className="space-y-3">
                  {teamStats.byRole.map((item) => (
                    <ProgressRow key={item.role} label={item.role} value={item.count} pct={item.pct} colorClass="bg-purple-500" />
                  ))}
                </div>
              ) : (
                <EmptyState icon="groups" message="No team data." />
              )}
            </SectionCard>

            {/* Activity by type */}
            <SectionCard title="Activity by Type" subtitle="Log category breakdown" icon="timeline">
              {activityStats?.byType?.length ? (
                <div className="space-y-3">
                  {activityStats.byType.map((item) => {
                    const total = activityStats.total || 1;
                    return (
                      <ProgressRow
                        key={item.type}
                        label={item.type.replace(/-/g, " ")}
                        value={item.count}
                        pct={Math.round((item.count / total) * 100)}
                        colorClass="bg-primary"
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon="timeline" message="No activity data." />
              )}
            </SectionCard>
          </div>

          {/* Room type breakdown */}
          <SectionCard title="Room Type Distribution" subtitle="Inventory by category" icon="meeting_room">
            {roomOccupancy?.byType?.length ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {roomOccupancy.byType.map((item) => (
                  <div key={item.type} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-primary">{item.count}</p>
                    <p className="text-xs text-slate-500 font-bold capitalize mt-1">{item.type}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.pct}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="meeting_room" message="No room data." />
            )}
          </SectionCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          EVENTS TABLE TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard icon="calendar_today" label="Total Events" value={fmtNum(kpi.totalEvents)} accent="primary" />
            <KPICard icon="event_available" label="Active Now" value={fmtNum(kpi.activeEvents)} accent="green" pulse={kpi.activeEvents > 0} />
            <KPICard icon="upcoming" label="Upcoming" value={fmtNum(kpi.upcomingEvents)} accent="primary" />
            <KPICard icon="event_busy" label="Completed" value={fmtNum(kpi.completedEvents)} accent="slate" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Top Performing Events
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sorted by most recent start date
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Export
              </button>
            </div>

            {topEvents?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Event Name</th>
                      <th className="px-6 py-4">Venue</th>
                      <th className="px-6 py-4">Dates</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Guests</th>
                      <th className="px-6 py-4 text-center">Check-in</th>
                      <th className="px-6 py-4 text-center">Services</th>
                      <th className="px-6 py-4 text-center">Transport</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {topEvents.map((ev) => (
                      <tr
                        key={ev._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {ev.name}
                          </div>
                          {ev.isPrivate && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">lock</span>
                              Private
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 line-clamp-1">
                          {ev.venue || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {fmtDate(ev.startDate)}
                          {ev.endDate && (
                            <span className="text-slate-400"> → {fmtDate(ev.endDate)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={ev.status} />
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-900 dark:text-white">
                          {fmtNum(ev.guests)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-emerald-600">
                              {ev.checkInRate}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${ev.checkInRate}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">
                          {fmtNum(ev.services)}
                        </td>
                        <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">
                          {fmtNum(ev.transports)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/events/${ev._id}/overview`}
                            className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline"
                          >
                            Manage
                            <span className="material-symbols-outlined text-sm">
                              open_in_new
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10">
                <EmptyState
                  icon="calendar_today"
                  message="No events found. Create your first event to see analytics."
                />
              </div>
            )}

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Showing {topEvents?.length || 0} events</span>
              <Link
                to="/events"
                className="font-bold text-primary hover:underline"
              >
                View all events →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer note ── */}
      <p className="text-center text-xs text-slate-400 pb-2">
        Data generated at{" "}
        {data.generatedAt
          ? new Date(data.generatedAt).toLocaleString()
          : "—"}
      </p>
    </div>
  );
}