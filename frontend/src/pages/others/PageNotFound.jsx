import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  const quickLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/events', label: 'Events', icon: 'event' },
    { to: '/login', label: 'Login', icon: 'login' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_26%),linear-gradient(to_bottom,rgba(2,6,23,0.96),rgba(2,6,23,1))]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30 dark:opacity-20" />

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              <span className="material-symbols-outlined text-[18px]! text-primary">travel_explore</span>
              404 - page unavailable
            </div>

            <div className="mt-8 space-y-6">
              <div className="relative inline-block">
                <div className="text-[96px] font-black leading-none tracking-[-0.08em] text-slate-200 dark:text-slate-800 sm:text-[140px] lg:text-[164px]">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex size-20 items-center justify-center rounded-3xl border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:size-24">
                    <span
                      className="material-symbols-outlined text-4xl! text-primary sm:text-5xl!"
                      style={{ fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 48" }}
                    >
                      search_off
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  We could not find this page.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                  The link may be broken, the page may have moved, or you may not have access to this route. Use one
                  of the shortcuts below to continue.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-[20px]!">dashboard</span>
                  Back to dashboard
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-900 shadow-sm transition-colors duration-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  <span className="material-symbols-outlined text-[20px]!">home</span>
                  Go home
                </Link>
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Quick links</p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Jump somewhere useful</h2>
                </div>
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15">
                  <span className="material-symbols-outlined text-[22px]!">bolt</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[20px]!">{link.icon}</span>
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{link.label}</span>
                    </span>
                    <span className="material-symbols-outlined text-[18px]! text-slate-300 transition-colors group-hover:text-primary">
                      arrow_forward
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
                If you were looking for a protected page, sign in first and try again. The dark theme now keeps the
                card, text, and accent colors readable in both modes.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default PageNotFound