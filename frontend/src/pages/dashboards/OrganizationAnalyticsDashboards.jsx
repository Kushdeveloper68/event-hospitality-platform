import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getFullAnalytics, getKPISummary } from "../../api/organizationAnalyticsDashboardsApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString());

const fmtCompact = (n) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

const toISO = (d) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const daysAgoISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISO(d);
};

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const niceScale = (v) => {
  if (v <= 4) return { step: 1, max: 4 };
  const raw = v / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  const m = [1, 2, 3, 4, 5, 6, 8, 10].find((x) => x >= n);
  return { step: m * p, max: m * p * 4 };
};

const PRESETS = [
  { key: "all", label: "All time", days: null },
  { key: "7", label: "7D", days: 7 },
  { key: "30", label: "30D", days: 30 },
  { key: "90", label: "90D", days: 90 },
];

const STATUS = {
  in_progress: {
    label: "Live",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
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

const TONE_CHIP = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const TONE_BAR = {
  blue: "bg-blue-600 dark:bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  violet: "bg-violet-500",
  indigo: "bg-indigo-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  slate: "bg-slate-300 dark:bg-slate-600",
};

const TONE_TEXT = {
  blue: "text-blue-700 dark:text-blue-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  amber: "text-amber-700 dark:text-amber-300",
  violet: "text-violet-700 dark:text-violet-300",
};

const CHART_TONE = {
  blue: {
    line: "stroke-blue-600 dark:stroke-blue-400",
    area: "fill-blue-600/10 dark:fill-blue-400/10",
    dot: "fill-white stroke-blue-600 dark:fill-slate-900 dark:stroke-blue-400",
    bar: "fill-blue-600 dark:fill-blue-500",
  },
  indigo: {
    line: "stroke-indigo-500 dark:stroke-indigo-400",
    area: "fill-indigo-500/10 dark:fill-indigo-400/10",
    dot: "fill-white stroke-indigo-500 dark:fill-slate-900 dark:stroke-indigo-400",
    bar: "fill-indigo-500 dark:fill-indigo-400",
  },
};

const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";

// ─── Layout primitives ────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
    </div>
  );
}

function Card({ title, subtitle, icon, action, children, className = "" }) {
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
            <h3 className="truncate text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="flex-1 p-5 pt-4 sm:p-6 sm:pt-5">{children}</div>
    </section>
  );
}

function StatCard({ icon, label, value, sub, tone = "blue", live }) {
  return (
    <div className={`p-5 ${CARD}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
        </div>
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${TONE_CHIP[tone]}`}>
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">
          {value}
        </p>
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

function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="bg-white p-4 dark:bg-slate-900 sm:p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            <span className={`material-symbols-outlined text-[16px] ${TONE_TEXT[it.tone] || ""}`}>{it.icon}</span>
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

function Delta({ value, label = "vs prior 6 months" }) {
  if (value == null) return null;
  const up = value >= 0;
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
          up
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">{up ? "trending_up" : "trending_down"}</span>
        {up ? "+" : ""}
        {value}%
      </span>
      {label}
    </span>
  );
}

function ProgressRow({ label, value, pct = 0, tone = "blue" }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="truncate font-semibold capitalize text-slate-700 dark:text-slate-300">{label}</span>
        <span className="shrink-0 font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
          {fmtNum(value)}
          <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{pct}%</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${TONE_BAR[tone] || TONE_BAR.blue}`}
          style={{ width: `${Math.min(Number(pct) || 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const c = STATUS[status] || STATUS.upcoming;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${c.cls}`}
    >
      <span className={`size-1.5 rounded-full ${c.dot} ${status === "in_progress" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

function EmptyState({ icon = "analytics", message = "No data available yet." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
}

function DetailRow({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 text-sm last:border-0 dark:border-slate-800">
      <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span className={`font-extrabold tabular-nums ${strong || "text-slate-900 dark:text-slate-100"}`}>{value}</span>
    </div>
  );
}

// ─── Charts (responsive SVG, theme-aware, with hover tooltips) ────────────────
function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setW(Math.floor(el.getBoundingClientRect().width));
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

function Tooltip({ x, y, width, title, value }) {
  const left = Math.min(Math.max(x, 56), Math.max(width - 56, 56));
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs shadow-lg dark:bg-slate-100"
      style={{ left, top: Math.max(y - 10, 0) }}
    >
      <p className="font-medium text-slate-300 dark:text-slate-500">{title}</p>
      <p className="font-extrabold text-white dark:text-slate-900">{value}</p>
    </div>
  );
}

function Axis({ ticks, m, innerW, y, width }) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={m.l} x2={m.l + innerW} y1={y(t)} y2={y(t)} className="stroke-slate-100 dark:stroke-slate-800" />
          <text
            x={m.l - 8}
            y={y(t) + 4}
            textAnchor="end"
            fontSize="11"
            className="fill-slate-500 dark:fill-slate-400"
          >
            {fmtCompact(t)}
          </text>
        </g>
      ))}
    </>
  );
}

function XLabels({ labels, xAt, innerW, y }) {
  const n = labels.length;
  const k = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(innerW / 72))));
  return labels.map((l, i) => {
    if (i % k !== 0) return null;
    return (
      <text
        key={i}
        x={xAt(i)}
        y={y}
        textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}
        fontSize="11"
        className="fill-slate-500 dark:fill-slate-400"
      >
        {l}
      </text>
    );
  });
}

function LineChart({ data, height = 220, tone = "blue", unit = "" }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  if (!data?.length) return null;

  const t = CHART_TONE[tone];
  const m = { t: 12, r: 16, b: 30, l: 40 };
  const n = data.length;
  const innerW = Math.max(width - m.l - m.r, 10);
  const innerH = height - m.t - m.b;
  const { step, max } = niceScale(Math.max(...data.map((d) => d.count), 1));
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const y = (v) => m.t + innerH - (v / max) * innerH;
  const xAt = (i) => m.l + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const pts = data.map((d, i) => ({ x: xAt(i), y: y(d.count) }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `M ${pts[0].x} ${y(0)} ${pts.map((p) => `L ${p.x} ${p.y}`).join(" ")} L ${pts[n - 1].x} ${y(0)} Z`;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    setHover(n === 1 ? 0 : Math.min(n - 1, Math.max(0, Math.round((px / innerW) * (n - 1)))));
  };

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} className="block" role="img">
          <Axis ticks={ticks} m={m} innerW={innerW} y={y} width={width} />
          <path d={area} className={t.area} />
          <path d={line} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={t.line} />
          {hover != null && (
            <line x1={pts[hover].x} x2={pts[hover].x} y1={m.t} y2={y(0)} className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="4 4" />
          )}
          {pts.map((p, i) =>
            n <= 16 || i === hover ? (
              <circle key={i} cx={p.x} cy={p.y} r={i === hover ? 5 : 3.5} strokeWidth="2" className={t.dot} />
            ) : null
          )}
          <XLabels labels={data.map((d) => d.label)} xAt={xAt} innerW={innerW} y={height - 8} />
          <rect
            x={m.l}
            y={m.t}
            width={innerW}
            height={innerH}
            fill="transparent"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      )}
      {hover != null && width > 0 && (
        <Tooltip x={pts[hover].x} y={pts[hover].y} width={width} title={data[hover].label} value={`${fmtNum(data[hover].count)} ${unit}`.trim()} />
      )}
    </div>
  );
}

