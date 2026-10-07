import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventContext } from "../../context/EventContext";
import {
  getEventSettings,
  updateEventCoreInfo,
  updateEventPreferences,
  generateEventSlug,
  setEventArchive,
  deleteEventPermanently,
} from "../../api/specificEventSettingApi";

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";
const INPUT_BASE =
  "w-full rounded-xl border bg-slate-50 px-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:[color-scheme:dark]";
const INPUT_OK =
  "border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20";
const INPUT_ERR =
  "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20";
const BTN_PRIMARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
const BTN_SECONDARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

const TIMEZONES = [
  ["UTC", "UTC (Coordinated Universal Time)"],
  ["America/New_York", "Eastern Standard Time (EST)"],
  ["America/Chicago", "Central Standard Time (CST)"],
  ["America/Denver", "Mountain Standard Time (MST)"],
  ["America/Los_Angeles", "Pacific Standard Time (PST)"],
  ["Europe/London", "Greenwich Mean Time (GMT)"],
  ["Europe/Paris", "Central European Time (CET)"],
  ["Asia/Kolkata", "India Standard Time (IST)"],
  ["Asia/Dubai", "Gulf Standard Time (GST)"],
  ["Asia/Tokyo", "Japan Standard Time (JST)"],
  ["Australia/Sydney", "Australian Eastern Time (AET)"],
];

const NAV = [
  { key: "general", icon: "info", label: "General info" },
  { key: "permissions", icon: "lock_person", label: "Permissions" },
  { key: "notifications", icon: "notifications_active", label: "Notifications" },
  { key: "danger", icon: "warning", label: "Danger zone" },
];

const PERMISSION_ROWS = [
  { key: "allowPublicRegistration", label: "Allow public registration", desc: "Anyone with the link can register as a guest for this event.", icon: "public" },
  { key: "requireApproval", label: "Require manual approval", desc: "New registrations need admin approval before being confirmed.", icon: "approval" },
  { key: "allowGuestSelfCheckIn", label: "Allow guest self check-in", desc: "Guests can check themselves in via QR code without staff assistance.", icon: "qr_code_scanner" },
  { key: "enableWaitlist", label: "Enable waitlist", desc: "When capacity is reached, new registrants are added to a waitlist.", icon: "format_list_numbered" },
];

const NOTIFY_ROWS = [
  { key: "notifyOnGuestRegistration", label: "Guest registration", desc: "Get an alert whenever a new guest registers for this event.", icon: "person_add" },
  { key: "notifyOnCheckIn", label: "Guest check-in / check-out", desc: "Get notified when a guest checks in or out at the event.", icon: "how_to_reg" },
  { key: "notifyOnServiceRequest", label: "New service requests", desc: "Alert when a guest submits a housekeeping, F&B or valet request.", icon: "room_service" },
  { key: "notifyOnHighPriority", label: "High priority & emergency alerts", desc: "Always notify for critical or emergency service requests.", icon: "priority_high" },
];

// ─── Small UI pieces ──────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-[100] flex flex-col items-stretch gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
            t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : t.type === "warning" ? "bg-amber-600" : "bg-slate-800"
          }`}
        >
          <span className="material-symbols-outlined shrink-0 text-[20px]">
            {t.type === "success" ? "check_circle" : t.type === "error" ? "error" : t.type === "warning" ? "warning" : "info"}
          </span>
          <span className="min-w-0">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Section({ title, subtitle, icon, children, danger = false }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:bg-slate-900 dark:shadow-none ${
        danger ? "border-red-200 dark:border-red-500/30" : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div
        className={`flex items-center gap-3.5 border-b px-5 py-4 sm:px-6 ${
          danger ? "border-red-100 bg-red-50/40 dark:border-red-500/20 dark:bg-red-500/5" : "border-slate-100 dark:border-slate-800"
        }`}
      >
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            danger ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
          }`}
        >
          <span className="material-symbols-outlined text-[21px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className={`text-[15px] font-extrabold tracking-tight ${danger ? "text-red-700 dark:text-red-300" : "text-slate-900 dark:text-slate-100"}`}>
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, required, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
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

function IconInput({ icon, error, className = "", ...props }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">{icon}</span>
      <input className={`h-10 pl-10 ${INPUT_BASE} ${error ? INPUT_ERR : INPUT_OK} ${className}`} {...props} />
    </div>
  );
}

