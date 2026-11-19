import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PrivacyPolicy from '../pages/others/PrivacyPolicy'
import Termsandconditions from '../pages/others/Termsandconditions'
import UserManual from '../pages/others/UserManual'

// These pages are legal / help text. They must describe what EventCure really
// does today — this guards against promising things that don't exist
// (payments, self-serve account deletion, tools we don't use, old domain…).

// the pages use these browser APIs, which jsdom doesn't have — stub them before any render
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }
Element.prototype.scrollIntoView = () => {}
window.scrollTo = () => {}

const textOf = (Page) => {
  const { container, unmount } = render(<MemoryRouter><Page /></MemoryRouter>)
  const text = container.textContent
  unmount()
  return text
}

const pages = { 'Privacy Policy': PrivacyPolicy, 'Terms & Conditions': Termsandconditions, 'User Manual': UserManual }

describe.each(Object.entries(pages))('%s', (_name, Page) => {
  const text = textOf(Page)

  it('renders and uses the real support email', () => {
    expect(text).toContain('hello.eventcure@gmail.com')
  })

  it.each([
    ['the old domain', /eventcure\.io/i],
    ['docs.eventcure', /docs\.eventcure/i],
    ['a legal-review claim', /legally reviewed/i],
    ['TLS 1.3 / AES-256 specifics', /TLS 1\.3|AES-256/],
    ['"Get Started Free"', /get started free/i],
    ['a remember-me checkbox', /remember me/i],
    ['a CSV-import roadmap note', /CSV import is on the product roadmap/i],
    ['Operations/Enterprise plans', /Operations and Enterprise/i],
  ])('does not mention %s', (_label, pattern) => {
    expect(text).not.toMatch(pattern)
  })
})

describe('Privacy Policy matches the real stack', () => {
  const text = textOf(PrivacyPolicy)
  it.each(['MongoDB Atlas', 'Render', 'Vercel', 'Google'])('names the sub-processor %s', (name) => expect(text).toContain(name))
  it.each(['Razorpay', 'Stripe', 'Cloudinary', 'Sentry', 'SendGrid', 'Railway'])('does not list %s (we do not use it)', (name) => expect(text).not.toContain(name))
  it('documents the browser storage the app really uses', () => {
    ;['authToken', 'app-theme', 'ec_attribution', 'pwa-install-dismissed-at'].forEach((k) => expect(text).toContain(k))
  })
  it('does not promise a self-serve account-deletion screen or automatic backups cleanup', () => {
    expect(text).not.toMatch(/Delete your account in Organization Settings/i)
    expect(text).not.toMatch(/grace period during which you can restore/i)
  })
  it('mentions the signup source and the Google profile photo link', () => {
    expect(text).toMatch(/Signup source/i)
    expect(text).toMatch(/link to your Google profile photo/i)
  })
})

describe('Terms describe the beta honestly', () => {
  const text = textOf(Termsandconditions)
  it('says the service is currently a free beta', () => expect(text).toMatch(/currently offered in beta, free of charge/i))
  it('does not promise PDF export or an API licence', () => {
    expect(text).not.toMatch(/\(CSV, PDF\)/)
    expect(text).not.toMatch(/Integrating the Service via our API/i)
  })
})

describe('User Manual covers the newer features', () => {
  const text = textOf(UserManual)
  it('explains removing / moving a guest', () => expect(text).toMatch(/Removing or moving a guest/))
  it('explains CSV import and installing the app', () => {
    expect(text).toMatch(/click Import CSV/i)
    expect(text).toMatch(/Add to Home Screen/i)
  })
})
