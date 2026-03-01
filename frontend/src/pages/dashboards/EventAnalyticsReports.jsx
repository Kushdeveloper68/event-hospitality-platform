import React from 'react'

function EventAnalyticsReports() {
  return (
    <div className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {/* <!-- Title & Actions --> */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight text-[#111318]">Event Analytics &amp; Reports</h2>
            <p className="text-[#616e89]">Operational performance and guest behavior insights for Q3 Global Summit.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f0f1f4] rounded-lg text-sm font-semibold hover:bg-background-light transition-colors">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>Last 30 Days</span>
            </button>
            <div className="flex">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-l-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Export Report</span>
              </button>
              <button
                className="px-2 bg-primary text-white border-l border-white/20 rounded-r-lg hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
              </button>
            </div>
          </div>
        </div>
        {/* <!-- KPI Cards --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#f0f1f4] shadow-sm">
            <p className="text-xs font-bold text-[#616e89] uppercase tracking-wider mb-1">Total Attendees</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">12,482</span>
              <span className="text-xs font-bold text-green-600 flex items-center">+12% <span
                  className="material-symbols-outlined text-xs">trending_up</span></span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#f0f1f4] shadow-sm">
            <p className="text-xs font-bold text-[#616e89] uppercase tracking-wider mb-1">Peak Occupancy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">88%</span>
              <span className="text-xs font-bold text-[#616e89] flex items-center">Stable <span
                  className="material-symbols-outlined text-xs">remove</span></span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#f0f1f4] shadow-sm">
            <p className="text-xs font-bold text-[#616e89] uppercase tracking-wider mb-1">Avg. Check-in Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">42s</span>
              <span className="text-xs font-bold text-green-600 flex items-center">-15% <span
                  className="material-symbols-outlined text-xs">trending_down</span></span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#f0f1f4] shadow-sm">
            <p className="text-xs font-bold text-[#616e89] uppercase tracking-wider mb-1">Net Promoter Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">74</span>
              <span className="text-xs font-bold text-green-600 flex items-center">+4 <span
                  className="material-symbols-outlined text-xs">trending_up</span></span>
            </div>
          </div>
        </div>
        {/* <!-- Charts Section --> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <!-- Bar Chart: Guest Demographics --> */}
          <div className="bg-white p-6 rounded-xl border border-[#f0f1f4] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#111318]">Guest Demographics by Industry</h3>
              <button className="material-symbols-outlined text-[#616e89]">more_vert</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Technology</span>
                  <span className="text-[#616e89]">45%</span>
                </div>
                <div className="w-full bg-background-light h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{width: "45%"}}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Healthcare</span>
                  <span className="text-[#616e89]">28%</span>
                </div>
                <div className="w-full bg-background-light h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary/70 h-full rounded-full" style={{width:" 28%"}}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Finance &amp; Banking</span>
                  <span className="text-[#616e89]">18%</span>
                </div>
                <div className="w-full bg-background-light h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary/50 h-full rounded-full" style={{width:" 18%"}}></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Education</span>
                  <span className="text-[#616e89]">9%</span>
                </div>
                <div className="w-full bg-background-light h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary/30 h-full rounded-full" style={{width: "9%"}}></div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Pie Chart: Room Usage --> */}
          <div className="bg-white p-6 rounded-xl border border-[#f0f1f4] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#111318]">Room Usage Distribution</h3>
              <button className="material-symbols-outlined text-[#616e89]">more_vert</button>
            </div>
            <div className="flex items-center justify-center py-4 relative">
              {/* <!-- Custom CSS Donut Chart Implementation --> */}
              <div
                className="size-48 rounded-full border-[16px] border-[#f0f1f4] relative flex items-center justify-center">
                <svg className="absolute inset-0 size-full -rotate-90" viewbox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="42" stroke="#2463eb" stroke-dasharray="184 264"
                    stroke-dashoffset="0" stroke-width="16"></circle>
                  <circle cx="50" cy="50" fill="transparent" r="42" stroke="#2463eb80" stroke-dasharray="52 264"
                    stroke-dashoffset="-184" stroke-width="16"></circle>
                  <circle cx="50" cy="50" fill="transparent" r="42" stroke="#2463eb40" stroke-dasharray="28 264"
                    stroke-dashoffset="-236" stroke-width="16"></circle>
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black">82%</span>
                  <span className="text-[10px] uppercase font-bold text-[#616e89]">Avg. Load</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-8">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-[#616e89]">Main Hall (70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary/50"></div>
                  <span className="text-xs font-medium text-[#616e89]">VIP Lounge (20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary/20"></div>
                  <span className="text-xs font-medium text-[#616e89]">Workshop A (10%)</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Line Chart: Check-in Speed --> */}
          <div className="bg-white p-6 rounded-xl border border-[#f0f1f4] shadow-sm lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="font-bold text-[#111318]">Check-in Speed Velocity</h3>
                <p className="text-xs text-[#616e89]">Seconds per guest vs Arrival volume</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-2 py-1 bg-background-light rounded border border-[#f0f1f4]">
                  <div className="size-2 bg-primary rounded-full"></div>
                  <span className="text-[10px] font-bold uppercase">Time (sec)</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-background-light rounded border border-[#f0f1f4]">
                  <div className="size-2 bg-slate-300 rounded-full"></div>
                  <span className="text-[10px] font-bold uppercase">Volume</span>
                </div>
              </div>
            </div>
            <div className="h-64 w-full relative pt-4">
              {/* <!-- Simulated Area Chart --> */}
              <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-4">
                {/* <!-- Chart bars for background volume --> */}
                <div className="w-12 bg-slate-100 h-[20%] rounded-t"></div>
                <div className="w-12 bg-slate-100 h-[40%] rounded-t"></div>
                <div className="w-12 bg-slate-100 h-[80%] rounded-t"></div>
                <div className="w-12 bg-slate-100 h-[95%] rounded-t"></div>
                <div className="w-12 bg-slate-100 h-[60%] rounded-t"></div>
                <div className="w-12 bg-slate-100 h-[30%] rounded-t"></div>
                <div className="w-12 bg-slate-100 h-[10%] rounded-t"></div>
              </div>
              {/* <!-- Simulated Trend Line --> */}
              <svg className="absolute inset-0 size-full" preserveaspectratio="none">
                <path d="M 0 200 Q 150 180 300 120 T 600 80 T 900 140 T 1200 190" fill="transparent" stroke="#2463eb"
                  stroke-linecap="round" stroke-width="3"></path>
                <circle cx="300" cy="120" fill="white" r="4" stroke="#2463eb" stroke-width="2"></circle>
                <circle cx="600" cy="80" fill="white" r="4" stroke="#2463eb" stroke-width="2"></circle>
              </svg>
              {/* <!-- Tooltip Example --> */}
              <div
                className="absolute top-10 left-[48%] bg-[#111318] text-white text-[10px] p-2 rounded shadow-lg flex flex-col items-center">
                <span className="font-bold">Peak Arrival</span>
                <span>38s check-in</span>
              </div>
              {/* <!-- X-axis Labels --> */}
              <div
                className="absolute -bottom-6 left-0 right-0 flex justify-between px-4 text-[10px] font-bold text-[#616e89]">
                <span>08:00 AM</span>
                <span>10:00 AM</span>
                <span>12:00 PM</span>
                <span>02:00 PM</span>
                <span>04:00 PM</span>
                <span>06:00 PM</span>
                <span>08:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Detailed Metrics Table Preview --> */}
        <div className="bg-white rounded-xl border border-[#f0f1f4] shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-[#f0f1f4] flex items-center justify-between">
            <h3 className="font-bold text-[#111318]">Detailed Performance Log</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All Records</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background-light text-[11px] font-black text-[#616e89] uppercase tracking-wider">
                  <th className="px-6 py-4">Venue Zone</th>
                  <th className="px-6 py-4">Staff Active</th>
                  <th className="px-6 py-4">Current Capacity</th>
                  <th className="px-6 py-4">Alert Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f1f4] text-sm">
                <tr className="hover:bg-background-light/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">Grand Ballroom North</td>
                  <td className="px-6 py-4">24</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full" style={{width:" 92%"}}></div>
                      </div>
                      <span className="text-xs font-bold text-red-600">92%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">CRITICAL</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-[#616e89]">open_in_new</button>
                  </td>
                </tr>
                <tr className="hover:bg-background-light/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">Exhibition Pavilion</td>
                  <td className="px-6 py-4">12</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{width: "45%"}}></div>
                      </div>
                      <span className="text-xs font-bold text-green-600">45%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">OPTIMAL</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-[#616e89]">open_in_new</button>
                  </td>
                </tr>
                <tr className="hover:bg-background-light/50 transition-colors">
                  <td className="px-6 py-4 font-semibold">Registration Desk</td>
                  <td className="px-6 py-4">8</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{width:" 65%"}}></div>
                      </div>
                      <span className="text-xs font-bold text-primary">65%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">STABLE</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-[#616e89]">open_in_new</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

export default EventAnalyticsReports