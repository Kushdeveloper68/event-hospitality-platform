import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getServiceRequests, deleteServiceRequest, updateServiceStatus, getServiceSummary } from '../../api/serviceReqApi'
import NewServiceRequest from '../forms/NewServiceRequest'

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none'
const FIELD =
  'h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20'
const BTN_PRIMARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const BTN_SECONDARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

const TYPE_CONFIG = {
  housekeeping: { icon: 'clean_hands', label: 'Housekeeping', chip: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
  maintenance: { icon: 'build', label: 'Maintenance', chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
  fb: { icon: 'restaurant', label: 'Food & Beverage', chip: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' },
  valet: { icon: 'directions_car', label: 'Valet', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300' },
  other: { icon: 'concierge', label: 'Concierge / Other', chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' },
}

const STATUS_CONFIG = {
  open: {
    label: 'Open',
    cls: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  in_progress: {
    label: 'In progress',
    cls: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Resolved',
    cls: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    cls: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
}

const URGENCY_CONFIG = {
  emergency: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
  high: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300',
  low: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
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

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status]
  if (!c) return <span className="text-xs font-semibold text-slate-500">{status}</span>
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${c.cls}`}>
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

function ServiceRequestLogs({ eventId }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const action = searchParams.get('action')
  const requestId = searchParams.get('id')

  const [requests, setRequests] = useState([])
  const [summary, setSummary] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Row actions
  const [menu, setMenu] = useState(null) // { id, top, right }
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const menuRef = useRef(null)
  const loadedOnce = useRef(false)
  const reqId = useRef(0)

  // Notifications
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const loadData = async () => {
    if (!eventId) return
    const id = ++reqId.current
    setLoading(true)
    setError(null)
    try {
      const [listRes, summaryRes] = await Promise.all([
        getServiceRequests(eventId, { search: searchTerm, requestType: typeFilter, status: statusFilter }),
        getServiceSummary(eventId),
      ])
      if (id !== reqId.current) return

      if (listRes.success) setRequests(listRes.serviceRequests)
      if (summaryRes.success && summaryRes.summary) {
        const s = summaryRes.summary
        setSummary({
          total: s.total || 0,
          open: s.pending || 0,
          inProgress: s.inProgress || 0,
          resolved: s.resolved || 0,
        })
      }
      loadedOnce.current = true
    } catch (err) {
      if (id !== reqId.current) return
      console.error('Failed to load requests', err)
      setError('Failed to load service requests.')
    } finally {
      if (id === reqId.current) setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData()
    }, 300) // 300ms debounce on search
    return () => clearTimeout(delayDebounceFn)
  }, [eventId, searchTerm, typeFilter, statusFilter])

  // Close the row menu on outside click, scroll, resize or Escape
  useEffect(() => {
    if (!menu) return undefined
    const close = () => setMenu(null)
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target)) return
      if (e.target.closest?.('[data-menu-trigger]')) return
      close()
    }
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [menu])

  const toggleMenu = (e, id) => {
    if (menu?.id === id) return setMenu(null)
    const r = e.currentTarget.getBoundingClientRect()
    setMenu({ id, top: r.bottom + 6, right: window.innerWidth - r.right })
  }

  const handleEdit = (id) => {
    setMenu(null)
    setSearchParams({ action: 'editService', id })
  }

  const handleDeleteClick = (reqItem) => {
    setMenu(null)
    setRequestToDelete(reqItem)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!requestToDelete) return
    setDeleting(true)
    try {
      const res = await deleteServiceRequest(requestToDelete._id)
      if (res.success) {
        showToast('Service request deleted successfully')
        loadData()
      } else {
        showToast(res.message || 'Failed to delete request', 'error')
      }
    } catch (err) {
      showToast('Network error', 'error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
      setRequestToDelete(null)
    }
  }

  const handleExportCSV = () => {
    if (requests.length === 0) {
      showToast('No data to export', 'error')
      return
    }

    const headers = ['ID', 'Guest', 'Room', 'Type', 'Urgency', 'Status', 'Notes', 'Created At']
    const rows = requests.map((req) => [
      req._id,
      req.guest?.name || 'N/A',
      req.room?.number || 'N/A',
      req.requestType,
      req.urgency,
      req.status,
      req.notes || '',
      new Date(req.createdAt).toLocaleString(),
    ])

    const csvContent = [headers.map(csvCell).join(','), ...rows.map((row) => row.map(csvCell).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `service_requests_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Exporting to CSV…')
  }

  const handleStatusChange = async (id, newStatus) => {
    setMenu(null)
    setBusyId(id)
    try {
      const res = await updateServiceStatus(id, newStatus)
      if (res.success) {
        showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`)
        loadData()
      } else {
        showToast(res.message || 'Failed to update status', 'error')
      }
    } catch (err) {
      showToast('Network error', 'error')
    } finally {
      setBusyId(null)
    }
  }

  // If URL action param is active, render the form instead of the list
  if (action === 'addService' || action === 'editService') {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <NewServiceRequest
          eventId={eventId}
          memberId={requestId}
          onCancel={() => setSearchParams({})}
          onDone={() => {
            setSearchParams({})
            showToast(requestId ? 'Request updated' : 'Request created')
            loadData()
          }}
        />
      </div>
    )
  }

  const firstLoad = loading && !loadedOnce.current
  const hasFilters = !!(searchTerm || typeFilter || statusFilter)
  const menuReq = menu ? requests.find((r) => r._id === menu.id) : null

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {/* Delete confirmation */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => !deleting && setShowDeleteModal(false)}
        >
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
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Delete this request?</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  This will permanently delete the {TYPE_CONFIG[requestToDelete?.requestType]?.label?.toLowerCase() || requestToDelete?.requestType} request for{' '}
                  {requestToDelete?.guest?.name || 'this guest'}. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setShowDeleteModal(false)} disabled={deleting} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                Delete request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row action menu (fixed so it's never clipped by the table) */}
      {menu && menuReq && (
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: menu.top, right: menu.right }}
          className="z-[65] w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            Update status
          </p>
          {[
            ['open', 'fiber_new', 'Mark open', 'hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-300'],
            ['in_progress', 'run_circle', 'In progress', 'hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-300'],
            ['completed', 'check_circle', 'Resolved', 'hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300'],
          ].map(([s, icon, label, hover]) => (
            <button
              key={s}
              role="menuitem"
              disabled={menuReq.status === s}
              onClick={() => handleStatusChange(menuReq._id, s)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-slate-700 transition disabled:cursor-default disabled:opacity-40 dark:text-slate-300 ${hover}`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </button>
          ))}
          <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />
          <button
            role="menuitem"
            onClick={() => handleEdit(menuReq._id)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit details
          </button>
          <button
            role="menuitem"
            onClick={() => handleDeleteClick(menuReq)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Service</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            Service request logs
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Manage and monitor guest hospitality requests in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={handleExportCSV} className={BTN_SECONDARY} title="Export the listed requests to CSV">
            <span className="material-symbols-outlined text-[19px]">download</span>
            Export CSV
          </button>
          <button onClick={() => setSearchParams({ action: 'addService' })} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Create request
          </button>
        </div>
      </div>

      <StatStrip
        items={[
          { icon: 'receipt_long', label: 'Total requests', value: summary.total, color: 'text-blue-700 dark:text-blue-300' },
          { icon: 'fiber_new', label: 'Open', value: summary.open, color: 'text-amber-700 dark:text-amber-300' },
          { icon: 'run_circle', label: 'In progress', value: summary.inProgress, color: 'text-indigo-700 dark:text-indigo-300' },
          { icon: 'check_circle', label: 'Resolved', value: summary.resolved, color: 'text-emerald-700 dark:text-emerald-300' },
        ]}
      />

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={loadData} className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Table card */}
      <section className={`overflow-hidden ${CARD}`}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${FIELD} w-full pl-10`}
                placeholder="Search guest, room or ID…"
                type="text"
              />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Service type" className={`${FIELD} cursor-pointer`}>
              <option value="">All services</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
              <option value="fb">Food &amp; Beverage</option>
              <option value="valet">Valet</option>
              <option value="other">Other</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setTypeFilter('')
                  setStatusFilter('')
                }}
                className="text-xs font-bold text-blue-700 hover:underline dark:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex w-fit rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              ['', 'All'],
              ['open', `Open (${summary.open})`],
              ['in_progress', `In progress (${summary.inProgress})`],
              ['completed', `Resolved (${summary.resolved})`],
            ].map(([k, l]) => (
              <button
                key={k || 'all'}
                onClick={() => setStatusFilter(k)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition ${
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

        {/* Body */}
        {firstLoad ? (
          <div className="space-y-3 p-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : requests.length === 0 && !loading ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No requests found</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hasFilters ? 'Try adjusting your filters.' : 'Create a new ticket to get started.'}
            </p>
            {!hasFilters && (
              <button onClick={() => setSearchParams({ action: 'addService' })} className={`${BTN_PRIMARY} mt-5`}>
                <span className="material-symbols-outlined text-[19px]">add</span>
                Create request
              </button>
            )}
          </div>
        ) : (
          <div aria-busy={loading} className={`overflow-x-auto transition-opacity ${loading ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                  {[
                    ['Guest / room', ''],
                    ['Request', ''],
                    ['Status', ''],
                    ['Notes', ''],
                    ['Created', 'text-right'],
                    ['', 'text-right'],
                  ].map(([h, a], i) => (
                    <th key={i} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${a}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((req) => {
                  const t = TYPE_CONFIG[req.requestType] || TYPE_CONFIG.other
                  const isRowResolved = req.status === 'completed' || req.status === 'cancelled'
                  const urgencyCls = URGENCY_CONFIG[req.urgency] // medium has no badge, to avoid clutter
                  const next = req.status === 'open' ? ['in_progress', 'Start'] : req.status === 'in_progress' ? ['completed', 'Resolve'] : null

                  return (
                    <tr key={req._id} className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${isRowResolved ? 'opacity-70' : ''}`}>
                      <td className="px-5 py-3.5">
                        <p className="max-w-[200px] truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                          {req.guest ? req.guest.name : 'No guest linked'}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                          {req.room ? `Room ${req.room.number}` : 'No room info'} · #{req._id.slice(-6).toUpperCase()}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${t.chip}`}>
                            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                          </span>
                          <span className="whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-200">{t.label}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col items-start gap-1.5">
                          <StatusBadge status={req.status} />
                          {urgencyCls && (
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${urgencyCls}`}>
                              {req.urgency}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="line-clamp-2 max-w-[220px] text-xs font-medium leading-5 text-slate-600 dark:text-slate-400" title={req.notes}>
                          {req.notes || '—'}
                        </p>
                        {req.permissionToEnter && (
                          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                            <span className="material-symbols-outlined text-[12px]">key</span>
                            Permission to enter
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <p className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
                          {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {next && (
                            <button
                              onClick={() => handleStatusChange(req._id, next[0])}
                              disabled={busyId === req._id}
                              className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-[11px] font-bold text-slate-700 transition hover:bg-white disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              {busyId === req._id ? '…' : next[1]}
                            </button>
                          )}
                          <button
                            data-menu-trigger
                            onClick={(e) => toggleMenu(e, req._id)}
                            aria-label="More actions"
                            aria-haspopup="menu"
                            aria-expanded={menu?.id === req._id}
                            className={`inline-flex size-8 items-center justify-center rounded-lg transition ${
                              menu?.id === req._id
                                ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!firstLoad && requests.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
            Showing <strong className="text-slate-700 dark:text-slate-200">{requests.length}</strong> request{requests.length === 1 ? '' : 's'}
          </div>
        )}
      </section>
    </div>
  )
}

export default ServiceRequestLogs