import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getTransports,
  getTransportSummary,
  deleteTransport,
  updateTransportStatus,
} from "../../api/transportCoordiAPi";
import TransportEntryForm from "../forms/TransportEntryForm";

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";
const BTN_PRIMARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
const BTN_SECONDARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

const STATUS_CONFIG = {
  scheduled: {
    label: "Scheduled",
    cls: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  in_transit: {
    label: "In transit",
    cls: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
    dot: "bg-blue-500 animate-pulse",
  },
  arrived: {
    label: "Arrived",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    cls: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    dot: "bg-red-500",
  },
};

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none lg:grid-cols-4">
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

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status];
  if (!c) return <span className="text-xs font-semibold text-slate-500">{status}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${c.cls}`}>
      <span className={`size-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [filterTab, setFilterTab] = useState("all"); // all, scheduled, in_transit, arrived
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Row menu state
  const [menu, setMenu] = useState(null); // { id, top, right }
  const menuRef = useRef(null);
  const loadedOnce = useRef(false);
  const reqId = useRef(0);
  const toastTimer = useRef(null);

  const showToast = (message, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, message: "", type: "info" }), duration);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const loadData = async () => {
    if (!eventId) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const transRes = await getTransports(eventId, filterTab, currentPage, LIMIT);
      if (id !== reqId.current) return;
      if (transRes.success) {
        setTransports(transRes.transports);
        setTotalPages(transRes.totalPages || 1);
        setTotalCount(transRes.total || 0);
        loadedOnce.current = true;
      } else {
        setError(transRes.message || "Failed to load transports");
      }

      const sumRes = await getTransportSummary(eventId);
      if (id !== reqId.current) return;
      if (sumRes.success) setSummary(sumRes);
      else setError(sumRes.message || "Failed to load summary");
    } catch (err) {
      if (id !== reqId.current) return;
      console.error("Error fetching transport data:", err);
      setError("Error communicating with server");
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId, filterTab, currentPage]);

  const setFilterTabAndReset = (tab) => {
    setFilterTab(tab);
    setCurrentPage(1);
  };

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

    const csvContent = [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");
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
      setMenu(null);
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
    return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render form if action is passed
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

  const firstLoad = loading && !loadedOnce.current;
  const menuItem = menu ? transports.find((t) => t._id === menu.id) : null;
  const activeCount = (summary.inTransit || 0) + (summary.scheduled || 0);
  const pctOf = (n) => (summary.total ? `${Math.round((n / summary.total) * 100)}%` : "0%");

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast.show && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === "success" ? "bg-emerald-600" : toast.type === "error" ? "bg-red-600" : "bg-slate-800"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
          </span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {/* Delete modal */}
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
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Delete this transport?</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this transport entry? This action cannot be undone.
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
                {deleting ? "Deleting…" : "Delete transport"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row menu (fixed so the table never clips it) */}
      {menu && menuItem && (
        <div
          ref={menuRef}
          role="menu"
          style={{ position: "fixed", top: menu.top, right: menu.right }}
          className="z-[65] w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            Update status
          </p>
          {[
            ["scheduled", "schedule", "Scheduled", "hover:bg-slate-50 dark:hover:bg-slate-800"],
            ["in_transit", "airport_shuttle", "In transit", "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"],
            ["arrived", "check_circle", "Arrived", "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"],
            ["cancelled", "cancel", "Cancelled", "hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300"],
          ].map(([s, icon, label, hover]) => (
            <button
              key={s}
              role="menuitem"
              disabled={menuItem.status === s}
              onClick={() => handleStatusUpdate(menuItem._id, s)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-slate-700 transition disabled:cursor-default disabled:opacity-40 dark:text-slate-300 ${hover}`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </button>
          ))}
          <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />
          <button
            role="menuitem"
            onClick={() => {
              setSearchParams({ action: "editTransport", id: menuItem._id });
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit
          </button>
          <button
            role="menuitem"
            onClick={() => {
              setDeleteId(menuItem._id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Transport</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            Transport coordination log
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Tracking <strong className="font-extrabold text-blue-700 dark:text-blue-300">{activeCount} active</strong> movements (scheduled and in transit).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={handleExportCSV} className={BTN_SECONDARY} title="Export the listed transports to CSV">
            <span className="material-symbols-outlined text-[19px]">download</span>
            Export CSV
          </button>
          <button onClick={() => setSearchParams({ action: "addTransport" })} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Add transport
          </button>
        </div>
      </div>

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

      <StatStrip
        items={[
          { icon: "local_shipping", label: "Total deployments", value: summary.total, color: "text-blue-700 dark:text-blue-300" },
          { icon: "schedule", label: "Scheduled", value: summary.scheduled, color: "text-slate-600 dark:text-slate-300" },
          { icon: "airport_shuttle", label: "In transit", value: summary.inTransit, sub: pctOf(summary.inTransit), color: "text-indigo-700 dark:text-indigo-300" },
          { icon: "check_circle", label: "Arrived", value: summary.arrived, sub: pctOf(summary.arrived), color: "text-emerald-700 dark:text-emerald-300" },
        ]}
      />

      {/* Table card */}
      <section className={`overflow-hidden ${CARD}`}>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex w-fit max-w-full overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: "all", label: "All trips", count: summary.total },
              { id: "scheduled", label: "Scheduled", count: summary.scheduled },
              { id: "in_transit", label: "In transit", count: summary.inTransit },
              { id: "arrived", label: "Arrived", count: summary.arrived },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTabAndReset(tab.id)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  filterTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
                <span className="rounded-full bg-slate-200/70 px-1.5 text-[10px] tabular-nums dark:bg-slate-600/60">{tab.count}</span>
              </button>
            ))}
          </div>
          <button onClick={loadData} disabled={loading} className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:self-auto">
            <span className={`material-symbols-outlined text-[18px] ${loading ? "animate-spin" : ""}`}>sync</span>
            Refresh
          </button>
        </div>

        {firstLoad ? (
          <div className="space-y-3 p-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : transports.length === 0 && !loading ? (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <span className="material-symbols-outlined text-[24px]">no_crash</span>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No transport records found</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {filterTab === "all" ? "Add a transport to schedule one." : "Nothing matches this status yet."}
            </p>
            {filterTab === "all" ? (
              <button onClick={() => setSearchParams({ action: "addTransport" })} className={`${BTN_PRIMARY} mt-5`}>
                <span className="material-symbols-outlined text-[19px]">add</span>
                Add transport
              </button>
            ) : (
              <button onClick={() => setFilterTabAndReset("all")} className={`${BTN_SECONDARY} mt-5`}>
                Show all trips
              </button>
            )}
          </div>
        ) : (
          <div aria-busy={loading} className={`overflow-x-auto transition-opacity ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40">
                  {[
                    ["Guest / entry", ""],
                    ["Route", ""],
                    ["Driver & vehicle", ""],
                    ["Status", ""],
                    ["Timing", "text-right"],
                    ["", ""],
                  ].map(([h, a], i) => (
                    <th key={i} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 ${a}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transports.map((t) => (
                  <tr key={t._id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      {t.guest ? (
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            {(t.guest.fullName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                              <span className="max-w-[160px] truncate">{t.guest.fullName}</span>
                              {t.guest.vipStatus && (
                                <span className="material-symbols-outlined text-[15px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }} title="VIP guest">
                                  star
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 max-w-[170px] truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                              {t.guest.groupName || "Individual"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <span className="material-symbols-outlined text-[19px]">groups</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">General / group</p>
                            <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">No specific guest</p>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined mt-0.5 text-[15px] text-slate-400">trip_origin</span>
                          <span className="line-clamp-1 max-w-[220px] text-sm font-medium text-slate-700 dark:text-slate-300">{t.pickupLocation}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined mt-0.5 text-[15px] text-blue-600 dark:text-blue-400">place</span>
                          <span className="line-clamp-1 max-w-[220px] text-sm font-medium text-slate-700 dark:text-slate-300">{t.dropoffLocation}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                          <p className={`max-w-[150px] truncate text-sm font-medium ${t.driverName ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                            {t.driverName || "Unassigned"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">directions_car</span>
                          <p className="w-fit max-w-[150px] truncate rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {t.vehicleId || "Pending vehicle"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={t.status} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <p className="text-sm font-extrabold tabular-nums text-slate-900 dark:text-slate-100">{formatTime(t.scheduledTime)}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {t.scheduledTime ? new Date(t.scheduledTime).toLocaleDateString() : ""}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        data-menu-trigger
                        onClick={(e) => toggleMenu(e, t._id)}
                        aria-label="More actions"
                        aria-haspopup="menu"
                        aria-expanded={menu?.id === t._id}
                        className={`inline-flex size-8 items-center justify-center rounded-lg transition ${
                          menu?.id === t._id
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

        {/* Footer + pagination */}
        {!firstLoad && transports.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="text-slate-700 dark:text-slate-200">
                {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, totalCount)}
              </strong>{" "}
              of <strong className="text-slate-700 dark:text-slate-200">{totalCount}</strong> transports
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

      {/* Fleet map — future feature (disabled) */}
      <div className={`flex flex-col items-center gap-5 p-5 opacity-80 sm:flex-row sm:p-6 ${CARD}`}>
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <span className="material-symbols-outlined text-[28px]">map</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h4 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100">Live fleet map</h4>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              Coming soon
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time vehicle tracking on a map will be available once GPS integration is added.
          </p>
        </div>
        <button disabled className={`${BTN_SECONDARY} w-full sm:w-auto`}>
          View live map
          <span className="material-symbols-outlined text-[17px]">open_in_new</span>
        </button>
      </div>
    </div>
  );
}

export default TransportCoordinationLogs;