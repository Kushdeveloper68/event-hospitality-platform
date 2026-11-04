import axios from 'axios'

/**
 * Tiny GET cache for the axios instance.
 *
 * Every tab in the event workspace mounts fresh when you switch to it, and each
 * one fetched its data again — even if you had looked at it a few seconds ago.
 * This keeps successful GET responses for a short time (TTL) so switching tabs
 * is instant and the database isn't asked the same question repeatedly.
 *
 *  - Same GET in flight twice  -> one network request, shared.
 *  - Any write (POST/PUT/PATCH/DELETE) -> the whole cache is dropped, so you
 *    never see stale data after your own change (assigning a room changes the
 *    guests, rooms, check-in and overview data at once).
 *  - Entries are keyed per auth token, so one user's data is never served to another.
 *  - Errors are never cached.
 *  - Opt out for a single call with `api.get(url, { cache: false })`.
 *
 * Data changed by *someone else* shows up after the TTL at the latest. Routes
 * where that matters (live check-in desk) are excluded in axios.js.
 */

let entries = new Map() // key -> { expires, response }
let inflight = new Map() // key -> Promise<response>
let generation = 0 // bumped on every write; responses started before a write are not stored

export function clearApiCache() {
  entries = new Map()
  inflight = new Map()
  generation += 1
}

function ttlFor(url, rules, defaultTtl) {
  for (const rule of rules) if (rule.match.test(url)) return rule.ttl
  return defaultTtl
}

function authOf(config) {
  const h = config.headers
  return (h && (typeof h.get === 'function' ? h.get('Authorization') : h.Authorization)) || ''
}

// Hand each caller its own copy: axios mutates `response.data` while parsing.
function copyOf(response, config) {
  const data =
    typeof response.data === 'string' || response.data == null ? response.data : structuredClone(response.data)
  return { ...response, data, config }
}

export function createCachedAdapter(baseAdapter, { rules = [], defaultTtl = 30000, now = Date.now } = {}) {
  return async function cachedAdapter(config) {
    const method = (config.method || 'get').toLowerCase()

    // Writes: drop the cache before AND after, so any read that overlapped the write isn't kept.
    if (method !== 'get') {
      clearApiCache()
      try {
        return await baseAdapter(config)
      } finally {
        clearApiCache()
      }
    }

    const ttl =
      config.cache === false || (config.responseType && config.responseType !== 'json')
        ? 0
        : ttlFor(config.url || '', rules, defaultTtl)
    if (!ttl) return baseAdapter(config)

    const key = `${authOf(config)}|${axios.getUri(config)}`

    const hit = entries.get(key)
    if (hit && hit.expires > now()) return copyOf(hit.response, config)

    const pending = inflight.get(key)
    if (pending) return copyOf(await pending, config)

    const startedAt = generation
    const request = baseAdapter(config)
      .then((response) => {
        if (startedAt === generation) entries.set(key, { expires: now() + ttl, response })
        return response
      })
      .finally(() => {
        if (inflight.get(key) === request) inflight.delete(key)
      })
    inflight.set(key, request)
    return copyOf(await request, config)
  }
}
