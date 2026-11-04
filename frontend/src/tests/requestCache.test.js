import { describe, it, expect, beforeEach } from 'vitest'
import axios from 'axios'
import { createCachedAdapter, clearApiCache } from '../api/requestCache'

// Fake network: counts calls, returns JSON text like a real xhr adapter would.
function makeApi({ now, rules = [], defaultTtl = 30000, failOn } = {}) {
  const calls = []
  let counter = 0
  let release = null
  const base = async (config) => {
    calls.push(`${(config.method || 'get').toUpperCase()} ${config.url}`)
    if (release) await release
    if (failOn && failOn(config)) {
      const err = new Error('boom'); err.isAxiosError = true; throw err
    }
    counter += 1
    return { data: JSON.stringify({ n: counter, url: config.url }), status: 200, statusText: 'OK', headers: {}, config, request: {} }
  }
  const api = axios.create({
    baseURL: 'http://test/api',
    adapter: createCachedAdapter(base, { rules, defaultTtl, now }),
  })
  return { api, calls, hold: () => { let r; release = new Promise((res) => (r = res)); return () => { release = null; r() } } }
}

let t = 0
const now = () => t
beforeEach(() => { t = 0; clearApiCache() })

describe('GET caching', () => {
  it('serves a repeat GET from cache within the TTL (one network call)', async () => {
    const { api, calls } = makeApi({ now })
    const a = await api.get('/guests', { params: { eventId: '1' } })
    t = 10000
    const b = await api.get('/guests', { params: { eventId: '1' } })
    expect(calls).toHaveLength(1)
    expect(b.data).toEqual(a.data)
    expect(b.data.n).toBe(1) // parsed object, not a string
  })

  it('refetches after the TTL expires', async () => {
    const { api, calls } = makeApi({ now })
    await api.get('/guests')
    t = 30001
    const again = await api.get('/guests')
    expect(calls).toHaveLength(2)
    expect(again.data.n).toBe(2)
  })

  it('treats different params as different requests', async () => {
    const { api, calls } = makeApi({ now })
    await api.get('/guests', { params: { page: 1 } })
    await api.get('/guests', { params: { page: 2 } })
    expect(calls).toHaveLength(2)
  })

  it('never caches routes with ttl 0 (e.g. the live check-in desk)', async () => {
    const { api, calls } = makeApi({ now, rules: [{ match: /\/checkin(\/|\?|$)/, ttl: 0 }] })
    await api.get('/checkin/summary')
    await api.get('/checkin/summary')
    expect(calls).toHaveLength(2)
  })

  it('applies a custom per-route TTL', async () => {
    const { api, calls } = makeApi({ now, rules: [{ match: /\/overview\//, ttl: 15000 }] })
    await api.get('/overview/1')
    t = 14000; await api.get('/overview/1')
    expect(calls).toHaveLength(1)
    t = 16000; await api.get('/overview/1')
    expect(calls).toHaveLength(2)
  })

  it('lets a single call opt out with { cache: false }', async () => {
    const { api, calls } = makeApi({ now })
    await api.get('/guests', { cache: false })
    await api.get('/guests', { cache: false })
    expect(calls).toHaveLength(2)
  })

  it('does not cache errors', async () => {
    let fail = true
    const { api, calls } = makeApi({ now, failOn: () => fail })
    await expect(api.get('/rooms')).rejects.toThrow()
    fail = false
    const ok = await api.get('/rooms')
    expect(ok.data.n).toBe(1)
    expect(calls).toHaveLength(2)
  })
})

describe('freshness after changes', () => {
  it('any write clears the whole cache (so you never see stale data after your own change)', async () => {
    const { api, calls } = makeApi({ now })
    await api.get('/guests')
    await api.get('/rooms')
    await api.post('/rooms/1/assign', {})
    await api.get('/guests')
    await api.get('/rooms')
    expect(calls.filter((c) => c.startsWith('GET'))).toHaveLength(4) // both refetched
  })

  it('a GET that was in flight during a write is not stored', async () => {
    const { api, calls, hold } = makeApi({ now })
    const release = hold()
    const pendingRead = api.get('/guests') // starts before the write...
    await Promise.resolve()
    const write = api.put('/guests/1', {})
    release(); await Promise.all([pendingRead, write])
    await api.get('/guests') // ...so this must hit the network again
    expect(calls.filter((c) => c === 'GET /guests')).toHaveLength(2)
  })
})

describe('sharing and isolation', () => {
  it('shares one network request between simultaneous identical GETs', async () => {
    const { api, calls, hold } = makeApi({ now })
    const release = hold()
    const p1 = api.get('/guests'); const p2 = api.get('/guests')
    await Promise.resolve(); release()
    const [a, b] = await Promise.all([p1, p2])
    expect(calls).toHaveLength(1)
    expect(a.data).toEqual(b.data)
    expect(a.data).not.toBe(b.data) // separate objects
  })

  it("callers can mutate their result without corrupting the cache", async () => {
    const { api } = makeApi({ now })
    const first = await api.get('/guests')
    first.data.n = 999
    const second = await api.get('/guests')
    expect(second.data.n).toBe(1)
  })

  it('keeps different users (auth tokens) apart', async () => {
    const { api, calls } = makeApi({ now })
    await api.get('/guests', { headers: { Authorization: 'Bearer A' } })
    await api.get('/guests', { headers: { Authorization: 'Bearer B' } })
    expect(calls).toHaveLength(2)
    await api.get('/guests', { headers: { Authorization: 'Bearer A' } })
    expect(calls).toHaveLength(2) // A is still cached
  })
})
