import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserAvatar from '../components/UserAvatar'

const PHOTO = 'https://lh3.googleusercontent.com/a/ACg8oc123=s96-c'

describe('UserAvatar', () => {
  it('shows initials when the user has no photo', () => {
    render(<UserAvatar user={{ name: 'Kush Pandit' }} initials="KP" className="box" />)
    expect(screen.getByText('KP')).toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()
  })

  it('shows initials when there is no user at all', () => {
    render(<UserAvatar user={null} initials="??" />)
    expect(screen.getByText('??')).toBeInTheDocument()
  })

  it('shows the Google photo, asking for a size that fits the avatar', () => {
    render(<UserAvatar user={{ profilePicture: PHOTO }} initials="KP" size={128} />)
    const img = document.querySelector('img')
    expect(img).not.toBeNull()
    expect(img.getAttribute('src')).toBe('https://lh3.googleusercontent.com/a/ACg8oc123=s128-c')
    expect(screen.queryByText('KP')).toBeNull()
  })

  it("sends no referrer (Google's image host can refuse requests carrying another site's referrer)", () => {
    render(<UserAvatar user={{ profilePicture: PHOTO }} initials="KP" />)
    expect(document.querySelector('img').getAttribute('referrerpolicy')).toBe('no-referrer')
  })

  it('leaves a photo URL alone if it has no size suffix', () => {
    const url = 'https://lh3.googleusercontent.com/a/plain-photo'
    render(<UserAvatar user={{ profilePicture: url }} initials="KP" />)
    expect(document.querySelector('img').getAttribute('src')).toBe(url)
  })

  it('falls back to initials if the photo fails to load', () => {
    render(<UserAvatar user={{ profilePicture: PHOTO }} initials="KP" />)
    fireEvent.error(document.querySelector('img'))
    expect(screen.getByText('KP')).toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()
  })

  it('tries again when the photo link changes after a failure', () => {
    const { rerender } = render(<UserAvatar user={{ profilePicture: PHOTO }} initials="KP" />)
    fireEvent.error(document.querySelector('img'))
    rerender(<UserAvatar user={{ profilePicture: 'https://lh3.googleusercontent.com/a/new=s96-c' }} initials="KP" />)
    expect(document.querySelector('img')).not.toBeNull()
  })

  it('keeps the caller\'s box classes and clips the image to them', () => {
    const { container } = render(<UserAvatar user={{ profilePicture: PHOTO }} initials="KP" className="size-8 rounded-lg" />)
    expect(container.firstChild.className).toMatch(/size-8 rounded-lg/)
    expect(container.firstChild.className).toMatch(/overflow-hidden/)
  })
})
