import React, { useState, useEffect, useRef } from 'react'
import { createRoom, updateRoom, getRoomById } from '../../api/roomApi'

// ─── Shared form styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  'h-11 w-full rounded-xl border bg-slate-50 px-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900'
const INPUT_OK =
  'border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20'
const INPUT_ERR =
  'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20'
const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'

const ROOM_TYPES = [
  { value: 'standard', label: 'Standard single', icon: 'single_bed', capacity: 1 },
  { value: 'double', label: 'Double occupancy', icon: 'bed', capacity: 2 },
  { value: 'suite', label: 'Executive suite', icon: 'hotel_class' },
  { value: 'meeting', label: 'Meeting / breakout', icon: 'groups' },
  { value: 'accessible', label: 'ADA accessible', icon: 'accessible' },
]

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

function RoomconfigurationForm({ eventId, roomId, onDone, onCancel }) {
  const isEditing = !!roomId

  const [formData, setFormData] = useState({ number: '', capacity: '', type: '', notes: '' })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(null) // null | 'save' | 'another'
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const numberRef = useRef(null)
  const toastTimer = useRef(null)

  const showToast = (message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  // Load room data if editing
  useEffect(() => {
    if (!roomId) return
    const load = async () => {
      try {
        setLoading(true)
        const res = await getRoomById(roomId)
        if (res.success) {
          setFormData({
            number: res.room.number,
            capacity: res.room.capacity,
            type: res.room.type,
            notes: res.room.notes || '',
          })
        } else {
          setError(res.message || 'Failed to load room data')
        }
      } catch (err) {
        console.error('Error loading room:', err)
        setError('Failed to load room data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [roomId])

  useEffect(() => {
    if (!isEditing) numberRef.current?.focus()
  }, [isEditing])

  const clearError = (name) => errors[name] && setErrors((prev) => ({ ...prev, [name]: null }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    clearError(name)
  }

  const pickType = (t) => {
    setFormData((prev) => ({
      ...prev,
      type: t.value,
      // save a step: single / double rooms have an obvious capacity
      capacity: prev.capacity === '' && t.capacity ? t.capacity : prev.capacity,
    }))
    clearError('type')
  }

  const stepCapacity = (delta) => {
    setFormData((prev) => ({ ...prev, capacity: Math.max(1, (parseInt(prev.capacity) || 0) + delta) }))
    clearError('capacity')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!String(formData.number).trim()) newErrors.number = 'Room number is required'
    if (!formData.capacity || formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1'
    if (!formData.type) newErrors.type = 'Pick a room type'
    setErrors(newErrors)
    const first = ['number', 'capacity'].find((k) => newErrors[k])
    if (first) document.getElementById(`room-${first}`)?.focus()
    return Object.keys(newErrors).length === 0
  }

  const submit = async (addAnother = false) => {
    if (!validateForm()) return

    setSaving(addAnother ? 'another' : 'save')
    setError(null)

    try {
      const roomData = {
        number: String(formData.number).trim(),
        capacity: parseInt(formData.capacity),
        type: formData.type,
        notes: formData.notes,
        event: eventId,
      }

      const res = isEditing ? await updateRoom(roomId, roomData) : await createRoom(roomData)

      if (res.success) {
        if (addAnother) {
          showToast(`Room ${roomData.number} added`)
          // keep type & capacity, bump a numeric room number (101 → 102)
          const n = String(roomData.number)
          setFormData((prev) => ({
            ...prev,
            number: /^\d+$/.test(n) ? String(parseInt(n, 10) + 1) : '',
            notes: '',
          }))
          setErrors({})
          requestAnimationFrame(() => {
            numberRef.current?.focus()
            numberRef.current?.select()
          })
        } else {
          onDone && onDone()
        }
      } else {
        setError(res.message || 'Failed to save room')
      }
    } catch (err) {
      console.error('Error saving room:', err)
      setError(err.message || 'Failed to save room')
    } finally {
      setSaving(null)
    }
  }

  const busy = !!saving || loading

  return (
    <div className="mx-auto w-full max-w-2xl pb-6">
      {toast && (
        <div
          role="status"
          className="fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
        >
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="min-w-0">{toast}</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onCancel && onCancel()}
        className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Room inventory
      </button>
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Rooms</p>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
          {isEditing ? 'Edit room' : 'Add room'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Used for capacity planning and guest check-ins.
          {!isEditing && ' Adding several? Use “Save & add another”.'}
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
          {[...Array(4)].map((_, i) => (
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
          <div className="space-y-5 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Room number / name" htmlFor="room-number" required error={errors.number}>
                <input
                  ref={numberRef}
                  id="room-number"
                  name="number"
                  type="text"
                  value={formData.number}
                  onChange={handleChange}
                  disabled={busy}
                  autoComplete="off"
                  className={`${INPUT_BASE} ${errors.number ? INPUT_ERR : INPUT_OK}`}
                  placeholder="e.g. 101 or Suite A"
                />
              </Field>

              <Field label="Capacity" htmlFor="room-capacity" required error={errors.capacity} hint="Maximum number of occupants.">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => stepCapacity(-1)}
                    disabled={busy}
                    aria-label="Decrease capacity"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-l-xl border border-r-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span className="material-symbols-outlined text-[20px]">remove</span>
                  </button>
                  <input
                    id="room-capacity"
                    name="capacity"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    disabled={busy}
                    className={`${INPUT_BASE} ${errors.capacity ? INPUT_ERR : INPUT_OK} rounded-none text-center`}
                    placeholder="2"
                  />
                  <button
                    type="button"
                    onClick={() => stepCapacity(1)}
                    disabled={busy}
                    aria-label="Increase capacity"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-r-xl border border-l-0 border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </Field>
            </div>

            <Field label="Room category" required error={errors.type}>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {ROOM_TYPES.map((t) => {
                  const active = formData.type === t.value
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => pickType(t)}
                      disabled={busy}
                      aria-pressed={active}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition disabled:opacity-60 ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                      <span className="text-xs font-bold leading-tight">{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field label="Internal notes" htmlFor="room-notes" optional>
              <textarea
                id="room-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                disabled={busy}
                rows="3"
                className={`${INPUT_BASE} ${INPUT_OK} h-auto resize-none py-2.5`}
                placeholder="Amenities, maintenance requirements or restricted access…"
              />
            </Field>
          </div>

          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2.5 border-t border-slate-100 bg-slate-50/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button type="button" onClick={() => onCancel && onCancel()} disabled={busy} className={`${BTN_SECONDARY} sm:mr-auto`}>
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
                  {isEditing ? 'Save changes' : 'Add room'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default RoomconfigurationForm