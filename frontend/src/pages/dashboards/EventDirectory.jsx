import React, { useState, useEffect } from 'react'
import { getAllEvents } from '../../api/eventApi'
import { Link } from 'react-router-dom'

function EventDirectory() {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all events on mount
  useEffect(() => {
    fetchEvents()
  }, [])

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await getAllEvents()
      if (response.success) {
        setEvents(response.events || [])
        setError(null)
      } else {
        setError('Failed to load events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      setError('Error loading events')
    } finally {
      setLoading(false)
    }
  }

  // Determine event status
  const getEventStatus = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now >= start && now <= end) return 'live'
    if (now < start) return 'upcoming'
    if (now > end) return 'completed'
    return 'upcoming'
  }

  // Filter events based on search and tab
  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const status = getEventStatus(event.startDate, event.endDate)

      if (activeTab === 'all') return matchesSearch
      return matchesSearch && status === activeTab
    })

    setFilteredEvents(filtered)
  }, [searchQuery, activeTab, events])

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Get status badge
  const getStatusBadge = (startDate, endDate) => {
    const status = getEventStatus(startDate, endDate)
    const badges = {
      live: (
        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-700 shadow-sm ring-1 ring-black/5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60"></span>
            <span className="relative inline-flex size-2 rounded-full bg-emerald-600"></span>
          </span>
          Live now
        </span>
      ),
      upcoming: (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-700 ring-1 ring-amber-600/10">
          <span className="material-symbols-outlined text-[13px]">schedule</span>
          Upcoming
        </span>
      ),
      completed: (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600 ring-1 ring-black/10">
          <span className="material-symbols-outlined text-[13px]">check_circle</span>
          Completed
        </span>
      ),
    }
    return badges[status] || badges.upcoming
  }

  const getEventInitials = (name = '') => {
    const words = name.trim().split(/\s+/).filter(Boolean)
    if (!words.length) return 'EV'
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }

  const getEventAccent = (index) => {
    const accents = [
      'from-slate-900 via-slate-800 to-slate-900',
      'from-blue-900 via-blue-800 to-slate-900',
      'from-indigo-900 via-indigo-800 to-slate-900',
      'from-emerald-900 via-emerald-800 to-slate-900',
    ]
    return accents[index % accents.length]
  }

  const tabs = [
    { id: 'all', label: 'All events', icon: 'apps' },
    { id: 'live', label: 'Live now', icon: 'radio_button_checked' },
    { id: 'upcoming', label: 'Upcoming', icon: 'schedule' },
    { id: 'completed', label: 'Completed', icon: 'check_circle' },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f8fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-[1480px] flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumbs */}
        <nav className="mb-7 flex items-center gap-2 text-sm">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
          >
            <span className="material-symbols-outlined text-[17px]">home</span>
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[16px] text-slate-300 dark:text-slate-600">chevron_right</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">Events</span>
        </nav>

        {/* Header */}
        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-600 dark:text-slate-400 shadow-sm">
              <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              Event operations
            </div>
            <h1 className="text-3xl font-black tracking-[-0.035em] text-slate-900 dark:text-slate-100 sm:text-4xl">
              Events directory
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
              Find an event quickly and jump straight into its hospitality operations.
            </p>
          </div>

          <Link
            to="/create-event"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-5 py-3.5 text-sm font-bold text-white dark:text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.14)] dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 dark:hover:bg-slate-200 hover:shadow-[0_14px_30px_rgba(15,23,42,0.2)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:w-auto"
          >
            <span className="material-symbols-outlined text-[19px]">add</span>
            Create event
          </Link>
        </section>

        {/* Search / filter command bar */}
        <section className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:shadow-none">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[21px] text-slate-400 dark:text-slate-500">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-transparent bg-slate-50 dark:bg-slate-800/50 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 dark:focus:border-blue-500/60 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-500/20"
                placeholder="Search by event name..."
                type="text"
              />
            </div>

            <div className="flex min-w-0 gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3.5 text-xs font-bold transition-all sm:px-4 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Directory summary */}
        {!loading && !error && (
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {activeTab === 'all' ? 'All events' : `${tabs.find(tab => tab.id === activeTab)?.label}`}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? `${filteredEvents.length} result${filteredEvents.length === 1 ? '' : 's'} for “${searchQuery}”`
                  : `${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} in this view`}
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {filteredEvents.length} shown <span className="mx-1 text-slate-300 dark:text-slate-600">/</span> {events.length} total
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_6px_25px_rgba(15,23,42,0.035)] dark:shadow-none">
                <div className="h-44 animate-pulse bg-slate-200 dark:bg-slate-800"></div>
                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-white dark:bg-slate-900 p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <span className="material-symbols-outlined">cloud_off</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Couldn’t load your events</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-sm font-bold text-white dark:text-slate-900 transition-colors hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-[17px]">refresh</span>
              Retry
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <span className="material-symbols-outlined text-[30px]">event_busy</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {searchQuery ? 'No matching events' : 'No events in this view'}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'Try a different event name or clear the search to see everything.'
                : 'Create your first event to start managing guests, rooms and operations.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Clear search
              </button>
            ) : (
              <Link
                to="/create-event"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2.5 text-sm font-bold text-white dark:text-slate-900 transition-colors hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                <span className="material-symbols-outlined text-[17px]">add</span>
                Create event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <article
                key={event._id}
                className="group flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_7px_28px_rgba(15,23,42,0.045)] dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
              >
                {/* Event visual header */}
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${getEventAccent(index)} p-5`}>
                  <div className="absolute -right-10 -top-16 size-44 rounded-full border border-white/10 bg-white/[0.04]"></div>
                  <div className="absolute -bottom-24 -left-10 size-48 rounded-full border border-white/10 bg-white/[0.04]"></div>

                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-black tracking-tight text-white backdrop-blur-sm">
                        {getEventInitials(event.name)}
                      </div>
                      {getStatusBadge(event.startDate, event.endDate)}
                    </div>

                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">Event</p>
                      <h3 className="line-clamp-2 max-w-[90%] text-xl font-extrabold leading-tight tracking-[-0.02em] text-white">
                        {event.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Event details */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="space-y-3">
                    {event.venue && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          <span className="material-symbols-outlined text-[17px]">location_on</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Venue</p>
                          <p className="mt-0.5 truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{event.venue}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                        <span className="material-symbols-outlined text-[17px]">calendar_month</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">Event dates</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {formatDate(event.startDate)}
                          {event.endDate && ` — ${formatDate(event.endDate)}`}
                        </p>
                      </div>
                    </div>

                    {event.description && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[17px]">description</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">About</p>
                          <p className="mt-0.5 line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{event.description}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="mb-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[15px]">
                          {event.isPrivate ? 'lock' : 'public'}
                        </span>
                        {event.isPrivate ? 'Private event' : 'Public event'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                        Operations
                      </span>
                    </div>

                    <Link
                      to={`/events/${event._id}/overview`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 text-sm font-bold text-white dark:text-slate-900 transition-all duration-200 group-hover:bg-slate-800 dark:group-hover:bg-slate-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.16)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                    >
                      Manage event
                      <span className="material-symbols-outlined text-[17px] transition-transform duration-200 group-hover:translate-x-0.5">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer count */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-700 dark:text-slate-300">{filteredEvents.length}</span> of{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">{events.length}</span> events
            </p>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500">EventCure operations directory</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default EventDirectory