function BarChart({ data, height = 220, tone = "blue", unit = "" }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  if (!data?.length) return null;

  const t = CHART_TONE[tone];
  const m = { t: 12, r: 8, b: 30, l: 40 };
  const n = data.length;
  const innerW = Math.max(width - m.l - m.r, 10);
  const innerH = height - m.t - m.b;
  const { step, max } = niceScale(Math.max(...data.map((d) => d.count), 1));
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const y = (v) => m.t + innerH - (v / max) * innerH;
  const band = innerW / n;
  const barW = Math.max(3, Math.min(band * 0.62, 40));
  const xAt = (i) => m.l + band * i + band / 2;

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} className="block" role="img">
          <Axis ticks={ticks} m={m} innerW={innerW} y={y} width={width} />
          {data.map((d, i) => {
            const h = Math.max(d.count > 0 ? 3 : 0, y(0) - y(d.count));
            return (
              <rect
                key={i}
                x={xAt(i) - barW / 2}
                y={y(0) - h}
                width={barW}
                height={h}
                rx={Math.min(4, barW / 2)}
                className={t.bar}
                style={{ opacity: hover == null || hover === i ? 1 : 0.4, transition: "opacity .15s" }}
              />
            );
          })}
          <XLabels labels={data.map((d) => d.label)} xAt={xAt} innerW={innerW} y={height - 8} />
          {data.map((d, i) => (
            <rect
              key={i}
              x={m.l + band * i}
              y={m.t}
              width={band}
              height={innerH}
              fill="transparent"
              onPointerEnter={() => setHover(i)}
              onPointerDown={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            />
          ))}
        </svg>
      )}
      {hover != null && width > 0 && (
        <Tooltip x={xAt(hover)} y={y(data[hover].count)} width={width} title={data[hover].label} value={`${fmtNum(data[hover].count)} ${unit}`.trim()} />
      )}
    </div>
  );
}

function Donut({ value = 0, label, size = 148, tone = "blue" }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const r = 42;
  const c = 2 * Math.PI * r;
  const stroke = {
    blue: "stroke-blue-600 dark:stroke-blue-400",
    emerald: "stroke-emerald-500",
    violet: "stroke-violet-500",
  }[tone];
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-800" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          className={`${stroke} transition-all duration-700`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">
          {pct}%
        </span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}

