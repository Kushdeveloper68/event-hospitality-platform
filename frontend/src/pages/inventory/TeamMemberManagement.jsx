import React from 'react'
import { useSearchParams } from 'react-router-dom'
import TeamMemberEntryForm from '../forms/TeamMemberEntryForm'

function TeamMemberManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get('action');

  if (action === 'addTeam') {
    return (
      <TeamMemberEntryForm 
        onDone={() => setSearchParams({})} 
        onCancel={() => setSearchParams({})} 
      />
    );
  }
  return (
     <div className="flex h-screen overflow-hidden">
    {/* <!-- Sidebar Navigation --> */}
  
    {/* <!-- Main Content Area --> */}
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* <!-- Top Header --> */}
   
      {/* <!-- Content --> */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* <!-- Page Title --> */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Team Members</h2>
            <p className="text-slate-500 mt-1">Manage and assign roles for your hospitality operations team.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-lg">file_download</span>
              Export
            </button>
            <button
              onClick={() => setSearchParams({ action: 'addTeam' })}
              className="flex items-center gap-2 rounded-lg h-10 px-5 bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all text-sm">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Team Member
            </button>
          </div>
        </div>
        {/* <!-- Filters & Search Bar --> */}
        <div
          className="bg-white dark:bg-slate-900 p-4 rounded-t-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-shadow"
              placeholder="Search members by name or email..." type="text" />
          </div>
          <div className="flex gap-3">
            <select
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-600 dark:text-slate-300 py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Event Lead</option>
              <option>Floor Staff</option>
              <option>Logistics</option>
            </select>
            <select
              className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-600 dark:text-slate-300 py-2 pl-3 pr-10 focus:ring-2 focus:ring-primary/20">
              <option>Status: All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        {/* <!-- Table Container --> */}
        <div
          className="bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Member</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Email</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Role</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Status</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">Last Active</th>
                  <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* <!-- Row 1 --> */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img alt="Sarah" className="w-9 h-9 rounded-full bg-slate-100" data-alt="Avatar of Sarah Jenkins"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX_7Mt_FnAX6iGE7FxDEFRx0GRapKLHPx-ZQGraWLAoG609_tg2QzPjH7wYfP-4kU24YhzUuoojfKLlg5HE0KkaoNQH3VbBY-RxRhSm2CYDz3NrUVLySmLAUE2jrNyELKFxn3J1L4GIGa6ATM9O3BMhassyv6X4K06HtTaFan9gYDRAtgtFOQ_Yo8bDIc8_YeuEzt5bbXrkm3OR7XPw4I972F3vbJXshlOIC3FO4o4FhYSRIZbwkJ2Nwlpn4tcyHVXdUSDH29WR5-F" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Sarah Jenkins</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    sarah.j@eventops.pro</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-primary text-[11px] font-bold uppercase tracking-tight">Admin</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">2 mins ago</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-400">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 2 --> */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img alt="Marcus" className="w-9 h-9 rounded-full bg-slate-100" data-alt="Avatar of Marcus Reed"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC6fX0fwkXUkx7ZqEP2S43XVIV2sIl8GDZc7N-5VWyrP5HcyKJYAju7U986zVcIFruHpCl2jr_dOaGRz-CuNI10jNhpqQYMmBu6Hq8QtSK0d4MQFZnFdK97b4acE2FusN7McQt4oSWEI5snSZp9yll-pwMSHm-0ICj7pgs4zYUG8_jBHCJoCQNN_KrOORX5SYMuYz0ykSwDh0nZusPENjvRH9fFbVilm_r6-vW7PsueZVFr7etj2bzjRNc3gPQtblLY_WWYjtJkI9k" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Marcus Reed</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">m.reed@eventops.pro
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-tight">Floor
                      Staff</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">1 hour ago</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-400">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 3 --> */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img alt="Elena" className="w-9 h-9 rounded-full bg-slate-100" data-alt="Avatar of Elena Vance"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-1HFYNvt7A0WCHq7CIgeKrcIyV9HNz8d6MicFoNe5WbYm5HRlRzKITtTX8cybrkMXrpYSTvhj14b3xSz8u457ao8QorLiri4r3cX8TfIyYsfJE8DT0XFPcblnPfj4r4YtLszQrZfEOSWQXLXtcT4NgkvJM2NJ5UqguwB40ZKh2CUaXSYLJxHnPP9r86hBM_uSsQdRGeSHTw4-H0hF0d7aqmuIVr4Z1D_lYgKFYHw4pm6cj4pZuX5XHh5urL2X0J5p5qLBoQPqwxlg" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Elena Vance</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    elena.v@eventops.pro</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[11px] font-bold uppercase tracking-tight">Event
                      Lead</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      Inactive
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Yesterday</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-400">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 4 --> */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img alt="David" className="w-9 h-9 rounded-full bg-slate-100" data-alt="Avatar of David Chen"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeHQ4P9FnQpbKj7CGJMokwj9cRtnubNQB62Ns37ji91TFUOAehmNipUgsuNEj-AMFM0HlDJ9gSyvp-zrSns4eX1l5Ew2_uwkDemq-bJvh4KMdExoAONYo2WmOMFE_TeYBR_R63Vxkgl-cmcZ7p4SGjNzPvoERl9PUCB5unb0zyH68_EEgbJ2d0ADJjkX3fOqZKrJ288EN9XeIQmjRtEHzWhbDjDbXJ3KsC2Glimvxl2cg9XX2yEqFC0TK2ZnGtljsT3LizuMY6COuw" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">David Chen</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">d.chen@eventops.pro
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase tracking-tight">Logistics</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">4 hours ago</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-400">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 5 --> */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img alt="Olivia" className="w-9 h-9 rounded-full bg-slate-100" data-alt="Avatar of Olivia Martin"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDcFcnC8FXcOarCMeV35SWsCMb-Y7Tqt3GifpwtDxmlDR8Lc72uye3PxzNw6mEE4IEVBSqdORQ031HVT3xePm8SpRTZmexvB5mYHjhzt4Ikk9C_7anfjhF9Dm0QgI_KRX--w6wpp2ETXqJOcAo8APUvW5QeFzeT9STLiM5jNqTB6B-YroOuJduP3VNtOjF66bZ2ml01I-eX_VVNySAHfeu0Zjnos7PHW3Z-ijzIhdUipg-Ms-UbZLqie9IiGf4AZRiITFXYmuW-Tq5" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">Olivia Martin</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                    olivia.m@eventops.pro</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-tight">Floor
                      Staff</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">10 mins ago</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors text-slate-400">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <!-- Pagination --> */}
          <div
            className="px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500">Showing 1-12 of 48 members</span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed">Previous</button>
              <button
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
        {/* <!-- Footer Summary --> */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Members</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">48</h4>
            <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+4 this month</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Now</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">32</h4>
            <div className="mt-2 flex items-center gap-1 text-slate-500 text-xs font-bold">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>66% of total team</span>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pending Invitations</p>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">5</h4>
            <div className="mt-2 flex items-center gap-1 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">mail</span>
              <span className="underline cursor-pointer">View invites</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  )
}

export default TeamMemberManagement