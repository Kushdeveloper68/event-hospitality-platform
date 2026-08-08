import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  assignGuestToRoom,
} from "../../api/roomApi";
import { getGuests } from "../../api/guestApi";
import RoomconfigurationForm from "../forms/RoomconfigurationForm";

function RoomInventoryManagement() {
  const { eventId: paramEventId } = useParams();
  const eventId = paramEventId;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const action = searchParams.get("action"); // 'addRoom' or 'editRoom'
  const editingId = searchParams.get("id");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, available, occupied

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
    setTimeout(
      () => setToast({ show: false, message: "", type: "info" }),
      duration,
    );
  };

  const fetchRooms = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getRooms({ eventId, page: currentPage, limit: LIMIT });
      if (res.success) {
        setRooms(res.rooms);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      } else {
        setError(res.message || "Failed to load rooms");
        showToast(res.message || "Failed to load rooms", "error");
      }
    } catch (err) {
      console.error("fetchRooms", err);
      setError("Error loading rooms");
      showToast("Error loading rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on search and status
  useEffect(() => {
    let filtered = rooms;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.number.toString().includes(searchQuery) ||
          r.type?.includes(searchQuery) ||
          r.notes?.includes(searchQuery),
      );
    }

    // Status filter
    if (filterStatus === "available") {
      filtered = filtered.filter((r) => (r.occupancy || 0) < r.capacity);
    } else if (filterStatus === "occupied") {
      filtered = filtered.filter((r) => (r.occupancy || 0) > 0);
    }

    setFilteredRooms(filtered);
  }, [searchQuery, filterStatus, rooms]);

  useEffect(() => {
    fetchRooms();
  }, [eventId, currentPage]);

  const getRoomStatus = (room) => {
    const occupancy = room.occupancy || 0;
    const capacity = room.capacity || 1;

    if (occupancy === 0) return "available";
    if (occupancy < capacity) return "partial";
    return "full";
  };

  const getStatusBadge = (room) => {
    const status = getRoomStatus(room);
    const statusConfig = {
      available: {
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        dotColor: "bg-emerald-500",
        label: "Available",
        darkBg: "dark:bg-emerald-900/30",
        darkText: "dark:text-emerald-400",
      },
      partial: {
        bgColor: "bg-primary/10",
        textColor: "text-primary",
        dotColor: "bg-primary",
        label: "Partial",
        darkBg: "dark:bg-primary/20",
        darkText: "dark:text-primary",
      },
      full: {
        bgColor: "bg-primary/10",
        textColor: "text-primary",
        dotColor: "bg-primary",
        label: "Full",
        darkBg: "dark:bg-primary/20",
        darkText: "dark:text-primary",
      },
    };

    const config = statusConfig[status];
    return config;
  };

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
    return (
      <RoomconfigurationForm
        eventId={eventId}
        roomId={editingId}
        onDone={onFormDone}
        onCancel={onFormCancel}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {/* <!-- Breadcrumbs --> */}
        
        {/* <!-- Header Section --> */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Room Inventory Management
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Monitor and manage guest assignments for physical space inventory.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                /* export logic placeholder */
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <span className="material-symbols-outlined text-lg">
                file_download
              </span>
              Export PDF
            </button>
            <button
              onClick={() => setSearchParams({ action: "addRoom" })}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Room
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-red-500 dark:text-red-400">
              error
            </span>
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Stats Grid --> */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Rooms</p>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">
                bed
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {rooms.length}
              </h3>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Capacity
              </p>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">
                groups
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {rooms.reduce((a, r) => a + (r.capacity || 0), 0)}
              </h3>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Guests max
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Current Occupancy
              </p>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">
                check_circle
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {rooms.reduce((a, r) => a + (r.occupancy || 0), 0)}
              </h3>
              <span className="text-xs font-semibold text-primary">
                {rooms.length &&
                rooms.reduce((a, r) => a + (r.capacity || 0), 0)
                  ? Math.round(
                      (rooms.reduce((a, r) => a + (r.occupancy || 0), 0) /
                        rooms.reduce((a, r) => a + (r.capacity || 0), 0)) *
                        100,
                    )
                  : 0}
                % Full
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Available</p>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">
                door_open
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {rooms.filter((r) => (r.occupancy || 0) < r.capacity).length}
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                rooms available
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar --> */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by room number, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm placeholder-slate-500 text-slate-900 dark:text-white dark:placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
              filterStatus === "all"
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setFilterStatus("available")}
            className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
              filterStatus === "available"
                ? "bg-emerald-500 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Available (
            {rooms.filter((r) => (r.occupancy || 0) < r.capacity).length})
          </button>
          <button
            onClick={() => setFilterStatus("occupied")}
            className={`flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors ${
              filterStatus === "occupied"
                ? "bg-primary text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            Occupied ({rooms.filter((r) => (r.occupancy || 0) > 0).length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-600 animate-spin">
                hourglass_top
              </span>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Loading rooms...</p>
            </div>
          </div>
        )}

        {/* Room Grid --> */}
        {!loading && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room) => {
              const badge = getStatusBadge(room);
              const occupancy = room.occupancy || 0;
              const capacity = room.capacity || 1;
              const occupancyPercent = (occupancy / capacity) * 100;

              return (
                <div
                  key={room._id}
                  className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{room.number}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {room.type || "Standard"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.bgColor} ${badge.textColor} ${badge.darkBg} ${badge.darkText}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${badge.dotColor}`}
                      ></span>
                      {badge.label}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Capacity</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{capacity} Guests</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Occupancy</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {occupancy} / {capacity}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full bg-primary transition-all`}
                          style={{
                            width: `${Math.min(occupancyPercent, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  {room.notes && (
                    <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                      {room.notes}
                    </div>
                  )}
                  <div className="mt-6 flex gap-2">
                    {occupancy < capacity && (
                      <button
                        onClick={() => openAssignModal(room._id)}
                        className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                      >
                        Assign Guest
                      </button>
                    )}
                    <button
                      onClick={() => handleEditRoom(room._id)}
                      className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => setDeleteRoomId(room._id)}
                      className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700">
              meeting_room
            </span>
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
              No rooms yet
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Create your first room to get started
            </p>
          </div>
        )}

        {/* Empty Search State */}
        {!loading && filteredRooms.length === 0 && rooms.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700">
              search_off
            </span>
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
              No rooms found
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
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
          <p>{toast.message}</p>
        </div>
      )}

      {/* Assignment Modal */}
      {assignRoomId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assign Guest to Room</h3>
              <button
                onClick={closeAssignModal}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {assignError && (
              <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded text-sm text-red-700 dark:text-red-200">
                {assignError}
              </div>
            )}

            <div className="px-6 pt-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Search Guest
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={guestSearchQuery}
                  onChange={(e) => setGuestSearchQuery(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {assignLoading ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative mb-4 h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading guests...</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Fetching available guests from the server.</p>
                </div>
              ) : filteredGuests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    {availableGuests.length === 0
                      ? "No unassigned guests available"
                      : "No guests match your search"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredGuests.map((guest) => (
                    <button
                      key={guest._id}
                      onClick={() => handleAssignment(guest._id)}
                      disabled={assigning}
                      className="w-full p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-all disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold dark:text-white">{guest.fullName}</p>
                          <p className="text-sm text-slate-500">
                            {guest.email}
                          </p>
                        </div>
                        {assigning ? (
                          <span className="material-symbols-outlined animate-spin text-slate-400">
                            hourglass_top
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-slate-400">
                            person_add
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
              <button
                onClick={closeAssignModal}
                disabled={assigning}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteRoomId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    warning
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Room?</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete this room? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex gap-3 border-t border-slate-200 dark:border-slate-800 p-6">
              <button
                onClick={() => setDeleteRoomId(null)}
                disabled={deleteLoading}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                disabled={deleteLoading}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      hourglass_top
                    </span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {totalPages > 1 && (
  <div className="flex items-center justify-between mt-6">
    <p className="text-sm text-slate-500">
      Showing {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, totalCount)} of {totalCount} rooms
    </p>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Previous
      </button>
      <span className="text-sm font-bold">Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Next
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default RoomInventoryManagement;