function PageSkeleton() {
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
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={`h-80 p-6 lg:col-span-2 ${CARD}`}>
          <Skeleton className="mb-5 h-5 w-44" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className={`h-80 p-6 ${CARD}`}>
          <Skeleton className="mb-5 h-5 w-32" />
          <Skeleton className="mx-auto size-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function OrganizationAnalyticsDashboards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [toast, setToast] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const loadedRef = useRef(false);
  const toastTimer = useRef(null);

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
          loadedRef.current = true;
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

  // First load shows the skeleton; later filter changes refresh quietly
  useEffect(() => {
    fetchData(loadedRef.current);
  }, [fetchData]);

  // ── auto-refresh KPIs every 60s ───────────────────────────────────────────
  const hasData = !!data;
  useEffect(() => {
    if (!hasData) return undefined;
    const interval = setInterval(async () => {
      try {
        const res = await getKPISummary();
        if (res.success) {
          setData((prev) => (prev ? { ...prev, kpiSummary: res.kpiSummary } : prev));
          setLastUpdated(new Date());
        }
      } catch (_) {
        // silent
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [hasData]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ── date presets ───────────────────────────────────────────────────────────
  const activePreset = (() => {
    if (!dateRange.startDate && !dateRange.endDate) return "all";
    const today = toISO(new Date());
    const hit = PRESETS.find(
      (p) => p.days && dateRange.endDate === today && dateRange.startDate === daysAgoISO(p.days)
    );
    return hit ? hit.key : "custom";
  })();

  const applyPreset = (p) =>
    setDateRange(p.days ? { startDate: daysAgoISO(p.days), endDate: toISO(new Date()) } : { startDate: "", endDate: "" });

  // ── CSV export ─────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (!data?.topEvents?.length) return;
    const headers = ["Event Name", "Venue", "Start Date", "Status", "Guests", "Checked In", "Check-in Rate", "Services", "Transports"];
    const rows = data.topEvents.map((ev) => [
      ev.name,
      ev.venue || "",
      fmtDate(ev.startDate),
      ev.status,
      ev.guests,
      ev.checkedIn,
      `${ev.checkInRate}%`,
      ev.services,
      ev.transports,
    ]);
    const csv = [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("CSV exported successfully");
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

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
      <PageShell>
        <div className="mb-8 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <PageSkeleton />
      </PageShell>
    );
  }

  // ── ERROR (nothing loaded yet) ─────────────────────────────────────────────
  if (error && !data) {
    return (
      <PageShell>
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="material-symbols-outlined text-[25px]">error</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Failed to load analytics</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={() => fetchData()}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  if (!data) return null;

  const {
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
  const kpi = data.kpiSummary || {};
  const pending = Math.max((kpi.totalGuests || 0) - (kpi.checkedInGuests || 0), 0);
  const checkInRate = kpi.checkInRate ?? 0;

  const q = eventSearch.trim().toLowerCase();
  const visibleEvents = (topEvents || []).filter(
    (ev) =>
      (!q || ev.name?.toLowerCase().includes(q) || (ev.venue || "").toLowerCase().includes(q)) &&
      (eventFilter === "all" || ev.status === eventFilter)
  );

  const inputCls =
    "h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20 dark:[color-scheme:dark]";

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
            Performance overview
          </p>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
            Organization analytics
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Cross-event performance across all your managed events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p)}
                className={`rounded-md px-3 py-1.5 text-[11px] font-bold transition ${
                  activePreset === p.key
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="date"
              aria-label="Start date"
              value={dateRange.startDate}
              max={dateRange.endDate || undefined}
              onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))}
              className={inputCls}
            />
            <span className="text-xs font-bold text-slate-400">–</span>
            <input
              type="date"
              aria-label="End date"
              value={dateRange.endDate}
              min={dateRange.startDate || undefined}
              onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))}
              className={inputCls}
            />
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            title={lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Refresh"}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={`material-symbols-outlined text-[18px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            {refreshing ? "Refreshing…" : lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Refresh"}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!topEvents?.length}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </header>

      {/* Non-blocking error */}
      {error && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="truncate text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => fetchData(true)} className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800" aria-label="Analytics sections">
        {tabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              aria-current={active ? "page" : undefined}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
                active
                  ? "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </nav>

      <div aria-busy={refreshing} className={`transition-opacity ${refreshing ? "opacity-60" : ""}`}>
        {/* ═════════ OVERVIEW ═════════ */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon="calendar_today"
                label="Total events"
                value={fmtNum(kpi.totalEvents)}
                sub={`${fmtNum(kpi.activeEvents)} live · ${fmtNum(kpi.upcomingEvents)} upcoming · ${fmtNum(kpi.completedEvents)} completed`}
                tone="blue"
                live={kpi.activeEvents > 0}
              />
              <StatCard
                icon="group"
                label="Total guests"
                value={fmtNum(kpi.totalGuests)}
                sub={`${checkInRate}% checked in · ${fmtNum(pending)} pending`}
                tone="indigo"
              />
              <StatCard
                icon="pending_actions"
                label="Open services"
                value={fmtNum(kpi.openServices)}
                sub={`${kpi.serviceResolutionRate ?? 0}% resolution rate`}
                tone={kpi.openServices > 0 ? "amber" : "emerald"}
              />
              <StatCard icon="badge" label="Active staff" value={fmtNum(kpi.activeStaff)} sub="Across all events" tone="violet" />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card
                title="Guest check-in volume"
                subtitle="Arrivals per month"
                icon="show_chart"
                className="lg:col-span-2"
                action={<Delta value={monthlyCheckIn?.yoyChange} />}
              >
                {monthlyCheckIn?.data?.length ? (
                  <LineChart data={monthlyCheckIn.data} height={240} unit="check-ins" />
                ) : (
                  <EmptyState icon="show_chart" message="No check-in data yet." />
                )}
              </Card>

              <Card title="Guest arrival" subtitle="Checked in vs pending" icon="how_to_reg">
                <Donut value={checkInRate} label="Checked in" tone="emerald" />
                <div className="mt-5">
                  <DetailRow label="Checked in" value={fmtNum(kpi.checkedInGuests)} strong="text-emerald-700 dark:text-emerald-300" />
                  <DetailRow label="Pending" value={fmtNum(pending)} />
                  <DetailRow label="VIP guests" value={fmtNum(vipStats?.totalVIP)} strong="text-amber-700 dark:text-amber-300" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card
                title="Guest registrations"
                subtitle="New registrations per month"
                icon="person_add"
                className="lg:col-span-2"
                action={<Delta value={guestRegistration?.yoyChange} />}
              >
                {guestRegistration?.data?.length ? (
                  <BarChart data={guestRegistration.data} tone="indigo" height={240} unit="registrations" />
                ) : (
                  <EmptyState icon="person_add" message="No registration data yet." />
                )}
              </Card>

              <Card title="Room occupancy" subtitle="Overall utilization" icon="meeting_room">
                <Donut value={roomOccupancy?.overallOccupancy || 0} label="Occupied" tone="blue" />
                <div className="mt-5">
                  <DetailRow label="Total rooms" value={fmtNum(roomOccupancy?.totalRooms)} />
                  <DetailRow label="Occupied" value={fmtNum(roomOccupancy?.occupiedRooms)} />
                  <DetailRow label="Available" value={fmtNum(roomOccupancy?.availableRooms)} />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card title="Service requests" subtitle="Breakdown by category" icon="room_service">
                {serviceBreakdown?.byType?.length ? (
                  <div className="space-y-4">
                    {serviceBreakdown.byType.map((item) => (
                      <ProgressRow key={item.type} label={item.label} value={item.count} pct={item.pct} tone="blue" />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="room_service" message="No service requests." />
                )}
              </Card>

              <Card title="VIP analytics" subtitle="High-value guest tracking" icon="star">
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-500/10">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300">VIP guests</p>
                    <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-amber-900 dark:text-amber-200">{fmtNum(vipStats?.totalVIP)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Checked in</p>
                    <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-emerald-900 dark:text-emerald-200">{fmtNum(vipStats?.checkedInVIP)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <ProgressRow label="VIP share of guests" value={vipStats?.totalVIP} pct={vipStats?.vipRate || 0} tone="amber" />
                  <ProgressRow label="VIP check-in rate" value={vipStats?.checkedInVIP} pct={vipStats?.vipCheckInRate || 0} tone="emerald" />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ═════════ GUESTS ═════════ */}
        {activeTab === "guests" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "group", label: "Total guests", value: fmtNum(kpi.totalGuests), tone: "blue" },
                { icon: "how_to_reg", label: "Checked in", value: fmtNum(kpi.checkedInGuests), sub: `${checkInRate}% rate`, tone: "emerald" },
                { icon: "star", label: "VIP guests", value: fmtNum(vipStats?.totalVIP), sub: `${vipStats?.vipRate || 0}% of total`, tone: "amber" },
                { icon: "verified", label: "VIP check-in", value: `${vipStats?.vipCheckInRate || 0}%`, tone: "violet" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card title="Monthly check-in trend" subtitle="Arrivals over time" icon="trending_up" action={<Delta value={monthlyCheckIn?.yoyChange} />}>
                {monthlyCheckIn?.data?.length ? (
                  <LineChart data={monthlyCheckIn.data} height={240} unit="check-ins" />
                ) : (
                  <EmptyState icon="trending_up" message="No check-in history." />
                )}
              </Card>
              <Card title="Monthly registrations" subtitle="New guests registered per month" icon="person_add" action={<Delta value={guestRegistration?.yoyChange} />}>
                {guestRegistration?.data?.length ? (
                  <BarChart data={guestRegistration.data} tone="indigo" height={240} unit="registrations" />
                ) : (
                  <EmptyState icon="person_add" message="No registration history." />
                )}
              </Card>
            </div>

            <Card title="Check-in summary" subtitle="Overall guest arrival status" icon="how_to_reg">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
                <Donut value={checkInRate} label="Checked in" tone="emerald" />
                <div className="space-y-5 md:col-span-2">
                  <ProgressRow label="Checked in" value={kpi.checkedInGuests} pct={checkInRate} tone="emerald" />
                  <ProgressRow label="Not yet arrived" value={pending} pct={Math.max(0, 100 - checkInRate)} tone="slate" />
                  <ProgressRow label="VIP checked in" value={vipStats?.checkedInVIP} pct={vipStats?.vipCheckInRate || 0} tone="amber" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ═════════ SERVICES ═════════ */}
        {activeTab === "services" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "receipt_long", label: "Total requests", value: fmtNum(serviceBreakdown?.totalRequests), tone: "blue" },
                { icon: "pending_actions", label: "Open / in progress", value: fmtNum(kpi.openServices), tone: "amber" },
                { icon: "check_circle", label: "Completed", value: fmtNum(kpi.completedServices), tone: "emerald" },
                { icon: "percent", label: "Resolution rate", value: `${kpi.serviceResolutionRate ?? 0}%`, tone: "violet" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Card title="By request type" subtitle="Volume per service category" icon="category">
                {serviceBreakdown?.byType?.length ? (
                  <div className="space-y-4">
                    {serviceBreakdown.byType.map((item) => (
                      <ProgressRow key={item.type} label={item.label} value={item.count} pct={item.pct} tone="blue" />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="category" message="No service data." />
                )}
              </Card>

              <Card title="By status" subtitle="Current request pipeline" icon="pip">
                {serviceBreakdown?.byStatus?.length ? (
                  <div className="space-y-4">
                    {serviceBreakdown.byStatus.map((item) => {
                      const tone = { open: "amber", in_progress: "blue", completed: "emerald", cancelled: "slate" }[item.status] || "slate";
                      return (
                        <ProgressRow key={item.status} label={item.status.replace(/_/g, " ")} value={item.count} pct={item.pct} tone={tone} />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState icon="pip" message="No status data." />
                )}
              </Card>

              <Card title="By urgency" subtitle="Priority distribution" icon="priority_high">
                {serviceBreakdown?.byUrgency?.length ? (
                  <div className="space-y-4">
                    {serviceBreakdown.byUrgency.map((item) => {
                      const tone = { emergency: "red", high: "orange", medium: "amber", low: "emerald" }[item.urgency] || "slate";
                      return <ProgressRow key={item.urgency} label={item.urgency} value={item.count} pct={item.pct} tone={tone} />;
                    })}
                  </div>
                ) : (
                  <EmptyState icon="priority_high" message="No urgency data." />
                )}
              </Card>

              <Card title="Activity log (30 days)" subtitle="Daily operational events" icon="timeline">
                {activityStats?.dailyTrend?.length ? (
                  <BarChart data={activityStats.dailyTrend} height={220} unit="events" />
                ) : (
                  <EmptyState icon="timeline" message="No activity logs." />
                )}
              </Card>
            </div>
          </div>
        )}

        {/* ═════════ OPERATIONS ═════════ */}
        {activeTab === "operations" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "meeting_room", label: "Total rooms", value: fmtNum(roomOccupancy?.totalRooms), sub: `${roomOccupancy?.overallOccupancy || 0}% occupied`, tone: "violet" },
                { icon: "local_shipping", label: "Transports", value: fmtNum(transportStats?.totalTransports), sub: `${transportStats?.completionRate || 0}% complete`, tone: "blue" },
                { icon: "badge", label: "Total staff", value: fmtNum(teamStats?.total), sub: `${teamStats?.activeRate || 0}% active`, tone: "emerald" },
                { icon: "history", label: "Activity logs", value: fmtNum(activityStats?.total), tone: "amber" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Card title="Transport status" subtitle="Fleet breakdown" icon="local_shipping">
                {transportStats?.byStatus?.length ? (
                  <div className="space-y-4">
                    {transportStats.byStatus.map((item) => {
                      const tone = { scheduled: "blue", in_transit: "amber", arrived: "emerald", cancelled: "slate" }[item.status] || "slate";
                      return (
                        <ProgressRow key={item.status} label={item.status.replace(/_/g, " ")} value={item.count} pct={item.pct} tone={tone} />
                      );
                    })}
                    <div className="border-t border-slate-100 pt-2 dark:border-slate-800">
                      <DetailRow label="Scheduled today" value={fmtNum(transportStats.todayCount)} strong="text-blue-700 dark:text-blue-300" />
                    </div>
                  </div>
                ) : (
                  <EmptyState icon="local_shipping" message="No transport data." />
                )}
              </Card>

              <Card title="Team roles" subtitle="Top role distribution" icon="groups">
                {teamStats?.byRole?.length ? (
                  <div className="space-y-4">
                    {teamStats.byRole.map((item) => (
                      <ProgressRow key={item.role} label={item.role} value={item.count} pct={item.pct} tone="violet" />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="groups" message="No team data." />
                )}
              </Card>

              <Card title="Activity by type" subtitle="Log category breakdown" icon="timeline">
                {activityStats?.byType?.length ? (
                  <div className="space-y-4">
                    {activityStats.byType.map((item) => (
                      <ProgressRow
                        key={item.type}
                        label={item.type.replace(/-/g, " ")}
                        value={item.count}
                        pct={Math.round((item.count / (activityStats.total || 1)) * 100)}
                        tone="blue"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon="timeline" message="No activity data." />
                )}
              </Card>
            </div>

            <Card title="Room type distribution" subtitle="Inventory by category" icon="meeting_room">
              {roomOccupancy?.byType?.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {roomOccupancy.byType.map((item) => (
                    <div key={item.type} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                      <p className="text-2xl font-extrabold tabular-nums text-slate-950 dark:text-slate-50">{fmtNum(item.count)}</p>
                      <p className="mt-1 text-xs font-bold capitalize text-slate-700 dark:text-slate-300">{item.type}</p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.pct}% of rooms</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon="meeting_room" message="No room data." />
              )}
            </Card>
          </div>
        )}

        {/* ═════════ EVENTS ═════════ */}
        {activeTab === "events" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "calendar_today", label: "Total events", value: fmtNum(kpi.totalEvents), tone: "blue" },
                { icon: "event_available", label: "Active now", value: fmtNum(kpi.activeEvents), tone: "emerald" },
                { icon: "upcoming", label: "Upcoming", value: fmtNum(kpi.upcomingEvents), tone: "indigo" },
                { icon: "event_busy", label: "Completed", value: fmtNum(kpi.completedEvents), tone: "slate" },
              ]}
            />

            <section className={`overflow-hidden ${CARD}`}>
              <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Event performance</h3>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Sorted by most recent start date</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">search</span>
                    <input
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      placeholder="Search events…"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20 sm:w-48"
                    />
                  </div>
                  <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                    {[
                      ["all", "All"],
                      ["in_progress", "Live"],
                      ["upcoming", "Upcoming"],
                      ["completed", "Completed"],
                    ].map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => setEventFilter(k)}
                        className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${
                          eventFilter === k
                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {visibleEvents.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[880px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                        {[
                          ["Event", ""],
                          ["Venue", ""],
                          ["Dates", ""],
                          ["Status", ""],
                          ["Guests", "text-right"],
                          ["Check-in", ""],
                          ["Services", "text-right"],
                          ["Transport", "text-right"],
                          ["", "text-right"],
                        ].map(([h, a], i) => (
                          <th key={i} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${a}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                      {visibleEvents.map((ev) => (
                        <tr key={ev._id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="px-5 py-3.5">
                            <div className="max-w-[220px] truncate font-bold text-slate-900 dark:text-slate-100">{ev.name}</div>
                            {ev.isPrivate && (
                              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[13px]">lock</span>
                                Private
                              </div>
                            )}
                          </td>
                          <td className="max-w-[180px] truncate px-5 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">{ev.venue || "—"}</td>
                          <td className="whitespace-nowrap px-5 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                            {fmtDate(ev.startDate)}
                            {ev.endDate && ` – ${fmtDate(ev.endDate)}`}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={ev.status} />
                          </td>
                          <td className="px-5 py-3.5 text-right font-extrabold tabular-nums text-slate-900 dark:text-slate-100">{fmtNum(ev.guests)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(ev.checkInRate || 0, 100)}%` }} />
                              </div>
                              <span className="w-10 text-xs font-extrabold tabular-nums text-emerald-700 dark:text-emerald-300">{ev.checkInRate}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">{fmtNum(ev.services)}</td>
                          <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">{fmtNum(ev.transports)}</td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              to={`/events/${ev._id}/overview`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-white hover:text-slate-950 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            >
                              Manage
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon="calendar_today"
                  message={
                    topEvents?.length
                      ? "No events match your search or filter."
                      : "No events found. Create your first event to see analytics."
                  }
                />
              )}

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:px-6">
                <span>
                  Showing {visibleEvents.length} of {topEvents?.length || 0} events
                </span>
                <Link to="/events" className="font-bold text-blue-700 hover:underline dark:text-blue-300">
                  View all events →
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        Data generated at {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "—"}
      </p>
    </PageShell>
  );
}