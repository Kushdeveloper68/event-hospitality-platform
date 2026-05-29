import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getFullDashboard,
  getDashboardMetrics,
  getRecentActivity,
} from "../../api/mainOprationDashboardApi";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Input,
  PageHeader,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "../../components/ui";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const timeAgo = (ts) => {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const STATUS_CONFIG = {
  in_progress: {
    label: "In Progress",
    bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-500",
    pulse: true,
  },
  upcoming: {
    label: "Upcoming",
    bg: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-sky-300",
    dot: "bg-primary",
    pulse: false,
  },
  completed: {
    label: "Completed",
    bg: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    dot: "bg-gray-400 dark:bg-gray-500",
    pulse: false,
  },
};

const ACTIVITY_CONFIG = {
  "check-in": {
    icon: "how_to_reg",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  "check-out": { icon: "logout", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
  registration: {
    icon: "person_add",
    color: "text-primary",
    bg: "bg-primary/10 dark:bg-primary/20",
  },
  service: { icon: "room_service", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" },
  transport: {
    icon: "local_shipping",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
  },
  "room-assignment": {
    icon: "meeting_room",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  schedule: { icon: "schedule", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-900/30" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  sub,
  accent = "primary",
  trend,
  loading,
}) {
  const accentMap = {
    primary: "bg-primary/10 text-primary",
    green: "bg-success/10 text-success",
    amber: "bg-warning/10 text-warning",
    red: "bg-danger/10 text-danger",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",
  };

  return (
    <Card className="p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className={`size-10 rounded-lg flex items-center justify-center ${accentMap[accent]}`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-bold ${
              trend >= 0 ? "text-success" : "text-danger"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {trend >= 0 ? "trending_up" : "trending_down"}
            </span>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
          {label}
        </p>
        {loading ? (
          <div className="h-8 w-20 bg-surface-muted rounded animate-pulse" />
        ) : (
          <h3 className="text-2xl font-black text-text">
            {value ?? 0}
          </h3>
        )}
        {sub && !loading && (
          <p className="text-xs text-text-muted mt-1">{sub}</p>
        )}
      </div>
    </Card>
  );
}

function ActivityItem({ log }) {
  const cfg = ACTIVITY_CONFIG[log.type] || {
    icon: "info",
    color: "text-text-muted",
    bg: "bg-surface-muted",
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-surface-muted/70 transition-colors">
      <div
        className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}
      >
        <span className={`material-symbols-outlined text-lg ${cfg.color}`}>
          {cfg.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text leading-tight line-clamp-1">
          {log.message || "System activity"}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {log.event?.name && (
            <span className="text-[10px] text-text-muted font-medium truncate max-w-30">
              {log.event.name}
            </span>
          )}
          {log.priority === "high" || log.priority === "critical" ? (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-danger/10 text-danger">
              {log.priority}
            </span>
          ) : null}
          <span className="text-[10px] text-text-muted ml-auto shrink-0">
            {timeAgo(log.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}

function EventStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
  const variant =
    status === "completed" ? "neutral" : status === "in_progress" ? "success" : "primary";
  return (
    <Badge variant={variant}>
      <span
        className={`size-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`}
      />
      {cfg.label}
    </Badge>
  );
}

function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-surface-muted rounded animate-pulse w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function MainOprationDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters / search
  const [eventSearch, setEventSearch] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("all");
  const [activityPage, setActivityPage] = useState(0);
  const ACTIVITY_PAGE_SIZE = 5;

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (quiet = false) => {
    try {
      if (!quiet) setLoading(true);
      else setRefreshing(true);
      setError(null);

      const res = await getFullDashboard();
      if (res.success) {
        setData(res);
        setLastUpdated(new Date());
      } else {
        setError(res.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh metrics every 90 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!data) return;
      try {
        const res = await getDashboardMetrics();
        if (res.success) {
          setData((prev) => (prev ? { ...prev, metrics: res.metrics } : prev));
          setLastUpdated(new Date());
        }
      } catch (_) {
        // silent fail
      }
    }, 90000);
    return () => clearInterval(interval);
  }, [data]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const metrics = data?.metrics || {};
  const upcomingEvents = data?.upcomingEvents || [];
  const recentActivity = data?.recentActivity || [];
  const activeEventStats = data?.activeEventStats || [];

  const filteredEvents = upcomingEvents.filter((ev) => {
    const matchSearch =
      !eventSearch ||
      ev.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (ev.venue || "").toLowerCase().includes(eventSearch.toLowerCase());
    const matchStatus =
      eventStatusFilter === "all" || ev.status === eventStatusFilter;
    return matchSearch && matchStatus;
  });

  const paginatedActivity = recentActivity.slice(
    activityPage * ACTIVITY_PAGE_SIZE,
    (activityPage + 1) * ACTIVITY_PAGE_SIZE,
  );
  const totalActivityPages = Math.ceil(
    recentActivity.length / ACTIVITY_PAGE_SIZE,
  );

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="flex items-center gap-3 mb-8">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
              <span className="text-neutral-muted font-medium">
                Loading dashboard…
              </span>
            </div>
            {/* skeleton metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-neutral-border animate-pulse h-28"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-neutral-border animate-pulse h-96" />
              <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-neutral-border animate-pulse h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error && !data) {
    return (
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex items-center justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl p-10 flex flex-col items-center text-center gap-4 max-w-md">
              <span className="material-symbols-outlined text-5xl text-red-400">
                error
              </span>
              <div>
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200">
                  Failed to load dashboard
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                  {error}
                </p>
              </div>
              <button
                onClick={() => fetchData()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  refresh
                </span>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ── Error banner (non-blocking) ── */}
      {error && data && (
        <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-warning flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => fetchData(true)}>
            Retry
          </Button>
        </div>
      )}

      <PageHeader
        title="Operations Dashboard"
        subtitle={`Welcome back, ${user?.name || "Operator"}${
          user?.organizationName ? ` · ${user.organizationName}` : ""
        }`}
        actions={
          <Link to="/create-event">
            <Button
              leadingIcon={
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
              }
            >
              New Event
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <Input
            value={eventSearch}
            onChange={(e) => setEventSearch(e.target.value)}
            placeholder="Search events, guests, or tasks..."
            startAdornment={
              <span className="material-symbols-outlined text-lg">search</span>
            }
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {lastUpdated && (
            <span>
              Updated{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            isLoading={refreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

          {/* ── Metric Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard
              icon="calendar_today"
              label="Total Events"
              value={metrics.totalEvents}
              sub={`${metrics.activeEvents || 0} live now`}
              accent="primary"
              loading={!data}
            />
            <MetricCard
              icon="play_circle"
              label="Active Events"
              value={metrics.activeEvents}
              sub={`${metrics.upcomingEventsCount || 0} upcoming`}
              accent="green"
              loading={!data}
            />
            <MetricCard
              icon="group"
              label="Guests Today"
              value={metrics.guestsToday}
              sub={`${metrics.totalGuests || 0} total registered`}
              accent="indigo"
              loading={!data}
            />
            <MetricCard
              icon="pending_actions"
              label="Pending Check-ins"
              value={metrics.pendingCheckIns}
              accent={metrics.pendingCheckIns > 10 ? "amber" : "primary"}
              sub={
                metrics.checkedInGuests
                  ? `${metrics.checkedInGuests} checked in`
                  : undefined
              }
              loading={!data}
            />
            <MetricCard
              icon="room_service"
              label="Service Requests"
              value={metrics.serviceRequests}
              accent={metrics.serviceRequests > 5 ? "red" : "primary"}
              sub="open & in-progress"
              loading={!data}
            />
          </div>

          {/* ── Active Events Live Panel ── */}
          {activeEventStats.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full animate-pulse" />
                Live Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeEventStats.map((ev) => (
                  <Card key={ev._id} className="p-5 hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text text-sm line-clamp-1">
                          {ev.name}
                        </h3>
                        {ev.venue && (
                          <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                              location_on
                            </span>
                            {ev.venue}
                          </p>
                        )}
                      </div>
                      <EventStatusBadge status="in_progress" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        {
                          icon: "how_to_reg",
                          label: "Checked In",
                          value: ev.stats.checkedIn,
                          color: "text-emerald-600",
                        },
                        {
                          icon: "group",
                          label: "Total Guests",
                          value: ev.stats.totalGuests,
                          color: "text-primary",
                        },
                        {
                          icon: "room_service",
                          label: "Open Services",
                          value: ev.stats.openServices,
                          color:
                            ev.stats.openServices > 0
                              ? "text-amber-600"
                              : "text-gray-500",
                        },
                        {
                          icon: "local_shipping",
                          label: "Transport",
                          value: ev.stats.activeTransport,
                          color: "text-indigo-600",
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-surface-muted rounded-lg p-2.5 text-center"
                        >
                          <p className={`text-lg font-black ${stat.color}`}>
                            {stat.value}
                          </p>
                          <p className="text-[10px] text-text-muted font-medium">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Check-in progress bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted font-medium">
                          Check-in Progress
                        </span>
                        <span className="font-bold text-primary">
                          {ev.stats.checkInRate}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-700"
                          style={{ width: `${ev.stats.checkInRate}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      to={`/events/${ev._id}/overview`}
                      className="mt-4"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        leadingIcon={
                          <span className="material-symbols-outlined text-sm">
                            open_in_new
                          </span>
                        }
                      >
                        Manage Event
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ── Main Grid: Activity + Events Table ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* ── Recent Activity ── */}
            <Card className="flex flex-col">
              <CardHeader className="justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-text">Recent Activity</h2>
                  <span className="size-2 bg-danger rounded-full animate-pulse" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchData(true)}
                  isLoading={refreshing}
                >
                  Refresh
                </Button>
              </CardHeader>

              <CardBody className="flex-1 overflow-y-auto max-h-105 custom-scrollbar p-3">
                {recentActivity.length === 0 ? (
                  <EmptyState
                    icon="dynamic_feed"
                    title="No activity yet"
                    description="Activity will appear once operations begin."
                  />
                ) : (
                  <div className="space-y-1">
                    {paginatedActivity.map((log) => (
                      <ActivityItem key={log._id} log={log} />
                    ))}
                  </div>
                )}
              </CardBody>

              {/* Pagination */}
              {totalActivityPages > 1 && (
                <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span>
                    Page {activityPage + 1} of {totalActivityPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActivityPage((p) => Math.max(0, p - 1))}
                      disabled={activityPage === 0}
                    >
                      ‹
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setActivityPage((p) =>
                          Math.min(totalActivityPages - 1, p + 1),
                        )
                      }
                      disabled={activityPage === totalActivityPages - 1}
                    >
                      ›
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* ── Events Table ── */}
            <Card className="xl:col-span-2 flex flex-col">
              <CardHeader className="flex-wrap justify-between gap-3">
                <h2 className="text-sm font-semibold text-text">Events</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {["all", "in_progress", "upcoming", "completed"].map((s) => (
                    <Button
                      key={s}
                      variant={eventStatusFilter === s ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setEventStatusFilter(s)}
                    >
                      {s === "all"
                        ? "All"
                        : s === "in_progress"
                          ? "Live"
                          : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
                  <Link to="/events">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardBody className="p-0">
                {filteredEvents.length === 0 ? (
                  <EmptyState
                    icon="event"
                    title={
                      eventSearch || eventStatusFilter !== "all"
                        ? "No matching events"
                        : "No events yet"
                    }
                    description={
                      eventSearch || eventStatusFilter !== "all"
                        ? "Try adjusting your search or filter."
                        : "Create your first event to get started."
                    }
                    action={
                      !eventSearch && eventStatusFilter === "all" ? (
                        <Link to="/create-event">
                          <Button size="sm">Create Event</Button>
                        </Link>
                      ) : null
                    }
                  />
                ) : (
                  <Table containerClassName="border-0 shadow-none rounded-none bg-transparent">
                    <TableHead>
                      <tr>
                        {["Event Name", "Venue", "Date", "Status", ""].map(
                          (h) => (
                            <TableHeaderCell key={h}>{h}</TableHeaderCell>
                          )
                        )}
                      </tr>
                    </TableHead>
                    <TableBody>
                      {filteredEvents.map((ev) => (
                        <TableRow key={ev._id} className="group">
                          <TableCell>
                            <div className="font-bold text-sm text-text line-clamp-1">
                              {ev.name}
                            </div>
                            {ev.isPrivate && (
                              <div className="text-[10px] text-text-muted flex items-center gap-0.5 mt-0.5">
                                <span className="material-symbols-outlined text-xs">
                                  lock
                                </span>
                                Private
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-text-muted">
                            <span className="line-clamp-1">
                              {ev.venue || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-text-muted whitespace-nowrap">
                            {fmtDate(ev.startDate)}
                            {ev.endDate && ` – ${fmtDate(ev.endDate)}`}
                          </TableCell>
                          <TableCell>
                            <EventStatusBadge status={ev.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/events/${ev._id}/overview`}>
                              <Button
                                size="sm"
                                className="opacity-0 group-hover:opacity-100"
                              >
                                Manage
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardBody>

              {filteredEvents.length > 0 && (
                <div className="px-6 py-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span>
                    Showing {filteredEvents.length} of {upcomingEvents.length}{" "}
                    events
                  </span>
                  <Link to="/events">
                    <Button variant="ghost" size="sm">
                      See all events →
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* ── Summary Stats Row ── */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check-in overview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-text">
                  Overall Check-in
                </h3>
                <span className="material-symbols-outlined text-primary">
                  how_to_reg
                </span>
              </div>
              <div className="text-3xl font-black text-text mb-1">
                {metrics.checkedInGuests ?? 0}
                <span className="text-sm font-normal text-text-muted ml-1">
                  / {metrics.totalGuests ?? 0}
                </span>
              </div>
              <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden mt-3 mb-2">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      metrics.totalGuests
                        ? Math.round(
                            (metrics.checkedInGuests / metrics.totalGuests) *
                              100,
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-text-muted">
                {metrics.totalGuests
                  ? `${Math.round(
                      (metrics.checkedInGuests / metrics.totalGuests) * 100,
                    )}% check-in rate across all events`
                  : "No guests registered yet"}
              </p>
            </Card>

            {/* Event breakdown */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-text">
                  Event Breakdown
                </h3>
                <span className="material-symbols-outlined text-primary">
                  pie_chart
                </span>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Live Now",
                    value: metrics.activeEvents,
                    color: "bg-emerald-500",
                    textColor: "text-success",
                  },
                  {
                    label: "Upcoming",
                    value: metrics.upcomingEventsCount,
                    color: "bg-primary",
                    textColor: "text-primary",
                  },
                  {
                    label: "Completed",
                    value: metrics.completedEvents,
                    color: "bg-gray-400",
                    textColor: "text-text-muted",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-muted font-medium">
                        {item.label}
                      </span>
                      <span className={`font-bold ${item.textColor}`}>
                        {item.value ?? 0}
                      </span>
                    </div>
                    <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-700`}
                        style={{
                          width: `${
                            metrics.totalEvents
                              ? Math.round(
                                  ((item.value || 0) / metrics.totalEvents) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick links */}
            <Card className="p-6">
              <h3 className="font-bold text-sm text-text mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  {
                    icon: "add_circle",
                    label: "Create New Event",
                    to: "/create-event",
                    accent: "text-primary",
                  },
                  {
                    icon: "calendar_today",
                    label: "View All Events",
                    to: "/events",
                    accent: "text-indigo-500",
                  },
                  {
                    icon: "analytics",
                    label: "Analytics & Reports",
                    to: "/analytics",
                    accent: "text-purple-500",
                  },
                  {
                    icon: "settings",
                    label: "Platform Settings",
                    to: "/settings",
                    accent: "text-text-muted",
                  },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-muted transition-colors group"
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${item.accent}`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    <span className="material-symbols-outlined text-sm text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
    </div>
  );
}

export default MainOprationDashboard;
