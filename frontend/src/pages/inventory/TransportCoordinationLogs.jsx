import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getTransports,
  getTransportSummary,
  deleteTransport,
  updateTransportStatus,
} from "../../api/transportCoordiAPi";
import TransportEntryForm from "../forms/TransportEntryForm";

function TransportCoordinationLogs({ eventId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");
  const editId = searchParams.get("id");

  const [transports, setTransports] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    scheduled: 0,
    inTransit: 0,
    arrived: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [filterTab, setFilterTab] = useState("all"); // all, scheduled, in_transit, arrived
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;
  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Status dropdown state
  const [statusMenuId, setStatusMenuId] = useState(null);

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      duration,
    );
  };

  const loadData = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const transRes = await getTransports(
        eventId,
        filterTab,
        currentPage,
        LIMIT,
      );
      if (transRes.success) {
        setTransports(transRes.transports);
        setTotalPages(transRes.totalPages || 1);
        setTotalCount(transRes.total || 0);
      } else setError(transRes.message || "Failed to load transports");

      const sumRes = await getTransportSummary(eventId);
      if (sumRes.success) setSummary(sumRes);
      else setError(sumRes.message || "Failed to load summary");
    } catch (err) {
      console.error("Error fetching transport data:", err);
      setError("Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  loadData();
}, [eventId, filterTab, currentPage]);

