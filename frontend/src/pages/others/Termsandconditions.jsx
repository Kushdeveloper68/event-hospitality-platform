import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms", icon: "handshake" },
  { id: "definitions", title: "Definitions", icon: "book" },
  {
    id: "account",
    title: "Account Registration & Security",
    icon: "manage_accounts",
  },
  { id: "license", title: "License & Permitted Use", icon: "verified" },
  { id: "prohibited", title: "Prohibited Activities", icon: "block" },
  { id: "data", title: "Data & Privacy", icon: "shield" },
  { id: "payment", title: "Payment & Billing", icon: "credit_card" },
  { id: "ip", title: "Intellectual Property", icon: "copyright" },
  { id: "liability", title: "Limitation of Liability", icon: "gavel" },
  { id: "termination", title: "Termination", icon: "cancel" },
  { id: "governing", title: "Governing Law", icon: "balance" },
  { id: "changes", title: "Changes to Terms", icon: "update" },
  { id: "contact", title: "Contact Information", icon: "contact_support" },
];

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

function Section({ id, icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
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
      <div className="prose-content pl-0 md:pl-13 space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
        {children}
      </div>
      <div className="mt-8 border-b border-slate-100 dark:border-slate-800" />
    </section>
  );
}

function Highlight({ children }) {
  return (
    <div className="my-4 flex gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
      <span
        className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5"
        style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
      >
        warning
      </span>
      <p className="text-amber-800 dark:text-amber-300 text-sm font-medium leading-relaxed">
        {children}
      </p>
    </div>
  );
}

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("acceptance");
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
              Terms & Conditions
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
                Last updated: January 15, 2026
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="size-14 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{
                    fontSize: "28px",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  gavel
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  Terms & Conditions
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-2xl">
                  Please read these terms carefully before using EventCure's
                  hospitality management platform. By accessing or using our
                  services, you agree to be bound by these terms.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      calendar_today
                    </span>
                    Effective: January 15, 2026
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      verified
                    </span>
                    Legally Reviewed
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-10">
            {/* 1. Acceptance */}
            <Section
              id="acceptance"
              icon="handshake"
              title="Acceptance of Terms"
            >
              <p>
                Welcome to EventCure ("Company", "we", "our", or "us"). These
                Terms and Conditions ("Terms") govern your access to and use of
                the EventCure hospitality management platform, including our
                website, mobile applications, APIs, and all related services
                (collectively, the "Service").
              </p>
              <p>
                By creating an account, clicking "I Agree," or otherwise
                accessing or using the Service, you acknowledge that you have
                read, understood, and agree to be bound by these Terms and our
                Privacy Policy. If you do not agree to these Terms, do not
                access or use the Service.
              </p>
              <Highlight>
                If you are using the Service on behalf of an organization, you
                represent and warrant that you have the authority to bind that
                organization to these Terms. In that case, "you" refers to both
                you individually and the organization.
              </Highlight>
              <p>
                These Terms apply to all users of the Service, including event
                organizers, hospitality managers, staff members, and any other
                persons who access or use the Service.
              </p>
            </Section>

            {/* 2. Definitions */}
            <Section id="definitions" icon="book" title="Definitions">
              <p>
                For the purposes of these Terms, the following definitions
                apply:
              </p>
              <div className="mt-4 space-y-3">
                {[
                  [
                    "Platform / Service",
                    "The EventCure web application, mobile applications, APIs, and all associated features including guest management, room assignment, check-in operations, transport coordination, service requests, scheduling, and analytics.",
                  ],
                  [
                    "User / You",
                    "Any individual or organization that creates an account and uses the Service, including Event Directors, Operations Managers, and Staff Members.",
                  ],
                  [
                    "Event",
                    "A hospitality event created and managed through the Platform, including conferences, summits, weddings, and corporate gatherings.",
                  ],
                  [
                    "Guest Data",
                    "Information about event attendees entered into the Platform, including names, contact details, room assignments, arrival times, and special requests.",
                  ],
                  [
                    "Content",
                    "All data, text, files, information, usernames, images, graphics, and other materials uploaded, posted, or transmitted through the Service.",
                  ],
                  [
                    "Subscription",
                    "A paid plan granting access to the Service for a defined period and feature set.",
                  ],
                  [
                    "Organization",
                    "A company or entity that has registered for an EventCure account and manages one or more Events.",
                  ],
                ].map(([term, def]) => (
                  <div
                    key={term}
                    className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 min-w-[160px] shrink-0 text-sm">
                      {term}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-sm">
                      {def}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* 3. Account */}
            <Section
              id="account"
              icon="manage_accounts"
              title="Account Registration & Security"
            >
              <p>
                To access most features of the Service, you must register for an
                account. When registering, you agree to provide accurate,
                current, and complete information and to update such information
                to keep it accurate, current, and complete.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Account Eligibility:
                </strong>{" "}
                You must be at least 18 years of age and capable of forming a
                binding contract to create an account. By registering, you
                represent that you meet these requirements.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Email Verification:
                </strong>{" "}
                Upon registration, you will receive a one-time password (OTP) to
                your provided email address. Account activation requires
                successful verification of this OTP within 10 minutes of
                issuance.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Account Security:
                </strong>{" "}
                You are solely responsible for maintaining the confidentiality
                of your account credentials and for all activities that occur
                under your account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Use a strong, unique password of at least 8 characters</li>
                <li>Never share your credentials with unauthorized parties</li>
                <li>
                  Immediately notify us of any unauthorized access or security
                  breach
                </li>
                <li>
                  Log out of your account after each session on shared devices
                </li>
              </ul>
              <p>
                EventCure will not be liable for any loss or damage arising from
                your failure to maintain the security of your account.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  One Account Per Organization:
                </strong>{" "}
                Each organization should maintain a single primary account.
                Creating multiple accounts to circumvent usage limits or pricing
                is prohibited.
              </p>
            </Section>

            {/* 4. License */}
            <Section
              id="license"
              icon="verified"
              title="License & Permitted Use"
            >
              <p>
                Subject to your compliance with these Terms and payment of
                applicable fees, EventCure grants you a limited, non-exclusive,
                non-transferable, revocable license to access and use the
                Service for your internal business purposes.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Permitted Uses include:
                </strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Creating and managing hospitality events for your organization
                </li>
                <li>
                  Registering and managing guest data for events you organize
                </li>
                <li>
                  Using analytics and reporting features to improve event
                  operations
                </li>
                <li>
                  Integrating the Service via our API within your authorized
                  usage limits
                </li>
                <li>Exporting your own data in supported formats (CSV, PDF)</li>
                <li>Training your staff members on the use of the Platform</li>
              </ul>
              <p>
                This license does not include the right to sublicense, sell,
                resell, transfer, assign, or otherwise exploit the Service;
                collect or harvest any personally identifiable information; use
                the Service to send unsolicited communications; or access the
                Service using automated means without our prior written consent.
              </p>
            </Section>

            {/* 5. Prohibited */}
            <Section id="prohibited" icon="block" title="Prohibited Activities">
              <p>
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  [
                    "Security Violations",
                    "Attempting to probe, scan, or test system vulnerabilities or breach security measures",
                  ],
                  [
                    "Data Scraping",
                    "Scraping, crawling, or extracting data from the Platform without authorization",
                  ],
                  [
                    "Impersonation",
                    "Impersonating any person or entity or misrepresenting your affiliation",
                  ],
                  [
                    "Harmful Content",
                    "Uploading malicious code, viruses, or any content that could damage the Service",
                  ],
                  [
                    "Reverse Engineering",
                    "Decompiling, disassembling, or reverse engineering any part of the Service",
                  ],
                  [
                    "Reselling",
                    "Reselling or sublicensing access to the Service without written authorization",
                  ],
                  [
                    "Interference",
                    "Interfering with or disrupting the integrity or performance of the Service",
                  ],
                  [
                    "Illegal Use",
                    "Using the Service for any unlawful purpose or in violation of any applicable law",
                  ],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="flex gap-2.5 p-3 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl"
                  >
                    <span
                      className="material-symbols-outlined text-red-500 shrink-0 mt-0.5"
                      style={{
                        fontSize: "16px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      cancel
                    </span>
                    <div>
                      <p className="text-sm font-bold text-red-700 dark:text-red-400">
                        {title}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4">
                Violation of these prohibitions may result in immediate account
                suspension or termination, and may expose you to civil or
                criminal liability. We reserve the right to investigate and take
                appropriate legal action.
              </p>
            </Section>

            {/* 6. Data & Privacy */}
            <Section id="data" icon="shield" title="Data & Privacy">
              <p>
                Your privacy is important to us. Our Privacy Policy,
                incorporated herein by reference, explains how we collect, use,
                and protect your information. By using the Service, you consent
                to our data practices as described in the Privacy Policy.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Guest Data Responsibility:
                </strong>{" "}
                You are the data controller for all Guest Data you enter into
                the Platform. You represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  You have obtained all necessary consents from guests to
                  collect and process their data
                </li>
                <li>
                  The Guest Data does not violate any applicable privacy laws
                  including GDPR, CCPA, or similar regulations
                </li>
                <li>
                  You will promptly notify us of any data breaches involving
                  Guest Data
                </li>
                <li>
                  You will honor data deletion requests from guests as required
                  by applicable law
                </li>
              </ul>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Data Security:
                </strong>{" "}
                We implement industry-standard security measures including TLS
                1.3 encryption in transit, AES-256 encryption at rest, JWT-based
                authentication with per-event ownership isolation, and regular
                security audits. However, no method of transmission over the
                Internet is 100% secure.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Data Retention:
                </strong>{" "}
                We retain your data for as long as your account is active or as
                needed to provide the Service. You may export or delete your
                data at any time through the Platform's event settings.
              </p>
              <Highlight>
                EventCure does not sell your personal data or Guest Data to
                third parties. We do not use your data to train AI models or for
                advertising purposes.
              </Highlight>
            </Section>

            {/* 7. Payment */}
            <Section id="payment" icon="credit_card" title="Payment & Billing">
              <p>
                Certain features of the Service require payment of fees. By
                selecting a paid plan, you agree to pay the applicable fees as
                described on our pricing page.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Billing:
                </strong>{" "}
                Fees are charged per event or on a subscription basis as
                selected. All fees are in Indian Rupees (INR) unless otherwise
                stated. Payment is due at the time of subscription or event
                creation.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Refund Policy:
                </strong>{" "}
                We offer refunds within 7 days of purchase if the Service has
                not been substantially used. After this period, fees are
                non-refundable. To request a refund, contact
                support@eventcure.io.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Failed Payments:
                </strong>{" "}
                If your payment fails, we will notify you and provide a grace
                period to update your payment method. Continued failure to pay
                may result in suspension of your account.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Taxes:
                </strong>{" "}
                You are responsible for all applicable taxes, levies, or duties
                imposed by taxing authorities. We will add applicable GST to
                your invoices as required by Indian law.
              </p>
            </Section>

            {/* 8. IP */}
            <Section id="ip" icon="copyright" title="Intellectual Property">
              <p>
                The Service, including its original content, features,
                functionality, design, code, and all associated intellectual
                property rights, is and will remain the exclusive property of
                EventCure and its licensors.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Your Content:
                </strong>{" "}
                You retain ownership of all Content you submit to the Service.
                By submitting Content, you grant EventCure a worldwide,
                royalty-free, non-exclusive license to use, reproduce, and
                process your Content solely to provide and improve the Service.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Feedback:
                </strong>{" "}
                If you provide feedback, suggestions, or ideas about the
                Service, you grant us an irrevocable, perpetual, royalty-free
                license to use such feedback without compensation to you.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Trademarks:
                </strong>{" "}
                "EventCure," the EventCure logo, and all related marks are
                trademarks or registered trademarks of EventCure. You may not
                use our marks without prior written permission.
              </p>
              <p>
                Our Service may contain open-source software components subject
                to their respective licenses. A list of such components and
                their licenses is available upon request.
              </p>
            </Section>

            {/* 9. Liability */}
            <Section
              id="liability"
              icon="gavel"
              title="Limitation of Liability"
            >
              <Highlight>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, EVENTCURE
                SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
                REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </Highlight>
              <p>
                In no event shall EventCure's total liability to you for all
                damages, losses, and causes of action exceed the greater of (a)
                the amount paid by you to EventCure in the twelve (12) months
                preceding the claim, or (b) ₹10,000 INR.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Indemnification:
                </strong>{" "}
                You agree to indemnify, defend, and hold harmless EventCure and
                its officers, directors, employees, and agents from and against
                any claims, liabilities, damages, losses, and expenses arising
                from your use of the Service, your violation of these Terms, or
                your violation of any third-party rights.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Disclaimer of Warranties:
                </strong>{" "}
                The Service is provided "AS IS" and "AS AVAILABLE" without
                warranties of any kind, either express or implied, including but
                not limited to implied warranties of merchantability, fitness
                for a particular purpose, and non-infringement.
              </p>
            </Section>

            {/* 10. Termination */}
            <Section id="termination" icon="cancel" title="Termination">
              <p>
                Either party may terminate the relationship governed by these
                Terms at any time.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  By You:
                </strong>{" "}
                You may terminate your account at any time by using the account
                deletion feature in your settings or by contacting our support
                team. Upon termination, your right to use the Service will
                immediately cease.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  By EventCure:
                </strong>{" "}
                We may suspend or terminate your account immediately, without
                prior notice or liability, for any reason, including but not
                limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Breach of these Terms</li>
                <li>Failure to pay applicable fees</li>
                <li>Illegal or fraudulent activity</li>
                <li>Extended periods of inactivity (12+ months)</li>
                <li>Requests from law enforcement or government agencies</li>
              </ul>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Effect of Termination:
                </strong>{" "}
                Upon termination, all licenses granted herein will immediately
                terminate. You may export your data for 30 days after
                termination, after which all data will be permanently deleted.
                Sections on Intellectual Property, Limitation of Liability, and
                Governing Law survive termination.
              </p>
            </Section>

            {/* 11. Governing Law */}
            <Section id="governing" icon="balance" title="Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to its conflict of law
                provisions.
              </p>
              <p>
                Any dispute arising out of or relating to these Terms or the
                Service shall be subject to the exclusive jurisdiction of the
                courts located in Ahmedabad, Gujarat, India. You waive any
                objection to the exercise of jurisdiction over you by such
                courts and to venue in such courts.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Dispute Resolution:
                </strong>{" "}
                Before initiating formal legal proceedings, you agree to first
                attempt to resolve any dispute informally by contacting us at
                legal@eventcure.io. We will attempt to resolve disputes within
                30 days of receipt.
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">
                  Class Action Waiver:
                </strong>{" "}
                You agree that any dispute resolution proceedings will be
                conducted only on an individual basis and not in a class,
                consolidated, or representative action.
              </p>
            </Section>

            {/* 12. Changes */}
            <Section id="changes" icon="update" title="Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Sending an email notification to your registered email address
                </li>
                <li>Displaying a prominent notice within the Service</li>
                <li>
                  Updating the "Last Updated" date at the top of this page
                </li>
              </ul>
              <p>
                Your continued use of the Service after the effective date of
                the revised Terms constitutes your acceptance of the changes. If
                you do not agree to the new Terms, you must stop using the
                Service.
              </p>
              <p>
                We encourage you to review these Terms periodically. The most
                current version will always be available at eventcure.io/terms.
              </p>
            </Section>

            {/* 13. Contact */}
            <Section
              id="contact"
              icon="contact_support"
              title="Contact Information"
            >
              <p>
                If you have any questions about these Terms, please contact us
                through any of the following channels:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "mail",
                    label: "Email",
                    value: "legal@eventcure.io",
                    sub: "For legal inquiries",
                  },
                  {
                    icon: "support_agent",
                    label: "Support",
                    value: "support@eventcure.io",
                    sub: "For general support",
                  },
                  {
                    icon: "location_on",
                    label: "Address",
                    value: "Ahmedabad, Gujarat, India",
                    sub: "Registered office",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <span
                      className="material-symbols-outlined text-blue-500 mb-2 block"
                      style={{
                        fontSize: "20px",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {item.icon}
                    </span>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      {item.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">
                We aim to respond to all inquiries within 2 business days. For
                urgent matters, please mark your email as "URGENT" in the
                subject line.
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
                to="/privacy"
                className="hover:text-blue-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/manual"
                className="hover:text-blue-500 transition-colors"
              >
                User Manual
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
