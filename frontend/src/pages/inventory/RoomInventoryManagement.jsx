import React from 'react'

function RoomInventoryManagement() {
  return (
    <div className="relative flex min-h-screen flex-col">
    {/* <!-- Top Navigation Bar --> */}
    
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
      {/* <!-- Breadcrumbs --> */}
      <nav className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <a className="hover:text-primary" href="#">Events</a>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <a className="hover:text-primary text-slate-900 dark:text-white" href="#">Annual Corporate Summit</a>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="text-primary">Room Inventory</span>
      </nav>
      {/* <!-- Header Section --> */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Room Inventory Management</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Monitor and manage guest assignments for physical space
            inventory.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export PDF
          </button>
          <button
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Room
          </button>
        </div>
      </div>
      {/* <!-- Stats Grid --> */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Rooms</p>
            <span className="material-symbols-outlined text-slate-400">bed</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">120</h3>
            <span className="text-xs font-semibold text-emerald-600">+2 from last week</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total Capacity</p>
            <span className="material-symbols-outlined text-slate-400">groups</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">240</h3>
            <span className="text-xs font-semibold text-slate-400">Guests max</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Current Occupancy</p>
            <span className="material-symbols-outlined text-slate-400">check_circle</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">186</h3>
            <span className="text-xs font-semibold text-primary">77.5% Full</span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Maintenance</p>
            <span className="material-symbols-outlined text-slate-400">build</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight">8</h3>
            <span className="text-xs font-semibold text-amber-600">3 priority items</span>
          </div>
        </div>
      </div>
      {/* <!-- Filter Bar --> */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white">
          All Rooms
        </button>
        <button
          className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          Available (42)
        </button>
        <button
          className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          Occupied (70)
        </button>
        <button
          className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
          Maintenance (8)
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-slate-500">View:</span>
          <div className="flex rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <button
              className="flex h-9 w-9 items-center justify-center border-r border-slate-200 bg-slate-50 text-primary dark:border-slate-700 dark:bg-slate-700">
              <span className="material-symbols-outlined text-xl">grid_view</span>
            </button>
            <button className="flex h-9 w-9 items-center justify-center text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-xl">view_list</span>
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Room Grid --> */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* <!-- Room Card (Available) --> */}
        <div
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold">Room 101</h4>
              <p className="text-xs text-slate-500">North Wing • Deluxe</p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Available
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Capacity</span>
              <span className="font-semibold">2 Guests</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Occupancy</span>
                <span className="font-bold">0 / 2</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-0 bg-primary"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
              Assign Guest
            </button>
          </div>
        </div>
        {/* <!-- Room Card (Partially Occupied) --> */}
        <div
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold">Room 102</h4>
              <p className="text-xs text-slate-500">North Wing • Standard</p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary dark:bg-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Occupied
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Capacity</span>
              <span className="font-semibold">2 Guests</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Occupancy</span>
                <span className="font-bold">1 / 2</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-1/2 bg-primary"></div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              View Details
            </button>
            <button className="rounded-lg bg-primary px-3 text-white transition-opacity hover:opacity-90">
              <span className="material-symbols-outlined text-lg align-middle">person_add</span>
            </button>
          </div>
        </div>
        {/* <!-- Room Card (Maintenance) --> */}
        <div
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-400">Room 103</h4>
              <p className="text-xs text-slate-500 text-slate-400">North Wing • Suite</p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <span className="material-symbols-outlined text-[12px]">build</span>
              Maintenance
            </span>
          </div>
          <div className="space-y-3 opacity-60">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Issue</span>
              <span className="font-semibold">AC Repair</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Est. Return</span>
                <span className="font-bold text-amber-600">Today, 4PM</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full bg-amber-400"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Check Status
            </button>
          </div>
        </div>
        {/* <!-- Room Card (Occupied Full) --> */}
        <div
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold">Room 104</h4>
              <p className="text-xs text-slate-500">South Wing • Standard</p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary dark:bg-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Full
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Capacity</span>
              <span className="font-semibold">4 Guests</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Occupancy</span>
                <span className="font-bold">4 / 4</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full bg-primary"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Manage Guests
            </button>
          </div>
        </div>
        
        {/* <!-- Room Card (Occupied) --> */}
        <div
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold">Room 106</h4>
              <p className="text-xs text-slate-500">South Wing • Executive</p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary dark:bg-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              Occupied
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Capacity</span>
              <span className="font-semibold">2 Guests</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Occupancy</span>
                <span className="font-bold">2 / 2</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full bg-primary"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="w-full rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              View Details
            </button>
          </div>
        </div>
      
        {/* <!-- Room Card (Maintenance) --> */}
        <div
          className="group relative rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-400">Room 108</h4>
              <p className="text-xs text-slate-500 text-slate-400">East Tower • Standard</p>
            </div>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <span className="material-symbols-outlined text-[12px]">build</span>
              Maintenance
            </span>
          </div>
          <div className="space-y-3 opacity-60">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Issue</span>
              <span className="font-semibold">Plumbing</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Est. Return</span>
                <span className="font-bold text-amber-600">Tomorrow</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-3/4 bg-amber-400"></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Check Status
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Pagination --> */}
      <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
        <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-900 dark:text-white">1-8</span>
          of <span className="font-semibold text-slate-900 dark:text-white">120</span> rooms</p>
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">1</button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">2</button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">3</button>
          <span className="px-2 text-slate-400">...</span>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">15</button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </main>
    {/* <!-- Footer Meta --> */}
    <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-background-dark">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-medium text-slate-500">
        <div className="flex items-center gap-4">
          <span>© 2024 EventOps Pro v2.4</span>
          <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> System
            Online</span>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-primary" href="#">Help Center</a>
          <a className="hover:text-primary" href="#">API Documentation</a>
          <a className="hover:text-primary" href="#">Legal</a>
        </div>
      </div>
    </footer>
  </div>
  )
}

export default RoomInventoryManagement