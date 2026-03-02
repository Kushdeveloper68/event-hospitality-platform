import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGuest, getGuestById, updateGuest } from '../../api/guestApi'

function GuestDataEntry({ eventId: propEventId, guestId: propGuestId, onDone, onCancel }) {
  const { eventId: paramEventId } = useParams()
  const eventId = propEventId || paramEventId
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' })
  const [validationErrors, setValidationErrors] = useState({})
  const navigate = useNavigate()

  // Toast notification helper
  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), duration)
  }

  // Form validation
  const validateForm = () => {
    const errors = {}
    if (!form.fullName?.trim()) errors.fullName = 'Full name is required'
    if (!form.email?.trim()) errors.email = 'Email is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!form.phoneNumber?.trim()) errors.phoneNumber = 'Phone number is required'
    if (!form.arrivalDatetime) errors.arrivalDatetime = 'Arrival date is required'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    age: '',
    groupName: '',
    vipStatus: false,
    checkedIn: false,
    arrivalDatetime: '',
    departureDatetime: '',
    transportMode: '',
    specialRequests: '',
  })

  useEffect(() => {
    // if guestId prop provided, load the guest
    const id = propGuestId || propGuestId
    if (id) {
      setLoading(true)
      setError(null)
      getGuestById(id)
        .then((res) => {
          if (res && res.success === false) {
            const errorMsg = res.message || 'Failed to load guest'
            setError(errorMsg)
            showToast(errorMsg, 'error')
            return
          }
          const g = res.guest || res
          setForm({
            fullName: g.fullName || '',
            email: g.email || '',
            phoneNumber: g.phoneNumber || '',
            age: g.age || '',
            groupName: g.groupName || '',
            vipStatus: !!g.vipStatus,
            checkedIn: !!g.checkedIn,
            arrivalDatetime: g.arrivalDatetime ? new Date(g.arrivalDatetime).toISOString().slice(0, 16) : '',
            departureDatetime: g.departureDatetime ? new Date(g.departureDatetime).toISOString().slice(0, 16) : '',
            transportMode: g.transportMode || '',
            specialRequests: g.specialRequests || '',
          })
          showToast('Guest loaded successfully', 'success')
        })
        .catch((err) => {
          console.error('Error loading guest:', err)
          let errorMsg = 'Failed to load guest'
          if (err.response?.status === 404) {
            errorMsg = 'Guest not found. It may have been deleted.'
          } else if (err.response?.status === 401) {
            errorMsg = 'You do not have permission to view this guest.'
          } else if (err.response?.status === 500) {
            errorMsg = 'Server error. Please try again later.'
          } else if (err.message === 'Network Error') {
            errorMsg = 'Network error. Please check your connection.'
          }
          setError(errorMsg)
          showToast(errorMsg, 'error')
        })
        .finally(() => setLoading(false))
    }
  }, [propGuestId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      showToast('Please fix the errors below', 'warning')
      return
    }
    
    // Validate Event ID
    if (!eventId) {
      const errorMsg = 'Event ID is missing. Unable to save guest.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      return
    }
    
    setSaving(true)
    setError(null)
    try {
      const payload = { ...form, event: eventId }
      let res
      const isUpdating = !!propGuestId
      
      if (isUpdating) {
        res = await updateGuest(propGuestId, payload)
      } else {
        res = await createGuest(payload)
      }
      
      if (res.success === false) {
        const errorMsg = res.message || 'Failed to save guest'
        setError(errorMsg)
        showToast(errorMsg, 'error')
        return
      }
      
      const successMsg = isUpdating ? 'Guest updated successfully!' : 'Guest created successfully!'
      showToast(successMsg, 'success')
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        if (onDone) {
          onDone(res)
        } else {
          navigate(`/events/${eventId}/guests`)
        }
      }, 1500)
    } catch (err) {
      console.error('Error saving guest:', err)
      
      let errorMsg = 'Failed to save guest'
      if (err.response?.status === 400) {
        errorMsg = 'Invalid data. Please check all fields and try again.'
      } else if (err.response?.status === 401) {
        errorMsg = 'You do not have permission to save guests.'
      } else if (err.response?.status === 409) {
        errorMsg = 'A guest with this email already exists.'
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
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) return onCancel()
    navigate(`/events/${eventId}/guests`)
  }

  return (
    <div className="relative flex min-h-screen flex-col">
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

      {/* Loading Skeleton */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Loading guest information...</p>
            <p className="text-slate-400 text-sm mt-1">Please wait while we fetch the details.</p>
          </div>
        </div>
      )}

    {/* <!-- Main Content Area --> */}
    <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
      {/* Error Alert with Retry */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
          <span className="material-symbols-outlined text-red-600 flex-shrink-0">error</span>
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">Please check the details and try again.</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex-shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
          <a className="hover:text-primary transition-colors" href="#">Guests</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{propGuestId ? 'Edit Guest' : 'Add New Guest'}</span>
        </nav>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add / Edit Guest</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Configure profile details and logistical requirements for
              the upcoming event.</p>
          </div>
        </div>
      </div>
      {/* <!-- Form Layout: Two Columns --> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* <!-- Left Column: Personal Info --> */}
        <section
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">person</span>
            <h3 className="font-bold text-slate-900 dark:text-white">Personal Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email <span className="text-red-500">*</span></label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className={`w-full h-12 rounded-lg bg-white dark:bg-slate-800 focus:ring-primary/20 transition-all px-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                  validationErrors.email
                    ? 'border-red-300 focus:border-red-500 border'
                    : 'border-slate-200 dark:border-slate-700 focus:border-primary border'
                }`}
                placeholder="guest@example.com"
                type="email"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name <span className="text-red-500">*</span></label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={loading}
                className={`w-full h-12 rounded-lg bg-white dark:bg-slate-800 focus:ring-primary/20 transition-all px-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                  validationErrors.fullName
                    ? 'border-red-300 focus:border-red-500 border'
                    : 'border-slate-200 dark:border-slate-700 focus:border-primary border'
                }`}
                placeholder="e.g. Johnathan Doe"
                type="text"
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {validationErrors.fullName}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number <span className="text-red-500">*</span></label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full h-12 rounded-lg bg-white dark:bg-slate-800 focus:ring-primary/20 transition-all px-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.phoneNumber
                      ? 'border-red-300 focus:border-red-500 border'
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary border'
                  }`}
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                />
                {validationErrors.phoneNumber && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {validationErrors.phoneNumber}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Age</label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="25"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Group / Company Name</label>
              <input
                name="groupName"
                value={form.groupName}
                onChange={handleChange}
                disabled={loading}
                className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g. Acme Corporation"
                type="text"
              />
            </div>
            <div
              className="pt-4 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div
                  className="size-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
                  <span className="material-symbols-outlined fill-1">star</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">VIP Status</p>
                  <p className="text-xs text-slate-500">Enable premium handling &amp; front-row seating</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <input 
                  className="sr-only peer" 
                  type="checkbox" 
                  name="vipStatus" 
                  checked={form.vipStatus} 
                  onChange={handleChange}
                  disabled={loading}
                />
                <div
                  className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
                    loading
                      ? 'bg-slate-300 dark:bg-slate-600'
                      : 'bg-slate-200 dark:bg-slate-700 peer-checked:bg-primary'
                  }`}
                >
                </div>
              </label>
            </div>
          </div>
        </section>
        {/* <!-- Right Column: Logistics --> */}
        <section
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <h3 className="font-bold text-slate-900 dark:text-white">Logistics &amp; Arrival</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Arrival Datetime <span className="text-red-500">*</span></label>
                <input
                  name="arrivalDatetime"
                  value={form.arrivalDatetime}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full h-12 rounded-lg bg-white dark:bg-slate-800 focus:ring-primary/20 transition-all px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.arrivalDatetime
                      ? 'border-red-300 focus:border-red-500 border'
                      : 'border-slate-200 dark:border-slate-700 focus:border-primary border'
                  }`}
                  type="datetime-local"
                />
                {validationErrors.arrivalDatetime && (
                  <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {validationErrors.arrivalDatetime}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Departure Datetime</label>
                <input
                  name="departureDatetime"
                  value={form.departureDatetime}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  type="datetime-local"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transport Mode</label>
              <div className="relative">
                <select
                  name="transportMode"
                  value={form.transportMode}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full h-12 appearance-none rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 pr-10 disabled:opacity-50 disabled:cursor-not-allowed border">
                  <option value="">Select transport mode...</option>
                  <option>Private Car Service</option>
                  <option>Commercial Flight</option>
                  <option>Train / Rail</option>
                  <option>Corporate Shuttle</option>
                  <option>Own Transportation</option>
                </select>
                <span
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Special Requests / Notes</label>
              <textarea
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g. Dietary restrictions, accessibility needs, or preferred floor levels..."
                rows="4"
              />
            </div>
          </div>
        </section>
      </div>
      {/* Sticky Footer for Actions */}
      <form onSubmit={handleSubmit}>
        <div className="mt-12 flex justify-end gap-4 p-6 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={saving || loading}
            className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving || loading}
            className="px-8 py-3 text-sm font-bold text-white bg-primary rounded-lg shadow-md shadow-primary/20 hover:bg-blue-700 hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-3"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin">hourglass_bottom</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Confirm & Save Guest
              </>
            )}
          </button>
        </div>
      </form>
    </main>
    {/* Footer Meta */}
    <footer className="mt-auto px-8 py-6 border-t border-slate-200 dark:border-slate-800 text-center">
      <p className="text-xs text-slate-400">© 2024 Event Hospitality Management Platform. All Guest data is encrypted and
        managed according to GDPR standards.</p>
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

export default GuestDataEntry