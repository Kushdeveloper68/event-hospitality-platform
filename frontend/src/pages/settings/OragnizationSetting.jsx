import React from 'react'

function OragnizationSetting() {
  return (
   <><header
    className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-8 lg:px-20 py-3">
    <div className="max-w-[1280px] mx-auto flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">star_rate</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Event Hospitality OS</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium"
            href="#">Dashboard</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium"
            href="#">Events</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium"
            href="#">Operations</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-sm font-medium"
            href="#">Reports</a>
          <a className="text-primary text-sm font-semibold border-b-2 border-primary pb-1" href="#">Settings</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search..." type="text" />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div
          className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
          <img alt="User Profile" className="h-full w-full object-cover"
            data-alt="Close up portrait of a professional male user"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQWTwllVFZn8wDy8Xw3iAzyml8caC1sq0BrcHNZisbYmLFONVhHz7zGK3WpVmIX1hDyff9noAjLrlGf0Jz0Vm-Oa5RQVJ7Of18xgZDtProWIPXEAsdPnp1ZlTJJPt4E415LSgkFZjEjLhiuVR7FGxUMIn_zJSZicn4kEDKT6lWLwNyTlqWeLMvfvi0iA-NigLvuemvChYKHW33LB00a5OselpPn5LRp--7gWAJs5gtzO2KibivrRDCqI5QSvvzgNB9qQ2QFZYEIh3I" />
        </div>
      </div>
    </div>
  </header>
  <main className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-20 py-8">
    {/* <!-- Breadcrumbs --> */}
    <nav className="flex items-center gap-2 text-sm mb-6 text-slate-500 dark:text-slate-400">
      <a className="hover:text-primary" href="#">Settings</a>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="text-slate-900 dark:text-slate-100 font-medium">Organization Profile</span>
    </nav>
    {/* <!-- Page Title --> */}
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Organization Settings</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your organization's global identity, branding, and
        contact details.</p>
    </div>
    {/* <!-- Settings Content Card --> */}
    <div
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <form action="#" method="POST">
        {/* <!-- General Information Section --> */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">info</span>
            <h2 className="text-lg font-bold">General Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Organization Name</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                type="text" value="Grand Plaza Hospitality Group" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none">
                <option>Hotel Management</option>
                <option>Event Venue</option>
                <option>Catering &amp; Services</option>
                <option>Corporate Events</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
              <div className="flex rounded-lg shadow-sm">
                <span
                  className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">https://</span>
                <input
                  className="flex-1 px-4 py-3 rounded-r-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  placeholder="www.example.com" type="text" value="www.grandplazaevents.com" />
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Logo & Branding Section --> */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">palette</span>
            <h2 className="text-lg font-bold">Logo &amp; Branding</h2>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative group">
              <div
                className="size-32 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                <img alt="Organization Logo" className="w-full h-full object-contain p-4"
                  data-alt="Modern geometric corporate logo icon on white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQP1ZsRD5fGXgqtpBvEIRz57lDS9EJaMKMnf5FGCQnk0mtJXpR6FXc04nmPh4N2m0ys4oeb1A0wNRrLoPIqAoofG6yCHCndDmAeYjP2Y5iNkImi77IRoDgGt9hmizqsKzyXz3CJK1lSUgxUbv_RHjOhHQEB3oZcT5Tcfp-BsZdUavHrpglYsVH9LYrHTbjvJyS7EwD-Rw5kaFyuy1jt6s7JaxPlFdcujw8i5YSrC9Fa53LatdxGNhEXDswXQcgEm7N8HghOpO-GVUR" />
              </div>
              <button
                className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 shadow-md rounded-full size-8 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 transition-colors"
                type="button">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Organization
                Logo</label>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Recommended size: 512x512px. Supported formats:
                PNG, JPG, SVG (Max 2MB).</p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                  type="button">
                  <span className="material-symbols-outlined text-sm">upload</span>
                  Upload New Logo
                </button>
                <button
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  type="button">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Contact Information Section --> */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">contact_page</span>
            <h2 className="text-lg font-bold">Contact Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Physical Address</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
                rows="3">123 Hospitality Way, Suite 400
New York, NY 10001
United States</textarea>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Contact Name</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                type="text" value="Alexander Mitchell" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Contact
                Email</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                type="email" value="alex.mitchell@grandplaza.com" />
            </div>
          </div>
        </div>
        {/* <!-- Footer Actions --> */}
        <div
          className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
          <button
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            type="button">
            Cancel
          </button>
          <button
            className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all"
            type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
    {/* <!-- Help Section --> */}
    <div className="mt-8 flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="size-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined">help</span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white">Need help with branding?</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">Read our documentation on how to customize your
            organization's presence.</p>
        </div>
      </div>
      <a className="text-sm font-bold text-primary hover:underline" href="#">View Guide</a>
    </div>
  </main>
  {/* <!-- Success Toast (Mockup) --> */}
  <div
    className="fixed bottom-8 right-8 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl opacity-0 pointer-events-none translate-y-4 transition-all">
    <span className="material-symbols-outlined text-green-500">check_circle</span>
    <span className="font-medium">Changes saved successfully</span>
  </div></>
  )
}

export default OragnizationSetting