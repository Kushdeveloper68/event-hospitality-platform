import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  getSettings,
  updateProfile,
  updateOrgInfo,
  changePassword,
  updateNotifications,
} from "../../api/organizationSettingApi";

// ─── Constants ────────────────────────────────────────────────────────────────
const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const INDUSTRIES = [
  "Hotel Management",
  "Event Venue",
  "Catering & Services",
  "Corporate Events",
  "Wedding & Social Events",
  "Conference & Exhibitions",
  "Sports & Entertainment",
  "Travel & Tourism",
  "Other",
];

const SECTIONS = [
  { key: "profile", icon: "person", label: "Profile" },
  { key: "organization", icon: "business", label: "Organization" },
  { key: "appearance", icon: "palette", label: "Appearance" },
  { key: "security", icon: "lock", label: "Security" },
  { key: "notifications", icon: "notifications_active", label: "Notifications" },
];

// ─── Shared class strings (same palette as the Operations Dashboard) ──────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";

const INPUT_BASE =
  "w-full rounded-xl border bg-slate-50 px-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900";

const INPUT_STATE = {
  default:
    "border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20",
  error:
    "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20",
  success:
    "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100 dark:border-emerald-500/40 dark:focus:border-emerald-500/60 dark:focus:ring-emerald-500/20",
};

