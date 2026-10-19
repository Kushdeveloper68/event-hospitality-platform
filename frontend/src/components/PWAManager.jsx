import { useEffect, useState, useCallback } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

const DISMISS_KEY = 'pwa-install-dismissed-at'
const DISMISS_DAYS = 7

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

const isIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

const recentlyDismissed = () => {
  try {
    const t = Number(localStorage.getItem(DISMISS_KEY))
    return t && Date.now() - t < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

/**
 * Handles 3 things:
 *  1. "Install app" banner (Android/Desktop Chrome/Edge via beforeinstallprompt)
 *  2. "Add to Home Screen" hint for iOS Safari (no install event there)
 *  3. "New version available" toast when a new deploy is ready
 */
export default function PWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSHint, setShowIOSHint] = useState(
    () => isIOS() && !isStandalone() && !recentlyDismissed()
  )
  const [hidden, setHidden] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Har 1 ghante me naye version ke liye check karo (long-running tabs/PWA ke liye)
      if (registration) setInterval(() => registration.update(), 60 * 60 * 1000)
    },
  })

  useEffect(() => {
    if (isStandalone()) return

    const onBeforeInstall = (e) => {
      e.preventDefault()
      if (!recentlyDismissed()) setDeferredPrompt(e)
    }
    const onInstalled = () => setDeferredPrompt(null)

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      /* private mode: ignore */
    }
    setDeferredPrompt(null)
    setShowIOSHint(false)
    setHidden(true)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (outcome === 'dismissed') dismiss()
  }

  const card =
    'fixed left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/10 bg-[#0b0b10] text-white shadow-2xl p-4'
  const safeBottom = { bottom: 'max(1rem, env(safe-area-inset-bottom))' }

  if (needRefresh) {
    return (
      <div className={card} style={safeBottom} role="status">
        <p className="text-sm font-semibold">New version available</p>
        <p className="mt-1 text-xs text-white/70">
          Refresh to get the latest EventCure update.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex-1 rounded-lg bg-[#d4af37] px-3 py-2 text-sm font-semibold text-black"
          >
            Update now
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm"
          >
            Later
          </button>
        </div>
      </div>
    )
  }

  if (hidden) return null

  if (deferredPrompt) {
    return (
      <div className={card} style={safeBottom} role="dialog" aria-label="Install EventCure">
        <div className="flex items-center gap-3">
          <img src="/pwa-192x192.png" alt="" className="h-12 w-12 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Install EventCure</p>
            <p className="text-xs text-white/70">
              Add to your home screen for faster, app-like access.
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={install}
            className="flex-1 rounded-lg bg-[#d4af37] px-3 py-2 text-sm font-semibold text-black"
          >
            Install
          </button>
          <button
            onClick={dismiss}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm"
          >
            Not now
          </button>
        </div>
      </div>
    )
  }

  if (showIOSHint) {
    return (
      <div className={card} style={safeBottom} role="dialog" aria-label="Install EventCure on iPhone">
        <p className="text-sm font-semibold">Install EventCure</p>
        <p className="mt-1 text-xs text-white/70">
          Tap the Share button in Safari, then choose{' '}
          <span className="font-semibold text-white">Add to Home Screen</span>.
        </p>
        <button
          onClick={dismiss}
          className="mt-3 w-full rounded-lg border border-white/20 px-3 py-2 text-sm"
        >
          Got it
        </button>
      </div>
    )
  }

  return null
}
