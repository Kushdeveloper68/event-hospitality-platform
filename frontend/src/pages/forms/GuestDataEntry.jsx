import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGuest, getGuestById, updateGuest } from '../../api/guestApi'

function GuestDataEntry({ eventId: propEventId, guestId: propGuestId, onDone, onCancel }) {
  const { eventId: paramEventId } = useParams()
  const eventId = propEventId || paramEventId
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
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
      getGuestById(id)
        .then((res) => {
          if (res && res.success === false) {
            setError(res.message || 'Failed to load guest')
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
        })
        .catch((err) => setError(err.message || 'Failed to load guest'))
        .finally(() => setLoading(false))
    }
  }, [propGuestId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = { ...form, event: eventId }
      let res
      if (propGuestId) {
        res = await updateGuest(propGuestId, payload)
      } else {
        res = await createGuest(payload)
      }
      if (onDone) {
        onDone(res)
      } else {
        navigate(`/events/${eventId}/guests`)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to save guest')
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
    {/* <!-- Top Navigation Bar --> */}

    {/* <!-- Main Content Area --> */}
    <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
      {/* <!-- Breadcrumbs & Header --> */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
          <a className="hover:text-primary transition-colors" href="#">Guests</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">Add New Guest</span>
        </nav>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Add / Edit Guest</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Configure profile details and logistical requirements for
              the upcoming event.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors">Discard
              Draft</button>
            <button
              className="px-6 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm shadow-primary/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
              Save Guest
            </button>
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
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4"
                placeholder="e.g. Johnathan Doe" type="text" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4"
                  placeholder="+1 (555) 000-0000" type="tel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Age</label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4"
                  placeholder="25" type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Group / Company Name</label>
              <input
                name="groupName"
                value={form.groupName}
                onChange={handleChange}
                className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4"
                placeholder="e.g. Acme Corporation" type="text" />
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
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" type="checkbox" name="vipStatus" checked={form.vipStatus} onChange={handleChange} />
                <div
                  className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary">
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
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Arrival Datetime</label>
                <input
                  name="arrivalDatetime"
                  value={form.arrivalDatetime}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 text-sm"
                  type="datetime-local" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Departure Datetime</label>
                <input
                  name="departureDatetime"
                  value={form.departureDatetime}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 text-sm"
                  type="datetime-local" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transport Mode</label>
              <div className="relative">
                <select
                  name="transportMode"
                  value={form.transportMode}
                  onChange={handleChange}
                  className="w-full h-12 appearance-none rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 pr-10">
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
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary focus:ring-primary/20 transition-all px-4 py-3 text-sm"
                placeholder="e.g. Dietary restrictions, accessibility needs, or preferred floor levels..."
                rows="4"></textarea>
            </div>
          </div>
        </section>
      </div>
      {/* <!-- Sticky Footer for Actions --> */}
      <form onSubmit={handleSubmit}>
        <div className="mt-12 flex justify-end gap-4 p-6 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
          <button type="button" onClick={handleCancel}
            className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-colors">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-8 py-3 text-sm font-bold text-white bg-primary rounded-lg shadow-md shadow-primary/20 hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            {saving ? 'Saving...' : 'Confirm & Save Guest'}
          </button>
        </div>
      </form>
    </main>
    {/* <!-- Footer Meta --> */}
    <footer className="mt-auto px-8 py-6 border-t border-slate-200 dark:border-slate-800 text-center">
      <p className="text-xs text-slate-400">© 2024 Event Hospitality Management Platform. All Guest data is encrypted and
        managed according to GDPR standards.</p>
    </footer>
  </div>
  )
}

export default GuestDataEntry