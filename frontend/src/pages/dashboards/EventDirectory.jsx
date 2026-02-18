import React from 'react'

function EventDirectory() {
  return (
    <div className="relative flex h-auto min-screen w-full flex-col group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Top Navigation Bar --> */}
      <header
        className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-10 py-3">
        <div className="flex items-center gap-4 text-gray-900 dark:text-white">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">event_seat</span>
          </div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">EventOps</h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <a className="text-gray-900 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Dashboard</a>
            <a className="text-primary text-sm font-bold leading-normal" href="#">Events</a>
            <a className="text-gray-900 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Analytics</a>
            <a className="text-gray-900 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Settings</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-gray-200"
              data-alt="User profile avatar of a professional manager"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC65BqNzW-IiP8UY7kKjvdW_YD7btUTEnHxrOWjnb4r8vBDisckPW4sj7CVXMpAqqSKyXaQBSkmA16G-M5K30SBdKkT1mjgTHYTP54bSHqAuiIsodBPHe35aITIwo3JmP1LTR4C8Dr8PnKBfPPOtwHIa8kldFgwhcjaiVTDmDG--jMVDhZZw-BJteEzlJKmFJDxoeem6a9odi4EVQIcT31g8JMCTHHXH8Uc5fLc4DZxC86CK7Nx2YqS54QQpoZVIM_c0MvTtES_Jbga")'}}>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col flex-1 px-4 md:px-10 lg:px-20 xl:px-40 py-8">
        {/* <!-- Breadcrumbs --> */}
        <nav className="flex items-center gap-2 mb-6">
          <a className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-primary flex items-center gap-1"
            href="#">
            <span className="material-symbols-outlined text-sm">home</span>
            Dashboard
          </a>
          <span className="text-gray-400 text-sm font-medium">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </span>
          <span className="text-gray-900 dark:text-white text-sm font-semibold">Events</span>
        </nav>
        {/* <!-- Page Header --> */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Events Directory
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">Track and manage high-level hospitality operations
              across all venues.</p>
          </div>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Create Event</span>
          </button>
        </div>
        {/* <!-- Search and Filters Section --> */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                placeholder="Search events by name, venue, or host..." type="text" />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-gray-700 dark:text-gray-300">
              <span className="material-symbols-outlined">tune</span>
              <span>Filters</span>
            </button>
          </div>
          <div className="flex border-b border-gray-200 dark:border-gray-800 gap-8">
            <a className="border-b-2 border-primary text-primary pb-3 font-bold text-sm" href="#">All Events</a>
            <a className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 pb-3 font-semibold text-sm transition-colors"
              href="#">Live Now</a>
            <a className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 pb-3 font-semibold text-sm transition-colors"
              href="#">Upcoming</a>
            <a className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 pb-3 font-semibold text-sm transition-colors"
              href="#">Completed</a>
          </div>
        </div>
        {/* <!-- Events Grid --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <!-- Event Card 1: Live --> */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-40 bg-gray-100 relative" data-alt="Conference hall with blue lighting and big screen"
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAy4xdeAOieGc9u5EguFyG1CzEE3sk7e5iTnwgHdNz3vjxl3WHf7IAmcW7Bf-ogr3_Be0fYJ846Y5lVW06OHJWRpShM8lhFg87Ggkpu5PQFErTzmi4lN8P5azpJ42-po4gBQ-ZegHx_Vx7A8IgQZNSkmXUZg2s_DGZr57vVt4y1gKioopVYaHd3U5k_5ChB1XMMgNq_C3lJ-ilRppv0z2-z92jSYHKNqjujJsgwDQVFYfzDVqUN6AWHN4m7pf46IvoeTu2PsFjonB2F')",backgroundSize: "cover"}}>
              <div className="absolute top-3 right-3">
                <span
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Global Tech Summit 2024</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>Moscone Center, San Francisco</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>Oct 12 - Oct 14, 2024</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div
                    className="size-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden"
                    data-alt="Attendee avatar"
                    style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKMQB_8Vu37uDzrwqMrG2xZFTkmExehPiP0auiseRjlaZzqd0b6XbOeOlolREUIdo3i0IEC0DolUC1ybHJAq4a9z-C8egLSgVeJG8T2MnCRbOUf1EaDNM5slq36LGzAGpufA1eM2qrJ4DQK6oZUEFUn_Jo8JKiFwDSJYEQwlaICfHpwv5-2Yd3lLSC0o9Ipx0Y5e8I79w5Ps2dGHIZxRn93voA-wJgcJsx0ajidPZKPF7DiKKgcHgKbtETwZPJ_e1ddGaaYiFbL1g1')", backgroundSize: "cover"}}>
                  </div>
                  <div
                    className="size-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 overflow-hidden"
                    data-alt="Attendee avatar"
                    style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCT3pPc4vCGMHVjjAcAGSkkzWiBraNfL0lxCvjJoWmRXZLRa_ZmCnGT-SIE-29KMXecyG1e3jt3LTglxPGWeEhKbEfA-ruE88IBYDHj7P5WttTPXPo5KLhPM0bSpDorx1gVEM8FC3t_dVlKZxW4ESTQGUXUnIXrC83ANaSLXIxqWXgr-0cvYb1_JtKkfnHZRuq4qYVvxVqAkmy9tUEPFlxYGHyGhG0mN6nPAuh_1b9olZafe2f3fJL2HTLtUHoOm0tTsKaUOcWPbeBS')",backgroundSize: "cover"}}>
                  </div>
                  <div
                    className="size-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    +12</div>
                </div>
                <button className="text-primary font-bold text-sm hover:underline">Manage</button>
              </div>
            </div>
          </div>
          {/* <!-- Event Card 2: Upcoming --> */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-40 bg-gray-100 relative" data-alt="Modern office event space with cocktail tables"
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA8Cvz47VvTsBrhc62tEjgWiPFIqqvmm-AotECLligdIdmHFBKLXHuw7ZFHNGnrpjXIiC_1TG_Ym_T_99EHSsldOun8D4yeAYkrmYu96Hgf3VfvwyaHBg1pweXeFIGJrIWPQPadkO_oV42dD7Epb4Y-KK3HhEYEIv2wMDlCNU9xBqGJOu_eoV5oorXiNWRwPzRuc4Cf255L9HB8zG5LeTHS4eRdG-lUe7Fwo_seIAHMSvrEaqOHSHCjDPKRdb1hhbX273stSvwJFKCd')", backgroundSize: "cover"}}>
              <div className="absolute top-3 right-3">
                <span
                  className="bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>
              </div>
            </div>
            <div className="p-6">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Executive Leadership Retreat</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>The Ritz-Carlton, Maui</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>Nov 05 - Nov 08, 2024</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">Planning stage</span>
                  <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[65%]"></div>
                  </div>
                </div>
                <button className="text-primary font-bold text-sm hover:underline">Manage</button>
              </div>
            </div>
          </div>
          {/* <!-- Event Card 3: Completed --> */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-40 bg-gray-100 relative grayscale opacity-80"
              data-alt="Black and white photo of an empty gala ballroom"
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBVgVVmwa9wTk9mqn02G1BrQtkLVGVPAnpTj1OX_ruW8Tgyp6c0NQKCcUXu1syp-6TcqAEgIr2Ioo0clWFe6PYHnvP5HbLfCQM7jKXv_qxmN0rEi-WR-WBH1Noq645NmY1vrXLyUVEo3ke-a25rEcqLaZz34ja_ukK6Gl884QjBbiDPP7WmbqY0XiloQMS_6FLFMfTiB3chD09gwAz7W1Yc2fIs5KUJfyHATsznyc4uI6XulPVe-d03hUlXRem1yZjVwVXr7XoniuDM')", backgroundSize: "cover"}}>
              <div className="absolute top-3 right-3">
                <span
                  className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>
              </div>
            </div>
            <div className="p-6">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Annual Partners Gala</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>The Plaza, New York</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>Sep 20, 2024</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                  Post-event report ready
                </div>
                <button className="text-primary font-bold text-sm hover:underline">View Report</button>
              </div>
            </div>
          </div>
          {/* <!-- Event Card 4: Upcoming --> */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className="h-40 bg-gray-100 relative" data-alt="Auditorium with colorful stage lights"
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYq5w0vShrtaU3k1sX7THiEnEmtL-RYFatzA7K4r2E-g55qdVgVTfdl1iV8O7RLb50GLWH79hcCIMx1Pf3zc0NTvK8E_6me39FL5thE2cYCpE6ffR_RQ1xjCmzrIZIorgxVMeDIGl7jzO4Ndup4KRLKWrSKRvum11On9_ttckHKg_7M4m82NUQYQcx0s22JOADYHohPk5CRRp11BqrUkYp2RwXTHB_2eqomU4DuqXDBk5Xk2jnIyx5wXra9aXWMxod6e5nSdAZs72I')", backgroundSize: "cover"}}>
              <div className="absolute top-3 right-3">
                <span
                  className="bg-primary/10 text-primary dark:bg-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Upcoming</span>
              </div>
            </div>
            <div className="p-6">
              <h3
                className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                Future of AI Expo</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>ExCeL London</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>Dec 01 - Dec 03, 2024</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">142 Guests Confirmed</span>
                </div>
                <button className="text-primary font-bold text-sm hover:underline">Manage</button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Pagination --> */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing 4 of 28 events</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
              disabled="">Previous</button>
            <button
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Next</button>
          </div>
        </div>
      </main>
      {/* <!-- Footer --> */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-8 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2024 EventOps Enterprise. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-sm text-gray-500 hover:text-primary" href="#">Support</a>
            <a className="text-sm text-gray-500 hover:text-primary" href="#">Documentation</a>
            <a className="text-sm text-gray-500 hover:text-primary" href="#">API</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
  )
}

export default EventDirectory