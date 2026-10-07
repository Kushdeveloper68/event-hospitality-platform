import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getRooms,
  exportAllRooms,
  deleteRoom,
  assignGuestToRoom,
  bulkImportRooms,
} from "../../api/roomApi";
import { getGuests } from "../../api/guestApi";
import RoomconfigurationForm from "../forms/RoomconfigurationForm";
import { CsvImportModal } from "../../components";

const ROOM_CSV_COLUMNS = [
  { key: "number", label: "Room Number", required: true },
  { key: "capacity", label: "Capacity", required: false },
  { key: "type", label: "Type", required: false },
  { key: "notes", label: "Notes", required: false },
];
const ROOM_CSV_SAMPLE_ROWS = [
  { number: "101", capacity: "2", type: "double", notes: "Near elevator" },
  { number: "301", capacity: "4", type: "suite", notes: "Top floor, sea view" },
];

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none";
const FIELD =
  "h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20";
const BTN_PRIMARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200";
const BTN_SECONDARY =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    cls: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  partial: {
    label: "Partial",
    cls: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  full: {
    label: "Full",
    cls: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
    dot: "bg-blue-500",
    bar: "bg-blue-600 dark:bg-blue-500",
  },
};

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

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

function Modal({ children, onClose, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[85vh] w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 ${
          wide ? "max-w-lg" : "max-w-md"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function RoomInventoryManagement() {
  const { eventId: paramEventId } = useParams();
  const eventId = paramEventId;
  const [searchParams, setSearchParams] = useSearchParams();

  const action = searchParams.get("action"); // 'addRoom' or 'editRoom'
  const editingId = searchParams.get("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;
  const [rooms, setRooms] = useState([]);
  // Event-wide totals from the server — NOT derived from `rooms` (which is
  // only the current page), so these stay correct no matter which page is
  // loaded or what's currently searched.
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    totalCapacity: 0,
    totalOccupancy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, available, occupied
  const loadedOnce = useRef(false);
  const reqId = useRef(0);
  const toastTimer = useRef(null);

  // assignment modal state
  const [assignRoomId, setAssignRoomId] = useState(null);
  const [availableGuests, setAvailableGuests] = useState([]);
  const [guestSearchQuery, setGuestSearchQuery] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

  // delete confirmation modal state
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showToast = (msg, type = "info", duration = 4000) => {
    setToast({ show: true, message: msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, message: "", type: "info" }), duration);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const getRoomStatus = (room) => {
    const occupancy = room.occupancy || 0;
    const capacity = room.capacity || 1;
    if (occupancy === 0) return "available";
    if (occupancy < capacity) return "partial";
    return "full";
  };

  const getStatusBadge = (room) => STATUS_CONFIG[getRoomStatus(room)];

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Fetches EVERY room matching the current search/status filter from
      // the server — not just whatever page happens to be on screen.
      const res = await exportAllRooms({ eventId, search: debouncedSearch, status: filterStatus });
      if (!res.success || !res.rooms?.length) {
        showToast("No rooms to export", "error");
        return;
      }

      const headers = ["Room #", "Type", "Capacity", "Occupancy", "Status", "Notes"];
      const rows = res.rooms.map((room) => [
        room.number || "",
        room.type || "Standard",
        room.capacity || 1,
        room.occupancy || 0,
        getStatusBadge(room).label,
        room.notes || "",
      ]);

      const csvContent = [headers.map(csvCell).join(","), ...rows.map((row) => row.map(csvCell).join(","))].join("\n");

      // Prefixing with a BOM keeps accented/special characters intact when the
      // file is opened directly in Excel.
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `room-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`${res.rooms.length} room(s) exported successfully`, "success");
    } catch (err) {
      console.error("handleExportExcel", err);
      showToast("Failed to export rooms", "error");
    } finally {
      setExporting(false);
    }
  };

  const fetchRooms = async () => {
    if (!eventId) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await getRooms({
        eventId,
        page: currentPage,
        limit: LIMIT,
        search: debouncedSearch || undefined,
        status: filterStatus === "all" ? undefined : filterStatus,
      });
      if (id !== reqId.current) return;
      if (res.success) {
        setRooms(res.rooms);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
        if (res.stats) setStats(res.stats);
        loadedOnce.current = true;
      } else {
        setError(res.message || "Failed to load rooms");
        showToast(res.message || "Failed to load rooms", "error");
      }
    } catch (err) {
      if (id !== reqId.current) return;
      console.error("fetchRooms", err);
      setError("Error loading rooms");
      showToast("Error loading rooms", "error");
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  };

  // Debounce the search box so every keystroke doesn't fire a request —
  // waits 400ms after typing stops, then updates debouncedSearch.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  // Searching or switching the status tab should jump back to page 1 —
  // staying on page 3 of a new, smaller filtered result would show nothing.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchRooms();
  }, [eventId, currentPage, debouncedSearch, filterStatus]);

  const openAssignModal = async (roomId) => {
    setAssignRoomId(roomId);
    setGuestSearchQuery("");
    setAssignLoading(true);
    setAssignError(null);
    setAvailableGuests([]);
    try {
      const res = await getGuests({ eventId, limit: 1000 });
      if (res.success) {
        setAvailableGuests(res.guests.filter((g) => !g.room));
      } else {
        setAssignError(res.message || "Failed to load available guests");
      }
    } catch (e) {
      console.warn("load guests for assign", e);
      setAssignError("Failed to load available guests");
      showToast("Failed to load available guests", "error");
    } finally {
      setAssignLoading(false);
    }
  };

  const closeAssignModal = () => {
    setAssignRoomId(null);
    setAvailableGuests([]);
    setGuestSearchQuery("");
    setAssignError(null);
    setAssignLoading(false);
  };

  const handleAssignment = async (guestId) => {
    if (!assignRoomId) return;
    setAssigning(true);
    setAssignError(null);
    try {
      const res = await assignGuestToRoom(assignRoomId, guestId);
      if (res.success) {
        showToast("Guest assigned successfully", "success");
        closeAssignModal();
        fetchRooms();
      } else {
        setAssignError(res.message || "Failed to assign");
      }
    } catch (err) {
      console.error(err);
      setAssignError(err.message || "Failed to assign");
    } finally {
      setAssigning(false);
    }
  };

  const handleEditRoom = (roomId) => {
    setSearchParams({ action: "editRoom", id: roomId });
  };

  const handleDeleteRoom = async () => {
    if (!deleteRoomId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteRoom(deleteRoomId);
      if (res.success) {
        showToast("Room deleted successfully", "success");
        setDeleteRoomId(null);
        fetchRooms();
      } else {
        showToast(res.message || "Failed to delete room", "error");
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      showToast("Error deleting room", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const onFormDone = () => {
    setSearchParams({});
    fetchRooms();
  };

  const onFormCancel = () => {
    setSearchParams({});
  };

  const filteredGuests = availableGuests.filter((guest) => {
    const query = guestSearchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      guest.fullName?.toLowerCase().includes(query) ||
      guest.email?.toLowerCase().includes(query) ||
      guest.phone?.toLowerCase().includes(query) ||
      guest.ticketType?.toLowerCase().includes(query)
    );
  });

  if (action === "addRoom" || action === "editRoom") {
    return <RoomconfigurationForm eventId={eventId} roomId={editingId} onDone={onFormDone} onCancel={onFormCancel} />;
  }

  const firstLoad = loading && !loadedOnce.current;
  const fillPct = stats.totalCapacity ? Math.round((stats.totalOccupancy / stats.totalCapacity) * 100) : 0;
  const hasFilters = !!debouncedSearch || filterStatus !== "all";

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

      {showImportModal && (
        <CsvImportModal
          title="Import Rooms"
          columns={ROOM_CSV_COLUMNS}
          sampleRows={ROOM_CSV_SAMPLE_ROWS}
          importFn={bulkImportRooms}
          eventId={eventId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => fetchRooms()}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Rooms</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            Room inventory
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Monitor and manage guest assignments for physical space inventory.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            title="Export all rooms matching the current search/filter as CSV"
            className={BTN_SECONDARY}
          >
            <span className={`material-symbols-outlined text-[19px] ${exporting ? "animate-spin" : ""}`}>
              {exporting ? "progress_activity" : "file_download"}
            </span>
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
          <button onClick={() => setShowImportModal(true)} className={BTN_SECONDARY}>
            <span className="material-symbols-outlined text-[19px]">upload_file</span>
            Import CSV
          </button>
          <button onClick={() => setSearchParams({ action: "addRoom" })} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Add room
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[19px]">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={fetchRooms} className="shrink-0 text-xs font-bold underline underline-offset-2 hover:no-underline">
            Retry
          </button>
        </div>
      )}

      <StatStrip
        items={[
          { icon: "bed", label: "Total rooms", value: stats.total, color: "text-blue-700 dark:text-blue-300" },
          { icon: "groups", label: "Total capacity", value: stats.totalCapacity, sub: "guests max", color: "text-indigo-700 dark:text-indigo-300" },
          { icon: "check_circle", label: "Occupancy", value: stats.totalOccupancy, sub: `${fillPct}% full`, color: "text-violet-700 dark:text-violet-300" },
          { icon: "door_open", label: "Available", value: stats.available, sub: "rooms free", color: "text-emerald-700 dark:text-emerald-300" },
        ]}
      />

      {/* Filter bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search by room number or type…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${FIELD} w-full bg-white pl-10 pr-10 dark:bg-slate-900`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="flex w-fit rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {[
            ["all", `All rooms (${stats.total})`],
            ["available", `Available (${stats.available})`],
            ["occupied", `Occupied (${stats.occupied})`],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilterStatus(k)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                filterStatus === k
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton (first load) */}
      {firstLoad && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-56 p-5 ${CARD}`}>
              <Skeleton className="mb-2 h-6 w-20" />
              <Skeleton className="mb-6 h-3 w-16" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Room grid */}
      {!firstLoad && rooms.length > 0 && (
        <div
          aria-busy={loading}
          className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}
        >
          {rooms.map((room) => {
            const badge = getStatusBadge(room);
            const occupancy = room.occupancy || 0;
            const capacity = room.capacity || 1;
            const occupancyPercent = (occupancy / capacity) * 100;

            return (
              <div
                key={room._id}
                className={`flex flex-col p-5 transition hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)] dark:hover:border-slate-700 dark:hover:shadow-none ${CARD}`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                      {room.number}
                    </h4>
                    <p className="mt-0.5 text-xs font-semibold capitalize text-slate-500 dark:text-slate-400">
                      {room.type || "Standard"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badge.cls}`}
                  >
                    <span className={`size-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Capacity</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{capacity} guests</span>
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-500 dark:text-slate-400">Occupancy</span>
                      <span className="font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                        {occupancy} / {capacity}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${badge.bar}`}
                        style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {room.notes && (
                  <p className="mt-3 line-clamp-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                    {room.notes}
                  </p>
                )}

                <div className="mt-auto flex gap-2 pt-5">
                  {occupancy < capacity && (
                    <button
                      onClick={() => openAssignModal(room._id)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      <span className="material-symbols-outlined text-[17px]">person_add</span>
                      Assign guest
                    </button>
                  )}
                  <button
                    onClick={() => handleEditRoom(room._id)}
                    title="Edit room"
                    aria-label={`Edit room ${room.number}`}
                    className={`inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 ${
                      occupancy >= capacity ? "flex-1" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteRoomId(room._id)}
                    title="Delete room"
                    aria-label={`Delete room ${room.number}`}
                    className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty: the event truly has zero rooms */}
      {!loading && rooms.length === 0 && stats.total === 0 && (
        <div className={`px-4 py-16 text-center ${CARD}`}>
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <span className="material-symbols-outlined text-[24px]">meeting_room</span>
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No rooms yet</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Create your first room to get started.</p>
          <button onClick={() => setSearchParams({ action: "addRoom" })} className={`${BTN_PRIMARY} mt-5`}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Add room
          </button>
        </div>
      )}

      {/* Empty: rooms exist, none match */}
      {!loading && rooms.length === 0 && stats.total > 0 && (
        <div className={`px-4 py-16 text-center ${CARD}`}>
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No rooms found</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
          {hasFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
              className={`${BTN_SECONDARY} mt-5`}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing{" "}
            <strong className="text-slate-700 dark:text-slate-200">
              {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, totalCount)}
            </strong>{" "}
            of <strong className="text-slate-700 dark:text-slate-200">{totalCount}</strong> rooms
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Previous
            </button>
            <span className="px-1 text-xs font-bold tabular-nums text-slate-700 dark:text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {/* Assignment modal */}
      {assignRoomId && (
        <Modal onClose={closeAssignModal} wide>
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Assign guest to room</h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Only unassigned guests are listed.</p>
            </div>
            <button
              onClick={closeAssignModal}
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {assignError && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {assignError}
            </div>
          )}

          <div className="px-6 pt-4">
            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
              <input
                type="text"
                value={guestSearchQuery}
                onChange={(e) => setGuestSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone…"
                autoFocus
                className={`${FIELD} w-full pl-10`}
              />
            </div>
          </div>

          <div className="min-h-[8rem] flex-1 overflow-y-auto p-6">
            {assignLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <span className="material-symbols-outlined text-[22px]">person_off</span>
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {availableGuests.length === 0 ? "No unassigned guests available" : "No guests match your search"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredGuests.map((guest) => (
                  <button
                    key={guest._id}
                    onClick={() => handleAssignment(guest._id)}
                    disabled={assigning}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-blue-300 hover:bg-blue-50/50 disabled:opacity-50 dark:border-slate-700 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {guest.fullName ? guest.fullName.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{guest.fullName}</p>
                        {guest.email && <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{guest.email}</p>}
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-[20px] text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 ${assigning ? "animate-spin" : ""}`}>
                      {assigning ? "progress_activity" : "person_add"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <button onClick={closeAssignModal} disabled={assigning} className={BTN_SECONDARY}>
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteRoomId && (
        <Modal onClose={() => !deleteLoading && setDeleteRoomId(null)}>
          <div className="flex items-start gap-4 p-6">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <span className="material-symbols-outlined text-[24px]">warning</span>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Delete this room?</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this room? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button onClick={() => setDeleteRoomId(null)} disabled={deleteLoading} className={BTN_SECONDARY}>
              Cancel
            </button>
            <button
              onClick={handleDeleteRoom}
              disabled={deleteLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {deleteLoading ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Deleting…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete room
                </>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RoomInventoryManagement;