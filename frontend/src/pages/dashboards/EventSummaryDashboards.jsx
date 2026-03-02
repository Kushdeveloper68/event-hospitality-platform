import React from 'react'

function EventSummaryDashboards() {
  return (
    <div className="layout-container flex h-full grow flex-col">
    {/* <!-- Top Navigation Bar --> */}
  
    {/* <!-- Main Content Area --> */}
    <main className="flex-1 overflow-y-auto px-6 lg:px-20 py-8 max-w-[1440px] mx-auto w-full">
      {/* <!-- Page Header --> */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Event Summary</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Global Tech Summit 2024 • Day 2 of 3</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            June 14, 2024
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700">
            <span className="material-symbols-outlined text-lg">add</span>
            New Task
          </button>
        </div>
      </div>
      {/* <!-- Dashboard Tabs --> */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-8">
          <a className="pb-4 border-b-2 border-primary text-primary font-bold text-sm flex items-center gap-2" href="#">
            <span className="material-symbols-outlined text-sm">dashboard</span> Overview
          </a>
          <a className="pb-4 border-b-2 border-transparent text-slate-500 font-medium text-sm flex items-center gap-2 hover:text-slate-700"
            href="#">
            <span className="material-symbols-outlined text-sm">group</span> Guest List
          </a>
          <a className="pb-4 border-b-2 border-transparent text-slate-500 font-medium text-sm flex items-center gap-2 hover:text-slate-700"
            href="#">
            <span className="material-symbols-outlined text-sm">bed</span> Room Grid
          </a>
          <a className="pb-4 border-b-2 border-transparent text-slate-500 font-medium text-sm flex items-center gap-2 hover:text-slate-700"
            href="#">
            <span className="material-symbols-outlined text-sm">local_shipping</span> Logistics
          </a>
        </div>
      </div>
      {/* <!-- Metric Scorecards --> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span
              className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+5.2%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Guests</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">1,240</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined">hotel</span>
            </div>
            <span
              className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">-2.1%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rooms Occupied</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">85%</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span
              className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">High</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Requests</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">12</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
              <span className="material-symbols-outlined">flight_land</span>
            </div>
            <span
              className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Arrivals Today</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">450</p>
        </div>
      </div>
      {/* <!-- Two Column Layout: Timeline & Activity Feed --> */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* <!-- Left Column: Today's Schedule Timeline --> */}
        <div
          className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Today's Schedule
            </h3>
            <button className="text-primary text-sm font-semibold hover:underline">View Full Timeline</button>
          </div>
          <div className="p-6 relative timeline-line">
            {/* <!-- Timeline Items --> */}
            <div className="space-y-8">
              {/* <!-- Timeline Entry 1 --> */}
              <div className="relative pl-10">
                <div
                  className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 z-10">
                  <span className="material-symbols-outlined text-[14px]">restaurant</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">VIP Breakfast Service</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Main Ballroom • 120 Guests expected</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">07:30 -
                      09:00</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span>
                  </div>
                </div>
              </div>
              {/* <!-- Timeline Entry 2 --> */}
              <div className="relative pl-10">
                <div
                  className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 z-10">
                  <span className="material-symbols-outlined text-[14px]">podium</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Opening Keynote</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Auditorium A • Full Capacity</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">09:30 -
                      11:00</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">In Progress</span>
                  </div>
                </div>
              </div>
              {/* <!-- Timeline Entry 3 --> */}
              <div className="relative pl-10">
                <div
                  className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 ring-4 ring-white dark:ring-slate-900 z-10">
                  <span className="material-symbols-outlined text-[14px]">local_cafe</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Networking Coffee Break</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Foyer 2 • Catering Team 4 assigned</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">11:00 -
                      11:30</span>
                    <span
                      className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">Upcoming</span>
                  </div>
                </div>
              </div>
              {/* <!-- Timeline Entry 4 --> */}
              <div className="relative pl-10">
                <div
                  className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 ring-4 ring-white dark:ring-slate-900 z-10">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Breakout Session Track 1</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Conference Room 302-305</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">11:45 -
                      13:00</span>
                    <span
                      className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">Upcoming</span>
                  </div>
                </div>
              </div>
              {/* <!-- Timeline Entry 5 --> */}
              <div className="relative pl-10">
                <div
                  className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 ring-4 ring-white dark:ring-slate-900 z-10">
                  <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Shuttle Departure for Gala</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Main Lobby Entrance • 5 Coaches</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">18:30 -
                      19:15</span>
                    <span
                      className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-xs text-slate-400">Showing 5 of 18 scheduled items for today</p>
          </div>
        </div>
        {/* <!-- Right Column: Recent Activity Feed --> */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div
            className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                Recent Activity
              </h3>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div className="p-0">
              {/* <!-- Activity Item 1 --> */}
              <div
                className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600 text-lg">person_add</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      <span className="font-bold">Sarah Jenkins</span> checked in
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Guest ID: #3492 • Main Reception</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">2 MINUTES AGO</p>
                  </div>
                </div>
              </div>
              {/* <!-- Activity Item 2 --> */}
              <div
                className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-orange-600 text-lg">priority_high</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      New Maintenance Request
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Room 302: AC system requires attention</p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded">Assign</button>
                      <button
                        className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-0.5 rounded">Dismiss</button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">12 MINUTES AGO</p>
                  </div>
                </div>
              </div>
              {/* <!-- Activity Item 3 --> */}
              <div
                className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Catering: Lunch Service Setup Started
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Buffet Area B • Staffing confirmed (12 pax)</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">45 MINUTES AGO</p>
                  </div>
                </div>
              </div>
              {/* <!-- Activity Item 4 --> */}
              <div
                className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex gap-4">
                  <div
                    className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600">
                    <span className="material-symbols-outlined text-lg">rate_review</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Internal Log: Late Checkout Approved
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Room 104: VIP Guest requested 2PM exit</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">1 HOUR AGO</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="w-full py-4 text-sm font-bold text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              Load More Activity
            </button>
          </div>
          {/* <!-- Operational Pulse Micro-Card --> */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-xl">
            <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">bolt</span> Operational Pulse
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Operations are running at <span className="text-primary font-bold">Optimal Speed</span>.
              Turnover rate for rooms is 14% faster than yesterday.
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{width: "88%"}}></div>
            </div>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Footer / Simple Stats Row --> */}
    <footer
      className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-6 text-slate-500 text-sm">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <p>© 2024 EventOps Pro SaaS</p>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#">System Status</a>
            <a className="hover:text-primary transition-colors" href="#">Support Portal</a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 bg-emerald-500 rounded-full"></span>
          <p>All operational systems are normal</p>
        </div>
      </div>
    </footer>
  </div>
  )
}

export default EventSummaryDashboards