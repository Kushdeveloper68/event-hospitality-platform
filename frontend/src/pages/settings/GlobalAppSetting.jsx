import React from 'react'

function GlobalAppSetting() {
  return (
   <div className="relative flex min-h-screen flex-col">
    {/* <!-- Top Navigation Bar --> */}
    <header
      className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">event_seat</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">EventOps SaaS</h2>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            href="#">Dashboard</a>
          <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            href="#">Events</a>
          <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            href="#">Attendees</a>
          <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            href="#">Analytics</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            className="w-64 rounded-lg border-none bg-slate-100 dark:bg-slate-800 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50"
            placeholder="Search operations..." type="text" />
        </div>
        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span
            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <img alt="User profile avatar" data-alt="Professional user profile avatar thumbnail"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHb1cJbLMopnLoIvfRi3cGyH2vflyy1_W_TpO3_4hTL1cAAxkb4mE2Vegbgn4SjDhNSt9U6y9FiJtsoXl1eHizgrApBvetGGuSvNb9-FE0hbhTtwMGbOE0ramYCR46njCvg7r_TmWMPDWBnDL-rnv_vTfxIbLQBBNrnDYrKGzTSfQbqc-2eVPbXyTlWfguVtMxa97cX6oRSy2TxznS8ywyjsH79uV8YIlwBmb14leL6duPdvT1fSI4WFKVE1BAkw7EGMQKoZRDBYaY" />
        </div>
      </div>
    </header>
    <div className="flex flex-1">
      {/* <!-- Sidebar Navigation --> */}
      <aside
        className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hidden lg:block">
        <div className="mb-6 px-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Settings</h3>
        </div>
        <nav className="space-y-1">
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-lg">person</span> Account
          </a>
          <a className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
            href="#">
            <span className="material-symbols-outlined text-lg">settings</span> Preferences
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-lg">notifications_active</span> Notifications
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-lg">security</span> Security
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-lg">hub</span> Integrations
          </a>
          <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
            href="#">
            <span className="material-symbols-outlined text-lg">credit_card</span> Billing
          </a>
        </nav>
      </aside>
      {/* <!-- Main Content --> */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-background-dark p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          {/* <!-- Header --> */}
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Global App Preferences</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Personalize your hospitality management workspace for
              optimized operational workflow.</p>
          </div>
          <div className="space-y-8">
            {/* <!-- Appearance Section --> */}
            <section
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-slate-500">Choose how the interface looks and feels to you.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* <!-- Theme Options --> */}
                <label className="group cursor-pointer">
                  <input checked="" className="hidden peer" name="theme" type="radio" value="light" />
                  <div
                    className="relative flex flex-col gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div
                      className="h-24 w-full rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col p-2 gap-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div className="h-2 w-1/2 bg-white rounded-full"></div>
                      <div className="h-12 w-full bg-white rounded-md shadow-sm"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Light</span>
                      <span
                        className="material-symbols-outlined text-primary invisible peer-checked:visible">check_circle</span>
                    </div>
                  </div>
                </label>
                <label className="group cursor-pointer">
                  <input className="hidden peer" name="theme" type="radio" value="dark" />
                  <div
                    className="relative flex flex-col gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div
                      className="h-24 w-full rounded-lg bg-slate-900 flex flex-col p-2 gap-2 overflow-hidden border border-slate-800">
                      <div className="h-2 w-1/2 bg-slate-700 rounded-full"></div>
                      <div className="h-12 w-full bg-slate-800 rounded-md shadow-sm"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Dark</span>
                      <span
                        className="material-symbols-outlined text-primary invisible peer-checked:visible">check_circle</span>
                    </div>
                  </div>
                </label>
                <label className="group cursor-pointer">
                  <input className="hidden peer" name="theme" type="radio" value="system" />
                  <div
                    className="relative flex flex-col gap-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="h-24 w-full rounded-lg bg-slate-100 flex overflow-hidden border border-slate-200">
                      <div className="w-1/2 bg-slate-100 p-2">
                        <div className="h-2 w-full bg-white rounded-full"></div>
                      </div>
                      <div className="w-1/2 bg-slate-900 p-2">
                        <div className="h-2 w-full bg-slate-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">System</span>
                      <span
                        className="material-symbols-outlined text-primary invisible peer-checked:visible">check_circle</span>
                    </div>
                  </div>
                </label>
              </div>
              {/* <!-- Sidebar Density --> */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sidebar Density</h3>
                    <p className="text-xs text-slate-500">Adjust the vertical spacing of the navigation items.</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                    <button
                      className="rounded-md bg-white dark:bg-slate-700 px-4 py-1.5 text-xs font-semibold shadow-sm">Default</button>
                    <button
                      className="rounded-md px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Compact</button>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- Localization Section --> */}
            <section
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Localization</h2>
                <p className="text-sm text-slate-500">Manage how regional data is displayed in your dashboard.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Language Selection</label>
                  <select
                    className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary">
                    <option value="en-us">English (United States)</option>
                    <option value="en-gb">English (United Kingdom)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date &amp; Time Format</label>
                  <select
                    className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary">
                    <option value="mdy">MM/DD/YYYY (12:00 PM)</option>
                    <option value="dmy">DD/MM/YYYY (24:00)</option>
                    <option value="iso">YYYY-MM-DD (24:00)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Timezone</label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">language</span>
                    <select
                      className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary appearance-none pr-10">
                      <option value="utc">UTC (Coordinated Universal Time)</option>
                      <option value="pst">Pacific Standard Time (PST)</option>
                      <option selected="" value="est">Eastern Standard Time (EST)</option>
                      <option value="cet">Central European Time (CET)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currency Display</label>
                  <select
                    className="rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:border-primary focus:ring-primary">
                    <option value="usd">USD ($)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                  </select>
                </div>
              </div>
            </section>
            {/* <!-- Workspace Section --> */}
            <section
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Workspace Behavior</h2>
                <p className="text-sm text-slate-500">Configure default behaviors when you log into the platform.</p>
              </div>
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                      <span className="material-symbols-outlined">home</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Default Landing Page</p>
                      <p className="text-xs text-slate-500">Select which page you see first after signing in.</p>
                    </div>
                  </div>
                  <select
                    className="rounded-lg border-none bg-slate-100 dark:bg-slate-800 text-xs font-semibold px-3 py-1.5 focus:ring-1 focus:ring-primary">
                    <option>Dashboard</option>
                    <option>Active Events</option>
                    <option>Analytics Hub</option>
                  </select>
                </div>
                <div
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-600">
                      <span className="material-symbols-outlined">volume_up</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">In-app Sound Alerts</p>
                      <p className="text-xs text-slate-500">Play subtle sounds for high-priority event alerts.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input checked="" className="peer sr-only" type="checkbox" />
                    <div
                      className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-slate-700">
                    </div>
                  </label>
                </div>
              </div>
            </section>
          </div>
          {/* <!-- Action Footer --> */}
          <div
            className="mt-10 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-8 pb-10">
            <button
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Reset to Default
            </button>
            <button
              className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
  )
}

export default GlobalAppSetting