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
        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
          <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </span>
      ),
      upcoming: (
        <span className="bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Upcoming
        </span>
      ),
      completed: (
        <span className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Completed
        </span>
      ),
    }
    return badges[status] || badges.upcoming
  }

  return (
    <div className="relative flex h-auto min-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-col flex-1 px-4 py-8">
          {/* <!-- Breadcrumbs --> */}
          <nav className="flex items-center gap-2 mb-6">
            <Link to="/dashboard" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>
              Dashboard
            </Link>
            <span className="text-gray-400 text-sm font-medium">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </span>
            <span className="text-gray-900 dark:text-white text-sm font-semibold">Events</span>
          </nav>
          {/* <!-- Page Header --> */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Events Directory
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base">Track and manage high-level hospitality operations
                across all venues.</p>
            </div>
            <Link to="/create-event">
            <button
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create Event</span>
            </button>
            </Link>
          </div>
          {/* <!-- Search and Filters Section --> */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                placeholder="Search events by name..." type="text" />
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-800 gap-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`border-b-2 pb-3 font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}>
                All Events
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`border-b-2 pb-3 font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'live'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}>
                Live Now
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`border-b-2 pb-3 font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}>
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`border-b-2 pb-3 font-bold text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'completed'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}>
                Completed
              </button>
            </div>
          </div>
          {/* <!-- Events Grid --> */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-4">Loading events...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchEvents}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Retry
                </button>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">event</span>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No events found matching your search.' : 'No events available.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 relative flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-white/20">event</span>
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(event.startDate, event.endDate)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {event.name}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {event.venue && (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                          <span className="material-symbols-outlined text-sm">location_on</span>
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        <span>
                          {formatDate(event.startDate)}
                          {event.endDate && ` - ${formatDate(event.endDate)}`}
                        </span>
                      </div>
                      {event.description && (
                        <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-sm mt-2">
                          <span className="material-symbols-outlined text-sm flex-shrink-0">description</span>
                          <span className="line-clamp-2">{event.description}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-400">
                        {event.isPrivate ? 'Private Event' : 'Public Event'}
                      </span>
                      <Link to={`/events/${event._id}/overview`} className="text-primary font-bold text-sm hover:underline">
                        Manage
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* <!-- Pagination --> */}
          {filteredEvents.length > 0 && (
            <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredEvents.length} of {events.length} events
              </p>
            </div>
          )}
        </main>
        {/* <!-- Footer --> */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-8 px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2024 EventOps Enterprise. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-sm text-gray-500 hover:text-primary" href="#">Support</a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">Documentation</a>
              <a className="text-sm text-gray-500 hover:text-primary" href="#">API</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default EventDirectory