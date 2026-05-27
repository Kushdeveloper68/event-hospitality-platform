import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  getActivityLogs,
  getActivitySummary,
  getActivityTypes,
} from '../../api/activityAndNotificationLogsApi';

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/40',
    dot: 'bg-red-500',
    rowBg: 'bg-red-50/50 dark:bg-red-900/10',
    label: 'Critical',
    icon: 'emergency',
    pulse: true,
  },
  high: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-900/40',
    dot: 'bg-orange-500',
    rowBg: 'bg-orange-50/30 dark:bg-orange-900/5',
    label: 'High',
    icon: 'warning',
    pulse: false,
  },
  normal: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
    rowBg: '',
    label: 'Normal',
    icon: 'info',
    pulse: false,
  },
};

const TYPE_CONFIG = {
  'check-in': { icon: 'how_to_reg', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Check-in' },
  'check-out': { icon: 'logout', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', label: 'Check-out' },
  'registration': { icon: 'person_add', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Registration' },
  'service': { icon: 'room_service', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Service' },
  'transport': { icon: 'local_shipping', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20', label: 'Transport' },
  'room-assignment': { icon: 'meeting_room', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'Room Assign' },
  'schedule': { icon: 'schedule', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-900/20', label: 'Schedule' },
};

const getTypeConfig = (type) =>
  TYPE_CONFIG[type] || { icon: 'notifications', color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', label: type };

const getPriorityConfig = (priority) =>
  PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal;

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatPill({ icon, label, value, accent = 'slate', pulse = false }) {
  const accentMap = {
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
    slate: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30',
  };
  return (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${accentMap[accent]}`}>
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</p>
        <p className="text-lg font-black leading-none flex items-center gap-1.5">
          {value}
          {pulse && <span className="size-2 rounded-full bg-red-500 animate-pulse" />}
        </p>
      </div>
    </div>
  );
}

function LogRow({ log, isNew = false }) {
  const typeConfig = getTypeConfig(log.type);
  const priorityConfig = getPriorityConfig(log.priority);

  return (
    <div className={`group relative flex items-start gap-4 px-6 py-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 last:border-0 ${priorityConfig.rowBg} ${isNew ? 'animate-pulse-once' : ''}`}>
      
      {/* Priority left accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${priorityConfig.dot}`} />

      {/* Type icon */}
      <div className={`shrink-0 size-10 rounded-xl flex items-center justify-center ${typeConfig.bg}`}>
        <span className={`material-symbols-outlined text-lg ${typeConfig.color}`}>{typeConfig.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {log.message}
            </p>

            {/* Event pill */}
            {log.event?.name && (
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[10px]">event</span>
                {log.event.name}
              </span>
            )}

            {/* Guest pill */}
            {log.relatedGuest?.fullName && (
              <span className={`inline-flex items-center gap-1 mt-1 ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${log.relatedGuest.vipStatus ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                <span className="material-symbols-outlined text-[10px]">{log.relatedGuest.vipStatus ? 'star' : 'person'}</span>
                {log.relatedGuest.fullName}
                {log.relatedGuest.vipStatus && <span className="text-[8px] uppercase tracking-wider">VIP</span>}
              </span>
            )}
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
              <span className={`size-1.5 rounded-full ${priorityConfig.dot} ${priorityConfig.pulse ? 'animate-pulse' : ''}`} />
              {priorityConfig.label}
            </span>

            {/* Time */}
            <span className="text-[11px] text-slate-400 dark:text-slate-500" title={fmtDate(log.timestamp)}>
              {timeAgo(log.timestamp)}
            </span>
          </div>
        </div>

        {/* Type + event location row */}
        <div className="flex items-center gap-3 mt-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${typeConfig.bg} ${typeConfig.color}`}>
            {getTypeConfig(log.type).label}
          </span>
          {log.event?.venue && (
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">location_on</span>
              {log.event.venue}
            </span>
          )}
          {log.relatedStaff?.name && (
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[10px]">badge</span>
              {log.relatedStaff.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
          {filtered ? 'filter_alt_off' : 'notifications_off'}
        </span>
      </div>
      <p className="text-slate-700 dark:text-slate-300 font-bold text-lg">
        {filtered ? 'No logs match these filters' : 'No activity yet'}
      </p>
      <p className="text-slate-400 text-sm mt-1">
        {filtered ? 'Try adjusting your filters or date range.' : 'Activity will appear here as operations begin.'}
      </p>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
      <div className="size-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
      </div>
      <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
    </div>
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const searchRef = useRef(null);
  const searchDebounce = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch logs ──────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async ({ quiet = false } = {}) => {
    try {
      if (!quiet) setLoading(true);
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

      const [logsRes, summaryRes] = await Promise.all([
        getActivityLogs(params),
        getActivitySummary(eventFilter || null),
      ]);

      if (logsRes.success) {
        setLogs(logsRes.logs || []);
        setTotal(logsRes.total || 0);
        if (logsRes.events?.length) setUserEvents(logsRes.events);
        setLastUpdated(new Date());
      } else {
        setError(logsRes.message || 'Failed to fetch logs');
      }

      if (summaryRes.success) {
        setSummary(summaryRes.summary || {});
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, eventFilter, typeFilter, priorityFilter, search, startDate, endDate]);

  // ── Fetch available types ──────────────────────────────────────────────
  useEffect(() => {
    getActivityTypes().then((res) => {
      if (res.success) setAvailableTypes(res.types || []);
    });
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Auto refresh every 30s ─────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => fetchLogs({ quiet: true }), 30000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  // ── Search debounce ────────────────────────────────────────────────────
  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setPage(1);
      setSearch(val);
    }, 300);
  };

  const clearFilters = () => {
    setEventFilter('');
    setTypeFilter('all');
    setPriorityFilter('all');
    setSearch('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    if (searchRef.current) searchRef.current.value = '';
  };

  const hasActiveFilters = eventFilter || typeFilter !== 'all' || priorityFilter !== 'all' || search || startDate || endDate;
  const totalPages = Math.ceil(total / LIMIT);

  // ── CSV Export ─────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!logs.length) { showToast('No data to export', 'error'); return; }
    const headers = ['Time', 'Event', 'Type', 'Priority', 'Message', 'Guest', 'Venue'];
    const rows = logs.map((l) => [
      fmtDate(l.timestamp),
      `"${l.event?.name || ''}"`,
      l.type,
      l.priority,
      `"${l.message || ''}"`,
      `"${l.relatedGuest?.fullName || ''}"`,
      `"${l.event?.venue || ''}"`,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-950">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
          <span className="material-symbols-outlined text-lg">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto w-full p-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Operations Center</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Activity & Notification Logs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Live audit trail of all operational events across your events.
              {lastUpdated && (
                <span className="ml-2 text-slate-400">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchLogs({ quiet: true })}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-lg ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              onClick={handleExport}
              disabled={!logs.length}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-40 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Summary pills ── */}
        <div className="flex flex-wrap gap-3">
          <StatPill icon="history" label="Total Logs" value={summary.total?.toLocaleString() || 0} accent="slate" />
          <StatPill icon="emergency" label="Critical / High" value={summary.criticalCount || 0} accent={summary.criticalCount > 0 ? 'red' : 'slate'} pulse={summary.criticalCount > 0} />
          <StatPill icon="today" label="Today" value={summary.todayCount || 0} accent="blue" />
          {userEvents.length > 0 && (
            <StatPill icon="event" label="Events Tracked" value={userEvents.length} accent="green" />
          )}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                ref={searchRef}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none dark:text-white placeholder:text-slate-400"
                placeholder="Search messages, types…"
                type="text"
              />
            </div>

            {/* Event filter */}
            <select
              value={eventFilter}
              onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-700 dark:text-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none min-w-[160px]"
            >
              <option value="">All Events</option>
              {userEvents.map((ev) => (
                <option key={ev._id} value={ev._id}>{ev.name}</option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-700 dark:text-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]"
            >
              <option value="all">All Types</option>
              {(availableTypes.length ? availableTypes : Object.keys(TYPE_CONFIG)).map((t) => (
                <option key={t} value={t}>{getTypeConfig(t).label}</option>
              ))}
            </select>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-700 dark:text-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>

            {/* Date range */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none w-28"
              />
              <span className="text-slate-400 text-xs">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="bg-transparent text-xs text-slate-700 dark:text-slate-300 outline-none w-28"
              />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                Clear
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {eventFilter && userEvents.find((e) => e._id === eventFilter) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[11px]">event</span>
                  {userEvents.find((e) => e._id === eventFilter)?.name}
                  <button onClick={() => setEventFilter('')} className="ml-1 hover:text-red-500">✕</button>
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                  {getTypeConfig(typeFilter).label}
                  <button onClick={() => setTypeFilter('all')} className="ml-1 hover:text-red-500">✕</button>
                </span>
              )}
              {priorityFilter !== 'all' && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${getPriorityConfig(priorityFilter).bg} ${getPriorityConfig(priorityFilter).text}`}>
                  {getPriorityConfig(priorityFilter).label}
                  <button onClick={() => setPriorityFilter('all')} className="ml-1 hover:opacity-70">✕</button>
                </span>
              )}
              {(startDate || endDate) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[11px]">date_range</span>
                  {startDate || '…'} → {endDate || '…'}
                  <button onClick={() => { setStartDate(''); setEndDate(''); }} className="ml-1 hover:text-red-500">✕</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined">error</span>
            <p className="text-sm font-semibold flex-1">{error}</p>
            <button onClick={() => fetchLogs()} className="text-xs font-bold underline hover:no-underline">Retry</button>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* ── Logs list ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

          {/* List header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-slate-900 dark:text-white">
                Activity Feed
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {loading ? 'Loading…' : `${total.toLocaleString()} ${total === 1 ? 'entry' : 'entries'}`}
            </p>
          </div>

          {/* Rows */}
          {loading ? (
            <div>
              {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : logs.length === 0 ? (
            <EmptyState filtered={hasActiveFilters} />
          ) : (
            <div>
              {logs.map((log) => (
                <LogRow key={log._id} log={log} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <p className="text-xs text-slate-500">
                Page {page} of {totalPages} · {total.toLocaleString()} total logs
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Priority legend ── */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500 px-1">
          <span className="font-bold uppercase tracking-wider">Legend:</span>
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full ${cfg.dot}`} />
              {cfg.label} priority
            </span>
          ))}
          <span className="ml-4 font-bold uppercase tracking-wider">Types:</span>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <span key={key} className={`flex items-center gap-1 ${cfg.color}`}>
              <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
              {cfg.label}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ActivityAndNotificationLogs;