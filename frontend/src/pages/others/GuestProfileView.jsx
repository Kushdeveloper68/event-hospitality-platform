import React from 'react'

function GuestProfileView() {
  return (
    <>
    {/* <!-- Top Navigation Bar --> */}
  <header
    className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-[#dbdee6] px-4 md:px-10 py-3 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">event_seat</span>
        </div>
        <h1 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-tight hidden md:block">Nexus
          Hospitality</h1>
      </div>
      <div className="hidden lg:flex items-center gap-6">
        <a className="text-sm font-medium text-[#616e89] hover:text-primary transition-colors" href="#">Guests</a>
        <a className="text-sm font-medium text-[#616e89] hover:text-primary transition-colors" href="#">Rooms</a>
        <a className="text-sm font-medium text-[#616e89] hover:text-primary transition-colors" href="#">Schedule</a>
        <a className="text-sm font-medium text-[#616e89] hover:text-primary transition-colors" href="#">Reports</a>
      </div>
    </div>
    <div className="flex items-center gap-4 flex-1 justify-end">
      <div className="max-w-xs w-full hidden sm:block">
        <div className="relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89] text-xl">search</span>
          <input
            className="w-full bg-[#f0f1f4] dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
            placeholder="Search guests..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-3 border-l border-[#dbdee6] pl-4">
        <button className="p-2 text-[#616e89] hover:bg-[#f0f1f4] rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="size-10 rounded-full bg-slate-200 overflow-hidden border border-[#dbdee6]">
          <img className="w-full h-full object-cover" data-alt="User profile avatar of staff member"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmyghzL0FmYjBXCcuZqhDYVdUb924DBA_c7TrfzO1rYFQw5yxoMio-LdqN0MsMV4sfKhwKo1SasJil9ApkY4qxOrA_1bsqu-aol-rwryw0UGU0f9QPRWxFjAJP0I_20LCt1iUSNn0Iy8eUwp8N8IwADOXwwbgGKd1ZMVrp4GblhInSGIS5_EXs3sBA8el3_S0cDwm3INVBtIc09e3nKbiNfVHPCf_uyD-hke3IYPhM2OqwOgEestebnSvbd8HMGYieZxvuQyBDUroT" />
        </div>
      </div>
    </div>
  </header>
  <main className="max-w-7xl mx-auto px-4 py-6">
    {/* <!-- Breadcrumbs --> */}
    <nav className="flex items-center gap-2 text-sm text-[#616e89] mb-6">
      <a className="hover:text-primary" href="#">Dashboard</a>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <a className="hover:text-primary" href="#">Guests</a>
      <span className="material-symbols-outlined text-xs">chevron_right</span>
      <span className="text-[#111318] font-medium">Guest Profile</span>
    </nav>
    {/* <!-- Profile Header Section --> */}
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbdee6] p-6 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="size-24 rounded-2xl overflow-hidden border-4 border-primary/10">
              <img className="w-full h-full object-cover" data-alt="Jonathan Wick profile photo professional headshot"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR7ROXf6BFqFRaYx8ZIzG7q_Jhu90Pq-QCxzocC30yMeTTOZ2dWfaG93kImsSknowb7YXDZBrdY-6WHOdVQWB4VfXQfjdGE-zdkJ35SwyBWpiHEXC17tX-paLLywjN2yDlTCVt45sRFvVXCOWL4gBKaqyp66IWUCps1yt3zBTh9tXsRaJ9FNj8QyfFLC-N0TNRZgGnI5P5XqFufIpQVeskdS0PG3GYOOr8yfbP9bPTBfCL6V01A17J3crAyUEI3wBaoHuKC6vvqIV4" />
            </div>
            <div
              className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg">
              VIP
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-[#111318] dark:text-white tracking-tight">Jonathan Wick</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">Platinum
                Tier</span>
            </div>
            <p className="text-[#616e89] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">location_on</span>
              New York, USA
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="size-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-amber-600">Pending Arrival • Scheduled 2:00 PM</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#dbdee6] text-[#111318] font-bold text-sm rounded-lg hover:bg-background-light transition-all">
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
          <button
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-blue-700 shadow-md shadow-primary/20 transition-all">
            <span className="material-symbols-outlined text-lg">login</span>
            Check-in Guest
          </button>
        </div>
      </div>
    </div>
    {/* <!-- Bento Grid Content --> */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* <!-- Left Column: Personal Info & Room --> */}
      <div className="lg:col-span-1 space-y-6">
        {/* <!-- Personal Info Card --> */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbdee6] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dbdee6] flex justify-between items-center bg-[#fcfcfd]">
            <h3 className="font-bold text-[#111318]">Personal Details</h3>
            <span className="material-symbols-outlined text-[#616e89] cursor-pointer hover:text-primary">more_horiz</span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#616e89] uppercase tracking-wider">Email Address</label>
              <p className="text-sm font-medium text-[#111318] mt-1">j.wick@continental.com</p>
            </div>
            <div>
              <label className="text-xs font-bold text-[#616e89] uppercase tracking-wider">Phone</label>
              <p className="text-sm font-medium text-[#111318] mt-1">+1 (555) 0123-4567</p>
            </div>
            <div>
              <label className="text-xs font-bold text-[#616e89] uppercase tracking-wider">Company</label>
              <p className="text-sm font-medium text-[#111318] mt-1">The Continental Group</p>
            </div>
            <div className="pt-2">
              <label className="text-xs font-bold text-[#616e89] uppercase tracking-wider">Special Notes</label>
              <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg text-xs leading-relaxed border border-red-100">
                <span className="font-bold">ALLERGY:</span> Severe nut allergy. Requires gluten-free meal options for event
                dinner.
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Room Assignment Card --> */}
        <section className="bg-primary text-white rounded-xl overflow-hidden shadow-lg shadow-primary/10">
          <div className="p-5">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-primary-100 text-xs font-bold uppercase tracking-widest opacity-80">Room Assignment</h3>
                <p className="text-3xl font-bold mt-1 tracking-tight">Suite 405</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-2xl">bed</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-white/10">
                <span className="opacity-80">Floor</span>
                <span className="font-semibold">Executive 4th Floor</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-white/10">
                <span className="opacity-80">Room Type</span>
                <span className="font-semibold">Presidential Suite</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="opacity-80">Status</span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="size-2 bg-green-400 rounded-full"></span>
                  Ready for Check-in
                </span>
              </div>
            </div>
            <button
              className="w-full mt-6 py-2.5 bg-white text-primary font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors">
              Change Assignment
            </button>
          </div>
        </section>
      </div>
      {/* <!-- Right Column: Timeline & Service History --> */}
      <div className="lg:col-span-2 space-y-6">
        {/* <!-- Stay Status Timeline --> */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbdee6] p-6 shadow-sm">
          <h3 className="font-bold text-[#111318] mb-8">Stay Journey</h3>
          <div className="relative flex justify-between">
            {/* <!-- Connecting Line --> */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-[#f0f1f4] -z-0"></div>
            {/* <!-- Timeline Item 1 --> */}
            <div className="relative z-10 flex flex-col items-center gap-3 flex-1">
              <div
                className="size-8 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#111318]">Registered</p>
                <p className="text-[10px] text-[#616e89]">Oct 12, 09:15 AM</p>
              </div>
            </div>
            {/* <!-- Timeline Item 2 --> */}
            <div className="relative z-10 flex flex-col items-center gap-3 flex-1">
              <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-white">
                <span className="material-symbols-outlined text-sm">room_service</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#111318]">Room Assigned</p>
                <p className="text-[10px] text-[#616e89]">Oct 14, 11:30 AM</p>
              </div>
            </div>
            {/* <!-- Timeline Item 3 --> */}
            <div className="relative z-10 flex flex-col items-center gap-3 flex-1">
              <div
                className="size-8 rounded-full bg-[#f0f1f4] text-[#616e89] flex items-center justify-center ring-4 ring-white">
                <span className="material-symbols-outlined text-sm">key</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#616e89]">Check-in</p>
                <p className="text-[10px] text-[#616e89]">Pending Arrival</p>
              </div>
            </div>
            {/* <!-- Timeline Item 4 --> */}
            <div className="relative z-10 flex flex-col items-center gap-3 flex-1">
              <div
                className="size-8 rounded-full bg-[#f0f1f4] text-[#616e89] flex items-center justify-center ring-4 ring-white">
                <span className="material-symbols-outlined text-sm">logout</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#616e89]">Check-out</p>
                <p className="text-[10px] text-[#616e89]">Scheduled Oct 18</p>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Service History Table --> */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-[#dbdee6] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-[#dbdee6] flex justify-between items-center">
            <h3 className="font-bold text-[#111318]">Service History</h3>
            <button className="text-primary text-sm font-semibold hover:underline">Add Request</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fcfcfd] border-b border-[#dbdee6]">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold text-[#616e89] uppercase tracking-wider">Service Type</th>
                  <th className="px-5 py-3 text-xs font-bold text-[#616e89] uppercase tracking-wider">Date/Time</th>
                  <th className="px-5 py-3 text-xs font-bold text-[#616e89] uppercase tracking-wider">Handled By</th>
                  <th className="px-5 py-3 text-xs font-bold text-[#616e89] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbdee6]">
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">airport_shuttle</span>
                      </div>
                      <span className="text-sm font-medium text-[#111318]">Airport Transfer</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#616e89]">Today, 10:45 AM</td>
                  <td className="px-5 py-4 text-sm text-[#616e89]">Robert Chen</td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-tight">Completed</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-amber-50 text-amber-600 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">restaurant</span>
                      </div>
                      <span className="text-sm font-medium text-[#111318]">Room Service</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#616e89]">Tomorrow, 08:00 AM</td>
                  <td className="px-5 py-4 text-sm text-[#616e89]">Unassigned</td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-tight">Scheduled</span>
                  </td>
                </tr>
                <tr className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-purple-50 text-purple-600 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">local_laundry_service</span>
                      </div>
                      <span className="text-sm font-medium text-[#111318]">Laundry Pick-up</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#616e89]">Oct 15, 04:00 PM</td>
                  <td className="px-5 py-4 text-sm text-[#616e89]">Housekeeping</td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* <!-- Quick Actions Grid --> */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#dbdee6] rounded-xl hover:border-primary hover:text-primary transition-all group">
            <span className="material-symbols-outlined text-2xl text-[#616e89] group-hover:text-primary">print</span>
            <span className="text-xs font-bold">Print Badge</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#dbdee6] rounded-xl hover:border-primary hover:text-primary transition-all group">
            <span className="material-symbols-outlined text-2xl text-[#616e89] group-hover:text-primary">mail</span>
            <span className="text-xs font-bold">Email Receipt</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#dbdee6] rounded-xl hover:border-primary hover:text-primary transition-all group">
            <span className="material-symbols-outlined text-2xl text-[#616e89] group-hover:text-primary">star</span>
            <span className="text-xs font-bold">Upgrade Room</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-[#dbdee6] rounded-xl hover:border-red-500 hover:text-red-500 transition-all group">
            <span className="material-symbols-outlined text-2xl text-[#616e89] group-hover:text-red-500">cancel</span>
            <span className="text-xs font-bold">Cancel Stay</span>
          </button>
        </div>
      </div>
    </div>
  </main>
  {/* <!-- Footer --> */}
  <footer
    className="max-w-7xl mx-auto px-4 py-8 border-t border-[#dbdee6] mt-12 flex flex-col md:flex-row items-center justify-between text-[#616e89] text-xs">
    <p>© 2024 Nexus Enterprise Event Hospitality Management. Confidential Operational View.</p>
    <div className="flex items-center gap-6 mt-4 md:mt-0">
      <a className="hover:text-primary" href="#">Help Center</a>
      <a className="hover:text-primary" href="#">System Status</a>
      <a className="hover:text-primary" href="#">Security Protocol</a>
    </div>
  </footer></>
  )
}

export default GuestProfileView