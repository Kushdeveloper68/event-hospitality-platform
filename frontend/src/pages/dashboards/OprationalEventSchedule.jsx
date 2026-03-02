import React from 'react'

function OprationalEventSchedule() {
  return (
     <div className="relative flex h-screen flex-col overflow-hidden">
    {/* <!-- Top Navigation Bar --> */}
   
    {/* <!-- Sub-header: Controls & Date Selection --> */}
    <div className="flex flex-col border-b border-slate-200 bg-white shrink-0">
      <div className="flex items-center justify-between px-6 py-2">
        <nav className="flex items-center gap-1 text-xs text-slate-500">
          <a className="hover:text-primary" href="#">Global Events</a>
          <span className="material-symbols-outlined !text-sm">chevron_right</span>
          <span className="font-medium text-slate-900">Operational Event Schedule</span>
        </nav>
        <div className="flex items-center gap-2">
          <button
            className="flex size-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
            <span className="material-symbols-outlined !text-lg">zoom_in</span>
          </button>
          <button
            className="flex size-8 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
            <span className="material-symbols-outlined !text-lg">zoom_out</span>
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <button
            className="flex h-8 items-center gap-2 rounded border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
            <span className="material-symbols-outlined !text-lg text-primary">filter_list</span>
            <span>Filter</span>
          </button>
        </div>
      </div>
      <div className="flex px-6">
        <button
          className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-600">Oct
          12, Mon</button>
        <button className="border-b-2 border-primary px-4 py-3 text-sm font-bold text-primary">Oct 13, Tue</button>
        <button
          className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-600">Oct
          14, Wed</button>
        <button
          className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-600">Oct
          15, Thu</button>
        <button
          className="border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-600">Oct
          16, Fri</button>
      </div>
    </div>
    {/* <!-- Main Schedule Interface --> */}
    <main className="flex flex-1 overflow-hidden bg-white">
      {/* <!-- Sticky Sidebar: Workstreams --> */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50/50">
        <div
          className="flex h-12 items-center border-b border-slate-200 px-4 bg-white font-semibold text-slate-900 text-sm">
          Workstreams
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          <div className="flex flex-col p-4 bg-white border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activities</h3>
          </div>
          <div className="group flex h-24 items-center gap-3 px-4 transition-colors hover:bg-slate-100/50">
            <div className="flex size-8 items-center justify-center rounded bg-blue-100 text-blue-600">
              <span className="material-symbols-outlined !text-xl">show_chart</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Main Sessions</p>
              <p className="text-[11px] text-slate-500">Ballroom A &amp; B</p>
            </div>
          </div>
          <div className="group flex h-24 items-center gap-3 px-4 transition-colors hover:bg-slate-100/50">
            <div className="flex size-8 items-center justify-center rounded bg-amber-100 text-amber-600">
              <span className="material-symbols-outlined !text-xl">local_shipping</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Transport</p>
              <p className="text-[11px] text-slate-500">Shuttle &amp; VIP Fleet</p>
            </div>
          </div>
          <div className="group flex h-24 items-center gap-3 px-4 transition-colors hover:bg-slate-100/50">
            <div className="flex size-8 items-center justify-center rounded bg-emerald-100 text-emerald-600">
              <span className="material-symbols-outlined !text-xl">restaurant</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Catering</p>
              <p className="text-[11px] text-slate-500">Main Hall &amp; Staff</p>
            </div>
          </div>
          <div className="group flex h-24 items-center gap-3 px-4 transition-colors hover:bg-slate-100/50">
            <div className="flex size-8 items-center justify-center rounded bg-purple-100 text-purple-600">
              <span className="material-symbols-outlined !text-xl">groups</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Staffing</p>
              <p className="text-[11px] text-slate-500">Check-in &amp; Support</p>
            </div>
          </div>
          <div className="group flex h-24 items-center gap-3 px-4 transition-colors hover:bg-slate-100/50">
            <div className="flex size-8 items-center justify-center rounded bg-rose-100 text-rose-600">
              <span className="material-symbols-outlined !text-xl">videocam</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Media/AV</p>
              <p className="text-[11px] text-slate-500">Press &amp; Recording</p>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Timeline Scroll Area --> */}
      <div className="relative flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar">
        {/* <!-- Timeline Header (Time Markers) --> */}
        <div className="sticky top-0 z-20 flex h-12 w-[2400px] border-b border-slate-200 bg-white">
          {/* <!-- 08:00 to 18:00 (each 100px wide) --> */}
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            08:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            09:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            10:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            11:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            12:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            13:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            14:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            15:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            16:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            17:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            18:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            19:00</div>
          <div
            className="flex h-full w-[100px] items-center justify-center border-r border-slate-100 text-[11px] font-bold text-slate-400">
            20:00</div>
        </div>
        {/* <!-- Current Time Indicator --> */}
        <div className="absolute left-[340px] top-0 z-10 h-full w-[2px] bg-primary">
          <div className="absolute -left-[5px] top-11 size-3 rounded-full border-2 border-white bg-primary"></div>
        </div>
        {/* <!-- Timeline Rows --> */}
        <div className="relative w-[2400px] timeline-grid min-h-full">
          {/* <!-- Row 1: Sessions --> */}
          <div className="group relative h-24 border-b border-slate-100 hover:bg-slate-50/30">
            {/* <!-- Activity Block 1 --> */}
            <div
              className="absolute left-[100px] top-3 flex h-[72px] w-[250px] cursor-pointer flex-col rounded-lg border-l-4 border-l-primary bg-primary/10 p-3 shadow-sm hover:ring-2 hover:ring-primary/20">
              <div className="flex items-start justify-between">
                <h4 className="truncate text-xs font-bold text-primary">Opening Keynote</h4>
                <span className="text-[10px] font-bold text-primary/60">09:00 - 11:30</span>
              </div>
              <p className="mt-1 text-[10px] text-primary/80">Speaker: Sarah Jenkins</p>
              <div className="mt-auto flex items-center gap-1">
                <span
                  className="flex size-4 items-center justify-center rounded-full bg-primary text-white text-[8px] font-bold">1k</span>
                <span className="text-[9px] font-medium text-primary/70">Attendees</span>
              </div>
            </div>
            {/* <!-- Activity Block 2 --> */}
            <div
              className="absolute left-[500px] top-3 flex h-[72px] w-[180px] cursor-pointer flex-col rounded-lg border-l-4 border-l-primary bg-primary/10 p-3 shadow-sm hover:ring-2 hover:ring-primary/20">
              <div className="flex items-start justify-between">
                <h4 className="truncate text-xs font-bold text-primary">Industry Panel</h4>
                <span className="text-[10px] font-bold text-primary/60">13:00 - 14:45</span>
              </div>
              <p className="mt-1 text-[10px] text-primary/80">Track: Innovation</p>
            </div>
          </div>
          {/* <!-- Row 2: Transport --> */}
          <div className="group relative h-24 border-b border-slate-100 hover:bg-slate-50/30">
            {/* <!-- Transport Block 1 --> */}
            <div
              className="absolute left-[50px] top-3 flex h-[72px] w-[100px] cursor-pointer flex-col rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3 shadow-sm hover:ring-2 hover:ring-amber-200">
              <h4 className="truncate text-[11px] font-bold text-amber-800">Shuttle A1</h4>
              <span className="text-[9px] font-bold text-amber-600">08:30 - 09:30</span>
              <div className="mt-auto flex items-center gap-1">
                <span className="material-symbols-outlined !text-[14px] text-amber-500">check_circle</span>
                <span className="text-[9px] font-semibold text-amber-700">Dep.</span>
              </div>
            </div>
            {/* <!-- Transport Block 2 (Collision warning color) --> */}
            <div
              className="absolute left-[350px] top-3 flex h-[72px] w-[150px] cursor-pointer flex-col rounded-lg border-l-4 border-l-amber-500 bg-amber-50 p-3 shadow-sm hover:ring-2 hover:ring-amber-200">
              <h4 className="truncate text-[11px] font-bold text-amber-800">VIP Fleet Transfer</h4>
              <span className="text-[9px] font-bold text-amber-600">11:30 - 13:00</span>
            </div>
          </div>
          {/* <!-- Row 3: Catering --> */}
          <div className="group relative h-24 border-b border-slate-100 hover:bg-slate-50/30">
            {/* <!-- Catering Block 1 --> */}
            <div
              className="absolute left-[400px] top-3 flex h-[72px] w-[150px] cursor-pointer flex-col rounded-lg border-l-4 border-l-emerald-500 bg-emerald-50 p-3 shadow-sm hover:ring-2 hover:ring-emerald-200">
              <h4 className="truncate text-[11px] font-bold text-emerald-800">Networking Lunch</h4>
              <span className="text-[9px] font-bold text-emerald-600">12:00 - 13:30</span>
              <div className="mt-auto">
                <span className="rounded bg-emerald-100 px-1 py-0.5 text-[8px] font-bold text-emerald-700">CONFIRMED</span>
              </div>
            </div>
          </div>
          {/* <!-- Row 4: Staffing --> */}
          <div className="group relative h-24 border-b border-slate-100 hover:bg-slate-50/30">
            <div
              className="absolute left-[0px] top-3 flex h-[72px] w-[350px] cursor-pointer flex-col rounded-lg border-l-4 border-l-purple-500 bg-purple-50 p-3 shadow-sm hover:ring-2 hover:ring-purple-200">
              <h4 className="truncate text-[11px] font-bold text-purple-800">Registration Desk Shift A</h4>
              <span className="text-[9px] font-bold text-purple-600">08:00 - 11:30</span>
              <p className="mt-1 text-[9px] text-purple-700">12 Personnel Assigned</p>
            </div>
          </div>
          {/* <!-- Empty State Rows --> */}
          <div className="group relative h-24 border-b border-slate-100 hover:bg-slate-50/30 flex items-center">
            <div
              className="opacity-0 group-hover:opacity-100 flex items-center gap-2 pl-[380px] transition-opacity cursor-pointer">
              <div className="flex size-5 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                <span className="material-symbols-outlined !text-xs">add</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Click to add media coverage</span>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Activity Detail Sidebar (Slide-out) --> */}
      <div className="w-80 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Activity Details</h3>
          <button className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Activity</div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Opening Keynote: Future of SaaS Logistics</h2>
            <p className="text-xs text-primary font-medium mt-1">Main Sessions • Confirmed</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 !text-xl">schedule</span>
              <div>
                <p className="text-xs font-bold text-slate-900">Tuesday, Oct 13</p>
                <p className="text-xs text-slate-500">09:00 AM - 11:30 AM (2h 30m)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 !text-xl">location_on</span>
              <div>
                <p className="text-xs font-bold text-slate-900">Main Ballroom A</p>
                <p className="text-xs text-slate-500">Level 2, Convention Wing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 !text-xl">person</span>
              <div>
                <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-xs text-slate-500">Lead Ops Director, Global Tech</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-3">Resources &amp; Assets</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded bg-slate-50 p-2">
                <span className="text-[11px] font-medium text-slate-600">AV System Check</span>
                <span className="material-symbols-outlined text-emerald-500 !text-lg">check_circle</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-50 p-2">
                <span className="text-[11px] font-medium text-slate-600">Water Station</span>
                <span className="material-symbols-outlined text-emerald-500 !text-lg">check_circle</span>
              </div>
              <div className="flex items-center justify-between rounded bg-slate-50 p-2">
                <span className="text-[11px] font-medium text-slate-600">Attendee Badges</span>
                <span className="material-symbols-outlined text-amber-500 !text-lg">warning</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-2">
            <button
              className="flex-1 rounded border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Edit</button>
            <button
              className="flex-1 rounded border border-primary/20 bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary/20">Duplicate</button>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Zoom Controls Floating Button (Mobile friendly fallback) --> */}
    <div
      className="fixed bottom-6 right-86 z-50 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-xl border border-slate-200">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mr-2">Zoom</span>
      <button className="flex size-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
        <span className="material-symbols-outlined !text-xl">remove</span>
      </button>
      <div className="h-4 w-px bg-slate-200 mx-1"></div>
      <button className="flex size-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
        <span className="material-symbols-outlined !text-xl">add</span>
      </button>
    </div>
  </div>
  )
}

export default OprationalEventSchedule