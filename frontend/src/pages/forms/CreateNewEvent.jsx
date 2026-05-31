import React, { useState } from 'react'
import { createEvent } from '../../api/eventApi'
import { useNavigate } from 'react-router-dom'

function CreateNewEvent() {
  const [eventName, setEventName] = useState('')
  const [venue, setVenue] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!eventName.trim()) {
      setError('Event name is required')
      return
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date')
      return
    }

    setLoading(true)

    try {
      const eventData = {
        name: eventName,
        venue: venue || '',
        startDate: startDate || null,
        endDate: endDate || null,
        description: description || '',
        isPrivate,
      }

      const response = await createEvent(eventData)

      if (response.success) {
        setSuccess('Event created successfully! Redirecting...')
        setTimeout(() => {
          navigate('/events')
        }, 1500)
      }
    } catch (err) {
      setError(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/events')
  }
  return (
    <div className="relative flex min-h-screen flex-col">
    {/* <!-- Top Navigation Bar --> */}
    
    <main className="flex-1 px-4 py-8 md:px-10 lg:px-20">
      <div className="mx-auto max-w-[800px]">
        {/* <!-- Breadcrumbs --> */}
        {/* <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-[#616e89]">
          <a className="hover:text-primary" href="#">Events</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#111318]">Create New Event</span>
        </nav> */}
        {/* <!-- Header --> */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#111318] dark:text-white md:text-4xl">Create New Event</h1>
          <p className="mt-2 text-lg text-[#616e89] dark:text-slate-400">Fill in the details below to initialize your event logistics and venue
            management.</p>
        </div>

        {/* <!-- Error & Success Messages --> */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-900/50 rounded-lg">
            <p className="text-sm text-green-700 dark:text-emerald-400">{success}</p>
          </div>
        )}

        {/* <!-- Form Card --> */}
        <div className="rounded-xl border border-[#dbdee6] dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm md:p-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* <!-- Section: Basic Info --> */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#111318] dark:text-white">Event Name <span className="text-red-500">*</span></label>
                <input
                  className="w-full rounded-lg border border-[#dbdee6] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#111318] dark:text-white placeholder:text-[#616e89] dark:placeholder:text-slate-500 px-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="e.g., Annual Tech Symposium 2024"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#111318] dark:text-white">Venue / Location</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89] dark:text-slate-500">location_pin</span>
                  <input
                    className="w-full rounded-lg border border-[#dbdee6] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#111318] dark:text-white placeholder:text-[#616e89] dark:placeholder:text-slate-500 pl-10 pr-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Search or enter venue address"
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#111318] dark:text-white">Start Date</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89] dark:text-slate-500">calendar_today</span>
                  <input
                    className="w-full rounded-lg border border-[#dbdee6] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#111318] dark:text-white pl-10 pr-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#111318] dark:text-white">End Date</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89] dark:text-slate-500">event_upcoming</span>
                  <input
                    className="w-full rounded-lg border border-[#dbdee6] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#111318] dark:text-white pl-10 pr-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#111318] dark:text-white">Description</label>
                <textarea
                  className="w-full rounded-lg border border-[#dbdee6] dark:border-slate-800 bg-white dark:bg-slate-800 text-[#111318] dark:text-white placeholder:text-[#616e89] dark:placeholder:text-slate-500 px-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                  placeholder="Provide a brief overview of the event, its objectives, and key requirements..."
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                ></textarea>
                <p className="mt-2 text-right text-xs text-[#616e89] dark:text-slate-400">Recommended: 200-500 words</p>
              </div>
            </div>
            {/* <!-- Visibility / Type Toggle (Extra logical context) --> */}
            <div className="flex flex-col gap-4 rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#111318] dark:text-white">Private Event</p>
                  <p className="text-xs text-[#616e89] dark:text-slate-400">Only invited staff and vendors can view this event</p>
                </div>
                <button
                  aria-checked={isPrivate}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${isPrivate ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                  role="switch"
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  disabled={loading}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`}
                  ></span>
                </button>
              </div>
            </div>
            {/* <!-- Form Actions --> */}
            <div className="flex items-center justify-end gap-4 border-t border-[#dbdee6] dark:border-slate-800 pt-8">
              <button
                className="rounded-lg px-6 py-3 text-sm font-bold text-[#616e89] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                type="button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
        {/* <!-- Helper card --> */}
        <div className="mt-8 flex items-start gap-4 rounded-xl border border-primary/20 dark:border-primary/40 bg-primary/5 dark:bg-primary/10 p-4">
          <span className="material-symbols-outlined text-primary dark:text-sky-300">info</span>
          <div>
            <p className="text-sm font-semibold text-primary dark:text-sky-300">Pro Tip</p>
            <p className="text-sm text-primary/80 dark:text-primary/70">Once created, you can begin assigning hospitality teams and inventory
              directly from the event dashboard.</p>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Footer Info --> */}
    <footer className="mt-auto py-6 text-center text-sm text-[#616e89] dark:text-slate-400">
      <p>© 2024 EventOS Operations Platform. All rights reserved.</p>
    </footer>
  </div>
  )
}

export default CreateNewEvent