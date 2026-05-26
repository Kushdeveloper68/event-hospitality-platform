import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/events', icon: 'calendar_today', label: 'Events' },
  { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
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
      console.error('Logout error:', err)
      navigate('/login', { replace: true })
    } finally {
      setLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  // user initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <>
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl">event_seat</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">
              EventOps
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
              Hospitality
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'sidebar-active'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Logout
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-3 mt-1 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-black shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 py-2 safe-area-bottom">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          )
        })}

        {/* Mobile logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-red-400 hover:text-red-600 transition-all"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
          <span className="text-[10px] font-bold">Logout</span>
        </button>
      </nav>

      {/* ── Logout confirmation modal ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm overflow-hidden">

            <div className="p-6 flex flex-col items-center text-center gap-4">
              <div className="size-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-red-500">logout</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Sign out?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  You'll need to sign back in to access your dashboard.
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing out…
                  </>
                ) : (
                  'Sign out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardNavbar