import React, { useEffect, useRef, useState } from 'react'
import { getEventCoverSrc, getEventCategory, EVENT_CATEGORY_LABELS } from '../utils/eventCovers'

/**
 * Photo layer for a card header. Drop it in as the FIRST child of a
 * `relative overflow-hidden` container that already has a gradient background:
 * it fades the photo in (plus a dark overlay so text stays readable), and
 * renders nothing if the photo is missing — the gradient simply stays.
 */
export default function EventCover({ event }) {
  const src = getEventCoverSrc(event)
  const imgRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | loaded | failed

  useEffect(() => {
    setStatus('loading')
    // A cached image can finish loading before React attaches onLoad.
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) setStatus('loaded')
  }, [src])

  if (status === 'failed') return null

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('failed')}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {status === 'loaded' && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/45" />
      )}
    </>
  )
}

/**
 * Slim photo banner for the top of the event Overview tab.
 * Renders nothing at all until the photo has actually loaded, so events
 * without a photo don't get an empty coloured bar.
 */
export function EventCoverStrip({ event }) {
  const src = getEventCoverSrc(event)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    let cancelled = false
    const img = new Image()
    img.onload = () => { if (!cancelled) setLoaded(true) }
    img.src = src
    return () => { cancelled = true }
  }, [src])

  if (!loaded) return null

  const label = EVENT_CATEGORY_LABELS[getEventCategory(event)]

  return (
    <div className="relative h-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 dark:border-slate-800 sm:h-24">
      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent" />
      <div className="relative flex h-full items-center gap-3 px-5">
        <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
          {label}
        </span>
        {event?.venue && (
          <span className="flex min-w-0 items-center gap-1 text-xs font-semibold text-white/80">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            <span className="truncate">{event.venue}</span>
          </span>
        )}
      </div>
    </div>
  )
}
