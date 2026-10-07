import React, { useState, useEffect, useRef } from 'react';
import { createTransport, updateTransport, getTransportById } from '../../api/transportCoordiAPi';
import { getGuests } from '../../api/guestApi';

// ─── Shared form styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  'h-11 w-full rounded-xl border bg-slate-50 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:[color-scheme:dark]';
const INPUT_OK =
  'border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20';
const INPUT_ERR =
  'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20';
const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200';
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

const pad = (n) => String(n).padStart(2, '0');
// ISO → value for <input type="datetime-local"> in the user's LOCAL time
const toLocalInput = (d) => {
  if (!d) return '';
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return '';
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
};

function Field({ label, htmlFor, required, optional, error, hint, className = '', action, children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
        <span>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
        {action || (optional && <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Optional</span>)}
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

function IconInput({ icon, error, className = '', inputRef, ...props }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">{icon}</span>
      <input ref={inputRef} className={`${INPUT_BASE} pl-10 pr-3.5 ${error ? INPUT_ERR : INPUT_OK} ${className}`} {...props} />
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
        value={open ? q : selected ? selected.fullName : ''}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        placeholder={loading ? 'Loading guests…' : 'Search a guest, or leave empty for a group shuttle'}
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
                  {(g.fullName || '?').charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-900 dark:text-slate-100">{g.fullName}</span>
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

function TransportEntryForm({ eventId, transportId, onDone, onCancel }) {
  const isEditing = !!transportId;

  const [formData, setFormData] = useState({
    guest: '',
    driverName: '',
    vehicleId: '',
    pickupLocation: '',
    dropoffLocation: '',
    scheduledTime: '',
    notes: '',
  });

  const [guests, setGuests] = useState([]);
  const [guestsLoading, setGuestsLoading] = useState(true);
  const [saving, setSaving] = useState(null); // null | 'save' | 'another'
  const [initialLoad, setInitialLoad] = useState(isEditing);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const pickupRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Guests for the picker (loaded in the background — the form is usable straight away)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const guestRes = await getGuests({ eventId, limit: 1000 });
        if (alive && guestRes.success) setGuests(guestRes.guests || []);
      } catch (err) {
        console.error('Guest load error:', err);
      } finally {
        if (alive) setGuestsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [eventId]);

  // Load transport data if editing
  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const transRes = await getTransportById(transportId);
        if (transRes.success) {
          const t = transRes.transport;
          setFormData({
            guest: t.guest?._id || t.guest || '',
            driverName: t.driverName || '',
            vehicleId: t.vehicleId || '',
            pickupLocation: t.pickupLocation || '',
            dropoffLocation: t.dropoffLocation || '',
            scheduledTime: toLocalInput(t.scheduledTime),
            notes: t.notes || '',
          });
        } else {
          setError(transRes.message || 'Failed to load transport');
        }
      } catch (err) {
        console.error('Initial load error:', err);
        setError('Failed to initialize form data');
      } finally {
        setInitialLoad(false);
      }
    })();
  }, [transportId, isEditing]);

  useEffect(() => {
    if (!isEditing) pickupRef.current?.focus();
  }, [isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    if (!formData.dropoffLocation.trim()) newErrors.dropoffLocation = 'Dropoff location is required';
    setErrors(newErrors);
    const first = ['pickupLocation', 'dropoffLocation'].find((k) => newErrors[k]);
    if (first) document.getElementById(`transport-${first}`)?.focus();
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const swapLocations = () =>
    setFormData((prev) => ({ ...prev, pickupLocation: prev.dropoffLocation, dropoffLocation: prev.pickupLocation }));

  const submit = async (addAnother = false) => {
    if (!validateForm()) return;

    setSaving(addAnother ? 'another' : 'save');
    setError(null);

    try {
      const payload = {
        ...formData,
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim(),
        // wall-clock → real instant so the server never guesses a timezone
        scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString() : '',
        event: eventId,
      };
      if (!payload.guest) delete payload.guest; // empty = group shuttle / general

      const res = isEditing ? await updateTransport(transportId, payload) : await createTransport(payload);

      if (res.success) {
        if (addAnother) {
          showToast('Transport scheduled');
          // same route / time / vehicle is the common repeat — only the guest changes
          setFormData((prev) => ({ ...prev, guest: '', notes: '' }));
          setErrors({});
        } else {
          onDone && onDone();
        }
      } else {
        setError(res.message || 'Failed to save transport entry');
      }
    } catch (err) {
      console.error('Error saving transport:', err);
      setError(err.message || 'Failed to save transport entry');
    } finally {
      setSaving(null);
    }
  };

  const busy = !!saving || initialLoad;

  return (
    <div className="mx-auto w-full max-w-3xl pb-6">
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
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Transport log
      </button>
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Transport</p>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
          {isEditing ? 'Edit transport' : 'Schedule transport'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {isEditing ? 'Update the route, timing or driver.' : 'Only the route is required. Driver and vehicle can be assigned later.'}
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
          onSubmit={(e) => {
            e.preventDefault();
            submit(false);
          }}
          noValidate
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
        >
          <div className="space-y-7 p-5 sm:p-7">
            {/* Route */}
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <span className="material-symbols-outlined text-[18px]">route</span>
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Route &amp; time</h3>
                </div>
                <button
                  type="button"
                  onClick={swapLocations}
                  disabled={busy}
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50 dark:text-blue-300 dark:hover:bg-blue-500/10"
                  title="Swap pickup and dropoff"
                >
                  <span className="material-symbols-outlined text-[17px]">swap_vert</span>
                  Swap
                </button>
              </div>

              <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <Field label="Pickup location" htmlFor="transport-pickupLocation" required error={errors.pickupLocation}>
                  <IconInput
                    inputRef={pickupRef}
                    id="transport-pickupLocation"
                    icon="trip_origin"
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    disabled={busy}
                    error={errors.pickupLocation}
                    placeholder="e.g. Airport Terminal 2"
                  />
                </Field>

                <Field label="Dropoff location" htmlFor="transport-dropoffLocation" required error={errors.dropoffLocation}>
                  <IconInput
                    id="transport-dropoffLocation"
                    icon="place"
                    type="text"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    disabled={busy}
                    error={errors.dropoffLocation}
                    placeholder="e.g. Grand Plaza Hotel"
                  />
                </Field>

                <Field label="Scheduled time" htmlFor="transport-scheduledTime" optional className="sm:col-span-2">
                  <input
                    id="transport-scheduledTime"
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    disabled={busy}
                    className={`${INPUT_BASE} ${INPUT_OK} px-3.5 sm:max-w-xs`}
                  />
                </Field>
              </div>
            </section>

            {/* Guest */}
            <section className="border-t border-slate-100 pt-7 dark:border-slate-800">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Guest</h3>
              </div>
              <Field label="Assigned guest" htmlFor="transport-guest" optional hint="Leave empty for a group shuttle or general transfer.">
                <GuestPicker
                  id="transport-guest"
                  guests={guests}
                  loading={guestsLoading}
                  disabled={busy}
                  value={formData.guest}
                  onChange={(g) => setFormData((prev) => ({ ...prev, guest: g ? g._id : '' }))}
                />
              </Field>
            </section>

            {/* Driver & vehicle */}
            <section className="border-t border-slate-100 pt-7 dark:border-slate-800">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                  <span className="material-symbols-outlined text-[18px]">directions_car</span>
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Driver &amp; vehicle</h3>
              </div>
              <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                <Field label="Driver name" htmlFor="transport-driverName" optional>
                  <IconInput
                    id="transport-driverName"
                    icon="badge"
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    disabled={busy}
                    placeholder="e.g. John Doe"
                  />
                </Field>
                <Field label="Vehicle & plate" htmlFor="transport-vehicleId" optional>
                  <IconInput
                    id="transport-vehicleId"
                    icon="airport_shuttle"
                    type="text"
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    disabled={busy}
                    placeholder="e.g. Innova — GJ 12 AB 1234"
                  />
                </Field>
                <Field label="Notes" htmlFor="transport-notes" optional className="sm:col-span-2">
                  <textarea
                    id="transport-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={busy}
                    rows="2"
                    placeholder="Driver instructions, VIP requirements…"
                    className={`${INPUT_BASE} ${INPUT_OK} h-auto resize-none px-3.5 py-2.5`}
                  />
                </Field>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-2.5 border-t border-slate-100 bg-slate-50/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button type="button" onClick={onCancel} disabled={busy} className={`${BTN_SECONDARY} sm:mr-auto`}>
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
                  {isEditing ? 'Save changes' : 'Schedule transport'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TransportEntryForm;