const setFilterTabAndReset = (tab) => {
  setFilterTab(tab);
  setCurrentPage(1);
};

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteTransport(deleteId);
      if (res.success) {
        showToast("Transport deleted successfully", "success");
        setDeleteId(null);
        loadData();
      } else {
        showToast(res.message || "Failed to delete", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting transport", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (transports.length === 0) {
      showToast("No transport logs to export", "error");
      return;
    }

    const headers = ["Guest", "Group", "Pickup", "Dropoff", "Driver", "Vehicle", "Scheduled Time", "Status"];
    const rows = transports.map((t) => [
      t.guest?.fullName || "N/A",
      t.guest?.groupName || "Individual",
      t.pickupLocation || "",
      t.dropoffLocation || "",
      t.driverName || "Unassigned",
      t.vehicleId || "Pending",
      t.scheduledTime ? new Date(t.scheduledTime).toLocaleString() : "",
      t.status || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transport-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Transport log exported successfully", "success");
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setStatusMenuId(null);
      const res = await updateTransportStatus(id, newStatus);
      if (res.success) {
        showToast("Status updated successfully", "success");
        loadData();
      } else {
        showToast(res.message || "Failed to update status", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status", "error");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Not set";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "in_transit":
        return {
          badge: "In Transit",
          bg: "bg-primary/10",
          text: "text-primary",
          progBg: "bg-primary",
          color: "primary",
          width: "75%",
        };
      case "arrived":
        return {
          badge: "Arrived",
          bg: "bg-emerald-100",
          text: "text-emerald-600",
          progBg: "bg-emerald-500",
          color: "emerald",
          width: "100%",
        };
      case "scheduled":
        return {
          badge: "Scheduled",
          bg: "bg-slate-100",
          text: "text-slate-500",
          progBg: "bg-slate-300",
          color: "slate",
          width: "0%",
        };
      case "cancelled":
        return {
          badge: "Cancelled",
          bg: "bg-red-100",
          text: "text-red-600",
          progBg: "bg-red-500",
          color: "red",
          width: "100%",
        };
      default:
        return {
          badge: status,
          bg: "bg-slate-100",
          text: "text-slate-500",
          progBg: "bg-slate-300",
          color: "slate",
          width: "0%",
        };
    }
  };

  // Render form if action is passed securely
  if (action === "addTransport" || action === "editTransport") {
    return (
      <TransportEntryForm
        eventId={eventId}
        transportId={editId}
        onDone={() => {
          setSearchParams({});
          loadData();
        }}
        onCancel={() => setSearchParams({})}
      />
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : toast.type === "error"
                ? "bg-red-500 text-white"
                : "bg-slate-900 text-white"
          }`}
        >
          <span className="material-symbols-outlined">
            {toast.type === "success"
              ? "check_circle"
              : toast.type === "error"
                ? "error"
                : "info"}
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
                  Delete Transport?
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this transport entry? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 border-t border-slate-200 dark:border-slate-800 p-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50 flex justify-center gap-2"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 flex-col items-center py-8">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
            {/* Page Header Area */}
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Live Monitoring
                  </span>
                </div>
                <h1 className="font-display text-page-h1 text-slate-900 dark:text-white">
                  Transport Coordination Log
                </h1>
                <p className="text-slate-500 text-base font-normal">
                  Tracking{" "}
                  <span className="text-primary font-bold">
                    {summary.inTransit + summary.scheduled} active
                  </span>{" "}
                  movements today.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 rounded-lg h-11 px-6 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  <span className="material-symbols-outlined">download</span>
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setSearchParams({ action: "addTransport" })}
                  className="flex items-center gap-2 rounded-lg h-11 px-6 bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary-600 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span>Add Transport</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 border border-red-200">
                <span className="material-symbols-outlined">error</span>
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase">
                  Total Deployments
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {summary.total}
                  </span>
                  <span className="material-symbols-outlined text-slate-400">
                    local_shipping
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase">
                  Scheduled
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {summary.scheduled}
                  </span>
                  <span className="material-symbols-outlined text-slate-400">
                    schedule
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase">
                  In Transit
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {summary.inTransit}
                  </span>
                  <span className="material-symbols-outlined text-primary">
                    airport_shuttle
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: summary.total
                        ? `${(summary.inTransit / summary.total) * 100}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 shadow-sm">
                <span className="text-slate-500 text-xs font-bold uppercase">
                  Completed Today
                </span>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {summary.arrived}
                  </span>
                  <span className="material-symbols-outlined text-emerald-500">
                    check_circle
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: summary.total
                        ? `${(summary.arrived / summary.total) * 100}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-t-xl border-x border-t border-slate-200 dark:border-slate-800 px-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 overflow-x-auto hide-scrollbar">
                <div className="flex gap-8">
                  {[
                    { id: "all", label: "All Trips", count: summary.total },
                    {
                      id: "scheduled",
                      label: "Scheduled",
                      count: summary.scheduled,
                    },
                    {
                      id: "in_transit",
                      label: "In Transit",
                      count: summary.inTransit,
                    },
                    { id: "arrived", label: "Arrived", count: summary.arrived },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterTabAndReset(tab.id)}
                      className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-colors shrink-0 ${
                        filterTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-2 rounded-full ${
                          filterTab === tab.id
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 shrink-0 ml-4 py-2">
                  <button
                    onClick={loadData}
                    className="flex items-center gap-1 text-slate-500 text-sm font-medium hover:text-primary transition-colors"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${loading ? "animate-spin" : ""}`}
                    >
                      sync
                    </span>
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-64">
                      Guest / Entry
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Route Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">
                      Driver & Vehicle
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32 text-right">
                      Timing
                    </th>
                    <th className="px-4 py-4 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transports.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">
                          no_crash
                        </span>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">
                          No transport records found
                        </p>
                        <p className="text-sm text-slate-500">
                          Click "Add Transport" to schedule one.
                        </p>
                      </td>
                    </tr>
                  )}
                  {loading && transports.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                          hourglass_top
                        </span>
                        <p className="mt-2 text-slate-500">
                          Loading records...
                        </p>
                      </td>
                    </tr>
                  )}

                  {transports.map((t) => {
                    const statusConfig = getStatusDisplay(t.status);

                    return (
                      <tr
                        key={t._id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          {t.guest ? (
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                {t.guest.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none flex items-center gap-1">
                                  {t.guest.fullName}
                                  {t.guest.vipStatus && (
                                    <span
                                      className="material-symbols-outlined text-[14px] text-amber-500"
                                      title="VIP Guest"
                                    >
                                      star
                                    </span>
                                  )}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[150px]">
                                  {t.guest.groupName || "Individual"}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center justify-center font-bold text-sm">
                                <span className="material-symbols-outlined text-lg">
                                  groups
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                  General / Group
                                </p>
                                <p className="text-[11px] text-slate-500 mt-1">
                                  No specific guest
                                </p>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-[14px] text-slate-400 mt-0.5">
                                trip_origin
                              </span>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                                {t.pickupLocation}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="material-symbols-outlined text-[14px] text-primary mt-0.5">
                                place
                              </span>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1">
                                {t.dropoffLocation}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-slate-400">
                                person
                              </span>
                              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">
                                {t.driverName || "Unassigned"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-slate-400">
                                directions_car
                              </span>
                              <p className="text-[11px] text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit truncate">
                                {t.vehicleId || "Pending Vehicle"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${statusConfig.bg} ${statusConfig.text}`}
                            >
                              {statusConfig.badge}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${statusConfig.progBg}`}
                                  style={{ width: statusConfig.width }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatTime(t.scheduledTime)}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                            {t.scheduledTime
                              ? new Date(t.scheduledTime).toLocaleDateString()
                              : ""}
                          </p>
                        </td>

                        <td className="px-4 py-5 text-center relative">
                          <button
                            onClick={() =>
                              setStatusMenuId(
                                statusMenuId === t._id ? null : t._id,
                              )
                            }
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <span className="material-symbols-outlined">
                              more_vert
                            </span>
                          </button>

                          {/* Action Dropdown */}
                          {statusMenuId === t._id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setStatusMenuId(null)}
                              ></div>
                              <div className="absolute right-8 top-10 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-2 overflow-hidden animate-slide-in">
                                <p className="text-[10px] font-bold text-slate-400 px-4 pb-2 uppercase tracking-wider">
                                  Update Status
                                </p>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(t._id, "scheduled")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  Scheduled
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(t._id, "in_transit")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  In Transit
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(t._id, "arrived")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                                >
                                  Arrived
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(t._id, "cancelled")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-red-600 block border-b border-slate-100 dark:border-slate-700"
                                >
                                  Cancelled
                                </button>

                                <p className="text-[10px] font-bold text-slate-400 px-4 py-2 uppercase tracking-wider mt-1">
                                  Actions
                                </p>
                                <button
                                  onClick={() => {
                                    setSearchParams({
                                      action: "editTransport",
                                      id: t._id,
                                    });
                                    setStatusMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-primary flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    edit
                                  </span>{" "}
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteId(t._id);
                                    setStatusMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    delete
                                  </span>{" "}
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {transports.length} transports
                </span>
              </div>
              {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl mt-4">
    <p className="text-sm text-slate-500">
      Showing {(currentPage - 1) * LIMIT + 1}–
      {Math.min(currentPage * LIMIT, totalCount)} of {totalCount} transports
    </p>

    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm dark:text-amber-50 font-bold border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Previous
      </button>

      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() =>
          setCurrentPage((p) => Math.min(totalPages, p + 1))
        }
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-bold border dark:text-amber-50 border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Next
      </button>
    </div>
  </div>
)}
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="size-20 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl">
                  map
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">
                  Interactive Fleet Map
                </h4>
                <p className="text-slate-500 text-sm mt-1">
                  GPS tracking is simulated in this environment. Configure live
                  integration in settings.
                </p>
              </div>
              <button
                disabled
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-lg text-sm transition-all flex items-center gap-2 opacity-50 cursor-not-allowed"
              >
                <span>View Live Map</span>
                <span className="material-symbols-outlined text-sm">
                  open_in_new
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slide-in-top {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in-top 0.2s ease-out; }
      `}</style>
    </div>
  );
}

export default TransportCoordinationLogs;