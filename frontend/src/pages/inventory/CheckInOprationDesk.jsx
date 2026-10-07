import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  getArrivingToday,
  getCheckedInGuests,
  getPendingGuests,
  checkInGuest,
  checkOutGuest,
  getCheckInSummary,
} from '../../api/checkInApi'

// ─── Shared styles (same system as the rest of the event workspace) ───────────
const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'

const COLUMN_TONE = {
  blue: {
    chip: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
    count: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    count: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    count: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  },
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
}

function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="bg-white p-4 dark:bg-slate-900 sm:p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            <span className={`material-symbols-outlined text-[16px] ${it.color}`}>{it.icon}</span>
            {it.label}
          </p>
          <p className="mt-2 text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50 sm:text-[28px]">
            {it.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function Column({ icon, title, count, tone, children }) {
  const t = COLUMN_TONE[tone]
  return (
    <section className={`flex min-h-[26rem] min-w-0 flex-col overflow-hidden lg:h-[calc(100vh-8rem)] ${CARD}`}>
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`flex size-9 items-center justify-center rounded-xl ${t.chip}`}>
            <span className="material-symbols-outlined text-[19px]">{icon}</span>
          </div>
          <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{title}</h2>
        </div>
        <span className={`min-w-[28px] rounded-full px-2.5 py-1 text-center text-xs font-extrabold tabular-nums ${t.count}`}>
          {count}
        </span>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-3 dark:bg-slate-950/30">{children}</div>
    </section>
  )
}

function ColumnEmpty({ icon, message }) {
  return (
    <div className="mt-2 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-4 py-10 text-center dark:border-slate-800">
      <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{message}</p>
    </div>
  )
}

function VipBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      <span className="material-symbols-outlined text-[11px]">star</span>
      VIP
    </span>
  )
}

function Spinner({ dark }) {
  return (
    <span
      className={`size-4 animate-spin rounded-full border-2 ${
        dark
          ? 'border-slate-400/30 border-t-slate-500'
          : 'border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900'
      }`}
    />
  )
}

function InfoLine({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span className="material-symbols-outlined text-[15px]">{icon}</span>
      {children}
    </span>
  )
}

const PRIMARY_BTN =
  'flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const SECONDARY_BTN =
  'flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'

function CheckInOprationDesk({ eventId: propEventId }) {
  const { eventId: paramEventId } = useParams()
  const eventId = propEventId || paramEventId

  // Data states
  const [arriving, setArriving] = useState([])
  const [checkedIn, setCheckedIn] = useState([])
  const [pending, setPending] = useState([])
  const [summary, setSummary] = useState({ totalGuests: 0, checkedIn: 0, arrivingToday: 0, pending: 0 })

  // UI states
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const [search, setSearch] = useState('')
  const toastTimer = useRef(null)

  // Toast helper
  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ show: true, message, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast({ show: false, message: '', type: 'info' }), duration)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // Fetch all columns
  const fetchAll = async ({ quiet = false } = {}) => {
    try {
      if (!eventId) {
        setError('Event ID is missing. Unable to load check-in data.')
        return
      }
      if (!quiet) setLoading(true)
      else setRefreshing(true)
      setError(null)

      const [arrivingRes, checkedInRes, pendingRes, summaryRes] = await Promise.all([
        getArrivingToday(eventId),
        getCheckedInGuests(eventId),
        getPendingGuests(eventId),
        getCheckInSummary(eventId),
      ])

      if (arrivingRes.success) setArriving(arrivingRes.guests || [])
      if (checkedInRes.success) setCheckedIn(checkedInRes.guests || [])
      if (pendingRes.success) setPending(pendingRes.guests || [])
      if (summaryRes.success) {
        setSummary({
          totalGuests: summaryRes.totalGuests || 0,
          checkedIn: summaryRes.checkedIn || 0,
          arrivingToday: summaryRes.arrivingToday || 0,
          pending: summaryRes.pending || 0,
        })
      }
    } catch (err) {
      console.error('Error fetching check-in data:', err)
      let errorMsg = 'Failed to load check-in data'
      if (err.message === 'Network Error') {
        errorMsg = 'Network error. Please check your connection.'
      } else if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.'
      } else if (err.response?.status === 403) {
        errorMsg = 'You do not have permission to view this event.'
      } else if (err.message) {
        errorMsg = err.message
      }
      setError(errorMsg)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [eventId])

  // Handle check-in
  const handleCheckIn = async (guestId, guestName) => {
    try {
      setActionLoadingId(guestId)
      const res = await checkInGuest(guestId)
      if (res.success) {
        showToast(`${guestName} checked in successfully`, 'success')
        await fetchAll({ quiet: true })
      } else {
        showToast(res.message || 'Failed to check in guest', 'error')
      }
    } catch (err) {
      console.error('Check-in error:', err)
      showToast(err.message || 'Failed to check in guest', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Handle check-out
  const handleCheckOut = async (guestId, guestName) => {
    try {
      setActionLoadingId(guestId)
      const res = await checkOutGuest(guestId)
      if (res.success) {
        showToast(`${guestName} checked out successfully`, 'success')
        await fetchAll({ quiet: true })
      } else {
        showToast(res.message || 'Failed to check out guest', 'error')
      }
    } catch (err) {
      console.error('Check-out error:', err)
      showToast(err.message || 'Failed to check out guest', 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Format time from Date
  const formatTime = (date) => {
    if (!date) return null
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  // Check if a guest is late (arrival time has passed)
  const isLate = (arrivalDatetime) => {
    if (!arrivalDatetime) return false
    return new Date(arrivalDatetime) < new Date()
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  // Search across all three columns
  const q = search.trim().toLowerCase()
  const match = (g) =>
    !q ||
    (g.fullName || '').toLowerCase().includes(q) ||
    (g.groupName || '').toLowerCase().includes(q) ||
    String(g.room?.number || '').toLowerCase().includes(q)
  const arrivingList = arriving.filter(match)
  const checkedInList = checkedIn.filter(match)
  const pendingList = pending.filter(match)

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-96 p-4 ${CARD}`}>
              <Skeleton className="mb-4 h-9 w-40" />
              <Skeleton className="mb-3 h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Full error ─────────────────────────────────────────────────────────────
  if (error && arriving.length === 0 && checkedIn.length === 0 && pending.length === 0) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span className="material-symbols-outlined text-[25px]">error</span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Unable to load check-in desk</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
        <button
          onClick={() => fetchAll()}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast.show && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[60] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === 'success'
              ? 'bg-emerald-600'
              : toast.type === 'error'
                ? 'bg-red-600'
                : toast.type === 'warning'
                  ? 'bg-amber-600'
                  : 'bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'info'}
          </span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
            Operations
          </p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            Check-in desk
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Check guests in on arrival and check them out when they leave.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, group or room…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20 sm:w-64"
            />
          </div>
          <button
            onClick={() => fetchAll({ quiet: true })}
            disabled={refreshing}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={`material-symbols-outlined text-[18px] ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error banner (non-blocking) */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button onClick={() => fetchAll()} className="text-xs font-bold underline underline-offset-2 hover:no-underline">
              Retry
            </button>
            <button onClick={() => setError(null)} aria-label="Dismiss" className="flex">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      <StatStrip
        items={[
          { icon: 'group', label: 'Total guests', value: summary.totalGuests, color: 'text-blue-700 dark:text-blue-300' },
          { icon: 'schedule', label: 'Arriving today', value: summary.arrivingToday, color: 'text-indigo-700 dark:text-indigo-300' },
          { icon: 'how_to_reg', label: 'Checked in', value: summary.checkedIn, color: 'text-emerald-700 dark:text-emerald-300' },
          { icon: 'pending_actions', label: 'Pending', value: summary.pending, color: 'text-amber-700 dark:text-amber-300' },
        ]}
      />

      {/* Operations grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Arriving today */}
        <Column icon="schedule" title="Arriving today" count={arrivingList.length} tone="blue">
          {arrivingList.length === 0 ? (
            <ColumnEmpty icon="event_available" message={q ? 'No matching guests' : 'No guests arriving today'} />
          ) : (
            arrivingList.map((g) => (
              <div
                key={g._id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-[0_6px_18px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:shadow-none"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {getInitials(g.fullName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        <span className="truncate">{g.fullName}</span>
                        {g.vipStatus && <VipBadge />}
                      </h3>
                      {g.groupName && <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{g.groupName}</p>}
                    </div>
                  </div>
                  {g.arrivalDatetime && (
                    <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {formatTime(g.arrivalDatetime)}
                    </span>
                  )}
                </div>
                {g.room?.number && (
                  <div className="mb-3">
                    <InfoLine icon="meeting_room">Room {g.room.number}</InfoLine>
                  </div>
                )}
                <button onClick={() => handleCheckIn(g._id, g.fullName)} disabled={actionLoadingId === g._id} className={PRIMARY_BTN}>
                  {actionLoadingId === g._id ? (
                    <>
                      <Spinner />
                      Checking in…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[19px]">how_to_reg</span>
                      Check in
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </Column>

        {/* Checked in */}
        <Column icon="check_circle" title="Checked in" count={checkedInList.length} tone="emerald">
          {checkedInList.length === 0 ? (
            <ColumnEmpty icon="how_to_reg" message={q ? 'No matching guests' : 'No guests checked in yet'} />
          ) : (
            checkedInList.map((g) => (
              <div
                key={g._id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {getInitials(g.fullName)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        <span className="truncate">{g.fullName}</span>
                        {g.vipStatus && <VipBadge />}
                      </h3>
                      {g.groupName && <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{g.groupName}</p>}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    On-site
                  </span>
                </div>
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {g.room?.number && <InfoLine icon="meeting_room">Room {g.room.number}</InfoLine>}
                  {g.checkedInAt && <InfoLine icon="login">In at {formatTime(g.checkedInAt)}</InfoLine>}
                </div>
                <button onClick={() => handleCheckOut(g._id, g.fullName)} disabled={actionLoadingId === g._id} className={SECONDARY_BTN}>
                  {actionLoadingId === g._id ? (
                    <>
                      <Spinner dark />
                      Checking out…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[19px]">logout</span>
                      Check out
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </Column>

        {/* Pending arrivals */}
        <Column icon="warning" title="Pending arrivals" count={pendingList.length} tone="amber">
          {pendingList.length === 0 ? (
            <ColumnEmpty icon="task_alt" message={q ? 'No matching guests' : 'No pending arrivals'} />
          ) : (
            pendingList.map((g) => {
              const late = isLate(g.arrivalDatetime)
              return (
                <div
                  key={g._id}
                  className={`rounded-xl border p-4 transition ${
                    late
                      ? 'border-amber-200 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/5'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                          late
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {getInitials(g.fullName)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-slate-100">
                          <span className="truncate">{g.fullName}</span>
                          {g.vipStatus && <VipBadge />}
                        </h3>
                        {g.groupName && <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{g.groupName}</p>}
                      </div>
                    </div>
                    {late ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                        Late
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Pending
                      </span>
                    )}
                  </div>
                  {g.room?.number && (
                    <div className="mb-3">
                      <InfoLine icon="meeting_room">Room {g.room.number}</InfoLine>
                    </div>
                  )}
                  <button onClick={() => handleCheckIn(g._id, g.fullName)} disabled={actionLoadingId === g._id} className={PRIMARY_BTN}>
                    {actionLoadingId === g._id ? (
                      <>
                        <Spinner />
                        Checking in…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[19px]">how_to_reg</span>
                        Check in
                      </>
                    )}
                  </button>
                </div>
              )
            })
          )}
        </Column>
      </div>
    </div>
  )
}

export default CheckInOprationDesk