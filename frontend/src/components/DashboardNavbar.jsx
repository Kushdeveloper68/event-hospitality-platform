import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
  { path: '/events', icon: 'calendar_month', label: 'Events' },
  { path: '/analytics', icon: 'bar_chart_4_bars', label: 'Analytics' },
  { path: '/notifications', icon: 'notifications', label: 'Activity' },
  { path: '/settings', icon: 'tune', label: 'Settings' },
]

function DashboardNavbar() {
  const { user, logout } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      navigate('/login', { replace: true })
    } finally {
      setLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <>
      {/* ── Desktop / tablet sidebar ──
          md–lg: compact icon rail (labels hidden, tooltip on hover)
          lg+:   full sidebar with labels                              */}
      <aside className="hidden md:flex flex-col w-[76px] lg:w-64 h-screen bg-white dark:bg-surface-dark border-r border-slate-100 dark:border-slate-800/60 shrink-0 transition-[width] duration-200">

        {/* Logo */}
        <Link to="/" className="block">
          <div className="flex items-center gap-3 px-4 lg:px-5 py-5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="size-8 rounded-lg flex items-center justify-center shrink-0">
              <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure Logo" loading="lazy" />
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="font-display text-card-h3 text-slate-900 dark:text-white tracking-tight leading-none truncate">
                EventCure
              </p>
              <p className="text-micro text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                Hospitality
              </p>
            </div>
          </div>
        </Link>

        {/* Nav section label */}
        <div className="hidden lg:block px-5 pt-5 pb-1">
          <p className="text-micro text-slate-400 dark:text-slate-600 uppercase tracking-widest">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2.5 lg:px-3 pt-3 lg:pt-1 pb-1 space-y-0.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-body font-medium transition-all duration-150 justify-center lg:justify-start ${
                  active
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span
                  className="material-symbols-outlined transition-all shrink-0"
                  style={{
                    fontSize: '18px',
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  {item.icon}
                </span>
                <span className="hidden lg:block flex-1">{item.label}</span>
                {active && (
                  <span className="hidden lg:block size-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                )}
                {active && (
                  <span className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom utilities */}
        <div className="px-2.5 lg:px-3 pb-4 space-y-0.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
          <button
            onClick={toggleTheme}
            title={resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-body font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all justify-center lg:justify-start"
          >
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: '18px' }}>
              {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="hidden lg:block">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-body font-medium text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all justify-center lg:justify-start"
          >
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: '18px' }}>logout</span>
            <span className="hidden lg:block">Sign Out</span>
          </button>

          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 justify-center lg:justify-start">
            <div className="size-8 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-700 dark:text-primary-400 text-caption font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-caption font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-micro normal-case text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800/60 flex items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 rounded-lg mx-0.5 my-1 transition-all ${
                active
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '21px',
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                {item.icon}
              </span>
              <span className="text-micro tracking-wide">{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 rounded-lg mx-0.5 my-1 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>logout</span>
          <span className="text-micro tracking-wide">Sign Out</span>
        </button>
      </nav>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xs overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-14 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500" style={{ fontSize: '26px' }}>logout</span>
              </div>
              <div>
                <h3 className="text-card-h3 text-slate-900 dark:text-white">
                  Sign out?
                </h3>
                <p className="text-body text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  You'll need to sign back in to access your dashboard.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 px-5 pb-5">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-body font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-body font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing out
                  </>
                ) : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardNavbar