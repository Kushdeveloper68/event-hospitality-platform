import React from 'react'

function ActivityAndNotificationLogs() {
  return (
    <div className="flex h-screen overflow-hidden">
    {/* <!-- Sidebar --> */}
    <aside className="w-64 bg-white border-r border-primary/10 flex flex-col shrink-0">
      <div className="p-6 flex flex-col gap-8 h-full">
        {/* <!-- Brand --> */}
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">event_seat</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#111318] text-base font-bold leading-none">EventOps Pro</h1>
            <p className="text-primary/60 text-xs font-medium uppercase tracking-wider">Enterprise</p>
          </div>
        </div>
        {/* <!-- Navigation --> */}
        <nav className="flex flex-col gap-1 flex-1">
          <a className="flex items-center gap-3 px-3 py-2 text-primary/70 hover:bg-primary/5 rounded-lg transition-colors"
            href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-primary/70 hover:bg-primary/5 rounded-lg transition-colors"
            href="#">
            <span className="material-symbols-outlined">calendar_today</span>
            <span className="text-sm font-medium">Event Management</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors" href="#">
            <span className="material-symbols-outlined material-symbols-fill">notifications</span>
            <span className="text-sm font-bold">Hospitality Logs</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-primary/70 hover:bg-primary/5 rounded-lg transition-colors"
            href="#">
            <span className="material-symbols-outlined">group</span>
            <span className="text-sm font-medium">Staff Schedule</span>
          </a>
          <div className="my-4 border-t border-primary/5"></div>
          <a className="flex items-center gap-3 px-3 py-2 text-primary/70 hover:bg-primary/5 rounded-lg transition-colors"
            href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>
        {/* <!-- User Profile --> */}
        <div className="flex items-center gap-3 pt-4 border-t border-primary/5">
          <div className="size-10 rounded-full bg-primary/20 bg-cover bg-center" data-alt="User profile avatar circle"
            style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVNYXz7fbnA3j0uZDLLY57f3UMIPGgh50wcpg4JpeiascCGTnHE2pPHdW1FLEVxZjZIlK1cVI51TAZ0B36IwgaqDRYh_ederaQL9FL9PpJMVp1CmGMsm-SLTjJC8SpV1C1mta8PgmvB_bYgAUbs3iJrjjqwwHWmcPNholUGMUdx-4FfpUWs-QF0yhxT5fLRuJJDb9natyQlN6dZx8Y0QPApy5lwi0IXL1unq44prVNMkywnllSL0bndaDJkTKixkFrppToeyxYjaRa')"}}>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-[#111318]">Alex Rivera</p>
            <p className="text-xs text-primary/60">Ops Lead</p>
          </div>
        </div>
      </div>
    </aside>
    {/* <!-- Main Content Area --> */}
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* <!-- Header --> */}
      <header className="bg-white border-b border-primary/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-xl font-bold text-[#111318] whitespace-nowrap">Activity &amp; Notifications Log</h2>
          <div className="relative max-w-md w-full">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-lg">search</span>
            <input
              className="w-full bg-background-light border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Search activity, guests, or staff..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined text-sm">done_all</span>
            Mark all as read
          </button>
          <button className="p-2 text-primary/60 hover:bg-primary/5 rounded-lg transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>
      {/* <!-- Filters & Tabs --> */}
      <div className="bg-white border-b border-primary/10 px-8 pt-4 flex flex-col gap-4">
        <div className="flex gap-8">
          <button className="pb-3 border-b-2 border-primary text-primary text-sm font-bold">Recent Alerts</button>
          <button
            className="pb-3 border-b-2 border-transparent text-primary/40 text-sm font-bold hover:text-primary/60">Archived
            Logs</button>
          <button
            className="pb-3 border-b-2 border-transparent text-primary/40 text-sm font-bold hover:text-primary/60">Flagged</button>
        </div>
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar">
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
            All Activities
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-primary/60 border border-primary/10 rounded-full text-xs font-bold hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-sm">doorbell</span>
            Service
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-primary/60 border border-primary/10 rounded-full text-xs font-bold hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-sm">directions_bus</span>
            Transport
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-primary/60 border border-primary/10 rounded-full text-xs font-bold hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-sm">terminal</span>
            System
          </button>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">warning</span>
            Critical
          </button>
        </div>
      </div>
      {/* <!-- Notification List --> */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {/* <!-- Notification Item: Critical --> */}
        <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-start gap-4 relative">
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <span className="text-xs font-medium text-red-600/60 uppercase">High Priority</span>
            <button className="text-primary/40 hover:text-primary"><span
                className="material-symbols-outlined">more_vert</span></button>
          </div>
          <div className="bg-red-100 text-red-600 size-12 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">report_problem</span>
          </div>
          <div className="flex flex-col gap-1 pr-24">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#111318]">VIP Shuttle Delay: Flight BA102</h4>
              <span className="size-2 rounded-full bg-red-600"></span>
            </div>
            <p className="text-sm text-[#616e89]">The executive shuttle is stuck in traffic. ETA for Guest 'Ambassador
              Miller' delayed by 15 mins at Main Gate.</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-primary/50 flex items-center gap-1"><span
                  className="material-symbols-outlined text-sm">schedule</span>Just now</span>
              <span className="text-xs font-bold text-red-600 underline cursor-pointer">Dispatch Backup</span>
            </div>
          </div>
        </div>
        {/* <!-- Notification Item: Service --> */}
        <div
          className="bg-white border border-primary/5 rounded-xl p-4 flex items-start gap-4 relative hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4">
            <button className="text-primary/40 hover:text-primary"><span
                className="material-symbols-outlined">more_vert</span></button>
          </div>
          <div className="bg-primary/10 text-primary size-12 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">how_to_reg</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#111318]">John Doe <span className="font-normal text-[#616e89]">checked in
                  at</span> Main Lobby</h4>
              <span className="size-2 rounded-full bg-primary"></span>
            </div>
            <p className="text-sm text-[#616e89]">Service desk assigned to Room 402. Special request: High floor, additional
              towels.</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary/50 flex items-center gap-1"><span
                  className="material-symbols-outlined text-sm">schedule</span>2 mins ago</span>
            </div>
          </div>
        </div>
        {/* <!-- Notification Item: System --> */}
        <div
          className="bg-white border border-primary/5 rounded-xl p-4 flex items-start gap-4 relative hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4">
            <button className="text-primary/40 hover:text-primary"><span
                className="material-symbols-outlined">more_vert</span></button>
          </div>
          <div className="bg-slate-100 text-slate-600 size-12 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">sync</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#111318]">Shift Roster Synced</h4>
            </div>
            <p className="text-sm text-[#616e89]">The hospitality evening shift roster for Oct 14 has been successfully
              exported to HR portal.</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary/50 flex items-center gap-1"><span
                  className="material-symbols-outlined text-sm">schedule</span>15 mins ago</span>
            </div>
          </div>
        </div>
        {/* <!-- Notification Item: Transport --> */}
        <div
          className="bg-white border border-primary/5 rounded-xl p-4 flex items-start gap-4 relative hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4">
            <button className="text-primary/40 hover:text-primary"><span
                className="material-symbols-outlined">more_vert</span></button>
          </div>
          <div className="bg-primary/10 text-primary size-12 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">local_taxi</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#111318]">Driver Assignment: <span
                  className="font-normal text-primary underline">Marco S.</span></h4>
            </div>
            <p className="text-sm text-[#616e89]">Assigned to Guest 'Sarah Connor' for Airport Transfer (Terminal 2).</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary/50 flex items-center gap-1"><span
                  className="material-symbols-outlined text-sm">schedule</span>24 mins ago</span>
            </div>
          </div>
        </div>
        {/* <!-- Notification Item: Service (Read) --> */}
        <div
          className="bg-white opacity-70 border border-primary/5 rounded-xl p-4 flex items-start gap-4 relative hover:shadow-md transition-shadow">
          <div className="absolute top-4 right-4">
            <button className="text-primary/40 hover:text-primary"><span
                className="material-symbols-outlined">more_vert</span></button>
          </div>
          <div className="bg-primary/5 text-primary/60 size-12 rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">notifications_off</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-[#111318]">Cleaning Service Completed: Suite 12</h4>
            </div>
            <p className="text-sm text-[#616e89]">Housekeeping marked the room as 'Ready for Guest' - Inspection passed.</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-primary/50 flex items-center gap-1"><span
                  className="material-symbols-outlined text-sm">schedule</span>1 hour ago</span>
            </div>
          </div>
        </div>
        {/* <!-- Load More Section --> */}
        <div className="flex flex-col items-center pt-8 pb-12">
          <p className="text-sm text-primary/40 mb-4">You've reached the end of the recent alerts</p>
          <button
            className="flex items-center gap-2 px-6 py-2 border border-primary/20 text-primary text-sm font-bold rounded-lg hover:bg-primary/5 transition-colors">
            <span className="material-symbols-outlined text-sm">history</span>
            Load archived history
          </button>
        </div>
      </div>
    </main>
    {/* <!-- Right Summary Panel --> */}
    <aside className="w-80 bg-white border-l border-primary/10 overflow-y-auto p-6 hidden xl:block">
      <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">Operational Summary</h3>
      <div className="space-y-6">
        {/* <!-- Stats Grid --> */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background-light rounded-xl p-3">
            <p className="text-xs font-medium text-primary/60">New Alerts</p>
            <p className="text-2xl font-bold text-[#111318]">12</p>
          </div>
          <div className="bg-background-light rounded-xl p-3">
            <p className="text-xs font-medium text-primary/60">Critical</p>
            <p className="text-2xl font-bold text-red-600">01</p>
          </div>
        </div>
        {/* <!-- Activity Radar Map Placeholder --> */}
        <div className="bg-background-light rounded-xl p-4">
          <p className="text-xs font-bold text-[#111318] mb-3">Service Density</p>
          <div
            className="h-32 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
            <span className="material-symbols-outlined text-primary/20 text-4xl">map</span>
            <p className="text-[10px] text-primary/40 absolute bottom-2 font-mono">LIVE FEED: LOBBY A</p>
            <div className="size-2 bg-primary rounded-full absolute top-10 left-12 animate-ping"></div>
          </div>
        </div>
        {/* <!-- Staff on Duty --> */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-[#111318]">Active Staff</h4>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">24 ON DUTY</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-cover" data-alt="Staff member 1"
                style={{backgroundImage:" url('https://lh3.googleusercontent.com/aida-public/AB6AXuCL6IW7Y-BWQzDBJf-wT5NopoPCNH3DTLvfygX_Y75uM-WSiRTttnxutK9_6ESvHPmQhTi4jpUX0qbo5gRv4j0ONaaw0o8KeWzzXLhnoQw9igcaiXebboi7zdMWHd8XmYFz59qMftLk4ZEg0OIOXKDpZTCycCKgcXCQVbhmAtG-GqGjZqkttoA6i8HTtg-8UBbKZ9DCMbDDFBP6q_kaoazXJPbnoaC9aRdRURNLizrV_DMk-8sHUmKPunYDHAnczwjaLJF5rjDg4n5p')"}}>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold">Marcus Lin</p>
                <p className="text-[10px] text-[#616e89]">Transport Coordinator</p>
              </div>
              <span className="size-2 rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-cover" data-alt="Staff member 2"
                style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDpPx97o3HNNmGSzB7hHtg-9Ffl6TQ_8rTjdM7PSiCUfvTjD4FHWH2nyixnVxQxUcVDjsk6Jn0zTAAwLugweTzx-uNJCK6lHJiKFURFJqlQOGQfIMQfoCF0zkY8wyIY_x65Kd_gT581CEhvks70Ve7FNGoykbvl8oj8vDWJUk3B2kYjFRy0QZJTExGHoKUL0wafAMLh0rDErBuozkfkIb2uCffqB0KGouIhBricQayJbNLnx5KaYJblttl5zGzKWj21xzVFKBQcm8gm')"}}>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold">Elena Vance</p>
                <p className="text-[10px] text-[#616e89]">VIP Guest Relations</p>
              </div>
              <span className="size-2 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>
        {/* <!-- Quick Action Links --> */}
        <div className="pt-4 border-t border-primary/5">
          <button
            className="w-full py-2 flex items-center justify-between text-xs font-bold text-primary/60 hover:text-primary transition-colors">
            Export Log (CSV)
            <span className="material-symbols-outlined text-sm">download</span>
          </button>
          <button
            className="w-full py-2 flex items-center justify-between text-xs font-bold text-primary/60 hover:text-primary transition-colors">
            Notification Settings
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
  )
}

export default ActivityAndNotificationLogs