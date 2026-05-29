import React, { useState, useEffect } from 'react'
import { getAllEvents } from '../../api/eventApi'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '../../components/ui'

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
        <Badge variant="success">
          <span className="size-2 bg-success rounded-full animate-pulse" />
          Live
        </Badge>
      ),
      upcoming: (
        <Badge variant="primary">
          Upcoming
        </Badge>
      ),
      completed: (
        <Badge variant="neutral">
          Completed
        </Badge>
      ),
    }
    return badges[status] || badges.upcoming
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Events Directory"
        subtitle="Track and manage high-level hospitality operations across all venues."
        actions={
          <Link to="/create-event">
            <Button
              leadingIcon={
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
              }
            >
              Create Event
            </Button>
          </Link>
        }
      />

      <div className="space-y-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events by name..."
          startAdornment={
            <span className="material-symbols-outlined text-lg">search</span>
          }
        />
        <div className="flex flex-wrap gap-2 border-b border-border pb-2">
          {[
            { key: 'all', label: 'All Events' },
            { key: 'live', label: 'Live Now' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-muted mt-4">Loading events...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-danger font-semibold">{error}</p>
          <Button onClick={fetchEvents}>Retry</Button>
        </Card>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon="event"
          title={searchQuery ? 'No matching events' : 'No events available'}
          description={
            searchQuery
              ? 'No events found matching your search.'
              : 'Create your first event to get started.'
          }
          action={
            !searchQuery ? (
              <Link to="/create-event">
                <Button size="sm">Create Event</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event._id}
              className="overflow-hidden hover:shadow-card-hover transition-shadow group"
            >
              <div className="h-40 bg-gradient-to-br from-primary/80 to-indigo-500 relative flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-white/20">
                  event
                </span>
                <div className="absolute top-3 right-3">
                  {getStatusBadge(event.startDate, event.endDate)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {event.name}
                </h3>
                <div className="flex flex-col gap-2">
                  {event.venue && (
                    <div className="flex items-center gap-2 text-text-muted text-sm">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <span className="material-symbols-outlined text-sm">
                      calendar_month
                    </span>
                    <span>
                      {formatDate(event.startDate)}
                      {event.endDate && ` - ${formatDate(event.endDate)}`}
                    </span>
                  </div>
                  {event.description && (
                    <div className="flex items-start gap-2 text-text-muted text-sm mt-2">
                      <span className="material-symbols-outlined text-sm flex-shrink-0">
                        description
                      </span>
                      <span className="line-clamp-2">
                        {event.description}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-medium text-text-muted">
                    {event.isPrivate ? 'Private Event' : 'Public Event'}
                  </span>
                  <Link to={`/events/${event._id}/overview`}>
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredEvents.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm text-text-muted">
          <p>
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>
      )}
    </div>
  )
}

export default EventDirectory