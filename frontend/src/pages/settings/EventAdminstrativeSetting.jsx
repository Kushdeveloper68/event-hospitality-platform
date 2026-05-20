import React, { useState, useEffect, useContext, useCallback } from "react";
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

// ─── Toast Component ────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold transition-all duration-300 ${
            t.type === "success"
              ? "bg-emerald-600"
              : t.type === "error"
              ? "bg-red-600"
              : t.type === "warning"
              ? "bg-amber-500"
              : "bg-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-lg shrink-0">
            {t.type === "success"
              ? "check_circle"
              : t.type === "error"
              ? "error"
              : t.type === "warning"
              ? "warning"
              : "info"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────
function Section({ title, subtitle, icon, children, danger = false }) {
  return (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${
        danger
          ? "border-red-200 dark:border-red-900/40"
          : "border-slate-200 dark:border-slate-800"
      } bg-white dark:bg-slate-900`}
    >
      <div
        className={`px-6 py-5 border-b ${
          danger
            ? "border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10"
            : "border-slate-100 dark:border-slate-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`material-symbols-outlined text-xl ${
              danger ? "text-red-500" : "text-primary"
            }`}
          >
            {icon}
          </span>
          <div>
            <h3
              className={`font-bold ${
                danger
                  ? "text-red-700 dark:text-red-400"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ eventName, onConfirm, onCancel, loading }) {
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === eventName?.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
            <span className="material-symbols-outlined text-red-600 text-2xl">
              warning
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Permanently Delete Event
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              This action is irreversible.
            </p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30 text-sm text-red-700 dark:text-red-400 space-y-1">
            <p className="font-bold">This will permanently delete:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>All guest records and check-in data</li>
              <li>All room assignments and bookings</li>
              <li>All service requests and transport logs</li>
              <li>All schedule activities and team members</li>
              <li>All activity logs and analytics</li>
            </ul>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Type the event name to confirm:{" "}
              <span className="text-red-600 font-mono">{eventName}</span>
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type event name exactly..."
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(typed)}
            disabled={!matches || loading}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">
                  hourglass_top
                </span>
                Deleting…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  delete_forever
                </span>
                Delete Event
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Field Input ──────────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function EventAdminstrativeSetting() {
  const { eventId: paramEventId } = useParams();
  const { event: contextEvent } = useContext(EventContext) || {};
  const navigate = useNavigate();

  const eventId = paramEventId || contextEvent?._id;

  // ── State ──
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Core event info
  const [coreForm, setCoreForm] = useState({
    name: "",
    venue: "",
    startDate: "",
    endDate: "",
    description: "",
    isPrivate: false,
  });
  const [coreErrors, setCoreErrors] = useState({});

  // Settings / preferences
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

  const [originalEventName, setOriginalEventName] = useState("");

  // ── Toast helpers ──
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  // ── Fetch data ──
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

      setCoreForm({
        name: event.name || "",
        venue: event.venue || "",
        startDate: event.startDate
          ? new Date(event.startDate).toISOString().slice(0, 10)
          : "",
        endDate: event.endDate
          ? new Date(event.endDate).toISOString().slice(0, 10)
          : "",
        description: event.description || "",
        isPrivate: !!event.isPrivate,
      });
      setOriginalEventName(event.name || "");

      setPrefForm({
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
      });
    } catch (err) {
      setError("Failed to load settings. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ── Core form validation ──
  const validateCore = () => {
    const errors = {};
    if (!coreForm.name.trim()) errors.name = "Event name is required";
    if (
      coreForm.startDate &&
      coreForm.endDate &&
      new Date(coreForm.startDate) > new Date(coreForm.endDate)
    ) {
      errors.endDate = "End date must be after start date";
    }
    setCoreErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Save core info ──
  const handleSaveCoreInfo = async () => {
    if (!validateCore()) {
      addToast("Please fix the validation errors", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await updateEventCoreInfo(eventId, coreForm);
      if (res.success) {
        setOriginalEventName(coreForm.name);
        addToast("Event information saved successfully", "success");
      } else {
        addToast(res.message || "Failed to save event information", "error");
      }
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Save preferences ──
  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const res = await updateEventPreferences(eventId, prefForm);
      if (res.success) {
        addToast("Preferences saved successfully", "success");
        setPrefForm((prev) => ({ ...prev, ...res.settings }));
      } else {
        addToast(res.message || "Failed to save preferences", "error");
      }
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Generate slug ──
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

  // ── Archive toggle ──
  const handleArchiveToggle = async () => {
    const newVal = !prefForm.isArchived;
    setSaving(true);
    try {
      const res = await setEventArchive(eventId, newVal);
      if (res.success) {
        setPrefForm((prev) => ({ ...prev, isArchived: newVal }));
        addToast(
          newVal ? "Event archived successfully" : "Event unarchived successfully",
          "success"
        );
      } else {
        addToast(res.message || "Failed to update archive status", "error");
      }
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete event ──
  const handleDeleteConfirm = async (typedName) => {
    setDeletingEvent(true);
    try {
      const res = await deleteEventPermanently(eventId, typedName);
      if (res.success) {
        addToast("Event permanently deleted", "success");
        setShowDeleteModal(false);
        setTimeout(() => navigate("/events"), 1500);
      } else {
        addToast(res.message || "Failed to delete event", "error");
      }
    } catch {
      addToast("An unexpected error occurred", "error");
    } finally {
      setDeletingEvent(false);
    }
  };

  const tabs = [
    { key: "general", icon: "info", label: "General Info" },
    { key: "permissions", icon: "lock_person", label: "Permissions" },
    { key: "notifications", icon: "notifications_active", label: "Notifications" },
    { key: "danger", icon: "warning", label: "Danger Zone" },
  ];

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-500 font-medium">Loading settings…</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-3 block">
            error
          </span>
          <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">
            Failed to load settings
          </h3>
          <p className="text-red-700 dark:text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={fetchSettings}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed";
  const errorInputClass = "border-red-400 dark:border-red-500 focus:ring-red-500/20 focus:border-red-500";

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Toast toasts={toasts} />

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <DeleteModal
          eventName={originalEventName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          loading={deletingEvent}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span className="hover:text-primary cursor-pointer" onClick={() => navigate("/events")}>
              Events
            </span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-300 font-medium line-clamp-1">
              {coreForm.name || "Event"}
            </span>
          </nav>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Administrative Settings
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                prefForm.isArchived
                  ? "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                  : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
              }`}
            >
              {prefForm.isArchived ? "ARCHIVED" : "ACTIVE"}
            </span>
          </div>
          <p className="mt-1 text-slate-500 text-sm">
            Manage core event details, access controls and notification preferences.
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Tab navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6 overflow-x-auto">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 flex items-center gap-2 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? tab.key === "danger"
                      ? "border-red-500 text-red-600 dark:text-red-400"
                      : "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6 md:p-8">

          {/* ══════════════════════════════ GENERAL INFO ══════════════════════════════ */}
          {activeTab === "general" && (
            <div className="space-y-8 max-w-3xl">
              {/* Core Details */}
              <Section title="Core Details" icon="info" subtitle="Basic event information visible to all staff">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Field label="Event Name" required error={coreErrors.name}>
                      <input
                        type="text"
                        value={coreForm.name}
                        onChange={(e) => {
                          setCoreForm((p) => ({ ...p, name: e.target.value }));
                          if (coreErrors.name) setCoreErrors((p) => ({ ...p, name: null }));
                        }}
                        className={`${inputClass} ${coreErrors.name ? errorInputClass : ""}`}
                        placeholder="e.g. Annual Tech Summit 2025"
                      />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="URL Slug">
                      <div className="flex gap-2">
                        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex-1">
                          <span className="inline-flex items-center px-3 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm border-r border-slate-200 dark:border-slate-700 shrink-0">
                            events.io/
                          </span>
                          <input
                            type="text"
                            value={prefForm.urlSlug}
                            onChange={(e) =>
                              setPrefForm((p) => ({ ...p, urlSlug: e.target.value }))
                            }
                            className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                            placeholder="my-event-2025"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleGenerateSlug}
                          title="Auto-generate from event name"
                          className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors text-sm font-medium flex items-center gap-1.5 shrink-0"
                        >
                          <span className="material-symbols-outlined text-base">auto_awesome</span>
                          Generate
                        </button>
                      </div>
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Venue / Location">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                          location_pin
                        </span>
                        <input
                          type="text"
                          value={coreForm.venue}
                          onChange={(e) => setCoreForm((p) => ({ ...p, venue: e.target.value }))}
                          className={`${inputClass} pl-10`}
                          placeholder="e.g. Grand Plaza Hotel, New York"
                        />
                      </div>
                    </Field>
                  </div>

                  <Field label="Start Date" error={coreErrors.startDate}>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                        calendar_today
                      </span>
                      <input
                        type="date"
                        value={coreForm.startDate}
                        onChange={(e) => {
                          setCoreForm((p) => ({ ...p, startDate: e.target.value }));
                          if (coreErrors.startDate) setCoreErrors((p) => ({ ...p, startDate: null }));
                        }}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <Field label="End Date" error={coreErrors.endDate}>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                        event_upcoming
                      </span>
                      <input
                        type="date"
                        value={coreForm.endDate}
                        onChange={(e) => {
                          setCoreForm((p) => ({ ...p, endDate: e.target.value }));
                          if (coreErrors.endDate) setCoreErrors((p) => ({ ...p, endDate: null }));
                        }}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Timezone">
                      <select
                        value={prefForm.timezone}
                        onChange={(e) => setPrefForm((p) => ({ ...p, timezone: e.target.value }))}
                        className={inputClass}
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York">Eastern Standard Time (EST)</option>
                        <option value="America/Chicago">Central Standard Time (CST)</option>
                        <option value="America/Denver">Mountain Standard Time (MST)</option>
                        <option value="America/Los_Angeles">Pacific Standard Time (PST)</option>
                        <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                        <option value="Europe/Paris">Central European Time (CET)</option>
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                        <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                        <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
                      </select>
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea
                        value={coreForm.description}
                        onChange={(e) => setCoreForm((p) => ({ ...p, description: e.target.value }))}
                        rows={4}
                        className={`${inputClass} resize-none`}
                        placeholder="Describe the event objectives, key agenda, and audience…"
                      />
                      <p className="text-xs text-slate-400 text-right mt-1">
                        {coreForm.description.length} characters
                      </p>
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Banner / Announcement Message">
                      <input
                        type="text"
                        value={prefForm.bannerMessage}
                        onChange={(e) => setPrefForm((p) => ({ ...p, bannerMessage: e.target.value }))}
                        className={inputClass}
                        placeholder="Optional message displayed at the top of the event page"
                        maxLength={200}
                      />
                    </Field>
                  </div>
                </div>

                {/* Privacy toggle */}
                <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Private Event</p>
                      <p className="text-xs text-slate-500">
                        Only invited staff and vendors can view this event
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={coreForm.isPrivate}
                    onChange={(val) => setCoreForm((p) => ({ ...p, isPrivate: val }))}
                  />
                </div>
              </Section>

              {/* Save button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={fetchSettings}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSaveCoreInfo}
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">
                        hourglass_top
                      </span>
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════ PERMISSIONS ══════════════════════════════ */}
          {activeTab === "permissions" && (
            <div className="space-y-8 max-w-3xl">
              <Section
                title="Access & Registration"
                icon="lock_person"
                subtitle="Control who can access and register for this event"
              >
                <div className="space-y-4">
                  {[
                    {
                      key: "allowPublicRegistration",
                      label: "Allow Public Registration",
                      desc: "Anyone with the link can register as a guest for this event",
                      icon: "public",
                    },
                    {
                      key: "requireApproval",
                      label: "Require Manual Approval",
                      desc: "New registrations require admin approval before being confirmed",
                      icon: "approval",
                    },
                    {
                      key: "allowGuestSelfCheckIn",
                      label: "Allow Guest Self Check-in",
                      desc: "Guests can check themselves in via QR code without staff assistance",
                      icon: "qr_code_scanner",
                    },
                    {
                      key: "enableWaitlist",
                      label: "Enable Waitlist",
                      desc: "When capacity is reached, new registrants are added to a waitlist",
                      icon: "format_list_numbered",
                    },
                  ].map(({ key, label, desc, icon }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-lg">{icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                      </div>
                      <Toggle
                        checked={prefForm[key]}
                        onChange={(val) => setPrefForm((p) => ({ ...p, [key]: val }))}
                      />
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                title="Capacity Management"
                icon="groups"
                subtitle="Set guest limits for this event"
              >
                <div className="flex flex-col gap-4">
                  <Field label="Maximum Guest Capacity">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                        groups
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={prefForm.maxCapacity}
                        onChange={(e) =>
                          setPrefForm((p) => ({
                            ...p,
                            maxCapacity: Math.max(0, parseInt(e.target.value) || 0),
                          }))
                        }
                        className={`${inputClass} pl-10`}
                        placeholder="0 = unlimited"
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Set to 0 for unlimited capacity.{" "}
                      {prefForm.maxCapacity > 0
                        ? `Currently limited to ${prefForm.maxCapacity} guests.`
                        : "No capacity limit set."}
                    </p>
                  </Field>
                </div>
              </Section>

              {/* Save button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={fetchSettings}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">hourglass_top</span>
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      Save Permissions
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════ NOTIFICATIONS ══════════════════════════════ */}
          {activeTab === "notifications" && (
            <div className="space-y-8 max-w-3xl">
              <Section
                title="Alert Preferences"
                icon="notifications_active"
                subtitle="Choose which events trigger admin notifications"
              >
                <div className="space-y-4">
                  {[
                    {
                      key: "notifyOnGuestRegistration",
                      label: "Guest Registration",
                      desc: "Receive an alert whenever a new guest registers for this event",
                      icon: "person_add",
                    },
                    {
                      key: "notifyOnCheckIn",
                      label: "Guest Check-in / Check-out",
                      desc: "Get notified when a guest checks in or out at the event",
                      icon: "how_to_reg",
                    },
                    {
                      key: "notifyOnServiceRequest",
                      label: "New Service Requests",
                      desc: "Alert when a guest submits a housekeeping, F&B, or valet request",
                      icon: "room_service",
                    },
                    {
                      key: "notifyOnHighPriority",
                      label: "High Priority & Emergency Alerts",
                      desc: "Always notify for critical or emergency service requests",
                      icon: "priority_high",
                    },
                  ].map(({ key, label, desc, icon }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-lg">{icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                      </div>
                      <Toggle
                        checked={prefForm[key]}
                        onChange={(val) => setPrefForm((p) => ({ ...p, [key]: val }))}
                      />
                    </div>
                  ))}
                </div>
              </Section>

              <Section
                title="Notification Destination"
                icon="mail"
                subtitle="Where should notification emails be sent?"
              >
                <Field label="Notification Email Address">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                      mail
                    </span>
                    <input
                      type="email"
                      value={prefForm.notificationEmail}
                      onChange={(e) =>
                        setPrefForm((p) => ({ ...p, notificationEmail: e.target.value }))
                      }
                      className={`${inputClass} pl-10`}
                      placeholder="ops-team@company.com"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Leave blank to use your account's default email address.
                  </p>
                </Field>
              </Section>

              {/* Save button */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={fetchSettings}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">hourglass_top</span>
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      Save Notifications
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════ DANGER ZONE ══════════════════════════════ */}
          {activeTab === "danger" && (
            <div className="space-y-6 max-w-3xl">
              {/* Info callout */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-sm text-amber-800 dark:text-amber-300">
                <span className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5">info</span>
                <div>
                  <p className="font-bold mb-0.5">Actions in this section are permanent.</p>
                  <p className="text-xs opacity-80">
                    Archiving hides the event from active dashboards but preserves data. Deletion removes
                    everything permanently and cannot be undone.
                  </p>
                </div>
              </div>

              {/* Archive section */}
              <Section
                title="Archive Event"
                icon="inventory_2"
                subtitle="Hide this event from active dashboards while preserving all data"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Archiving marks the event as finished. All reports and guest data are kept for
                      compliance and analytics, but the event will not appear in active operations views.
                    </p>
                    {prefForm.isArchived && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        This event is currently archived.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleArchiveToggle}
                    disabled={saving}
                    className={`shrink-0 px-5 py-2.5 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${
                      prefForm.isArchived
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                  >
                    {saving ? (
                      <span className="material-symbols-outlined animate-spin text-base">hourglass_top</span>
                    ) : (
                      <span className="material-symbols-outlined text-base">
                        {prefForm.isArchived ? "unarchive" : "inventory_2"}
                      </span>
                    )}
                    {prefForm.isArchived ? "Unarchive Event" : "Archive Event"}
                  </button>
                </div>
              </Section>

              {/* Delete section */}
              <Section
                title="Delete Event"
                icon="delete_forever"
                subtitle="Permanently remove this event and all associated data"
                danger
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Once deleted, all guest records, room assignments, service requests, transport logs,
                      schedules, and team data tied to this event will be permanently erased with no
                      possibility of recovery.
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-2">
                      This action is irreversible and cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="shrink-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">delete_forever</span>
                    Delete Event
                  </button>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>

      {/* Help footer */}
      <div className="mt-8 flex items-center gap-4 p-5 bg-primary/5 border border-primary/15 rounded-xl">
        <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined">help_outline</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Need help configuring this event?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Our support team is available 24/7 to help you set up complex hospitality workflows.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <a
            href="#"
            className="text-xs font-bold text-primary hover:underline"
          >
            Documentation
          </a>
          <span className="text-slate-300">•</span>
          <a href="#" className="text-xs font-bold text-primary hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default EventAdminstrativeSetting;