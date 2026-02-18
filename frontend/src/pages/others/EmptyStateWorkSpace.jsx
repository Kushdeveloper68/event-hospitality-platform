import React from 'react'

function EmptyStateWorkSpace() {
  return (
   <div className="relative flex h-screen w-full flex-col overflow-hidden">
    {/* <!-- Top Navigation Bar --> */}
    <header
      className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
            <span className="material-symbols-outlined text-xl">diamond</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Hospitality Ops</h2>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Dashboard</a>
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Events</a>
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Guests</a>
          <a className="text-sm font-medium text-slate-500 hover:text-primary transition-colors" href="#">Analytics</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="h-9 w-64 rounded-lg border-none bg-slate-100 dark:bg-slate-800 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            placeholder="Search requests..." type="text" />
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined text-lg">notifications</span>
        </button>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
        <div
          className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-900 shadow-sm">
          <img alt="User Profile" className="h-full w-full object-cover" data-alt="Close up portrait of a professional man"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQX3wcAqgW2D4pUeWd7dbm5uZKRVasbSg-RAUcxtK8s2lLzLupMV8fXouqXsae5pcez6-iSa56FmHoLa4uZSP2gDHDS32o7DHT-Sk_c4WDyDvN_AEWL6yMyrIeCJiQQeUnxRNcUaegyqs9WC8ocXwOSJqjcztVWVUIp6uscgCT3q11hKzn7yUGDz-f_65mgTnQX7YrOknauiAFUc4fZEW4U6pX-7x9AQ12-KT7MRl5yUSOKUFg4MgirrAr2xltU9v2DZl1rkBtJH4Z" />
        </div>
      </div>
    </header>
    <div className="flex flex-1 overflow-hidden">
      {/* <!-- Sidebar Navigation --> */}
      <aside
        className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col p-4 shrink-0">
        <div className="mb-6 px-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Event Center
          </h3>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Operations Team</p>
        </div>
        <nav className="flex flex-col gap-1">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">dashboard</span>
            Overview
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-primary/10 text-primary"
            href="#">
            <span className="material-symbols-outlined fill-1">notifications_active</span>
            Service Requests
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">cleaning_services</span>
            Housekeeping
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">handyman</span>
            Maintenance
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">restaurant</span>
            Food &amp; Beverage
          </a>
        </nav>
        <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-4">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">help_center</span>
            Support Center
          </a>
        </div>
      </aside>
      {/* <!-- Main Workspace Area --> */}
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Requests</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage active guest service requests and task
                assignments.</p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                Filter
              </button>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-lg">add</span>
                Create Request
              </button>
            </div>
          </div>
          {/* <!-- Empty State Workspace --> */}
          <div
            className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 text-center backdrop-blur-sm">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">notifications_paused</span>
              </div>
            </div>
            <div className="max-w-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No service requests found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                When guests make requests for amenities, maintenance, or room service, they will appear here for your
                team to manage and assign to staff.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-transform active:scale-95">
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Create First Request
                </button>
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-lg">import_contacts</span>
                  View Documentation
                </button>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
              <div
                className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary mb-2">speed</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">Real-time alerts</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Instant sync across devices</span>
              </div>
              <div
                className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary mb-2">assignment_ind</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">Staff assignment</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Direct task distribution</span>
              </div>
              <div
                className="flex flex-col items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary mb-2">analytics</span>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200">Performance tracking</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Monitor response times</span>
              </div>
            </div>
          </div>
          <footer className="mt-8 flex items-center justify-center">
            <a className="text-sm font-medium text-primary hover:underline flex items-center gap-1" href="#">
              Learn more about request management
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </footer>
        </div>
      </main>
    </div>
  </div>
  )
}

export default EmptyStateWorkSpace