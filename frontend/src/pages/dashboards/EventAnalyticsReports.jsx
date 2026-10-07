import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
const fmtCompact = (n) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
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
// "2026-10-03" → "Oct 3"; anything else is shown as-is
const shortLabel = (v) => {
  const s = String(v ?? "");
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return new Date(`${s.slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return s;
};
const niceScale = (v) => {
  if (v <= 4) return { step: 1, max: 4 };
  const raw = v / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  const m = [1, 2, 3, 4, 5, 6, 8, 10].find((x) => x >= n);
  return { step: m * p, max: m * p * 4 };
};

// ─── Shared styles (same system as the rest of the app) ───────────────────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";
const BTN_PRIMARY =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
const BTN_SECONDARY =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

const ACCENT = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  purple: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const ACCENT_TEXT = {
  blue: "text-blue-700 dark:text-blue-300",
  green: "text-emerald-700 dark:text-emerald-300",
  amber: "text-amber-700 dark:text-amber-300",
  red: "text-red-700 dark:text-red-300",
  purple: "text-violet-700 dark:text-violet-300",
  indigo: "text-indigo-700 dark:text-indigo-300",
  rose: "text-rose-700 dark:text-rose-300",
  teal: "text-teal-700 dark:text-teal-300",
  slate: "text-slate-600 dark:text-slate-300",
};

const BAR = {
  blue: "bg-blue-600 dark:bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
  orange: "bg-orange-500",
  purple: "bg-violet-500",
  indigo: "bg-indigo-500",
  rose: "bg-rose-500",
  slate: "bg-slate-300 dark:bg-slate-600",
};

const STROKE = {
  blue: "stroke-blue-600 dark:stroke-blue-400",
  green: "stroke-emerald-500",
  amber: "stroke-amber-500",
  red: "stroke-red-500",
  purple: "stroke-violet-500",
};

const CHART_TONE = {
  blue: {
    line: "stroke-blue-600 dark:stroke-blue-400",
    area: "fill-blue-600/10 dark:fill-blue-400/10",
    dot: "fill-white stroke-blue-600 dark:fill-slate-900 dark:stroke-blue-400",
    bar: "fill-blue-600 dark:fill-blue-500",
  },
  purple: {
    line: "stroke-violet-500 dark:stroke-violet-400",
    area: "fill-violet-500/10 dark:fill-violet-400/10",
    dot: "fill-white stroke-violet-500 dark:fill-slate-900 dark:stroke-violet-400",
    bar: "fill-violet-500 dark:fill-violet-400",
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
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
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className={`h-72 p-6 ${CARD}`}>
            <Skeleton className="mb-5 h-5 w-44" />
            <Skeleton className="h-44 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
export function KPICard({ icon, label, value, sub, accent = "blue", pulse = false, trend }) {
  return (
    <div className={`p-5 ${CARD}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${ACCENT[accent] || ACCENT.blue}`}>
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <p className="text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">{value}</p>
        {pulse && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        )}
        {trend != null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{trend >= 0 ? "trending_up" : "trending_down"}</span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <p className="mt-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

function StatStrip({ items, cols = 4 }) {
  const colCls = cols === 3 ? "lg:grid-cols-3" : cols === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <div
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none ${colCls}`}
    >
      {items.map((it) => (
        <div key={it.label} className="bg-white p-4 dark:bg-slate-900 sm:p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            <span className={`material-symbols-outlined text-[16px] ${ACCENT_TEXT[it.accent] || ""}`}>{it.icon}</span>
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

// ─── Section wrapper ──────────────────────────────────────────────────────────
export function Section({ title, subtitle, icon, children, action, noPad = false, className = "" }) {
  return (
    <section className={`flex min-w-0 flex-col overflow-hidden ${CARD} ${className}`}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
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
      <div className={`flex-1 ${noPad ? "" : "p-5 sm:p-6"}`}>{children}</div>
    </section>
  );
}

// ─── Progress bar row ─────────────────────────────────────────────────────────
export function ProgressRow({ label, value, pct, max, colorClass = BAR.blue, badge }) {
  const width = max ? Math.round((value / max) * 100) : pct;
  const shownPct = pct ?? Math.round((value / (max || 1)) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-semibold capitalize text-slate-700 dark:text-slate-300">{label}</span>
          {badge && (
            <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {badge}
            </span>
          )}
        </div>
        <span className="shrink-0 font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
          {fmtNum(value)}
          <span className="ml-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{shownPct}%</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${Math.min(Math.max(width || 0, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Charts (responsive SVG with hover tooltips) ──────────────────────────────
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

function ChartTooltip({ x, y, width, title, value }) {
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

function ChartAxis({ ticks, m, innerW, y }) {
  return ticks.map((t) => (
    <g key={t}>
      <line x1={m.l} x2={m.l + innerW} y1={y(t)} y2={y(t)} className="stroke-slate-100 dark:stroke-slate-800" />
      <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" className="fill-slate-500 dark:fill-slate-400">
        {fmtCompact(t)}
      </text>
    </g>
  ));
}

function ChartXLabels({ labels, xAt, innerW, y }) {
  const n = labels.length;
  const k = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(innerW / 64))));
  return labels.map((l, i) =>
    i % k !== 0 ? null : (
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
    )
  );
}

export function BarChart({ data = [], height = 160, tone = "blue", labelKey = "label", valueKey = "count", unit = "" }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  if (!data.length) return <EmptyChart />;

  const points = data.map((d, i) => ({ label: shortLabel(d[labelKey] ?? i), count: d[valueKey] ?? 0 }));
  const t = CHART_TONE[tone] || CHART_TONE.blue;
  const H = height + 40;
  const m = { t: 12, r: 8, b: 28, l: 38 };
  const n = points.length;
  const innerW = Math.max(width - m.l - m.r, 10);
  const innerH = H - m.t - m.b;
  const { step, max } = niceScale(Math.max(...points.map((p) => p.count), 1));
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const y = (v) => m.t + innerH - (v / max) * innerH;
  const band = innerW / n;
  const barW = Math.max(3, Math.min(band * 0.62, 40));
  const xAt = (i) => m.l + band * i + band / 2;

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={H} className="block" role="img">
          <ChartAxis ticks={ticks} m={m} innerW={innerW} y={y} />
          {points.map((p, i) => {
            const h = Math.max(p.count > 0 ? 3 : 0, y(0) - y(p.count));
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
          <ChartXLabels labels={points.map((p) => p.label)} xAt={xAt} innerW={innerW} y={H - 8} />
          {points.map((p, i) => (
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
        <ChartTooltip x={xAt(hover)} y={y(points[hover].count)} width={width} title={points[hover].label} value={`${fmtNum(points[hover].count)} ${unit}`.trim()} />
      )}
    </div>
  );
}

export function LineChart({ data = [], height = 160, tone = "blue", labelKey = "label", valueKey = "count", unit = "" }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  if (!data.length) return <EmptyChart />;

  const points = data.map((d, i) => ({ label: shortLabel(d[labelKey] ?? i), count: d[valueKey] ?? 0 }));
  const t = CHART_TONE[tone] || CHART_TONE.blue;
  const H = height + 40;
  const m = { t: 12, r: 16, b: 28, l: 38 };
  const n = points.length;
  const innerW = Math.max(width - m.l - m.r, 10);
  const innerH = H - m.t - m.b;
  const { step, max } = niceScale(Math.max(...points.map((p) => p.count), 1));
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const y = (v) => m.t + innerH - (v / max) * innerH;
  const xAt = (i) => m.l + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const pts = points.map((p, i) => ({ x: xAt(i), y: y(p.count) }));
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
        <svg width={width} height={H} className="block" role="img">
          <ChartAxis ticks={ticks} m={m} innerW={innerW} y={y} />
          <path d={area} className={t.area} />
          <path d={line} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={t.line} />
          {hover != null && <line x1={pts[hover].x} x2={pts[hover].x} y1={m.t} y2={y(0)} className="stroke-slate-300 dark:stroke-slate-600" strokeDasharray="4 4" />}
          {pts.map((p, i) => (n <= 16 || i === hover ? <circle key={i} cx={p.x} cy={p.y} r={i === hover ? 5 : 3.5} strokeWidth="2" className={t.dot} /> : null))}
          <ChartXLabels labels={points.map((p) => p.label)} xAt={xAt} innerW={innerW} y={H - 8} />
          <rect x={m.l} y={m.t} width={innerW} height={innerH} fill="transparent" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)} />
        </svg>
      )}
      {hover != null && width > 0 && (
        <ChartTooltip x={pts[hover].x} y={pts[hover].y} width={width} title={points[hover].label} value={`${fmtNum(points[hover].count)} ${unit}`.trim()} />
      )}
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
export function DonutChart({ value, max, size = 128, colorClass = STROKE.blue, label, subLabel }) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = 42;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-800" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${pct * circ} ${circ}`}
            className={`${colorClass} transition-all duration-700`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-extrabold tracking-tight tabular-nums text-slate-950 dark:text-slate-50">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      {label && <p className="text-center text-xs font-bold text-slate-700 dark:text-slate-300">{label}</p>}
      {subLabel && <p className="-mt-1.5 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">{subLabel}</p>}
    </div>
  );
}

// ─── Hour bars ────────────────────────────────────────────────────────────────
export function HourBars({ data = [], colorClass = BAR.blue }) {
  if (!data.length) return <EmptyChart />;
  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const peak = data.reduce((a, b) => (a.count > b.count ? a : b), data[0]);
  return (
    <div className="space-y-2.5">
      <div className="flex h-28 items-end gap-[3px] border-b border-slate-200 dark:border-slate-800">
        {data.map((d, i) => {
          const pct = Math.max((d.count / maxVal) * 100, d.count > 0 ? 4 : 0);
          return (
            <div key={i} className="group flex h-full flex-1 items-end" title={`${fmtHour(d.hour)}: ${d.count}`}>
              <div
                className={`w-full rounded-t-[3px] opacity-80 transition-all group-hover:opacity-100 ${colorClass}`}
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
        <span>12AM</span>
        <span>6AM</span>
        <span>12PM</span>
        <span>6PM</span>
        <span>11PM</span>
      </div>
      {peak.count > 0 && (
        <p className="pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Peak: <span className="font-extrabold text-slate-800 dark:text-slate-200">{fmtHour(peak.hour)}</span> ({fmtNum(peak.count)} activities)
        </p>
      )}
    </div>
  );
}

// ─── Small pieces ─────────────────────────────────────────────────────────────
function EmptyChart({ message = "No data available" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <span className="material-symbols-outlined text-[22px]">bar_chart</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  );
}

function ExportBtn({ onClick, label, loading }) {
  return (
    <button onClick={onClick} disabled={loading} className={BTN_SECONDARY}>
      <span className={`material-symbols-outlined text-[17px] ${loading ? "animate-spin" : ""}`}>{loading ? "progress_activity" : "download"}</span>
      {label}
    </button>
  );
}

function Badge({ label, variant = "default" }) {
  const variants = {
    default: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
  };
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${variants[variant]}`}>
      {label}
    </span>
  );
}

function StatRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 text-sm last:border-0 dark:border-slate-800">
      <span className="font-medium text-slate-600 dark:text-slate-400">{label}</span>
      <span className={`font-extrabold tabular-nums text-slate-900 dark:text-slate-100 ${valueClass}`}>{value}</span>
    </div>
  );
}

function RankRow({ rank, title, right, round = false }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-800">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-7 shrink-0 items-center justify-center bg-slate-100 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${
            round ? "rounded-full" : "rounded-lg"
          }`}
        >
          {rank}
        </span>
        <span className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
      </div>
      <span className="shrink-0 text-sm font-extrabold tabular-nums text-slate-900 dark:text-slate-100">{right}</span>
    </div>
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
    </div>
  );
}

function BackLink({ to, label = "Back to event summary" }) {
  return (
    <Link
      to={to}
      className="group mb-5 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white pl-2.5 pr-3.5 text-xs font-bold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:shadow-none dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
      {label}
    </Link>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function EventAnalyticsReports() {
  const { eventId: paramId } = useParams();
  const { event: ctxEvent } = useContext(EventContext) || {};
  const eventId = paramId || ctxEvent?._id;
  const backTo = eventId ? `/events/${eventId}/reports` : "/events";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [exporting, setExporting] = useState({ guests: false, services: false, transport: false });
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

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
    [eventId]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── CSV exports ───────────────────────────────────────────────────────────
  const handleExport = async (type) => {
    const name = data?.event?.name || "event";
    setExporting((p) => ({ ...p, [type]: true }));
    try {
      let res;
      if (type === "guests") res = await exportGuestsCsv(eventId, name);
      else if (type === "services") res = await exportServicesCsv(eventId, name);
      else if (type === "transport") res = await exportTransportCsv(eventId, name);
      if (res?.success) showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} CSV downloaded`);
      else showToast(res?.message || "Export failed", "error");
    } catch {
      showToast("Export failed", "error");
    } finally {
      setExporting((p) => ({ ...p, [type]: false }));
    }
  };

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
      <PageShell>
        <BackLink to={backTo} />
        <div className="mb-8 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-80 max-w-full" />
          <Skeleton className="h-4 w-64" />
        </div>
        <PageSkeleton />
      </PageShell>
    );
  }

  // ── ERROR (nothing loaded) ────────────────────────────────────────────────
  if (error && !data) {
    return (
      <PageShell>
        <BackLink to={backTo} />
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="material-symbols-outlined text-[25px]">error</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Failed to load report</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
          <button onClick={() => fetchData()} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  if (!data) return null;

  const { event, guests: G, rooms: R, services: S, transport: T, team: TM, schedule: SC, activity: A } = data;

  const transportRows = [
    { label: "Scheduled", val: T?.summary?.scheduled, color: BAR.blue },
    { label: "In Transit", val: T?.summary?.inTransit, color: BAR.amber },
    { label: "Arrived", val: T?.summary?.arrived, color: BAR.green },
    { label: "Cancelled", val: T?.summary?.cancelled, color: BAR.slate },
  ];
  const transportPct = (v) => (T?.summary?.total > 0 ? Math.round(((v || 0) / T.summary.total) * 100) : 0);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{toast.type === "error" ? "error" : "check_circle"}</span>
          <span className="min-w-0">{toast.msg}</span>
        </div>
      )}

      {/* Back + breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <BackLink to={backTo} />
        <nav className="mb-5 hidden items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:flex" aria-label="Breadcrumb">
          <Link to="/events" className="hover:text-slate-900 dark:hover:text-slate-100">Events</Link>
          <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-slate-600">chevron_right</span>
          <Link to={backTo} className="max-w-[200px] truncate hover:text-slate-900 dark:hover:text-slate-100">{event?.name || "Event"}</Link>
          <span className="material-symbols-outlined text-[14px] text-slate-300 dark:text-slate-600">chevron_right</span>
          <span className="text-slate-800 dark:text-slate-200">Full report</span>
        </nav>
      </div>

      {/* Header */}
      <header className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Analytics &amp; reports</p>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
            {event?.name}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">calendar_today</span>
              {fmtDate(event?.startDate)} → {fmtDate(event?.endDate)}
            </span>
            {event?.venue && (
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">location_on</span>
                {event.venue}
              </span>
            )}
            {lastUpdated && (
              <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-500">
                <span className="material-symbols-outlined text-[18px]">update</span>
                Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExportBtn onClick={() => handleExport("guests")} label="Guests CSV" loading={exporting.guests} />
          <ExportBtn onClick={() => handleExport("services")} label="Services CSV" loading={exporting.services} />
          <ExportBtn onClick={() => handleExport("transport")} label="Transport CSV" loading={exporting.transport} />
          <button onClick={() => fetchData(true)} disabled={refreshing} className={BTN_PRIMARY}>
            <span className={`material-symbols-outlined text-[17px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

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

      {/* Tabs */}
      <nav
        className="sticky top-0 z-30 -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 bg-[#f7f8fa]/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        aria-label="Report sections"
      >
        {tabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              aria-current={active ? "page" : undefined}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3 text-sm font-bold transition ${
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
              <KPICard icon="group" label="Total guests" value={fmtNum(G?.summary?.total)} sub={`${fmtPct(G?.summary?.checkInRate)} checked in`} accent="blue" />
              <KPICard icon="how_to_reg" label="Checked in" value={fmtNum(G?.summary?.checkedIn)} sub={`${fmtNum(G?.summary?.notCheckedIn)} remaining`} accent="green" />
              <KPICard
                icon="pending_actions"
                label="Open services"
                value={fmtNum((S?.summary?.open || 0) + (S?.summary?.inProgress || 0))}
                sub={`${fmtPct(S?.summary?.resolutionRate)} resolved`}
                accent={S?.summary?.open > 0 ? "rose" : "green"}
              />
              <KPICard icon="local_shipping" label="Total transports" value={fmtNum(T?.summary?.total)} sub={`${fmtPct(T?.summary?.completionRate)} complete`} accent="indigo" />
            </div>

            <StatStrip
              items={[
                { icon: "star", label: "VIP guests", value: fmtNum(G?.summary?.vip), sub: `${fmtPct(G?.summary?.vipRate)} of attendees`, accent: "amber" },
                { icon: "meeting_room", label: "Rooms assigned", value: fmtNum(G?.summary?.withRoom), sub: `${fmtPct(G?.summary?.roomAssignmentRate)} assigned`, accent: "purple" },
                { icon: "badge", label: "Active staff", value: fmtNum(TM?.summary?.active), sub: `${fmtPct(TM?.summary?.activeRate)} on duty`, accent: "teal" },
                { icon: "schedule", label: "Schedule items", value: fmtNum(SC?.summary?.total), sub: `${fmtNum(SC?.summary?.confirmed)} confirmed`, accent: "blue" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Check-in activity by hour" subtitle="When guests arrive throughout the day" icon="access_time">
                <HourBars data={G?.checkInByHour || []} />
              </Section>
              <Section title="Service request types" subtitle="Volume by category" icon="room_service">
                {S?.byType?.length ? (
                  <div className="space-y-4">
                    {S.byType.map((item) => (
                      <ProgressRow key={item.type} label={item.label} value={item.count} pct={item.percentage} />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No service requests yet" />
                )}
              </Section>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <Section title="Room occupancy" subtitle="Overall utilization rate" icon="meeting_room">
                <div className="flex flex-col items-center gap-5">
                  <DonutChart
                    value={R?.summary?.occupiedRooms || 0}
                    max={R?.summary?.totalRooms || 1}
                    label="Rooms occupied"
                    subLabel={`${fmtNum(R?.summary?.occupiedRooms)} of ${fmtNum(R?.summary?.totalRooms)}`}
                  />
                  <div className="w-full">
                    <StatRow label="Total rooms" value={fmtNum(R?.summary?.totalRooms)} />
                    <StatRow label="Total capacity" value={fmtNum(R?.summary?.totalCapacity)} />
                    <StatRow label="Capacity used" value={fmtPct(R?.summary?.capacityUtilization)} />
                  </div>
                </div>
              </Section>

              <Section title="Transport status" subtitle="Fleet coordination" icon="local_shipping">
                <div className="space-y-4">
                  {transportRows.map((item) => (
                    <ProgressRow key={item.label} label={item.label} value={item.val || 0} pct={transportPct(item.val)} colorClass={item.color} />
                  ))}
                </div>
              </Section>

              <Section title="Team & activity" subtitle="Staff and operational logs" icon="groups">
                <StatRow label="Total staff" value={fmtNum(TM?.summary?.total)} />
                <StatRow label="Active" value={fmtNum(TM?.summary?.active)} valueClass="!text-emerald-700 dark:!text-emerald-300" />
                <StatRow label="Inactive" value={fmtNum(TM?.summary?.inactive)} valueClass="!text-slate-500 dark:!text-slate-400" />
                <StatRow label="Total activity logs" value={fmtNum(A?.summary?.total)} />
                <StatRow
                  label="Critical today"
                  value={fmtNum(A?.summary?.criticalToday)}
                  valueClass={A?.summary?.criticalToday > 0 ? "!text-red-600 dark:!text-red-400" : ""}
                />
              </Section>
            </div>
          </div>
        )}

        {/* ═════════ GUESTS ═════════ */}
        {activeTab === "guests" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "group", label: "Total guests", value: fmtNum(G?.summary?.total), accent: "blue" },
                { icon: "how_to_reg", label: "Checked in", value: fmtNum(G?.summary?.checkedIn), sub: fmtPct(G?.summary?.checkInRate), accent: "green" },
                { icon: "logout", label: "Checked out", value: fmtNum(G?.summary?.checkedOut), accent: "slate" },
                { icon: "star", label: "VIP guests", value: fmtNum(G?.summary?.vip), sub: fmtPct(G?.summary?.vipRate), accent: "amber" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section
                title="Guest status breakdown"
                subtitle="Arrival and check-in funnel"
                icon="how_to_reg"
                action={<ExportBtn onClick={() => handleExport("guests")} label="Export" loading={exporting.guests} />}
              >
                <div className="space-y-4">
                  <ProgressRow label="Checked in" value={G?.summary?.checkedIn || 0} pct={G?.summary?.checkInRate || 0} colorClass={BAR.green} />
                  <ProgressRow label="Not checked in" value={G?.summary?.notCheckedIn || 0} pct={100 - (G?.summary?.checkInRate || 0)} colorClass={BAR.slate} />
                  <ProgressRow label="VIP" value={G?.summary?.vip || 0} pct={G?.summary?.vipRate || 0} colorClass={BAR.yellow} />
                  <ProgressRow label="Room assigned" value={G?.summary?.withRoom || 0} pct={G?.summary?.roomAssignmentRate || 0} colorClass={BAR.purple} />
                  <ProgressRow
                    label="Special requests"
                    value={G?.summary?.withSpecialRequests || 0}
                    pct={G?.summary?.total > 0 ? Math.round((G.summary.withSpecialRequests / G.summary.total) * 100) : 0}
                    colorClass={BAR.rose}
                  />
                </div>
              </Section>

              <Section title="Check-in by hour" subtitle="Peak arrival times" icon="access_time">
                <HourBars data={G?.checkInByHour || []} />
              </Section>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Scheduled arrivals by hour" subtitle="Expected arrival distribution" icon="flight_land">
                <HourBars data={G?.arrivalByHour || []} colorClass={BAR.indigo} />
              </Section>

              <Section title="Transport mode breakdown" subtitle="How guests are travelling" icon="directions_car">
                {G?.transportModeBreakdown?.length ? (
                  <div className="space-y-4">
                    {G.transportModeBreakdown.map((item) => (
                      <ProgressRow
                        key={item.mode}
                        label={item.mode}
                        value={item.count}
                        pct={G?.summary?.total > 0 ? Math.round((item.count / G.summary.total) * 100) : 0}
                        colorClass={BAR.indigo}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No transport mode data" />
                )}
              </Section>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Age distribution" subtitle="Guest age group breakdown" icon="person">
                {G?.ageDistribution?.length ? (
                  <BarChart data={G.ageDistribution} labelKey="range" valueKey="count" tone="purple" height={170} unit="guests" />
                ) : (
                  <EmptyChart message="No age data collected" />
                )}
              </Section>

              <Section title="Top guest groups" subtitle="Largest delegations" icon="groups">
                {G?.topGroups?.length ? (
                  <div>
                    {G.topGroups.map((g, i) => (
                      <RankRow key={i} rank={i + 1} title={g.group} right={fmtNum(g.count)} />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No group data" />
                )}
              </Section>
            </div>
          </div>
        )}

        {/* ═════════ ROOMS ═════════ */}
        {activeTab === "rooms" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "meeting_room", label: "Total rooms", value: fmtNum(R?.summary?.totalRooms), accent: "blue" },
                { icon: "hotel", label: "Occupied", value: fmtNum(R?.summary?.occupiedRooms), sub: fmtPct(R?.summary?.occupancyRate), accent: "green" },
                { icon: "door_open", label: "Available", value: fmtNum(R?.summary?.availableRooms), accent: "amber" },
                { icon: "people", label: "Guests assigned", value: fmtNum(R?.summary?.totalGuestsAssigned), sub: `Cap: ${fmtNum(R?.summary?.totalCapacity)}`, accent: "purple" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Occupancy rate" subtitle="Current room utilization" icon="meeting_room">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  <DonutChart value={R?.summary?.occupiedRooms || 0} max={R?.summary?.totalRooms || 1} size={148} label="Rooms occupied" />
                  <div className="w-full flex-1">
                    <StatRow label="Occupancy rate" value={fmtPct(R?.summary?.occupancyRate)} valueClass="!text-blue-700 dark:!text-blue-300" />
                    <StatRow label="Capacity utilization" value={fmtPct(R?.summary?.capacityUtilization)} valueClass="!text-violet-700 dark:!text-violet-300" />
                    <StatRow label="Total capacity" value={fmtNum(R?.summary?.totalCapacity)} />
                    <StatRow label="Guests assigned" value={fmtNum(R?.summary?.totalGuestsAssigned)} />
                  </div>
                </div>
              </Section>

              <Section title="Room type breakdown" subtitle="Distribution by category" icon="category">
                {R?.typeBreakdown?.length ? (
                  <div className="space-y-4">
                    {R.typeBreakdown.map((item) => (
                      <ProgressRow
                        key={item.type}
                        label={item.type}
                        value={item.count}
                        pct={R?.summary?.totalRooms > 0 ? Math.round((item.count / R.summary.totalRooms) * 100) : 0}
                        badge={`Cap: ${item.totalCapacity}`}
                        colorClass={BAR.purple}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No room types" />
                )}
              </Section>
            </div>

            <Section title="Room utilization detail" subtitle="Per-room occupancy breakdown" icon="table_chart" noPad>
              {R?.roomDetails?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                        {[
                          ["Room", ""],
                          ["Type", ""],
                          ["Capacity", "text-right"],
                          ["Occupied", "text-right"],
                          ["Available", "text-right"],
                          ["Utilization", ""],
                        ].map(([h, a]) => (
                          <th key={h} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${a}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                      {R.roomDetails.map((room, i) => (
                        <tr key={i} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                          <td className="px-5 py-3 font-extrabold text-slate-900 dark:text-slate-100">{room.roomNumber}</td>
                          <td className="px-5 py-3 font-medium capitalize text-slate-600 dark:text-slate-400">{room.type}</td>
                          <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-700 dark:text-slate-300">{room.capacity}</td>
                          <td className="px-5 py-3 text-right font-extrabold tabular-nums text-emerald-700 dark:text-emerald-300">{room.occupied}</td>
                          <td className="px-5 py-3 text-right font-semibold tabular-nums text-slate-500 dark:text-slate-400">{room.available}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: `${Math.min(room.utilizationRate || 0, 100)}%` }} />
                              </div>
                              <span className="w-10 text-right text-xs font-extrabold tabular-nums text-slate-700 dark:text-slate-300">{room.utilizationRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyChart message="No rooms created yet" />
              )}
            </Section>
          </div>
        )}

        {/* ═════════ SERVICES ═════════ */}
        {activeTab === "services" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "receipt_long", label: "Total requests", value: fmtNum(S?.summary?.total), accent: "blue" },
                { icon: "pending_actions", label: "Open", value: fmtNum(S?.summary?.open), sub: "Awaiting action", accent: S?.summary?.open > 0 ? "rose" : "green" },
                { icon: "run_circle", label: "In progress", value: fmtNum(S?.summary?.inProgress), accent: "amber" },
                { icon: "check_circle", label: "Resolved", value: fmtNum(S?.summary?.completed), sub: fmtPct(S?.summary?.resolutionRate), accent: "green" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Section
                title="By service type"
                subtitle="Request volume per category"
                icon="category"
                action={<ExportBtn onClick={() => handleExport("services")} label="Export" loading={exporting.services} />}
              >
                {S?.byType?.length ? (
                  <div className="space-y-4">
                    {S.byType.map((item) => (
                      <ProgressRow key={item.type} label={item.label} value={item.count} pct={item.percentage} />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No service data" />
                )}
              </Section>

              <Section title="By urgency" subtitle="Priority distribution" icon="priority_high">
                {S?.byUrgency?.length ? (
                  <div className="space-y-4">
                    {S.byUrgency.map((item) => {
                      const colorMap = { emergency: BAR.red, high: BAR.orange, medium: BAR.amber, low: BAR.green };
                      return <ProgressRow key={item.urgency} label={item.urgency} value={item.count} pct={item.percentage} colorClass={colorMap[item.urgency] || BAR.slate} />;
                    })}
                  </div>
                ) : (
                  <EmptyChart message="No urgency data" />
                )}
              </Section>

              <Section title="Resolution metrics" subtitle="Service completion health" icon="check_circle">
                <div className="flex flex-col items-center gap-5">
                  <DonutChart value={S?.summary?.completed || 0} max={S?.summary?.total || 1} colorClass={STROKE.green} label="Resolution rate" />
                  <div className="w-full">
                    <StatRow label="Open" value={fmtNum(S?.summary?.open)} valueClass="!text-amber-700 dark:!text-amber-300" />
                    <StatRow label="In progress" value={fmtNum(S?.summary?.inProgress)} valueClass="!text-blue-700 dark:!text-blue-300" />
                    <StatRow label="Completed" value={fmtNum(S?.summary?.completed)} valueClass="!text-emerald-700 dark:!text-emerald-300" />
                    <StatRow label="Cancelled" value={fmtNum(S?.summary?.cancelled)} valueClass="!text-slate-500 dark:!text-slate-400" />
                    <StatRow label="Permission granted" value={fmtNum(S?.summary?.permissionGranted)} />
                  </div>
                </div>
              </Section>
            </div>

            {S?.recentResolved?.length > 0 && (
              <Section title="Recently resolved requests" subtitle="Last 5 completed service calls" icon="history" noPad>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {S.recentResolved.map((req) => (
                    <div key={req._id} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <span className="material-symbols-outlined text-[19px]">check_circle</span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold capitalize text-slate-900 dark:text-slate-100">{req.requestType}</p>
                          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                            {req.guest?.fullName || "General"} {req.room ? `· Room ${req.room.number}` : ""}
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

        {/* ═════════ TRANSPORT ═════════ */}
        {activeTab === "transport" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KPICard icon="local_shipping" label="Total trips" value={fmtNum(T?.summary?.total)} accent="blue" />
              <KPICard icon="schedule" label="Scheduled" value={fmtNum(T?.summary?.scheduled)} accent="indigo" />
              <KPICard icon="airport_shuttle" label="In transit" value={fmtNum(T?.summary?.inTransit)} accent="amber" pulse={T?.summary?.inTransit > 0} />
              <KPICard icon="check_circle" label="Completed" value={fmtNum(T?.summary?.arrived)} sub={fmtPct(T?.summary?.completionRate)} accent="green" />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section
                title="Scheduled trips by hour"
                subtitle="Fleet deployment throughout the day"
                icon="access_time"
                action={<ExportBtn onClick={() => handleExport("transport")} label="Export" loading={exporting.transport} />}
              >
                <HourBars data={T?.byHour || []} colorClass={BAR.indigo} />
              </Section>

              <Section title="Trip status breakdown" subtitle="Fleet coordination health" icon="local_shipping">
                <div className="space-y-4">
                  {transportRows.map((item) => (
                    <ProgressRow key={item.label} label={item.label} value={item.val || 0} pct={transportPct(item.val)} colorClass={item.color} />
                  ))}
                </div>
              </Section>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Top drivers by trips" subtitle="Most active drivers" icon="person_pin_circle">
                {T?.topDrivers?.length ? (
                  <div>
                    {T.topDrivers.map((d, i) => (
                      <RankRow key={i} rank={i + 1} round title={d.driver} right={<>{d.trips} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">trips</span></>} />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No driver data" />
                )}
              </Section>

              <Section title="Top routes" subtitle="Most frequent pickup → dropoff pairs" icon="route">
                {T?.topRoutes?.length ? (
                  <div>
                    {T.topRoutes.map((r, i) => (
                      <RankRow key={i} rank={i + 1} title={`${r.pickup || "—"} → ${r.dropoff || "—"}`} right={`${r.count}×`} />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No route data" />
                )}
              </Section>
            </div>
          </div>
        )}

        {/* ═════════ TEAM ═════════ */}
        {activeTab === "team" && (
          <div className="space-y-5">
            <StatStrip
              cols={3}
              items={[
                { icon: "badge", label: "Total staff", value: fmtNum(TM?.summary?.total), accent: "blue" },
                { icon: "check_circle", label: "Active", value: fmtNum(TM?.summary?.active), sub: fmtPct(TM?.summary?.activeRate), accent: "green" },
                { icon: "person_off", label: "Inactive", value: fmtNum(TM?.summary?.inactive), accent: "slate" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Staff active rate" subtitle="On-duty vs off-duty breakdown" icon="people">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  <DonutChart value={TM?.summary?.active || 0} max={TM?.summary?.total || 1} size={148} colorClass={STROKE.green} label="Active rate" />
                  <div className="w-full flex-1 space-y-4">
                    <ProgressRow label="Active" value={TM?.summary?.active || 0} pct={TM?.summary?.activeRate || 0} colorClass={BAR.green} />
                    <ProgressRow label="Inactive" value={TM?.summary?.inactive || 0} pct={100 - (TM?.summary?.activeRate || 0)} colorClass={BAR.slate} />
                  </div>
                </div>
              </Section>

              <Section title="Staff by role" subtitle="Role distribution across the team" icon="work">
                {TM?.byRole?.length ? (
                  <div className="space-y-4">
                    {TM.byRole.map((item) => (
                      <ProgressRow key={item.role} label={item.role} value={item.count} pct={item.percentage} colorClass={BAR.purple} />
                    ))}
                  </div>
                ) : (
                  <EmptyChart message="No role data" />
                )}
              </Section>
            </div>
          </div>
        )}

        {/* ═════════ SCHEDULE ═════════ */}
        {activeTab === "schedule" && (
          <div className="space-y-5">
            <StatStrip
              items={[
                { icon: "event_note", label: "Total activities", value: fmtNum(SC?.summary?.total), accent: "blue" },
                { icon: "check_circle", label: "Confirmed", value: fmtNum(SC?.summary?.confirmed), sub: fmtPct(SC?.summary?.completionRate), accent: "green" },
                { icon: "pending", label: "Pending", value: fmtNum(SC?.summary?.pending), accent: "amber" },
                { icon: "cancel", label: "Cancelled", value: fmtNum(SC?.summary?.cancelled), accent: "slate" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Activities by workstream" subtitle="Schedule distribution across tracks" icon="category">
                {SC?.byWorkstream?.length ? (
                  <div className="space-y-4">
                    {SC.byWorkstream.map((item) => {
                      const colorMap = { "Main Sessions": BAR.blue, Transport: BAR.amber, Catering: BAR.green, Staffing: BAR.purple, "Media/AV": BAR.rose };
                      return <ProgressRow key={item.workstream} label={item.workstream} value={item.count} pct={item.percentage} colorClass={colorMap[item.workstream] || BAR.slate} />;
                    })}
                  </div>
                ) : (
                  <EmptyChart message="No schedule data" />
                )}
              </Section>

              <Section title="Schedule status" subtitle="Activity completion pipeline" icon="schema">
                <div className="space-y-4">
                  {[
                    { label: "Confirmed", val: SC?.summary?.confirmed, color: BAR.green },
                    { label: "Active", val: SC?.summary?.active, color: BAR.blue },
                    { label: "Pending", val: SC?.summary?.pending, color: BAR.amber },
                    { label: "Cancelled", val: SC?.summary?.cancelled, color: BAR.slate },
                  ].map((item) => (
                    <ProgressRow
                      key={item.label}
                      label={item.label}
                      value={item.val || 0}
                      pct={SC?.summary?.total > 0 ? Math.round(((item.val || 0) / SC.summary.total) * 100) : 0}
                      colorClass={item.color}
                    />
                  ))}
                </div>
              </Section>
            </div>

            {SC?.upcomingActivities?.length > 0 && (
              <Section title="Upcoming activities" subtitle="Next 5 scheduled items" icon="upcoming" noPad>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SC.upcomingActivities.map((act) => {
                    const border = {
                      "Main Sessions": "border-l-blue-600 dark:border-l-blue-400",
                      Transport: "border-l-amber-500",
                      Catering: "border-l-emerald-500",
                      Staffing: "border-l-violet-500",
                      "Media/AV": "border-l-rose-500",
                    };
                    return (
                      <div key={act._id} className={`flex items-center gap-4 border-l-4 px-5 py-4 sm:px-6 ${border[act.workstream] || "border-l-slate-300 dark:border-l-slate-600"}`}>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{act.title}</p>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {act.workstream} · {act.location || "TBD"} ·{" "}
                            {new Date(act.startTime).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <Badge
                          label={act.status}
                          variant={act.status === "Confirmed" ? "success" : act.status === "Active" ? "info" : act.status === "Cancelled" ? "danger" : "warning"}
                        />
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* ═════════ ACTIVITY ═════════ */}
        {activeTab === "activity" && (
          <div className="space-y-5">
            <StatStrip
              cols={3}
              items={[
                { icon: "history", label: "Total logs", value: fmtNum(A?.summary?.total), accent: "blue" },
                { icon: "priority_high", label: "Critical today", value: fmtNum(A?.summary?.criticalToday), accent: A?.summary?.criticalToday > 0 ? "red" : "green" },
                { icon: "bar_chart", label: "Unique types", value: fmtNum(A?.byType?.length), accent: "purple" },
              ]}
            />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Section title="Activity (last 7 days)" subtitle="Daily operational event volume" icon="trending_up">
                {A?.dailyTrend?.length ? (
                  <BarChart data={A.dailyTrend} labelKey="date" valueKey="count" height={170} unit="events" />
                ) : (
                  <EmptyChart message="No recent activity" />
                )}
              </Section>

              <Section title="Activity by type" subtitle="Log category breakdown" icon="category">
                {A?.byType?.length ? (
                  <div className="space-y-4">
                    {A.byType.map((item) => {
                      const total = A.summary?.total || 1;
                      return <ProgressRow key={item.type} label={item.type.replace(/-/g, " ")} value={item.count} pct={Math.round((item.count / total) * 100)} />;
                    })}
                  </div>
                ) : (
                  <EmptyChart message="No activity data" />
                )}
              </Section>
            </div>

            <Section title="Activity by priority" subtitle="Urgency distribution across all logs" icon="flag">
              {A?.byPriority?.length ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                  {A.byPriority.map((item) => {
                    const stroke = item.priority === "critical" ? STROKE.red : item.priority === "high" ? STROKE.amber : STROKE.blue;
                    return (
                      <DonutChart
                        key={item.priority}
                        value={item.count}
                        max={A.summary?.total || 1}
                        colorClass={stroke}
                        label={<span className="capitalize">{item.priority}</span>}
                        subLabel={`${fmtNum(item.count)} logs`}
                      />
                    );
                  })}
                </div>
              ) : (
                <EmptyChart message="No priority data" />
              )}
            </Section>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        Report generated at {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : "—"}
      </p>
    </PageShell>
  );
}