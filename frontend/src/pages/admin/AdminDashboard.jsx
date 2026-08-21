import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../api/adminApi'

function StatCard({ label, value, sub, icon, accent = 'primary' }) {
  const accentClasses = {
    primary: 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    violet: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
  }
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-5 shadow-card dark:shadow-card-dark">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption font-bold text-neutral-muted uppercase tracking-wider mb-2">{label}</p>
          <p className="text-page-h1 font-display text-slate-900 dark:text-white leading-none">{value}</p>
          {sub && <p className="text-caption text-slate-400 dark:text-slate-500 mt-2">{sub}</p>}
        </div>
        <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${accentClasses[accent]}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}

function SignupTrendChart({ trend }) {
  if (!trend || trend.length === 0) return null
  const max = Math.max(...trend.map((t) => t.count), 1)

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-5 shadow-card dark:shadow-card-dark">
      <h3 className="font-display text-card-h3 text-slate-900 dark:text-white mb-4">
        Signups — last 14 days
      </h3>
      <div className="flex items-end gap-1.5 h-36">
        {trend.map((day) => {
          const heightPct = (day.count / max) * 100
          const dateLabel = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center justify-end gap-1.5 group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-10">
                {day.count} on {dateLabel}
              </div>
              <div
                className="w-full rounded-t bg-primary-500 dark:bg-primary-400 min-h-[3px] transition-all"
                style={{ height: `${Math.max(heightPct, 3)}%` }}
              />
              <span className="text-[9px] text-slate-400 dark:text-slate-500 -rotate-45 origin-top-left w-4 mt-2">
                {new Date(day.date).getDate()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      const res = await getAdminStats()
      if (res.success) {
        setStats(res.stats)
      } else if (res.message === 'Admin access required') {
        setForbidden(true)
      } else {
        setError(res.message || 'Failed to load admin stats')
      }
      setLoading(false)
    }
    load()
  }, [])

  if (forbidden) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="size-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-red-500">lock</span>
        </div>
        <div>
          <h1 className="font-display text-section-h2 text-slate-900 dark:text-white">Admins only</h1>
          <p className="text-body text-slate-500 dark:text-slate-400 mt-1">
            This page is restricted to platform administrators.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="mt-2 px-5 py-2.5 rounded-lg bg-primary-500 text-white text-body font-bold hover:bg-primary-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="size-8 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/40 p-4 text-body text-red-700 dark:text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-page-h1 text-slate-900 dark:text-white">Platform Admin</h1>
        <p className="text-body text-slate-500 dark:text-slate-400 mt-1">
          Site-wide usage and signup statistics — visible only to admins.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Users"
          value={stats.users.total}
          sub={`+${stats.users.newThisWeek} this week`}
          icon="group"
          accent="primary"
        />
        <StatCard
          label="Verified Users"
          value={stats.users.verified}
          sub={`${stats.users.unverified} unverified`}
          icon="verified_user"
          accent="emerald"
        />
        <StatCard
          label="Total Events"
          value={stats.events.total}
          sub={`${stats.events.active} active now`}
          icon="calendar_month"
          accent="violet"
        />
        <StatCard
          label="Total Guests"
          value={stats.guests.total}
          sub="across all events"
          icon="diversity_3"
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SignupTrendChart trend={stats.signupTrend} />
        </div>

        {/* Top organizers */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark p-5 shadow-card dark:shadow-card-dark">
          <h3 className="font-display text-card-h3 text-slate-900 dark:text-white mb-4">
            Most Active Organizers
          </h3>
          {stats.topOrganizers.length === 0 ? (
            <p className="text-body text-slate-400 dark:text-slate-500">No events created yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topOrganizers.map((org, i) => (
                <li key={org.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-caption font-bold text-slate-400 dark:text-slate-500 w-4">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-body font-semibold text-slate-800 dark:text-slate-200 truncate">{org.name}</p>
                      <p className="text-caption text-slate-400 dark:text-slate-500 truncate">{org.organizationName}</p>
                    </div>
                  </div>
                  <span className="text-caption font-bold text-primary-600 dark:text-primary-400 shrink-0">
                    {org.eventCount} events
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent signups */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark shadow-card dark:shadow-card-dark overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-display text-card-h3 text-slate-900 dark:text-white">Recent Signups</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-5 py-3 text-caption font-bold text-neutral-muted uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-caption font-bold text-neutral-muted uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-caption font-bold text-neutral-muted uppercase tracking-wider">Organization</th>
                <th className="px-5 py-3 text-caption font-bold text-neutral-muted uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-caption font-bold text-neutral-muted uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentSignups.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 text-body font-medium text-slate-800 dark:text-slate-200">
                    {u.name}
                    {u.isAdmin && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-body text-slate-500 dark:text-slate-400">{u.email}</td>
                  <td className="px-5 py-3 text-body text-slate-500 dark:text-slate-400">{u.organizationName}</td>
                  <td className="px-5 py-3">
                    {u.isEmailVerified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-body text-slate-500 dark:text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard