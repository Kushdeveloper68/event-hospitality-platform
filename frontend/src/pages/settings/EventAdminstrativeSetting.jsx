import React from 'react'

function EventAdminstrativeSetting() {
  return (
    <>
    {/* <!-- Top Navigation Bar --> */}
  <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <span className="material-symbols-outlined block text-2xl">event_seat</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">EventOps Pro</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              href="#">Dashboard</a>
            <a className="text-sm font-semibold text-primary" href="#">Events</a>
            <a className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              href="#">Venues</a>
            <a className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
              href="#">Staff</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50"
              placeholder="Search events..." type="text" />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div
            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
            <img className="h-full w-full object-cover" data-alt="User avatar of the administrator"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIE-V8YABoIllQKQ_XUKpW5i528G-D2qX2uGujUwkajbXFhYsmr7iH33Dj5FuKDiVdvGizFlYS51v0WIX1S6rHkvtlCCdEWQ4NMUooTa5Pqd9nmUtQFNjxJH3_BMJ9YrQFesFR_vtOgyomLQH5I35A6cAAKJgA1Shqrqrhu2oSeu13LG_Sd76V3CK5jVjrPA4hTNfBGXo0M4r8QWDn0dYcdL5yzLi1IuJRoegD2WhEJja9gJ6Y0kTw2nQbg8ngYljt5dgryCjPdr0S" />
          </div>
        </div>
      </div>
    </div>
  </header>
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* <!-- Page Title and Header Actions --> */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <a className="hover:text-primary" href="#">Events</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-300 font-medium">Global Tech Summit 2024</span>
        </nav>
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Event Administrative Settings</h2>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">ACTIVE</span>
        </div>
        <p className="mt-1 text-slate-500 text-sm">ID: EVENT-2024-001 • Created by Admin on Oct 12, 2023</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
          <span className="material-symbols-outlined text-lg">history</span>
          Audit Log
        </button>
        <button
          className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all">
          <span className="material-symbols-outlined text-lg">save</span>
          Save Changes
        </button>
      </div>
    </div>
    {/* <!-- Tabbed Interface --> */}
    <div
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 px-6">
        <nav aria-label="Tabs" className="flex gap-8">
          <a className="border-b-2 border-primary text-primary py-4 text-sm font-bold flex items-center gap-2" href="#">
            <span className="material-symbols-outlined text-lg">info</span>
            General Info
          </a>
          <a className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-4 text-sm font-semibold flex items-center gap-2 transition-all"
            href="#">
            <span className="material-symbols-outlined text-lg">lock_person</span>
            Permissions
          </a>
          <a className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-4 text-sm font-semibold flex items-center gap-2 transition-all"
            href="#">
            <span className="material-symbols-outlined text-lg">report_problem</span>
            Danger Zone
          </a>
        </nav>
      </div>
      <div className="p-8">
        {/* <!-- General Information Section --> */}
        <div className="space-y-8 max-w-4xl">
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Core Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Event Name</label>
                <input
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  type="text" value="Global Tech Summit 2024" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">URL Slug</label>
                <div className="flex">
                  <span
                    className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm">events.io/</span>
                  <input
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    type="text" value="tech-summit-24" />
                </div>
              </div>
              <div className="col-span-full space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  rows="3">An industry-leading conference focusing on the future of AI, cloud computing, and cybersecurity infrastructure.</textarea>
              </div>
            </div>
          </section>
          <hr className="border-slate-100 dark:border-slate-800" />
          <section>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Date &amp; Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Date Range</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">calendar_today</span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    type="text" value="Nov 15 - Nov 18, 2024" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Timezone</label>
                <select
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                  <option>Pacific Standard Time (PST)</option>
                  <option>Eastern Standard Time (EST)</option>
                  <option>Greenwich Mean Time (GMT)</option>
                </select>
              </div>
              <div className="col-span-full space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Venue / Map
                  Location</label>
                <div
                  className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-2">
                  <div className="absolute inset-0 bg-slate-200 animate-pulse"
                    data-alt="Map showing the San Francisco Moscone Center location" data-location="San Francisco"
                    style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDl678wmOMaTZomL1uu_c8iI77_9EtmoarI7IfMXn6OF7Gv4bVHyIHZ6AR3Z_0CrwtTIqZ5PIFg4eZfYsulhN_w5m2iYAh9hX7Ety8nwgT0EMQCXf095SSIurJvNWbJts46Ef5y5UBtFGNoJamYEre4jH7WlB2SSaSLCMeHaVsWp_OdGcbrUyWfjltaliuTc7eIPXCPMtjPbX_HZ58kp3_jNm6E8v7mX1Ahj12cp4Uob6bV1ZJNOa-uQilJ-d7ONRmWpm-ykDv_iwy')", backgroundSize: "cover", backgroundPosition: "center"}}>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div
                      className="bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <span className="text-sm font-bold">Moscone Center, San Francisco</span>
                    </div>
                  </div>
                </div>
                <input
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  type="text" value="747 Howard St, San Francisco, CA 94103" />
              </div>
            </div>
          </section>
          <hr className="border-slate-100 dark:border-slate-800" />
          {/* <!-- Permissions Section (Preview of the content if selected) --> */}
          <section className="opacity-50 pointer-events-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Permissions Matrix</h3>
              <span
                className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase tracking-wider">Tabbed
                View Required</span>
            </div>
            <div
              className="border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 p-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                  <div>
                    <p className="text-sm font-bold">Admin Team</p>
                    <p className="text-xs text-slate-500">Full access to all settings</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">check_circle</span>
              </div>
            </div>
          </section>
          <hr className="border-slate-100 dark:border-slate-800" />
          {/* <!-- Danger Zone Section --> */}
          <section>
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <span className="material-symbols-outlined">warning</span>
              <h3 className="text-lg font-bold">Danger Zone</h3>
            </div>
            <div className="border-2 border-red-100 dark:border-red-900/30 rounded-xl bg-red-50/30 dark:bg-red-900/10 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Delete this event</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Once you delete an event, there is no going
                    back. All registrations, data, and configuration will be permanently wiped.</p>
                </div>
                <button
                  className="shrink-0 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-red-200 dark:shadow-none">
                  Delete Event
                </button>
              </div>
              <div
                className="mt-6 pt-6 border-t border-red-100 dark:border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Archive Event</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Mark the event as finished. This hides it
                    from active dashboards but keeps the data for reporting.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input className="sr-only peer" type="checkbox" value="" />
                  <div
                    className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                  </div>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    {/* <!-- Footer Help Section --> */}
    <div className="mt-12 flex flex-col items-center justify-center text-center">
      <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
        <span className="material-symbols-outlined block">help_outline</span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white">Need help configuring this event?</h4>
      <p className="text-slate-500 text-sm mt-1 max-w-md">Our operations support team is available 24/7 to help you set up
        complex hospitality workflows.</p>
      <div className="flex gap-4 mt-6">
        <a className="text-sm font-bold text-primary hover:underline" href="#">Read Documentation</a>
        <span className="text-slate-300">•</span>
        <a className="text-sm font-bold text-primary hover:underline" href="#">Contact Support</a>
      </div>
    </div>
  </main></>
  )
}

export default EventAdminstrativeSetting