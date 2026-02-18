import React from 'react'

function UserProfileSetting() {
  return (
     <div className="relative flex h-full min-h-screen w-full flex-col group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Top Navigation --> */}
      <header
        className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-6 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">diamond</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Hospitality Ops
            </h2>
          </div>
          <nav className="flex items-center gap-6">
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              href="#">Dashboard</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              href="#">Events</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              href="#">Staff</a>
            <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
              href="#">Analytics</a>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-4">
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div
            className="bg-primary/10 border border-primary/20 rounded-full size-10 flex items-center justify-center text-primary font-bold">
            JD</div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* <!-- Sidebar Navigation --> */}
        <aside
          className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hidden lg:flex flex-col gap-2">
          <div className="mb-4">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Settings</h3>
          </div>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold" href="#">
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm">Profile</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">security</span>
            <span className="text-sm">Security</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">notifications_active</span>
            <span className="text-sm">Notifications</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            href="#">
            <span className="material-symbols-outlined">account_tree</span>
            <span className="text-sm">Organization</span>
          </a>
          <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-slate-400">Enterprise Plan</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Global Events Team</p>
            </div>
          </div>
        </aside>
        {/* <!-- Main Content Area --> */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* <!-- Page Header --> */}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Profile Settings
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">Manage your personal information, security, and
                communication preferences.</p>
            </div>
            {/* <!-- Personal Information Card --> */}
            <div
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
                <p className="text-sm text-slate-500">Update your avatar and basic account details.</p>
              </div>
              <div className="p-6 space-y-8">
                {/* <!-- Avatar Upload --> */}
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div
                      className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                      <div className="w-full h-full bg-center bg-cover" data-alt="User profile avatar photo"
                        style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzzZEKHFQF7X8NxCIXRFiCoizCREhuOVgl-bM_DC7NOcfI1axZNITArrN4Y-I5wQf-bH9RHE2mDhIA0lxOe9cpusmArhcINAKTAm2Ac3cPMgWXhMO37eHCnpk7KjCWI8TGYdsANSWuWw5VmaDP_AU-ig7kfPTvdZKeBGOzWqCt6o6RroVKN_efsLz0gVsJXLt8s4yddx73LNTHmaStXjuX6XBUDtC2L1c1w7VL502fgt9cdRmtCrdGeoHi6G3fYj0qCoz6GOfd6hxh')"}}>
                      </div>
                    </div>
                    <button
                      className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-primary/90 transition-transform active:scale-90">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-3">
                      <button
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">Change
                        Photo</button>
                      <button
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Remove</button>
                    </div>
                    <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>
                {/* <!-- Input Grid --> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      type="text" value="Julianne Dash" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                    <input
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed outline-none"
                      disabled="" type="email" value="j.dash@enterprise-hospitality.com" />
                    <p className="text-xs text-slate-400">Email is managed by your organization's SSO.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Job Title</label>
                    <input
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      type="text" value="Senior Operations Manager" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Timezone</label>
                    <select
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none">
                      <option>Pacific Standard Time (PST)</option>
                      <option selected="">Eastern Standard Time (EST)</option>
                      <option>Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button
                  className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm">Save
                  Changes</button>
              </div>
            </div>
            {/* <!-- Security Card --> */}
            <div
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security Settings</h2>
                <p className="text-sm text-slate-500">Manage your password and authentication methods.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                    <input
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••" type="password" />
                  </div>
                  <div></div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                    <input
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••" type="password" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <input
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      placeholder="••••••••" type="password" />
                  </div>
                </div>
                <div className="pt-4 space-y-4">
                  {/* <!-- Toggles --> */}
                  <div
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account via SMS or App.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked="" className="sr-only peer" type="checkbox" />
                      <div
                        className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                      </div>
                    </label>
                  </div>
                  <div
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</p>
                      <p className="text-xs text-slate-500">Receive operational alerts, guest arrivals, and event updates.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input checked="" className="sr-only peer" type="checkbox" />
                      <div
                        className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button
                  className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-sm">Update
                  Security</button>
              </div>
            </div>
            {/* <!-- Sessions & Login History (Simplified) --> */}
            <div
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Sessions</h2>
                <p className="text-sm text-slate-500">Device logins currently authorized for this account.</p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-400">desktop_windows</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Chrome on MacOS (Current)</p>
                      <p className="text-xs text-slate-500">San Francisco, USA • 192.168.1.1</p>
                    </div>
                  </div>
                  <span
                    className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase rounded">Active</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-slate-400">smartphone</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">iOS App on iPhone 15</p>
                      <p className="text-xs text-slate-500">San Francisco, USA • 192.168.1.45</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </button>
                </div>
              </div>
              <div className="p-4 text-center">
                <button className="text-primary text-sm font-semibold hover:underline">Log out of all other
                  sessions</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  )
}

export default UserProfileSetting