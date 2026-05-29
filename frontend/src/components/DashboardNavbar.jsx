import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button, Modal } from './ui'

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/events', icon: 'calendar_today', label: 'Events' },
  { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
  { path: '/notifications', icon: 'notifications', label: 'Notifications' },
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
      <aside className="hidden md:flex flex-col w-64 h-screen bg-surface border-r border-border shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-card">
            <span className="material-symbols-outlined text-xl">event_seat</span>
          </div>
          <div>
            <p className="text-sm font-black text-text tracking-tight leading-none">
              EventOps
            </p>
            <p className="text-[10px] text-text-muted font-medium mt-0.5 uppercase tracking-wider">
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
                    : 'text-text-muted hover:bg-surface-muted hover:text-text'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-border space-y-1">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:bg-surface-muted hover:text-text transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-danger hover:bg-danger/10 transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Logout
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 px-4 py-3 mt-1 rounded-xl bg-surface-muted">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-black shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text truncate leading-none">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-text-muted truncate mt-0.5">
                {user?.email || ''}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border flex items-center justify-around px-2 py-2 safe-area-bottom">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-primary' : 'text-text-muted hover:text-text'
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
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-danger transition-all"
        >
          <span className="material-symbols-outlined text-2xl">logout</span>
          <span className="text-[10px] font-bold">Logout</span>
        </button>
      </nav>

      {/* ── Logout confirmation modal ── */}
      <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-2xl bg-danger/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-danger">logout</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-text">Sign out?</h3>
            <p className="text-sm text-text-muted mt-1">
              You'll need to sign back in to access your dashboard.
            </p>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowLogoutModal(false)}
            disabled={loggingOut}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            onClick={handleLogout}
            isLoading={loggingOut}
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default DashboardNavbar