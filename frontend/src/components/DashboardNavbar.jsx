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
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800/60 shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="size-8 rounded-lg flex items-center justify-center">
            <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure Logo" loading='lazy'/>
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              EventCure
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 tracking-wider uppercase">
              Hospitality
            </p>
          </div>
        </div>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-all`}
                  style={{
                    fontSize: '18px',
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0"
                  }}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {active && (
                  <span className="size-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom utilities */}
        <div className="px-3 pb-4 space-y-0.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Sign Out
          </button>

          {/* User card */}
          <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
            <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400 text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60 flex items-stretch px-1 safe-area-bottom">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 rounded-lg mx-0.5 my-1 transition-all ${
                active
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
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
              <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 rounded-lg mx-0.5 my-1 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '21px' }}>logout</span>
          <span className="text-[9px] font-semibold tracking-wide">Sign Out</span>
        </button>
      </nav>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-xs overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-14 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500" style={{ fontSize: '26px' }}>logout</span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Sign out?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  You'll need to sign back in to access your dashboard.
                </p>
              </div>
            </div>
            <div className="flex gap-2.5 px-5 pb-5">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
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