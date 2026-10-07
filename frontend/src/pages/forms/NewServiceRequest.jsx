import React, { useState, useEffect, useRef } from 'react';
import { createServiceRequest, updateServiceRequest, getServiceRequestById } from '../../api/serviceReqApi';
import { getRooms } from '../../api/roomApi';
import { getGuests } from '../../api/guestApi';

// ─── Shared form styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  'h-11 w-full rounded-xl border bg-slate-50 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900';
const INPUT_OK =
  'border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20';
const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200';
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

const REQUEST_TYPES = [
  { value: 'housekeeping', label: 'Housekeeping', icon: 'clean_hands' },
  { value: 'maintenance', label: 'Maintenance', icon: 'build' },
  { value: 'fb', label: 'Food & Beverage', icon: 'restaurant' },
  { value: 'valet', label: 'Valet', icon: 'directions_car' },
  { value: 'other', label: 'Other', icon: 'concierge' },
];

const URGENCIES = [
  { value: 'low', label: 'Low', active: 'border-slate-400 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100' },
  { value: 'medium', label: 'Medium', active: 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300' },
  { value: 'high', label: 'High', active: 'border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-500 dark:bg-orange-500/10 dark:text-orange-300' },
  { value: 'emergency', label: 'Emergency', active: 'border-red-500 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-500/10 dark:text-red-300' },
];

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
  );
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