// ─── Small UI pieces ──────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      role="status"
      className={`fixed bottom-4 left-4 right-4 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in slide-in-from-bottom-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
        isError ? "bg-red-600" : "bg-emerald-600"
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {isError ? "error" : "check_circle"}
      </span>
      <span className="min-w-0">{toast.msg}</span>
    </div>
  );
}

function Field({ label, htmlFor, required, hint, error, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
      >
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
        hint && (
          <p className="mt-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function Input({ state = "default", className = "", ...props }) {
  return (
    <input
      className={`h-10 ${INPUT_BASE} ${INPUT_STATE[state]} ${className}`}
      {...props}
    />
  );
}

function Select({ children, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        className={`h-10 cursor-pointer appearance-none pr-10 ${INPUT_BASE} ${INPUT_STATE.default} ${className}`}
        {...props}
      >
        {children}
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
        expand_more
      </span>
    </div>
  );
}

function PasswordInput({ show, onToggle, state, ...props }) {
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        state={state}
        className="pr-11"
        placeholder="••••••••"
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <span className="material-symbols-outlined text-[19px]">
          {show ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}

function PrimaryBtn({ loading, onClick, disabled, label = "Save changes" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
      )}
      {loading ? "Saving…" : label}
    </button>
  );
}

function SecondaryBtn({ onClick, disabled, children = "Cancel" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

function SectionCard({ title, subtitle, icon, footer, children }) {
  return (
    <section className={`overflow-hidden ${CARD}`}>
      <div className="flex items-center gap-3.5 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-7 sm:py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          <span className="material-symbols-outlined text-[21px]">{icon}</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-7">{children}</div>

      {footer && (
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          {footer}
        </div>
      )}
    </section>
  );
}

function FooterActions({ dirty, children }) {
  return (
    <>
      <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        {dirty ? (
          <>
            <span className="size-1.5 rounded-full bg-amber-500" />
            You have unsaved changes
          </>
        ) : (
          <>
            <span className="size-1.5 rounded-full bg-emerald-500" />
            All changes saved
          </>
        )}
      </p>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        {children}
      </div>
    </>
  );
}

function Toggle({ checked, onChange, label, description, disabled, comingSoon }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</p>
          {comingSoon && (
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              Coming soon
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed ${
          checked ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const bars = ["", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-500"];
  const texts = [
    "",
    "text-red-600 dark:text-red-400",
    "text-orange-600 dark:text-orange-400",
    "text-amber-600 dark:text-amber-400",
    "text-emerald-600 dark:text-emerald-400",
  ];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-3 space-y-2.5">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i < score ? bars[score] : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
        {score > 0 && (
          <span className={`w-12 text-right text-xs font-bold ${texts[score]}`}>
            {labels[score]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1.5 text-[11px] font-medium ${
              c.ok
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {c.ok ? "check_circle" : "radio_button_unchecked"}
            </span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ThemeCard({ value, current, label, preview, onSelect }) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      className={`group flex flex-col gap-3 rounded-2xl border-2 p-3 text-left transition ${
        active
          ? "border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-500/10"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
      }`}
    >
      <div className="h-24 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        {preview}
      </div>
      <div className="flex items-center justify-between px-1">
        <span
          className={`text-sm font-bold ${
            active
              ? "text-blue-700 dark:text-blue-300"
              : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {label}
        </span>
        <span
          className={`material-symbols-outlined text-[20px] ${
            active ? "text-blue-600 dark:text-blue-400" : "text-slate-300 dark:text-slate-600"
          }`}
        >
          {active ? "check_circle" : "radio_button_unchecked"}
        </span>
      </div>
    </button>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`} />
  );
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <header className="mb-6 lg:mb-8">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
        Account
      </p>
      <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
        Settings
      </h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Manage your profile, organization, appearance and security.
      </p>
    </header>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function OrganizationSetting() {
  const { user, login } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  // ── State ─────────────────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const toastTimer = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    jobTitle: "",
    timezone: "UTC",
  });
  const [profileDirty, setProfileDirty] = useState(false);
  const savedProfile = useRef(null);

  const [orgForm, setOrgForm] = useState({
    organizationName: "",
    industry: "",
    website: "",
    address: "",
    primaryContactName: "",
    primaryContactEmail: "",
  });
  const [orgDirty, setOrgDirty] = useState(false);
  const savedOrg = useRef(null);

  const [secForm, setSecForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ── Fetch settings ────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSettings();
      if (res.success) {
        const s = res.settings;
        const profile = {
          name: s.name || "",
          jobTitle: s.jobTitle || "",
          timezone: s.timezone || "UTC",
        };
        const org = {
          organizationName: s.organizationName || "",
          industry: s.industry || "",
          website: s.website || "",
          address: s.address || "",
          primaryContactName: s.primaryContactName || "",
          primaryContactEmail: s.primaryContactEmail || "",
        };
        savedProfile.current = profile;
        savedOrg.current = org;
        setProfileForm(profile);
        setOrgForm(org);
        setProfileDirty(false);
        setOrgDirty(false);
        setNotificationsEnabled(s.notificationsEnabled ?? true);
      } else {
        showToast(res.message || "Failed to load settings", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ── Profile ───────────────────────────────────────────────────────────────
  const onProfileChange = (key, val) => {
    setProfileForm((p) => ({ ...p, [key]: val }));
    setProfileDirty(true);
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      setErrors((p) => ({ ...p, name: "Name is required" }));
      return;
    }
    setSaving((p) => ({ ...p, profile: true }));
    try {
      const res = await updateProfile(profileForm);
      if (res.success) {
        showToast("Profile updated successfully");
        savedProfile.current = profileForm;
        setProfileDirty(false);
        setErrors((p) => ({ ...p, name: undefined }));
        if (user) login({ ...user, name: profileForm.name });
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving((p) => ({ ...p, profile: false }));
    }
  };

  const handleCancelProfile = () => {
    if (savedProfile.current) setProfileForm(savedProfile.current);
    setProfileDirty(false);
    setErrors((p) => ({ ...p, name: undefined }));
  };

  // ── Organization ──────────────────────────────────────────────────────────
  const onOrgChange = (key, val) => {
    setOrgForm((p) => ({ ...p, [key]: val }));
    setOrgDirty(true);
    if (errors.orgName) setErrors((p) => ({ ...p, orgName: undefined }));
  };

  const handleSaveOrg = async () => {
    if (!orgForm.organizationName.trim()) {
      setErrors((p) => ({ ...p, orgName: "Organization name is required" }));
      return;
    }
    setSaving((p) => ({ ...p, org: true }));
    try {
      const res = await updateOrgInfo(orgForm);
      if (res.success) {
        showToast("Organization info updated");
        savedOrg.current = orgForm;
        setOrgDirty(false);
        setErrors((p) => ({ ...p, orgName: undefined }));
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving((p) => ({ ...p, org: false }));
    }
  };

  const handleCancelOrg = () => {
    if (savedOrg.current) setOrgForm(savedOrg.current);
    setOrgDirty(false);
    setErrors((p) => ({ ...p, orgName: undefined }));
  };

  // ── Password ──────────────────────────────────────────────────────────────
  const onSecChange = (key, val) => {
    setSecForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const resetSecurity = () => {
    setSecForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors((p) => ({
      ...p,
      currentPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined,
    }));
  };

  const handleChangePassword = async () => {
    const errs = {};
    if (!secForm.currentPassword) errs.currentPassword = "Required";
    if (!secForm.newPassword) errs.newPassword = "Required";
    if (secForm.newPassword && secForm.newPassword.length < 8)
      errs.newPassword = "Minimum 8 characters";
    if (secForm.newPassword !== secForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) {
      setErrors((p) => ({ ...p, ...errs }));
      return;
    }

    setSaving((p) => ({ ...p, password: true }));
    try {
      const res = await changePassword(secForm);
      if (res.success) {
        showToast("Password changed successfully");
        resetSecurity();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving((p) => ({ ...p, password: false }));
    }
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const handleToggleNotifications = async (val) => {
    setNotificationsEnabled(val);
    setNotifSaving(true);
    try {
      const res = await updateNotifications(val);
      if (res.success) {
        showToast(`Notifications ${val ? "enabled" : "disabled"}`);
      } else {
        setNotificationsEnabled(!val);
        showToast(res.message, "error");
      }
    } catch (err) {
      setNotificationsEnabled(!val);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setNotifSaving(false);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const initials = profileForm.name
    ? profileForm.name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  const passwordsMatch =
    secForm.confirmPassword && secForm.newPassword === secForm.confirmPassword;
  const passwordsMismatch =
    secForm.confirmPassword && secForm.newPassword !== secForm.confirmPassword;
  const securityTouched =
    secForm.currentPassword || secForm.newPassword || secForm.confirmPassword;

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageShell>
        <div className="mb-8 space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className="hidden w-64 shrink-0 space-y-3 lg:block">
            <Skeleton className="h-44 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className={`min-w-0 flex-1 p-7 ${CARD}`}>
            <Skeleton className="mb-7 h-6 w-48" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <Toast toast={toast} />
      <PageHeader />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
        {/* ── Sidebar (desktop) ── */}
        <aside className="hidden w-64 shrink-0 lg:sticky lg:top-6 lg:block">
          <div className={`mb-4 flex items-center gap-3 p-4 ${CARD}`}>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-base font-extrabold text-white dark:bg-slate-100 dark:text-slate-900">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {profileForm.name || user?.name || "—"}
              </p>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                {user?.email || "—"}
              </p>
              {orgForm.organizationName && (
                <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
                  {orgForm.organizationName}
                </p>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-1" aria-label="Settings sections">
            {SECTIONS.map((s) => {
              const active = activeSection === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveSection(s.key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-bold transition ${
                    active
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Section pills (mobile / tablet) ── */}
        <nav
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:hidden"
          aria-label="Settings sections"
        >
          {SECTIONS.map((s) => {
            const active = activeSection === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveSection(s.key)}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                {s.label}
              </button>
            );
          })}
        </nav>

        {/* ── Main content ── */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* PROFILE */}
          {activeSection === "profile" && (
            <SectionCard
              title="Personal information"
              subtitle="Update your name, role and timezone"
              icon="person"
              footer={
                <FooterActions dirty={profileDirty}>
                  <SecondaryBtn onClick={handleCancelProfile} disabled={!profileDirty} />
                  <PrimaryBtn
                    loading={saving.profile}
                    disabled={!profileDirty}
                    onClick={handleSaveProfile}
                  />
                </FooterActions>
              }
            >
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                <Field label="Full name" htmlFor="profile-name" required error={errors.name}>
                  <Input
                    id="profile-name"
                    type="text"
                    value={profileForm.name}
                    state={errors.name ? "error" : "default"}
                    onChange={(e) => onProfileChange("name", e.target.value)}
                    placeholder="Your full name"
                  />
                </Field>

                <Field
                  label="Work email"
                  htmlFor="profile-email"
                  hint="Email can't be changed here."
                >
                  <Input
                    id="profile-email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    placeholder="email@example.com"
                  />
                </Field>

                <Field label="Job title" htmlFor="profile-title">
                  <Input
                    id="profile-title"
                    type="text"
                    value={profileForm.jobTitle}
                    onChange={(e) => onProfileChange("jobTitle", e.target.value)}
                    placeholder="e.g. Operations Manager"
                  />
                </Field>

                <Field label="Timezone" htmlFor="profile-tz">
                  <Select
                    id="profile-tz"
                    value={profileForm.timezone}
                    onChange={(e) => onProfileChange("timezone", e.target.value)}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </SectionCard>
          )}

          {/* ORGANIZATION */}
          {activeSection === "organization" && (
            <SectionCard
              title="Organization info"
              subtitle="Your organization's identity and contact details"
              icon="business"
              footer={
                <FooterActions dirty={orgDirty}>
                  <SecondaryBtn onClick={handleCancelOrg} disabled={!orgDirty} />
                  <PrimaryBtn
                    loading={saving.org}
                    disabled={!orgDirty}
                    onClick={handleSaveOrg}
                  />
                </FooterActions>
              }
            >
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
                <Field
                  label="Organization name"
                  htmlFor="org-name"
                  required
                  error={errors.orgName}
                >
                  <Input
                    id="org-name"
                    type="text"
                    value={orgForm.organizationName}
                    state={errors.orgName ? "error" : "default"}
                    onChange={(e) => onOrgChange("organizationName", e.target.value)}
                    placeholder="Your organization name"
                  />
                </Field>

                <Field label="Industry" htmlFor="org-industry">
                  <Select
                    id="org-industry"
                    value={orgForm.industry}
                    onChange={(e) => onOrgChange("industry", e.target.value)}
                  >
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Website" htmlFor="org-website" className="md:col-span-2">
                  <div className="flex h-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:focus-within:border-blue-500/60 dark:focus-within:bg-slate-900 dark:focus-within:ring-blue-500/20">
                    <span className="inline-flex shrink-0 items-center border-r border-slate-200 bg-slate-100 px-3.5 text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      https://
                    </span>
                    <input
                      id="org-website"
                      type="text"
                      value={orgForm.website}
                      onChange={(e) => onOrgChange("website", e.target.value)}
                      placeholder="www.example.com"
                      className="min-w-0 flex-1 bg-transparent px-3.5 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                </Field>

                <Field label="Physical address" htmlFor="org-address" className="md:col-span-2">
                  <textarea
                    id="org-address"
                    value={orgForm.address}
                    onChange={(e) => onOrgChange("address", e.target.value)}
                    rows={3}
                    placeholder="123 Main Street, City, Country"
                    className={`resize-none py-2.5 ${INPUT_BASE} ${INPUT_STATE.default}`}
                  />
                </Field>

                <Field label="Primary contact name" htmlFor="org-contact-name">
                  <Input
                    id="org-contact-name"
                    type="text"
                    value={orgForm.primaryContactName}
                    onChange={(e) => onOrgChange("primaryContactName", e.target.value)}
                    placeholder="Contact person name"
                  />
                </Field>

                <Field label="Primary contact email" htmlFor="org-contact-email">
                  <Input
                    id="org-contact-email"
                    type="email"
                    value={orgForm.primaryContactEmail}
                    onChange={(e) => onOrgChange("primaryContactEmail", e.target.value)}
                    placeholder="contact@example.com"
                  />
                </Field>
              </div>
            </SectionCard>
          )}

          {/* APPEARANCE */}
          {activeSection === "appearance" && (
            <SectionCard
              title="Appearance"
              subtitle="Choose how the interface looks"
              icon="palette"
            >
              <p className="mb-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                Color theme
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                <ThemeCard
                  value="light"
                  current={theme}
                  label="Light"
                  onSelect={setTheme}
                  preview={
                    <div className="flex h-full w-full flex-col gap-2 bg-white p-2.5">
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1/3 rounded-full bg-slate-200" />
                        <div className="h-1.5 w-1/4 rounded-full bg-blue-300" />
                      </div>
                      <div className="flex-1 rounded-lg bg-slate-100" />
                      <div className="flex gap-1">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100" />
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100" />
                      </div>
                    </div>
                  }
                />
                <ThemeCard
                  value="dark"
                  current={theme}
                  label="Dark"
                  onSelect={setTheme}
                  preview={
                    <div className="flex h-full w-full flex-col gap-2 bg-slate-900 p-2.5">
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1/3 rounded-full bg-slate-700" />
                        <div className="h-1.5 w-1/4 rounded-full bg-blue-500/60" />
                      </div>
                      <div className="flex-1 rounded-lg bg-slate-800" />
                      <div className="flex gap-1">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-800" />
                        <div className="h-1.5 flex-1 rounded-full bg-slate-800" />
                      </div>
                    </div>
                  }
                />
                <ThemeCard
                  value="system"
                  current={theme}
                  label="System"
                  onSelect={setTheme}
                  preview={
                    <div className="flex h-full w-full">
                      <div className="flex w-1/2 flex-col gap-2 bg-white p-2.5">
                        <div className="h-1.5 w-full rounded-full bg-slate-200" />
                        <div className="flex-1 rounded-md bg-slate-100" />
                      </div>
                      <div className="flex w-1/2 flex-col gap-2 bg-slate-900 p-2.5">
                        <div className="h-1.5 w-full rounded-full bg-slate-700" />
                        <div className="flex-1 rounded-md bg-slate-800" />
                      </div>
                    </div>
                  }
                />
              </div>

              <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                Currently showing{" "}
                <span className="font-bold capitalize text-slate-700 dark:text-slate-200">
                  {resolvedTheme} mode
                </span>
                {theme === "system" && " (from your system preference)"}
              </p>

              <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Quick toggle
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Instantly switch between light and dark.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
                  </span>
                  Switch to {resolvedTheme === "dark" ? "light" : "dark"} mode
                </button>
              </div>
            </SectionCard>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <SectionCard
              title="Password"
              subtitle="Choose a strong password to keep your account safe"
              icon="lock"
              footer={
                <FooterActions dirty={!!securityTouched}>
                  <SecondaryBtn onClick={resetSecurity} disabled={!securityTouched} />
                  <PrimaryBtn
                    loading={saving.password}
                    onClick={handleChangePassword}
                    label="Update password"
                  />
                </FooterActions>
              }
            >
              <div className="mx-auto max-w-xl space-y-5">
                <Field
                  label="Current password"
                  htmlFor="sec-current"
                  required
                  error={errors.currentPassword}
                >
                  <PasswordInput
                    id="sec-current"
                    value={secForm.currentPassword}
                    state={errors.currentPassword ? "error" : "default"}
                    show={showPasswords.current}
                    onToggle={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                    onChange={(e) => onSecChange("currentPassword", e.target.value)}
                    autoComplete="current-password"
                  />
                </Field>

                <Field
                  label="New password"
                  htmlFor="sec-new"
                  required
                  error={errors.newPassword}
                >
                  <PasswordInput
                    id="sec-new"
                    value={secForm.newPassword}
                    state={errors.newPassword ? "error" : "default"}
                    show={showPasswords.new}
                    onToggle={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                    onChange={(e) => onSecChange("newPassword", e.target.value)}
                    autoComplete="new-password"
                  />
                  <PasswordStrength password={secForm.newPassword} />
                </Field>

                <Field
                  label="Confirm new password"
                  htmlFor="sec-confirm"
                  required
                  error={passwordsMismatch ? "Passwords do not match" : errors.confirmPassword}
                >
                  <PasswordInput
                    id="sec-confirm"
                    value={secForm.confirmPassword}
                    state={passwordsMismatch ? "error" : passwordsMatch ? "success" : "default"}
                    show={showPasswords.confirm}
                    onToggle={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                    onChange={(e) => onSecChange("confirmPassword", e.target.value)}
                    autoComplete="new-password"
                  />
                  {passwordsMatch && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Passwords match
                    </p>
                  )}
                </Field>
              </div>
            </SectionCard>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <SectionCard
              title="Notification preferences"
              subtitle="Control the alerts you receive"
              icon="notifications_active"
            >
              <Toggle
                checked={notificationsEnabled}
                onChange={handleToggleNotifications}
                disabled={notifSaving}
                label="Email notifications"
                description="Receive operational alerts, guest arrivals, service requests and event updates by email."
              />

              <div className="mb-3 mt-7 flex items-center gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  More controls
                </p>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="space-y-3">
                <Toggle
                  checked={false}
                  disabled
                  comingSoon
                  label="Guest check-in alerts"
                  description="Get notified when VIP guests check in or check out."
                />
                <Toggle
                  checked={false}
                  disabled
                  comingSoon
                  label="Service request alerts"
                  description="Receive alerts when high-priority service requests are created."
                />
                <Toggle
                  checked={false}
                  disabled
                  comingSoon
                  label="Weekly summary report"
                  description="Receive a weekly digest of event performance and key metrics."
                />
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </PageShell>
  );
}