import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const sections = [
  { id: "overview", icon: "info", title: "How Import Works" },
  { id: "guests", icon: "group", title: "Guest CSV Format" },
  { id: "rooms", icon: "meeting_room", title: "Room CSV Format" },
  { id: "team", icon: "badge", title: "Team CSV Format" },
  { id: "troubleshooting", icon: "help_outline", title: "Troubleshooting" },
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
        style={{ fontSize: "16px", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
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
      <div className="size-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0">
        <span
          className="material-symbols-outlined text-primary-600 dark:text-primary-400"
          style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

function Note({ type = "info", children }) {
  const styles = {
    info: { bg: "bg-primary-50 dark:bg-primary-500/10", border: "border-primary-200 dark:border-primary-500/20", icon: "info", iconColor: "text-primary-500", text: "text-primary-800 dark:text-primary-300" },
    tip: { bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20", icon: "lightbulb", iconColor: "text-emerald-500", text: "text-emerald-800 dark:text-emerald-300" },
    warning: { bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20", icon: "warning", iconColor: "text-amber-500", text: "text-amber-800 dark:text-amber-300" },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${s.bg} ${s.border} my-4`}>
      <span className={`material-symbols-outlined shrink-0 mt-0.5 ${s.iconColor}`} style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
        {s.icon}
      </span>
      <p className={`text-sm leading-relaxed ${s.text}`}>{children}</p>
    </div>
  );
}

function ColumnTable({ columns }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden my-5">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60">
          <tr>
            <th className="px-4 py-2.5 font-bold text-slate-500 text-xs uppercase tracking-wide">Column</th>
            <th className="px-4 py-2.5 font-bold text-slate-500 text-xs uppercase tracking-wide">Required?</th>
            <th className="px-4 py-2.5 font-bold text-slate-500 text-xs uppercase tracking-wide">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {columns.map((c) => (
            <tr key={c.key}>
              <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800 dark:text-white whitespace-nowrap">{c.key}</td>
              <td className="px-4 py-3">
                {c.required ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">Required</span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">Optional</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm">{c.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CsvExample({ header, rows }) {
  return (
    <div className="my-5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-900">
      <table className="w-full text-left text-xs font-mono whitespace-nowrap">
        <thead>
          <tr className="text-emerald-400">
            {header.map((h) => (
              <th key={h} className="px-3 py-2 font-bold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-800">
              {r.map((cell, j) => (
                <td key={j} className="px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DownloadTemplateButton({ href, label }) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors my-4"
    >
      <span className="material-symbols-outlined text-[18px]">download</span>
      {label}
    </a>
  );
}

function Divider() {
  return <div className="mt-10 mb-10 border-b border-slate-100 dark:border-slate-800" />;
}

export default function ImportGuide() {
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
      { rootMargin: "-15% 0px -75% 0px" }
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
              <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">EventCure</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">CSV Import Guide</span>
            <Link to="/manual" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>menu_book</span>
              Full User Manual
            </Link>
            <button
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>menu</span>
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">Contents</p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <TOCItem key={s.id} section={s} active={activeSection === s.id} onClick={scrollTo} />
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Contents</p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <TOCItem key={s.id} section={s} active={activeSection === s.id} onClick={scrollTo} />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">CSV Import Guide</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-10">
              Add guests, rooms or team members in bulk by uploading a CSV file, instead of entering them one by one.
            </p>

            {/* ── OVERVIEW ── */}
            <section className="scroll-mt-24 pb-6" id="overview">
              <SectionTitle id="overview" icon="info" title="How Import Works" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 text-[15px]">
                <p>Each bulk-add screen (Guests, Rooms, Team) has an <strong>Import CSV</strong> button next to the regular Add button. Clicking it opens a dialog where you:</p>
                <ol className="list-decimal list-inside space-y-1.5 ml-2">
                  <li>Download the sample template (correct column headers, pre-filled with an example row)</li>
                  <li>Fill it in with your data, using any spreadsheet app (Excel, Google Sheets) and export/save it as <strong>.csv</strong></li>
                  <li>Upload the file — you'll see a preview of the first few rows before anything is saved</li>
                  <li>Click Import — rows are added one by one; if a few rows have errors, the rest still import successfully</li>
                </ol>
                <Note type="tip">
                  After importing, you'll see exactly how many rows succeeded and, for any that failed, which row number and why — so you can fix just those and re-import them.
                </Note>
                <Note type="warning">
                  The first row of your CSV must be the column headers (exactly as shown below, lowercase). Don't rename them — the importer matches columns by name, not by position.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ── GUESTS ── */}
            <section className="scroll-mt-24 pb-6" id="guests">
              <SectionTitle id="guests" icon="group" title="Guest CSV Format" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                <p>Used on the <strong>Guests</strong> tab inside an event workspace.</p>
                <DownloadTemplateButton href="/templates/guests-template.csv" label="Download Guest Template (.csv)" />
                <ColumnTable
                  columns={[
                    { key: "fullName", required: true, notes: "Guest's full name" },
                    { key: "email", required: false, notes: "Used for confirmations, if you send any" },
                    { key: "phoneNumber", required: false, notes: "Any format — stored as text" },
                    { key: "age", required: false, notes: "Whole number" },
                    { key: "groupName", required: false, notes: "e.g. family name, company name, delegation" },
                    { key: "vipStatus", required: false, notes: "true or false (leave blank for false)" },
                    { key: "arrivalDatetime", required: true, notes: "Expected arrival — powers the Check-in tab's \"arriving today\" list" },
                    { key: "departureDatetime", required: false, notes: "Expected departure" },
                    { key: "specialRequests", required: false, notes: "Dietary needs, accessibility notes, etc." },
                  ]}
                />
                <Note type="warning">
                  <strong>Date format:</strong> write arrival and departure as <code>YYYY-MM-DD HH:mm</code> (24-hour clock), e.g. <code>2026-11-20 14:00</code>. A date with no time, e.g. <code>2026-11-20</code>, is also accepted and is treated as midnight. Any other format will fail that row.
                  <br />
                  <strong>arrivalDatetime is required</strong> — same as the manual Add Guest form — because the Check-in tab uses it to show who's arriving today. departureDatetime is optional.
                </Note>
                <p className="font-semibold text-slate-800 dark:text-white mt-6 mb-1">Example</p>
                <CsvExample
                  header={["fullName", "email", "phoneNumber", "age", "groupName", "vipStatus", "arrivalDatetime", "departureDatetime", "specialRequests"]}
                  rows={[
                    ["Rahul Mehta", "rahul@example.com", "9876543210", "34", "Mehta Family", "true", "2026-11-20 14:00", "2026-11-23 11:00", "Vegetarian meal"],
                    ["Priya Shah", "priya@example.com", "9876501234", "29", "Mehta Family", "false", "2026-11-20 16:30", "2026-11-22 10:00", ""],
                  ]}
                />
                <Note type="info">
                  Room assignment and check-in status are not set during import — add guests first, then assign rooms from the Rooms tab and check them in from the Check-in tab as they arrive.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ── ROOMS ── */}
            <section className="scroll-mt-24 pb-6" id="rooms">
              <SectionTitle id="rooms" icon="meeting_room" title="Room CSV Format" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                <p>Used on the <strong>Rooms</strong> tab inside an event workspace.</p>
                <DownloadTemplateButton href="/templates/rooms-template.csv" label="Download Room Template (.csv)" />
                <ColumnTable
                  columns={[
                    { key: "number", required: true, notes: "Room number / identifier, e.g. 101, A-204" },
                    { key: "capacity", required: false, notes: "Whole number — how many guests it holds (defaults to 1)" },
                    { key: "type", required: false, notes: "One of: standard, double, suite, meeting, accessible" },
                    { key: "notes", required: false, notes: "Any extra info — floor, view, maintenance notes" },
                  ]}
                />
                <p className="font-semibold text-slate-800 dark:text-white mt-6 mb-1">Example</p>
                <CsvExample
                  header={["number", "capacity", "type", "notes"]}
                  rows={[
                    ["101", "2", "double", "Near elevator"],
                    ["102", "1", "standard", ""],
                    ["301", "4", "suite", "Top floor, sea view"],
                  ]}
                />
              </div>
            </section>
            <Divider />

            {/* ── TEAM ── */}
            <section className="scroll-mt-24 pb-6" id="team">
              <SectionTitle id="team" icon="badge" title="Team CSV Format" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                <p>Used on the <strong>Team</strong> tab inside an event workspace.</p>
                <DownloadTemplateButton href="/templates/team-template.csv" label="Download Team Template (.csv)" />
                <ColumnTable
                  columns={[
                    { key: "name", required: true, notes: "Team member's full name" },
                    { key: "email", required: true, notes: "Must be unique per event — duplicates will fail" },
                    { key: "role", required: false, notes: "e.g. Coordinator, Security, Housekeeping" },
                  ]}
                />
                <p className="font-semibold text-slate-800 dark:text-white mt-6 mb-1">Example</p>
                <CsvExample
                  header={["name", "email", "role"]}
                  rows={[
                    ["Aarav Singh", "aarav@eventcure.in", "Coordinator"],
                    ["Diya Kapoor", "diya@eventcure.in", "Housekeeping"],
                  ]}
                />
                <Note type="warning">
                  Imported team members are added with status <strong>active</strong>. If someone's email already exists for this event, that row will fail — update them individually from the Team tab instead.
                </Note>
              </div>
            </section>
            <Divider />

            {/* ── TROUBLESHOOTING ── */}
            <section className="scroll-mt-24 pb-6" id="troubleshooting">
              <SectionTitle id="troubleshooting" icon="help_outline" title="Troubleshooting" />
              <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-[15px]">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">"Missing required column" error</p>
                  <p>Your CSV's header row doesn't include every required column name (see the tables above). Re-download the sample template and copy your data into it instead of writing headers from scratch.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Some rows failed but others succeeded</p>
                  <p>This is normal — the importer saves every valid row and reports the rest individually with the exact row number and reason (e.g. a missing name, or a duplicate team email). Fix only those rows in your CSV and import again; already-imported rows won't be duplicated as long as you remove them from the file first.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">File won't upload / "Couldn't read this file"</p>
                  <p>Make sure the file is saved as <strong>.csv</strong>, not .xlsx or .numbers. In Excel or Google Sheets, use File → Download/Export → Comma Separated Values (.csv).</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Is there a row limit?</p>
                  <p>Yes — up to 1000 rows per import. For larger guest lists, split the file into batches.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">"arrivalDatetime must be in YYYY-MM-DD..." error</p>
                  <p>
                    This usually happens when the data came from Excel/Google Sheets and the cell auto-formatted the date (e.g. to <code>11/20/2026</code>). Reformat that column as plain text using <code>YYYY-MM-DD HH:mm</code>, e.g. <code>2026-11-20 14:00</code>, before saving as CSV.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
            <p>© {new Date().getFullYear()} EventCure Hospitality Platform. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="/manual" className="hover:text-primary-500 transition-colors">User Manual</Link>
              <Link to="/dashboard" className="hover:text-primary-500 transition-colors">Dashboard</Link>
              <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
