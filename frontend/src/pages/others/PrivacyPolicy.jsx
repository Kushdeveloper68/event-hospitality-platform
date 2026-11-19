import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "overview", title: "Overview", icon: "shield" },
  {
    id: "information-collected",
    title: "Information We Collect",
    icon: "database",
  },
  { id: "how-we-use", title: "How We Use Your Information", icon: "settings" },
  { id: "sharing", title: "Information Sharing", icon: "share" },
  { id: "guest-data", title: "Guest Data & You", icon: "group" },
  { id: "data-security", title: "Data Security", icon: "lock" },
  { id: "data-retention", title: "Data Retention", icon: "history" },
  { id: "your-rights", title: "Your Rights", icon: "verified_user" },
  { id: "cookies", title: "Cookies & Tracking", icon: "cookie" },
  { id: "international", title: "International Transfers", icon: "public" },
  { id: "children", title: "Children's Privacy", icon: "child_care" },
  { id: "third-party", title: "Third-Party Services", icon: "hub" },
  { id: "changes", title: "Changes to This Policy", icon: "update" },
  { id: "contact", title: "Contact & DPO", icon: "contact_support" },
];

function TOCItem({ section, active, onClick }) {
  return (
    <button
      onClick={() => onClick(section.id)}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 ${
        active
          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 font-semibold"
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

function Section({ id, icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-primary-600 dark:text-primary-400"
            style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-13 space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
        {children}
      </div>
      <div className="mt-8 border-b border-slate-100 dark:border-slate-800" />
    </section>
  );
}

function Highlight({ children, type = "warning" }) {
  const config = {
    warning: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20",
      text: "text-amber-800 dark:text-amber-300",
      icon: "warning",
      iconColor: "text-amber-500",
    },
    info: {
      bg: "bg-primary-50 dark:bg-primary-500/10",
      border: "border-primary-200 dark:border-primary-500/20",
      text: "text-primary-800 dark:text-primary-300",
      icon: "info",
      iconColor: "text-primary-500",
    },
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/20",
      text: "text-emerald-800 dark:text-emerald-300",
      icon: "check_circle",
      iconColor: "text-emerald-500",
    },
  };
  const c = config[type];
  return (
    <div
      className={`my-4 flex gap-3 p-4 ${c.bg} border ${c.border} rounded-xl`}
    >
      <span
        className={`material-symbols-outlined ${c.iconColor} shrink-0 mt-0.5`}
        style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
      >
        {c.icon}
      </span>
      <p className={`${c.text} text-sm font-medium leading-relaxed`}>
        {children}
      </p>
    </div>
  );
}

function DataTable({ rows }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full min-w-[480px] text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            {Object.keys(rows[0]).map((key) => (
              <th
                key={key}
                className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              {Object.values(row).map((val, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-slate-700 dark:text-slate-300"
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RightCard({ icon, title, desc, color = "blue" }) {
  const colorMap = {
    blue: "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-primary-100 dark:border-primary-900/40",
    green:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40",
    purple:
      "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40",
    amber:
      "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40",
  };
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${colorMap[color]}`}>
      <span
        className="material-symbols-outlined shrink-0 mt-0.5"
        style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <div>
        <p className="font-bold text-sm mb-0.5">{title}</p>
        <p className="text-xs opacity-80 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Top bar */}
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
              Privacy Policy
            </span>
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

      {/* Mobile TOC overlay */}
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">
              Contents
            </p>
            <nav className="space-y-1">
              {sections.map((s) => (
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
        {/* Sidebar TOC */}
        <aside className="hidden md:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
              Contents
            </p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
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
                Last updated: November 2026
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{
                    fontSize: "28px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  privacy_tip
                </span>
              </div>
              <div>
                <h1 className="font-display text-page-h1 text-slate-900 dark:text-white mb-2">
                  Privacy Policy
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-2xl">
                  EventCure is committed to protecting your privacy and the
                  privacy of the guests managed through our platform. This
                  policy explains exactly what data we collect, how we use it,
                  and the controls you have over it.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      calendar_today
                    </span>
                    Effective: November 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      update
                    </span>
                    Version 2.1
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      verified
                    </span>
                    GDPR-aligned
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      security
                    </span>
                    No data selling
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-10">
            {/* 1. Overview */}
            <Section id="overview" icon="shield" title="Overview">
              <p>
                This Privacy Policy applies to EventCure ("Company", "we",
                "our", or "us") and describes how we collect, use, disclose, and
                safeguard information when you use the EventCure hospitality
                management platform, including our website, web application (and its installable app version), and APIs (collectively, the "Service").
              </p>
              <p>
                EventCure operates as both a{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  data controller
                </strong>{" "}
                (for account and organizational data we collect about you) and a{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  data processor
                </strong>{" "}
                (for guest data you enter into the platform on behalf of your
                events).
              </p>
              <Highlight type="success">
                EventCure does not sell, rent, or trade your personal data or
                guest data to any third party. We do not use your data to train
                AI/ML models, serve advertisements, or share with data brokers.
                Your data exists solely to power the Service you have subscribed
                to.
              </Highlight>
              <p>
                By using the Service, you agree to the collection and use of
                information as described in this policy. If you do not agree,
                please discontinue using the Service. This policy is
                incorporated into and subject to our Terms and Conditions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <RightCard
                  icon="business"
                  title="Data controller"
                  desc="We control how your account and organizational information is used"
                  color="blue"
                />
                <RightCard
                  icon="settings"
                  title="Data processor"
                  desc="We process guest data only on your documented instructions"
                  color="purple"
                />
                <RightCard
                  icon="lock"
                  title="Encrypted at rest & transit"
                  desc="Encrypted in transit (HTTPS) and at rest by our cloud providers"
                  color="green"
                />
                <RightCard
                  icon="delete"
                  title="Right to erasure"
                  desc="You can delete your data and event records at any time"
                  color="amber"
                />
              </div>
            </Section>

            {/* 2. Information We Collect */}
            <Section
              id="information-collected"
              icon="database"
              title="Information We Collect"
            >
              <p>
                We collect different categories of information depending on how
                you interact with our Service. Below is a full breakdown.
              </p>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                A. Account & Registration Information
              </p>
              <p>
                When you create an EventCure account, we collect the information
                you provide directly:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>Full name</li>
                <li>Email address (used as your login identifier)</li>
                <li>
                  Password (stored as a bcrypt hash — we never store plain-text
                  passwords)
                </li>
                <li>Organization name, plus any organization details you choose to add in Settings (job title, industry, website, address, primary contact)</li>
                <li>If you sign in with Google: your Google name, email and the link to your Google profile photo</li>
              </ul>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                B. Guest Data (Entered by You)
              </p>
              <p>
                When you use EventCure to manage hospitality events, you enter
                guest information on behalf of your organization. This data is
                processed by us but controlled by you as the data controller. It
                may include:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>Guest full name, email address, and phone number</li>
                <li>Age, group/company affiliation</li>
                <li>
                  VIP status and special requests (including dietary or
                  accessibility needs)
                </li>
                <li>Room assignment and accommodation preferences</li>
                <li>Arrival and departure datetimes</li>
                <li>Transport mode and logistics details</li>
                <li>Check-in and check-out timestamps</li>
              </ul>
              <Highlight type="warning">
                Guest data is considered sensitive operational data. You are
                responsible for ensuring you have obtained appropriate consent
                from your event guests before entering their personal
                information into EventCure.
              </Highlight>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                C. Usage & Technical Data
              </p>
              <p>
                We automatically collect certain technical data when you use the
                Service:
              </p>

              <DataTable
                rows={[
                  {
                    "Data Type": "IP address",
                    Purpose: "Security, rate limiting, abuse prevention",
                    Retention: "Server logs, kept per our hosting provider's log retention",
                  },
                  {
                    "Data Type": "Browser type & device",
                    Purpose: "Compatibility, support",
                    Retention: "Server logs, kept per our hosting provider's log retention",
                  },
                  {
                    "Data Type": "Error logs & API request logs",
                    Purpose: "Bug fixing, reliability, rate limiting",
                    Retention: "Server logs, kept per our hosting provider's log retention",
                  },
                  {
                    "Data Type": "Activity log entries",
                    Purpose: "In-app record of actions taken inside your events (check-ins, room assignments, imports…)",
                    Retention: "Until the event is deleted",
                  },
                  {
                    "Data Type": "Signup source (link tag or referring site)",
                    Purpose: "Understanding which channels bring new users",
                    Retention: "Life of account",
                  },
                ]}
              />

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                D. Communications Data
              </p>
              <p>
                If you contact our support team, respond to surveys, or send us
                feedback, we retain those communications to improve our Service
                and provide support context. This includes email content,
                support ticket details, and any attachments you share.
              </p>
            </Section>

            {/* 3. How We Use */}
            <Section
              id="how-we-use"
              icon="settings"
              title="How We Use Your Information"
            >
              <p>
                We use collected information only for the purposes described
                below. We do not use your data for purposes incompatible with
                what is disclosed here without your explicit consent.
              </p>

              <div className="mt-4 space-y-3">
                {[
                  {
                    title: "Providing and maintaining the Service",
                    desc: "Processing your logins, serving your dashboard, executing API requests, storing your event data, and delivering the platform features you use.",
                    basis: "Contract performance",
                    icon: "check_circle",
                  },
                  {
                    title: "Account management",
                    desc: "Sending transactional emails (account verification OTP, password reset, welcome email) and maintaining your profile.",
                    basis: "Contract performance",
                    icon: "manage_accounts",
                  },
                  {
                    title: "Security and fraud prevention",
                    desc: "Enforcing rate limits, reviewing activity logs, investigating security incidents, and protecting the integrity of the platform and other users.",
                    basis: "Legitimate interests",
                    icon: "security",
                  },
                  {
                    title: "Product improvement",
                    desc: "Looking at aggregate counts in our own database (for example, which signup channels lead to created events) to understand what is useful and prioritize development. Individual user behavior is never shared.",
                    basis: "Legitimate interests",
                    icon: "trending_up",
                  },
                  {
                    title: "Customer support",
                    desc: "Responding to your support requests, troubleshooting issues, and providing onboarding assistance. Support agents may access your account data only when resolving your reported issue.",
                    basis: "Contract performance",
                    icon: "support_agent",
                  },
                  {
                    title: "Legal compliance",
                    desc: "Retaining records required by applicable law, responding to lawful government or court requests, and exercising or defending legal claims.",
                    basis: "Legal obligation",
                    icon: "gavel",
                  },
                  {
                    title: "Service communications",
                    desc: "Sending important notices about changes to the Service, scheduled maintenance, security alerts, and updates to our Terms or Privacy Policy. These cannot be opted out of as they are necessary to the Service.",
                    basis: "Legitimate interests / Contract",
                    icon: "notifications_active",
                  },
                  {
                    title: "Optional marketing (with consent)",
                    desc: "If you opt in, we may send newsletters, product update emails, and event management tips. You can unsubscribe from these at any time via the unsubscribe link or by emailing hello.eventcure@gmail.com.",
                    basis: "Consent",
                    icon: "mail",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <span
                      className="material-symbols-outlined text-primary-500 shrink-0 mt-0.5"
                      style={{
                        fontSize: "18px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </p>
                        <span className="text-[10px] font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          {item.basis}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 4. Sharing */}
            <Section id="sharing" icon="share" title="Information Sharing">
              <p>
                We do not sell, rent, or share your personal data or guest data
                with third parties for their own commercial purposes. The
                following describes the limited circumstances in which we may
                share data:
              </p>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Service Providers (Sub-processors)
              </p>
              <p>
                We engage trusted third-party vendors who process data on our
                behalf under the data-processing terms these providers offer. They process data only to provide their service to us.
              </p>

              <DataTable
                rows={[
                  {
                    Vendor: "MongoDB Atlas",
                    Purpose: "Primary database hosting",
                    Location: "Provider data centres",
                    Data: "All platform data",
                  },
                  {
                    Vendor: "Render",
                    Purpose: "Backend (API) hosting",
                    Location: "Provider data centres",
                    Data: "All API requests and the data they carry",
                  },
                  {
                    Vendor: "Vercel",
                    Purpose: "Frontend hosting (CDN)",
                    Location: "Global edge",
                    Data: "Static files; request metadata (IP, browser)",
                  },
                  {
                    Vendor: "Google",
                    Purpose: "Sign in with Google; sends our verification and notification emails (Gmail API)",
                    Location: "Global",
                    Data: "Name, email, profile photo link; email recipient and message",
                  },
                  {
                    Vendor: "YouTube / Google Fonts",
                    Purpose: "Embedded tutorial video (loads only when you press play) and web fonts",
                    Location: "Global",
                    Data: "IP address and browser details when loaded",
                  },
                ]}
              />

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Legal Disclosures
              </p>
              <p>
                We may disclose your information if required to do so by law or
                in the good faith belief that such action is necessary to:
                comply with a legal obligation or court order; protect and
                defend the rights or property of EventCure; prevent or
                investigate possible wrongdoing in connection with the Service;
                protect the personal safety of users of the Service or the
                public; or protect against legal liability.
              </p>
              <p>
                We will notify you of any such request to the extent permitted
                by law before disclosing your information.
              </p>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Business Transfers
              </p>
              <p>
                If EventCure is involved in a merger, acquisition, or sale of
                all or a portion of its assets, your information may be
                transferred as part of that transaction. We will provide notice
                before your personal information is transferred and becomes
                subject to a different privacy policy.
              </p>

              <Highlight type="info">
                We never share your guest data with other EventCure customers or
                organizations. Each organization's data is strictly isolated
                with per-event ownership controls enforced at the database
                level.
              </Highlight>
            </Section>

            {/* 5. Guest Data & You */}
            <Section id="guest-data" icon="group" title="Guest Data & You">
              <p>
                When you use EventCure to manage events, you enter personal
                information about your guests (attendees, delegates, VIPs). The
                privacy obligations for this data are shared between you and
                EventCure:
              </p>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Your Responsibilities as Data Controller
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-sm">
                <li>
                  Obtaining valid consent or establishing a legal basis for
                  collecting and processing each guest's personal data
                </li>
                <li>
                  Providing guests with appropriate privacy notices explaining
                  how their data will be used
                </li>
                <li>
                  Handling data subject requests from guests (access,
                  correction, deletion) within applicable legal timeframes
                </li>
                <li>
                  Ensuring the data you enter is accurate and limited to what is
                  necessary for the event
                </li>
                <li>
                  Notifying EventCure of any data breaches involving guest data
                  that you become aware of
                </li>
                <li>
                  Complying with all applicable data protection laws including
                  GDPR, PDPA (India), CCPA, and others relevant to your
                  jurisdiction
                </li>
              </ul>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Our Responsibilities as Data Processor
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-sm">
                <li>
                  Processing guest data only on your documented instructions and
                  for the purposes of delivering the Service
                </li>
                <li>
                  Ensuring all personnel who access guest data are bound by
                  confidentiality obligations
                </li>
                <li>
                  Implementing and maintaining appropriate technical and
                  organizational security measures
                </li>
                <li>
                  Assisting you in fulfilling data subject requests to the
                  extent technically possible
                </li>
                <li>
                  Notifying you within 72 hours of becoming aware of a personal
                  data breach affecting guest data
                </li>
                <li>
                  Deleting or returning guest data upon termination of our
                  contractual relationship
                </li>
              </ul>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Guest Data Export & Deletion
              </p>
              <p>
                You can export all guest data for any event at any time using
                the CSV export feature in the Analytics & Reports section. You
                can permanently delete an event and all its associated guest
                data from Event Settings → Danger Zone. Deletion is irreversible
                and takes effect immediately.
              </p>
              <Highlight type="warning">
                If one of your event guests contacts you requesting access to,
                correction of, or deletion of their personal data, you are
                required to honor that request. You can use EventCure's guest
                management tools to locate and update or delete their records.
                We can assist with bulk operations — contact
                hello.eventcure@gmail.com.
              </Highlight>
            </Section>

            {/* 6. Security */}
            <Section id="data-security" icon="lock" title="Data Security">
              <p>
                We take the security of your data extremely seriously. EventCure
                implements industry-standard and best-practice security controls
                across all layers of the platform:
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: "lan",
                    title: "Encryption in transit",
                    desc: "All data between your browser and our servers is sent over HTTPS (TLS). Our hosting providers redirect plain HTTP to HTTPS.",
                  },
                  {
                    icon: "storage",
                    title: "Encryption at rest",
                    desc: "Data stored in our database is encrypted at rest by our cloud database provider.",
                  },
                  {
                    icon: "key",
                    title: "JWT authentication",
                    desc: "All API requests require a valid JSON Web Token. Tokens expire after 7 days and are cleared when you log out. The session cookie is HttpOnly, and Secure in production.",
                  },
                  {
                    icon: "domain_verification",
                    title: "Per-event data isolation",
                    desc: "Event data is protected by ownership checks: each request is verified against the signed-in organization that owns the event.",
                  },
                  {
                    icon: "password",
                    title: "Password hashing",
                    desc: "Passwords are hashed using bcrypt with a cost factor of 10 before storage. Plain-text passwords are never stored or logged anywhere.",
                  },
                  {
                    icon: "mail_lock",
                    title: "Email verification & OTP",
                    desc: "Account registration requires email OTP verification. Password resets use time-limited (10-minute) OTP codes sent only to your registered email.",
                  },
                  {
                    icon: "monitor_heart",
                    title: "Security monitoring",
                    desc: "We rate-limit API endpoints to prevent abuse and keep an activity log of actions taken inside your events.",
                  },
                  {
                    icon: "security_update_good",
                    title: "Dependency management",
                    desc: "We keep third-party dependencies up to date and patch known security vulnerabilities as they are identified.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
                  >
                    <span
                      className="material-symbols-outlined text-emerald-500 shrink-0 mt-0.5"
                      style={{
                        fontSize: "18px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Highlight type="warning">
                While we implement strong security measures, no method of
                transmission over the Internet or electronic storage is 100%
                secure. If you discover a security vulnerability in EventCure,
                please report it responsibly to hello.eventcure@gmail.com rather
                than disclosing it publicly.
              </Highlight>

              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Breach Notification:
                </strong>{" "}
                In the event of a data breach that affects your data, we will
                notify you within 72 hours of becoming aware of the breach, as
                required by applicable law. Our notification will describe the
                nature of the breach, categories of data affected, likely
                consequences, and measures taken to address it.
              </p>
            </Section>

            {/* 7. Data Retention */}
            <Section id="data-retention" icon="history" title="Data Retention">
              <p>
                We retain your personal data only for as long as necessary to
                fulfill the purposes for which it was collected, maintain your
                account, comply with legal obligations, resolve disputes, and
                enforce our agreements.
              </p>

              <DataTable
                rows={[
                  {
                    "Data Category": "Account profile & credentials",
                    "Retention Period": "While your account exists; deleted on request (see below)",
                    Basis: "Contract",
                  },
                  {
                    "Data Category": "Event & guest data",
                    "Retention Period": "Until you delete the event; no auto-expiry",
                    Basis: "Contract (your control)",
                  },
                  {
                    "Data Category": "Support communications",
                    "Retention Period": "Kept while needed to resolve your request",
                    Basis: "Legitimate interest",
                  },
                  {
                    "Data Category": "Server & security logs",
                    "Retention Period": "Per our hosting providers' log retention",
                    Basis: "Legitimate interest",
                  },
                  {
                    "Data Category": "Signup source",
                    "Retention Period": "Life of account",
                    Basis: "Legitimate interest",
                  },
                ]}
              />

              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Account deletion:
                </strong>{" "}
                There is no self-serve account deletion yet. To close your account, email hello.eventcure@gmail.com from your registered address; we will delete your account, events, guest records and associated data from our systems within 30 days of verifying your request. (You can already delete individual events yourself — see below.)
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Event deletion:
                </strong>{" "}
                Deleting an individual event immediately removes all associated
                guest data, room assignments, service requests, transport logs,
                schedules, and activity logs. This action is permanent and
                immediate — there is no grace period for event-level deletion.
              </p>
            </Section>

            {/* 8. Your Rights */}
            <Section id="your-rights" icon="verified_user" title="Your Rights">
              <p>
                Depending on your location, you may have various rights
                regarding your personal data. EventCure respects and supports
                all of the following rights for all users regardless of
                jurisdiction:
              </p>

              <div className="mt-4 space-y-3">
                {[
                  {
                    right: "Right of Access",
                    desc: "You have the right to request a copy of all personal data we hold about you and information about how it is processed.",
                    how: "Email hello.eventcure@gmail.com with subject 'Data Access Request'. We will respond within 30 days.",
                    icon: "visibility",
                    color: "blue",
                  },
                  {
                    right: "Right to Rectification",
                    desc: "You have the right to correct inaccurate or incomplete personal data we hold about you.",
                    how: "Update your information directly in Settings → Profile or Organization. Contact us for records you cannot update yourself.",
                    icon: "edit",
                    color: "green",
                  },
                  {
                    right: "Right to Erasure ('Right to be Forgotten')",
                    desc: "You have the right to request deletion of your personal data, subject to certain legal retention obligations.",
                    how: "Delete individual events in Event Settings → Danger Zone. To delete your account, email hello.eventcure@gmail.com.",
                    icon: "delete_forever",
                    color: "amber",
                  },
                  {
                    right: "Right to Restrict Processing",
                    desc: "You have the right to request that we limit how we process your personal data while a dispute or objection is pending.",
                    how: "Contact hello.eventcure@gmail.com. We will acknowledge within 72 hours and implement restrictions within 30 days.",
                    icon: "pause_circle",
                    color: "purple",
                  },
                  {
                    right: "Right to Data Portability",
                    desc: "You have the right to receive your personal data in a structured, machine-readable format and transfer it to another service.",
                    how: "Use the Export CSV function in Analytics & Reports for guest data. Account data exports are available upon request.",
                    icon: "download",
                    color: "blue",
                  },
                  {
                    right: "Right to Object",
                    desc: "You have the right to object to processing of your data based on legitimate interests or for direct marketing purposes.",
                    how: "Use the unsubscribe link in any marketing email, or contact hello.eventcure@gmail.com with the processing you object to.",
                    icon: "do_not_disturb",
                    color: "amber",
                  },
                  {
                    right: "Right to Withdraw Consent",
                    desc: "Where processing is based on consent, you may withdraw that consent at any time without affecting lawfulness of prior processing.",
                    how: "Adjust notification preferences in Settings, or contact hello.eventcure@gmail.com for consent-based processing.",
                    icon: "cancel",
                    color: "purple",
                  },
                  {
                    right: "Right to Lodge a Complaint",
                    desc: "You have the right to lodge a complaint with your local data protection authority if you believe we have mishandled your data.",
                    how: "India: contact the Data Protection Board. EU: contact your national DPA. We encourage you to contact us first so we can resolve concerns directly.",
                    icon: "report",
                    color: "green",
                  },
                ].map((item) => {
                  const colorMap = {
                    blue: "border-primary-100 dark:border-primary-900/40 bg-primary-50/30 dark:bg-primary-900/10",
                    green:
                      "border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-900/10",
                    amber:
                      "border-amber-100 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-900/10",
                    purple:
                      "border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-900/10",
                  };
                  const iconColorMap = {
                    blue: "text-primary-500",
                    green: "text-emerald-500",
                    amber: "text-amber-500",
                    purple: "text-purple-500",
                  };
                  return (
                    <div
                      key={item.right}
                      className={`p-4 rounded-xl border ${colorMap[item.color]}`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`material-symbols-outlined ${iconColorMap[item.color]} shrink-0 mt-0.5`}
                          style={{
                            fontSize: "18px",
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          {item.icon}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.right}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">
                            <span className="font-semibold">
                              How to exercise:{" "}
                            </span>
                            {item.how}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4">
                We will respond to all verified rights requests within 30 days.
                If a request is complex or numerous, we may extend this period
                by up to two additional months, in which case we will notify you
                of the extension and the reason.
              </p>
            </Section>

            {/* 9. Cookies */}
            <Section id="cookies" icon="cookie" title="Cookies & Tracking">
              <p>
                EventCure uses one session cookie and a few items in your browser's local storage to keep you signed in and remember your preferences. We do not use analytics or advertising trackers. Here is the complete list:
              </p>

              <DataTable
                rows={[
                  {
                    "Cookie Name": "authToken (cookie)",
                    Type: "Essential",
                    Purpose: "HttpOnly JWT that keeps you signed in",
                    Duration: "Up to 7 days, or until you log out",
                  },
                  {
                    "Cookie Name": "authToken, user (local storage)",
                    Type: "Essential",
                    Purpose: "Keeps your signed-in session and basic profile available to the app",
                    Duration: "Until you log out (the token itself expires after 7 days)",
                  },
                  {
                    "Cookie Name": "app-theme (local storage)",
                    Type: "Preference",
                    Purpose: "Stores your light/dark mode preference",
                    Duration: "Until you clear it",
                  },
                  {
                    "Cookie Name": "ec_attribution (local storage)",
                    Type: "Functional",
                    Purpose: "Remembers which link brought you to EventCure, so we know which channel a signup came from",
                    Duration: "30 days",
                  },
                  {
                    "Cookie Name": "pwa-install-dismissed-at (local storage)",
                    Type: "Preference",
                    Purpose: "Remembers that you dismissed the install-app prompt",
                    Duration: "7 days",
                  },
                ]}
              />

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                What we do NOT use
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>No advertising or tracking pixels from ad networks</li>
                <li>
                  No social media tracking (Facebook Pixel, LinkedIn Insight,
                  etc.)
                </li>
                <li>
                  No third-party analytics or advertising services that profile individual users. If we add privacy-friendly analytics in future, we will update this policy first
                </li>
                <li>No cross-site tracking or fingerprinting technologies</li>
              </ul>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Third-party content
              </p>
              <p>
                The tutorial video on our landing page (YouTube) and our web
                fonts (Google Fonts) are loaded from Google's servers, which
                receive your IP address and browser details when they load. The
                video only loads when you press play, and YouTube may set its
                own cookies at that point. The installable app also stores the
                app's own files (not your event data) in your browser's cache
                so it loads faster.
              </p>

              <p className="font-bold text-slate-800 dark:text-slate-200 mt-4">
                Managing Cookies
              </p>
              <p>
                Essential cookies cannot be disabled as they are required for
                the Service to function. You can clear preferences by clearing your browser's cookies and site data for eventcure.in. Disabling
                essential cookies will log you out of the Service.
              </p>
            </Section>

            {/* 10. International */}
            <Section
              id="international"
              icon="public"
              title="International Data Transfers"
            >
              <p>
                EventCure is based in India. Our infrastructure providers (MongoDB Atlas, Render, Vercel and Google) may process data in the United States and other regions. If you access the
                Service from the European Economic Area (EEA), United Kingdom,
                or other regions with specific data transfer requirements, your
                information may be transferred to and processed in countries
                that may not have equivalent data protection laws to your own.
              </p>
              <p>
                For transfers of personal data from the EEA to countries not
                deemed adequate by the European Commission, we rely on the
                following safeguards:
              </p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-sm">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">
                    Standard Contractual Clauses (SCCs):
                  </strong>{" "}
                  Our infrastructure providers offer the EU Commission-approved SCCs as part of their standard data-processing terms, which apply to our use of their services.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">
                    Adequacy decisions:
                  </strong>{" "}
                  Where applicable, we rely on European Commission adequacy
                  decisions for certain destination countries.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">
                    Supplementary measures:
                  </strong>{" "}
                  Data is encrypted in transit (HTTPS) and at rest by our providers.
                </li>
              </ul>
              <p>
                You may request a copy of the applicable transfer mechanisms we
                use by contacting hello.eventcure@gmail.com.
              </p>
            </Section>

            {/* 11. Children's Privacy */}
            <Section id="children" icon="child_care" title="Children's Privacy">
              <p>
                The EventCure platform is a professional business-to-business
                service intended for use by organizations and their authorized
                staff. The Service is not directed to children under the age of
                18, and we do not knowingly collect personal information from
                anyone under 18.
              </p>
              <p>
                If you are a parent or guardian and believe that your child
                under 18 has provided us with personal information, please
                contact us immediately at hello.eventcure@gmail.com. Upon
                verification, we will take prompt steps to delete that
                information from our systems.
              </p>
              <Highlight type="warning">
                If your event involves attendees who are minors (under 18), you
                as the event organizer bear full responsibility for obtaining
                appropriate parental or guardian consent before entering their
                personal data into the EventCure platform, in compliance with
                applicable child privacy laws.
              </Highlight>
            </Section>

            {/* 12. Third-Party Services */}
            <Section id="third-party" icon="hub" title="Third-Party Services">
              <p>
                The EventCure platform may contain links to third-party websites
                and integrations with third-party services. This Privacy Policy
                applies only to the EventCure Service and does not cover the
                privacy practices of any third-party websites, applications, or
                services that you may access through links in the Service.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Google OAuth:
                </strong>{" "}
                EventCure offers sign-in via Google OAuth 2.0. When you
                authenticate via Google, we receive only the information you
                authorize Google to share (typically your name, email, and
                profile photo). We save the link to your Google profile photo
                and show it as your avatar inside EventCure; the image itself
                stays on Google's servers, and the link is refreshed each time
                you sign in with Google. We do not access your Google contacts, Drive,
                Calendar, or other Google services. Google's privacy policy
                governs Google's handling of your authentication data.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Future integrations:
                </strong>{" "}
                As we add new integrations and third-party features, we will
                update this policy to reflect any new data sharing arrangements.
                We will notify you of any material changes.
              </p>
            </Section>

            {/* 13. Changes */}
            <Section id="changes" icon="update" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or for
                other operational reasons. We will notify you of any material
                changes through:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
                <li>
                  An email notification to your registered email address at
                  least 14 days before the changes take effect
                </li>
                <li>
                  A prominent in-app banner within the EventCure dashboard
                </li>
                <li>An updated "Last Updated" date at the top of this page</li>
              </ul>
              <p>
                For minor changes that do not materially affect your rights or
                how we process your data (such as grammatical corrections or
                clarifications), we may update the policy without advance
                notice.
              </p>
              <p>
                Your continued use of the Service after the effective date of
                the revised Privacy Policy constitutes your acceptance of the
                changes. If you disagree with the revised policy, you may delete
                your account and discontinue use of the Service.
              </p>
              <p>
                All previous versions of our Privacy Policy are available upon
                request by contacting hello.eventcure@gmail.com.
              </p>
            </Section>

            {/* 14. Contact & DPO */}
            <Section
              id="contact"
              icon="contact_support"
              title="Contact & Data Protection Officer"
            >
              <p>
                If you have questions, concerns, or requests relating to this
                Privacy Policy or EventCure's data practices, please reach out
                to us through any of the following channels. We aim to respond
                within 5 business days for general inquiries and within the
                legally required timeframes for formal rights requests.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "privacy_tip",
                    label: "Privacy Inquiries",
                    value: "hello.eventcure@gmail.com",
                    sub: "General privacy questions & rights requests",
                    color: "blue",
                  },
                  {
                    icon: "security",
                    label: "Security Reports",
                    value: "hello.eventcure@gmail.com",
                    sub: "Vulnerability disclosures & breach reports",
                    color: "amber",
                  },
                  {
                    icon: "gavel",
                    label: "Legal / DPO",
                    value: "hello.eventcure@gmail.com",
                    sub: "Data processing agreements & legal requests",
                    color: "purple",
                  },
                  {
                    icon: "location_on",
                    label: "Registered Address",
                    value: "Ahmedabad, Gujarat, India",
                    sub: "EventCure Hospitality Platform",
                    color: "green",
                  },
                ].map((item) => {
                  const colorMap = {
                    blue: "bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-900/30 text-primary-600 dark:text-primary-400",
                    amber:
                      "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400",
                    purple:
                      "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-400",
                    green:
                      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400",
                  };
                  return (
                    <div
                      key={item.label}
                      className={`p-4 rounded-xl border ${colorMap[item.color]}`}
                    >
                      <span
                        className="material-symbols-outlined mb-2 block"
                        style={{
                          fontSize: "20px",
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        {item.icon}
                      </span>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold mt-1">{item.value}</p>
                      <p className="text-xs opacity-70 mt-0.5">{item.sub}</p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-sm">
                <strong className="text-slate-800 dark:text-slate-200">
                  Response time commitments:
                </strong>{" "}
                General inquiries within 5 business days. Formal data subject
                rights requests within 30 calendar days (extendable to 90 days
                for complex requests with notice). Security vulnerability
                reports acknowledged within 24 hours.
              </p>
              <p>
                If you are not satisfied with our response to your privacy
                concern, you have the right to lodge a complaint with your
                national or regional data protection authority. In India, this
                is the Data Protection Board of India. In the EU, contact your
                national supervisory authority (list available at
                edpb.europa.eu).
              </p>
            </Section>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
            <p>
              © {new Date().getFullYear()} EventCure Hospitality Platform. All
              rights reserved.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                to="/terms"
                className="hover:text-primary-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/manual"
                className="hover:text-primary-500 transition-colors"
              >
                User Manual
              </Link>
              <Link to="/" className="hover:text-primary-500 transition-colors">
                Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}