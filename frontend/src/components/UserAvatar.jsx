import React, { useEffect, useState } from 'react'

// Google photo URLs end in "=s96-c" (96px, cropped square). Ask for the size
// we actually need so small avatars load fast and big ones stay sharp.
const resize = (url, size) => url.replace(/=s\d+(-c)?$/, `=s${size}-c`)

/**
 * Signed-in user's avatar: their Google profile photo when we have one,
 * otherwise (or if the photo fails to load) their initials.
 *
 * `className` styles the round/square box exactly as the old initials box was,
 * so swapping it in doesn't change the layout.
 */
export default function UserAvatar({ user, initials, className = '', size = 96 }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [user?.profilePicture])

  const src = !failed && user?.profilePicture ? resize(user.profilePicture, size) : null

  return (
    <div className={`${className} overflow-hidden`}>
      {src ? (
        <img
          src={src}
          alt=""
          // Google's image host can refuse requests that carry another site's referrer
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  )
}
