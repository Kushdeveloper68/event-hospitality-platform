import React from 'react'

function MainOprationDashboard() {
  return (
    //  <!-- Wrapper -->
  <div className="flex h-screen overflow-hidden">
    {/* <!-- Sidebar (260px) --> */}
    <aside
      className="w-[260px] bg-white dark:bg-gray-900 border-r border-neutral-border dark:border-gray-800 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-border dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded">
            <span className="material-symbols-outlined text-2xl">domain</span>
          </div>
          <span className="font-bold text-lg tracking-tight">HospitalityOS</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <nav className="space-y-1 px-3">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg sidebar-active transition-colors" href="#">
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
            <span className="text-sm font-medium">Organization</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            <span className="text-sm font-medium">Events</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-[22px]">group</span>
            <span className="text-sm font-medium">Guests</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-[22px]">assessment</span>
            <span className="text-sm font-medium">Reports</span>
          </a>
        </nav>
        <div className="mt-8 px-6">
          <h4 className="text-[10px] uppercase tracking-widest text-neutral-muted font-bold mb-4">Operations</h4>
          <nav className="space-y-1">
            <a className="flex items-center gap-3 py-2 text-neutral-muted hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">room_service</span>
              <span className="text-sm font-medium">Concierge</span>
            </a>
            <a className="flex items-center gap-3 py-2 text-neutral-muted hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-[20px]">cleaning_services</span>
              <span className="text-sm font-medium">Housekeeping</span>
            </a>
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-neutral-border dark:border-gray-800">
        <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-neutral-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          href="#">
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">help</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Support Center</span>
            <span className="text-[10px] text-neutral-muted">24/7 Assistance</span>
          </div>
        </div>
      </div>
    </aside>
    {/* <!-- Main Content Area --> */}
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* <!-- Top Navbar (64px) --> */}
      <header
        className="h-16 bg-white dark:bg-gray-900 border-b border-neutral-border dark:border-gray-800 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6 flex-1 max-w-2xl">
          {/* <!-- Event Switcher --> */}
          <div className="relative group">
            <button
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined text-lg text-primary">location_on</span>
              <span>All Venues</span>
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>
          {/* <!-- Search --> */}
          <div className="relative flex-1">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted text-xl">search</span>
            <input
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Search guests, events, or tasks..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="size-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative text-neutral-muted">
            <span className="material-symbols-outlined">notifications</span>
            <span
              className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </button>
          <div className="h-8 w-px bg-neutral-border dark:bg-gray-800 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">Alex Rivera</p>
              <p className="text-[10px] text-neutral-muted mt-1 uppercase font-bold tracking-tight">Ops Manager</p>
            </div>
            <div className="size-10 rounded-full bg-primary/10 border-2 border-primary/20 bg-cover bg-center"
              data-alt="User profile avatar of Alex Rivera"
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrzC79BapJVPUukd2Z0CkygiB_q70U_y_2UAFQWvQrbFZ_cZnzwY4CxP3alR6XYcOsVtVJWLx2AhH2kJoHRMn_yhHeP6LtyaqvXWim9wIF90Vpk-ZVjsQ1UYyBv3rNstC-4j-RalmMZLNdraJbQ-2WX-UV7I7Pk7GGA9sqds4raBGbn1TRLjlPSGG3JFpbdP6KX8rQuxCNnN7_u46m83hXWZN6cjAGsYpVtp3u3qAysCzi6_0CpQPVnnvV75np8hgjzEq-bag8niqu')"}}>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Dashboard Content --> */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* <!-- Metric Cards --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {/* <!-- Card 1 --> */}
          <div
            className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-neutral-border dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2">Total Events</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">128</h3>
              <span className="text-green-600 text-xs font-bold flex items-center">+12% <span
                  className="material-symbols-outlined text-sm">trending_up</span></span>
            </div>
          </div>
          {/* <!-- Card 2 --> */}
          <div
            className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-neutral-border dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2">Active Events</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">12</h3>
              <span className="text-green-600 text-xs font-bold flex items-center">+2% <span
                  className="material-symbols-outlined text-sm">trending_up</span></span>
            </div>
          </div>
          {/* <!-- Card 3 --> */}
          <div
            className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-neutral-border dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2">Guests Today</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">1,240</h3>
              <span className="text-green-600 text-xs font-bold flex items-center">+5% <span
                  className="material-symbols-outlined text-sm">trending_up</span></span>
            </div>
          </div>
          {/* <!-- Card 4 --> */}
          <div
            className="bg-white dark:bg-gray-900 p-5 rounded-xl border-t-4 border-t-amber-500 border border-neutral-border dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2">Pending Check-ins</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">45</h3>
              <span className="text-red-500 text-xs font-bold flex items-center">-8% <span
                  className="material-symbols-outlined text-sm">trending_down</span></span>
            </div>
          </div>
          {/* <!-- Card 5 --> */}
          <div
            className="bg-white dark:bg-gray-900 p-5 rounded-xl border-t-4 border-t-primary border border-neutral-border dark:border-gray-800 shadow-sm">
            <p className="text-xs font-bold text-neutral-muted uppercase tracking-wider mb-2">Service Requests</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold">18</h3>
              <span className="text-green-600 text-xs font-bold flex items-center">+15% <span
                  className="material-symbols-outlined text-sm">trending_up</span></span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* <!-- Recent Activity (Timeline) --> */}
          <div
            className="bg-white dark:bg-gray-900 rounded-xl border border-neutral-border dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
            <div
              className="px-6 py-4 border-b border-neutral-border dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-bold text-base">Recent Activity</h2>
              <button className="text-primary text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
              <div className="space-y-6 relative">
                {/* <!-- Line --> */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-800"></div>
                {/* <!-- Activity Items --> */}
                <div className="relative pl-10">
                  <div
                    className="absolute left-2 top-0 size-4 rounded-full bg-green-500 border-4 border-white dark:border-gray-900">
                  </div>
                  <p className="text-sm font-semibold">Guest Checked In: Room 402</p>
                  <p className="text-xs text-neutral-muted mt-0.5">2 mins ago • Front Desk</p>
                </div>
                <div className="relative pl-10">
                  <div
                    className="absolute left-2 top-0 size-4 rounded-full bg-primary border-4 border-white dark:border-gray-900">
                  </div>
                  <p className="text-sm font-semibold">Housekeeping Completed</p>
                  <p className="text-xs text-neutral-muted mt-0.5">15 mins ago • Suite 12B</p>
                </div>
                <div className="relative pl-10">
                  <div
                    className="absolute left-2 top-0 size-4 rounded-full bg-amber-500 border-4 border-white dark:border-gray-900">
                  </div>
                  <p className="text-sm font-semibold">New Event Created: Tech Summit</p>
                  <p className="text-xs text-neutral-muted mt-0.5">1 hour ago • Operations</p>
                </div>
                <div className="relative pl-10">
                  <div
                    className="absolute left-2 top-0 size-4 rounded-full bg-blue-400 border-4 border-white dark:border-gray-900">
                  </div>
                  <p className="text-sm font-semibold">VIP Guest Arrival: John Doe</p>
                  <p className="text-xs text-neutral-muted mt-0.5">2 hours ago • Limousine Service</p>
                </div>
                <div className="relative pl-10">
                  <div
                    className="absolute left-2 top-0 size-4 rounded-full bg-gray-400 border-4 border-white dark:border-gray-900">
                  </div>
                  <p className="text-sm font-semibold">Inventory Alert: Linens Low</p>
                  <p className="text-xs text-neutral-muted mt-0.5">4 hours ago • Warehouse</p>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Upcoming Events Table --> */}
          <div
            className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-neutral-border dark:border-gray-800 shadow-sm flex flex-col">
            <div
              className="px-6 py-4 border-b border-neutral-border dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-bold text-base">Upcoming Events</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined text-xl">filter_list</span>
                </button>
                <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-neutral-border dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Event Name
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-neutral-muted uppercase tracking-wider text-right">
                      Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border dark:divide-gray-800">
                  {/* <!-- Row 1 --> */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">Global Tech Summit 2024</div>
                      <div className="text-xs text-neutral-muted">800 Guests Expected</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">Grand Plaza Hotel</td>
                    <td className="px-6 py-4 text-sm">Oct 12 - 14, 2024</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">IN
                        PROGRESS</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Manage</button>
                    </td>
                  </tr>
                  {/* <!-- Row 2 --> */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">Smith-Jones Wedding</div>
                      <div className="text-xs text-neutral-muted">250 Guests Expected</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">Skyline Gardens</td>
                    <td className="px-6 py-4 text-sm">Oct 16, 2024</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">CONFIRMED</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Manage</button>
                    </td>
                  </tr>
                  {/* <!-- Row 3 --> */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">Quarterly Board Meeting</div>
                      <div className="text-xs text-neutral-muted">45 Guests Expected</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">New York Plaza</td>
                    <td className="px-6 py-4 text-sm">Oct 20, 2024</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">PENDING
                        INFO</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Manage</button>
                    </td>
                  </tr>
                  {/* <!-- Row 4 --> */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm">Medical Research Expo</div>
                      <div className="text-xs text-neutral-muted">1,200 Guests Expected</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">Convention Center</td>
                    <td className="px-6 py-4 text-sm">Oct 28 - 30, 2024</td>
                    <td className="px-6 py-4">
                      <span
                        className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">COMPLETED</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="bg-gray-100 text-neutral-text text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">Archive</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              className="px-6 py-4 border-t border-neutral-border dark:border-gray-800 flex items-center justify-between text-xs text-neutral-muted font-medium">
              <span>Showing 1 to 4 of 48 events</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-neutral-border dark:border-gray-800 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled="">Previous</button>
                <button
                  className="px-3 py-1 border border-neutral-border dark:border-gray-800 rounded hover:bg-gray-50 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    {/* <!-- Floating Action Button --> */}
    <button
      className="fixed bottom-8 right-8 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group z-50">
      <span className="material-symbols-outlined text-3xl">add</span>
      <span
        className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Create
        New Event</span>
    </button>
  </div>
  )
}

export default MainOprationDashboard