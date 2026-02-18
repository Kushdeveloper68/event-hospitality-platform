import React from 'react'

function EventWorkspaceShell() {
  return (
    
  <div className="relative flex flex-col min-h-screen">
    {/* <!-- Top Sticky Header Container --> */}
    <header
      className="sticky top-0 z-50 w-full bg-white dark:bg-[#1a1f2e] border-b border-[#dbdee6] dark:border-[#2d364a] shadow-sm">
      {/* <!-- Global Navbar --> */}
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* <!-- Left: Platform Logo & Search --> */}
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-2 text-primary">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">event_seat</span>
            </div>
            <span
              className="text-xl font-bold tracking-tight text-[#111318] dark:text-white hidden lg:block">EventOps</span>
          </div>
          {/* <!-- Global Search --> */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616e89]">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border-none bg-neutral-soft dark:bg-[#2d364a] dark:text-white rounded-lg leading-5 placeholder-[#616e89] focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all"
                placeholder="Quick search guests, rooms or staff..." type="text" />
            </div>
          </div>
        </div>
        {/* <!-- Right: Utilities & User --> */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 text-[#616e89] hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded-lg transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span
              className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1f2e]"></span>
          </button>
          <button className="p-2 text-[#616e89] hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded-lg transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="h-8 w-px bg-[#dbdee6] dark:bg-[#2d364a] mx-2"></div>
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#111318] dark:text-white leading-none">Sarah Jenkins</p>
              <p className="text-xs text-[#616e89] mt-1 leading-none">Event Director</p>
            </div>
            <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-[#2d364a] shadow-sm"
              data-alt="Portrait of a female event director"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAPZz9Jhq6VgvPEEsKPZyJgHQLZvsSS7qdfl68sBsGbc9sdeMycQ4VsXkJzR0T-t1WHyh6mBo3JEFurzCpEbF6xFDUDU-57_586Zbccl_kxTABtVYP5kqXDad9HBbuQOEwasxYiYQu6dq567llVy8Vm2e9pvS5CSLvYifCUykweUmrFXSlEICrh4Ris2QnQCR7H_1SP6vvK6otoDNcMBTZkbBSfklQP-yYiXpRbhdpqdjUo34m9oL3uf7UbK3eV5IfrqhzTZEhJWcxc")'}}>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Event Context Header --> */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 border-t border-[#f0f1f4] dark:border-[#2d364a]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            {/* <!-- Breadcrumb --> */}
            <div className="flex items-center gap-2 text-xs font-medium text-[#616e89] uppercase tracking-wider">
              <a className="hover:text-primary transition-colors" href="#">Workspaces</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#111318] dark:text-white">Events</span>
            </div>
            {/* <!-- Event Details --> */}
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#111318] dark:text-white">Annual Tech Summit 2024
              </h1>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-wide border border-success/20">
                <span className="size-2 rounded-full bg-success animate-pulse"></span>
                Live
              </div>
            </div>
            <div className="flex items-center gap-5 text-[#616e89] text-sm mt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">location_on</span>
                Grand Hyatt Convention Center
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                Oct 12 - 15, 2024
              </div>
            </div>
          </div>
          {/* <!-- Quick Action Buttons --> */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2d364a] border border-[#dbdee6] dark:border-[#3d475c] text-[#111318] dark:text-white font-semibold text-sm rounded-lg hover:bg-neutral-soft transition-colors">
              <span className="material-symbols-outlined text-xl">share</span>
              Export Data
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
              <span className="material-symbols-outlined text-xl">add_circle</span>
              New Entry
            </button>
          </div>
        </div>
      </div>
      {/* <!-- Horizontal Navigation Tabs --> */}
      <div className="max-w-[1440px] mx-auto px-6">
        <nav className="flex gap-8 overflow-x-auto hide-scrollbar scroll-smooth">
          <a className="flex items-center gap-2 py-4 border-b-2 border-primary text-primary font-bold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Overview
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">group</span>
            Guests
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">meeting_room</span>
            Rooms
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            Check-in
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Transport
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">room_service</span>
            Service
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">schedule</span>
            Schedule
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            Reports
          </a>
          <a className="flex items-center gap-2 py-4 border-b-2 border-transparent text-[#616e89] hover:text-[#111318] dark:hover:text-white font-semibold text-sm whitespace-nowrap transition-all"
            href="#">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            Settings
          </a>
        </nav>
      </div>
    </header>
    {/* <!-- Main Content Area --> */}
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8">
      {/* <!-- Placeholder Content View --> */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* <!-- Welcome Card --> */}
        <div
          className="col-span-1 md:col-span-3 lg:col-span-4 bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-2xl font-bold text-[#111318] dark:text-white">Welcome back to Operations, Sarah</h2>
            <p className="text-[#616e89] max-w-2xl text-lg">
              The event is currently in full swing. We have <span className="text-[#111318] dark:text-white font-bold">1,420
                guests</span> checked in out of 1,800 expected.
              Room turnover is proceeding at 94% efficiency.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="bg-primary/5 dark:bg-primary/20 px-4 py-2 rounded-lg">
                <span className="block text-xs text-[#616e89] font-semibold uppercase">Total Occupancy</span>
                <span className="text-xl font-bold text-primary">82%</span>
              </div>
              <div className="bg-success/5 dark:bg-success/20 px-4 py-2 rounded-lg">
                <span className="block text-xs text-[#616e89] font-semibold uppercase">Active Staff</span>
                <span className="text-xl font-bold text-success">48 On-Duty</span>
              </div>
            </div>
          </div>
          <div className="w-full max-w-xs md:max-w-[300px] aspect-video rounded-lg overflow-hidden relative group">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              data-alt="Conference hall stage with lighting and screens"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDKbZxD21XGZETliznl2BY0ABjw2hTBOlpOCLB3sRRM9QbJO6CqvX5TQgUWjffQQLmFJmyHLRA-Y55VuSg-cYkp6TiNE4gvVedvsGDr6Pw1uN7UEsWTjmGuAjl6kS4MjbfadqG8ms-ta7VxqmIpKaAB4JZTkP-hTiUive76P_qOpVbfbrR0zaqtWi2_RJiUgLcbpjZUgwkCpDYZLce9q97y5u_VL95jS4rhgBao5iDZx212pAiSU_NUnMeGdMz7FtzA8TjhfCxLCFb" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-white text-xs font-bold uppercase flex items-center gap-1">
                <span className="size-2 rounded-full bg-red-500"></span> Live Camera 1
              </span>
            </div>
          </div>
        </div>
        {/* <!-- Stats Widgets --> */}
        <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-[#616e89] uppercase tracking-wider">Check-in Velocity</span>
            <span className="material-symbols-outlined text-primary">speed</span>
          </div>
          <div className="text-3xl font-black text-[#111318] dark:text-white">142<span
              className="text-sm font-normal text-[#616e89] ml-1">guests/hr</span></div>
          <div className="mt-4 w-full bg-neutral-soft dark:bg-[#2d364a] h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[78%] rounded-full"></div>
          </div>
          <p className="text-xs text-[#616e89] mt-3 flex items-center gap-1">
            <span className="material-symbols-outlined text-success text-sm font-bold">trending_up</span>
            12% increase from last hour
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-[#616e89] uppercase tracking-wider">Pending Service</span>
            <span className="material-symbols-outlined text-orange-500">pending_actions</span>
          </div>
          <div className="text-3xl font-black text-[#111318] dark:text-white">24<span
              className="text-sm font-normal text-[#616e89] ml-1">requests</span></div>
          <div className="mt-4 flex -space-x-2">
            <div className="size-8 rounded-full border-2 border-white dark:border-[#1a1f2e] bg-cover bg-center"
              data-alt="Staff profile photo"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAh50bXx9WYztqp2R_yd1-0Oxn59mpvEGLlL3eJEL1-igPlzei14pP4gzZgfo97PFFCikX8qHHK5YWbSS_a7nZahrjExoCTXJ5CSDKjtQjucWAS7j24yWBN4fSug1Tr0kdU6DoiMdBclxszGYS9Qp0nSBlF62RbeJ331OYCH7jScsKAwhdts6ygbHPTdjFhbWMQuDe7eErm7fTRLyxw563qxe0YKYM8bqRpvftLuUclOBR0kG0d_eqHPHauSUK_9qBKWA5nfiIvnqa9")'}}>
            </div>
            <div className="size-8 rounded-full border-2 border-white dark:border-[#1a1f2e] bg-cover bg-center"
              data-alt="Staff profile photo"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD5tJ4HKbBqZG2H_lfRaZSgBD6PAB0WKYgAXaFLAnNxISd3no3Eq2VmyaVfLsftIWcxbEthCQfRlHOrNCrAJRzLB9R_DNitDSN1SBsb7LA5D4U1jzeBOgwo0A2WVY8qh0rg-jnFRQVb8sjiFYPuLNcd-BJkSRhUrwrwk4PpnFvX_hg3hYkR_qAIjF923n0fl5PtbtMk2foiMlbd0dKzdA2TRf6QoY8aHQj9lZZ2KOOsFLcyqA8eBiEPiIjpWlGcSqwex52icczBdSqW")'}}>
            </div>
            <div className="size-8 rounded-full border-2 border-white dark:border-[#1a1f2e] bg-cover bg-center"
              data-alt="Staff profile photo"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHMBVaVpTe9Wnv_boeC-qcJPJLOlIzKZFpYfbLC8rArnUA5y7BqOrG1syEa8tTjNxQTKODadwkyxiWwzMngoy9owWmq11qyluEeH1-wQlS85wCoU6pH7b3S-YDAI9zXmpIeYzFqmGxLbawsDqGl2Xp6kQinAaL2cxYhRXIhZSkhfo1SidjRSH8XrFmnszyojFMGEZ35nF3kASh5gXRDK224iFm9HkrraLt5q6rTXlHmPk9x3dWuoV8DenNieFSaR4vBbHumbQgx4n8")'}}>
            </div>
            <div
              className="size-8 rounded-full border-2 border-white dark:border-[#1a1f2e] bg-neutral-soft dark:bg-[#2d364a] flex items-center justify-center text-[10px] font-bold text-[#616e89]">
              +21</div>
          </div>
          <p className="text-xs text-[#616e89] mt-3">Priority: <span className="text-orange-600 font-bold uppercase">High</span>
            • Median wait 4m</p>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-[#616e89] uppercase tracking-wider">Transport Load</span>
            <span className="material-symbols-outlined text-indigo-500">directions_bus</span>
          </div>
          <div className="text-3xl font-black text-[#111318] dark:text-white">12<span
              className="text-sm font-normal text-[#616e89] ml-1">shuttles active</span></div>
          <div className="mt-4 w-full bg-neutral-soft dark:bg-[#2d364a] h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[45%] rounded-full"></div>
          </div>
          <p className="text-xs text-[#616e89] mt-3">Next pickup: <span
              className="text-[#111318] dark:text-white font-bold">2:15 PM</span></p>
        </div>
        <div className="bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-[#616e89] uppercase tracking-wider">Reports Ready</span>
            <span className="material-symbols-outlined text-primary">description</span>
          </div>
          <div className="text-3xl font-black text-[#111318] dark:text-white">08</div>
          <button
            className="mt-4 w-full py-2 bg-neutral-soft dark:bg-[#2d364a] hover:bg-neutral-soft/80 dark:hover:bg-[#3d475c] text-xs font-bold text-[#111318] dark:text-white rounded-lg transition-colors">
            View Morning Summary
          </button>
          <p className="text-[10px] text-[#616e89] mt-2 text-center">Auto-generated at 11:30 AM</p>
        </div>
        {/* <!-- Main Activity Table Area --> */}
        <div
          className="col-span-1 md:col-span-3 lg:col-span-4 bg-white dark:bg-[#1a1f2e] border border-[#dbdee6] dark:border-[#2d364a] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#dbdee6] dark:border-[#2d364a] flex items-center justify-between">
            <h3 className="font-bold text-[#111318] dark:text-white">Recent Guest Activity</h3>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded transition-colors text-[#616e89]">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button
                className="p-1.5 hover:bg-neutral-soft dark:hover:bg-[#2d364a] rounded transition-colors text-[#616e89]">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead
                className="bg-background-light dark:bg-[#151a26] text-[11px] font-bold text-[#616e89] uppercase tracking-widest border-b border-[#dbdee6] dark:border-[#2d364a]">
                <tr>
                  <th className="px-6 py-3">Guest Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Room / Location</th>
                  <th className="px-6 py-3">Assigned Staff</th>
                  <th className="px-6 py-3 text-right">Activity Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f4] dark:divide-[#2d364a]">
                <tr className="hover:bg-neutral-soft/30 dark:hover:bg-[#2d364a]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        AA</div>
                      <div>
                        <p className="text-sm font-bold text-[#111318] dark:text-white">Alex Anderson</p>
                        <p className="text-[10px] text-[#616e89]">VIP Speaker</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success uppercase">Checked
                      In</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#616e89]">Suite 405 (North Wing)</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-cover bg-center" data-alt="Staff avatar"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtbo2X5IMGWVj1n2b7aFSKZ9RG-CKYxJACRG2qUvhDnQZP2y9xNIoqGGJuky7T6TXgHyU0TvcdLMoAQwK5Is_RvEM0nm6cOwYspGIlGqLWnFVifKYGC0-qzpxD9VcGhdYqBax8Tq7zRkqE21YX2JcsMmtsGfzdlSd9CVseE2kQlU5KW9XB5HkNsc_PWr4Vb9ZIEM_ChfV2A4nc8k-B9p2LWkx9wiBsJUV6tbxoRn3a91XoPk3kWraf8e2MaTiuVhRbRM4p-X_6_iLw")'}}>
                      </div>
                      <span className="text-xs text-[#111318] dark:text-white font-medium">Michael K.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#616e89] font-medium">12:44 PM</td>
                </tr>
                <tr className="hover:bg-neutral-soft/30 dark:hover:bg-[#2d364a]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        LM</div>
                      <div>
                        <p className="text-sm font-bold text-[#111318] dark:text-white">Lisa Montgomery</p>
                        <p className="text-[10px] text-[#616e89]">Press Delegate</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">Transport
                      Arrived</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#616e89]">Terminal A (Main Entrance)</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-cover bg-center" data-alt="Staff avatar"
                        style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBroyt8jHCH5Dj-xFzqpbUwaY4yXYnYam-cqZIfP2qP2uGKKMlHGVNdS8lIKjhfB27JLUQGQepUWGBiXi0Rbg5UPdlaCIdsTDmwRIoVeusAFh55quN1mMcFI5svCkvs9d_7pSu2CXlQF1xtcEvXKFmuXcwCCnwVsqFNUeBRcB1kJdqTl12EIcgoqTPlt6qCSgUsJ4jBDqeHqsyEkmF_hJy642xgVaJRGOe2RCkjNwqj4CSTwTIvQPQgkk32ZBS8NHfGVPyOWECGJvOy")'}}>
                      </div>
                      <span className="text-xs text-[#111318] dark:text-white font-medium">Elena R.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#616e89] font-medium">12:30 PM</td>
                </tr>
                <tr className="hover:bg-neutral-soft/30 dark:hover:bg-[#2d364a]/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        JW</div>
                      <div>
                        <p className="text-sm font-bold text-[#111318] dark:text-white">James Wilson</p>
                        <p className="text-[10px] text-[#616e89]">Exhibitor</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-600 uppercase">Service
                      Requested</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#616e89]">Hall 2 - Booth #112</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-[#616e89] italic">Unassigned</span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-[#616e89] font-medium">12:28 PM</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="px-6 py-3 bg-background-light dark:bg-[#151a26] border-t border-[#dbdee6] dark:border-[#2d364a] flex items-center justify-between">
            <p className="text-xs text-[#616e89]">Showing 1-10 of 420 guests</p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-white dark:bg-[#2d364a] border border-[#dbdee6] dark:border-[#3d475c] text-xs font-bold rounded hover:bg-neutral-soft transition-colors text-[#111318] dark:text-white">Previous</button>
              <button
                className="px-3 py-1 bg-white dark:bg-[#2d364a] border border-[#dbdee6] dark:border-[#3d475c] text-xs font-bold rounded hover:bg-neutral-soft transition-colors text-[#111318] dark:text-white">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Footer --> */}
    <footer className="w-full max-w-[1440px] mx-auto px-6 py-6 border-t border-[#dbdee6] dark:border-[#2d364a]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#616e89]">
        <p>© 2024 EventOps Hospitality SaaS. All rights reserved.</p>
        <div className="flex gap-6">
          <a className="hover:text-primary" href="#">System Status: <span className="text-success font-bold">Optimal</span></a>
          <a className="hover:text-primary" href="#">Terms of Service</a>
          <a className="hover:text-primary" href="#">Support Desk</a>
        </div>
      </div>
    </footer>
  </div>
  )
}

export default EventWorkspaceShell