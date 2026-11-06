// Remembers which link first brought a visitor to EventCure, so that when they
// sign up we know whether it was Instagram, a call, WhatsApp, etc.
//
// Tag your links like:
//   https://eventcure.in/?utm_source=instagram&utm_medium=bio
//   https://eventcure.in/?utm_source=whatsapp&utm_medium=dm
//   https://eventcure.in/?utm_source=call&utm_medium=followup&utm_campaign=oct-planners
// (`?ref=instagram` also works.) Without tags, the referring site is used.

const STORAGE_KEY = 'ec_attribution'
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000 // keep a visitor's source for 30 days

const clean = (value, max = 60) =>
  String(value ?? '').toLowerCase().replace(/[^a-z0-9 _.\-+/]/g, '').replace(/\s+/g, ' ').trim().slice(0, max)

// referrer hostname -> friendly source name
const REFERRER_SOURCES = [
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'facebook'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'whatsapp'],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'x'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'],
  [/(^|\.)google\./, 'google'],
  [/(^|\.)bing\.com$/, 'bing'],
]

function fromReferrer(referrer, ownHost) {
  if (!referrer) return null
  let host
  try { host = new URL(referrer).hostname.toLowerCase() } catch { return null }
  if (!host || host === ownHost || host === `www.${ownHost}` || `www.${host}` === ownHost) return null // internal navigation
  for (const [pattern, name] of REFERRER_SOURCES) if (pattern.test(host)) return { source: name, medium: 'referral', host }
  return { source: clean(host.replace(/^www\./, '')), medium: 'referral', host }
}

function defaultEnv() {
  return {
    search: window.location.search,
    pathname: window.location.pathname,
    hostname: window.location.hostname,
    referrer: document.referrer,
    now: Date.now(),
    storage: window.localStorage,
  }
}

function read(storage) {
  try {
    const stored = JSON.parse(storage.getItem(STORAGE_KEY) || 'null')
    return stored && typeof stored.source === 'string' ? stored : null
  } catch {
    return null
  }
}

/**
 * Call once at app start. First-touch: keeps the original source, unless
 *  - the visitor arrives through a new explicitly tagged link (utm_source / ref), or
 *  - the stored source is "direct" and we can now tell where they came from, or
 *  - the stored one is older than 30 days.
 */
export function captureAttribution(env = defaultEnv()) {
  try {
    const params = new URLSearchParams(env.search)
    let source = clean(params.get('utm_source') || params.get('ref'))
    if (source === 'pwa') source = '' // the installed app launching is not a marketing channel

    const stored = read(env.storage)
    const expired = stored && env.now - new Date(stored.capturedAt).getTime() > MAX_AGE_MS

    let touch = null
    if (source) {
      touch = {
        source,
        medium: clean(params.get('utm_medium')) || null,
        campaign: clean(params.get('utm_campaign'), 80) || null,
        referrer: fromReferrer(env.referrer, env.hostname)?.host || null,
      }
    } else if (!stored || expired || stored.source === 'direct') {
      const ref = fromReferrer(env.referrer, env.hostname)
      touch = ref
        ? { source: ref.source, medium: ref.medium, campaign: null, referrer: ref.host }
        : stored && !expired ? null : { source: 'direct', medium: null, campaign: null, referrer: null }
    }

    if (touch) {
      env.storage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...touch, landingPath: clean(env.pathname, 100) ? env.pathname.slice(0, 100) : '/', capturedAt: new Date(env.now).toISOString() })
      )
    }
  } catch {
    /* storage blocked (private mode) — attribution is best-effort */
  }
}

export function getAttribution(env = defaultEnv()) {
  const stored = read(env.storage)
  if (!stored) return null
  if (env.now - new Date(stored.capturedAt).getTime() > MAX_AGE_MS) return null
  return stored
}

// For the Google flow: base64url JSON, travels through Google's redirect as OAuth `state`.
export function getAttributionParam(env = defaultEnv()) {
  const attribution = getAttribution(env)
  if (!attribution) return ''
  const json = JSON.stringify(attribution)
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
