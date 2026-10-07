import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getSchedulesByEventId, createSchedule, updateSchedule, deleteSchedule } from '../../api/scheduleApi';
import { EventContext } from '../../context/EventContext';

// ─── Shared styles ────────────────────────────────────────────────────────────
const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none';
const FIELD_NW =
  'rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20 dark:[color-scheme:dark]';
const FIELD = `w-full ${FIELD_NW}`;
const BTN_PRIMARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200';
const BTN_SECONDARY =
  'inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

// ─── Timeline constants ───────────────────────────────────────────────────────
const TIMELINE_HOURS = Array.from({ length: 24 }, (_, i) => i);
const PX_PER_HOUR = 130;
const PX_PER_MINUTE = PX_PER_HOUR / 60;
const ROW_H = 96;

const WORKSTREAMS = [
  { name: 'Main Sessions', icon: 'show_chart', chip: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
  { name: 'Transport', icon: 'local_shipping', chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
  { name: 'Catering', icon: 'restaurant', chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' },
  { name: 'Staffing', icon: 'groups', chip: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' },
  { name: 'Media/AV', icon: 'videocam', chip: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' },
];

const COLOR_MAP = {
  'Main Sessions': 'border-l-blue-600 bg-blue-50 text-blue-900 hover:ring-blue-300 dark:border-l-blue-400 dark:bg-blue-500/15 dark:text-blue-100 dark:hover:ring-blue-400/40',
  Transport: 'border-l-amber-500 bg-amber-50 text-amber-900 hover:ring-amber-300 dark:bg-amber-500/15 dark:text-amber-100 dark:hover:ring-amber-400/40',
  Catering: 'border-l-emerald-500 bg-emerald-50 text-emerald-900 hover:ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-100 dark:hover:ring-emerald-400/40',
  Staffing: 'border-l-violet-500 bg-violet-50 text-violet-900 hover:ring-violet-300 dark:bg-violet-500/15 dark:text-violet-100 dark:hover:ring-violet-400/40',
  'Media/AV': 'border-l-rose-500 bg-rose-50 text-rose-900 hover:ring-rose-300 dark:bg-rose-500/15 dark:text-rose-100 dark:hover:ring-rose-400/40',
};

const STATUS_BADGE = {
  Confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  Active: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
  Cancelled: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
  Pending: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
};

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} />;
}

function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">{children}</label>;
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {msg}
    </p>
  );
}

export default function OprationalEventSchedule() {
  const { eventId } = useParams();
  const { event } = useContext(EventContext) || {};

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(() => new Date());

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const scrollRef = useRef(null);
  const toastTimer = useRef(null);

  const initialForm = {
    title: '',
    workstream: 'Main Sessions',
    startTime: '',
    endTime: '',
    location: '',
    assignedTo: '',
    description: '',
    status: 'Confirmed',
  };
  const [formData, setFormData] = useState(initialForm);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // keeps the "now" marker on the timeline moving
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const formatDateKeyLocal = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateTimeInputLocal = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const buildLocalDateTime = (dateKey, hours, minutes) => {
    if (!dateKey) return '';
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const localYear = date.getFullYear();
    const localMonth = String(date.getMonth() + 1).padStart(2, '0');
    const localDay = String(date.getDate()).padStart(2, '0');
    const localHours = String(date.getHours()).padStart(2, '0');
    const localMinutes = String(date.getMinutes()).padStart(2, '0');
    return `${localYear}-${localMonth}-${localDay}T${localHours}:${localMinutes}`;
  };

  const parseLocalDateTime = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSchedulesByEventId(eventId);
      if (res.success) {
        setSchedules(res.activities || []);
        setError(null);
      } else {
        setError(res.message || 'Failed to load schedule');
      }
    } catch (err) {
      console.error('Error loading schedule:', err);
      setError('Failed to load schedule. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchData();
  }, [eventId]);

  // 1. Unique dates combining event boundaries and schedule actuals
  const eventDates = useMemo(() => {
    const datesMap = new Map();

    if (event?.startDate && event?.endDate) {
      let current = new Date(event.startDate);
      const last = new Date(event.endDate);
      current.setHours(0, 0, 0, 0);
      last.setHours(0, 0, 0, 0);
      while (current <= last) {
        datesMap.set(current.getTime(), formatDateKeyLocal(current));
        current.setDate(current.getDate() + 1);
      }
    }

    schedules.forEach((s) => {
      if (!s.startTime) return;
      const d = new Date(s.startTime);
      d.setHours(0, 0, 0, 0);
      datesMap.set(d.getTime(), formatDateKeyLocal(d));
    });

    const sortedTimes = Array.from(datesMap.keys()).sort();
    return sortedTimes.map((t) => datesMap.get(t));
  }, [event, schedules]);

  // Default selected date (an explicitly chosen date, even a brand-new one, is kept)
  useEffect(() => {
    if (eventDates.length > 0 && !selectedDate) {
      const today = formatDateKeyLocal(new Date());
      setSelectedDate(eventDates.includes(today) ? today : eventDates[0]);
    }
  }, [eventDates, selectedDate]);

  // 2. Schedules for the selected date, search and status
  const daySchedules = useMemo(() => {
    if (!selectedDate) return [];
    return schedules.filter((s) => formatDateKeyLocal(s.startTime) === selectedDate);
  }, [schedules, selectedDate]);

  const filteredSchedules = useMemo(() => {
    return daySchedules.filter((s) => {
      if (statusFilter !== 'All' && s.status !== statusFilter) return false;
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        const mTitle = s.title?.toLowerCase().includes(lowerQ);
        const mLocation = s.location?.toLowerCase().includes(lowerQ);
        const mAssigned = s.assignedTo?.toLowerCase().includes(lowerQ);
        if (!mTitle && !mLocation && !mAssigned) return false;
      }
      return true;
    });
  }, [daySchedules, statusFilter, searchQuery]);

  // 3. Lane layout so overlapping blocks in a workstream stack instead of covering each other
  const layout = useMemo(() => {
    const out = {};
    WORKSTREAMS.forEach((ws) => {
      const items = filteredSchedules
        .filter((s) => s.workstream === ws.name)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      const laneEnds = [];
      items.forEach((s) => {
        const start = new Date(s.startTime).getTime();
        const end = new Date(s.endTime).getTime();
        let lane = laneEnds.findIndex((e) => e <= start);
        if (lane === -1) {
          lane = laneEnds.length;
          laneEnds.push(end);
        } else {
          laneEnds[lane] = end;
        }
        out[s._id] = { lane };
      });
      items.forEach((s) => {
        out[s._id].lanes = Math.max(laneEnds.length, 1);
      });
    });
    return out;
  }, [filteredSchedules]);

  // Land the timeline near the first activity of the day (or 08:00)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !selectedDate) return;
    let startHour = 8;
    if (daySchedules.length) {
      const mins = Math.min(
        ...daySchedules.map((s) => {
          const d = new Date(s.startTime);
          return d.getHours() * 60 + d.getMinutes();
        })
      );
      startHour = Math.max(0, mins / 60 - 1);
    }
    el.scrollLeft = startHour * PX_PER_HOUR;
  }, [selectedDate, loading]);

  const openCreate = (workstream = 'Main Sessions') => {
    setModalMode('create');
    setValidationErrors({});
    const defStart = selectedDate ? buildLocalDateTime(selectedDate, 9, 0) : '';
    const defEnd = selectedDate ? buildLocalDateTime(selectedDate, 10, 0) : '';
    setFormData({ ...initialForm, workstream, startTime: defStart, endTime: defEnd });
    setShowModal(true);
  };

  const handleOpenEdit = (activity) => {
    setModalMode('edit');
    setValidationErrors({});
    setFormData({
      ...activity,
      startTime: formatDateTimeInputLocal(activity.startTime),
      endTime: formatDateTimeInputLocal(activity.endTime),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const startDateTime = parseLocalDateTime(formData.startTime);
    const endDateTime = parseLocalDateTime(formData.endTime);

    if (!formData.title?.trim()) errors.title = 'Activity title is required';
    if (!formData.workstream?.trim()) errors.workstream = 'Workstream is required';
    if (!formData.startTime) {
      errors.startTime = 'Start time is required';
    } else if (!startDateTime) {
      errors.startTime = 'Please enter a valid start time';
    }
    if (!formData.endTime) {
      errors.endTime = 'End time is required';
    } else if (!endDateTime) {
      errors.endTime = 'Please enter a valid end time';
    }
    if (startDateTime && endDateTime && endDateTime <= startDateTime) {
      errors.startTime = 'Start time must be before end time';
      errors.endTime = 'End time must be after start time';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const dataToSubmit = {
      ...formData,
      eventId,
      // Convert the naive "wall-clock" datetime-local value into a real UTC
      // instant before sending it to the backend. Without this, the backend
      // Date cast interprets the naive string in the SERVER's local timezone
      // (not the browser's), which silently shifts every stored time by the
      // server/browser timezone offset.
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };

    setSaving(true);
    try {
      if (modalMode === 'create') {
        const res = await createSchedule(dataToSubmit);
        if (res.success) {
          setSchedules([...schedules, res.activity]);
          setShowModal(false);
          setValidationErrors({});
          showToast('Activity added to the schedule');
        } else {
          showToast(res.message || 'Failed to create activity', 'error');
        }
      } else {
        const res = await updateSchedule(formData._id, dataToSubmit);
        if (res.success) {
          setSchedules(schedules.map((s) => (s._id === res.activity._id ? res.activity : s)));
          if (selectedActivity?._id === res.activity._id) setSelectedActivity(res.activity);
          setShowModal(false);
          setValidationErrors({});
          showToast('Activity updated');
        } else {
          showToast(res.message || 'Failed to update activity', 'error');
        }
      }
    } catch (err) {
      console.error('Schedule save error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteSchedule(deleteTarget._id);
      if (res.success) {
        setSchedules(schedules.filter((s) => s._id !== deleteTarget._id));
        if (selectedActivity?._id === deleteTarget._id) setSelectedActivity(null);
        showToast('Activity deleted');
        setDeleteTarget(null);
      } else {
        showToast(res.message || 'Failed to delete activity', 'error');
      }
    } catch (err) {
      console.error('Schedule delete error:', err);
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Escape closes the top-most layer
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (deleteTarget && !deleting) setDeleteTarget(null);
      else if (showModal && !saving) setShowModal(false);
      else if (selectedActivity) setSelectedActivity(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteTarget, deleting, showModal, saving, selectedActivity]);

  const formatDisplayTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateBlockStyles = (act) => {
    if (!act.startTime || !act.endTime) return { display: 'none' };

    let start = new Date(act.startTime);
    let end = new Date(act.endTime);

    // Cross-day clamping to the selected date
    const dayStart = new Date(`${selectedDate}T00:00:00`);
    const dayEnd = new Date(`${selectedDate}T00:00:00`);
    dayEnd.setHours(23, 59, 59, 999);

    if (start < dayStart) start = dayStart;
    if (end > dayEnd) end = dayEnd;
    if (end < start) return { display: 'none' };

    const startMins = start.getHours() * 60 + start.getMinutes();
    const endMins = end.getHours() * 60 + end.getMinutes() + (end.getHours() === 23 && end.getMinutes() === 59 ? 1 : 0);

    const { lane = 0, lanes = 1 } = layout[act._id] || {};
    const gap = 4;
    const pad = 8;
    const h = (ROW_H - pad * 2 - gap * (lanes - 1)) / lanes;

    return {
      position: 'absolute',
      left: `${startMins * PX_PER_MINUTE}px`,
      width: `${Math.max((endMins - startMins) * PX_PER_MINUTE, 48)}px`,
      top: `${pad + lane * (h + gap)}px`,
      height: `${h}px`,
    };
  };

  const isToday = selectedDate && selectedDate === formatDateKeyLocal(now);
  const nowLeft = (now.getHours() * 60 + now.getMinutes()) * PX_PER_MINUTE;

  // ── Loading / error ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className={`h-[34rem] p-5 ${CARD}`}>
          <Skeleton className="mb-4 h-10 w-full" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="mb-3 h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-500/30 dark:bg-slate-900">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <span className="material-symbols-outlined text-[25px]">error</span>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Couldn't load the schedule</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
        <button onClick={fetchData} className={`${BTN_PRIMARY} mt-6`}>
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  const countBy = (s) => daySchedules.filter((a) => a.status === s).length;
  const hasFilters = !!searchQuery || statusFilter !== 'All';

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Schedule</p>
          <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50">
            Operational schedule
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Plan and monitor every workstream on a day-by-day timeline.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search activities…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${FIELD_NW} h-10 w-full bg-white pl-10 dark:bg-slate-900`}
            />
          </div>
          <div className="relative w-full sm:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Status filter"
              className={`${FIELD_NW} h-10 w-full cursor-pointer appearance-none bg-white pr-10 dark:bg-slate-900`}
            >
              <option value="All">All statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">expand_more</span>
          </div>
          <button onClick={() => openCreate()} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
            <span className="material-symbols-outlined text-[19px]">add</span>
            Add schedule block
          </button>
        </div>
      </div>

      {/* Day summary */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-800 dark:shadow-none lg:grid-cols-4">
        {[
          { icon: 'event_note', label: 'Activities this day', value: daySchedules.length, color: 'text-blue-700 dark:text-blue-300' },
          { icon: 'check_circle', label: 'Confirmed', value: countBy('Confirmed'), color: 'text-emerald-700 dark:text-emerald-300' },
          { icon: 'pending', label: 'Pending', value: countBy('Pending'), color: 'text-amber-700 dark:text-amber-300' },
          { icon: 'cancel', label: 'Cancelled', value: countBy('Cancelled'), color: 'text-red-700 dark:text-red-300' },
        ].map((it) => (
          <div key={it.label} className="bg-white p-4 dark:bg-slate-900 sm:p-5">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              <span className={`material-symbols-outlined text-[16px] ${it.color}`}>{it.icon}</span>
              {it.label}
            </p>
            <p className="mt-2 text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50 sm:text-[28px]">
              {it.value}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline card */}
      <section className={`relative flex flex-col overflow-hidden ${CARD}`}>
        {/* Date tabs */}
        <div className="flex overflow-x-auto border-b border-slate-100 px-2 dark:border-slate-800 sm:px-4">
          {eventDates.map((dateStr) => {
            const d = new Date(`${dateStr}T00:00:00`);
            const isActive = selectedDate === dateStr;
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const count = schedules.filter((s) => formatDateKeyLocal(s.startTime) === dateStr).length;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                aria-current={isActive ? 'date' : undefined}
                className={`-mb-px flex shrink-0 flex-col items-start border-b-2 px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-blue-600 dark:border-blue-400'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {dayName}
                </span>
                <span className={`text-sm font-extrabold ${isActive ? 'text-slate-950 dark:text-slate-50' : 'text-slate-700 dark:text-slate-300'}`}>
                  {monthDay}
                  <span className="ml-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">· {count}</span>
                </span>
              </button>
            );
          })}
          {eventDates.length === 0 && (
            <span className="px-3 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">No event dates or activities found.</span>
          )}
        </div>

        {/* Timeline */}
        <div className="relative flex overflow-hidden">
          {/* Workstream labels */}
          <div className="z-10 w-36 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:w-56">
            <div className="flex h-12 items-center border-b border-slate-200 bg-slate-50 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              Workstreams
            </div>
            {WORKSTREAMS.map((ws) => (
              <div
                key={ws.name}
                style={{ height: ROW_H }}
                className="flex items-center gap-3 border-b border-dashed border-slate-200 px-3 dark:border-slate-800 md:px-4"
              >
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${ws.chip}`}>
                  <span className="material-symbols-outlined text-[19px]">{ws.icon}</span>
                </div>
                <p className="min-w-0 text-[13px] font-bold leading-tight text-slate-800 dark:text-slate-100">{ws.name}</p>
              </div>
            ))}
          </div>

          {/* Scroll area */}
          <div
            ref={scrollRef}
            className="relative flex-1 overflow-x-auto bg-slate-50/40 dark:bg-slate-950/30 [scrollbar-width:thin]"
          >
            <div style={{ width: `${TIMELINE_HOURS.length * PX_PER_HOUR}px` }}>
              {/* Hour header */}
              <div className="sticky top-0 z-20 flex h-12 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                {TIMELINE_HOURS.map((hour) => (
                  <div
                    key={hour}
                    style={{ width: `${PX_PER_HOUR}px` }}
                    className="flex h-full shrink-0 border-r border-dashed border-slate-200 dark:border-slate-800"
                  >
                    <span className="ml-1.5 mt-2.5 text-[11px] font-bold tabular-nums text-slate-500 dark:text-slate-400">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="relative">
                {/* grid lines */}
                <div className="pointer-events-none absolute inset-0 z-0 flex">
                  {TIMELINE_HOURS.map((hour) => (
                    <div
                      key={hour}
                      style={{ width: `${PX_PER_HOUR}px` }}
                      className="h-full shrink-0 border-r border-dashed border-slate-200/80 dark:border-slate-800"
                    />
                  ))}
                </div>

                {/* now marker */}
                {isToday && (
                  <div
                    className="pointer-events-none absolute bottom-0 top-0 z-20 w-px bg-red-500"
                    style={{ left: `${nowLeft}px` }}
                    title="Now"
                  >
                    <span className="absolute -left-1 -top-1 size-2 rounded-full bg-red-500" />
                  </div>
                )}

                {WORKSTREAMS.map((ws) => {
                  const wsActivities = filteredSchedules.filter((s) => s.workstream === ws.name);
                  return (
                    <div
                      key={ws.name}
                      style={{ height: ROW_H }}
                      className="group relative z-10 border-b border-dashed border-slate-200 transition-colors hover:bg-slate-100/40 dark:border-slate-800 dark:hover:bg-slate-800/20"
                    >
                      {wsActivities.map((act) => {
                        const style = calculateBlockStyles(act);
                        const compact = (parseFloat(style.height) || 80) < 44;
                        const cancelled = act.status === 'Cancelled';
                        const selected = selectedActivity?._id === act._id;
                        return (
                          <button
                            key={act._id}
                            type="button"
                            onClick={() => setSelectedActivity(act)}
                            style={style}
                            className={`flex flex-col overflow-hidden rounded-lg border-l-4 px-2 py-1.5 text-left shadow-sm transition hover:ring-2 ${
                              COLOR_MAP[ws.name] || COLOR_MAP['Main Sessions']
                            } ${selected ? 'ring-2' : ''} ${cancelled ? 'opacity-60' : ''}`}
                          >
                            <h4 className={`truncate text-[11px] font-extrabold tracking-tight ${cancelled ? 'line-through' : ''}`}>{act.title}</h4>
                            {!compact && (
                              <span className="mt-0.5 block text-[10px] font-semibold tabular-nums opacity-80">
                                {formatDisplayTime(act.startTime)} – {formatDisplayTime(act.endTime)}
                              </span>
                            )}
                            {!compact && act.location && (
                              <p className="mt-auto w-full truncate rounded bg-white/50 px-1 text-[10px] font-medium opacity-90 dark:bg-slate-950/30">
                                {act.location}
                              </p>
                            )}
                          </button>
                        );
                      })}
                      {wsActivities.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => openCreate(ws.name)}
                            className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-300"
                          >
                            + Add block to {ws.name}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity details (slide-over) */}
          {selectedActivity && (
            <aside className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/60">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Activity details</h3>
                <button
                  onClick={() => setSelectedActivity(null)}
                  aria-label="Close details"
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                >
                  <span className="material-symbols-outlined text-[19px]">close</span>
                </button>
              </div>

              <div className="p-5">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                  {selectedActivity.workstream}
                </p>
                <h2 className="text-xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-slate-50">
                  {selectedActivity.title}
                </h2>
                <span
                  className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    STATUS_BADGE[selectedActivity.status] || STATUS_BADGE.Pending
                  }`}
                >
                  {selectedActivity.status || 'Pending'}
                </span>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      icon: 'event',
                      title: new Date(selectedActivity.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                      sub: `${formatDisplayTime(selectedActivity.startTime)} to ${formatDisplayTime(selectedActivity.endTime)}`,
                    },
                    selectedActivity.location && { icon: 'location_on', title: selectedActivity.location, sub: 'Venue' },
                    selectedActivity.assignedTo && { icon: 'person', title: selectedActivity.assignedTo, sub: 'Assigned staff / VIP' },
                  ]
                    .filter(Boolean)
                    .map((row) => (
                      <div key={row.icon} className="flex items-start gap-3.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[19px]">{row.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{row.title}</p>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{row.sub}</p>
                        </div>
                      </div>
                    ))}

                  {selectedActivity.description && (
                    <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                      <p className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">Activity briefing</p>
                      <p className="rounded-xl bg-slate-50 p-3.5 text-xs leading-6 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                        {selectedActivity.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col gap-2.5 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <button onClick={() => handleOpenEdit(selectedActivity)} className={`${BTN_SECONDARY} w-full`}>
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit details
                  </button>
                  <button
                    onClick={() => setDeleteTarget(selectedActivity)}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete activity
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>

        {hasFilters && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-700 dark:text-slate-200">{filteredSchedules.length}</strong> of {daySchedules.length} activities
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
              }}
              className="font-bold text-blue-700 hover:underline dark:text-blue-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Create / edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => !saving && setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {modalMode === 'create' ? 'Add schedule activity' : 'Edit activity'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <form id="schedule-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <Label>Activity title</Label>
                  <input
                    autoFocus
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`${FIELD} h-11 ${validationErrors.title ? 'border-red-300 dark:border-red-500/40' : ''}`}
                    placeholder="E.g., Opening keynote session"
                  />
                  <FieldError msg={validationErrors.title} />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Workstream</Label>
                    <select
                      value={formData.workstream}
                      onChange={(e) => setFormData({ ...formData, workstream: e.target.value })}
                      className={`${FIELD} h-11 cursor-pointer`}
                    >
                      {WORKSTREAMS.map((w) => (
                        <option key={w.name} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={`${FIELD} h-11 cursor-pointer`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Start time</Label>
                    <input
                      type="datetime-local"
                      value={formatDateTimeInputLocal(formData.startTime)}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className={`${FIELD} h-11 ${validationErrors.startTime ? 'border-red-300 dark:border-red-500/40' : ''}`}
                    />
                    <FieldError msg={validationErrors.startTime} />
                  </div>
                  <div>
                    <Label>End time</Label>
                    <input
                      type="datetime-local"
                      value={formatDateTimeInputLocal(formData.endTime)}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className={`${FIELD} h-11 ${validationErrors.endTime ? 'border-red-300 dark:border-red-500/40' : ''}`}
                    />
                    <FieldError msg={validationErrors.endTime} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>Location / venue</Label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={`${FIELD} h-11`}
                      placeholder="E.g., Grand Ballroom A"
                    />
                  </div>
                  <div>
                    <Label>Assigned staff / name</Label>
                    <input
                      type="text"
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className={`${FIELD} h-11`}
                      placeholder="E.g., Sarah Jenkins"
                    />
                  </div>
                </div>

                <div>
                  <Label>Briefing / notes</Label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${FIELD} resize-none py-2.5`}
                    placeholder="Special instructions, AV requirements, setup details…"
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowModal(false)} disabled={saving} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button type="submit" form="schedule-form" disabled={saving} className={BTN_PRIMARY}>
                {saving && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />}
                {saving ? 'Saving…' : modalMode === 'create' ? 'Save activity' : 'Update activity'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[75] flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <span className="material-symbols-outlined text-[24px]">delete</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Delete this activity?</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  "{deleteTarget.title}" will be removed from the schedule. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className={BTN_SECONDARY}>
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                Delete activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}