import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TeamMemberEntryForm from "../forms/TeamMemberEntryForm";
import {
  getTeamMembers,
  deleteTeamMember,
  getTeamSummary,
  updateTeamMemberStatus,
} from "../../api/teamMemberApi";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All");

  // Toast and Modals
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const loadData = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const filters = {
        role: roleFilter,
        status: statusFilter,
        search: searchTerm,
      };

      const membersRes = await getTeamMembers(eventId, {
        ...filters,
        page: currentPage,
        limit: LIMIT,
      });
      if (membersRes.success) {
        setMembers(membersRes.teamMembers);
        setTotalPages(membersRes.totalPages || 1);
        setTotalCount(membersRes.total || 0);
      } else setError(membersRes.message);

      const summaryRes = await getTeamSummary(eventId);
      if (summaryRes.success) setSummary(summaryRes.summary);
    } catch (err) {
      console.error(err);
      setError("Error loading team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only refresh when filters are applied immediately (without submit)
    const timeout = setTimeout(() => {
      loadData();
    }, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [eventId, roleFilter, statusFilter, searchTerm, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;
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
      setDeleteId(null);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    setActionMenuId(null);
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

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-primary-50 dark:bg-primary-900/30 text-primary";
      case "Event Lead":
        return "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
      case "Logistics":
        return "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
      case "Floor Staff":
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";
    }
  };

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
    return Math.floor(seconds) + "s ago";
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

  return (
    <div className="relative flex h-full overflow-hidden flex-col">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="material-symbols-outlined">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <p className="font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <span className="material-symbols-outlined text-red-600">
                    warning
                  </span>
                </div>
                <h3 className="font-display text-card-h3 text-slate-900 dark:text-white">
                  Remove Member
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to remove this staff member from the
                event? Security revokes will happen instantly.
              </p>
            </div>
            <div className="flex gap-3 border-t border-slate-200 dark:border-slate-800 p-6">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 flex justify-center gap-2"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-8 pb-32">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-page-h1 text-slate-900 dark:text-white">
                Team Members
              </h1>
              <p className="text-slate-500 mt-1">
                Manage and assign roles for your hospitality operations team.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span
                  className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}
                >
                  sync
                </span>
                Refresh
              </button>
              <button
                onClick={() => setSearchParams({ action: "addTeam" })}
                className="flex items-center gap-2 rounded-lg h-10 px-5 bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary-600 transition-all text-sm"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Add Member
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
              <span className="material-symbols-outlined">error</span>
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Filters Area */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-t-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(e) =>{ setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all dark:text-white outline-none"
                placeholder="Search members by name or email..."
                type="text"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); } }
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-600 dark:text-slate-300 py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option>All Roles</option>
                <option>Event Director</option>
                <option>Event Lead</option>
                <option>Floor Staff</option>
                <option>Logistics</option>
                <option>Technical Support</option>
                <option>Guest Relations</option>
                <option>Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-600 dark:text-slate-300 py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      Member
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      Email
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      Role
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      Status
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      Last Active
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading && members.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <span className="material-symbols-outlined text-4xl animate-spin text-primary">
                          hourglass_top
                        </span>
                        <p className="mt-2 text-sm font-medium">
                          Loading roster...
                        </p>
                      </td>
                    </tr>
                  )}

                  {!loading && members.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3">
                          badge
                        </span>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          No team members found
                        </p>
                        <p className="text-sm mt-1 mb-4">
                          You haven't added anyone matching these filters.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setRoleFilter("All Roles");
                            setStatusFilter("All");
                          }}
                          className="text-primary font-bold text-sm hover:underline"
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  )}

                  {members.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-tight ${getRoleBadgeColor(member.role)}`}
                        >
                          {member.role || "Unassigned"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold ${member.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                          ></span>
                          {member.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {getTimeAgo(member.lastActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right relative">
                        <button
                          onClick={() =>
                            setActionMenuId(
                              actionMenuId === member._id ? null : member._id,
                            )
                          }
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-primary"
                        >
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>

                        {/* Dropdown menu */}
                        {actionMenuId === member._id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActionMenuId(null)}
                            ></div>
                            <div className="absolute right-8 top-10 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-2 animate-slide-in text-left">
                              <button
                                onClick={() => {
                                  setSearchParams({
                                    action: "editTeam",
                                    id: member._id,
                                  });
                                  setActionMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  edit
                                </span>{" "}
                                Edit Details
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusToggle(member._id, member.status)
                                }
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {member.status === "active"
                                    ? "power_settings_new"
                                    : "bolt"}
                                </span>
                                {member.status === "active"
                                  ? "Mark Inactive"
                                  : "Mark Active"}
                              </button>

                              <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 w-full"></div>

                              <button
                                onClick={() => {
                                  setDeleteId(member._id);
                                  setActionMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  delete
                                </span>{" "}
                                Remove Access
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <!-- Pagination Header (Stat Info) --> */}
            <div className="flex items-center justify-between w-full">
  <span className="text-xs font-medium text-slate-500">
    Showing {members.length} of {totalCount} members
  </span>
  {totalPages > 1 && (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Previous
      </button>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Next
      </button>
    </div>
  )}
</div>
          </div>

          {/* <!-- Footer Summary --> */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Total Members
              </p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {summary.total}
              </h4>
              <div className="mt-2 flex items-center gap-1 text-slate-500 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">
                  groups
                </span>
                <span>Assigned to event</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Active Now
              </p>
              <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {summary.active}
              </h4>
              <div className="mt-2 flex items-center gap-1 text-slate-500 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>
                  {summary.total > 0
                    ? Math.round((summary.active / summary.total) * 100)
                    : 0}
                  % of total team
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Off Duty / Inactive
              </p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {summary.inactive}
              </h4>
              <div className="mt-2 flex items-center gap-1 text-slate-500 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">
                  bedtime
                </span>
                <span>No live access right now</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slide-in-top {
          from { transform: translateY(-5px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in-top 0.15s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default TeamMemberManagement;