function SwitchRow({ icon, label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/50">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <span className="material-symbols-outlined text-[19px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

// ─── Delete confirmation ──────────────────────────────────────────────────────
function DeleteModal({ eventName, onConfirm, onCancel, loading }) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === eventName?.trim();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !loading && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={() => !loading && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="material-symbols-outlined text-[26px]">warning</span>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Permanently delete event</h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">This action is irreversible.</p>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            <p className="font-bold">This will permanently delete:</p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs">
              <li>All guest records and check-in data</li>
              <li>All room assignments and bookings</li>
              <li>All service requests and transport logs</li>
              <li>All schedule activities and team members</li>
              <li>All activity logs and analytics</li>
            </ul>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
              Type the event name to confirm: <span className="font-mono text-red-600 dark:text-red-400">{eventName}</span>
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type the event name exactly…"
              autoFocus
              className={`h-10 ${INPUT_BASE} ${INPUT_ERR}`}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:justify-end">
          <button onClick={onCancel} disabled={loading} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(typed)}
            disabled={!matches || loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                Delete event
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
function EventAdminstrativeSetting() {
  const { eventId: paramEventId } = useParams();
  const { event: contextEvent, setEvent } = useContext(EventContext) || {};
  const navigate = useNavigate();

  const eventId = paramEventId || contextEvent?._id;

  // ── State ──
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  const [coreForm, setCoreForm] = useState({
    name: "",
    venue: "",
    startDate: "",
    endDate: "",
    description: "",
    isPrivate: false,
  });
  const [coreErrors, setCoreErrors] = useState({});

  const [prefForm, setPrefForm] = useState({
    urlSlug: "",
    timezone: "UTC",
    allowPublicRegistration: false,
    requireApproval: false,
    allowGuestSelfCheckIn: false,
    enableWaitlist: false,
    maxCapacity: 0,
    notifyOnGuestRegistration: true,
    notifyOnCheckIn: true,
    notifyOnServiceRequest: true,
    notifyOnHighPriority: true,
    notificationEmail: "",
    primaryColor: "#2463eb",
    bannerMessage: "",
    isArchived: false,
  });

  // Last-saved snapshots (to detect unsaved changes and to discard without refetching)
  const [savedCore, setSavedCore] = useState(null);
  const [savedPref, setSavedPref] = useState(null);
  const [originalEventName, setOriginalEventName] = useState("");

  const coreDirty = !!savedCore && JSON.stringify(coreForm) !== JSON.stringify(savedCore);
  const prefDirty = !!savedPref && JSON.stringify(prefForm) !== JSON.stringify(savedPref);
  const dirty = coreDirty || prefDirty;

  // ── Toasts ──
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    const t = setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
    timers.current.push(t);
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // ── Fetch ──
  const fetchSettings = useCallback(async () => {
    if (!eventId) {
      setError("No event ID found. Please navigate to an event first.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await getEventSettings(eventId);
      if (!res.success) {
        setError(res.message || "Failed to load settings");
        return;
      }
      const { event, settings } = res;

      const core = {
        name: event.name || "",
        venue: event.venue || "",
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 10) : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 10) : "",
        description: event.description || "",
        isPrivate: !!event.isPrivate,
      };
      const pref = {
        urlSlug: settings.urlSlug || "",
        timezone: settings.timezone || "UTC",
        allowPublicRegistration: !!settings.allowPublicRegistration,
        requireApproval: !!settings.requireApproval,
        allowGuestSelfCheckIn: !!settings.allowGuestSelfCheckIn,
        enableWaitlist: !!settings.enableWaitlist,
        maxCapacity: settings.maxCapacity ?? 0,
        notifyOnGuestRegistration: settings.notifyOnGuestRegistration !== false,
        notifyOnCheckIn: settings.notifyOnCheckIn !== false,
        notifyOnServiceRequest: settings.notifyOnServiceRequest !== false,
        notifyOnHighPriority: settings.notifyOnHighPriority !== false,
        notificationEmail: settings.notificationEmail || "",
        primaryColor: settings.primaryColor || "#2463eb",
        bannerMessage: settings.bannerMessage || "",
        isArchived: !!settings.isArchived,
      };
      setCoreForm(core);
      setSavedCore(core);
      setPrefForm(pref);
      setSavedPref(pref);
      setOriginalEventName(core.name);
      setCoreErrors({});
    } catch (err) {
      setError("Failed to load settings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Warn before leaving the browser tab with unsaved changes
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // ── Validation ──
  const validateCore = () => {
    const errors = {};
    if (!coreForm.name.trim()) errors.name = "Event name is required";
    if (coreForm.startDate && coreForm.endDate && new Date(coreForm.startDate) > new Date(coreForm.endDate)) {
      errors.endDate = "End date must be after start date";
    }
    setCoreErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Save everything that changed (General tab fields live in both core + preferences) ──
  const handleSave = async () => {
    if (coreDirty && !validateCore()) {
      setActiveTab("general");
      addToast("Please fix the validation errors", "warning");
      return;
    }
    setSaving(true);
    let coreOk = true;
    let prefOk = true;
    try {
      if (coreDirty) {
        const res = await updateEventCoreInfo(eventId, coreForm);
        if (res.success) {
          setSavedCore(coreForm);
          setOriginalEventName(coreForm.name);
          if (typeof setEvent === "function") setEvent((prev) => (prev ? { ...prev, ...coreForm } : prev));
        } else {
          coreOk = false;
          addToast(res.message || "Failed to save event information", "error");
        }
      }
      if (coreOk && prefDirty) {
        const res = await updateEventPreferences(eventId, prefForm);
        if (res.success) {
          const merged = { ...prefForm, ...(res.settings || {}) };
          setPrefForm(merged);
          setSavedPref(merged);
        } else {
          prefOk = false;
          addToast(res.message || "Failed to save preferences", "error");
        }
      }
      if (coreOk && prefOk) addToast("Settings saved successfully", "success");
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (savedCore) setCoreForm(savedCore);
    if (savedPref) setPrefForm(savedPref);
    setCoreErrors({});
  };

  // ── Slug ──
  const handleGenerateSlug = async () => {
    try {
      const res = await generateEventSlug(eventId, coreForm.name);
      if (res.success) {
        setPrefForm((prev) => ({ ...prev, urlSlug: res.slug }));
        addToast(`Slug generated: ${res.slug}`, "info");
      } else {
        addToast(res.message || "Failed to generate slug", "error");
      }
    } catch {
      addToast("Failed to generate slug", "error");
    }
  };

  // ── Archive ──
  const handleArchiveToggle = async () => {
    const newVal = !prefForm.isArchived;
    setArchiving(true);
    try {
      const res = await setEventArchive(eventId, newVal);
      if (res.success) {
        setPrefForm((prev) => ({ ...prev, isArchived: newVal }));
        setSavedPref((prev) => (prev ? { ...prev, isArchived: newVal } : prev));
        addToast(newVal ? "Event archived successfully" : "Event unarchived successfully", "success");
      } else {
        addToast(res.message || "Failed to update archive status", "error");
      }
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setArchiving(false);
    }
  };

  // ── Delete ──
  const handleDeleteConfirm = async (typedName) => {
    setDeletingEvent(true);
    try {
      const res = await deleteEventPermanently(eventId, typedName);
      if (res.success) {
        addToast("Event permanently deleted", "success");
        setShowDeleteModal(false);
        const t = setTimeout(() => navigate("/events"), 1500);
        timers.current.push(t);
      } else {
        addToast(res.message || "Failed to delete event", "error");
      }
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setDeletingEvent(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="hidden w-60 shrink-0 space-y-2 lg:block">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className={`min-w-0 flex-1 space-y-4 p-6 ${CARD}`}>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span className="material-symbols-outlined text-[25px]">error</span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Failed to load settings</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
        <button onClick={fetchSettings} className={`${BTN_PRIMARY} mt-6`}>
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  const setCore = (key, val) => {
    setCoreForm((p) => ({ ...p, [key]: val }));
    if (coreErrors[key]) setCoreErrors((p) => ({ ...p, [key]: null }));
  };
  const setPref = (key, val) => setPrefForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="space-y-5 pb-4">
      <Toast toasts={toasts} />

      {showDeleteModal && (
        <DeleteModal
          eventName={originalEventName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          loading={deletingEvent}
        />
      )}

      {/* Header */}
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Settings</p>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            Administrative settings
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              prefForm.isArchived
                ? "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
            }`}
          >
            <span className={`size-1.5 rounded-full ${prefForm.isArchived ? "bg-slate-400" : "bg-emerald-500"}`} />
            {prefForm.isArchived ? "Archived" : "Active"}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Manage core event details, access controls and notification preferences.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        {/* Side nav (desktop) */}
        <aside className="hidden w-60 shrink-0 lg:sticky lg:top-20 lg:block">
          <nav className="flex flex-col gap-1" aria-label="Settings sections">
            {NAV.map((n) => {
              const active = activeTab === n.key;
              const isDanger = n.key === "danger";
              return (
                <button
                  key={n.key}
                  type="button"
                  onClick={() => setActiveTab(n.key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition ${
                    active
                      ? isDanger
                        ? "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                      : isDanger
                        ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{n.icon}</span>
                  {n.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Pills (mobile / tablet) */}
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden" aria-label="Settings sections">
          {NAV.map((n) => {
            const active = activeTab === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setActiveTab(n.key)}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                {n.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="min-w-0 max-w-3xl flex-1 space-y-5">
          {/* ══════ GENERAL ══════ */}
          {activeTab === "general" && (
            <Section title="Core details" icon="info" subtitle="Basic event information visible to all staff">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                <Field label="Event name" htmlFor="ev-name" required error={coreErrors.name} className="md:col-span-2">
                  <input
                    id="ev-name"
                    type="text"
                    value={coreForm.name}
                    onChange={(e) => setCore("name", e.target.value)}
                    className={`h-10 ${INPUT_BASE} ${coreErrors.name ? INPUT_ERR : INPUT_OK}`}
                    placeholder="e.g. Annual Tech Summit 2025"
                  />
                </Field>

                <Field label="URL slug" htmlFor="ev-slug" className="md:col-span-2" hint="Used to build this event's shareable link.">
                  <div className="flex gap-2">
                    <div className="flex h-10 min-w-0 flex-1 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:focus-within:border-blue-500/60 dark:focus-within:bg-slate-900 dark:focus-within:ring-blue-500/20">
                      <span className="inline-flex shrink-0 items-center border-r border-slate-200 bg-slate-100 px-3.5 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        /e/
                      </span>
                      <input
                        id="ev-slug"
                        type="text"
                        value={prefForm.urlSlug}
                        onChange={(e) => setPref("urlSlug", e.target.value)}
                        className="min-w-0 flex-1 bg-transparent px-3.5 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                        placeholder="my-event-2025"
                      />
                    </div>
                    <button type="button" onClick={handleGenerateSlug} title="Auto-generate from event name" className={`${BTN_SECONDARY} shrink-0 px-3.5`}>
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      <span className="hidden sm:inline">Generate</span>
                    </button>
                  </div>
                </Field>

                <Field label="Venue / location" htmlFor="ev-venue" className="md:col-span-2">
                  <IconInput
                    id="ev-venue"
                    icon="location_pin"
                    type="text"
                    value={coreForm.venue}
                    onChange={(e) => setCore("venue", e.target.value)}
                    placeholder="e.g. Grand Plaza Hotel, New York"
                  />
                </Field>

                <Field label="Start date" htmlFor="ev-start">
                  <IconInput id="ev-start" icon="calendar_today" type="date" value={coreForm.startDate} onChange={(e) => setCore("startDate", e.target.value)} />
                </Field>

                <Field label="End date" htmlFor="ev-end" error={coreErrors.endDate}>
                  <IconInput
                    id="ev-end"
                    icon="event_upcoming"
                    type="date"
                    value={coreForm.endDate}
                    error={coreErrors.endDate}
                    onChange={(e) => setCore("endDate", e.target.value)}
                  />
                </Field>

                <Field label="Timezone" htmlFor="ev-tz" className="md:col-span-2">
                  <div className="relative">
                    <select
                      id="ev-tz"
                      value={prefForm.timezone}
                      onChange={(e) => setPref("timezone", e.target.value)}
                      className={`h-10 cursor-pointer appearance-none pr-10 ${INPUT_BASE} ${INPUT_OK}`}
                    >
                      {TIMEZONES.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">expand_more</span>
                  </div>
                </Field>

                <Field label="Description" htmlFor="ev-desc" className="md:col-span-2">
                  <textarea
                    id="ev-desc"
                    value={coreForm.description}
                    onChange={(e) => setCore("description", e.target.value)}
                    rows={4}
                    className={`resize-none py-2.5 ${INPUT_BASE} ${INPUT_OK}`}
                    placeholder="Describe the event objectives, key agenda and audience…"
                  />
                  <p className="mt-1 text-right text-[11px] font-medium text-slate-400 dark:text-slate-500">{coreForm.description.length} characters</p>
                </Field>

                <Field label="Banner / announcement message" htmlFor="ev-banner" className="md:col-span-2" hint="Optional message displayed at the top of the event page.">
                  <input
                    id="ev-banner"
                    type="text"
                    value={prefForm.bannerMessage}
                    onChange={(e) => setPref("bannerMessage", e.target.value)}
                    className={`h-10 ${INPUT_BASE} ${INPUT_OK}`}
                    placeholder="e.g. Doors open at 8:30 AM"
                    maxLength={200}
                  />
                </Field>
              </div>

              <div className="mt-6">
                <SwitchRow
                  icon="lock"
                  label="Private event"
                  desc="Only invited staff and vendors can view this event."
                  checked={coreForm.isPrivate}
                  onChange={(val) => setCore("isPrivate", val)}
                />
              </div>
            </Section>
          )}

          {/* ══════ PERMISSIONS ══════ */}
          {activeTab === "permissions" && (
            <>
              <Section title="Access & registration" icon="lock_person" subtitle="Control who can access and register for this event">
                <div className="space-y-3">
                  {PERMISSION_ROWS.map(({ key, label, desc, icon }) => (
                    <SwitchRow key={key} icon={icon} label={label} desc={desc} checked={prefForm[key]} onChange={(val) => setPref(key, val)} />
                  ))}
                </div>
              </Section>

              <Section title="Capacity management" icon="groups" subtitle="Set guest limits for this event">
                <Field
                  label="Maximum guest capacity"
                  htmlFor="ev-cap"
                  hint={prefForm.maxCapacity > 0 ? `Currently limited to ${prefForm.maxCapacity} guests.` : "Set to 0 for unlimited capacity. No limit is currently set."}
                >
                  <IconInput
                    id="ev-cap"
                    icon="groups"
                    type="number"
                    min={0}
                    value={prefForm.maxCapacity}
                    onChange={(e) => setPref("maxCapacity", Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0 = unlimited"
                  />
                </Field>
              </Section>
            </>
          )}

          {/* ══════ NOTIFICATIONS ══════ */}
          {activeTab === "notifications" && (
            <>
              <Section title="Alert preferences" icon="notifications_active" subtitle="Choose which events trigger admin notifications">
                <div className="space-y-3">
                  {NOTIFY_ROWS.map(({ key, label, desc, icon }) => (
                    <SwitchRow key={key} icon={icon} label={label} desc={desc} checked={prefForm[key]} onChange={(val) => setPref(key, val)} />
                  ))}
                </div>
              </Section>

              <Section title="Notification destination" icon="mail" subtitle="Where should notification emails be sent?">
                <Field label="Notification email address" htmlFor="ev-notify-email" hint="Leave blank to use your account's default email address.">
                  <IconInput
                    id="ev-notify-email"
                    icon="mail"
                    type="email"
                    value={prefForm.notificationEmail}
                    onChange={(e) => setPref("notificationEmail", e.target.value)}
                    placeholder="ops-team@company.com"
                  />
                </Field>
              </Section>
            </>
          )}

          {/* ══════ DANGER ══════ */}
          {activeTab === "danger" && (
            <>
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[20px]">info</span>
                <div>
                  <p className="text-sm font-bold">Actions in this section are permanent.</p>
                  <p className="mt-0.5 text-xs leading-5 opacity-90">
                    Archiving hides the event from active dashboards but preserves data. Deletion removes everything and cannot be undone.
                  </p>
                </div>
              </div>

              <Section title="Archive event" icon="inventory_2" subtitle="Hide this event from active dashboards while preserving all data">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                      Archiving marks the event as finished. Reports and guest data are kept for compliance and analytics, but the event won't appear in active operations views.
                    </p>
                    {prefForm.isArchived && (
                      <p className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                        <span className="material-symbols-outlined text-[15px]">warning</span>
                        This event is currently archived.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleArchiveToggle}
                    disabled={archiving}
                    className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition disabled:opacity-60 ${
                      prefForm.isArchived ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {archiving ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">{prefForm.isArchived ? "unarchive" : "inventory_2"}</span>
                    )}
                    {prefForm.isArchived ? "Unarchive event" : "Archive event"}
                  </button>
                </div>
              </Section>

              <Section title="Delete event" icon="delete_forever" subtitle="Permanently remove this event and all associated data" danger>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                      Once deleted, all guest records, room assignments, service requests, transport logs, schedules and team data tied to this event are permanently erased.
                    </p>
                    <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-400">This action is irreversible and cannot be undone.</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                    Delete event
                  </button>
                </div>
              </Section>
            </>
          )}

          {/* Unsaved-changes bar */}
          {dirty && (
            <div className="sticky bottom-4 z-30 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.15)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/40 sm:flex-row sm:items-center sm:justify-between sm:pl-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <span className="size-2 rounded-full bg-amber-500" />
                You have unsaved changes
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <button onClick={handleDiscard} disabled={saving} className={BTN_SECONDARY}>
                  Discard
                </button>
                <button onClick={handleSave} disabled={saving} className={BTN_PRIMARY}>
                  {saving ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventAdminstrativeSetting;