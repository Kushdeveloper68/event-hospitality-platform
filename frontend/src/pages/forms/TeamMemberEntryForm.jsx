import React, { useState, useEffect, useRef } from 'react';
import { createTeamMember, updateTeamMember, getTeamMemberById } from '../../api/teamMemberApi';

// ─── Shared form styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  'h-11 w-full rounded-xl border bg-slate-50 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900';
const INPUT_OK =
  'border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20';
const INPUT_ERR =
  'border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20';
const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200';
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

const ROLES = [
  'Event Director',
  'Event Lead',
  'Event Coordinator',
  'Logistics',
  'Floor Staff',
  'Technical Support',
  'Guest Relations',
  'Catering Head',
  'Transport Manager',
  'Security Lead',
  'Housekeeping Supervisor',
  'Front Desk',
  'Media/AV Lead',
  'Operations Manager',
  'Photographer',
  'Decor & Setup',
  'Admin',
];
const QUICK_ROLES = ['Event Coordinator', 'Floor Staff', 'Guest Relations', 'Front Desk', 'Logistics', 'Admin'];

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

function TeamMemberEntryForm({ eventId, memberId, onDone, onCancel }) {
  const isEditing = !!memberId;

  const [formData, setFormData] = useState({ name: '', email: '', role: '', status: 'active' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(null); // null | 'save' | 'another'
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(isEditing);
  const [toast, setToast] = useState(null);
  const nameRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const initData = async () => {
      if (!isEditing) return;
      try {
        const res = await getTeamMemberById(memberId);
        if (res.success) {
          const m = res.teamMember;
          setFormData({
            name: m.name || '',
            email: m.email || '',
            role: m.role || '',
            status: m.status || 'active',
          });
        } else {
          setError(res.message || 'Failed to load team member');
        }
      } catch (err) {
        console.error('Initial load error:', err);
        setError('Failed to load team member data');
      } finally {
        setInitialLoad(false);
      }
    };
    initData();
  }, [memberId, isEditing]);

  useEffect(() => {
    if (!isEditing) nameRef.current?.focus();
  }, [isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.role.trim()) newErrors.role = 'Pick or type a role';

    setErrors(newErrors);
    const first = ['name', 'email', 'role'].find((k) => newErrors[k]);
    if (first) document.getElementById(`team-${first}`)?.focus();
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const setRole = (role) => {
    setFormData((prev) => ({ ...prev, role }));
    if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
  };

  const submit = async (addAnother = false) => {
    if (!validateForm()) return;

    setSaving(addAnother ? 'another' : 'save');
    setError(null);

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim(),
        event: eventId,
      };
      const res = isEditing ? await updateTeamMember(memberId, payload) : await createTeamMember(payload);

      if (res.success) {
        if (addAnother) {
          showToast(`${payload.name} added to the team`);
          // keep role + status (people are often added in batches), clear the personal fields
          setFormData((prev) => ({ ...prev, name: '', email: '' }));
          setErrors({});
          requestAnimationFrame(() => nameRef.current?.focus());
        } else {
          onDone && onDone();
        }
      } else {
        setError(res.message || 'Failed to save team member');
      }
    } catch (err) {
      console.error('Error saving team member:', err);
      setError(err.message || 'Error communicating with server');
    } finally {
      setSaving(null);
    }
  };

  const busy = !!saving || initialLoad;

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
        onClick={onCancel}
        className="mb-4 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Team members
      </button>
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Team</p>
        <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
          {isEditing ? 'Edit team member' : 'Add team member'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          {isEditing ? "Update this person's role and availability." : 'Add a staff member to this event and set their role.'}
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
          {[...Array(4)].map((_, i) => (
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
          <div className="space-y-5 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="team-name" required error={errors.name}>
                <IconInput
                  inputRef={nameRef}
                  id="team-name"
                  icon="person"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={busy}
                  autoComplete="off"
                  error={errors.name}
                  placeholder="e.g. Jane Doe"
                />
              </Field>

              <Field label="Email address" htmlFor="team-email" required error={errors.email}>
                <IconInput
                  id="team-email"
                  icon="mail"
                  type="email"
                  inputMode="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={busy}
                  autoComplete="off"
                  error={errors.email}
                  placeholder="name@company.com"
                />
              </Field>
            </div>

            <Field label="Event role" htmlFor="team-role" required error={errors.role} hint="Pick a quick role, search the list, or type your own.">
              <IconInput
                id="team-role"
                icon="badge"
                type="text"
                name="role"
                list="event-role-options"
                value={formData.role}
                onChange={handleChange}
                disabled={busy}
                autoComplete="off"
                error={errors.role}
                placeholder="e.g. Event Coordinator"
              />
              <datalist id="event-role-options">
                {ROLES.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {QUICK_ROLES.map((r) => {
                  const active = formData.role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      disabled={busy}
                      aria-pressed={active}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Status">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  ['active', 'Active', 'On duty', 'bolt'],
                  ['inactive', 'Inactive', 'Off duty', 'bedtime'],
                ].map(([value, label, sub, icon]) => {
                  const active = formData.status === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, status: value }))}
                      disabled={busy}
                      aria-pressed={active}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition disabled:opacity-60 ${
                        active
                          ? value === 'active'
                            ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-500/10'
                            : 'border-slate-400 bg-slate-100 dark:border-slate-500 dark:bg-slate-800'
                          : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          active && value === 'active' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {icon}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">{label}</span>
                        <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">{sub}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
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
                  <span className="material-symbols-outlined text-[19px]">{isEditing ? 'check' : 'person_add'}</span>
                  {isEditing ? 'Save changes' : 'Add member'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TeamMemberEntryForm;