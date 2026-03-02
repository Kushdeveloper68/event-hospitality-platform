import React from 'react'

function ServiceRequestLogs() {
  return (
    <div
    className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Header Section --> */}
     
      <div className="flex flex-1 overflow-hidden">
        {/* <!-- Sidebar --> */}
        
        {/* <!-- Main Content Area --> */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          {/* <!-- Page Title & Primary Actions --> */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-6 lg:p-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Service
                Request Logs</h1>
              <p className="text-[#616e89] text-base font-normal leading-normal">Manage and monitor guest hospitality
                requests in real-time.</p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbdee6] rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                Export CSV
              </button>
              <button
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg">add</span>
                Create Request
              </button>
            </div>
          </div>
          {/* <!-- Filters & Search --> */}
          <div className="px-6 lg:px-8 pb-6">
            <div
              className="bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-[#2d3748] rounded-xl p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89]">search</span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-[#f0f1f4] border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Search by guest name, room, or ID..." type="text" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="bg-[#f0f1f4] border-none rounded-lg text-sm font-medium px-4 py-2 focus:ring-2 focus:ring-primary">
                  <option>All Types</option>
                  <option>Room Service</option>
                  <option>Maintenance</option>
                  <option>Housekeeping</option>
                  <option>Concierge</option>
                </select>
                <select
                  className="bg-[#f0f1f4] border-none rounded-lg text-sm font-medium px-4 py-2 focus:ring-2 focus:ring-primary">
                  <option>Any Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <button className="p-2 text-[#616e89] hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>
          </div>
          {/* <!-- Data Table Container --> */}
          <div className="px-6 lg:px-8 pb-10 flex-1">
            <div
              className="bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-[#2d3748] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-[#e5e7eb] dark:border-[#2d3748]">
                    <th className="px-6 py-4 text-xs font-bold text-[#616e89] uppercase tracking-wider">Guest Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#616e89] uppercase tracking-wider">Request Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#616e89] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#616e89] uppercase tracking-wider">Assigned Staff</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#616e89] uppercase tracking-wider">Created Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#616e89] uppercase tracking-wider text-right">Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {/* <!-- Row 1 --> */}
                  <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#111318] dark:text-white">Jonathan Harker</span>
                        <span className="text-xs text-[#616e89]">Room 402 • ID #SR-1209</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">restaurant</span>
                        <span className="text-sm font-medium">Room Service</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#111318] dark:text-gray-300">
                      Unassigned
                    </td>
                    <td className="px-6 py-4 text-sm text-[#616e89]">
                      3 mins ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#616e89] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 2 --> */}
                  <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#111318] dark:text-white">Sarah Jenkins</span>
                        <span className="text-xs text-[#616e89]">Suite 12 • ID #SR-1208</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">build</span>
                        <span className="text-sm font-medium">Maintenance</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-primary border border-blue-200">
                        In Progress
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold"
                          data-alt="Staff member avatar small">MW</div>
                        <span className="text-sm text-[#111318] dark:text-gray-300">Marcus Wright</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#616e89]">
                      12 mins ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#616e89] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 3 --> */}
                  <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#111318] dark:text-white">Robert Chen</span>
                        <span className="text-xs text-[#616e89]">Room 215 • ID #SR-1205</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">clean_hands</span>
                        <span className="text-sm font-medium">Housekeeping</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Resolved
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold"
                          data-alt="Staff member avatar small">EL</div>
                        <span className="text-sm text-[#111318] dark:text-gray-300">Elena Lopez</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#616e89]">
                      45 mins ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#616e89] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 4 --> */}
                  <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#111318] dark:text-white">Lisa Ray</span>
                        <span className="text-xs text-[#616e89]">Penthouse B • ID #SR-1204</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">concierge</span>
                        <span className="text-sm font-medium">Concierge</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Resolved
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold"
                          data-alt="Staff member avatar small">TS</div>
                        <span className="text-sm text-[#111318] dark:text-gray-300">Thomas Shelby</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#616e89]">
                      1 hour ago
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#616e89] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* <!-- Pagination Footer --> */}
              <div
                className="px-6 py-4 border-t border-[#e5e7eb] dark:border-[#2d3748] flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/20">
                <span className="text-sm text-[#616e89]">Showing 1 to 4 of 128 requests</span>
                <div className="flex items-center gap-1">
                  <button
                    className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-40"
                    disabled="">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">1</button>
                  <button
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-white text-sm font-medium">2</button>
                  <button
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-white text-sm font-medium">3</button>
                  <span className="px-2 text-[#616e89]">...</span>
                  <button
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-white text-sm font-medium">32</button>
                  <button className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  )
}

export default ServiceRequestLogs