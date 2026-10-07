import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import TeamMemberEntryForm from "../forms/TeamMemberEntryForm";
import {
  getTeamMembers,
  deleteTeamMember,
  getTeamSummary,
  updateTeamMemberStatus,
  bulkImportTeamMembers,
} from "../../api/teamMemberApi";
import { CsvImportModal } from "../../components";

const TEAM_CSV_COLUMNS = [
  { key: "name", label: "Name", required: true },
  { key: "email", label: "Email", required: true },
  { key: "role", label: "Role", required: false },
];
const TEAM_CSV_SAMPLE_ROWS = [
  { name: "Aarav Singh", email: "aarav@eventcure.in", role: "Coordinator" },
  { name: "Diya Kapoor", email: "diya@eventcure.in", role: "Housekeeping" },
];

const ROLES = [
  "Event Director",
  "Event Lead",
  "Event Coordinator",
  "Logistics",
  "Floor Staff",
  "Technical Support",
  "Guest Relations",
  "Catering Head",
  "Transport Manager",
  "Security Lead",
  "Housekeeping Supervisor",
  "Front Desk",
  "Media/AV Lead",
  "Operations Manager",
  "Photographer",
  "Decor & Setup",
  "Admin",
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";
const FIELD =
  "h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20";
const BTN_PRIMARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
const BTN_SECONDARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

const ROLE_TONE = {
  Admin: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  "Event Director": "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  "Event Lead": "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  Logistics: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  "Transport Manager": "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  "Catering Head": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  "Security Lead": "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  "Guest Relations": "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
  "Front Desk": "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300",
}
const ROLE_DEFAULT = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";

const getTimeAgo = (dateStr) => {
  if (!dateStr) return "Never";
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
};

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="bg-white p-4 dark:bg-slate-900 sm:p-5">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            <span className={`material-symbols-outlined text-[16px] ${it.color}`}>{it.icon}</span>
            {it.label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50 sm:text-[28px]">
              {it.value}
            </p>
            {it.sub && <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{it.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamMemberManagement({ eventId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");
  const editId = searchParams.get("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;
  const [members, setMembers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All");

  // Toast and modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [menu, setMenu] = useState(null); // { id, top, right }
  const menuRef = useRef(null);
  const loadedOnce = useRef(false);
  const reqId = useRef(0);
  const toastTimer = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, message: "", type: "info" }), 3000);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const loadData = async () => {
    if (!eventId) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const filters = { role: roleFilter, status: statusFilter, search: searchTerm };

      const membersRes = await getTeamMembers(eventId, { ...filters, page: currentPage, limit: LIMIT });
      if (id !== reqId.current) return;
      if (membersRes.success) {
        setMembers(membersRes.teamMembers);
        setTotalPages(membersRes.totalPages || 1);
        setTotalCount(membersRes.total || 0);
        loadedOnce.current = true;
      } else {
        setError(membersRes.message || "Failed to load team members");
      }

      const summaryRes = await getTeamSummary(eventId);
      if (id !== reqId.current) return;
      if (summaryRes.success) setSummary(summaryRes.summary);
    } catch (err) {
      if (id !== reqId.current) return;
      console.error(err);
      setError("Error loading team data");
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData();
    }, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [eventId, roleFilter, statusFilter, searchTerm, currentPage]);

  // Close row menu on outside click, scroll, resize or Escape
  useEffect(() => {
    if (!menu) return undefined;
    const close = () => setMenu(null);
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest?.("[data-menu-trigger]")) return;
      close();
    };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [menu]);

  const toggleMenu = (e, id) => {
    if (menu?.id === id) return setMenu(null);
    const r = e.currentTarget.getBoundingClientRect();
    setMenu({ id, top: r.bottom + 6, right: window.innerWidth - r.right });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteTeamMember(deleteId);
      if (res.success) {
        showToast("Member removed from team", "success");
        loadData();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      showToast("Error deleting member", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    setMenu(null);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await updateTeamMemberStatus(id, newStatus);
      if (res.success) {
        showToast(`Status updated to ${newStatus}`, "success");
        loadData();
      } else {
        showToast(res.message, "error");
      }
    } catch (err) {
      showToast("Error updating status", "error");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("All Roles");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  if (action === "addTeam" || action === "editTeam") {
    return (
      <TeamMemberEntryForm
        eventId={eventId}
        memberId={editId}
        onDone={() => {
          setSearchParams({});
          loadData();
        }}
        onCancel={() => setSearchParams({})}
      />
    );
  }

  const firstLoad = loading && !loadedOnce.current;
  const hasFilters = !!searchTerm || roleFilter !== "All Roles" || statusFilter !== "All";
  const menuMember = menu ? members.find((m) => m._id === menu.id) : null;
  const activePct = summary.total > 0 ? Math.round((summary.active / summary.total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast.show && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{toast.type === "success" ? "check_circle" : "error"}</span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {showImportModal && (
        <CsvImportModal
          title="Import Team Members"
          columns={TEAM_CSV_COLUMNS}
          sampleRows={TEAM_CSV_SAMPLE_ROWS}
          importFn={bulkImportTeamMembers}
          eventId={eventId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => loadData()}
        />
      )}

      {/* Remove-member modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => !deleting && setDeleteId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Remove this member?</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Are you sure you want to remove this staff member from the event? Their access is revoked instantly.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                Remove member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row menu (fixed so the table never clips it) */}
      {menu && menuMember && (
        <div
          ref={menuRef}
          role="menu"
          style={{ position: "fixed", top: menu.top, right: menu.right }}
          className="z-[65] w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <button
            role="menuitem"
            onClick={() => {
              setSearchParams({ action: "editTeam", id: menuMember._id });
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit details
          </button>
          <button
            role="menuitem"
            onClick={() => handleStatusToggle(menuMember._id, menuMember.status)}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">
              {menuMember.status === "active" ? "power_settings_new" : "bolt"}
            </span>
            {menuMember.status === "active" ? "Mark inactive" : "Mark active"}
          </button>
          <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />
          <button
            role="menuitem"
            onClick={() => {
              setDeleteId(menuMember._id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Remove access
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Team</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">Team members</h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Manage and assign roles for your hospitality operations team.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={loadData} disabled={loading} className={BTN_SECONDARY}>
            <span className={`material-symbols-outlined text-[19px] ${loading ? "animate-spin" : ""}`}>sync</span>
            Refresh
          </button>
          <button onClick={() => setShowImportModal(true)} className={BTN_SECONDARY}>
            <span className="material-symbols-outlined text-[19px]">upload_file</span>
            Import CSV
          </button>
          <button onClick={() => setSearchParams({ action: "addTeam" })} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Add member
          </button>
        </div>
      </div>

      <StatStrip
        items={[
          { icon: "groups", label: "Total members", value: summary.total, sub: "assigned to event", color: "text-blue-700 dark:text-blue-300" },
          { icon: "bolt", label: "Active now", value: summary.active, sub: `${activePct}% of team`, color: "text-emerald-700 dark:text-emerald-300" },
          { icon: "bedtime", label: "Off duty / inactive", value: summary.inactive, sub: "no live access", color: "text-slate-600 dark:text-slate-300" },
        ]}
      />

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={loadData} className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Table card */}
      <section className={`overflow-hidden ${CARD}`}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-sm lg:flex-1">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`${FIELD} w-full pl-10`}
              placeholder="Search by name or email…"
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Role"
              className={`${FIELD} cursor-pointer`}
            >
              <option>All Roles</option>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Status"
              className={`${FIELD} cursor-pointer`}
            >
              <option value="All">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs font-bold text-blue-700 hover:underline dark:text-blue-300">
                Clear filters
              </button>
            )}
          </div>
        </div>

        {firstLoad ? (
          <div className="space-y-3 p-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : members.length === 0 && !loading ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {hasFilters ? "No team members match these filters" : "No team members yet"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hasFilters ? "Try a different search or clear the filters." : "Add the people who'll run this event with you."}
            </p>
            {hasFilters ? (
              <button onClick={clearFilters} className={`${BTN_SECONDARY} mt-5`}>
                Clear filters
              </button>
            ) : (
              <button onClick={() => setSearchParams({ action: "addTeam" })} className={`${BTN_PRIMARY} mt-5`}>
                <span className="material-symbols-outlined text-[19px]">add</span>
                Add member
              </button>
            )}
          </div>
        ) : (
          <div aria-busy={loading} className={`overflow-x-auto transition-opacity ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                  {[
                    ["Member", ""],
                    ["Role", ""],
                    ["Status", ""],
                    ["Last active", ""],
                    ["", "text-right"],
                  ].map(([h, a], i) => (
                    <th key={i} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${a}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {members.map((member) => (
                  <tr key={member._id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {(member.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-bold text-slate-900 dark:text-slate-100">{member.name}</p>
                          <p className="max-w-[240px] truncate text-xs font-medium text-slate-500 dark:text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${ROLE_TONE[member.role] || ROLE_DEFAULT}`}
                      >
                        {member.role || "Unassigned"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      {member.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <span className="size-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {getTimeAgo(member.lastActive)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-right">
                      <button
                        data-menu-trigger
                        onClick={(e) => toggleMenu(e, member._id)}
                        aria-label={`Actions for ${member.name}`}
                        aria-haspopup="menu"
                        aria-expanded={menu?.id === member._id}
                        className={`inline-flex size-8 items-center justify-center rounded-lg transition ${
                          menu?.id === member._id
                            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                            : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!firstLoad && members.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing <strong className="text-slate-700 dark:text-slate-200">{members.length}</strong> of{" "}
              <strong className="text-slate-700 dark:text-slate-200">{totalCount}</strong> members
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Previous
                </button>
                <span className="px-1 font-bold tabular-nums text-slate-700 dark:text-slate-200">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default TeamMemberManagement;