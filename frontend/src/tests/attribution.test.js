import { describe, it, expect } from 'vitest'
import { captureAttribution, getAttribution, getAttributionParam } from '../utils/attribution'

const DAY = 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-11-05T10:00:00Z')

function makeStorage(initial = {}) {
  const data = { ...initial }
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v) },
    _data: data,
  }
}
const env = (over = {}) => ({ search: '', pathname: '/', hostname: 'eventcure.in', referrer: '', now: NOW, storage: makeStorage(), ...over })

describe('capturing a source', () => {
  it('reads utm_source / medium / campaign from the link', () => {
    const e = env({ search: '?utm_source=Instagram&utm_medium=bio&utm_campaign=oct-planners' })
    captureAttribution(e)
    expect(getAttribution(e)).toMatchObject({ source: 'instagram', medium: 'bio', campaign: 'oct-planners', landingPath: '/' })
  })

  it('accepts ?ref= as a shorthand', () => {
    const e = env({ search: '?ref=whatsapp' })
    captureAttribution(e)
    expect(getAttribution(e).source).toBe('whatsapp')
  })

  it('records the landing path without the query string', () => {
    const e = env({ pathname: '/signup', search: '?utm_source=call&token=secret' })
    captureAttribution(e)
    expect(getAttribution(e).landingPath).toBe('/signup')
  })

  it('strips markup from tags', () => {
    const e = env({ search: '?utm_source=%3Cscript%3Ealert(1)%3C/script%3E' })
    captureAttribution(e)
    expect(getAttribution(e).source).not.toMatch(/[<>()]/)
  })

  it('does not treat the installed app launching (utm_source=pwa) as a marketing channel', () => {
    const e = env({ search: '?utm_source=pwa' })
    captureAttribution(e)
    expect(getAttribution(e)).toMatchObject({ source: 'direct' })
  })
})

describe('referrer fallback (no tagged link)', () => {
  it.each([
    ['https://l.instagram.com/?u=x', 'instagram'],
    ['https://www.facebook.com/', 'facebook'],
    ['https://wa.me/919999999999', 'whatsapp'],
    ['https://www.google.com/search?q=event+software', 'google'],
    ['https://www.google.co.in/', 'google'],
    ['https://www.linkedin.com/feed/', 'linkedin'],
    ['https://some-blog.example.org/post', 'some-blog.example.org'],
  ])('%s -> %s', (referrer, expected) => {
    const e = env({ referrer })
    captureAttribution(e)
    expect(getAttribution(e)).toMatchObject({ source: expected, medium: 'referral' })
  })

  it('ignores navigation from our own site', () => {
    const e = env({ referrer: 'https://www.eventcure.in/login' })
    captureAttribution(e)
    expect(getAttribution(e).source).toBe('direct')
  })

  it('no referrer and no tags = direct', () => {
    const e = env()
    captureAttribution(e)
    expect(getAttribution(e).source).toBe('direct')
  })
})

describe('first touch vs later visits', () => {
  it('keeps the original source on later untagged visits', () => {
    const storage = makeStorage()
    captureAttribution(env({ storage, search: '?utm_source=instagram' }))
    captureAttribution(env({ storage, now: NOW + 2 * DAY })) // came back directly
    captureAttribution(env({ storage, now: NOW + 3 * DAY, referrer: 'https://www.google.com/' })) // ...or via Google
    expect(getAttribution(env({ storage, now: NOW + 3 * DAY })).source).toBe('instagram')
  })

  it('a new explicitly tagged link replaces the old source', () => {
    const storage = makeStorage()
    captureAttribution(env({ storage, search: '?utm_source=instagram' }))
    captureAttribution(env({ storage, now: NOW + DAY, search: '?utm_source=whatsapp&utm_medium=dm' }))
    expect(getAttribution(env({ storage, now: NOW + DAY })).source).toBe('whatsapp')
  })

  it('upgrades "direct" once a real source is known', () => {
    const storage = makeStorage()
    captureAttribution(env({ storage }))
    captureAttribution(env({ storage, now: NOW + DAY, referrer: 'https://l.instagram.com/' }))
    expect(getAttribution(env({ storage, now: NOW + DAY })).source).toBe('instagram')
  })

  it('forgets a source after 30 days', () => {
    const storage = makeStorage()
    captureAttribution(env({ storage, search: '?utm_source=instagram' }))
    expect(getAttribution(env({ storage, now: NOW + 31 * DAY }))).toBeNull()
    captureAttribution(env({ storage, now: NOW + 31 * DAY }))
    expect(getAttribution(env({ storage, now: NOW + 31 * DAY })).source).toBe('direct')
  })
})

describe('robustness', () => {
  it('never throws when storage is blocked (private mode)', () => {
    const blocked = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } }
    expect(() => captureAttribution(env({ storage: blocked, search: '?utm_source=x' }))).not.toThrow()
    expect(getAttribution(env({ storage: blocked }))).toBeNull
  })

  it('ignores corrupt stored data', () => {
    const storage = makeStorage({ ec_attribution: '{not json' })
    expect(getAttribution(env({ storage }))).toBeNull()
  })
})

describe('Google-flow parameter', () => {
  it('is base64url JSON that the backend can decode back', () => {
    const e = env({ search: '?utm_source=instagram&utm_medium=bio' })
    captureAttribution(e)
    const param = getAttributionParam(e)
    expect(param).toMatch(/^[A-Za-z0-9_-]+$/) // URL- and OAuth-state-safe
    const decoded = JSON.parse(Buffer.from(param, 'base64url').toString('utf8'))
    expect(decoded).toMatchObject({ source: 'instagram', medium: 'bio' })
  })

  it('is empty when there is nothing to send', () => {
    expect(getAttributionParam(env())).toBe('')
  })
})
