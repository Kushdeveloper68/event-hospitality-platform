import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGuest, getGuestById, updateGuest } from '../../api/guestApi'

// ─── Shared form styles (same system as the rest of the app) ──────────────────
const INPUT_BASE =
  'h-11 w-full rounded-xl border bg-slate-50 px-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:[color-scheme:dark]'
const INPUT_OK =
  'border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20'
const INPUT_ERR =
  'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20'
const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

const TRANSPORT_MODES = ['Private Car Service', 'Commercial Flight', 'Train / Rail', 'Corporate Shuttle', 'Own Transportation']

const EMPTY_FORM = {
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
}

const pad = (n) => String(n).padStart(2, '0')
// ISO → value for <input type="datetime-local"> in the user's LOCAL time
const toLocalInput = (d) => {
  if (!d) return ''
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ''
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`
}
const parseLocalDateTime = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

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

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />
}

function GuestDataEntry({ eventId: propEventId, guestId: propGuestId, onDone, onCancel }) {
  const { eventId: paramEventId } = useParams()
  const eventId = propEventId || paramEventId
  const navigate = useNavigate()
  const isEditing = !!propGuestId

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(null) // null | 'save' | 'another'
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const nameRef = useRef(null)
  const toastTimer = useRef(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // Load the guest when editing
  useEffect(() => {
    if (!propGuestId) return
    setLoading(true)
    setError(null)
    getGuestById(propGuestId)
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
          arrivalDatetime: toLocalInput(g.arrivalDatetime),
          departureDatetime: toLocalInput(g.departureDatetime),
          transportMode: g.transportMode || '',
          specialRequests: g.specialRequests || '',
        })
      })
      .catch((err) => {
        console.error('Error loading guest:', err)
        let msg = 'Failed to load guest'
        if (err.response?.status === 404) msg = 'Guest not found. It may have been deleted.'
        else if (err.response?.status === 401) msg = 'You do not have permission to view this guest.'
        else if (err.response?.status === 500) msg = 'Server error. Please try again later.'
        else if (err.message === 'Network Error') msg = 'Network error. Please check your connection.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [propGuestId])

  // Focus the name field on a fresh form
  useEffect(() => {
    if (!isEditing) nameRef.current?.focus()
  }, [isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        if (name === 'arrivalDatetime' || name === 'departureDatetime') {
          delete next.arrivalDatetime
          delete next.departureDatetime
        }
        return next
      })
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!form.fullName?.trim()) errors.fullName = 'Full name is required'
    if (!form.email?.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email address'
    if (!form.phoneNumber?.trim()) errors.phoneNumber = 'Phone number is required'

    const arrival = parseLocalDateTime(form.arrivalDatetime)
    const departure = parseLocalDateTime(form.departureDatetime)
    if (!form.arrivalDatetime) errors.arrivalDatetime = 'Arrival date is required'
    else if (!arrival) errors.arrivalDatetime = 'Please enter a valid arrival date and time'
    if (form.departureDatetime && !departure) errors.departureDatetime = 'Please enter a valid departure date and time'
    if (arrival && departure && departure <= arrival) {
      errors.arrivalDatetime = 'Arrival must be before departure'
      errors.departureDatetime = 'Departure must be after arrival'
    }

    setValidationErrors(errors)
    const first = ['fullName', 'email', 'phoneNumber', 'arrivalDatetime', 'departureDatetime'].find((k) => errors[k])
    if (first) document.getElementById(`guest-${first}`)?.focus()
    return Object.keys(errors).length === 0
  }

  const submit = async (addAnother = false) => {
    if (!validateForm()) return
    if (!eventId) {
      setError('Event ID is missing. Unable to save guest.')
      return
    }

    setSaving(addAnother ? 'another' : 'save')
    setError(null)
    try {
      // datetime-local values are wall-clock; send real instants so the server never guesses a timezone
      const payload = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        arrivalDatetime: parseLocalDateTime(form.arrivalDatetime).toISOString(),
        departureDatetime: form.departureDatetime ? parseLocalDateTime(form.departureDatetime).toISOString() : '',
        event: eventId,
      }
      const res = isEditing ? await updateGuest(propGuestId, payload) : await createGuest(payload)

      if (res.success === false) {
        setError(res.message || 'Failed to save guest')
        return
      }

      if (addAnother) {
        showToast(`${payload.fullName} added — ready for the next guest`)
        // keep what usually repeats for a group, clear what is personal
        setForm((f) => ({
          ...EMPTY_FORM,
          groupName: f.groupName,
          arrivalDatetime: f.arrivalDatetime,
          departureDatetime: f.departureDatetime,
          transportMode: f.transportMode,
        }))
        setValidationErrors({})
        requestAnimationFrame(() => nameRef.current?.focus())
        return
      }

      if (onDone) onDone(res)
      else navigate(`/events/${eventId}/guests`)
    } catch (err) {
      console.error('Error saving guest:', err)
      let msg = 'Failed to save guest'
      if (err.response?.status === 400) msg = 'Invalid data. Please check all fields and try again.'
      else if (err.response?.status === 401) msg = 'You do not have permission to save guests.'
      else if (err.response?.status === 409) msg = 'A guest with this email already exists.'
      else if (err.response?.status === 500) msg = 'Server error. Please try again later.'
      else if (err.message === 'Network Error') msg = 'Network error. Please check your connection.'
      else if (err.message?.includes('timeout')) msg = 'Request timeout. Please try again.'
      setError(msg)
    } finally {
      setSaving(null)
    }
  }

  const handleCancel = () => {
    if (onCancel) return onCancel()
    navigate(`/events/${eventId}/guests`)
  }

  const busy = !!saving || loading
  const cls = (key) => `${INPUT_BASE} ${validationErrors[key] ? INPUT_ERR : INPUT_OK}`

  return (
    <div className="mx-auto w-full max-w-3xl pb-6">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <button
        type="button"
        onClick={handleCancel}
        className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Guest list
      </button>
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Guests</p>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
          {isEditing ? 'Edit guest' : 'Add guest'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {isEditing ? "Update this guest's details and travel plans." : 'Only the starred fields are required — everything else can be added later.'}
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px]">error</span>
          <p className="flex-1 text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)} aria-label="Dismiss" className="flex shrink-0">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(false)
          }}
          noValidate
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="space-y-8 p-5 sm:p-7">
            {/* Guest details */}
            <section>
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Guest details</h3>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="guest-fullName" required error={validationErrors.fullName} className="sm:col-span-2">
                  <input
                    ref={nameRef}
                    id="guest-fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={busy}
                    autoComplete="off"
                    className={cls('fullName')}
                    placeholder="e.g. Johnathan Doe"
                  />
                </Field>

                <Field label="Email" htmlFor="guest-email" required error={validationErrors.email}>
                  <input
                    id="guest-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={busy}
                    autoComplete="off"
                    className={cls('email')}
                    placeholder="guest@example.com"
                  />
                </Field>

                <Field label="Phone number" htmlFor="guest-phoneNumber" required error={validationErrors.phoneNumber}>
                  <input
                    id="guest-phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    inputMode="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    disabled={busy}
                    autoComplete="off"
                    className={cls('phoneNumber')}
                    placeholder="+91 98765 43210"
                  />
                </Field>

                <Field label="Group / company" htmlFor="guest-groupName" optional>
                  <input
                    id="guest-groupName"
                    name="groupName"
                    type="text"
                    value={form.groupName}
                    onChange={handleChange}
                    disabled={busy}
                    className={cls('groupName')}
                    placeholder="e.g. Acme Corporation"
                  />
                </Field>

                <Field label="Age" htmlFor="guest-age" optional>
                  <input
                    id="guest-age"
                    name="age"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="120"
                    value={form.age}
                    onChange={handleChange}
                    disabled={busy}
                    className={cls('age')}
                    placeholder="25"
                  />
                </Field>
              </div>

              {/* VIP */}
              <label
                htmlFor="guest-vipStatus"
                className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                    <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">VIP guest</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Premium handling and priority attention</p>
                  </div>
                </div>
                <span className="relative inline-flex shrink-0 items-center">
                  <input
                    id="guest-vipStatus"
                    className="peer sr-only"
                    type="checkbox"
                    name="vipStatus"
                    checked={form.vipStatus}
                    onChange={handleChange}
                    disabled={busy}
                  />
                  <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 dark:bg-slate-600" />
                  <span className="pointer-events-none absolute left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </span>
              </label>
            </section>

            {/* Arrival & travel */}
            <section className="border-t border-slate-100 pt-7 dark:border-slate-800">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <span className="material-symbols-outlined text-[18px]">flight_land</span>
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Arrival &amp; travel</h3>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <Field label="Arrival" htmlFor="guest-arrivalDatetime" required error={validationErrors.arrivalDatetime}>
                  <input
                    id="guest-arrivalDatetime"
                    name="arrivalDatetime"
                    type="datetime-local"
                    value={form.arrivalDatetime}
                    onChange={handleChange}
                    disabled={busy}
                    className={cls('arrivalDatetime')}
                  />
                </Field>

                <Field label="Departure" htmlFor="guest-departureDatetime" optional error={validationErrors.departureDatetime}>
                  <input
                    id="guest-departureDatetime"
                    name="departureDatetime"
                    type="datetime-local"
                    value={form.departureDatetime}
                    min={form.arrivalDatetime || undefined}
                    onChange={handleChange}
                    disabled={busy}
                    className={cls('departureDatetime')}
                  />
                </Field>

                <Field label="Transport mode" htmlFor="guest-transportMode" optional className="sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {TRANSPORT_MODES.map((mode) => {
                      const active = form.transportMode === mode
                      return (
                        <button
                          key={mode}
                          type="button"
                          disabled={busy}
                          aria-pressed={active}
                          onClick={() => setForm((f) => ({ ...f, transportMode: active ? '' : mode }))}
                          className={`rounded-full border px-3.5 py-2 text-xs font-bold transition disabled:opacity-60 ${
                            active
                              ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          {mode}
                        </button>
                      )
                    })}
                  </div>
                </Field>

                <Field label="Special requests / notes" htmlFor="guest-specialRequests" optional className="sm:col-span-2">
                  <textarea
                    id="guest-specialRequests"
                    name="specialRequests"
                    value={form.specialRequests}
                    onChange={handleChange}
                    disabled={busy}
                    rows="3"
                    className={`${INPUT_BASE} ${INPUT_OK} h-auto resize-none py-2.5`}
                    placeholder="Dietary restrictions, accessibility needs, preferred floor…"
                  />
                </Field>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2.5 border-t border-slate-100 bg-slate-50/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button type="button" onClick={handleCancel} disabled={busy} className={`${BTN_SECONDARY} sm:mr-auto`}>
              Cancel
            </button>
            {!isEditing && (
              <button type="button" onClick={() => submit(true)} disabled={busy} className={BTN_SECONDARY}>
                {saving === 'another' ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-slate-400/30 border-t-slate-600 dark:border-t-slate-300" />
                ) : (
                  <span className="material-symbols-outlined text-[19px]">playlist_add</span>
                )}
                Save &amp; add another
              </button>
            )}
            <button type="submit" disabled={busy} className={BTN_PRIMARY}>
              {saving === 'save' ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[19px]">check</span>
                  {isEditing ? 'Save changes' : 'Save guest'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default GuestDataEntry