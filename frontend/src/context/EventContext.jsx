import React, { createContext, useState } from 'react'

export const EventContext = createContext({ event: null, setEvent: () => {} })

export const EventProvider = ({ children, initialEvent = null }) => {
  const [event, setEvent] = useState(initialEvent)
  return (
    <EventContext.Provider value={{ event, setEvent }}>
      {children}
    </EventContext.Provider>
  )
}

export default EventProvider
