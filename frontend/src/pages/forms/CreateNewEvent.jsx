import React, { useState, useRef, useEffect } from 'react'
import { createEvent } from '../../api/eventApi'
import { useNavigate, Link } from 'react-router-dom'

// ─── Shared form styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  'h-11 w-full rounded-xl border bg-slate-50 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:[color-scheme:dark]'
const INPUT_OK =
  'border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20'
const INPUT_ERR =
  'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20'
const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

function Field({ label, htmlFor, required, optional, error, hint, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
        {optional && <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Optional</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  )
}

function IconInput({ icon, error, className = '', inputRef, ...props }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">{icon}</span>
      <input ref={inputRef} className={`${INPUT_BASE} pl-10 pr-3.5 ${error ? INPUT_ERR : INPUT_OK} ${className}`} {...props} />
    </div>
  )
}

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
  const [fieldErrors, setFieldErrors] = useState({})
  const nameRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const handleStartChange = (value) => {
    setStartDate(value)
    // one less click: a missing or earlier end date follows the start date
    if (value && (!endDate || new Date(endDate) < new Date(value))) setEndDate(value)
    if (fieldErrors.endDate) setFieldErrors((p) => ({ ...p, endDate: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const errs = {}
    if (!eventName.trim()) errs.eventName = 'Event name is required'
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errs.endDate = 'End date must be on or after the start date'
    }
    setFieldErrors(errs)
    if (errs.eventName) {
      nameRef.current?.focus()
      return
    }
    if (errs.endDate) {
      document.getElementById('event-endDate')?.focus()
      return
    }

    setLoading(true)

    try {
      const eventData = {
        name: eventName.trim(),
        venue: venue || '',
        startDate: startDate || null,
        endDate: endDate || null,
        description: description || '',
        isPrivate,
      }

      const response = await createEvent(eventData)

      if (response.success) {
        setSuccess('Event created — opening it now…')
        const newEventId = response.event?._id
        navigate(newEventId ? `/events/${newEventId}/overview` : '/events')
        return
      }
      setError(response.message || 'Failed to create event')
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
    <div className="min-h-screen w-full bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
        <Link
          to="/events"
          className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          All events
        </Link>

        <div className="mb-6">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">New event</p>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
            Create event
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Just a name is enough to start — you can fill in the rest later from the event settings.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px]">error</span>
            <p className="flex-1 text-sm font-medium">{error}</p>
            <button onClick={() => setError('')} aria-label="Dismiss" className="flex shrink-0">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="material-symbols-outlined shrink-0 text-[20px]">check_circle</span>
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="space-y-5 p-5 sm:p-7">
            <Field label="Event name" htmlFor="event-name" required error={fieldErrors.eventName}>
              <input
                ref={nameRef}
                id="event-name"
                type="text"
                value={eventName}
                onChange={(e) => {
                  setEventName(e.target.value)
                  if (fieldErrors.eventName) setFieldErrors((p) => ({ ...p, eventName: null }))
                }}
                disabled={loading}
                autoComplete="off"
                className={`${INPUT_BASE} px-3.5 ${fieldErrors.eventName ? INPUT_ERR : INPUT_OK}`}
                placeholder="e.g. Annual Tech Symposium 2026"
              />
            </Field>

            <Field label="Venue / location" htmlFor="event-venue" optional>
              <IconInput
                id="event-venue"
                icon="location_pin"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                disabled={loading}
                placeholder="Venue name or address"
              />
            </Field>

            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Start date" htmlFor="event-startDate" optional>
                <IconInput
                  id="event-startDate"
                  icon="calendar_today"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartChange(e.target.value)}
                  disabled={loading}
                />
              </Field>
              <Field label="End date" htmlFor="event-endDate" optional error={fieldErrors.endDate}>
                <IconInput
                  id="event-endDate"
                  icon="event_upcoming"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    if (fieldErrors.endDate) setFieldErrors((p) => ({ ...p, endDate: null }))
                  }}
                  disabled={loading}
                  error={fieldErrors.endDate}
                />
              </Field>
            </div>

            <Field label="Description" htmlFor="event-description" optional>
              <textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows="4"
                className={`${INPUT_BASE} ${INPUT_OK} h-auto resize-none px-3.5 py-2.5`}
                placeholder="A short overview of the event, its objectives and key requirements…"
              />
            </Field>

            {/* Private toggle */}
            <label
              htmlFor="event-private"
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Private event</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Only invited staff and vendors can view this event</p>
                </div>
              </div>
              <span className="relative inline-flex shrink-0 items-center">
                <input
                  id="event-private"
                  type="checkbox"
                  role="switch"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  disabled={loading}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 dark:bg-slate-600" />
                <span className="pointer-events-none absolute left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <p className="hidden items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 sm:flex">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Rooms, guests and team are added inside the event.
            </p>
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
              <button type="button" onClick={handleCancel} disabled={loading} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={BTN_PRIMARY}>
                {loading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                    Creating…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[19px]">add_circle</span>
                    Create event
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateNewEvent