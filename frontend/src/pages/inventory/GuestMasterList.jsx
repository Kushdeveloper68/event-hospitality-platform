import React from 'react'

function GuestMasterList() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Top Navigation Bar --> */}
      
      <main className="flex flex-1 justify-center py-6">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 px-4">
          {/* <!-- Breadcrumbs --> */}
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-6">
            <a className="hover:text-primary flex items-center gap-1" href="#"><span
                className="material-symbols-outlined text-sm">home</span> Home</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <a className="hover:text-primary" href="#">Global Tech Summit 2024</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 font-bold">Guest Master List</span>
          </div>
          {/* <!-- Page Title & Quick Stats --> */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Guest Master List</h1>
            <p className="text-slate-500 text-sm">Manage arrivals, room assignments and VIP status for attendees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-border-light shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Guests</p>
                <span className="material-symbols-outlined text-slate-400">groups</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-900 text-2xl font-bold">1,240</p>
                <p className="text-success text-xs font-bold bg-success/10 px-1.5 py-0.5 rounded">+12%</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-border-light shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Checked-in</p>
                <span className="material-symbols-outlined text-slate-400">check_circle</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-900 text-2xl font-bold">856</p>
                <p className="text-success text-xs font-bold bg-success/10 px-1.5 py-0.5 rounded">69%</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-border-light shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Remaining</p>
                <span className="material-symbols-outlined text-slate-400">pending</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-900 text-2xl font-bold">384</p>
                <p className="text-danger text-xs font-bold bg-danger/10 px-1.5 py-0.5 rounded">-2%</p>
              </div>
            </div>
          </div>
          {/* <!-- Toolbar / Filters --> */}
          <div
            className="flex flex-col md:flex-row gap-3 p-4 bg-white border border-border-light rounded-t-xl items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  className="w-full bg-neutral-light border-none rounded-lg h-9 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
                  placeholder="Search guests or rooms..." type="text" />
              </div>
              <div className="h-6 w-px bg-border-light hidden md:block"></div>
              <button
                className="flex h-9 items-center gap-2 rounded-lg bg-neutral-light px-3 text-slate-700 text-sm font-medium hover:bg-slate-200">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                <span>All Guests</span>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button
                className="flex h-9 items-center gap-2 rounded-lg bg-neutral-light px-3 text-slate-700 text-sm font-medium hover:bg-slate-200">
                <span className="material-symbols-outlined text-lg">star</span>
                <span>VIP Status</span>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
              <button
                className="flex h-9 items-center gap-2 rounded-lg bg-neutral-light px-3 text-slate-700 text-sm font-medium hover:bg-slate-200">
                <span className="material-symbols-outlined text-lg">info</span>
                <span>Status</span>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Showing 1-10 of 1,240</span>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-900 font-bold">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          {/* <!-- High Density Data Table --> */}
          <div className="bg-white border-x border-b border-border-light rounded-b-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-y border-border-light">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Room #
                    </th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Arrival</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Departure</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {/* <!-- Row 1 --> */}
                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-blue-100 text-primary font-bold rounded-full size-8 flex items-center justify-center text-xs">
                          JD</div>
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                            John Doe
                            <span className="material-symbols-outlined text-warning text-sm fill-1"
                              title="VIP Guest">star</span>
                          </div>
                          <div className="text-xs text-slate-400">john.doe@enterprise.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">+1 555-0101</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success ring-1 ring-inset ring-success/20">
                        Checked-in
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">402</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 24, 14:00</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 27, 11:00</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 2 --> */}
                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-pink-100 text-pink-600 font-bold rounded-full size-8 flex items-center justify-center text-xs">
                          JS</div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">Jane Smith</div>
                          <div className="text-xs text-slate-400">jane.s@consultancy.org</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">+1 555-0102</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning ring-1 ring-inset ring-warning/20">
                        Arriving
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">305</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 24, 15:30</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 28, 10:00</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 3 --> */}
                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-slate-100 text-slate-500 font-bold rounded-full size-8 flex items-center justify-center text-xs">
                          RB</div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">Robert Brown</div>
                          <div className="text-xs text-slate-400">rbrown@techsolutions.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">+1 555-0103</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-danger/10 text-danger ring-1 ring-inset ring-danger/20">
                        No Show
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 text-center">N/A</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 23, 12:00</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 25, 11:00</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 4 --> */}
                  <tr className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-purple-100 text-purple-600 font-bold rounded-full size-8 flex items-center justify-center text-xs">
                          AW</div>
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                            Alice White
                            <span className="material-symbols-outlined text-warning text-sm fill-1"
                              title="VIP Guest">star</span>
                          </div>
                          <div className="text-xs text-slate-400">awhite@globalmedia.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">+1 555-0104</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success ring-1 ring-inset ring-success/20">
                        Checked-in
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">501</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 24, 10:00</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 30, 11:00</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* <!-- Row 5 --> */}
                  <tr className="hover:bg-slate-50/80 transition-colors group border-b-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-indigo-100 text-indigo-600 font-bold rounded-full size-8 flex items-center justify-center text-xs">
                          MS</div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">Michael Scott</div>
                          <div className="text-xs text-slate-400">m.scott@dundermifflin.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">+1 555-0105</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning ring-1 ring-inset ring-warning/20">
                        Arriving
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center font-medium">202</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 24, 18:00</td>
                    <td className="px-6 py-4 text-sm text-slate-600">Oct 26, 11:00</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-lg">more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* <!-- Footer / Pagination --> */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50">
                <span className="material-symbols-outlined text-sm">download</span> Export CSV
              </button>
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50">
                <span className="material-symbols-outlined text-sm">print</span> Print List
              </button>
            </div>
            <nav className="flex items-center gap-1">
              <button
                className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-border-light rounded hover:bg-slate-50 disabled:opacity-50"
                disabled="">Previous</button>
              <button className="px-3 py-1 text-sm font-bold text-white bg-primary border border-primary rounded">1</button>
              <button
                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50">2</button>
              <button
                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50">3</button>
              <span className="px-2 text-slate-400">...</span>
              <button
                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50">124</button>
              <button
                className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-border-light rounded hover:bg-slate-50">Next</button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  </div>
  )
}

export default GuestMasterList