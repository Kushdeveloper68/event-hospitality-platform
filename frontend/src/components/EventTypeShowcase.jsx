import React, { useState } from 'react'

const headlineStyle = { fontFamily: "'Manrope', sans-serif" }

// image: /public/images/events/<key>.webp  (see IMAGES-GUIDE.md)
const TILES = [
  { key: 'wedding', title: 'Weddings', icon: 'favorite',
    copy: 'Guest lists, room blocks and arrivals for every family.', tags: ['Guests', 'Rooms', 'Arrivals'] },
  { key: 'reception', title: 'Receptions', icon: 'celebration',
    copy: 'Fast check-in and a live count of who has arrived.', tags: ['Check-in', 'Live counts'] },
  { key: 'sangeet', title: 'Sangeet & Mehendi', icon: 'music_note',
    copy: 'Multi-day schedules with the whole team on one timeline.', tags: ['Schedule', 'Team'] },
  { key: 'conference', title: 'Conferences', icon: 'groups',
    copy: 'Delegate lists, airport transfers and service tickets.', tags: ['Transport', 'Service'] },
  { key: 'corporate', title: 'Corporate retreats', icon: 'business_center',
    copy: 'Room allocation and VIP handling across the stay.', tags: ['Rooms', 'VIP'] },
  { key: 'festival', title: 'Festivals & galas', icon: 'festival',
    copy: 'Big guest volumes, imported from a CSV in seconds.', tags: ['Bulk import', 'Analytics'] },
]

function ShowcaseTile({ tile, index }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className={`ec-showcase-tile ec-showcase-tile--${index + 1}`}>
      {/* shown until (or unless) the photo loads */}
      <span className="ec-showcase-icon material-symbols-outlined" aria-hidden="true">{tile.icon}</span>
      {!imageFailed && (
        <img
          src={`/images/events/${tile.key}.webp`}
          alt={`${tile.title} managed with EventCure`}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="ec-showcase-shade" />
      <div className="ec-showcase-body">
        <h3 style={headlineStyle}>{tile.title}</h3>
        <p>{tile.copy}</p>
        <div className="ec-showcase-tags">
          {tile.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </article>
  )
}

export default function EventTypeShowcase() {
  return (
    <section className="ec-section ec-showcase" id="event-types">
      <div className="ec-container">
        <div className="ec-section-heading centered">
          <span className="ec-eyebrow">BUILT FOR EVERY KIND OF EVENT</span>
          <h2 style={headlineStyle}>
            From the first guest list<span>to the last check-out.</span>
          </h2>
          <p>Weddings, receptions, conferences and corporate retreats — one operations workspace for all of them.</p>
        </div>
        <div className="ec-showcase-grid">
          {TILES.map((tile, i) => <ShowcaseTile key={tile.key} tile={tile} index={i} />)}
        </div>
      </div>
    </section>
  )
}
