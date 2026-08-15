import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getArrivingToday,
  getCheckedInGuests,
  getPendingGuests,
  checkInGuest,
  checkOutGuest,
  getCheckInSummary,
} from '../../api/checkInApi'

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
  const [error, setError] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })

  // Toast helper
  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), duration)
  }

  // Fetch all columns
  const fetchAll = async ({ quiet = false } = {}) => {
    try {
      if (!eventId) {
        setError('Event ID is missing. Unable to load check-in data.')
        return
      }
      if (!quiet) setLoading(true)
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
      if (!quiet) setLoading(false)
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
        showToast(`✓ ${guestName} checked in successfully`, 'success')
        await fetchAll({ quiet: true })
      } else {
        showToast(res.message || 'Failed to check in guest', 'error')
      }
    } catch (err) {
      console.error('Check-in error:', err)
      const msg = err.message || 'Failed to check in guest'
      showToast(msg, 'error')
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
        showToast(`✓ ${guestName} checked out successfully`, 'success')
        await fetchAll({ quiet: true })
      } else {
        showToast(res.message || 'Failed to check out guest', 'error')
      }
    } catch (err) {
      console.error('Check-out error:', err)
      const msg = err.message || 'Failed to check out guest'
      showToast(msg, 'error')
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
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  }

  // Loading state
  if (loading) {
    return (
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-600 font-medium">Loading check-in desk...</p>
            <p className="text-slate-400 text-sm mt-1">Fetching guest data</p>
          </div>
        </div>
      </main>
    )
  }

  // Error state (full page)
  if (error && arriving.length === 0 && checkedIn.length === 0 && pending.length === 0) {
    return (
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-md">
            <span className="material-symbols-outlined text-6xl text-red-300 block mb-4">error</span>
            <p className="text-red-700 font-bold text-lg mb-2">Unable to load check-in desk</p>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => fetchAll()}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'warning' ? 'bg-yellow-500' :
          'bg-primary-500'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' && <span className="material-symbols-outlined">check_circle</span>}
            {toast.type === 'error' && <span className="material-symbols-outlined">error</span>}
            {toast.type === 'warning' && <span className="material-symbols-outlined">warning</span>}
            {toast.type === 'info' && <span className="material-symbols-outlined">info</span>}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Error Banner (non-blocking) */}
      {error && (
        <div className="max-w-[1600px] mx-auto px-6 pt-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="material-symbols-outlined text-red-600 flex-shrink-0">error</span>
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={() => fetchAll()}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry
            </button>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 font-medium">✕</button>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] w-full mx-auto p-6 h-[calc(100vh-64px)] overflow-y-auto">
        {/* Dashboard Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">

          {/* Column 1: Arriving Today */}
          <section className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <h2 className="font-display text-card-h3 text-slate-800 dark:text-slate-100">Arriving Today</h2>
              </div>
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full">
                {summary.arrivingToday}
              </span>
            </header>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {arriving.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-4">
                  <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">event_available</span>
                  <p className="text-sm font-medium text-slate-400">No guests arriving today</p>
                </div>
              ) : (
                arriving.map((g) => (
                  <div key={g._id} className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 text-primary font-bold rounded-full size-9 flex items-center justify-center text-xs">
                          {getInitials(g.fullName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {g.fullName}
                            {g.vipStatus && (
                              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase font-black">VIP</span>
                            )}
                          </h3>
                          {g.groupName && <p className="text-xs text-slate-500 font-medium">{g.groupName}</p>}
                        </div>
                      </div>
                      {g.arrivalDatetime && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {formatTime(g.arrivalDatetime)}
                        </span>
                      )}
                    </div>
                    {g.room?.number && (
                      <p className="text-xs text-slate-500 mb-3">
                        <span className="material-symbols-outlined text-[14px] align-middle mr-1">meeting_room</span>
                        Room {g.room.number}
                      </p>
                    )}
                    <button
                      onClick={() => handleCheckIn(g._id, g.fullName)}
                      disabled={actionLoadingId === g._id}
                      className="w-full bg-primary hover:bg-primary-600 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      {actionLoadingId === g._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Checking in...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                          Check-in
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Column 2: Currently Checked-in */}
          <section className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/30 dark:bg-emerald-900/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                <h2 className="font-display text-card-h3 text-slate-800 dark:text-slate-100">Checked-in</h2>
              </div>
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                {summary.checkedIn}
              </span>
            </header>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
              {checkedIn.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-4">
                  <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">how_to_reg</span>
                  <p className="text-sm font-medium text-slate-400">No guests checked in yet</p>
                </div>
              ) : (
                checkedIn.map((g) => (
                  <div key={g._id} className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 text-emerald-700 font-bold rounded-full size-9 flex items-center justify-center text-xs">
                          {getInitials(g.fullName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {g.fullName}
                            {g.vipStatus && (
                              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase font-black">VIP</span>
                            )}
                          </h3>
                          {g.groupName && <p className="text-xs text-slate-500 font-medium">{g.groupName}</p>}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded">
                        ON-SITE
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                      {g.room?.number && (
                        <span>
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">meeting_room</span>
                          Room {g.room.number}
                        </span>
                      )}
                      {g.checkedInAt && (
                        <span>
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">login</span>
                          In at {formatTime(g.checkedInAt)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCheckOut(g._id, g.fullName)}
                      disabled={actionLoadingId === g._id}
                      className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      {actionLoadingId === g._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin"></div>
                          Checking out...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">logout</span>
                          Check-out
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Column 3: Pending Arrivals */}
          <section className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/30 dark:bg-amber-900/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">warning</span>
                <h2 className="font-display text-card-h3 text-slate-800 dark:text-slate-100">Pending Arrivals</h2>
              </div>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
                {summary.pending}
              </span>
            </header>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-4">
                  <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">info</span>
                  <p className="text-sm font-medium text-slate-400">No more pending<br/>urgent arrivals</p>
                </div>
              ) : (
                pending.map((g) => {
                  const late = isLate(g.arrivalDatetime)
                  return (
                    <div
                      key={g._id}
                      className={`group p-4 rounded-lg transition-all ${
                        late
                          ? 'bg-amber-50/40 dark:bg-amber-900/5 border border-amber-200 dark:border-amber-900/30'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`font-bold rounded-full size-9 flex items-center justify-center text-xs ${
                            late ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {getInitials(g.fullName)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {g.fullName}
                              {late && <span className="material-symbols-outlined text-amber-500 text-[16px]">priority_high</span>}
                              {g.vipStatus && (
                                <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase font-black">VIP</span>
                              )}
                            </h3>
                            {g.groupName && <p className="text-xs text-slate-500 font-medium">{g.groupName}</p>}
                          </div>
                        </div>
                        {late ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">LATE</span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">PENDING</span>
                        )}
                      </div>
                      {g.room?.number && (
                        <p className="text-xs text-slate-500 mb-3">
                          <span className="material-symbols-outlined text-[14px] align-middle mr-1">meeting_room</span>
                          Room {g.room.number}
                        </p>
                      )}
                      <button
                        onClick={() => handleCheckIn(g._id, g.fullName)}
                        disabled={actionLoadingId === g._id}
                        className="w-full bg-primary hover:bg-primary-600 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        {actionLoadingId === g._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Checking in...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                            Check-in
                          </>
                        )}
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Operational Footer */}
      <footer className="shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 py-2 px-6">
        <div className="max-w-[1600px] mx-auto flex flex-wrap gap-3 justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Total: <span className="text-slate-600">{summary.totalGuests}</span>
            </span>
            <span className="flex items-center gap-1">
              Checked-in: <span className="text-emerald-500">{summary.checkedIn}</span>
            </span>
            <span className="flex items-center gap-1">
              Pending: <span className="text-amber-500">{summary.pending}</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchAll({ quiet: true })}
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Online
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default CheckInOprationDesk