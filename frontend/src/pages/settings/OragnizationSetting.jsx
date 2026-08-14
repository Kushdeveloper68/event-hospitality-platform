import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  getSettings,
  updateProfile,
  updateOrgInfo,
  changePassword,
  updateNotifications,
} from "../../api/organizationSettingApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
  {
    key: "notifications",
    icon: "notifications_active",
    label: "Notifications",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all animate-in slide-in-from-bottom-4 ${
        toast.type === "error"
          ? "bg-red-600 text-white"
          : "bg-emerald-600 text-white"
      }`}
    >
      <span className="material-symbols-outlined text-lg">
        {toast.type === "error" ? "error" : "check_circle"}
      </span>
      {toast.msg}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900 ${className}`}
      {...props}
    />
  );
}

function Select({ children, className = "", ...props }) {
  return (
    <select
      className={`w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function SaveBtn({ loading, onClick, label = "Save Changes" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:scale-100"
    >
      {loading && (
        <span className="animate-spin size-4 border-2 border-white/30 border-t-white rounded-full" />
      )}
      {loading ? "Saving…" : label}
    </button>
  );
}

function CancelBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      Cancel
    </button>
  );
}

function SectionCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-lg">
            {icon}
          </span>
        </div>
        <div>
          <h2 className="font-display text-card-h3 text-slate-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-7">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${
          checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
        }`}
      >
        <span
          className={`inline-block size-5 transform rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
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
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-emerald-500",
  ];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score] : "bg-slate-100 dark:bg-slate-800"}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          {checks.map((c) => (
            <span
              key={c.label}
              className={`text-[10px] font-medium flex items-center gap-1 ${c.ok ? "text-emerald-600" : "text-slate-400"}`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {c.ok ? "check_circle" : "radio_button_unchecked"}
              </span>
              {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span
            className={`text-xs font-bold ${colors[score].replace("bg-", "text-")}`}
          >
            {labels[score]}
          </span>
        )}
      </div>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`}
    />
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7"
        >
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-2 gap-5">
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Theme Selector card ──────────────────────────────────────────────────────
function ThemeCard({ value, current, label, preview, onSelect }) {
  const active = current === value;
  return (
    <button
      onClick={() => onSelect(value)}
      className={`group relative flex flex-col gap-3 rounded-2xl border-2 p-4 transition-all text-left ${
        active
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md shadow-primary/10"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <div className="h-20 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        {preview}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-bold ${active ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}
        >
          {label}
        </span>
        <span
          className={`material-symbols-outlined text-lg ${active ? "text-primary" : "text-transparent"}`}
        >
          check_circle
        </span>
      </div>
    </button>
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

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    jobTitle: "",
    timezone: "UTC",
  });
  const [profileDirty, setProfileDirty] = useState(false);

  // Org form
  const [orgForm, setOrgForm] = useState({
    organizationName: "",
    industry: "",
    website: "",
    address: "",
    primaryContactName: "",
    primaryContactEmail: "",
  });
  const [orgDirty, setOrgDirty] = useState(false);

  // Security form
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

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch settings ────────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const res = await getSettings();
    if (res.success) {
      const s = res.settings;
      setProfileForm({
        name: s.name || "",
        jobTitle: s.jobTitle || "",
        timezone: s.timezone || "UTC",
      });
      setOrgForm({
        organizationName: s.organizationName || "",
        industry: s.industry || "",
        website: s.website || "",
        address: s.address || "",
        primaryContactName: s.primaryContactName || "",
        primaryContactEmail: s.primaryContactEmail || "",
      });
      setNotificationsEnabled(s.notificationsEnabled ?? true);
    } else {
      showToast(res.message || "Failed to load settings", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ── Profile save ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      setErrors((p) => ({ ...p, name: "Name is required" }));
      return;
    }
    setSaving((p) => ({ ...p, profile: true }));
    const res = await updateProfile(profileForm);
    setSaving((p) => ({ ...p, profile: false }));
    if (res.success) {
      showToast("Profile updated successfully");
      setProfileDirty(false);
      setErrors((p) => ({ ...p, name: undefined }));
      // sync name into auth context
      if (user) login({ ...user, name: profileForm.name });
    } else {
      showToast(res.message, "error");
    }
  };

  // ── Org save ──────────────────────────────────────────────────────────────
  const handleSaveOrg = async () => {
    if (!orgForm.organizationName.trim()) {
      setErrors((p) => ({ ...p, orgName: "Organization name is required" }));
      return;
    }
    setSaving((p) => ({ ...p, org: true }));
    const res = await updateOrgInfo(orgForm);
    setSaving((p) => ({ ...p, org: false }));
    if (res.success) {
      showToast("Organization info updated");
      setOrgDirty(false);
      setErrors((p) => ({ ...p, orgName: undefined }));
    } else {
      showToast(res.message, "error");
    }
  };

  // ── Password save ─────────────────────────────────────────────────────────
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
    const res = await import("../../api/organizationSettingApi").then((m) =>
      m.changePassword(secForm),
    );
    setSaving((p) => ({ ...p, password: false }));
    if (res.success) {
      showToast("Password changed successfully");
      setSecForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors((p) => ({
        ...p,
        currentPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      }));
    } else {
      showToast(res.message, "error");
    }
  };

  // ── Notifications toggle ──────────────────────────────────────────────────
  const handleToggleNotifications = async (val) => {
    setNotificationsEnabled(val);
    const res = await import("../../api/organizationSettingApi").then((m) =>
      m.updateNotifications(val),
    );
    if (res.success) {
      showToast(`Notifications ${val ? "enabled" : "disabled"}`);
    } else {
      setNotificationsEnabled(!val); // revert
      showToast(res.message, "error");
    }
  };

  // ── Profile field change ──────────────────────────────────────────────────
  const onProfileChange = (key, val) => {
    setProfileForm((p) => ({ ...p, [key]: val }));
    setProfileDirty(true);
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  // ── Org field change ──────────────────────────────────────────────────────
  const onOrgChange = (key, val) => {
    setOrgForm((p) => ({ ...p, [key]: val }));
    setOrgDirty(true);
    if (errors.orgName) setErrors((p) => ({ ...p, orgName: undefined }));
  };

  // ── User initials ─────────────────────────────────────────────────────────
  const initials = profileForm.name
    ? profileForm.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="animate-spin size-5 border-2 border-primary border-t-transparent rounded-full" />
          <span className="text-slate-500 text-sm">Loading settings…</span>
        </div>
        <PageSkeleton />
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto pb-16 px-4 pt-6 dark:bg-slate-950">
      <Toast toast={toast} />

      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="font-display text-page-h1 text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Manage your personal profile, organization, appearance, and security.
        </p>
      </div>

      <div className="flex gap-8">
        {/* ── Sidebar nav ── */}
        <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0">
          {/* Avatar card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 mb-4 flex flex-col items-center gap-3 shadow-sm">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
              {initials}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                {profileForm.name || user?.name || "—"}
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[150px]">
                {user?.email || "—"}
              </p>
            </div>
            <div
              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                resolvedTheme === "dark"
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {resolvedTheme === "dark" ? "dark_mode" : "light_mode"}
              </span>
              {resolvedTheme} mode
            </div>
          </div>

          {/* Nav items */}
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeSection === s.key
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </aside>

        {/* ── Mobile section pills ── */}
        <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-1 w-full">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                activeSection === s.key
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {s.icon}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* ════════════════════════════════
              PROFILE SECTION
          ════════════════════════════════ */}
          {activeSection === "profile" && (
            <SectionCard
              title="Personal Information"
              subtitle="Update your name, role and timezone"
              icon="person"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Full Name</FieldLabel>
                  <Input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => onProfileChange("name", e.target.value)}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>Work Email</FieldLabel>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    placeholder="email@example.com"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Email cannot be changed here
                  </p>
                </div>

                <div>
                  <FieldLabel>Job Title</FieldLabel>
                  <Input
                    type="text"
                    value={profileForm.jobTitle}
                    onChange={(e) =>
                      onProfileChange("jobTitle", e.target.value)
                    }
                    placeholder="e.g. Operations Manager"
                  />
                </div>

                <div>
                  <FieldLabel>Timezone</FieldLabel>
                  <Select
                    value={profileForm.timezone}
                    onChange={(e) =>
                      onProfileChange("timezone", e.target.value)
                    }
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                {profileDirty && (
                  <CancelBtn
                    onClick={() => {
                      fetchSettings();
                      setProfileDirty(false);
                    }}
                  />
                )}
                <SaveBtn loading={saving.profile} onClick={handleSaveProfile} />
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════
              ORGANIZATION SECTION
          ════════════════════════════════ */}
          {activeSection === "organization" && (
            <SectionCard
              title="Organization Info"
              subtitle="Manage your organization's identity and contact details"
              icon="business"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel required>Organization Name</FieldLabel>
                  <Input
                    type="text"
                    value={orgForm.organizationName}
                    onChange={(e) =>
                      onOrgChange("organizationName", e.target.value)
                    }
                    placeholder="Your organization name"
                  />
                  {errors.orgName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {errors.orgName}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>Industry</FieldLabel>
                  <Select
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
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Website</FieldLabel>
                  <div className="flex rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <span className="inline-flex items-center px-4 bg-slate-50 dark:bg-slate-800 text-slate-400 text-sm border-r border-slate-200 dark:border-slate-700 shrink-0">
                      https://
                    </span>
                    <input
                      type="text"
                      value={orgForm.website}
                      onChange={(e) => onOrgChange("website", e.target.value)}
                      placeholder="www.example.com"
                      className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <FieldLabel>Physical Address</FieldLabel>
                  <textarea
                    value={orgForm.address}
                    onChange={(e) => onOrgChange("address", e.target.value)}
                    rows={3}
                    placeholder="123 Main Street, City, Country"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                  />
                </div>

                <div>
                  <FieldLabel>Primary Contact Name</FieldLabel>
                  <Input
                    type="text"
                    value={orgForm.primaryContactName}
                    onChange={(e) =>
                      onOrgChange("primaryContactName", e.target.value)
                    }
                    placeholder="Contact person name"
                  />
                </div>

                <div>
                  <FieldLabel>Primary Contact Email</FieldLabel>
                  <Input
                    type="email"
                    value={orgForm.primaryContactEmail}
                    onChange={(e) =>
                      onOrgChange("primaryContactEmail", e.target.value)
                    }
                    placeholder="contact@example.com"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                {orgDirty && (
                  <CancelBtn
                    onClick={() => {
                      fetchSettings();
                      setOrgDirty(false);
                    }}
                  />
                )}
                <SaveBtn loading={saving.org} onClick={handleSaveOrg} />
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════
              APPEARANCE SECTION
          ════════════════════════════════ */}
          {activeSection === "appearance" && (
            <SectionCard
              title="Appearance"
              subtitle="Customize how the interface looks and feels"
              icon="palette"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Color Theme
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <ThemeCard
                    value="light"
                    current={theme}
                    label="Light"
                    onSelect={setTheme}
                    preview={
                      <div className="w-full h-full bg-white flex flex-col p-2 gap-2">
                        <div className="flex gap-1">
                          <div className="h-1.5 w-1/3 bg-slate-200 rounded-full" />
                          <div className="h-1.5 w-1/4 bg-primary/30 rounded-full" />
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-lg" />
                        <div className="flex gap-1">
                          <div className="h-1.5 flex-1 bg-slate-100 rounded-full" />
                          <div className="h-1.5 flex-1 bg-slate-100 rounded-full" />
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
                      <div className="w-full h-full bg-slate-900 flex flex-col p-2 gap-2">
                        <div className="flex gap-1">
                          <div className="h-1.5 w-1/3 bg-slate-700 rounded-full" />
                          <div className="h-1.5 w-1/4 bg-primary/50 rounded-full" />
                        </div>
                        <div className="flex-1 bg-slate-800 rounded-lg" />
                        <div className="flex gap-1">
                          <div className="h-1.5 flex-1 bg-slate-800 rounded-full" />
                          <div className="h-1.5 flex-1 bg-slate-800 rounded-full" />
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
                      <div className="w-full h-full flex">
                        <div className="w-1/2 bg-white flex flex-col p-2 gap-2">
                          <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                          <div className="flex-1 bg-slate-100 rounded-md" />
                        </div>
                        <div className="w-1/2 bg-slate-900 flex flex-col p-2 gap-2">
                          <div className="h-1.5 w-full bg-slate-700 rounded-full" />
                          <div className="flex-1 bg-slate-800 rounded-md" />
                        </div>
                      </div>
                    }
                  />
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                  Currently showing:{" "}
                  <span className="font-bold text-slate-600 dark:text-slate-300 capitalize">
                    {resolvedTheme} mode
                  </span>
                  {theme === "system" && " (from system preference)"}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Quick Toggle
                </p>
                <button
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <span className="material-symbols-outlined text-xl text-slate-500 group-hover:text-primary transition-colors">
                    {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Switch to {resolvedTheme === "dark" ? "Light" : "Dark"} mode
                  </span>
                </button>
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════
              SECURITY SECTION
          ════════════════════════════════ */}
          {activeSection === "security" && (
            <SectionCard
              title="Security"
              subtitle="Change your password and manage authentication"
              icon="lock"
            >
              <div className="grid grid-cols-1 gap-5">
                {/* Current password */}
                <div>
                  <FieldLabel required>Current Password</FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      value={secForm.currentPassword}
                      onChange={(e) => {
                        setSecForm((p) => ({
                          ...p,
                          currentPassword: e.target.value,
                        }));
                        if (errors.currentPassword)
                          setErrors((p) => ({
                            ...p,
                            currentPassword: undefined,
                          }));
                      }}
                      placeholder="••••••••"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((p) => ({ ...p, current: !p.current }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPasswords.current
                          ? "visibility_off"
                          : "visibility"}
                      </span>
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New password */}
                <div>
                  <FieldLabel required>New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      value={secForm.newPassword}
                      onChange={(e) => {
                        setSecForm((p) => ({
                          ...p,
                          newPassword: e.target.value,
                        }));
                        if (errors.newPassword)
                          setErrors((p) => ({ ...p, newPassword: undefined }));
                      }}
                      placeholder="••••••••"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((p) => ({ ...p, new: !p.new }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPasswords.new ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <PasswordStrength password={secForm.newPassword} />
                  {errors.newPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <FieldLabel required>Confirm New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={secForm.confirmPassword}
                      onChange={(e) => {
                        setSecForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }));
                        if (errors.confirmPassword)
                          setErrors((p) => ({
                            ...p,
                            confirmPassword: undefined,
                          }));
                      }}
                      placeholder="••••••••"
                      className={`pr-11 ${
                        secForm.confirmPassword &&
                        secForm.newPassword !== secForm.confirmPassword
                          ? "border-red-400 focus:ring-red-200"
                          : secForm.confirmPassword &&
                              secForm.newPassword === secForm.confirmPassword
                            ? "border-emerald-400 focus:ring-emerald-200"
                            : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPasswords.confirm
                          ? "visibility_off"
                          : "visibility"}
                      </span>
                    </button>
                  </div>
                  {secForm.confirmPassword &&
                    secForm.newPassword !== secForm.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          error
                        </span>
                        Passwords do not match
                      </p>
                    )}
                  {secForm.confirmPassword &&
                    secForm.newPassword === secForm.confirmPassword && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        Passwords match
                      </p>
                    )}
                  {errors.confirmPassword && !secForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <CancelBtn
                  onClick={() =>
                    setSecForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }
                />
                <SaveBtn
                  loading={saving.password}
                  onClick={handleChangePassword}
                  label="Update Password"
                />
              </div>
            </SectionCard>
          )}

          {/* ════════════════════════════════
              NOTIFICATIONS SECTION
          ════════════════════════════════ */}
          {activeSection === "notifications" && (
            <SectionCard
              title="Notification Preferences"
              subtitle="Control how and when you receive alerts"
              icon="notifications_active"
            >
              <div className="space-y-3">
                <Toggle
                  checked={notificationsEnabled}
                  onChange={handleToggleNotifications}
                  label="Email Notifications"
                  description="Receive operational alerts, guest arrivals, service requests, and event updates via email."
                />

                {/* These are UI-only extras — extend backend as needed */}
                <Toggle
                  checked={notificationsEnabled}
                  onChange={() => {}}
                  label="Guest Check-in Alerts"
                  description="Get notified when VIP guests check in or check out."
                />
                <Toggle
                  checked={notificationsEnabled}
                  onChange={() => {}}
                  label="Service Request Alerts"
                  description="Receive alerts when high-priority service requests are created."
                />
                <Toggle
                  checked={false}
                  onChange={() => {}}
                  label="Weekly Summary Report"
                  description="Receive a weekly digest of event performance and key metrics."
                />

                <div className="flex items-start gap-3 mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30">
                  <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">
                    info
                  </span>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Additional granular notification controls will be available
                    in a future update. Currently all notification preferences
                    are linked to the master toggle above.
                  </p>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}