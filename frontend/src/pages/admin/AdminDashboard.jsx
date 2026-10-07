import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../api/adminApi'

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'
const FIELD =
  'h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20'
const BTN_PRIMARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const BTN_SECONDARY =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

const ACCENT = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
}

const fmtNum = (n) => (n == null ? '—' : Number(n).toLocaleString())
const fmtCompact = (n) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const shortDay = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const niceScale = (v) => {
  if (v <= 4) return { step: 1, max: 4 }
  const raw = v / 4
  const p = 10 ** Math.floor(Math.log10(raw))
  const n = raw / p
  const m = [1, 2, 3, 4, 5, 6, 8, 10].find((x) => x >= n)
  return { step: m * p, max: m * p * 4 }
}

// ─── Building blocks ──────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
    </div>
  )
}

function StatCard({ label, value, sub, icon, accent = 'blue' }) {
  return (
    <div className={`p-5 ${CARD}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${ACCENT[accent]}`}>
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </div>
      </div>
      <p className="mt-3 text-[32px] font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50">{value}</p>
      {sub && <p className="mt-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">{sub}</p>}
    </div>
  )
}

function Card({ title, subtitle, icon, children, className = '' }) {
  return (
    <section className={`flex min-w-0 flex-col ${CARD} ${className}`}>
      <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">
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
      <div className="flex-1 p-5 pt-4 sm:p-6 sm:pt-5">{children}</div>
    </section>
  )
}

function useWidth() {
  const ref = useRef(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    setW(Math.floor(el.getBoundingClientRect().width))
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

// Responsive bar chart with y-axis, day labels and a hover tooltip
function SignupTrendChart({ trend }) {
  const [ref, width] = useWidth()
  const [hover, setHover] = useState(null)
  const height = 220
  const m = { t: 12, r: 8, b: 28, l: 34 }
  const n = trend.length
  const innerW = Math.max(width - m.l - m.r, 10)
  const innerH = height - m.t - m.b
  const { step, max } = niceScale(Math.max(...trend.map((t) => t.count), 1))
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step)
  const y = (v) => m.t + innerH - (v / max) * innerH
  const band = innerW / n
  const barW = Math.max(4, Math.min(band * 0.62, 36))
  const xAt = (i) => m.l + band * i + band / 2
  const k = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(innerW / 56))))

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} className="block" role="img" aria-label="Signups over the last 14 days">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={m.l} x2={m.l + innerW} y1={y(t)} y2={y(t)} className="stroke-slate-100 dark:stroke-slate-800" />
              <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" className="fill-slate-500 dark:fill-slate-400">
                {fmtCompact(t)}
              </text>
            </g>
          ))}
          {trend.map((d, i) => {
            const h = Math.max(d.count > 0 ? 3 : 0, y(0) - y(d.count))
            return (
              <rect
                key={d.date}
                x={xAt(i) - barW / 2}
                y={y(0) - h}
                width={barW}
                height={h}
                rx={Math.min(4, barW / 2)}
                className="fill-blue-600 dark:fill-blue-500"
                style={{ opacity: hover == null || hover === i ? 1 : 0.4, transition: 'opacity .15s' }}
              />
            )
          })}
          {trend.map((d, i) =>
            i % k !== 0 ? null : (
              <text
                key={d.date}
                x={xAt(i)}
                y={height - 8}
                textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
                fontSize="11"
                className="fill-slate-500 dark:fill-slate-400"
              >
                {shortDay(d.date)}
              </text>
            )
          )}
          {trend.map((d, i) => (
            <rect
              key={d.date}
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
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs shadow-lg dark:bg-slate-100"
          style={{
            left: Math.min(Math.max(xAt(hover), 56), Math.max(width - 56, 56)),
            top: Math.max(y(trend[hover].count) - 10, 0),
          }}
        >
          <p className="font-medium text-slate-300 dark:text-slate-500">{shortDay(trend[hover].date)}</p>
          <p className="font-extrabold text-white dark:text-slate-900">
            {fmtNum(trend[hover].count)} signup{trend[hover].count === 1 ? '' : 's'}
          </p>
        </div>
      )}
    </div>
  )
}

