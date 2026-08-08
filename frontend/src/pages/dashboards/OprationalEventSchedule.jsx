import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getSchedulesByEventId, createSchedule, updateSchedule, deleteSchedule } from '../../api/scheduleApi';
import { EventContext } from '../../context/EventContext';

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
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const initialForm = {
    title: '',
    workstream: 'Main Sessions',
    startTime: '',
    endTime: '',
    location: '',
    assignedTo: '',
    description: '',
    status: 'Confirmed'
  };
  const [formData, setFormData] = useState(initialForm);

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

  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const fetchData = async () => {
    setLoading(true);
    const res = await getSchedulesByEventId(eventId);
    if (res.success) {
      setSchedules(res.activities || []);
      setError(null);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  // 1. Generate unique dates combining Event boundaries and Schedule actuals
  const eventDates = useMemo(() => {
    const datesMap = new Map();
    
    if (event?.startDate && event?.endDate) {
        let current = new Date(event.startDate);
        const last = new Date(event.endDate);
        current.setHours(0,0,0,0);
        last.setHours(0,0,0,0);
        while (current <= last) {
        datesMap.set(current.getTime(), formatDateKeyLocal(current));
            current.setDate(current.getDate() + 1);
        }
    }
    
    schedules.forEach(s => {
        if (!s.startTime) return;
        const d = new Date(s.startTime);
        d.setHours(0,0,0,0);
      datesMap.set(d.getTime(), formatDateKeyLocal(d));
    });
    
    const sortedTimes = Array.from(datesMap.keys()).sort();
    return sortedTimes.map(t => datesMap.get(t));
  }, [event, schedules]);

  // Set default selected date
  useEffect(() => {
    if (eventDates.length > 0 && !selectedDate) {
        setSelectedDate(eventDates[0]);
    } else if (eventDates.length > 0 && !eventDates.includes(selectedDate)) {
        // Fallback if current selected date is no longer valid somehow, but keep it if valid
        // Actually, if we add a new schedule with a totally new date, we want it to persist. 
        // So we just check if it's completely empty initializing.
    }
  }, [eventDates, selectedDate]);


  // 2. Filter Schedules for currently selected date, search, and status
  const filteredSchedules = useMemo(() => {
    if (!selectedDate) return [];
    const targetDateKey = selectedDate;
    
    return schedules.filter(s => {
        // Date match
      if (formatDateKeyLocal(s.startTime) !== targetDateKey) return false;
        
        // Status match
        if (statusFilter !== 'All' && s.status !== statusFilter) return false;
        
        // Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            const mTitle = s.title?.toLowerCase().includes(lowerQ);
            const mLocation = s.location?.toLowerCase().includes(lowerQ);
            const mAssigned = s.assignedTo?.toLowerCase().includes(lowerQ);
            if (!mTitle && !mLocation && !mAssigned) return false;
        }
        
        return true;
    });
  }, [schedules, selectedDate, statusFilter, searchQuery]);


  const handleOpenCreate = () => {
    setModalMode('create');
    setValidationErrors({});
    let defStart = '';
    let defEnd = '';
    
    // Auto populate time based on selected date tab
    if (selectedDate) {
        defStart = buildLocalDateTime(selectedDate, 9, 0);
        defEnd = buildLocalDateTime(selectedDate, 10, 0);
    }
    
    setFormData({ ...initialForm, startTime: defStart, endTime: defEnd });
    setShowModal(true);
  };

  const handleOpenEdit = (activity) => {
    setModalMode('edit');
    setValidationErrors({});
    setFormData({
      ...activity,
      startTime: formatDateTimeInputLocal(activity.startTime),
      endTime: formatDateTimeInputLocal(activity.endTime)
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

    const dataToSubmit = { ...formData, eventId };
    
    if (modalMode === 'create') {
      const res = await createSchedule(dataToSubmit);
      if (res.success) {
        setSchedules([...schedules, res.activity]);
        setShowModal(false);
        setValidationErrors({});
        // If they created an activity for a totally new date, ensure it shows up (eventDates auto updates via useMemo)
      } else {
        alert(res.message);
      }
    } else {
      const res = await updateSchedule(formData._id, dataToSubmit);
      if (res.success) {
        setSchedules(schedules.map(s => s._id === res.activity._id ? res.activity : s));
        if (selectedActivity?._id === res.activity._id) {
          setSelectedActivity(res.activity);
        }
        setShowModal(false);
        setValidationErrors({});
      } else {
        alert(res.message);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    const res = await deleteSchedule(id);
    if (res.success) {
      setSchedules(schedules.filter(s => s._id !== id));
      if (selectedActivity?._id === id) {
        setSelectedActivity(null);
      }
    } else {
      alert(res.message);
    }
  };

  const formatDisplayTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Expand timeline to cover 24 hours (00:00 to 24:00) so no blocks vanish
  const timelineHours = Array.from({length: 24}, (_, i) => i);
  const TIMELINE_START_HOUR = 0; 
  const PX_PER_HOUR = 130; // Slightly wider for full day
  const PX_PER_MINUTE = PX_PER_HOUR / 60;
  
  const calculateBlockStyles = (startStr, endStr) => {
    if (!startStr || !endStr) return { display: 'none' };
    
    let start = new Date(startStr);
    let end = new Date(endStr);
    
    // Cross-day clamping. Since we display targetDate, clamp to 00:00 and 23:59 of that date
    const targetDate = new Date(`${selectedDate}T00:00:00`);
    const dayStart = new Date(targetDate);
    dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23,59,59,999);

    if (start < dayStart) start = dayStart;
    if (end > dayEnd) end = dayEnd;
    if (end < start) return { display: 'none' }; // shouldn't happen if properly dated
    
    const startMins = start.getHours() * 60 + start.getMinutes();
    const endMins = end.getHours() * 60 + end.getMinutes();
    
    // Both are within 00:00 to 24:00 now
    const leftMins = startMins;
    const durationMins = endMins - startMins;
    
    return {
      left: `${leftMins * PX_PER_MINUTE}px`,
      width: `${durationMins * PX_PER_MINUTE}px`,
      position: 'absolute',
      top: '12px',
      height: '72px'
    };
  };

  const workstreams = [
    { name: 'Main Sessions', icon: 'show_chart', badgeClass: 'bg-blue-100 text-blue-600' },
    { name: 'Transport', icon: 'local_shipping', badgeClass: 'bg-amber-100 text-amber-600' },
    { name: 'Catering', icon: 'restaurant', badgeClass: 'bg-emerald-100 text-emerald-600' },
    { name: 'Staffing', icon: 'groups', badgeClass: 'bg-purple-100 text-purple-600' },
    { name: 'Media/AV', icon: 'videocam', badgeClass: 'bg-rose-100 text-rose-600' }
  ];

  const colorMap = {
    'Main Sessions': { border: 'border-l-primary', bg: 'bg-primary/10', text: 'text-primary', hover: 'hover:ring-primary/20' },
    'Transport': { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-800', hover: 'hover:ring-amber-200' },
    'Catering': { border: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-800', hover: 'hover:ring-emerald-200' },
    'Staffing': { border: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', hover: 'hover:ring-purple-200' },
    'Media/AV': { border: 'border-l-rose-500', bg: 'bg-rose-50', text: 'text-rose-800', hover: 'hover:ring-rose-200' }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center h-full bg-white dark:bg-slate-950">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
      Loading Schedule...
    </div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500 dark:text-red-400 bg-white dark:bg-slate-950">{error}</div>;
  }

  return (
    <div className="relative flex h-[calc(100vh-200px)] min-h-150 flex-col overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm dark:bg-slate-950 dark:border-slate-800">
      
      {/* <!-- Sub-header: Controls & Date Selection --> */}
      <div className="flex flex-col border-b border-slate-200 bg-white shrink-0 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-100 gap-4 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-900 text-sm dark:text-white">Event Schedule Timeline</span>
            <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-700">
               <div className="relative">
                 <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg! text-slate-400 dark:text-slate-500">search</span>
                 <input type="text" placeholder="Search activities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none w-48 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900" />
               </div>
               <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900">
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
               </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-sm!">add</span>
              Add Schedule Block
            </button>
          </div>
        </div>
        
        {/* Date Tabs */}
        <div className="flex px-6 overflow-x-auto hide-scrollbar bg-slate-50/50 dark:bg-slate-900/60">
          {eventDates.map(dateStr => {
            const d = new Date(`${dateStr}T00:00:00`);
            const isActive = selectedDate === dateStr;
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
                <button key={dateStr} onClick={() => setSelectedDate(dateStr)} className={`border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${isActive ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'}`}>
                   {monthDay}, {dayName}
                </button>
            );
          })}
          {eventDates.length === 0 && <span className="py-3 text-sm text-slate-400 font-medium italic">No valid event dates or activities found.</span>}
        </div>
      </div>

      {/* <!-- Main Schedule Interface --> */}
      <main className="flex flex-1 overflow-hidden bg-white relative dark:bg-slate-950">
        {/* <!-- Sticky Sidebar: Workstreams --> */}
        <div className="w-64 shrink-0 border-r border-slate-200 z-10 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 items-center border-b border-slate-200 px-4 bg-slate-50 font-bold text-slate-600 text-xs tracking-wider uppercase dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            Workstreams
          </div>
          <div className="flex flex-col divide-y divide-slate-100">
            {workstreams.map(ws => (
              <div key={ws.name} className="group flex h-24 items-center gap-3 px-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded ${ws.badgeClass}`}>
                  <span className="material-symbols-outlined text-xl!">{ws.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{ws.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 dark:text-slate-400">Track Controls</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <!-- Timeline Scroll Area --> */}
        <div className="relative flex-1 overflow-x-auto overflow-y-auto hide-scrollbar bg-slate-50/30 dark:bg-slate-950">
          {/* <!-- Timeline Header (Time Markers) --> */}
          <div className="sticky top-0 z-20 flex h-12 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" style={{ width: `${timelineHours.length * PX_PER_HOUR}px` }}>
            {timelineHours.map(hour => (
              <div key={hour} style={{ width: `${PX_PER_HOUR}px` }} className="flex h-full shrink-0 border-r border-slate-200 border-dashed dark:border-slate-800">
                 <span className="text-[10px] font-bold text-slate-400 mt-2 ml-1 dark:text-slate-500">{hour.toString().padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>

          {/* <!-- Timeline Rows --> */}
          <div className="relative min-h-full pb-10" style={{ width: `${timelineHours.length * PX_PER_HOUR}px` }}>
            {/* Background grids */}
            <div className="absolute inset-0 z-0 flex pointer-events-none opacity-20 dark:opacity-15">
              {timelineHours.map(hour => (
                 <div key={hour} style={{ width: `${PX_PER_HOUR}px` }} className="h-full shrink-0 border-r border-slate-300 border-dashed dark:border-slate-700"></div>
              ))}
            </div>

            {/* Activities */}
            {workstreams.map((ws, i) => {
              const wsActivities = filteredSchedules.filter(s => s.workstream === ws.name);
              return (
                <div key={ws.name} className="group relative h-24 border-b border-slate-200 border-dashed z-10 hover:bg-slate-100/40 transition-colors dark:border-slate-800 dark:hover:bg-slate-900/30">
                  {wsActivities.map((act) => {
                    const colors = colorMap[ws.name] || colorMap['Main Sessions'];
                    return (
                      <div
                        key={act._id}
                        onClick={() => setSelectedActivity(act)}
                        style={calculateBlockStyles(act.startTime, act.endTime)}
                        className={`cursor-pointer flex flex-col rounded border-l-4 ${colors.border} ${colors.bg} p-2 shadow-sm hover:ring-2 ${colors.hover} overflow-hidden transition-all`}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h4 className={`truncate text-[11px] font-bold tracking-tight ${colors.text}`}>{act.title}</h4>
                            <span className={`text-[9px] font-semibold ${colors.text} opacity-80 block mt-0.5`}>
                              {formatDisplayTime(act.startTime)} - {formatDisplayTime(act.endTime)}
                            </span>
                          </div>
                          {act.location && <p className={`mt-1 text-[9px] ${colors.text} opacity-90 truncate line-clamp-1 w-full bg-white/40 px-1 rounded backdrop-blur-sm`}>{act.location}</p>}
                        </div>
                      </div>
                    );
                  })}
                  {wsActivities.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setModalMode('create'); const defStart = selectedDate ? buildLocalDateTime(selectedDate, 9, 0) : ''; const defEnd = selectedDate ? buildLocalDateTime(selectedDate, 10, 0) : ''; setFormData({...initialForm, workstream: ws.name, startTime: defStart, endTime: defEnd}); setShowModal(true); }} className="text-[10px] font-bold text-slate-400 border border-slate-200 border-dashed rounded px-3 py-1 bg-white hover:text-primary hover:border-primary shadow-sm">
                           + Add Block to {ws.name}
                         </button>
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* <!-- Activity Detail Sidebar (Slide-out) --> */}
        {selectedActivity && (
          <div className="absolute right-0 top-0 bottom-0 w-85 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto z-30 shadow-2xl animate-in slide-in-from-right-8 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50 sticky top-0 z-10 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-slate-900 text-sm dark:text-white">Activity Details</h3>
              <button onClick={() => setSelectedActivity(null)} className="text-slate-400 hover:text-slate-900 bg-white rounded-full size-7 flex items-center justify-center shadow-sm border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white dark:border-slate-700">
                <span className="material-symbols-outlined text-sm!">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">{selectedActivity.workstream}</div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight tracking-tight dark:text-white">{selectedActivity.title}</h2>
                <div className="mt-3 inline-flex">
                   <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${selectedActivity.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : selectedActivity.status === 'Active' ? 'bg-blue-100 text-blue-700' : selectedActivity.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedActivity.status || 'Pending'}
                   </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 bg-slate-100 size-9 rounded-lg flex items-center justify-center text-slate-500 shrink-0 dark:bg-slate-900 dark:text-slate-400">
                     <span className="material-symbols-outlined text-[20px]!">event</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                     {new Date(selectedActivity.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium bg-slate-50 inline-block px-2 py-0.5 rounded border border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
                      {formatDisplayTime(selectedActivity.startTime)} to {formatDisplayTime(selectedActivity.endTime)}
                    </p>
                  </div>
                </div>
                {selectedActivity.location && (
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 bg-slate-100 size-9 rounded-lg flex items-center justify-center text-slate-500 shrink-0 dark:bg-slate-900 dark:text-slate-400">
                     <span className="material-symbols-outlined text-[20px]!">location_on</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedActivity.location}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium dark:text-slate-400">Designated Venue</p>
                    </div>
                  </div>
                )}
                {selectedActivity.assignedTo && (
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 bg-slate-100 size-9 rounded-lg flex items-center justify-center text-slate-500 shrink-0 dark:bg-slate-900 dark:text-slate-400">
                     <span className="material-symbols-outlined text-[20px]!">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedActivity.assignedTo}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium dark:text-slate-400">Assigned Personnel / VIP</p>
                    </div>
                  </div>
                )}
                {selectedActivity.description && (
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="mt-0.5 bg-slate-100 size-9 rounded-lg flex items-center justify-center text-slate-500 shrink-0 dark:bg-slate-900 dark:text-slate-400">
                     <span className="material-symbols-outlined text-[20px]!">notes</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-1 dark:text-white">Activity Briefing</p>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800">{selectedActivity.description}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-3 dark:border-slate-800">
                <button 
                  onClick={() => handleOpenEdit(selectedActivity)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                  Edit Details
                </button>
                <button 
                  onClick={() => handleDelete(selectedActivity._id)}
                  className="w-full rounded-lg border border-red-200 bg-red-50 text-red-600 py-2.5 text-xs font-bold hover:bg-red-100 transition-colors shadow-sm dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-950/30">
                  Cancel &amp; Delete Activity
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* <!-- Modal for Create / Edit --> */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200 lg:pl-64 dark:bg-slate-950/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] dark:bg-slate-950 dark:border dark:border-slate-800">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white dark:border-slate-800 dark:bg-slate-950">
              <h3 className="font-bold text-lg text-slate-900 tracking-tight dark:text-white">{modalMode === 'create' ? 'Add Schedule Activity' : 'Edit Activity'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full size-8 flex items-center justify-center transition-colors dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800">
                <span className="material-symbols-outlined text-lg!">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="schedule-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Activity Title</label>
                  <input required autoFocus type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder="E.g., Opening Keynote Session" />
                  {validationErrors.title && <p className="mt-1 text-xs font-medium text-red-500">{validationErrors.title}</p>}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Workstream</label>
                    <select value={formData.workstream} onChange={e => setFormData({...formData, workstream: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                      {workstreams.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Status</label>
                     <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Start Time</label>
                    <input required type="datetime-local" value={formatDateTimeInputLocal(formData.startTime)} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                    {validationErrors.startTime && <p className="mt-1 text-xs font-medium text-red-500">{validationErrors.startTime}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">End Time</label>
                    <input required type="datetime-local" value={formatDateTimeInputLocal(formData.endTime)} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
                    {validationErrors.endTime && <p className="mt-1 text-xs font-medium text-red-500">{validationErrors.endTime}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Location / Venue</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder="E.g., Grand Ballroom A" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Assigned Staff / Name</label>
                    <input type="text" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder="E.g., Sarah Jenkins" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider dark:text-slate-300">Activity Briefing / Notes</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-xl border border-slate-200 text-sm p-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500" placeholder="Include any special instructions, AV requirements, or setup details..."></textarea>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto dark:border-slate-800 dark:bg-slate-900">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">Cancel</button>
              <button type="submit" form="schedule-form" className="px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95">
                {modalMode === 'create' ? 'Save Activity' : 'Update Activity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}