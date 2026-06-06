import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Table of Contents structure ─────────────────────────────────────────────
const sections = [
  { id: "introduction", icon: "info", title: "Introduction" },
  { id: "getting-started", icon: "rocket_launch", title: "Getting Started" },
  { id: "dashboard", icon: "dashboard", title: "Operations Dashboard" },
  { id: "events", icon: "calendar_month", title: "Managing Events" },
  { id: "guests", icon: "group", title: "Guest Management" },
  { id: "rooms", icon: "meeting_room", title: "Room Inventory" },
  { id: "checkin", icon: "how_to_reg", title: "Check-in Desk" },
  { id: "transport", icon: "local_shipping", title: "Transport Coordination" },
  { id: "services", icon: "room_service", title: "Service Requests" },
  { id: "schedule", icon: "schedule", title: "Event Schedule" },
  { id: "team", icon: "badge", title: "Team Management" },
  { id: "analytics", icon: "analytics", title: "Analytics & Reports" },
  { id: "settings", icon: "tune", title: "Settings" },
  { id: "notifications", icon: "notifications", title: "Activity Logs" },
  { id: "faq", icon: "help_outline", title: "FAQ & Troubleshooting" },
];

// ─── Small reusable pieces ────────────────────────────────────────────────────
function TOCItem({ section, active, onClick }) {
  return (
    <button
      onClick={() => onClick(section.id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 ${
        active
          ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      <span
        className="material-symbols-outlined shrink-0"
        style={{
          fontSize: "16px",
          fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {section.icon}
      </span>
      <span className="truncate">{section.title}</span>
    </button>
  );
}

function SectionTitle({ id, icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5" id={id}>
      <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
        <span
          className="material-symbols-outlined text-blue-600 dark:text-blue-400"
          style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
    </div>
  );
}

function Note({ type = "info", children }) {
  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/20",
      icon: "info",
      iconColor: "text-blue-500",
      text: "text-blue-800 dark:text-blue-300",
    },
    tip: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/20",
      icon: "lightbulb",
      iconColor: "text-emerald-500",
      text: "text-emerald-800 dark:text-emerald-300",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20",
      icon: "warning",
      iconColor: "text-amber-500",
      text: "text-amber-800 dark:text-amber-300",
    },
    danger: {
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20",
      icon: "error",
      iconColor: "text-red-500",
      text: "text-red-800 dark:text-red-300",
    },
  };
  const s = styles[type];
  return (
    <div
      className={`flex gap-3 p-4 rounded-xl border ${s.bg} ${s.border} my-4`}
    >
      <span
        className={`material-symbols-outlined shrink-0 mt-0.5 ${s.iconColor}`}
        style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
      >
        {s.icon}
      </span>
      <p className={`text-sm leading-relaxed ${s.text}`}>{children}</p>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="shrink-0 size-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-black mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-900 dark:text-white mb-1">{title}</p>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function ImagePlaceholder({ label, height = "h-52" }) {
  return (
    <div
      className={`${height} w-full my-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center justify-center gap-3`}
    >
      <span
        className="material-symbols-outlined text-slate-400 dark:text-slate-600"
        style={{ fontSize: "40px" }}
      >
        image
      </span>
      <div className="text-center px-4">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Screenshot needed
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
        <span
          className="material-symbols-outlined text-slate-600 dark:text-slate-400"
          style={{ fontSize: "16px" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

function Badge({ label, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    green:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    amber:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    purple:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors[color]}`}
    >
      {label}
    </span>
  );
}

function Divider() {
  return (
    <div className="mt-10 mb-10 border-b border-slate-100 dark:border-slate-800" />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UserManual() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const filteredSections = searchQuery
    ? sections.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sections;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg overflow-hidden">
              <img
                src="/event-logo-with-icon-dark-bg-removebg-preview.png"
                alt="EventCure"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">
              EventCure
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">
              User Manual
            </span>
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                dashboard
              </span>
              Go to Dashboard
            </Link>
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                menu
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">
              Contents
            </p>
            <input
              type="text"
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-3 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            />
            <nav className="space-y-0.5">
              {filteredSections.map((s) => (
                <TOCItem
                  key={s.id}
                  section={s}
                  active={activeSection === s.id}
                  onClick={scrollTo}
                />
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden md:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              Contents
            </p>
            <input
              type="text"
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full mb-3 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <nav className="space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto">
              {filteredSections.map((s) => (
                <TOCItem
                  key={s.id}
                  section={s}
                  active={activeSection === s.id}
                  onClick={scrollTo}
                />
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-400 px-1">
                Version 1.0 · EventCure Platform
              </p>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* Hero banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 mb-8">
            <div className="flex items-start gap-5">
              <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{
                    fontSize: "30px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  menu_book
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  EventCure User Manual
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-2xl">
                  Complete guide to using the EventCure hospitality management
                  platform — from creating your first event to running
                  full-scale operations with thousands of guests.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      update
                    </span>
                    Version 1.0
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      library_books
                    </span>
                    15 Sections
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      verified
                    </span>
                    Complete Coverage
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-0">
            {/* ══════════════════════════════════════
                1. INTRODUCTION
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="introduction">
              <SectionTitle
                id="introduction"
                icon="info"
                title="Introduction"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  <strong className="text-slate-800 dark:text-slate-200">
                    EventCure
                  </strong>{" "}
                  is a full-stack hospitality operations platform built for
                  event management teams who need real-time visibility,
                  structured workflows, and multi-department coordination — all
                  in one place.
                </p>
                <p>
                  Whether you are running a 50-person corporate luncheon or a
                  3,000-delegate international summit, EventCure provides the
                  tools to manage every operational touchpoint: guest arrivals,
                  room assignments, transport coordination, food and beverage
                  requests, staff scheduling, and post-event analytics.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  What you can do with EventCure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  <FeatureRow
                    icon="calendar_month"
                    title="Multi-event management"
                    desc="Create and manage unlimited events from a single organization dashboard."
                  />
                  <FeatureRow
                    icon="group"
                    title="Guest database"
                    desc="Register, search, and manage every attendee with rich profile data."
                  />
                  <FeatureRow
                    icon="meeting_room"
                    title="Room inventory"
                    desc="Configure rooms, assign guests, and track occupancy in real time."
                  />
                  <FeatureRow
                    icon="how_to_reg"
                    title="Check-in desk"
                    desc="Process arrivals with one click. QR-ready and mobile-optimized."
                  />
                  <FeatureRow
                    icon="local_shipping"
                    title="Fleet coordination"
                    desc="Schedule and track every transport leg from pickup to dropoff."
                  />
                  <FeatureRow
                    icon="room_service"
                    title="Service ticketing"
                    desc="Log, route, and resolve housekeeping, F&B, and maintenance calls."
                  />
                  <FeatureRow
                    icon="schedule"
                    title="Live schedule"
                    desc="Multi-workstream Gantt timeline for full event schedule visibility."
                  />
                  <FeatureRow
                    icon="analytics"
                    title="Deep analytics"
                    desc="Per-event and cross-event reports with CSV export."
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Who this manual is for
                </h3>
                <p>This guide is intended for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Event Directors
                    </strong>{" "}
                    — setting up events, managing preferences, exporting
                    reports.
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Operations Managers
                    </strong>{" "}
                    — overseeing check-in, room allocation, and service queues.
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Floor Staff
                    </strong>{" "}
                    — processing guest arrivals, handling requests, updating
                    transport status.
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Logistics Teams
                    </strong>{" "}
                    — coordinating transport, drivers, and fleet deployment.
                  </li>
                </ul>

                <Note type="info">
                  This manual covers the full EventCure web platform. For API
                  integration documentation, visit the developer reference at{" "}
                  <strong>docs.eventcure.io</strong>.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                2. GETTING STARTED
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="getting-started">
              <SectionTitle
                id="getting-started"
                icon="rocket_launch"
                title="Getting Started"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Creating your account
                </h3>
                <Step number="1" title="Navigate to the sign-up page">
                  Go to{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    eventcure.io/signup
                  </strong>{" "}
                  or click <em>Get Started Free</em> on the landing page. You
                  can also sign up using your Google account for faster access.
                </Step>
                <Step number="2" title="Fill in your details">
                  Enter your full name, business email, organization name, and a
                  password of at least 8 characters. Accept the Terms of Service
                  to continue.
                </Step>
                <Step number="3" title="Verify your email">
                  A 6-digit OTP will be sent to your email address. Enter it on
                  the verification screen within 10 minutes. If you don't
                  receive it, use the <em>Resend Code</em> button after the
                  10-minute cooldown.
                </Step>
                <Step number="4" title="You're in!">
                  You'll be redirected to the Operations Dashboard
                  automatically. Your organization is created and ready to use.
                </Step>

                <ImagePlaceholder label="Sign-up page showing the registration form with name, email, organization, and password fields" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Signing in
                </h3>
                <p>
                  Visit{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    /login
                  </strong>{" "}
                  and enter your email and password. You can also use{" "}
                  <em>Sign in with Google</em> if your account was created or
                  linked with Google OAuth.
                </p>
                <Note type="tip">
                  Use the <strong>Remember me for 30 days</strong> checkbox on
                  trusted devices so you don't need to log in every session.
                </Note>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Resetting your password
                </h3>
                <p>
                  Click <em>Forgot password?</em> on the login page. Enter your
                  email to receive a 6-digit OTP, verify it, and then set a new
                  password. The reset flow has three steps:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Enter your registered email address</li>
                  <li>Enter the 6-digit code sent to your inbox</li>
                  <li>
                    Create a new password (8+ characters, mixed case + number
                    recommended)
                  </li>
                </ol>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  First-time setup checklist
                </h3>
                <div className="space-y-2 mt-2">
                  {[
                    [
                      "Complete your organization profile",
                      "Settings → Organization Info",
                    ],
                    ["Set your timezone", "Settings → Profile → Timezone"],
                    [
                      "Create your first event",
                      "Click + New Event in the sidebar or dashboard",
                    ],
                    [
                      "Add team members to the event",
                      "Event Workspace → Team tab",
                    ],
                    ["Import or add guests", "Event Workspace → Guests tab"],
                  ].map(([task, location]) => (
                    <div
                      key={task}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span
                        className="material-symbols-outlined text-slate-400"
                        style={{ fontSize: "16px" }}
                      >
                        check_box_outline_blank
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {task}
                        </p>
                        <p className="text-xs text-slate-400">{location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                3. DASHBOARD
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="dashboard">
              <SectionTitle
                id="dashboard"
                icon="dashboard"
                title="Operations Dashboard"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Operations Dashboard
                  </strong>{" "}
                  is your command centre. It opens immediately after login and
                  gives you a real-time overview of every active event and
                  organizational metric.
                </p>

                <ImagePlaceholder
                  label="Full screenshot of the Operations Dashboard showing metric cards, live events panel, recent activity feed, and events table"
                  height="h-72"
                />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Dashboard layout
                </h3>
                <div className="space-y-0 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  <FeatureRow
                    icon="bar_chart_4_bars"
                    title="Metric cards (top row)"
                    desc="Five KPI tiles showing Total Events, Active Events, Guests Today, Pending Check-ins, and Open Service Requests. These auto-refresh every 90 seconds."
                  />
                  <FeatureRow
                    icon="event"
                    title="Live Events panel"
                    desc="Cards for every event currently running (status = In Progress). Each card shows real-time check-in progress, guest counts, open service calls, and active transport."
                  />
                  <FeatureRow
                    icon="dynamic_feed"
                    title="Recent Activity feed"
                    desc="Paginated list (5 items per page) of the latest operational logs across all events — check-ins, service tickets, transport updates, and registrations."
                  />
                  <FeatureRow
                    icon="table_chart"
                    title="Events table"
                    desc="Filterable table of all your events with name, venue, dates, status, and a Manage quick link. Search and filter by Live / Upcoming / Completed."
                  />
                  <FeatureRow
                    icon="pie_chart"
                    title="Summary stats (bottom)"
                    desc="Overall check-in rate, event breakdown (Live / Upcoming / Completed), and Quick Actions for common tasks."
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Navigating from the dashboard
                </h3>
                <p>
                  Click{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Manage
                  </strong>{" "}
                  on any event card or row to jump directly into that event's
                  workspace. Use the left sidebar to navigate between the main
                  sections of the platform.
                </p>

                <Note type="tip">
                  Use the search bar in the top navbar to filter the events
                  table as you type. You can also filter by status using the tab
                  pills above the table.
                </Note>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Left sidebar navigation
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["dashboard", "Dashboard", "Main operations overview"],
                    [
                      "calendar_month",
                      "Events",
                      "Event directory and management",
                    ],
                    [
                      "bar_chart_4_bars",
                      "Analytics",
                      "Cross-event performance metrics",
                    ],
                    [
                      "notifications",
                      "Activity",
                      "Activity and notification logs",
                    ],
                    ["tune", "Settings", "Profile, org and security settings"],
                  ].map(([icon, label, desc]) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span
                        className="material-symbols-outlined text-blue-600 dark:text-blue-400"
                        style={{ fontSize: "18px" }}
                      >
                        {icon}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {label}
                        </p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Note type="info">
                  On mobile devices the sidebar collapses into a bottom tab bar
                  with the same five navigation items.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                4. EVENTS
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="events">
              <SectionTitle
                id="events"
                icon="calendar_month"
                title="Managing Events"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Events Directory
                </h3>
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Events
                  </strong>{" "}
                  page (accessible from the sidebar) lists every event in your
                  organization. You can filter by status (All / Live Now /
                  Upcoming / Completed) and search by event name.
                </p>

                <ImagePlaceholder label="Events Directory page showing event cards in a 3-column grid with status badges (Live, Upcoming, Completed)" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Creating a new event
                </h3>
                <Step number="1" title="Click + Create Event">
                  From the Events page header or the Dashboard, click the{" "}
                  <em>Create Event</em> button.
                </Step>
                <Step number="2" title="Fill in core details">
                  <p className="mb-2">
                    Required field:{" "}
                    <strong className="text-slate-700 dark:text-slate-300">
                      Event Name
                    </strong>
                    .
                  </p>
                  <p>
                    Optional fields: Venue / Location, Start Date, End Date,
                    Description, and Privacy toggle (Private events hide the
                    event from public views).
                  </p>
                </Step>
                <Step number="3" title="Save and go to workspace">
                  Click <em>Create Event</em>. You'll be redirected to the
                  Events Directory. Click <em>Manage</em> on the new event to
                  open its workspace.
                </Step>

                <Note type="warning">
                  Event names must be unique within your organization. The start
                  date must be before the end date if both are provided.
                </Note>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Event status explained
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    [
                      "Live",
                      "green",
                      "Today's date falls within the event's start and end dates.",
                    ],
                    [
                      "Upcoming",
                      "blue",
                      "The event start date is in the future.",
                    ],
                    ["Completed", "slate", "The event end date has passed."],
                  ].map(([status, color, desc]) => (
                    <div
                      key={status}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <Badge label={status} color={color} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Event Workspace
                </h3>
                <p>
                  Each event has its own workspace with a tabbed interface.
                  Click <em>Manage</em> from the Events Directory or Dashboard
                  to open it.
                </p>

                <ImagePlaceholder
                  label="Event Workspace Shell showing the top navigation bar, event header with breadcrumb, status badge, and the horizontal tab bar with all 10 tabs"
                  height="h-48"
                />

                <p>The workspace tabs are:</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    [
                      "dashboard",
                      "Overview",
                      "Welcome card, live stats, recent activity",
                    ],
                    ["group", "Guests", "Guest master list and registration"],
                    ["meeting_room", "Rooms", "Room inventory and assignment"],
                    [
                      "how_to_reg",
                      "Check-in",
                      "Arrival and departure processing",
                    ],
                    [
                      "local_shipping",
                      "Transport",
                      "Fleet and driver coordination",
                    ],
                    ["room_service", "Service", "Service request tickets"],
                    ["schedule", "Schedule", "Multi-workstream timeline"],
                    ["analytics", "Reports", "Event summary dashboards"],
                    ["groups", "Team", "Staff and role management"],
                    ["settings", "Settings", "Event admin configuration"],
                  ].map(([icon, label, desc]) => (
                    <div
                      key={label}
                      className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                    >
                      <span
                        className="material-symbols-outlined text-blue-500 shrink-0 mt-0.5"
                        style={{ fontSize: "16px" }}
                      >
                        {icon}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {label}
                        </p>
                        <p className="text-[11px] text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Exporting event data
                </h3>
                <p>
                  In the event workspace header, click{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Export Data
                  </strong>{" "}
                  to download a full Excel workbook containing all guests,
                  rooms, service requests, transport logs, and activity data for
                  the event.
                </p>

                <Note type="tip">
                  Individual module CSVs (guests, services, transport) are also
                  available from the Reports tab inside the event workspace.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                5. GUESTS
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="guests">
              <SectionTitle id="guests" icon="group" title="Guest Management" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Guest Master List
                  </strong>{" "}
                  is the central registry of all attendees for an event. From
                  here you can add, edit, search, filter, and delete guests.
                </p>

                <ImagePlaceholder label="Guest Master List page showing the data table with columns: Name, Phone, Status, Room #, Arrival, Departure, and Actions" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Adding a guest
                </h3>
                <Step number="1" title="Click + Add Guest">
                  From the Guests tab in the event workspace, click the{" "}
                  <em>Add Guest</em> button in the top-right corner.
                </Step>
                <Step number="2" title="Fill the guest form">
                  <p className="mb-2">Required fields:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                    <li>Full Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Arrival date & time</li>
                  </ul>
                  <p>
                    Optional fields: Age, Group / Company name, VIP status
                    toggle, Departure datetime, Transport mode, and Special
                    requests / notes.
                  </p>
                </Step>
                <Step number="3" title="Save the guest">
                  Click <em>Confirm & Save Guest</em>. The guest appears
                  immediately in the master list.
                </Step>

                <ImagePlaceholder label="Guest Data Entry form split into two columns: Personal Information (left) and Logistics & Arrival (right)" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Guest fields reference
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                        <th className="text-left px-4 py-2.5 rounded-tl-lg">
                          Field
                        </th>
                        <th className="text-left px-4 py-2.5">Required</th>
                        <th className="text-left px-4 py-2.5 rounded-tr-lg">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        [
                          "Full Name",
                          "Yes",
                          "Guest's legal or preferred name displayed throughout the platform",
                        ],
                        [
                          "Email",
                          "Yes",
                          "Used for unique identification and future notification features",
                        ],
                        [
                          "Phone Number",
                          "Yes",
                          "Primary contact for on-site coordination",
                        ],
                        [
                          "Age",
                          "No",
                          "Optional demographic data used in analytics age distribution",
                        ],
                        [
                          "Group / Company",
                          "No",
                          "Allows grouping guests and filtering by delegation",
                        ],
                        [
                          "VIP Status",
                          "No",
                          "Toggle on to tag the guest as VIP — shows a star badge throughout",
                        ],
                        [
                          "Arrival Datetime",
                          "Yes",
                          "Expected arrival time used in the Check-in module",
                        ],
                        [
                          "Departure Datetime",
                          "No",
                          "Expected departure time for planning departures",
                        ],
                        [
                          "Transport Mode",
                          "No",
                          "How the guest is travelling (flight, car, shuttle, etc.)",
                        ],
                        [
                          "Special Requests",
                          "No",
                          "Free-text notes visible to ops staff during check-in",
                        ],
                      ].map(([field, req, desc]) => (
                        <tr
                          key={field}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                        >
                          <td className="px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                            {field}
                          </td>
                          <td className="px-4 py-2.5">
                            {req === "Yes" ? (
                              <Badge label="Required" color="blue" />
                            ) : (
                              <Badge label="Optional" color="slate" />
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 text-xs">
                            {desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Searching and filtering guests
                </h3>
                <p>
                  Use the search box above the table to search by name or room
                  number in real time (with 200ms debounce). Use the VIP and
                  Status dropdowns to filter the list further.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Editing and deleting guests
                </h3>
                <p>
                  Click the <em>Edit</em> pencil icon in the Actions column to
                  open the same form pre-filled with that guest's data. Click
                  the <em>Delete</em> bin icon to remove a guest — a
                  confirmation dialog will appear before deletion is processed.
                </p>

                <Note type="warning">
                  Deleting a guest is permanent and removes the guest from
                  check-in history, room assignments, and analytics. This action
                  cannot be undone.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                6. ROOMS
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="rooms">
              <SectionTitle
                id="rooms"
                icon="meeting_room"
                title="Room Inventory"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Room Inventory
                  </strong>{" "}
                  module tracks all physical spaces assigned to an event — hotel
                  rooms, suites, meeting rooms, or any other type of space you
                  need to manage.
                </p>

                <ImagePlaceholder label="Room Inventory page showing 4-column card grid with room cards displaying number, type, capacity bar, occupancy progress, and action buttons" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Adding a room
                </h3>
                <Step number="1" title="Click + Add Room">
                  In the Rooms tab, click the <em>Add Room</em> button.
                </Step>
                <Step number="2" title="Fill in room details">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Room Number / Name
                      </strong>{" "}
                      — e.g. "101" or "Executive Suite A" (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Capacity
                      </strong>{" "}
                      — maximum occupants (required, minimum 1)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Room Category
                      </strong>{" "}
                      — Standard Single, Double, Executive Suite, Meeting Room,
                      or ADA Accessible (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Notes
                      </strong>{" "}
                      — optional internal notes about amenities or access
                      restrictions
                    </li>
                  </ul>
                </Step>
                <Step number="3" title="Save">
                  Click <em>Add Room</em>. The room appears in the inventory
                  grid immediately.
                </Step>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Assigning guests to rooms
                </h3>
                <p>
                  On a room card where occupancy is below capacity, click{" "}
                  <em>Assign Guest</em>. A modal lists all guests who haven't
                  been assigned a room yet. Click any guest's name to assign
                  them. The occupancy bar updates instantly.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Room status indicators
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    [
                      "Available",
                      "green",
                      "Occupancy is 0 — no guests assigned.",
                    ],
                    [
                      "Partial",
                      "blue",
                      "Some guests assigned but capacity not reached.",
                    ],
                    ["Full", "blue", "All capacity slots are filled."],
                  ].map(([s, c, d]) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <Badge label={s} color={c} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {d}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Filtering and searching rooms
                </h3>
                <p>
                  Use the search input to filter by room number or type. Use the
                  status tabs (All Rooms / Available / Occupied) to narrow the
                  view. Rooms are paginated 20 per page for large inventories.
                </p>

                <Note type="tip">
                  Edit a room to update its capacity, category, or notes at any
                  time. Deleting a room will not affect guests already assigned
                  — they will remain registered but without a room assignment.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                7. CHECK-IN DESK
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="checkin">
              <SectionTitle
                id="checkin"
                icon="how_to_reg"
                title="Check-in Desk"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Check-in Operations Desk
                  </strong>{" "}
                  is a three-column Kanban board designed for real-time use
                  during event arrivals. It replaces spreadsheets and manual
                  systems with a live, click-to-action interface.
                </p>

                <ImagePlaceholder
                  label="Check-in Desk showing 3 columns: Arriving Today (blue header), Checked-in (green header), and Pending Arrivals (amber header) with guest cards in each"
                  height="h-64"
                />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  The three columns
                </h3>
                <div className="space-y-0 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  <FeatureRow
                    icon="schedule"
                    title="Arriving Today"
                    desc="Guests with an arrival datetime matching today's date. Shows scheduled arrival time. Click the Check-in button to process arrival."
                  />
                  <FeatureRow
                    icon="check_circle"
                    title="Checked-in"
                    desc="Guests who have been successfully checked in. Shows check-in timestamp and assigned room. Click Check-out to process departure."
                  />
                  <FeatureRow
                    icon="warning"
                    title="Pending Arrivals"
                    desc="Guests not yet checked in and whose arrival time has passed. Cards show a LATE badge. You can still check them in from this column."
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Processing a check-in
                </h3>
                <Step number="1" title="Find the guest">
                  Locate the guest card in the Arriving Today or Pending
                  Arrivals column. VIP guests are clearly tagged with a VIP
                  badge.
                </Step>
                <Step number="2" title="Click Check-in">
                  Click the blue <em>Check-in</em> button on the guest card. The
                  operation completes within a second.
                </Step>
                <Step number="3" title="Guest moves to Checked-in column">
                  The guest card disappears from its source column and appears
                  in the Checked-in column with the recorded timestamp.
                </Step>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Processing a check-out
                </h3>
                <p>
                  In the Checked-in column, click the <em>Check-out</em> button
                  on the guest's card. The guest is removed from the Checked-in
                  count and the operation is recorded in the activity log.
                </p>

                <Note type="info">
                  The desk auto-refreshes data. You can also manually click{" "}
                  <em>Refresh</em> in the footer status bar at the bottom of the
                  screen.
                </Note>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Status bar
                </h3>
                <p>
                  A fixed footer at the bottom of the screen shows a running
                  count of:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Total guests
                  </strong>
                  ,{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Checked-in
                  </strong>
                  , and{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Pending
                  </strong>{" "}
                  — always visible during operations.
                </p>

                <Note type="warning">
                  Check-in actions create activity log entries automatically. If
                  you accidentally check in the wrong guest, use the Check-out
                  button to reverse and contact your supervisor for a manual log
                  correction.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                8. TRANSPORT
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="transport">
              <SectionTitle
                id="transport"
                icon="local_shipping"
                title="Transport Coordination"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Transport Coordination Logs
                  </strong>{" "}
                  module tracks every vehicle deployment — from guest pickups at
                  airports to shuttle runs between venues. It replaces fleet
                  spreadsheets with a live, filterable log.
                </p>

                <ImagePlaceholder label="Transport Coordination page showing metric cards (Total, Scheduled, In Transit, Completed) and the transport table with status badges and progress bars" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Scheduling a transport
                </h3>
                <Step number="1" title="Click + Add Transport">
                  In the Transport tab, click the <em>Add Transport</em> button.
                </Step>
                <Step number="2" title="Fill transport details">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Guest
                      </strong>{" "}
                      (optional) — link to a registered guest, or leave blank
                      for group/shuttle runs
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Driver Name
                      </strong>{" "}
                      — chauffeur or driver assigned to this trip
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Vehicle Model & License
                      </strong>{" "}
                      — e.g. "Mercedes S-Class · XL 2049"
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Pickup Location
                      </strong>{" "}
                      (required) — where the vehicle picks up the guest
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Dropoff Location
                      </strong>{" "}
                      (required) — final destination
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Scheduled Time
                      </strong>{" "}
                      — date and time of the pickup
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Notes
                      </strong>{" "}
                      — any driver instructions or VIP requirements
                    </li>
                  </ul>
                </Step>
                <Step number="3" title="Save">
                  Click <em>Schedule Transport</em>. The trip appears in the log
                  with status <em>Scheduled</em>.
                </Step>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Updating transport status
                </h3>
                <p>
                  Click the three-dot menu (⋮) on any transport row to access
                  status actions:
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    [
                      "Scheduled",
                      "slate",
                      "Trip is planned but the vehicle has not departed yet.",
                    ],
                    [
                      "In Transit",
                      "blue",
                      "Vehicle has departed and is en route to the dropoff.",
                    ],
                    [
                      "Arrived",
                      "green",
                      "Guest has been delivered. Trip complete.",
                    ],
                    [
                      "Cancelled",
                      "red",
                      "Trip has been cancelled and will not proceed.",
                    ],
                  ].map(([s, c, d]) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <Badge label={s} color={c} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {d}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Filtering the transport log
                </h3>
                <p>
                  Use the status tabs above the table (All Trips / Scheduled /
                  In Transit / Arrived) to focus on active or completed trips.
                  The metric cards at the top update in real time as statuses
                  change.
                </p>

                <Note type="tip">
                  Export the full transport log as a CSV from the Reports tab
                  for post-event reconciliation with your fleet provider.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                9. SERVICES
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="services">
              <SectionTitle
                id="services"
                icon="room_service"
                title="Service Requests"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Service Request Logs
                  </strong>{" "}
                  module manages all guest-facing hospitality tickets:
                  housekeeping, maintenance, food & beverage, valet, and
                  miscellaneous requests.
                </p>

                <ImagePlaceholder label="Service Requests page showing the table with columns: Guest/Room, Request Type with icon, Status badge, Urgency badge, Notes, Time, and Actions dropdown" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Creating a service request
                </h3>
                <Step number="1" title="Click + Create Request">
                  In the Service tab, click the <em>Create Request</em> button.
                </Step>
                <Step number="2" title="Fill the request form">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Request Type
                      </strong>{" "}
                      — Housekeeping, Maintenance, Food & Beverage, Valet, or
                      Other (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Priority Level
                      </strong>{" "}
                      — Low, Medium, High, or Emergency (default: Medium)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Assigned Room
                      </strong>{" "}
                      — optional, links the ticket to a room
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Assigned Guest
                      </strong>{" "}
                      — optional, links the ticket to a guest profile
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Request Details / Notes
                      </strong>{" "}
                      — describe exactly what is needed
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Permission to Enter
                      </strong>{" "}
                      — checkbox indicating the guest authorized entry without
                      being present
                    </li>
                  </ul>
                </Step>
                <Step number="3" title="Submit ticket">
                  Click <em>Submit Ticket</em>. The request appears in the log
                  with status <em>Open</em>.
                </Step>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Request statuses
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    [
                      "Open",
                      "amber",
                      "Ticket created. Awaiting action from staff.",
                    ],
                    [
                      "In Progress",
                      "blue",
                      "A staff member has started working on the request.",
                    ],
                    ["Resolved", "green", "Request has been completed."],
                    [
                      "Cancelled",
                      "slate",
                      "Request was closed without being completed.",
                    ],
                  ].map(([s, c, d]) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <Badge label={s} color={c} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {d}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Managing requests
                </h3>
                <p>
                  Use the three-dot menu (⋮) on any row to: update status, edit
                  request details, or delete the request. Status can be changed
                  in one click — no need to open the form.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Filtering requests
                </h3>
                <p>
                  Use the search bar to search by guest name, room number, or
                  ticket ID. Use the Service Type and Status dropdowns to filter
                  the list. Clear all filters with the × button.
                </p>

                <Note type="danger">
                  Emergency requests trigger an immediate red badge. Resolve or
                  escalate them as fast as possible — they are also counted
                  separately in the analytics dashboard.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                10. SCHEDULE
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="schedule">
              <SectionTitle
                id="schedule"
                icon="schedule"
                title="Event Schedule"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Operational Event Schedule
                  </strong>{" "}
                  provides a Gantt-style timeline view of all event activities
                  organized by workstream. It is the single source of truth for
                  event programming.
                </p>

                <ImagePlaceholder
                  label="Schedule timeline view showing the sidebar with 5 workstreams (Main Sessions, Transport, Catering, Staffing, Media/AV), date tabs at the top, and colored activity blocks on the timeline grid"
                  height="h-72"
                />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Workstreams
                </h3>
                <p>
                  All activities are organized into five workstreams, each with
                  its own color and row in the timeline:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {[
                    [
                      "show_chart",
                      "Main Sessions",
                      "blue",
                      "Plenary sessions, keynotes, workshops",
                    ],
                    [
                      "local_shipping",
                      "Transport",
                      "amber",
                      "Pickup/dropoff schedules and fleet movements",
                    ],
                    [
                      "restaurant",
                      "Catering",
                      "green",
                      "Meal service, F&B stations, dietary requirements",
                    ],
                    [
                      "groups",
                      "Staffing",
                      "purple",
                      "Staff briefings, shift assignments, zone coverage",
                    ],
                    [
                      "videocam",
                      "Media/AV",
                      "red",
                      "AV setup, recording, live stream, staging",
                    ],
                  ].map(([icon, name, color, desc]) => (
                    <div
                      key={name}
                      className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <span
                        className={`material-symbols-outlined shrink-0 mt-0.5 text-${color}-500`}
                        style={{ fontSize: "18px" }}
                      >
                        {icon}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {name}
                        </p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Adding a schedule activity
                </h3>
                <Step number="1" title="Click + Add Schedule Block">
                  Click the button in the top-right of the Schedule tab, or
                  hover over an empty workstream row and click the inline{" "}
                  <em>+ Add Block to [Workstream]</em> button.
                </Step>
                <Step number="2" title="Fill the activity form">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Activity Title
                      </strong>{" "}
                      — descriptive name (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Workstream
                      </strong>{" "}
                      — which track this belongs to (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Status
                      </strong>{" "}
                      — Confirmed, Pending, Active, or Cancelled
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Start Time & End Time
                      </strong>{" "}
                      — datetime pickers (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Location / Venue
                      </strong>{" "}
                      — where this activity takes place
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Assigned Staff / Name
                      </strong>{" "}
                      — person responsible
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Activity Briefing / Notes
                      </strong>{" "}
                      — setup instructions, AV requirements, etc.
                    </li>
                  </ul>
                </Step>
                <Step number="3" title="Save Activity">
                  Click <em>Save Activity</em>. The block renders on the
                  timeline immediately at the correct position and width.
                </Step>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Navigating the timeline
                </h3>
                <p>
                  The timeline spans a full 24-hour period (00:00 to 23:59). Use
                  the{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    date tabs
                  </strong>{" "}
                  at the top to switch between event days. Scroll horizontally
                  within the timeline area to explore the full day.
                </p>
                <p className="mt-2">
                  Click any activity block to open the{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Activity Details
                  </strong>{" "}
                  side panel — showing full information including date, time,
                  location, assigned staff, and briefing notes. From this panel
                  you can also edit or delete the activity.
                </p>

                <Note type="info">
                  The timeline automatically generates date tabs for every day
                  within the event's start–end range, plus any days with
                  scheduled activities outside that range.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                11. TEAM
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="team">
              <SectionTitle id="team" icon="badge" title="Team Management" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Team Management
                  </strong>{" "}
                  module lets you register staff members for an event, assign
                  them operational roles, and track their active/inactive
                  status.
                </p>

                <ImagePlaceholder label="Team Management page showing the data table with member name, email, role badge, status indicator, last active timestamp, and actions column" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Adding a team member
                </h3>
                <Step number="1" title="Click + Add Member">
                  Click <em>Add Member</em> in the Team tab header.
                </Step>
                <Step number="2" title="Fill the form">
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Full Name
                      </strong>{" "}
                      (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Email Address
                      </strong>{" "}
                      (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Event Role
                      </strong>{" "}
                      — Event Director, Event Lead, Logistics, Floor Staff,
                      Technical Support, Guest Relations, or Admin (required)
                    </li>
                    <li>
                      <strong className="text-slate-700 dark:text-slate-300">
                        Initial Status
                      </strong>{" "}
                      — Active (On Duty) or Inactive (Off Duty)
                    </li>
                  </ul>
                </Step>
                <Step number="3" title="Save">
                  Click <em>Add Team Member</em>.
                </Step>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Managing team members
                </h3>
                <p>Click the three-dot menu (⋮) on any row to:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Edit Details
                    </strong>{" "}
                    — update name, email, or role
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Mark Active / Inactive
                    </strong>{" "}
                    — toggle duty status with one click
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Remove Access
                    </strong>{" "}
                    — permanently remove the staff member from this event
                  </li>
                </ul>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Summary cards
                </h3>
                <p>
                  At the bottom of the Team tab three summary cards show: Total
                  Members, Active Now (with percentage on duty), and Off Duty /
                  Inactive counts.
                </p>

                <Note type="info">
                  Team members are event-scoped — the same person can be added
                  to multiple events with different roles. They do not share a
                  platform login unless they sign up independently.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                12. ANALYTICS
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="analytics">
              <SectionTitle
                id="analytics"
                icon="analytics"
                title="Analytics & Reports"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  EventCure provides two analytics levels:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Event-level Reports
                  </strong>{" "}
                  (inside the event workspace) and{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Organization Analytics
                  </strong>{" "}
                  (from the main sidebar).
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Event Analytics Reports
                </h3>
                <p>
                  Open any event workspace and click the <em>Reports</em> tab to
                  access the full event analytics. This page has eight tabs:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    ["dashboard", "Overview", "KPI tiles + summary charts"],
                    [
                      "group",
                      "Guests",
                      "Check-in trend, arrival distribution, age breakdown",
                    ],
                    [
                      "meeting_room",
                      "Rooms",
                      "Occupancy rate, type breakdown, per-room utilization table",
                    ],
                    [
                      "room_service",
                      "Services",
                      "Request volume, urgency, resolution rate",
                    ],
                    [
                      "local_shipping",
                      "Transport",
                      "Trip status, top drivers, popular routes",
                    ],
                    ["badge", "Team", "Staff active rate, role distribution"],
                    [
                      "schedule",
                      "Schedule",
                      "Activity status pipeline and workstream breakdown",
                    ],
                    [
                      "timeline",
                      "Activity",
                      "Daily trend (7 days), log type & priority breakdown",
                    ],
                  ].map(([icon, tab, desc]) => (
                    <div
                      key={tab}
                      className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                    >
                      <span
                        className="material-symbols-outlined text-blue-500 shrink-0 mt-0.5"
                        style={{ fontSize: "16px" }}
                      >
                        {icon}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {tab}
                        </p>
                        <p className="text-[11px] text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <ImagePlaceholder
                  label="Event Analytics Reports page showing the tab bar and Overview tab with KPI cards, check-in by hour bars, service type breakdown, and room occupancy donut chart"
                  height="h-64"
                />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Exporting data
                </h3>
                <p>
                  From the Event Reports header, click the export buttons to
                  download:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Guests CSV
                    </strong>{" "}
                    — full guest list with all fields
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Services CSV
                    </strong>{" "}
                    — all service tickets with status and timestamps
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Transport CSV
                    </strong>{" "}
                    — all transport entries with route and status
                  </li>
                </ul>
                <p className="mt-2">
                  For a full workbook (all modules), use the{" "}
                  <em>Export Data</em> button in the event workspace header.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Organization Analytics Dashboard
                </h3>
                <p>
                  Access from the sidebar → <em>Analytics</em>. This cross-event
                  dashboard shows metrics aggregated across all your events with
                  five tabs:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Overview
                    </strong>{" "}
                    — total events, guests, check-in rate, monthly trends
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Guests
                    </strong>{" "}
                    — registration trend and check-in analysis
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Services
                    </strong>{" "}
                    — organization-wide service volume and resolution health
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Operations
                    </strong>{" "}
                    — room utilization, transport, team, and activity
                    distribution
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">
                      Events
                    </strong>{" "}
                    — sortable table of all events with KPIs per event
                  </li>
                </ul>

                <Note type="tip">
                  Use the date range filters in the Organization Analytics
                  header to restrict metrics to a specific time window, e.g. Q1
                  only.
                </Note>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Event Summary Dashboard (inside workspace)
                </h3>
                <p>
                  The <em>Reports</em> tab within an event workspace also
                  contains an{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Event Summary Dashboard
                  </strong>{" "}
                  with five operational tabs (Overview, Guests, Operations,
                  Schedule, Activity) and a <em>Get Full Report</em> button that
                  links to the detailed Event Analytics page.
                </p>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                13. SETTINGS
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="settings">
              <SectionTitle id="settings" icon="tune" title="Settings" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  Settings are split between two locations:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Organization Settings
                  </strong>{" "}
                  (global, accessed from the main sidebar) and{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Event Administrative Settings
                  </strong>{" "}
                  (per-event, inside the workspace).
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Organization Settings
                </h3>
                <p>
                  Navigate to <em>Settings</em> in the left sidebar. Five
                  sections are available via the sidebar nav:
                </p>
                <div className="space-y-0 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  <FeatureRow
                    icon="person"
                    title="Profile"
                    desc="Update your full name, job title, and timezone. Email address cannot be changed here."
                  />
                  <FeatureRow
                    icon="business"
                    title="Organization"
                    desc="Set organization name, industry, website, physical address, and primary contact details."
                  />
                  <FeatureRow
                    icon="palette"
                    title="Appearance"
                    desc="Choose between Light, Dark, or System theme. Synced to your account across devices."
                  />
                  <FeatureRow
                    icon="lock"
                    title="Security"
                    desc="Change your current password. Password strength indicator guides you to a strong choice."
                  />
                  <FeatureRow
                    icon="notifications_active"
                    title="Notifications"
                    desc="Master toggle for email notifications. Granular controls (check-in alerts, service alerts, weekly digest) also available."
                  />
                </div>

                <ImagePlaceholder label="Organization Settings page showing the sidebar with 5 tabs and the Profile section open with full name, email (disabled), job title, and timezone fields" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Event Administrative Settings
                </h3>
                <p>
                  Open an event workspace → click the <em>Settings</em> tab.
                  Four tabs are available:
                </p>
                <div className="space-y-0 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                  <FeatureRow
                    icon="info"
                    title="General Info"
                    desc="Edit event name, venue, dates, timezone, URL slug, description, banner message, and privacy setting."
                  />
                  <FeatureRow
                    icon="lock_person"
                    title="Permissions"
                    desc="Toggle public registration, manual approval requirement, guest self check-in, waitlist, and maximum capacity."
                  />
                  <FeatureRow
                    icon="notifications_active"
                    title="Notifications"
                    desc="Choose which events trigger admin notifications and set a dedicated notification email for this event."
                  />
                  <FeatureRow
                    icon="warning"
                    title="Danger Zone"
                    desc="Archive the event (hides it from active views, preserves all data) or permanently delete it (irreversible)."
                  />
                </div>

                <Note type="danger">
                  Permanently deleting an event removes all associated data
                  including guests, rooms, services, transport, schedule, team
                  members, and activity logs. This cannot be undone. You must
                  type the exact event name to confirm deletion.
                </Note>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Dark mode
                </h3>
                <p>Toggle dark mode from:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    The bottom of the left sidebar (click the sun/moon icon)
                  </li>
                  <li>Settings → Appearance → Theme selector</li>
                </ul>
                <p className="mt-2">
                  Three options are available:{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Light
                  </strong>
                  ,{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Dark
                  </strong>
                  , and{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    System
                  </strong>{" "}
                  (follows your OS setting). Your preference is saved to your
                  account and synced across devices.
                </p>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                14. ACTIVITY LOGS
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-10" id="notifications">
              <SectionTitle
                id="notifications"
                icon="notifications"
                title="Activity & Notification Logs"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <p>
                  The{" "}
                  <strong className="text-slate-700 dark:text-slate-300">
                    Activity & Notification Logs
                  </strong>{" "}
                  page (sidebar → Activity) is a real-time audit trail of every
                  operational event across all your managed events. It
                  auto-refreshes every 30 seconds.
                </p>

                <ImagePlaceholder label="Activity Logs page showing summary stat pills at the top, filter bar with search/event/type/priority/date filters, and the live activity feed with colored left-accent borders by priority" />

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-3">
                  Log types
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    [
                      "how_to_reg",
                      "Check-in",
                      "Guest check-in / check-out events",
                    ],
                    [
                      "person_add",
                      "Registration",
                      "New guest registration records",
                    ],
                    [
                      "room_service",
                      "Service",
                      "Service request creation and updates",
                    ],
                    ["local_shipping", "Transport", "Transport status changes"],
                    [
                      "meeting_room",
                      "Room Assignment",
                      "Guest-to-room assignment events",
                    ],
                    ["schedule", "Schedule", "Schedule activity changes"],
                  ].map(([icon, type, desc]) => (
                    <div
                      key={type}
                      className="flex items-start gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                    >
                      <span
                        className="material-symbols-outlined text-blue-500 shrink-0 mt-0.5"
                        style={{ fontSize: "16px" }}
                      >
                        {icon}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {type}
                        </p>
                        <p className="text-[11px] text-slate-400">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Priority levels
                </h3>
                <div className="flex flex-col gap-2">
                  {[
                    [
                      "Critical",
                      "red",
                      "Emergency service requests or critical system events. Shown with a pulsing red left border.",
                    ],
                    [
                      "High",
                      "amber",
                      "High-priority service tickets and important operational flags.",
                    ],
                    [
                      "Normal",
                      "slate",
                      "Standard operational activity — the majority of log entries.",
                    ],
                  ].map(([level, color, desc]) => (
                    <div
                      key={level}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                    >
                      <Badge label={level} color={color} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Filtering logs
                </h3>
                <p>Use the filter bar to narrow the feed by:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Free-text search (searches message content)</li>
                  <li>Event (filter to a specific event)</li>
                  <li>Log type (check-in, service, transport, etc.)</li>
                  <li>Priority (critical, high, normal)</li>
                  <li>Date range (from → to)</li>
                </ul>
                <p className="mt-2">
                  Active filters appear as removable chips below the filter bar.
                  Click × on any chip to remove that filter. Click{" "}
                  <em>Clear</em> to reset all filters at once.
                </p>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-6 mb-3">
                  Exporting logs
                </h3>
                <p>
                  Click <em>Export CSV</em> to download the currently filtered
                  log set as a CSV file with columns: Time, Event, Type,
                  Priority, Message, Guest, and Venue.
                </p>
              </div>
            </section>
            <Divider />

            {/* ══════════════════════════════════════
                15. FAQ & TROUBLESHOOTING
            ══════════════════════════════════════ */}
            <section className="scroll-mt-24 pb-6" id="faq">
              <SectionTitle
                id="faq"
                icon="help_outline"
                title="FAQ & Troubleshooting"
              />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-6 text-[15px]">
                {[
                  {
                    q: "I didn't receive the OTP email during sign-up. What do I do?",
                    a: "Check your spam or junk folder first. If it's not there, wait 60 seconds and click Resend Code on the verification screen. Make sure the email address you entered is correct and the inbox is active. If the issue persists, contact support@eventcure.io.",
                  },
                  {
                    q: "Can I import guests from a CSV file?",
                    a: "Bulk CSV import is on the product roadmap. Currently, guests must be added individually through the Add Guest form or via the API (available on Operations and Enterprise plans). For large imports, contact support for assisted onboarding.",
                  },
                  {
                    q: "Why is my event showing as 'Completed' even though it's still running?",
                    a: "The event status is calculated automatically from the Start Date and End Date fields. If the End Date has passed, the event shows as Completed. Go to Event Settings → General Info and update the End Date to the correct date.",
                  },
                  {
                    q: "Can multiple staff members use the platform simultaneously for the same event?",
                    a: "Yes. Each team member should have their own EventCure account. There is no concurrent user limit. All operations are reflected in real time across all active sessions.",
                  },
                  {
                    q: "A guest was accidentally checked in. How do I undo this?",
                    a: "Go to the Check-in Desk → Checked-in column, find the guest, and click Check-out. This records a check-out event and removes them from the checked-in count. The original check-in log entry will remain in the Activity Logs for audit purposes.",
                  },
                  {
                    q: "How do I delete a guest without deleting the whole event?",
                    a: "Go to the Guests tab → find the guest → click the delete (trash) icon in the Actions column. A confirmation dialog will appear. Confirm deletion. Note that this is permanent and removes the guest from all reports.",
                  },
                  {
                    q: "The dashboard metrics look stale. How do I refresh them?",
                    a: "The dashboard auto-refreshes every 90 seconds. For an immediate update, click the Refresh button (circular arrow icon) in the top-right of the dashboard header. The 'Updated' timestamp confirms the last refresh time.",
                  },
                  {
                    q: "Can I change the event name after creating it?",
                    a: "Yes. Go to Event Workspace → Settings tab → General Info → update the Event Name field and click Save Changes. The name updates everywhere immediately.",
                  },
                  {
                    q: "What happens to my data if I archive an event?",
                    a: "Archiving hides the event from active operations views (Dashboard, Events Directory filters) but preserves all data — guests, rooms, service tickets, transport, schedule, and analytics. You can unarchive at any time from Event Settings → Danger Zone.",
                  },
                  {
                    q: "Is there a mobile app?",
                    a: "EventCure is a fully responsive web application optimized for mobile browsers. The bottom tab bar navigation on mobile gives full access to all platform features. A native iOS/Android app is under consideration for a future release.",
                  },
                  {
                    q: "How do I contact support?",
                    a: "Email support@eventcure.io for general queries. For urgent operational issues during a live event, use the subject line URGENT. Our team aims to respond within 2 business hours for Operations and Enterprise customers.",
                  },
                ].map(({ q, a }) => (
                  <div
                    key={q}
                    className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50">
                      <span
                        className="material-symbols-outlined text-blue-500 shrink-0 mt-0.5"
                        style={{
                          fontSize: "18px",
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        help
                      </span>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {q}
                      </p>
                    </div>
                    <div className="p-4 pt-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {a}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-start gap-4">
                  <span
                    className="material-symbols-outlined text-blue-500 shrink-0 mt-0.5"
                    style={{
                      fontSize: "24px",
                      fontVariationSettings: "'FILL' 1",
                    }}
                  >
                    support_agent
                  </span>
                  <div>
                    <p className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                      Still need help?
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                      Our support team is available at{" "}
                      <strong>support@eventcure.io</strong>. For legal queries,
                      contact <strong>legal@eventcure.io</strong>. For API and
                      developer support, visit{" "}
                      <strong>docs.eventcure.io</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
            <p>
              © {new Date().getFullYear()} EventCure Hospitality Platform. All
              rights reserved.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                to="/privacy"
                className="hover:text-blue-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-blue-500 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
