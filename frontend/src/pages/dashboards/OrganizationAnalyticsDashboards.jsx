import React from 'react'

function OrganizationAnalyticsDashboards() {
  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* <!-- Top Actions & Title --> */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Performance Overview</p>
            <h1 className="text-3xl font-black text-[#111318] tracking-tight">Organization Analytics</h1>
            <p className="text-[#616e89] text-base mt-1">Cross-event performance metrics for the current fiscal year.</p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-bold text-[#111318] hover:bg-background-light transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">download</span>
              CSV
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              Export PDF
            </button>
          </div>
        </div>
        {/* <!-- Global Filters --> */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white p-3 rounded-xl border border-[#e5e7eb] shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-background-light rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-[#616e89] text-xl">calendar_month</span>
            <span className="text-sm font-semibold text-[#111318]">Date Range: YTD</span>
            <span className="material-symbols-outlined text-[#616e89] text-lg">expand_more</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-background-light rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-[#616e89] text-xl">category</span>
            <span className="text-sm font-semibold text-[#111318]">Event Type: All</span>
            <span className="material-symbols-outlined text-[#616e89] text-lg">expand_more</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-background-light rounded-lg cursor-pointer">
            <span className="material-symbols-outlined text-[#616e89] text-xl">public</span>
            <span className="text-sm font-semibold text-[#111318]">Region: North America</span>
            <span className="material-symbols-outlined text-[#616e89] text-lg">expand_more</span>
          </div>
          <div
            className="ml-auto flex items-center gap-2 px-4 py-2 text-primary text-sm font-bold cursor-pointer hover:underline">
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            More Filters
          </div>
        </div>
        {/* <!-- KPI Cards --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* <!-- Annual Total Guests --> */}
          <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">group</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +12.5%
              </span>
            </div>
            <p className="text-[#616e89] text-sm font-medium">Annual Total Guests</p>
            <h3 className="text-3xl font-black text-[#111318] mt-1">125,400</h3>
            <p className="text-xs text-[#616e89] mt-2">vs 111,460 last year</p>
          </div>
          {/* <!-- Average Satisfaction --> */}
          <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#f59e0b]"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="size-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined">star</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +0.4
              </span>
            </div>
            <p className="text-[#616e89] text-sm font-medium">Average Satisfaction</p>
            <h3 className="text-3xl font-black text-[#111318] mt-1">4.8<span
                className="text-lg font-bold text-[#616e89]">/5.0</span></h3>
            <div className="flex items-center gap-1 mt-2">
              <span
                className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Top
                Performer</span>
            </div>
          </div>
          {/* <!-- Total Event Hours --> */}
          <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#8b5cf6]"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs font-bold">
                <span className="material-symbols-outlined text-xs">trending_down</span>
                -2.1%
              </span>
            </div>
            <p className="text-[#616e89] text-sm font-medium">Total Event Hours</p>
            <h3 className="text-3xl font-black text-[#111318] mt-1">12,240</h3>
            <p className="text-xs text-[#616e89] mt-2">Across 482 global sessions</p>
          </div>
        </div>
        {/* <!-- Main Charts Grid --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* <!-- Multi-line Chart: Guest Check-ins --> */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#111318]">Guest Check-in Volume</h3>
                <p className="text-sm text-[#616e89]">Monthly comparison of arrival traffic</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-semibold text-[#616e89]">Current Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#e5e7eb]"></div>
                  <span className="text-xs font-semibold text-[#616e89]">Previous Year</span>
                </div>
              </div>
            </div>
            {/* <!-- Chart Placeholder Area --> */}
            <div className="relative h-[300px] w-full flex flex-col justify-end">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-[#f3f4f6] h-0 w-full"></div>
                <div className="border-b border-[#f3f4f6] h-0 w-full"></div>
                <div className="border-b border-[#f3f4f6] h-0 w-full"></div>
                <div className="border-b border-[#f3f4f6] h-0 w-full"></div>
                <div className="border-b border-[#f3f4f6] h-0 w-full"></div>
              </div>
              {/* <!-- Mock Visualization --> */}
              <svg className="w-full h-full relative z-10" preserveaspectratio="none" viewbox="0 0 1000 300">
                {/* <!-- Previous Year Line --> */}
                <path
                  d="M0,250 L100,240 L200,260 L300,230 L400,250 L500,210 L600,230 L700,240 L800,220 L900,200 L1000,190"
                  fill="none" stroke="#e5e7eb" stroke-dasharray="8,4" stroke-width="3"></path>
                {/* <!-- Current Year Line --> */}
                <path
                  d="M0,220 L100,200 L200,230 L300,180 L400,190 L500,140 L600,160 L700,130 L800,150 L900,110 L1000,100"
                  fill="none" stroke="#2463eb" stroke-linecap="round" stroke-width="4"></path>
                {/* <!-- Points for Current Year --> */}
                <circle cx="500" cy="140" fill="#2463eb" r="6" stroke="white" stroke-width="2"></circle>
              </svg>
              {/* <!-- X-Axis Labels --> */}
              <div className="flex justify-between mt-4 px-2">
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Jan</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Feb</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Mar</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Apr</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">May</span>
                <span className="text-[10px] font-bold text-primary uppercase">Jun</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Jul</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Aug</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Sep</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Oct</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Nov</span>
                <span className="text-[10px] font-bold text-[#616e89] uppercase">Dec</span>
              </div>
            </div>
          </div>
          {/* <!-- Breakdown: Service Requests --> */}
          <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#111318]">Service Requests</h3>
              <p className="text-sm text-[#616e89]">Total requests by category</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#111318]">Food &amp; Beverage</span>
                  <span className="text-[#616e89]">4,120 (42%)</span>
                </div>
                <div className="w-full bg-background-light rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{width:" 42%"}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#111318]">Technical Support</span>
                  <span className="text-[#616e89]">2,850 (29%)</span>
                </div>
                <div className="w-full bg-background-light rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#8b5cf6] h-full rounded-full" style={{width:" 29%"}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#111318]">Concierge</span>
                  <span className="text-[#616e89]">1,760 (18%)</span>
                </div>
                <div className="w-full bg-background-light rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#10b981] h-full rounded-full" style={{width:" 18%"}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#111318]">Logistics</span>
                  <span className="text-[#616e89]">1,070 (11%)</span>
                </div>
                <div className="w-full bg-background-light rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#f59e0b] h-full rounded-full" style={{width:" 11%"}}></div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#e5e7eb]">
              <button
                className="w-full py-2 flex items-center justify-center gap-2 text-primary font-bold text-sm hover:bg-primary/5 rounded-lg transition-colors">
                View Full Breakdown
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Recent Activity / Event Performance Table --> */}
        <div className="mt-8 bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#e5e7eb] flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111318]">Top Performing Events</h3>
            <button className="text-sm font-bold text-primary hover:underline">View All Events</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-light text-[#616e89] text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Guests</th>
                  <th className="px-6 py-4 text-center">Satisfaction</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-[#f3f4f6] flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-[#616e89]">apartment</span>
                      </div>
                      <span className="text-sm font-semibold text-[#111318]">Global Tech Summit 2024</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#616e89]">San Francisco, CA</td>
                  <td className="px-6 py-4 text-sm text-[#111318] text-center font-medium">12,400</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm fill-current">star</span>
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">Completed</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-[#111318]">$1.2M</td>
                </tr>
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-[#f3f4f6] flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-[#616e89]">medical_services</span>
                      </div>
                      <span className="text-sm font-semibold text-[#111318]">Bio-Innova Expo</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#616e89]">Boston, MA</td>
                  <td className="px-6 py-4 text-sm text-[#111318] text-center font-medium">8,250</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm fill-current">star</span>
                      <span className="text-sm font-bold">4.7</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">In
                      Progress</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-[#111318]">$840K</td>
                </tr>
                <tr className="hover:bg-background-light transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-[#f3f4f6] flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm text-[#616e89]">payments</span>
                      </div>
                      <span className="text-sm font-semibold text-[#111318]">FinTech Leaders Forum</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#616e89]">London, UK</td>
                  <td className="px-6 py-4 text-sm text-[#111318] text-center font-medium">4,100</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-sm fill-current">star</span>
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">Completed</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-[#111318]">$2.4M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

export default OrganizationAnalyticsDashboards