function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  )
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
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={`h-80 p-6 lg:col-span-2 ${CARD}`}>
          <Skeleton className="mb-5 h-5 w-44" />
          <Skeleton className="h-52 w-full" />
        </div>
        <div className={`h-80 p-6 ${CARD}`}>
          <Skeleton className="mb-5 h-5 w-36" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="mb-3 h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Recent signups filters
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      const res = await getAdminStats()
      if (res.success) {
        setStats(res.stats)
        setLastUpdated(new Date())
      } else if (res.message === 'Admin access required') {
        setForbidden(true)
      } else {
        setError(res.message || 'Failed to load admin stats')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // ── Not an admin ──────────────────────────────────────────────────────────
  if (forbidden) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#f7f8fa] p-6 text-center dark:bg-slate-950">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span className="material-symbols-outlined text-[28px]">lock</span>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">Admins only</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">This page is restricted to platform administrators.</p>
        </div>
        <Link to="/dashboard" className={`${BTN_PRIMARY} mt-2`}>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to dashboard
        </Link>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageShell>
        <div className="mb-8 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <DashboardSkeleton />
      </PageShell>
    )
  }

  // ── Error (nothing loaded) ────────────────────────────────────────────────
  if (error && !stats) {
    return (
      <PageShell>
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="material-symbols-outlined text-[25px]">error</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Couldn't load admin stats</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
          <button onClick={() => load()} className={`${BTN_PRIMARY} mt-6`}>
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      </PageShell>
    )
  }

  if (!stats) return null

  const verifiedPct = stats.users.total > 0 ? Math.round((stats.users.verified / stats.users.total) * 100) : 0
  const trend = stats.signupTrend || []
  const trendTotal = trend.reduce((sum, d) => sum + d.count, 0)
  const organizers = stats.topOrganizers || []
  const maxEvents = Math.max(...organizers.map((o) => o.eventCount), 1)

  const q = query.trim().toLowerCase()
  const signups = (stats.recentSignups || []).filter(
    (u) =>
      (!q || [u.name, u.email, u.organizationName].some((v) => v && String(v).toLowerCase().includes(q))) &&
      (statusFilter === 'all' || (statusFilter === 'verified' ? u.isEmailVerified : !u.isEmailVerified))
  )

  return (
    <PageShell>
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Platform</p>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
            Platform admin
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Site-wide usage and signup statistics — visible only to admins.
            {lastUpdated && (
              <span className="ml-1.5 text-slate-400 dark:text-slate-500">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button onClick={() => load(true)} disabled={refreshing} className={BTN_SECONDARY}>
          <span className={`material-symbols-outlined text-[18px] ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      {error && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="truncate text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => load(true)} className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline">
            Retry
          </button>
        </div>
      )}

      <div aria-busy={refreshing} className={`space-y-5 transition-opacity ${refreshing ? 'opacity-60' : ''}`}>
        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={fmtNum(stats.users.total)} sub={`+${fmtNum(stats.users.newThisWeek)} this week`} icon="group" accent="blue" />
          <StatCard
            label="Verified users"
            value={fmtNum(stats.users.verified)}
            sub={`${verifiedPct}% verified · ${fmtNum(stats.users.unverified)} unverified`}
            icon="verified_user"
            accent="emerald"
          />
          <StatCard label="Total events" value={fmtNum(stats.events.total)} sub={`${fmtNum(stats.events.active)} active now`} icon="calendar_month" accent="violet" />
          <StatCard label="Total guests" value={fmtNum(stats.guests.total)} sub="across all events" icon="diversity_3" accent="amber" />
        </div>

        {/* Trend + organizers */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card
            title="Signups — last 14 days"
            subtitle={trend.length ? `${fmtNum(trendTotal)} new user${trendTotal === 1 ? '' : 's'} in this period` : undefined}
            icon="trending_up"
            className="lg:col-span-2"
          >
            {trend.length ? <SignupTrendChart trend={trend} /> : <EmptyState icon="bar_chart" message="No signup data yet" />}
          </Card>

          <Card title="Most active organizers" subtitle="By events created" icon="emoji_events">
            {organizers.length === 0 ? (
              <EmptyState icon="event_busy" message="No events created yet" />
            ) : (
              <ul className="space-y-4">
                {organizers.map((org, i) => (
                  <li key={org.userId}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{org.name}</p>
                          <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{org.organizationName}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                        {org.eventCount}
                        <span className="ml-1 text-xs font-semibold text-slate-500 dark:text-slate-400">events</span>
                      </span>
                    </div>
                    <div className="ml-10 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: `${(org.eventCount / maxEvents) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Recent signups */}
        <section className={`overflow-hidden ${CARD}`}>
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <span className="material-symbols-outlined text-[19px]">person_add</span>
              </div>
              <div>
                <h3 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Recent signups</h3>
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Latest accounts created on the platform</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-56">
                <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">search</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, org…"
                  className={`${FIELD} w-full pl-8`}
                />
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {[
                  ['all', 'All'],
                  ['verified', 'Verified'],
                  ['unverified', 'Unverified'],
                ].map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setStatusFilter(k)}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${
                      statusFilter === k
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {signups.length === 0 ? (
            <EmptyState icon="person_off" message={stats.recentSignups?.length ? 'No signups match your search or filter' : 'No signups yet'} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                    {['Name', 'Email', 'Organization', 'Status', 'Joined'].map((h) => (
                      <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {signups.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {(u.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="max-w-[180px] truncate text-sm font-bold text-slate-900 dark:text-slate-100">{u.name}</span>
                          {u.isAdmin && (
                            <span className="shrink-0 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                              Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="max-w-[240px] truncate px-5 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="max-w-[200px] truncate px-5 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-400">{u.organizationName || '—'}</td>
                      <td className="px-5 py-3.5">
                        {u.isEmailVerified ? (
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400">{fmtDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {stats.recentSignups?.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:px-6">
              Showing <strong className="text-slate-700 dark:text-slate-200">{signups.length}</strong> of {stats.recentSignups.length} recent signups
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}

export default AdminDashboard