// Searchable guest dropdown (type a name, phone, group or room)
function GuestPicker({ id, guests, value, onChange, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const selected = guests.find((g) => g._id === value);

  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const s = q.trim().toLowerCase();
  const results = (s
    ? guests.filter((g) =>
        [g.fullName, g.email, g.phoneNumber, g.groupName, g.room?.number].some((v) => v != null && String(v).toLowerCase().includes(s))
      )
    : guests
  ).slice(0, 8);

  const pick = (g) => {
    onChange(g);
    setOpen(false);
    setQ('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">person_search</span>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
        disabled={disabled}
        value={open ? q : selected ? selected.fullName || selected.name : ''}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={loading ? 'Loading guests…' : 'Search by name, phone, group or room'}
        className={`${INPUT_BASE} ${INPUT_OK} pl-10 pr-10`}
      />
      {selected && !disabled && (
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setQ('');
          }}
          aria-label="Clear guest"
          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              {loading ? 'Loading guests…' : 'No guests match'}
            </p>
          ) : (
            results.map((g, i) => (
              <button
                key={g._id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(g)}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition ${
                  i === active ? 'bg-slate-100 dark:bg-slate-800' : ''
                }`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {(g.fullName || g.name || '?').charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900 dark:text-slate-100">{g.fullName || g.name}</span>
                  <span className="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                    {[g.groupName, g.phoneNumber || g.email, g.room?.number && `Room ${g.room.number}`].filter(Boolean).join(' · ') || '—'}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NewServiceRequest({ eventId, memberId, onCancel, onDone }) {
  const isEditing = !!memberId;

  const [formData, setFormData] = useState({
    room: '',
    guest: '',
    requestType: 'housekeeping',
    urgency: 'medium',
    notes: '',
    permissionToEnter: false,
  });

  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [depsLoading, setDepsLoading] = useState(true);
  const [roomAutoFilled, setRoomAutoFilled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(isEditing);
  const [error, setError] = useState(null);

  // Dropdown data (loaded in the background — the form is usable straight away)
  useEffect(() => {
    if (!eventId) return undefined;
    let alive = true;
    (async () => {
      try {
        const [roomsRes, guestsRes] = await Promise.all([
          getRooms({ eventId, limit: 1000 }),
          getGuests({ eventId, limit: 1000 }),
        ]);
        if (!alive) return;
        if (roomsRes.success) setRooms(roomsRes.rooms || []);
        if (guestsRes.success) setGuests(guestsRes.guests || []);
      } catch (err) {
        console.error('Error loading form dependencies', err);
      } finally {
        if (alive) setDepsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [eventId]);

  useEffect(() => {
    if (!memberId) return;
    (async () => {
      try {
        const res = await getServiceRequestById(memberId);
        if (res.success && res.serviceRequest) {
          const req = res.serviceRequest;
          setFormData({
            room: req.room?._id || req.room || '',
            guest: req.guest?._id || req.guest || '',
            requestType: req.requestType || 'housekeeping',
            urgency: req.urgency || 'medium',
            notes: req.notes || '',
            permissionToEnter: req.permissionToEnter || false,
          });
        } else {
          setError(res.message || 'Failed to load request details');
        }
      } catch (err) {
        setError('Network error fetching request');
      } finally {
        setInitialLoad(false);
      }
    })();
  }, [memberId]);

  const set = (patch) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (error) setError(null);
  };

  // Picking a guest who already has a room fills the room in for you
  const pickGuest = (g) => {
    if (!g) {
      set({ guest: '' });
      return;
    }
    const guestRoom = g.room?._id || (typeof g.room === 'string' ? g.room : '');
    if (guestRoom && !formData.room) {
      set({ guest: g._id, room: guestRoom });
      setRoomAutoFilled(true);
    } else {
      set({ guest: g._id });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.requestType) {
      setError('Please select a request type.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData, event: eventId };
      // Clean up empty optional references
      if (!payload.room) delete payload.room;
      if (!payload.guest) delete payload.guest;

      const res = isEditing ? await updateServiceRequest(memberId, payload) : await createServiceRequest(payload);

      if (res.success) {
        if (onDone) onDone(res.serviceRequest);
      } else {
        setError(res.message || 'Operation failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || initialLoad;

  return (
    <div className="mx-auto w-full max-w-3xl pb-6">
      <button
        type="button"
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Service requests
      </button>
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Service</p>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
          {isEditing ? 'Edit service request' : 'New service request'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {isEditing ? 'Update the details of this ticket.' : 'Pick the type, add a note if needed, and submit — guest and room are optional.'}
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

      {initialLoad ? (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="space-y-6 p-5 sm:p-7">
            {/* Request type */}
            <Field label="What does the guest need?" required>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {REQUEST_TYPES.map((t) => {
                  const active = formData.requestType === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set({ requestType: t.value })}
                      disabled={busy}
                      aria-pressed={active}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 text-center transition disabled:opacity-60 ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{t.icon}</span>
                      <span className="text-xs font-bold leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Urgency */}
            <Field label="Priority">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {URGENCIES.map((u) => {
                  const active = formData.urgency === u.value;
                  return (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => set({ urgency: u.value })}
                      disabled={busy}
                      aria-pressed={active}
                      className={`h-10 rounded-xl border text-xs font-bold transition disabled:opacity-60 ${
                        active ? u.active : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {u.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Guest + room */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-2">
              <Field label="Guest" htmlFor="service-guest" optional>
                <GuestPicker id="service-guest" guests={guests} loading={depsLoading} disabled={busy} value={formData.guest} onChange={pickGuest} />
              </Field>

              <Field label="Room" htmlFor="service-room" optional hint={roomAutoFilled ? "Filled from the guest's assigned room." : undefined}>
                <div className="relative">
                  <select
                    id="service-room"
                    value={formData.room}
                    onChange={(e) => {
                      set({ room: e.target.value });
                      setRoomAutoFilled(false);
                    }}
                    disabled={busy}
                    className={`${INPUT_BASE} ${INPUT_OK} cursor-pointer appearance-none px-3.5 pr-10`}
                  >
                    <option value="">{depsLoading ? 'Loading rooms…' : 'No room attached'}</option>
                    {rooms.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.number} ({r.type})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">expand_more</span>
                </div>
              </Field>
            </div>

            {/* Notes */}
            <Field label="Details" htmlFor="service-notes" optional>
              <textarea
                id="service-notes"
                value={formData.notes}
                onChange={(e) => set({ notes: e.target.value })}
                disabled={busy}
                rows="3"
                className={`${INPUT_BASE} ${INPUT_OK} h-auto resize-none px-3.5 py-2.5`}
                placeholder="What exactly does the guest need, or what is the issue?"
              />
            </Field>

            {/* Permission */}
            <label
              htmlFor="permissionToEnter"
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <span className="material-symbols-outlined text-[19px]">key</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Permission to enter</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Guest allows staff into the room without being present</p>
                </div>
              </div>
              <span className="relative inline-flex shrink-0 items-center">
                <input
                  type="checkbox"
                  id="permissionToEnter"
                  name="permissionToEnter"
                  checked={formData.permissionToEnter}
                  onChange={(e) => set({ permissionToEnter: e.target.checked })}
                  disabled={busy}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 dark:bg-slate-600" />
                <span className="pointer-events-none absolute left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>

          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2.5 border-t border-slate-100 bg-slate-50/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button type="button" onClick={onCancel} disabled={busy} className={`${BTN_SECONDARY} sm:mr-auto`}>
              Cancel
            </button>
            <button type="submit" disabled={busy} className={BTN_PRIMARY}>
              {loading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                  Saving…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[19px]">{isEditing ? 'check' : 'send'}</span>
                  {isEditing ? 'Update request' : 'Submit request'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default NewServiceRequest;