import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getGuests, deleteGuest } from '../../api/guestApi'
import GuestDataEntry from '../forms/GuestDataEntry'

function GuestMasterList({ extraPath = '', eventId: propEventId }) {
  const { eventId: paramEventId } = useParams()
  const eventId = propEventId || paramEventId
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const action = searchParams.get('action') // 'add' or 'edit'
  const editingId = searchParams.get('id')

  const [guests, setGuests] = useState([])
  const [total, setTotal] = useState(0)
  const [checkedInCount, setCheckedInCount] = useState(0)
  const [vipCount, setVipCount] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 10
  const [searchQuery, setSearchQuery] = useState('')
  // local input state for immediate typing (debounced into `searchQuery`)
  const [inputValue, setInputValue] = useState('')
  const searchDebounceRef = useRef(null)
  const searchInputRef = useRef(null)
  const [vipFilter, setVipFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' }) // 'info', 'success', 'error', 'warning'
  const [deletingId, setDeletingId] = useState(null) // Track which guest is being deleted
  const [retryCount, setRetryCount] = useState(0)

  // Toast notification helper
  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), duration)
  }

  // Validate eventId before making API calls
  const validateEventId = () => {
    if (!eventId) {
      const errorMsg = 'Event ID is missing. Unable to load guests.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      return false
    }
    return true
  }

  useEffect(() => {
    if (!action) {
      fetchGuests()
    }
  }, [eventId, page, vipFilter, statusFilter, action])

  // keep inputValue in sync if searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    // refresh summary counts whenever the event changes or guests change
    if (eventId) fetchSummaryCounts()
  }, [eventId])

  // fetchGuests optionally suppresses the global loading flag (quiet) when we just want to update
const fetchGuests = async ({ quiet = false } = {}) => {
    try {
      // Validate eventId
      if (!validateEventId()) return

      if (!quiet) setLoading(true)
      setError(null)
      
      const params = { eventId, page, limit }
      if (searchQuery) params.search = searchQuery
      // map UI filter values to API params
      if (vipFilter === 'vip') params.vip = true
      if (vipFilter === 'nonvip') params.vip = false
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter
      
      const res = await getGuests(params)
      
      if (res.success) {
        setGuests(res.guests || [])
        setTotal(res.total || 0)
        setError(null)
        setRetryCount(0) // Reset retry count on success
        // refresh summary counts
        fetchSummaryCounts()
      } else {
        const errorMessage = res.message || 'Failed to load guests. Please try again.'
        setError(errorMessage)
        showToast(errorMessage, 'error')
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
      
      // Categorize errors for better UX
      let errorMsg = 'Error fetching guests'
      if (err.response?.status === 404) {
        errorMsg = 'Event not found. Please check the event ID.'
      } else if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.'
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.'
      } else if (err.message === 'Network Error') {
        errorMsg = 'Network error. Please check your connection.'
      } else if (err.message?.includes('timeout')) {
        errorMsg = 'Request timeout. Please try again.'
      }
      
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      if (!quiet) setLoading(false)
      // keep search input focused after results load
     if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }
  }

  // Retry function for failed operations
  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchGuests()
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setInputValue(value)

    // debounce updating the actual searchQuery used for fetching
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setPage(1)
      setSearchQuery(value)
      // perform search quietly without showing full page loader
      fetchGuests({ quiet: true })
    }, 200)
  }

  // clear debounce on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [])

  const handleDelete = async (id, guestName = '') => {
    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${guestName || 'this guest'}"? This action cannot be undone.`
    )
    if (!confirmDelete) return

    try {
      setDeletingId(id) // Set loading state for this specific guest
      showToast(`Deleting guest "${guestName}"...`, 'info')

      const res = await deleteGuest(id)
      
      if (res.success) {
        // Remove from local state immediately for UX
        setGuests(prev => prev.filter(g => g._id !== id))
        
        const successMsg = `Guest "${guestName}" deleted successfully.`
        showToast(successMsg, 'success')
        
        // Refresh list and counts
        await fetchGuests()
        await fetchSummaryCounts()
      } else {
        const errorMsg = res.message || 'Failed to delete guest'
        showToast(errorMsg, 'error')
        console.error('Delete error:', res)
      }
    } catch (err) {
      console.error('Error deleting guest:', err)
      
      let errorMsg = 'Failed to delete guest'
      if (err.response?.status === 404) {
        errorMsg = 'Guest not found. It may have already been deleted.'
      } else if (err.response?.status === 401) {
        errorMsg = 'You do not have permission to delete this guest.'
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.'
      } else if (err.message === 'Network Error') {
        errorMsg = 'Network error. Please check your connection and try again.'
      }
      
      showToast(errorMsg, 'error')
      // Refresh to ensure consistency
      await fetchGuests()
    } finally {
      setDeletingId(null)
    }
  }

  const openAddForm = () => {
    setSearchParams({ action: 'add' })
  }

  const fetchSummaryCounts = async () => {
    try {
      if (!eventId) {
        console.warn('Event ID missing for summary counts')
        return
      }
      
      // checked-in count
      const checked = await getGuests({ eventId, status: 'checkedin', page: 1, limit: 1 })
      const vip = await getGuests({ eventId, vip: true, page: 1, limit: 1 })
      
      if (checked.success) {
        setCheckedInCount(checked.total || 0)
      }
      if (vip.success) {
        setVipCount(vip.total || 0)
      }
    } catch (err) {
      // silently ignore errors for summary counts, log for debugging
      console.warn('Failed to fetch summary counts:', err.message)
      // Keep existing counts if fetch fails
    }
  }

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

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-red-500' : 
          toast.type === 'warning' ? 'bg-yellow-500' : 
          'bg-blue-500'
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

      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center py-6">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Guest Master List</h1>
                <p className="text-slate-500 text-sm">Manage arrivals, room assignments and VIP status for attendees.</p>
              </div>
              <button
                onClick={openAddForm}
                disabled={loading}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add Guest
              </button>
            </div>

            {/* Error Alert with Retry */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="material-symbols-outlined text-red-600 flex-shrink-0">error</span>
                <div className="flex-1">
                  <p className="text-red-800 font-medium">{error}</p>
                  <p className="text-red-700 text-sm mt-1">Please check your connection and try again.</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-medium transition-colors whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-border-light shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Guests</p>
                  <span className="material-symbols-outlined text-slate-400">groups</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-900 text-2xl font-bold">{loading ? '-' : total}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-border-light shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Checked-in</p>
                  <span className="material-symbols-outlined text-slate-400">check_circle</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-900 text-2xl font-bold">{loading ? '-' : checkedInCount}</p>
                  <p className="text-success text-xs font-bold bg-success/10 px-1.5 py-0.5 rounded">{total ? Math.round((checkedInCount/total)*100) : 0}%</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-border-light shadow-sm">
                <div className="flex justify-between items-center">
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Remaining</p>
                  <span className="material-symbols-outlined text-slate-400">pending</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-slate-900 text-2xl font-bold">{loading ? '-' : Math.max(total - checkedInCount, 0)}</p>
                  <p className="text-danger text-xs font-bold bg-danger/10 px-1.5 py-0.5 rounded">{total ? Math.round(((total-checkedInCount)/total)*100) : 0}%</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 p-4 bg-white border border-border-light rounded-t-xl items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input
                    ref={searchInputRef}
                    value={inputValue}
                    onChange={handleSearchChange}
                    className="w-full bg-neutral-light border-none rounded-lg h-9 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                    placeholder="Search guests or rooms..."
                    type="text"
                  />
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <label className="text-xs text-slate-500">VIP</label>
                  <select 
                    value={vipFilter} 
                    onChange={(e) => { setVipFilter(e.target.value); setPage(1) }}
                    disabled={loading}
                    className="h-9 rounded-lg border border-border-light bg-white px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="all">All</option>
                    <option value="vip">VIP</option>
                    <option value="nonvip">Non-VIP</option>
                  </select>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <label className="text-xs text-slate-500">Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                    disabled={loading}
                    className="h-9 rounded-lg border border-border-light bg-white px-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="all">All</option>
                    <option value="checkedin">Checked-in</option>
                    <option value="notchecked">Not checked</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">
                  Showing {Math.min((page - 1) * limit + 1, total)}-
                  {Math.min(page * limit, total)} of {total}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1 || loading}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous page"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * limit >= total || loading}
                    className="p-1 hover:bg-slate-100 rounded text-slate-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next page"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="bg-white border-x border-b border-border-light rounded-b-xl overflow-hidden shadow-sm">
                <div className="py-16 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium">Loading guests...</p>
                  <p className="text-slate-400 text-sm mt-1">Please wait while we fetch the data.</p>
                </div>
              </div>
            ) : error && guests.length === 0 ? (
              <div className="bg-white border-x border-b border-border-light rounded-b-xl overflow-hidden shadow-sm">
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">group_off</span>
                  <p className="text-slate-600 font-medium">Unable to load guests</p>
                  <p className="text-slate-400 text-sm mt-1">An error occurred while fetching the data. Please try again.</p>
                </div>
              </div>
            ) : guests.length === 0 ? (
              <div className="bg-white border-x border-b border-border-light rounded-b-xl overflow-hidden shadow-sm">
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">people_outline</span>
                  <p className="text-slate-600 font-medium">No guests found</p>
                  <p className="text-slate-400 text-sm mt-1">Start by adding your first guest to the event.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white border-x border-b border-border-light rounded-b-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-y border-border-light">
                      <tr>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Room #</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Arrival</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Departure</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {guests.map((g) => (
                        <tr key={g._id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 text-primary font-bold rounded-full size-8 flex items-center justify-center text-xs">
                                {g.fullName ? g.fullName.split(' ').map((w) => w[0]).join('').toUpperCase() : '?'}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                                  {g.fullName}
                                  {g.vipStatus && (
                                    <span className="material-symbols-outlined text-warning text-sm fill-1" title="VIP Guest">star</span>
                                  )}
                                </div>
                                {g.email && <div className="text-xs text-slate-400">{g.email}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{g.phoneNumber || '-'}</td>
                          <td className="px-6 py-4">
                            {g.checkedIn ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success ring-1 ring-inset ring-success/20">Checked-in</span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning ring-1 ring-inset ring-warning/20">{g.arrivalDatetime ? 'Arriving' : 'Pending'}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">{g.room?.number || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{g.arrivalDatetime ? new Date(g.arrivalDatetime).toLocaleString() : '-'}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{g.departureDatetime ? new Date(g.departureDatetime).toLocaleString() : '-'}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => setSearchParams({ action: 'edit', id: g._id })}
                              disabled={deletingId === g._id}
                              className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                              title="Edit guest"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(g._id, g.fullName)}
                              disabled={deletingId === g._id}
                              className="p-1 hover:bg-red-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                              title="Delete guest"
                            >
                              {deletingId === g._id ? (
                                <span className="material-symbols-outlined text-lg animate-spin">hourglass_bottom</span>
                              ) : (
                                <span className="material-symbols-outlined text-lg">delete</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <button 
                  disabled={loading || guests.length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Export guest list as CSV"
                >
                  <span className="material-symbols-outlined text-sm">download</span> Export CSV
                </button>
                <button 
                  disabled={loading || guests.length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Print guest list"
                >
                  <span className="material-symbols-outlined text-sm">print</span> Print List
                </button>
              </div>
              <nav className="flex items-center gap-1">
                <button 
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1 || loading}
                  className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-border-light rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Go to previous page"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm font-bold text-white bg-primary border border-primary rounded">
                  {page}
                </span>
                <button 
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total || loading}
                  className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Go to next page"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </main>
      </div>

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

export default GuestMasterList
