import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById } from "../../api/eventApi";
import { getOverviewData } from "../../api/overViewApi";
import { exportEventWorkbook } from "../../api/eventAnalyticsReportsApi";
import { EventContext } from "../../context/EventContext";
// Pages shown in tabs
import GuestMasterList from "../inventory/GuestMasterList";
import RoomInventoryManagement from "../inventory/RoomInventoryManagement";
import CheckInOprationDesk from "../inventory/CheckInOprationDesk";
import TransportCoordinationLogs from "../inventory/TransportCoordinationLogs";
import ServiceRequestLogs from "../inventory/ServiceRequestLogs";
import OprationalEventSchedule from "./OprationalEventSchedule";
import EventSummaryDashboards from "./EventSummaryDashboards";
import EventAdminstrativeSetting from "../settings/EventAdminstrativeSetting";
import TeamMemberManagement from "../inventory/TeamMemberManagement";
function EventWorkspaceShell() {
  const { user } = useAuth();
  const { eventId, tab, "*": rest } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(tab || "overview");
  const [overviewData, setOverviewData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);
  const [exportingData, setExportingData] = useState(false);
  const [exportMessage, setExportMessage] = useState(null);
  const exportMessageTimerRef = useRef(null);

  // keep tab in sync with url param
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    if (!tab && activeTab !== "overview") {
      setActiveTab("overview");
    }
  }, [tab]);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId && activeTab === "overview") {
      loadOverview();
    }
  }, [eventId, activeTab]);

  useEffect(() => {
    return () => {
      if (exportMessageTimerRef.current) {
        window.clearTimeout(exportMessageTimerRef.current);
      }
    };
  }, []);

  const loadOverview = async () => {
    try {
      setOverviewLoading(true);
      setOverviewError(null);
      const res = await getOverviewData(eventId);
      if (res.success) {
        setOverviewData(res);
      } else {
        setOverviewError(res.message || "Failed to sync dashboard data");
      }
    } catch (err) {
      console.error("Error loading overview data:", err);
      setOverviewError(
        "Dashboard synchronization failed. Please check your connection.",
      );
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await getEventById(eventId);
      if (res.success) {
        setEvent(res.event);
        setError(null);
      } else {
        setError(res.message || "Failed to load event");
      }
    } catch (err) {
      console.error("Error loading event:", err);
      setError("Error loading event");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now >= start && now <= end) return "live";
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "upcoming";
  };

  const getStatusBadge = (startDate, endDate) => {
    const status = getEventStatus(startDate, endDate);
    const badges = {
      live: (
        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </span>
      ),
      upcoming: (
        <span className="bg-primary/10 text-primary-500 dark:bg-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Upcoming
        </span>
      ),
      completed: (
        <span className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Completed
        </span>
      ),
    };
    return badges[status] || badges.upcoming;
  };

  const handleExportData = async () => {
    if (exportingData || !eventId) return;

    try {
      setExportingData(true);
      setExportMessage(null);

      const result = await exportEventWorkbook(eventId, event?.name || "event");

      setExportMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });
    } catch (err) {
      console.error("Error exporting event workbook:", err);
      setExportMessage({
        type: "error",
        text: "Failed to export event data",
      });
    } finally {
      setExportingData(false);
      if (exportMessageTimerRef.current) {
        window.clearTimeout(exportMessageTimerRef.current);
      }
      exportMessageTimerRef.current = window.setTimeout(() => {
        setExportMessage(null);
      }, 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Loading event...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/events"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EventContext.Provider value={{ event, setEvent }}>
      <div className="relative flex flex-col min-h-screen dark:bg-slate-950">
        {/* <!-- Top Sticky Header Container --> */}
        <header className=" top-0 z-50 w-full bg-white dark:bg-slate-950 border-b border-border-light dark:border-slate-800 shadow-sm">
          {/* <!-- Global Navbar --> */}
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
            {/* <!-- Left: Platform Logo & Search --> */}
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2 text-primary-500">
                <Link to="/">
                            <div className="size-8 rounded-lg flex items-center justify-center">
                              <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure Logo" loading='lazy'/>
                            </div>
                          </Link>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden lg:block">
                  EventCure
                </span>
              </div>
              {/* <!-- Global Search --> */}
              
            </div>
            {/* <!-- Right: Utilities & User --> */}
            <div className="flex items-center gap-3">
              <Link to="/notifications">
              <button title="notifications" className="p-2 text-slate-500 hover:bg-neutral-soft dark:hover:bg-slate-800 rounded-lg transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
              </button>
              </Link>
              <button title="help" className="p-2 text-slate-500 hover:bg-neutral-soft dark:hover:bg-slate-800 rounded-lg transition-colors">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <div className="h-8 w-px bg-border-light dark:bg-slate-800 mx-2"></div>
              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">
                    {user?.name || "Guest"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-none">
                    Event Managed
                  </p>
                </div>
                <div
                  className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm"
                  data-alt="Portrait of a female event director"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPZz9Jhq6VgvPEEsKPZyJgHQLZvsSS7qdfl68sBsGbc9sdeMycQ4VsXkJzR0T-t1WHyh6mBo3JEFurzCpEbF6xFDUDU-57_586Zbccl_kxTABtVYP5kqXDad9HBbuQOEwasxYiYQu6dq567llVy8Vm2e9pvS5CSLvYifCUykweUmrFXSlEICrh4Ris2QnQCR7H_1SP6vvK6otoDNcMBTZkbBSfklQP-yYiXpRbhdpqdjUo34m9oL3uf7UbK3eV5IfrqhzTZEhJWcxc")',
                  }}
                ></div>
              </div>
            </div>
          </div>
          {/* <!-- Event Context Header --> */}
          <div className="max-w-[1440px] mx-auto px-6 py-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                {/* <!-- Breadcrumb --> */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <Link
                    to="/events"
                    className="hover:text-primary-500 transition-colors"
                  >
                    Events
                  </Link>
                  <span className="material-symbols-outlined text-[14px]">
                    chevron_right
                  </span>
                  <span className="text-slate-900 dark:text-white line-clamp-1">
                    {event?.name}
                  </span>
                </div>
                {/* <!-- Event Details --> */}
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 className="font-display text-page-h1 text-slate-900 dark:text-white line-clamp-2">
                    {event?.name}
                  </h1>
                  {getStatusBadge(event?.startDate, event?.endDate)}
                </div>
                <div className="flex flex-wrap items-center gap-5 text-slate-500 text-sm mt-1">
                  {event?.venue && (
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">
                        location_on
                      </span>
                      {event.venue}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg">
                      calendar_today
                    </span>
                    {formatDate(event?.startDate)}
                    {event?.endDate && ` - ${formatDate(event.endDate)}`}
                  </div>
                </div>
              </div>
              {/* <!-- Quick Action Buttons --> */}
              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={handleExportData}
                  disabled={exportingData}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-border-light dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm rounded-lg hover:bg-neutral-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">
                    {exportingData ? "hourglass_top" : "share"}
                  </span>
                  {exportingData ? "Exporting..." : "Export Data"}
                </button>
                {exportMessage && (
                  <div
                    className={`max-w-sm rounded-lg px-3 py-2 text-xs font-medium shadow-sm ${
                      exportMessage.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/40"
                        : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/40"
                    }`}
                  >
                    {exportMessage.text}
                  </div>
                )}
                
              </div>
            </div>
          </div>
          {/* <!-- Horizontal Navigation Tabs --> */}
          <div className="max-w-[1440px] mx-auto px-6">
            <nav className="flex gap-8 overflow-x-auto hide-scrollbar scroll-smooth">
              {[
                { key: "overview", icon: "dashboard", label: "Overview" },
                { key: "guests", icon: "group", label: "Guests" },
                { key: "rooms", icon: "meeting_room", label: "Rooms" },
                { key: "checkin", icon: "how_to_reg", label: "Check-in" },
                {
                  key: "transport",
                  icon: "local_shipping",
                  label: "Transport",
                },
                { key: "service", icon: "room_service", label: "Service" },
                { key: "schedule", icon: "schedule", label: "Schedule" },
                { key: "reports", icon: "analytics", label: "Reports" },
                { key: "team", icon: "groups", label: "Team" },
                { key: "settings", icon: "settings", label: "Settings" },
              ].map((tab) => {
                const active = activeTab === tab.key;
                // build path: omit overview segment to keep /events/:id form
                const path = `/events/${eventId}/${tab.key}`;
                return (
                  <Link
                    key={tab.key}
                    to={path}
                    className={`flex items-center gap-2 py-4 border-b-2 ${active ? "border-primary-500 text-primary-500 font-bold" : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold"} text-sm whitespace-nowrap transition-all`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {tab.icon}
                    </span>
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        {/* <!-- Main Content Area --> */}
        <main className="flex-1 w-full max-w-[1440px] mx-auto dark:bg-slate-950 px-6 py-8">
          {/* Tabbed Content Area */}
          <div>
            {activeTab === "overview" && (
              <div className="space-y-6">
                {overviewError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined">error</span>
                      <span>{overviewError}</span>
                    </div>
                    <button
                      onClick={loadOverview}
                      className="text-sm font-bold underline hover:no-underline"
                    >
                      Retry Sync
                    </button>
                  </div>
                )}

                <div
                  className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${overviewLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                >
                  {/* <!-- Welcome Card --> */}
                  <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white dark:bg-slate-900/50 border border-border-light dark:border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <h2 className="font-display text-section-h2 text-slate-900 dark:text-white">
                        Welcome back to Operations, {user?.name || "Director"}
                      </h2>
                      <p className="text-slate-500 max-w-2xl text-lg">
                        The event is currently in full swing. We have{" "}
                        <span className="text-slate-900 dark:text-white font-bold">
                          {overviewData?.metrics?.guests?.checkedIn || 0} guests
                        </span>{" "}
                        checked in out of{" "}
                        {overviewData?.metrics?.guests?.total || 0} expected.
                        Room turnover is proceeding at{" "}
                        {overviewData?.metrics?.rooms?.occupancyRate || 0}%
                        efficiency.
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                        <div className="bg-primary/5 dark:bg-primary/20 px-4 py-2 rounded-lg">
                          <span className="block text-xs text-slate-500 font-semibold uppercase">
                            Total Occupancy
                          </span>
                          <span className="text-xl font-bold text-primary-500">
                            {overviewData?.metrics?.rooms?.occupancyRate || 0}%
                          </span>
                        </div>
                        <div className="bg-success/5 dark:bg-success/20 px-4 py-2 rounded-lg">
                          <span className="block text-xs text-slate-500 font-semibold uppercase">
                            Active Staff
                          </span>
                          <span className="text-xl font-bold text-success">
                            {overviewData?.metrics?.staff?.active || 0} On-Duty
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full max-w-xs md:max-w-[300px] aspect-video rounded-lg overflow-hidden relative group">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        data-alt="Conference hall stage with lighting and screens"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDKbZxD21XGZETliznl2BY0ABjw2hTBOlpOCLB3sRRM9QbJO6CqvX5TQgUWjffQQLmFJmyHLRA-Y55VuSg-cYkp6TiNE4gvVedvsGDr6Pw1uN7UEsWTjmGuAjl6kS4MjbfadqG8ms-ta7VxqmIpKaAB4JZTkP-hTiUive76P_qOpVbfbrR0zaqtWi2_RJiUgLcbpjZUgwkCpDYZLce9q97y5u_VL95jS4rhgBao5iDZx212pAiSU_NUnMeGdMz7FtzA8TjhfCxLCFb"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        
                      </div>
                    </div>
                  </div>
                  {/* <!-- Stats Widgets --> */}
                  <div className="bg-white dark:bg-slate-900/50 border border-border-light dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Check-in Progress
                      </span>
                      <span className="material-symbols-outlined text-primary-500">
                        how_to_reg
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {overviewData?.metrics?.guests?.checkedIn || 0}
                      <span className="text-sm font-normal text-slate-500 ml-1">
                        / {overviewData?.metrics?.guests?.total || 0}
                      </span>
                    </div>
                    <div className="mt-4 w-full bg-neutral-soft dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(overviewData?.metrics?.guests?.checkedIn / overviewData?.metrics?.guests?.total) * 100 || 0}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                      {overviewData?.metrics?.guests?.total > 0
                        ? `${Math.round((overviewData?.metrics?.guests?.checkedIn / overviewData?.metrics?.guests?.total) * 100)}% of guests checked in`
                        : "No guests registered yet"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 border border-border-light dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Pending Service
                      </span>
                      <span className="material-symbols-outlined text-orange-500">
                        pending_actions
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {overviewData?.metrics?.services?.pending || 0}
                      <span className="text-sm font-normal text-slate-500 ml-1">
                        requests
                      </span>
                    </div>
                    <div className="mt-4 flex -space-x-2">
                      <div
                        className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-cover bg-center"
                        data-alt="Staff profile photo"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAh50bXx9WYztqp2R_yd1-0Oxn59mpvEGLlL3eJEL1-igPlzei14pP4gzZgfo97PFFCikX8qHHK5YWbSS_a7nZahrjExoCTXJ5CSDKjtQjucWAS7j24yWBN4fSug1Tr0kdU6DoiMdBclxszGYS9Qp0nSBlF62RbeJ331OYCH7jScsKAwhdts6ygbHPTdjFhbWMQuDe7eErm7fTRLyxw563qxe0YKYM8bqRpvftLuUclOBR0kG0d_eqHPHauSUK_9qBKWA5nfiIvnqa9")',
                        }}
                      ></div>
                      <div
                        className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-cover bg-center"
                        data-alt="Staff profile photo"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD5tJ4HKbBqZG2H_lfRaZSgBD6PAB0WKYgAXaFLAnNxISd3no3Eq2VmyaVfLsftIWcxbEthCQfRlHOrNCrAJRzLB9R_DNitDSN1SBsb7LA5D4U1jzeBOgwo0A2WVY8qh0rg-jnFRQVb8sjiFYPuLNcd-BJkSRhUrwrwk4PpnFvX_hg3hYkR_qAIjF923n0fl5PtbtMk2foiMlbd0dKzdA2TRf6QoY8aHQj9lZZ2KOOsFLcyqA8eBiEPiIjpWlGcSqwex52icczBdSqW")',
                        }}
                      ></div>
                      <div
                        className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-cover bg-center"
                        data-alt="Staff profile photo"
                        style={{
                          backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHMBVaVpTe9Wnv_boeC-qcJPJLOlIzKZFpYfbLC8rArnUA5y7BqOrG1syEa8tTjNxQTKODadwkyxiWwzMngoy9owWmq11qyluEeH1-wQlS85wCoU6pH7b3S-YDAI9zXmpIeYzFqmGxLbawsDqGl2Xp6kQinAaL2cxYhRXIhZSkhfo1SidjRSH8XrFmnszyojFMGEZ35nF3kASh5gXRDK224iFm9HkrraLt5q6rTXlHmPk9x3dWuoV8DenNieFSaR4vBbHumbQgx4n8")',
                        }}
                      ></div>
                      <div className="size-8 rounded-full border-2 border-white dark:border-slate-900 bg-neutral-soft dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        +21
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Priority:{" "}
                      <span className="text-orange-600 font-bold uppercase">
                        High
                      </span>
                      • Median wait 4m
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 border border-border-light dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Transport Load
                      </span>
                      <span className="material-symbols-outlined text-indigo-500">
                        directions_bus
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {overviewData?.metrics?.transport?.active || 0}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      Active or scheduled shuttles
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900/50 border border-border-light dark:border-slate-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Audit Logs
                      </span>
                      <span className="material-symbols-outlined text-primary-500">
                        description
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {overviewData?.metrics?.logs?.total || 0}
                    </div>
                    <Link
                      to={`/events/${eventId}/reports`}
                      className="mt-4 block w-full py-2 bg-neutral-soft dark:bg-slate-800 hover:bg-neutral-soft/80 dark:hover:bg-slate-700 text-xs font-bold text-slate-900 dark:text-white text-center rounded-lg transition-colors"
                    >
                      View Analytics
                    </Link>
                  </div>
                  {/* <!-- Main Activity Table Area --> */}
                  <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white dark:bg-slate-900/50 border border-border-light dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-light dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-display text-card-h3 text-slate-900 dark:text-white">
                        Recent Guest Activity
                      </h3>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 hover:bg-neutral-soft dark:hover:bg-slate-800 rounded transition-colors text-slate-500">
                          <span className="material-symbols-outlined">
                            filter_list
                          </span>
                        </button>
                        <button className="p-1.5 hover:bg-neutral-soft dark:hover:bg-slate-800 rounded transition-colors text-slate-500">
                          <span className="material-symbols-outlined">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-background-light dark:bg-slate-900/60 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-border-light dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-3">Guest Name</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Room / Location</th>
                            <th className="px-6 py-3">Assigned Staff</th>
                            <th className="px-6 py-3 text-right">
                              Activity Time
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {overviewData?.recentActivity?.length > 0 ? (
                            overviewData.recentActivity.map((log) => (
                              <tr
                                key={log._id}
                                className="hover:bg-neutral-soft/30 dark:hover:bg-slate-800/30 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 text-primary-500 flex items-center justify-center font-bold text-xs">
                                      {log.relatedGuest?.fullName
                                        ?.substring(0, 2)
                                        .toUpperCase() || "??"}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {log.relatedGuest?.fullName || "System"}
                                      </p>
                                      <p className="text-[10px] text-slate-500">
                                        {log.relatedGuest?.groupName ||
                                          "Log Entry"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      log.type === "check-in"
                                        ? "bg-success/10 text-success"
                                        : "bg-primary/10 text-primary-500"
                                    }`}
                                  >
                                    {log.type || "Activity"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {log.message || "Updated event status"}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-900 dark:text-white font-medium">
                                      {log.relatedStaff?.name || "Automated"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-slate-500 font-medium">
                                  {new Date(log.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-6 py-10 text-center text-slate-500"
                              >
                                No recent activity found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-6 py-3 bg-background-light dark:bg-slate-900/60 border-t border-border-light dark:border-slate-800 flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        {overviewData?.recentActivity?.length > 0
                          ? `Showing latest ${overviewData.recentActivity.length} activities`
                          : "No activity to display"}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          to={`/events/${eventId}/reports`}
                          className="px-3 py-1 bg-white dark:bg-slate-800 border border-border-light dark:border-slate-700 text-xs font-bold rounded hover:bg-neutral-soft transition-colors text-slate-900 dark:text-white"
                        >
                          View Full Logs
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "guests" && (
              <div className="space-y-6">
                {/* show a small back link if we are in a sub-route like add/edit */}
                {rest && (
                  <div className="px-6">
                    <Link
                      to={`/events/${eventId}/guests`}
                      className="text-primary-500 text-sm font-semibold inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        arrow_back
                      </span>
                      Guest List
                    </Link>
                  </div>
                )}
                {/* pass rest so the guest list can render add/edit form when needed */}
                <GuestMasterList extraPath={rest || ""} eventId={eventId} />
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="space-y-6">
                <RoomInventoryManagement />
              </div>
            )}

            {activeTab === "checkin" && (
              <div className="space-y-6">
                <CheckInOprationDesk eventId={eventId} />
              </div>
            )}

            {activeTab === "transport" && (
              <div className="space-y-6">
                <TransportCoordinationLogs eventId={eventId} />
              </div>
            )}

            {activeTab === "service" && (
              <div className="space-y-6">
                <ServiceRequestLogs eventId={eventId} />
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6">
                <OprationalEventSchedule />
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <EventSummaryDashboards />
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6">
                <TeamMemberManagement eventId={eventId} />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <EventAdminstrativeSetting />
              </div>
            )}
          </div>
        </main>
        {/* <!-- Footer --> */}
    
      </div>
    </EventContext.Provider>
  );
}

export default EventWorkspaceShell;