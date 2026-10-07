import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getGuests, deleteGuest, bulkImportGuests } from '../../api/guestApi'
import GuestDataEntry from '../forms/GuestDataEntry'
import { CsvImportModal } from '../../components'

const GUEST_CSV_COLUMNS = [
  { key: 'fullName', label: 'Full Name', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'phoneNumber', label: 'Phone', required: false },
  { key: 'age', label: 'Age', required: false },
  { key: 'groupName', label: 'Group', required: false },
  { key: 'vipStatus', label: 'VIP', required: false },
  { key: 'arrivalDatetime', label: 'Arrival', required: true },
  { key: 'departureDatetime', label: 'Departure', required: false },
  { key: 'specialRequests', label: 'Special Requests', required: false },
]
const GUEST_CSV_SAMPLE_ROWS = [
  { fullName: 'Rahul Mehta', email: 'rahul@example.com', phoneNumber: '9876543210', age: '34', groupName: 'Mehta Family', vipStatus: 'true', arrivalDatetime: '2026-11-20 14:00', departureDatetime: '2026-11-23 11:00', specialRequests: 'Vegetarian meal' },
  { fullName: 'Priya Shah', email: 'priya@example.com', phoneNumber: '9876501234', age: '29', groupName: 'Mehta Family', vipStatus: 'false', arrivalDatetime: '2026-11-20 16:30', departureDatetime: '2026-11-22 10:00', specialRequests: '' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'
const FIELD =
  'h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20'
const BTN_PRIMARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const BTN_SECONDARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : '—'

// How many guests are loaded at once while a search is active
const SEARCH_FETCH_LIMIT = 1000

// Lower-case and drop spaces / dashes / brackets / "+" so "98765 43210" matches "9876543210"
const normalizeSearch = (v) => String(v).toLowerCase().replace(/[\s\-()+]/g, '')

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

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
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50 sm:text-[28px]">
              {it.value}
            </p>
            {it.sub && <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{it.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusPill({ guest }) {
  if (guest.checkedIn) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Checked in
      </span>
    )
  }
  return guest.arrivalDatetime ? (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
      <span className="size-1.5 rounded-full bg-blue-500" />
      Arriving
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
      <span className="size-1.5 rounded-full bg-amber-500" />
      Pending
    </span>
  )
}

function ConfirmDialog({ title, message, confirmLabel, busy, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:items-center" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="material-symbols-outlined text-[24px]">delete</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button onClick={onCancel} disabled={busy} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {busy && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function GuestMasterList({ extraPath = '', eventId: propEventId }) {
  const { eventId: paramEventId } = useParams()
  const eventId = propEventId || paramEventId
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const action = searchParams.get('action') // 'add' or 'edit'
  const editingId = searchParams.get('id')

  const [guests, setGuests] = useState([])
  const [total, setTotal] = useState(0)
  const [overallTotal, setOverallTotal] = useState(0)
  const [checkedInCount, setCheckedInCount] = useState(0)
  const [vipCount, setVipCount] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 10
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const searchDebounceRef = useRef(null)
  const [vipFilter, setVipFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true) // first load → skeleton
  const [fetching, setFetching] = useState(false) // later loads → dim table
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const [pendingDelete, setPendingDelete] = useState(null) // { id, name }
  const [deletingId, setDeletingId] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const loadedOnce = useRef(false)
  const reqId = useRef(0)
  const toastTimer = useRef(null)

  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ show: true, message, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast({ show: false, message: '', type: 'info' }), duration)
  }

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current)
      clearTimeout(searchDebounceRef.current)
    }
  }, [])

  const validateEventId = () => {
    if (!eventId) {
      const errorMsg = 'Event ID is missing. Unable to load guests.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      return false
    }
    return true
  }

  // Summary counts are independent of search/filters
  const fetchSummaryCounts = async () => {
    try {
      if (!eventId) return
      const [all, checked, vip] = await Promise.all([
        getGuests({ eventId, page: 1, limit: 1 }),
        getGuests({ eventId, status: 'checkedin', page: 1, limit: 1 }),
        getGuests({ eventId, vip: true, page: 1, limit: 1 }),
      ])
      if (all.success) setOverallTotal(all.total || 0)
      if (checked.success) setCheckedInCount(checked.total || 0)
      if (vip.success) setVipCount(vip.total || 0)
    } catch (err) {
      console.warn('Failed to fetch summary counts:', err.message)
    }
  }

  const fetchGuests = async () => {
    const id = ++reqId.current
    try {
      if (!validateEventId()) return
      if (loadedOnce.current) setFetching(true)
      else setLoading(true)
      setError(null)

      // While searching, load the matching set (VIP / status filters still applied by the
      // server) and match on name, phone, email, group AND room number here, then paginate.
      const searching = !!searchQuery
      const params = searching ? { eventId, page: 1, limit: SEARCH_FETCH_LIMIT } : { eventId, page, limit }
      if (vipFilter === 'vip') params.vip = true
      if (vipFilter === 'nonvip') params.vip = false
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter

      const res = await getGuests(params)
      if (id !== reqId.current) return

      if (res.success) {
        if (searching) {
          const q = normalizeSearch(searchQuery)
          const matches = (res.guests || []).filter((g) =>
            [g.fullName, g.phoneNumber, g.email, g.groupName, g.room?.number].some(
              (v) => v != null && normalizeSearch(v).includes(q)
            )
          )
          setTotal(matches.length)
          setGuests(matches.slice((page - 1) * limit, page * limit))
        } else {
          setGuests(res.guests || [])
          setTotal(res.total || 0)
        }
        setError(null)
        loadedOnce.current = true
      } else {
        const errorMessage = res.message || 'Failed to load guests. Please try again.'
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
    } catch (err) {
      if (id !== reqId.current) return
      console.error('Error fetching guests:', err)
      let errorMsg = 'Error fetching guests'
      if (err.response?.status === 404) errorMsg = 'Event not found. Please check the event ID.'
      else if (err.response?.status === 401) errorMsg = 'Session expired. Please log in again.'
      else if (err.response?.status === 500) errorMsg = 'Server error. Please try again later.'
      else if (err.message === 'Network Error') errorMsg = 'Network error. Please check your connection.'
      else if (err.message?.includes('timeout')) errorMsg = 'Request timeout. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      if (id === reqId.current) {
        setLoading(false)
        setFetching(false)
      }
    }
  }

  // Refetch whenever the query, page or filters change
  useEffect(() => {
    if (!action) fetchGuests()
  }, [eventId, page, searchQuery, vipFilter, statusFilter, action])

  useEffect(() => {
    if (eventId) fetchSummaryCounts()
  }, [eventId, action])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setPage(1)
      setSearchQuery(value.trim())
    }, 300)
  }

  const clearFilters = () => {
    setInputValue('')
    setSearchQuery('')
    setVipFilter('all')
    setStatusFilter('all')
    setPage(1)
  }

  const handleExportCSV = () => {
    if (guests.length === 0) {
      showToast('No guests to export', 'error')
      return
    }
    const headers = ['Name', 'Email', 'Phone', 'VIP', 'Checked In', 'Room #', 'Arrival', 'Departure']
    const rows = guests.map((g) => [
      g.fullName || '',
      g.email || '',
      g.phoneNumber || '',
      g.vipStatus ? 'Yes' : 'No',
      g.checkedIn ? 'Yes' : 'No',
      g.room?.number || 'N/A',
      g.arrivalDatetime ? new Date(g.arrivalDatetime).toLocaleString() : '',
      g.departureDatetime ? new Date(g.departureDatetime).toLocaleString() : '',
    ])
    const csvContent = [headers.map(csvCell).join(','), ...rows.map((r) => r.map(csvCell).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `guest-list-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Guest list exported successfully', 'success')
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const { id, name } = pendingDelete
    try {
      setDeletingId(id)
      const res = await deleteGuest(id)
      if (res.success) {
        setGuests((prev) => prev.filter((g) => g._id !== id))
        showToast(`Guest "${name}" deleted successfully.`, 'success')
        await Promise.all([fetchGuests(), fetchSummaryCounts()])
      } else {
        showToast(res.message || 'Failed to delete guest', 'error')
        console.error('Delete error:', res)
      }
    } catch (err) {
      console.error('Error deleting guest:', err)
      let errorMsg = 'Failed to delete guest'
      if (err.response?.status === 404) errorMsg = 'Guest not found. It may have already been deleted.'
      else if (err.response?.status === 401) errorMsg = 'You do not have permission to delete this guest.'
      else if (err.response?.status === 500) errorMsg = 'Server error. Please try again later.'
      else if (err.message === 'Network Error') errorMsg = 'Network error. Please check your connection and try again.'
      showToast(errorMsg, 'error')
      await fetchGuests()
    } finally {
      setDeletingId(null)
      setPendingDelete(null)
    }
  }

  const openAddForm = () => setSearchParams({ action: 'add' })

  const closeForm = () => {
    setSearchParams({})
    navigate(`/events/${eventId}/guests`)
  }

  if (action === 'add' || action === 'edit') {
    return (
      <GuestDataEntry
        eventId={eventId}
        guestId={editingId}
        onDone={() => {
          closeForm()
          fetchGuests()
        }}
        onCancel={closeForm}
      />
    )
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  const hasFilters = !!searchQuery || vipFilter !== 'all' || statusFilter !== 'all'
  const pct = (n) => (overallTotal ? Math.round((n / overallTotal) * 100) : 0)

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast.show && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[60] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'warning' ? 'bg-amber-600' : 'bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : toast.type === 'warning' ? 'warning' : 'info'}
          </span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this guest?"
          message={`"${pendingDelete.name || 'This guest'}" will be permanently removed from the event. This action cannot be undone.`}
          confirmLabel="Delete guest"
          busy={deletingId === pendingDelete.id}
          onConfirm={confirmDelete}
          onCancel={() => deletingId == null && setPendingDelete(null)}
        />
      )}

      {showImportModal && (
        <CsvImportModal
          title="Import Guests"
          columns={GUEST_CSV_COLUMNS}
          sampleRows={GUEST_CSV_SAMPLE_ROWS}
          importFn={bulkImportGuests}
          eventId={eventId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            fetchGuests()
            fetchSummaryCounts()
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Guests</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">Guest master list</h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Manage arrivals, room assignments and VIP status for attendees.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => setShowImportModal(true)} disabled={loading} className={BTN_SECONDARY}>
            <span className="material-symbols-outlined text-[19px]">upload_file</span>
            Import CSV
          </button>
          <button onClick={openAddForm} disabled={loading} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Add guest
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button onClick={() => fetchGuests()} className="text-xs font-bold underline underline-offset-2 hover:no-underline">
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
          { icon: 'groups', label: 'Total guests', value: loading ? '—' : overallTotal, color: 'text-blue-700 dark:text-blue-300' },
          { icon: 'how_to_reg', label: 'Checked in', value: loading ? '—' : checkedInCount, sub: `${pct(checkedInCount)}%`, color: 'text-emerald-700 dark:text-emerald-300' },
          { icon: 'pending_actions', label: 'Remaining', value: loading ? '—' : Math.max(overallTotal - checkedInCount, 0), sub: `${pct(Math.max(overallTotal - checkedInCount, 0))}%`, color: 'text-amber-700 dark:text-amber-300' },
          { icon: 'star', label: 'VIP guests', value: loading ? '—' : vipCount, sub: `${pct(vipCount)}%`, color: 'text-violet-700 dark:text-violet-300' },
        ]}
      />

      {/* Table card */}
      <section className={`overflow-hidden ${CARD}`}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
              <input
                value={inputValue}
                onChange={handleSearchChange}
                className={`${FIELD} w-full pl-10`}
                placeholder="Search name, phone or room…"
                type="text"
              />
            </div>
            <select
              value={vipFilter}
              onChange={(e) => {
                setVipFilter(e.target.value)
                setPage(1)
              }}
              aria-label="VIP filter"
              className={`${FIELD} cursor-pointer`}
            >
              <option value="all">All guests</option>
              <option value="vip">VIP only</option>
              <option value="nonvip">Non-VIP</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              aria-label="Status filter"
              className={`${FIELD} cursor-pointer`}
            >
              <option value="all">Any status</option>
              <option value="checkedin">Checked in</option>
              <option value="notchecked">Not checked in</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs font-bold text-blue-700 hover:underline dark:text-blue-300">
                Clear filters
              </button>
            )}
          </div>
          <button
            onClick={handleExportCSV}
            disabled={loading || guests.length === 0}
            title="Exports the guests currently shown on this page"
            className={`${BTN_SECONDARY} h-9 text-xs`}
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export page
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error && guests.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <span className="material-symbols-outlined text-[24px]">group_off</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Unable to load guests</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">An error occurred while fetching the data.</p>
            <button onClick={() => fetchGuests()} className={`${BTN_PRIMARY} mt-5`}>
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Try again
            </button>
          </div>
        ) : guests.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <span className="material-symbols-outlined text-[24px]">people_outline</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{hasFilters ? 'No guests match your filters' : 'No guests yet'}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hasFilters ? 'Try a different search or clear the filters.' : 'Start by adding your first guest to the event.'}
            </p>
            {!hasFilters && (
              <button onClick={openAddForm} className={`${BTN_PRIMARY} mt-5`}>
                <span className="material-symbols-outlined text-[19px]">add</span>
                Add guest
              </button>
            )}
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${fetching ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                  {[
                    ['Guest', ''],
                    ['Phone', ''],
                    ['Status', ''],
                    ['Room', 'text-center'],
                    ['Arrival', ''],
                    ['Departure', ''],
                    ['', 'text-right'],
                  ].map(([h, a], i) => (
                    <th key={i} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${a}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {guests.map((g) => (
                  <tr key={g._id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {g.fullName ? g.fullName.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2) : '?'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                            <span className="max-w-[200px] truncate">{g.fullName}</span>
                            {g.vipStatus && (
                              <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }} title="VIP guest">
                                star
                              </span>
                            )}
                          </div>
                          {g.email && <div className="max-w-[220px] truncate text-xs font-medium text-slate-500 dark:text-slate-400">{g.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-slate-600 dark:text-slate-400">{g.phoneNumber || '—'}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill guest={g} />
                    </td>
                    <td className="px-5 py-3.5 text-center text-sm font-bold text-slate-700 dark:text-slate-300">{g.room?.number || '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">{fmtDateTime(g.arrivalDatetime)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">{fmtDateTime(g.departureDatetime)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSearchParams({ action: 'edit', id: g._id })}
                        disabled={deletingId === g._id}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        title="Edit guest"
                        aria-label={`Edit ${g.fullName}`}
                      >
                        <span className="material-symbols-outlined text-[19px]">edit</span>
                      </button>
                      <button
                        onClick={() => setPendingDelete({ id: g._id, name: g.fullName })}
                        disabled={deletingId === g._id}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        title="Delete guest"
                        aria-label={`Delete ${g.fullName}`}
                      >
                        <span className="material-symbols-outlined text-[19px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / pagination */}
        {!loading && guests.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing <strong className="text-slate-700 dark:text-slate-200">{from}–{to}</strong> of{' '}
              <strong className="text-slate-700 dark:text-slate-200">{total}</strong> guests
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || fetching}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                Previous
              </button>
              <span className="px-1 font-bold tabular-nums text-slate-700 dark:text-slate-200">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total || fetching}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default GuestMasterList