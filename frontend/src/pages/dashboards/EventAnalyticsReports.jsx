import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { EventContext } from "../../context/EventContext";
import {
  getFullReport,
  exportGuestsCsv,
  exportServicesCsv,
  exportTransportCsv,
} from "../../api/eventAnalyticsReportsApi";

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString());
const fmtPct = (n) => (n == null ? "—" : `${n}%`);
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
const fmtHour = (h) => {
  if (h == null) return "";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${ampm}`;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 h-28"
          >
            <Skeleton className="size-9 rounded-xl mb-3" />
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-7 w-14" />
          </div>
        ))}
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 h-56"
        >
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
export function KPICard({
  icon,
  label,
  value,
  sub,
  accent = "blue",
  pulse = false,
  trend,
}) {
  const accentMap = {
    blue: "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400",
    green:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    purple:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
    slate: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  };
  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 group">
      <div className="flex items-center justify-between">
        <div
          className={`size-10 rounded-xl flex items-center justify-center ${accentMap[accent]}`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div className="flex items-center gap-2">
          {pulse && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          )}
          {trend != null && (
            <span
              className={`flex items-center gap-0.5 text-xs font-bold ${trend >= 0 ? "text-emerald-600" : "text-red-500"}`}
            >
              <span className="material-symbols-outlined text-sm">
                {trend >= 0 ? "trending_up" : "trending_down"}
              </span>
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 tabular-nums">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
export function Section({
  title,
  subtitle,
  icon,
  children,
  action,
  noPad = false,
}) {
  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="size-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-base text-primary-600 dark:text-primary-400">
                {icon}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-display text-card-h3 text-slate-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className={noPad ? "" : "p-6"}>{children}</div>
    </div>
  );
}

// ─── Progress bar row ─────────────────────────────────────────────────────────
export function ProgressRow({
  label,
  value,
  pct,
  max,
  colorClass = "bg-primary-500",
  badge,
}) {
  const width = max ? Math.round((value / max) * 100) : pct;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
            {label}
          </span>
          {badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              {badge}
            </span>
          )}
        </div>
        <span className="tabular-nums text-slate-900 dark:text-white font-bold">
          {fmtNum(value)}
          <span className="text-slate-400 font-normal ml-1 text-xs">
            ({pct ?? Math.round((value / (max || 1)) * 100)}%)
          </span>
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${Math.min(width, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── SVG Bar chart (pure, no lib) ────────────────────────────────────────────
export function BarChart({
  data = [],
  height = 160,
  colorClass = "fill-primary-500",
  labelKey = "label",
  valueKey = "count",
  showLabels = true,
}) {
  if (!data.length) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d[valueKey] ?? 0), 1);
  const W = 560;
  const barW = Math.max(6, Math.floor((W / data.length) * 0.6));
  const gap = Math.floor(W / data.length);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${height + 28}`}
        width="100%"
        height={height + 28}
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const val = d[valueKey] ?? 0;
          const barH = Math.max(2, Math.round((val / maxVal) * height));
          const x = i * gap + (gap - barW) / 2;
          return (
            <g key={i}>
              <rect
                x={x}
                y={height - barH}
                width={barW}
                height={barH}
                rx={3}
                className={colorClass}
                opacity={0.85}
              />
              {showLabels && data.length <= 24 && (
                <text
                  x={x + barW / 2}
                  y={height + 16}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94a3b8"
                >
                  {d[labelKey] !== undefined
                    ? String(d[labelKey]).slice(0, 5)
                    : i}
                </text>
              )}
              {val > 0 && (
                <text
                  x={x + barW / 2}
                  y={height - barH - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                >
                  {val}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── SVG Line chart ───────────────────────────────────────────────────────────
export function LineChart({
  data = [],
  height = 160,
  colorClass = "stroke-primary-500",
  labelKey = "label",
  valueKey = "count",
}) {
  if (!data.length) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d[valueKey] ?? 0), 1);
  const W = 560;
  const H = height;
  const pad = 16;
  const step = (W - pad * 2) / Math.max(data.length - 1, 1);

  const pts = data.map((d, i) => ({
    x: pad + i * step,
    y: H - pad - ((d[valueKey] ?? 0) / maxVal) * (H - pad * 2),
    val: d[valueKey] ?? 0,
  }));

  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `M ${pts[0].x} ${H - pad} ${pts.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${pts[pts.length - 1].x} ${H - pad} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H + 20}`}
        width="100%"
        height={H + 20}
        preserveAspectRatio="none"
      >
        {/* grid lines */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={pad}
            y1={H - pad - f * (H - pad * 2)}
            x2={W - pad}
            y2={H - pad - f * (H - pad * 2)}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}
        <path d={areaD} fill="#2463eb10" />
        <path
          d={pathD}
          className={colorClass}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="white"
            className={`${colorClass.replace("stroke-", "stroke-")}`}
            strokeWidth="2"
            stroke="#2463eb"
          />
        ))}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 8) !== 0) return null;
          return (
            <text
              key={i}
              x={pts[i].x}
              y={H + 16}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
            >
              {String(d[labelKey] ?? i).slice(0, 6)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
export function DonutChart({
  value,
  max,
  size = 120,
  colorClass = "stroke-primary-500",
  label,
  subLabel,
}) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 40;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth="12"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="transparent"
            className={colorClass}
            strokeWidth="12"
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-slate-900 dark:text-white">
            {Math.round(pct * 100)}%
          </span>
        </div>
      </div>
      {label && (
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center">
          {label}
        </p>
      )}
      {subLabel && (
        <p className="text-[10px] text-slate-400 text-center">{subLabel}</p>
      )}
    </div>
  );
}

// ─── Hour heatmap bar ─────────────────────────────────────────────────────────
export function HourBars({ data = [], colorClass = "bg-primary-500" }) {
  if (!data.length) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const peak = data.reduce((a, b) => (a.count > b.count ? a : b), data[0]);
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-0.5 h-20">
        {data.map((d, i) => {
          const pct = Math.max((d.count / maxVal) * 100, d.count > 0 ? 4 : 0);
          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-0.5"
              title={`${fmtHour(d.hour)}: ${d.count}`}
            >
              <div
                className={`w-full rounded-sm transition-all ${colorClass} opacity-80`}
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-slate-400">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>11PM</span>
      </div>
      {peak.count > 0 && (
        <p className="text-xs text-slate-500">
          Peak:{" "}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {fmtHour(peak.hour)}
          </span>{" "}
          ({fmtNum(peak.count)} activities)
        </p>
      )}
    </div>
  );
}

// ─── Empty chart placeholder ──────────────────────────────────────────────────
function EmptyChart({ message = "No data available" }) {
  return (
    <div className="flex flex-col items-center justify-center h-28 gap-2 text-slate-300 dark:text-slate-700">
      <span className="material-symbols-outlined text-4xl">bar_chart</span>
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  );
}

// ─── Export button ────────────────────────────────────────────────────────────
function ExportBtn({ onClick, label, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-sm">
        {loading ? "hourglass_empty" : "download"}
      </span>
      {label}
    </button>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, variant = "default" }) {
  const variants = {
    default:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    success:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${variants[variant]}`}
    >
      {label}
    </span>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`text-sm font-bold tabular-nums text-slate-900 dark:text-white ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function EventAnalyticsReports() {
  const { eventId: paramId } = useParams();
  const { event: ctxEvent } = useContext(EventContext) || {};
  const eventId = paramId || ctxEvent?._id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [exporting, setExporting] = useState({
    guests: false,
    services: false,
    transport: false,
  });
  const [toast, setToast] = useState(null);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(
    async (quiet = false) => {
      if (!eventId) {
        setError("No event selected.");
        setLoading(false);
        return;
      }
      try {
        if (!quiet) setLoading(true);
        else setRefreshing(true);
        setError(null);
        const res = await getFullReport(eventId);
        if (res.success) {
          setData(res);
          setLastUpdated(new Date());
        } else {
          setError(res.message || "Failed to load analytics");
        }
      } catch {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── CSV exports ───────────────────────────────────────────────────────────
  const handleExport = async (type) => {
    const name = data?.event?.name || "event";
    setExporting((p) => ({ ...p, [type]: true }));
    let res;
    if (type === "guests") res = await exportGuestsCsv(eventId, name);
    else if (type === "services") res = await exportServicesCsv(eventId, name);
    else if (type === "transport")
      res = await exportTransportCsv(eventId, name);
    setExporting((p) => ({ ...p, [type]: false }));
    if (res?.success) showToast(`${type} CSV downloaded!`);
    else showToast(res?.message || "Export failed", "error");
  };

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "overview", icon: "dashboard", label: "Overview" },
    { key: "guests", icon: "group", label: "Guests" },
    { key: "rooms", icon: "meeting_room", label: "Rooms" },
    { key: "services", icon: "room_service", label: "Services" },
    { key: "transport", icon: "local_shipping", label: "Transport" },
    { key: "team", icon: "badge", label: "Team" },
    { key: "schedule", icon: "schedule", label: "Schedule" },
    { key: "activity", icon: "timeline", label: "Activity" },
  ];

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="animate-spin size-5 border-2 border-primary-500 border-t-transparent rounded-full" />
          <span className="text-slate-500 text-sm font-medium">
            Loading analytics…
          </span>
        </div>
        <PageSkeleton />
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-10 flex flex-col items-center text-center gap-4">
          <span className="material-symbols-outlined text-5xl text-red-300">
            sentiment_dissatisfied
          </span>
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200">
              Failed to load report
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          </div>
          <button
            onClick={() => fetchData()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
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
    event,
    guests: G,
    rooms: R,
    services: S,
    transport: T,
    team: TM,
    schedule: SC,
    activity: A,
  } = data;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[1400px] mx-auto space-y-5 pb-12 px-4 pt-6 relative">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl font-semibold text-sm transition-all ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                Analytics & Reports
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-400">
                {fmtDate(event?.startDate)} → {fmtDate(event?.endDate)}
              </span>
            </div>
            <h1 className="font-display text-page-h1 text-slate-900 dark:text-white">
              {event?.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-3">
              {event?.venue && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  {event.venue}
                </span>
              )}
              {lastUpdated && (
                <span>
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ExportBtn
              onClick={() => handleExport("guests")}
              label="Guests CSV"
              loading={exporting.guests}
            />
            <ExportBtn
              onClick={() => handleExport("services")}
              label="Services CSV"
              loading={exporting.services}
            />
            <ExportBtn
              onClick={() => handleExport("transport")}
              label="Transport CSV"
              loading={exporting.transport}
            />
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-sm ${refreshing ? "animate-spin" : ""}`}
              >
                refresh
              </span>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-1.5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === t.key
                ? "bg-white dark:bg-slate-900 text-primary-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {t.icon}
            </span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          OVERVIEW TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* KPI row 1 — guests */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="group"
              label="Total Guests"
              value={fmtNum(G?.summary?.total)}
              sub={`${fmtPct(G?.summary?.checkInRate)} checked in`}
              accent="blue"
            />
            <KPICard
              icon="how_to_reg"
              label="Checked In"
              value={fmtNum(G?.summary?.checkedIn)}
              sub={`${fmtNum(G?.summary?.notCheckedIn)} remaining`}
              accent="green"
            />
            <KPICard
              icon="star"
              label="VIP Guests"
              value={fmtNum(G?.summary?.vip)}
              sub={`${fmtPct(G?.summary?.vipRate)} of attendees`}
              accent="amber"
            />
            <KPICard
              icon="meeting_room"
              label="Rooms Assigned"
              value={fmtNum(G?.summary?.withRoom)}
              sub={`${fmtPct(G?.summary?.roomAssignmentRate)} assigned`}
              accent="purple"
            />
          </div>

          {/* KPI row 2 — ops */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="pending_actions"
              label="Open Services"
              value={fmtNum(
                (S?.summary?.open || 0) + (S?.summary?.inProgress || 0),
              )}
              sub={`${fmtPct(S?.summary?.resolutionRate)} resolved`}
              accent={S?.summary?.open > 0 ? "rose" : "green"}
            />
            <KPICard
              icon="local_shipping"
              label="Total Transports"
              value={fmtNum(T?.summary?.total)}
              sub={`${fmtPct(T?.summary?.completionRate)} complete`}
              accent="indigo"
            />
            <KPICard
              icon="badge"
              label="Active Staff"
              value={fmtNum(TM?.summary?.active)}
              sub={`${fmtPct(TM?.summary?.activeRate)} on duty`}
              accent="teal"
            />
            <KPICard
              icon="schedule"
              label="Schedule Items"
              value={fmtNum(SC?.summary?.total)}
              sub={`${fmtNum(SC?.summary?.confirmed)} confirmed`}
              accent="blue"
            />
          </div>

          {/* Check-in by hour + service breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Section
              title="Check-in Activity by Hour"
              subtitle="When guests arrive throughout the day"
              icon="access_time"
            >
              <HourBars
                data={G?.checkInByHour || []}
                colorClass="bg-primary-500"
              />
            </Section>
            <Section
              title="Service Request Types"
              subtitle="Volume by category"
              icon="room_service"
            >
              {S?.byType?.length ? (
                <div className="space-y-3">
                  {S.byType.map((item) => (
                    <ProgressRow
                      key={item.type}
                      label={item.label}
                      value={item.count}
                      pct={item.percentage}
                      colorClass="bg-primary-500"
                    />
                  ))}
                </div>
              ) : (
                <EmptyChart message="No service requests yet" />
              )}
            </Section>
          </div>

          {/* 3-col summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Room occupancy donut */}
            <Section
              title="Room Occupancy"
              subtitle="Overall utilization rate"
              icon="meeting_room"
            >
              <div className="flex flex-col items-center gap-4">
                <DonutChart
                  value={R?.summary?.occupiedRooms || 0}
                  max={R?.summary?.totalRooms || 1}
                  colorClass="stroke-primary-500"
                  label="Rooms Occupied"
                  subLabel={`${fmtNum(R?.summary?.occupiedRooms)} of ${fmtNum(R?.summary?.totalRooms)}`}
                />
                <div className="w-full space-y-2">
                  <StatRow
                    label="Total Rooms"
                    value={fmtNum(R?.summary?.totalRooms)}
                  />
                  <StatRow
                    label="Total Capacity"
                    value={fmtNum(R?.summary?.totalCapacity)}
                  />
                  <StatRow
                    label="Capacity Used"
                    value={fmtPct(R?.summary?.capacityUtilization)}
                  />
                </div>
              </div>
            </Section>

            {/* Transport status */}
            <Section
              title="Transport Status"
              subtitle="Fleet coordination"
              icon="local_shipping"
            >
              <div className="space-y-3">
                {[
                  {
                    label: "Scheduled",
                    val: T?.summary?.scheduled,
                    color: "bg-primary-400",
                  },
                  {
                    label: "In Transit",
                    val: T?.summary?.inTransit,
                    color: "bg-amber-400",
                  },
                  {
                    label: "Arrived",
                    val: T?.summary?.arrived,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Cancelled",
                    val: T?.summary?.cancelled,
                    color: "bg-slate-300 dark:bg-slate-600",
                  },
                ].map((item) => (
                  <ProgressRow
                    key={item.label}
                    label={item.label}
                    value={item.val || 0}
                    pct={
                      T?.summary?.total > 0
                        ? Math.round(((item.val || 0) / T.summary.total) * 100)
                        : 0
                    }
                    colorClass={item.color}
                  />
                ))}
              </div>
            </Section>

            {/* Team & activity */}
            <Section
              title="Team & Activity"
              subtitle="Staff and operational logs"
              icon="groups"
            >
              <div className="space-y-2">
                <StatRow
                  label="Total Staff"
                  value={fmtNum(TM?.summary?.total)}
                />
                <StatRow
                  label="Active"
                  value={fmtNum(TM?.summary?.active)}
                  valueClass="text-emerald-600"
                />
                <StatRow
                  label="Inactive"
                  value={fmtNum(TM?.summary?.inactive)}
                  valueClass="text-slate-400"
                />
                <StatRow
                  label="Total Activity Logs"
                  value={fmtNum(A?.summary?.total)}
                />
                <StatRow
                  label="Critical Today"
                  value={fmtNum(A?.summary?.criticalToday)}
                  valueClass={
                    A?.summary?.criticalToday > 0 ? "text-red-600" : ""
                  }
                />
              </div>
            </Section>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          GUESTS TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "guests" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="group"
              label="Total Guests"
              value={fmtNum(G?.summary?.total)}
              accent="blue"
            />
            <KPICard
              icon="how_to_reg"
              label="Checked In"
              value={fmtNum(G?.summary?.checkedIn)}
              sub={fmtPct(G?.summary?.checkInRate)}
              accent="green"
            />
            <KPICard
              icon="logout"
              label="Checked Out"
              value={fmtNum(G?.summary?.checkedOut)}
              accent="slate"
            />
            <KPICard
              icon="star"
              label="VIP Guests"
              value={fmtNum(G?.summary?.vip)}
              sub={fmtPct(G?.summary?.vipRate)}
              accent="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Check-in funnel */}
            <Section
              title="Guest Status Breakdown"
              subtitle="Arrival and check-in funnel"
              icon="how_to_reg"
              action={
                <ExportBtn
                  onClick={() => handleExport("guests")}
                  label="Export"
                  loading={exporting.guests}
                />
              }
            >
              <div className="space-y-3">
                <ProgressRow
                  label="Checked In"
                  value={G?.summary?.checkedIn || 0}
                  pct={G?.summary?.checkInRate || 0}
                  colorClass="bg-emerald-500"
                />
                <ProgressRow
                  label="Not Checked In"
                  value={G?.summary?.notCheckedIn || 0}
                  pct={100 - (G?.summary?.checkInRate || 0)}
                  colorClass="bg-slate-200 dark:bg-slate-700"
                />
                <ProgressRow
                  label="VIP"
                  value={G?.summary?.vip || 0}
                  pct={G?.summary?.vipRate || 0}
                  colorClass="bg-amber-400"
                />
                <ProgressRow
                  label="Room Assigned"
                  value={G?.summary?.withRoom || 0}
                  pct={G?.summary?.roomAssignmentRate || 0}
                  colorClass="bg-purple-400"
                />
                <ProgressRow
                  label="Special Requests"
                  value={G?.summary?.withSpecialRequests || 0}
                  pct={
                    G?.summary?.total > 0
                      ? Math.round(
                          (G.summary.withSpecialRequests / G.summary.total) *
                            100,
                        )
                      : 0
                  }
                  colorClass="bg-rose-400"
                />
              </div>
            </Section>

            {/* Check-in by hour */}
            <Section
              title="Check-in by Hour"
              subtitle="Peak arrival times"
              icon="access_time"
            >
              <HourBars
                data={G?.checkInByHour || []}
                colorClass="bg-primary-500"
              />
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Arrival by hour */}
            <Section
              title="Scheduled Arrivals by Hour"
              subtitle="Expected arrival distribution"
              icon="flight_land"
            >
              <HourBars
                data={G?.arrivalByHour || []}
                colorClass="bg-indigo-400"
              />
            </Section>

            {/* Transport mode */}
            <Section
              title="Transport Mode Breakdown"
              subtitle="How guests are travelling"
              icon="directions_car"
            >
              {G?.transportModeBreakdown?.length ? (
                <div className="space-y-3">
                  {G.transportModeBreakdown.map((item) => (
                    <ProgressRow
                      key={item.mode}
                      label={item.mode}
                      value={item.count}
                      pct={
                        G?.summary?.total > 0
                          ? Math.round((item.count / G.summary.total) * 100)
                          : 0
                      }
                      colorClass="bg-indigo-400"
                    />
                  ))}
                </div>
              ) : (
                <EmptyChart message="No transport mode data" />
              )}
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Age distribution */}
            <Section
              title="Age Distribution"
              subtitle="Guest age group breakdown"
              icon="person"
            >
              {G?.ageDistribution?.length ? (
                <BarChart
                  data={G.ageDistribution}
                  labelKey="range"
                  valueKey="count"
                  colorClass="fill-purple-400"
                  height={140}
                />
              ) : (
                <EmptyChart message="No age data collected" />
              )}
            </Section>

            {/* Top groups */}
            <Section
              title="Top Guest Groups"
              subtitle="Largest delegations"
              icon="groups"
            >
              {G?.topGroups?.length ? (
                <div className="space-y-2">
                  {G.topGroups.map((g, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-xs font-black text-primary-600">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {g.group}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                        {fmtNum(g.count)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyChart message="No group data" />
              )}
            </Section>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          ROOMS TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "rooms" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="meeting_room"
              label="Total Rooms"
              value={fmtNum(R?.summary?.totalRooms)}
              accent="blue"
            />
            <KPICard
              icon="hotel"
              label="Occupied"
              value={fmtNum(R?.summary?.occupiedRooms)}
              sub={fmtPct(R?.summary?.occupancyRate)}
              accent="green"
            />
            <KPICard
              icon="door_open"
              label="Available"
              value={fmtNum(R?.summary?.availableRooms)}
              accent="amber"
            />
            <KPICard
              icon="people"
              label="Guests Assigned"
              value={fmtNum(R?.summary?.totalGuestsAssigned)}
              sub={`Cap: ${fmtNum(R?.summary?.totalCapacity)}`}
              accent="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Occupancy donut */}
            <Section
              title="Occupancy Rate"
              subtitle="Current room utilization"
              icon="meeting_room"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <DonutChart
                  value={R?.summary?.occupiedRooms || 0}
                  max={R?.summary?.totalRooms || 1}
                  size={140}
                  colorClass="stroke-primary-500"
                  label="Rooms Occupied"
                />
                <div className="flex-1 space-y-2 w-full">
                  <StatRow
                    label="Occupancy Rate"
                    value={fmtPct(R?.summary?.occupancyRate)}
                    valueClass="text-primary-600"
                  />
                  <StatRow
                    label="Capacity Utilization"
                    value={fmtPct(R?.summary?.capacityUtilization)}
                    valueClass="text-purple-600"
                  />
                  <StatRow
                    label="Total Capacity"
                    value={fmtNum(R?.summary?.totalCapacity)}
                  />
                  <StatRow
                    label="Guests Assigned"
                    value={fmtNum(R?.summary?.totalGuestsAssigned)}
                  />
                </div>
              </div>
            </Section>

            {/* Type breakdown */}
            <Section
              title="Room Type Breakdown"
              subtitle="Distribution by category"
              icon="category"
            >
              {R?.typeBreakdown?.length ? (
                <div className="space-y-3">
                  {R.typeBreakdown.map((item) => (
                    <ProgressRow
                      key={item.type}
                      label={item.type}
                      value={item.count}
                      pct={
                        R?.summary?.totalRooms > 0
                          ? Math.round(
                              (item.count / R.summary.totalRooms) * 100,
                            )
                          : 0
                      }
                      badge={`Cap: ${item.totalCapacity}`}
                      colorClass="bg-purple-400"
                    />
                  ))}
                </div>
              ) : (
                <EmptyChart message="No room types" />
              )}
            </Section>
          </div>

          {/* Room detail table */}
          <Section
            title="Room Utilization Detail"
            subtitle="Per-room occupancy breakdown"
            icon="table_chart"
            noPad
          >
            {R?.roomDetails?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Room</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3 text-center">Capacity</th>
                      <th className="px-5 py-3 text-center">Occupied</th>
                      <th className="px-5 py-3 text-center">Available</th>
                      <th className="px-5 py-3">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {R.roomDetails.map((room, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-5 py-3 font-bold text-slate-900 dark:text-white">
                          {room.roomNumber}
                        </td>
                        <td className="px-5 py-3 capitalize text-slate-500">
                          {room.type}
                        </td>
                        <td className="px-5 py-3 text-center tabular-nums">
                          {room.capacity}
                        </td>
                        <td className="px-5 py-3 text-center font-bold text-emerald-600">
                          {room.occupied}
                        </td>
                        <td className="px-5 py-3 text-center text-slate-400">
                          {room.available}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-500 rounded-full"
                                style={{ width: `${room.utilizationRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold tabular-nums text-slate-600 dark:text-slate-400 w-9 text-right">
                              {room.utilizationRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8">
                <EmptyChart message="No rooms created yet" />
              </div>
            )}
          </Section>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SERVICES TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "services" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="receipt_long"
              label="Total Requests"
              value={fmtNum(S?.summary?.total)}
              accent="blue"
            />
            <KPICard
              icon="pending_actions"
              label="Open"
              value={fmtNum(S?.summary?.open)}
              sub="Awaiting action"
              accent={S?.summary?.open > 0 ? "rose" : "green"}
            />
            <KPICard
              icon="run_circle"
              label="In Progress"
              value={fmtNum(S?.summary?.inProgress)}
              accent="amber"
            />
            <KPICard
              icon="check_circle"
              label="Resolved"
              value={fmtNum(S?.summary?.completed)}
              sub={fmtPct(S?.summary?.resolutionRate)}
              accent="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Type breakdown */}
            <Section
              title="By Service Type"
              subtitle="Request volume per category"
              icon="category"
              action={
                <ExportBtn
                  onClick={() => handleExport("services")}
                  label="Export"
                  loading={exporting.services}
                />
              }
            >
              {S?.byType?.length ? (
                <div className="space-y-3">
                  {S.byType.map((item) => (
                    <ProgressRow
                      key={item.type}
                      label={item.label}
                      value={item.count}
                      pct={item.percentage}
                      colorClass="bg-primary-500"
                    />
                  ))}
                </div>
              ) : (
                <EmptyChart message="No service data" />
              )}
            </Section>

            {/* Urgency breakdown */}
            <Section
              title="By Urgency"
              subtitle="Priority distribution"
              icon="priority_high"
            >
              {S?.byUrgency?.length ? (
                <div className="space-y-3">
                  {S.byUrgency.map((item) => {
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
                        pct={item.percentage}
                        colorClass={colorMap[item.urgency] || "bg-slate-400"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyChart message="No urgency data" />
              )}
            </Section>

            {/* Resolution stats */}
            <Section
              title="Resolution Metrics"
              subtitle="Service completion health"
              icon="check_circle"
            >
              <div className="flex flex-col items-center gap-4">
                <DonutChart
                  value={S?.summary?.completed || 0}
                  max={S?.summary?.total || 1}
                  size={120}
                  colorClass="stroke-emerald-500"
                  label="Resolution Rate"
                />
                <div className="w-full space-y-2">
                  <StatRow
                    label="Open"
                    value={fmtNum(S?.summary?.open)}
                    valueClass="text-red-500"
                  />
                  <StatRow
                    label="In Progress"
                    value={fmtNum(S?.summary?.inProgress)}
                    valueClass="text-amber-500"
                  />
                  <StatRow
                    label="Completed"
                    value={fmtNum(S?.summary?.completed)}
                    valueClass="text-emerald-600"
                  />
                  <StatRow
                    label="Cancelled"
                    value={fmtNum(S?.summary?.cancelled)}
                    valueClass="text-slate-400"
                  />
                  <StatRow
                    label="Permission Granted"
                    value={fmtNum(S?.summary?.permissionGranted)}
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Recently resolved */}
          {S?.recentResolved?.length > 0 && (
            <Section
              title="Recently Resolved Requests"
              subtitle="Last 5 completed service calls"
              icon="history"
              noPad
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {S.recentResolved.map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-emerald-600">
                          check_circle
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                          {req.requestType}
                        </p>
                        <p className="text-xs text-slate-400">
                          {req.guest?.fullName || "General"}{" "}
                          {req.room ? `· Room ${req.room.number}` : ""}
                        </p>
                      </div>
                    </div>
                    <Badge label="Resolved" variant="success" />
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TRANSPORT TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "transport" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="local_shipping"
              label="Total Trips"
              value={fmtNum(T?.summary?.total)}
              accent="blue"
            />
            <KPICard
              icon="schedule"
              label="Scheduled"
              value={fmtNum(T?.summary?.scheduled)}
              accent="indigo"
            />
            <KPICard
              icon="airport_shuttle"
              label="In Transit"
              value={fmtNum(T?.summary?.inTransit)}
              accent="amber"
              pulse={T?.summary?.inTransit > 0}
            />
            <KPICard
              icon="check_circle"
              label="Completed"
              value={fmtNum(T?.summary?.arrived)}
              sub={fmtPct(T?.summary?.completionRate)}
              accent="green"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Transports by hour */}
            <Section
              title="Scheduled Trips by Hour"
              subtitle="Fleet deployment throughout the day"
              icon="access_time"
              action={
                <ExportBtn
                  onClick={() => handleExport("transport")}
                  label="Export"
                  loading={exporting.transport}
                />
              }
            >
              <HourBars data={T?.byHour || []} colorClass="bg-indigo-400" />
            </Section>

            {/* Status breakdown */}
            <Section
              title="Trip Status Breakdown"
              subtitle="Fleet coordination health"
              icon="local_shipping"
            >
              <div className="space-y-3">
                {[
                  {
                    label: "Scheduled",
                    val: T?.summary?.scheduled,
                    color: "bg-primary-400",
                  },
                  {
                    label: "In Transit",
                    val: T?.summary?.inTransit,
                    color: "bg-amber-400",
                  },
                  {
                    label: "Arrived",
                    val: T?.summary?.arrived,
                    color: "bg-emerald-500",
                  },
                  {
                    label: "Cancelled",
                    val: T?.summary?.cancelled,
                    color: "bg-slate-300 dark:bg-slate-600",
                  },
                ].map((item) => (
                  <ProgressRow
                    key={item.label}
                    label={item.label}
                    value={item.val || 0}
                    pct={
                      T?.summary?.total > 0
                        ? Math.round(((item.val || 0) / T.summary.total) * 100)
                        : 0
                    }
                    colorClass={item.color}
                  />
                ))}
              </div>
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top drivers */}
            <Section
              title="Top Drivers by Trips"
              subtitle="Most active drivers"
              icon="person_pin_circle"
            >
              {T?.topDrivers?.length ? (
                <div className="space-y-2">
                  {T.topDrivers.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="size-7 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-black text-indigo-600">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {d.driver}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {d.trips}
                        </span>
                        <span className="text-xs text-slate-400">trips</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyChart message="No driver data" />
              )}
            </Section>

            {/* Top routes */}
            <Section
              title="Top Routes"
              subtitle="Most frequent pickup → dropoff pairs"
              icon="route"
            >
              {T?.topRoutes?.length ? (
                <div className="space-y-3">
                  {T.topRoutes.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <span className="size-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-xs font-black text-primary-600 flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">
                          Pickup → Dropoff
                        </p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                          {r.pickup || "—"} → {r.dropoff || "—"}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white flex-shrink-0">
                        {r.count}×
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyChart message="No route data" />
              )}
            </Section>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TEAM TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "team" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <KPICard
              icon="badge"
              label="Total Staff"
              value={fmtNum(TM?.summary?.total)}
              accent="blue"
            />
            <KPICard
              icon="check_circle"
              label="Active"
              value={fmtNum(TM?.summary?.active)}
              sub={fmtPct(TM?.summary?.activeRate)}
              accent="green"
            />
            <KPICard
              icon="person_off"
              label="Inactive"
              value={fmtNum(TM?.summary?.inactive)}
              accent="slate"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Active rate donut */}
            <Section
              title="Staff Active Rate"
              subtitle="On-duty vs off-duty breakdown"
              icon="people"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <DonutChart
                  value={TM?.summary?.active || 0}
                  max={TM?.summary?.total || 1}
                  size={140}
                  colorClass="stroke-emerald-500"
                  label="Active Rate"
                />
                <div className="flex-1 space-y-3 w-full">
                  <ProgressRow
                    label="Active"
                    value={TM?.summary?.active || 0}
                    pct={TM?.summary?.activeRate || 0}
                    colorClass="bg-emerald-500"
                  />
                  <ProgressRow
                    label="Inactive"
                    value={TM?.summary?.inactive || 0}
                    pct={100 - (TM?.summary?.activeRate || 0)}
                    colorClass="bg-slate-200 dark:bg-slate-700"
                  />
                </div>
              </div>
            </Section>

            {/* Role breakdown */}
            <Section
              title="Staff by Role"
              subtitle="Role distribution across the team"
              icon="work"
            >
              {TM?.byRole?.length ? (
                <div className="space-y-3">
                  {TM.byRole.map((item) => (
                    <ProgressRow
                      key={item.role}
                      label={item.role}
                      value={item.count}
                      pct={item.percentage}
                      colorClass="bg-purple-400"
                    />
                  ))}
                </div>
              ) : (
                <EmptyChart message="No role data" />
              )}
            </Section>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          SCHEDULE TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "schedule" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard
              icon="event_note"
              label="Total Activities"
              value={fmtNum(SC?.summary?.total)}
              accent="blue"
            />
            <KPICard
              icon="check_circle"
              label="Confirmed"
              value={fmtNum(SC?.summary?.confirmed)}
              sub={fmtPct(SC?.summary?.completionRate)}
              accent="green"
            />
            <KPICard
              icon="pending"
              label="Pending"
              value={fmtNum(SC?.summary?.pending)}
              accent="amber"
            />
            <KPICard
              icon="cancel"
              label="Cancelled"
              value={fmtNum(SC?.summary?.cancelled)}
              accent="slate"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Workstream breakdown */}
            <Section
              title="Activities by Workstream"
              subtitle="Schedule distribution across tracks"
              icon="category"
            >
              {SC?.byWorkstream?.length ? (
                <div className="space-y-3">
                  {SC.byWorkstream.map((item) => {
                    const colorMap = {
                      "Main Sessions": "bg-primary-500",
                      Transport: "bg-amber-400",
                      Catering: "bg-emerald-400",
                      Staffing: "bg-purple-400",
                      "Media/AV": "bg-rose-400",
                    };
                    return (
                      <ProgressRow
                        key={item.workstream}
                        label={item.workstream}
                        value={item.count}
                        pct={item.percentage}
                        colorClass={colorMap[item.workstream] || "bg-slate-400"}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyChart message="No schedule data" />
              )}
            </Section>

            {/* Status breakdown */}
            <Section
              title="Schedule Status"
              subtitle="Activity completion pipeline"
              icon="schema"
            >
              <div className="space-y-3">
                {[
                  {
                    label: "Confirmed",
                    val: SC?.summary?.confirmed,
                    color: "bg-emerald-400",
                  },
                  {
                    label: "Active",
                    val: SC?.summary?.active,
                    color: "bg-primary-400",
                  },
                  {
                    label: "Pending",
                    val: SC?.summary?.pending,
                    color: "bg-amber-400",
                  },
                  {
                    label: "Cancelled",
                    val: SC?.summary?.cancelled,
                    color: "bg-slate-300 dark:bg-slate-600",
                  },
                ].map((item) => (
                  <ProgressRow
                    key={item.label}
                    label={item.label}
                    value={item.val || 0}
                    pct={
                      SC?.summary?.total > 0
                        ? Math.round(((item.val || 0) / SC.summary.total) * 100)
                        : 0
                    }
                    colorClass={item.color}
                  />
                ))}
              </div>
            </Section>
          </div>

          {/* Upcoming activities */}
          {SC?.upcomingActivities?.length > 0 && (
            <Section
              title="Upcoming Activities"
              subtitle="Next 5 scheduled items"
              icon="upcoming"
              noPad
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {SC.upcomingActivities.map((act) => {
                  const workstreamColors = {
                    "Main Sessions": "border-l-primary-500",
                    Transport: "border-l-amber-500",
                    Catering: "border-l-emerald-500",
                    Staffing: "border-l-purple-500",
                    "Media/AV": "border-l-rose-500",
                  };
                  return (
                    <div
                      key={act._id}
                      className={`flex items-center gap-4 px-6 py-4 border-l-4 ${workstreamColors[act.workstream] || "border-l-slate-300"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {act.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {act.workstream} · {act.location || "TBD"} ·{" "}
                          {new Date(act.startTime).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge
                        label={act.status}
                        variant={
                          act.status === "Confirmed"
                            ? "success"
                            : act.status === "Active"
                              ? "info"
                              : act.status === "Cancelled"
                                ? "danger"
                                : "warning"
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          ACTIVITY TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === "activity" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <KPICard
              icon="history"
              label="Total Logs"
              value={fmtNum(A?.summary?.total)}
              accent="blue"
            />
            <KPICard
              icon="priority_high"
              label="Critical Today"
              value={fmtNum(A?.summary?.criticalToday)}
              accent={A?.summary?.criticalToday > 0 ? "rose" : "green"}
            />
            <KPICard
              icon="bar_chart"
              label="Unique Types"
              value={fmtNum(A?.byType?.length)}
              accent="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Daily trend */}
            <Section
              title="Activity (Last 7 Days)"
              subtitle="Daily operational event volume"
              icon="trending_up"
            >
              {A?.dailyTrend?.length ? (
                <BarChart
                  data={A.dailyTrend}
                  labelKey="date"
                  valueKey="count"
                  colorClass="fill-primary-400"
                  height={150}
                />
              ) : (
                <EmptyChart message="No recent activity" />
              )}
            </Section>

            {/* By type */}
            <Section
              title="Activity by Type"
              subtitle="Log category breakdown"
              icon="category"
            >
              {A?.byType?.length ? (
                <div className="space-y-3">
                  {A.byType.map((item) => {
                    const total = A.summary?.total || 1;
                    return (
                      <ProgressRow
                        key={item.type}
                        label={item.type.replace(/-/g, " ")}
                        value={item.count}
                        pct={Math.round((item.count / total) * 100)}
                        colorClass="bg-primary-400"
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyChart message="No activity data" />
              )}
            </Section>
          </div>

          {/* Priority breakdown */}
          <Section
            title="Activity by Priority"
            subtitle="Urgency distribution across all logs"
            icon="flag"
          >
            {A?.byPriority?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {A.byPriority.map((item) => {
                  const colorMap = {
                    normal: "bg-primary-400",
                    high: "bg-amber-400",
                    critical: "bg-red-500",
                  };
                  const iconMap = {
                    normal: "info",
                    high: "warning",
                    critical: "emergency",
                  };
                  const total = A.summary?.total || 1;
                  return (
                    <div
                      key={item.priority}
                      className="flex flex-col items-center gap-3"
                    >
                      <DonutChart
                        value={item.count}
                        max={total}
                        colorClass={`stroke-${item.priority === "critical" ? "red" : item.priority === "high" ? "amber" : "blue"}-500`}
                        label={item.priority}
                        subLabel={`${fmtNum(item.count)} logs`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyChart message="No priority data" />
            )}
          </Section>
        </div>
      )}

      {/* ── Footer ── */}
      <p className="text-center text-xs text-slate-400 pb-2">
        Report generated at{" "}
        {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "—"}
      </p>
    </div>
  );
}