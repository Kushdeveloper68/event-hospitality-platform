import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  getActivityLogs,
  getActivitySummary,
  getActivityTypes,
} from '../../api/activityAndNotificationLogsApi';

// ─── Constants ────────────────────────────────────────────────────────────────
const LIMIT = 20;

const CARD =
  'rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none';
const FIELD =
  'h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20 dark:[color-scheme:dark]';
const BTN_PRIMARY =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200';
const BTN_SECONDARY =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

const PRIORITY_CONFIG = {
  critical: {
    label: 'Critical',
    badge: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300',
    dot: 'bg-red-500',
    bar: 'bg-red-500',
    row: 'bg-red-50/40 dark:bg-red-500/5',
    pulse: true,
  },
  high: {
    label: 'High',
    badge: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300',
    dot: 'bg-orange-500',
    bar: 'bg-orange-500',
    row: 'bg-orange-50/30 dark:bg-orange-500/5',
    pulse: false,
  },
  normal: {
    label: 'Normal',
    badge: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
    bar: 'bg-transparent',
    row: '',
    pulse: false,
  },
};

const TYPE_CONFIG = {
  'check-in': { icon: 'how_to_reg', chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300', label: 'Check-in' },
  'check-out': { icon: 'logout', chip: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', label: 'Check-out' },
  registration: { icon: 'person_add', chip: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300', label: 'Registration' },
  service: { icon: 'room_service', chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300', label: 'Service' },
  transport: { icon: 'local_shipping', chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300', label: 'Transport' },
  'room-assignment': { icon: 'meeting_room', chip: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300', label: 'Room assign' },
  schedule: { icon: 'schedule', chip: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300', label: 'Schedule' },
};

const getTypeConfig = (type) =>
  TYPE_CONFIG[type] || { icon: 'notifications', chip: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', label: type };
const getPriorityConfig = (priority) => PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

const fmtTime = (d) => (d ? new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '');

const dayKey = (ts) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const dayLabel = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (dayKey(d) === dayKey(today)) return 'Today';
  if (dayKey(d) === dayKey(yesterday)) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// ─── Sub-components ───────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
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
          <div className="mt-2 flex items-center gap-2">
            <p className="text-2xl font-extrabold leading-none tracking-tight tabular-nums text-slate-950 dark:text-slate-50 sm:text-[28px]">
              {it.value}
            </p>
            {it.pulse && <span className="size-2 animate-pulse rounded-full bg-red-500" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogRow({ log }) {
  const type = getTypeConfig(log.type);
  const priority = getPriorityConfig(log.priority);
  const flagged = log.priority === 'critical' || log.priority === 'high';

  return (
    <div className={`group relative flex items-start gap-3.5 border-b border-slate-100 px-5 py-4 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40 sm:gap-4 sm:px-6 ${priority.row}`}>
      <div className={`absolute bottom-0 left-0 top-0 w-1 ${priority.bar}`} />

      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${type.chip}`}>
        <span className="material-symbols-outlined text-[20px]">{type.icon}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {log.message}
          </p>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400" title={fmtDate(log.timestamp)}>
              {fmtTime(log.timestamp)}
              <span className="ml-1.5 hidden font-medium text-slate-400 dark:text-slate-500 sm:inline">· {timeAgo(log.timestamp)}</span>
            </span>
            {flagged && (
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${priority.badge}`}>
                <span className={`size-1.5 rounded-full ${priority.dot} ${priority.pulse ? 'animate-pulse' : ''}`} />
                {priority.label}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${type.chip}`}>{type.label}</span>

          {log.event?.name && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[14px]">event</span>
              {log.event.name}
            </span>
          )}
          {log.event?.venue && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              {log.event.venue}
            </span>
          )}
          {log.relatedGuest?.fullName && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                log.relatedGuest.vipStatus
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]" style={log.relatedGuest.vipStatus ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                {log.relatedGuest.vipStatus ? 'star' : 'person'}
              </span>
              {log.relatedGuest.fullName}
              {log.relatedGuest.vipStatus && <span className="text-[9px] uppercase tracking-wider">VIP</span>}
            </span>
          )}
          {log.relatedStaff?.name && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[14px]">badge</span>
              {log.relatedStaff.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
      <Skeleton className="size-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-14" />
    </div>
  );
}

function EmptyState({ filtered, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <span className="material-symbols-outlined text-[24px]">{filtered ? 'filter_alt_off' : 'notifications_off'}</span>
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{filtered ? 'No logs match these filters' : 'No activity yet'}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {filtered ? 'Try adjusting your filters or date range.' : 'Activity will appear here as operations begin.'}
      </p>
      {filtered && (
        <button onClick={onClear} className={`${BTN_SECONDARY} mt-5`}>
          Clear filters
        </button>
      )}
    </div>
  );
}

function Chip({ children, onRemove, icon }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1 pl-2.5 pr-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {icon && <span className="material-symbols-outlined text-[13px]">{icon}</span>}
      {children}
      <button
        onClick={onRemove}
        aria-label="Remove filter"
        className="flex size-5 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function ActivityAndNotificationLogs() {
  // Data
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({ total: 0, criticalCount: 0, todayCount: 0, byType: [], byPriority: [] });
  const [userEvents, setUserEvents] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters
  const [eventFilter, setEventFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const searchDebounce = useRef(null);
  const toastTimer = useRef(null);
  const loadedOnce = useRef(false);
  const reqId = useRef(0);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(searchDebounce.current);
    },
    []
  );

  // ── Fetch logs ──────────────────────────────────────────────────────────
  const fetchLogs = useCallback(
    async ({ quiet = false } = {}) => {
      const id = ++reqId.current;
      try {
        if (!quiet && !loadedOnce.current) setLoading(true);
        else setRefreshing(true);
        setError(null);

        const params = {
          page,
          limit: LIMIT,
          ...(eventFilter && { eventId: eventFilter }),
          ...(typeFilter !== 'all' && { type: typeFilter }),
          ...(priorityFilter !== 'all' && { priority: priorityFilter }),
          ...(search && { search }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        };

        const [logsRes, summaryRes] = await Promise.all([getActivityLogs(params), getActivitySummary(eventFilter || null)]);
        if (id !== reqId.current) return;

        if (logsRes.success) {
          setLogs(logsRes.logs || []);
          setTotal(logsRes.total || 0);
          if (logsRes.events?.length) setUserEvents(logsRes.events);
          setLastUpdated(new Date());
          loadedOnce.current = true;
        } else {
          setError(logsRes.message || 'Failed to fetch logs');
        }

        if (summaryRes.success) {
          setSummary(summaryRes.summary || {});
        }
      } catch (err) {
        if (id !== reqId.current) return;
        setError('Network error. Please check your connection.');
      } finally {
        if (id === reqId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [page, eventFilter, typeFilter, priorityFilter, search, startDate, endDate]
  );

  // ── Fetch available types ──────────────────────────────────────────────
  useEffect(() => {
    getActivityTypes()
      .then((res) => {
        if (res.success) setAvailableTypes(res.types || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Auto refresh every 30s (paused while the tab is hidden) ─────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) fetchLogs({ quiet: true });
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  // ── Search debounce ────────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setPage(1);
      setSearch(val.trim());
    }, 300);
  };

  const clearFilters = () => {
    clearTimeout(searchDebounce.current);
    setEventFilter('');
    setTypeFilter('all');
    setPriorityFilter('all');
    setSearch('');
    setSearchInput('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasActiveFilters = !!(eventFilter || typeFilter !== 'all' || priorityFilter !== 'all' || search || startDate || endDate);
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const from = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, total);
  const firstLoad = loading && !loadedOnce.current;
  const eventName = userEvents.find((e) => e._id === eventFilter)?.name;

  // ── CSV Export (the entries on this page) ──────────────────────────────
  const handleExport = () => {
    if (!logs.length) {
      showToast('No data to export', 'error');
      return;
    }
    const headers = ['Time', 'Event', 'Type', 'Priority', 'Message', 'Guest', 'Venue'];
    const rows = logs.map((l) => [
      fmtDate(l.timestamp),
      l.event?.name || '',
      l.type,
      l.priority,
      l.message || '',
      l.relatedGuest?.fullName || '',
      l.event?.venue || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map(csvCell).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully');
  };

  // Group the current page's rows by day for easy scanning
  const grouped = [];
  logs.forEach((log) => {
    const key = dayKey(log.timestamp);
    const last = grouped[grouped.length - 1];
    if (last && last.key === key) last.items.push(log);
    else grouped.push({ key, label: dayLabel(log.timestamp), items: [log] });
  });

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-[1200px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Toast */}
        {toast && (
          <div
            role="status"
            className={`fixed bottom-4 left-4 right-4 z-[80] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
            <span className="min-w-0">{toast.msg}</span>
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Operations center</p>
            <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-slate-950 dark:text-slate-50 md:text-[32px]">
              Activity &amp; notification logs
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Audit trail of operational events across all your events.
              {lastUpdated && (
                <span className="ml-1.5 text-slate-400 dark:text-slate-500">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · auto-refreshes every 30s
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchLogs({ quiet: true })} disabled={refreshing} className={BTN_SECONDARY}>
              <span className={`material-symbols-outlined text-[18px] ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button onClick={handleExport} disabled={!logs.length} title="Exports the entries shown on this page" className={BTN_PRIMARY}>
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export page
            </button>
          </div>
        </header>

        {/* Summary */}
        <StatStrip
          items={[
            { icon: 'history', label: 'Total logs', value: summary.total?.toLocaleString() || 0, color: 'text-blue-700 dark:text-blue-300' },
            {
              icon: 'emergency',
              label: 'Critical / high',
              value: summary.criticalCount || 0,
              color: summary.criticalCount > 0 ? 'text-red-700 dark:text-red-300' : 'text-slate-500 dark:text-slate-400',
              pulse: summary.criticalCount > 0,
            },
            { icon: 'today', label: 'Today', value: summary.todayCount || 0, color: 'text-indigo-700 dark:text-indigo-300' },
            { icon: 'event', label: 'Events tracked', value: userEvents.length || 0, color: 'text-emerald-700 dark:text-emerald-300' },
          ]}
        />

        {/* Filters */}
        <section className={`p-4 sm:p-5 ${CARD}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
              <input
                value={searchInput}
                onChange={handleSearchChange}
                className={`${FIELD} w-full pl-10`}
                placeholder="Search messages, guests, types…"
                type="text"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  value={eventFilter}
                  onChange={(e) => {
                    setEventFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Event"
                  className={`${FIELD} w-full min-w-[10rem] cursor-pointer appearance-none pr-9 sm:w-auto`}
                >
                  <option value="">All events</option>
                  {userEvents.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Type"
                  className={`${FIELD} w-full min-w-[9rem] cursor-pointer appearance-none pr-9 sm:w-auto`}
                >
                  <option value="all">All types</option>
                  {(availableTypes.length ? availableTypes : Object.keys(TYPE_CONFIG)).map((t) => (
                    <option key={t} value={t}>
                      {getTypeConfig(t).label}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {/* Priority */}
            <div className="flex w-fit rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {[
                ['all', 'All'],
                ['critical', 'Critical'],
                ['high', 'High'],
                ['normal', 'Normal'],
              ].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => {
                    setPriorityFilter(k);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    priorityFilter === k
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Date range */}
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                aria-label="Start date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className={`${FIELD} h-9 text-xs`}
              />
              <span className="text-xs font-bold text-slate-400">–</span>
              <input
                type="date"
                aria-label="End date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className={`${FIELD} h-9 text-xs`}
              />
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline dark:text-blue-300 sm:ml-auto">
                <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                Clear all
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              {eventFilter && eventName && (
                <Chip icon="event" onRemove={() => setEventFilter('')}>
                  {eventName}
                </Chip>
              )}
              {typeFilter !== 'all' && <Chip onRemove={() => setTypeFilter('all')}>{getTypeConfig(typeFilter).label}</Chip>}
              {priorityFilter !== 'all' && <Chip onRemove={() => setPriorityFilter('all')}>{getPriorityConfig(priorityFilter).label} priority</Chip>}
              {search && (
                <Chip icon="search" onRemove={() => { setSearch(''); setSearchInput(''); }}>
                  “{search}”
                </Chip>
              )}
              {(startDate || endDate) && (
                <Chip
                  icon="date_range"
                  onRemove={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                >
                  {startDate || '…'} → {endDate || '…'}
                </Chip>
              )}
            </div>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <div className="flex min-w-0 items-center gap-2">
              <span className="material-symbols-outlined text-[19px]">warning</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={() => fetchLogs()} className="text-xs font-bold underline underline-offset-2 hover:no-underline">
                Retry
              </button>
              <button onClick={() => setError(null)} aria-label="Dismiss" className="flex">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Feed */}
        <section className={`overflow-hidden ${CARD}`}>
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
            <div>
              <h2 className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Activity feed</h2>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">Newest first</p>
            </div>
            <p className="text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
              {firstLoad ? 'Loading…' : `${total.toLocaleString()} ${total === 1 ? 'entry' : 'entries'}`}
            </p>
          </div>

          {firstLoad ? (
            <div>
              {[...Array(6)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <EmptyState filtered={hasActiveFilters} onClear={clearFilters} />
          ) : (
            <div aria-busy={refreshing} className={`transition-opacity ${refreshing ? 'opacity-60' : ''}`}>
              {grouped.map((group) => (
                <div key={group.key}>
                  <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 sm:px-6">
                    {group.label}
                  </div>
                  {group.items.map((log) => (
                    <LogRow key={log._id} log={log} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!firstLoad && logs.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span>
                Showing <strong className="text-slate-700 dark:text-slate-200">{from}–{to}</strong> of{' '}
                <strong className="text-slate-700 dark:text-slate-200">{total.toLocaleString()}</strong>
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    Previous
                  </button>
                  <span className="px-1 font-bold tabular-nums text-slate-700 dark:text-slate-200">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
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

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em]">Priority</span>
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityAndNotificationLogs;