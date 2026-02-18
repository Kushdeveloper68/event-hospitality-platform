import React from 'react'

function TransportCoordinationLogs() {
  return (
     <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Top Navigation --> */}
      <header
        className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-10 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Event Logistics Pro</h2>
          </div>
          <nav className="flex items-center gap-9">
            <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Dashboard</a>
            <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Guests</a>
            <a className="text-primary text-sm font-bold border-b-2 border-primary py-1" href="#">Transport</a>
            <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Venues</a>
            <a className="text-slate-500 hover:text-primary text-sm font-medium transition-colors" href="#">Reports</a>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <label className="flex flex-col min-w-40 h-10 max-w-64">
            <div
              className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 bg-slate-50 focus-within:border-primary transition-all">
              <div className="text-slate-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 placeholder:text-slate-400 px-4 pl-2 text-sm font-normal"
                placeholder="Search guests, drivers..." value="" />
            </div>
          </label>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">Operations Team</p>
              <p className="text-[10px] text-slate-500">Admin Account</p>
            </div>
            <div className="bg-primary/10 rounded-full size-10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Main Content Section --> */}
      <main className="flex flex-1 flex-col items-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6">
          {/* <!-- Page Header Area --> */}
          <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-bold uppercase tracking-wider">Live Monitoring</span>
              </div>
              <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Transport Coordination Log
              </h1>
              <p className="text-slate-500 text-base font-normal">Currently tracking <span className="text-primary font-bold">42
                  active</span> guest movements across 12 vehicles.</p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all">
                <span className="material-symbols-outlined">download</span>
                <span>Export CSV</span>
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all">
                <span className="material-symbols-outlined">add</span>
                <span>Add Transport</span>
              </button>
            </div>
          </div>
          {/* <!-- Metrics / Status Row --> */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase">Fleet Capacity</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-900">82%</span>
                <span className="text-green-600 text-xs font-bold flex items-center">+4%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1">
                <div className="h-full bg-primary rounded-full" style={{width: "82%"}}></div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase">Average Wait</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-900">6.4m</span>
                <span className="text-slate-400 text-xs font-bold italic">Normal</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1">
                <div className="h-full bg-emerald-500 rounded-full" style={{width: "45%"}}></div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase">Delayed Trips</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-900">03</span>
                <span className="text-red-500 text-xs font-bold flex items-center">Check</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1">
                <div className="h-full bg-red-500 rounded-full" style={{width: "15%"}}></div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-2">
              <span className="text-slate-500 text-xs font-bold uppercase">Completed Today</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-black text-slate-900">148</span>
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1">
                <div className="h-full bg-primary/30 rounded-full" style={{width: "100%"}}></div>
              </div>
            </div>
          </div>
          {/* <!-- Tabs & Filters --> */}
          <div className="bg-white rounded-t-xl border-x border-t border-slate-200 px-4">
            <div className="flex items-center justify-between border-b border-slate-100">
              <div className="flex gap-8">
                <a className="border-b-2 border-primary text-primary py-4 text-sm font-bold flex items-center gap-2"
                  href="#">
                  <span>All Trips</span>
                  <span className="bg-primary/10 text-[10px] px-1.5 rounded-full">42</span>
                </a>
                <a className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 py-4 text-sm font-bold flex items-center gap-2"
                  href="#">
                  <span>Scheduled</span>
                  <span className="bg-slate-100 text-[10px] px-1.5 rounded-full text-slate-400">12</span>
                </a>
                <a className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 py-4 text-sm font-bold flex items-center gap-2"
                  href="#">
                  <span>In Transit</span>
                  <span className="bg-blue-50 text-[10px] px-1.5 rounded-full text-primary">24</span>
                </a>
                <a className="border-b-2 border-transparent text-slate-500 hover:text-slate-700 py-4 text-sm font-bold flex items-center gap-2"
                  href="#">
                  <span>Arrived</span>
                  <span className="bg-slate-100 text-[10px] px-1.5 rounded-full text-slate-400">06</span>
                </a>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-1 text-slate-500 text-sm font-medium hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  <span>Filter</span>
                </button>
                <button
                  className="flex items-center gap-1 text-slate-500 text-sm font-medium hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">sync</span>
                  <span className="text-[10px]">Updated 2m ago</span>
                </button>
              </div>
            </div>
          </div>
          {/* <!-- Table Content --> */}
          <div
            className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm shadow-slate-200/50 @container">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-64">Guest Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Route Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Driver</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Status &amp;
                    Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40 text-right">Timing
                  </th>
                  <th className="px-6 py-4 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* <!-- Row 1: In Transit --> */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs border border-primary/20">
                        AT</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">Alex Thompson</p>
                        <p className="text-[11px] text-slate-500 mt-1">ID: #GST-9421</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">Airport (LHR)</span>
                      <span className="material-symbols-outlined text-slate-300 text-sm">trending_flat</span>
                      <span className="text-sm font-medium text-slate-700">Ritz Carlton</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">map</span> Zone 4, Terminal 5
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-200">
                        <img className="rounded-full size-full object-cover"
                          data-alt="Professional driver portrait headshot"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3LZODC2JqSOQjZEMy44vc_oycvUFaCN_NW3hB3ZBxt7g1VqVj9G6CkcsmvIO6mzeRLFQ0OL4W6zA3IPJO5aCHCByOxXs4t0itZgkAPWtkq6dc2lNRpqhIm57gOq_yL7rDYipc3dDdrgYQ76nJBebEBPC0_8zFcCjkdDMCbuQEq7pdpDbpQEKZx3SU94GoonUIMNCwoXn8dyQmv0JF0KSzNw1L_Bvhr2p0LjIE_kemKSRxw2zvC7Lcj607MhMykPOrlHFm3a6d6Jy-" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">John Doe</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit status-badge-transit">In
                        Transit</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{width:"73%"}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-900">73%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-slate-900">14:20</p>
                    <p className="text-[10px] text-emerald-600 font-bold">On Time</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 2: Scheduled --> */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold text-xs border border-slate-200">
                        SJ</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">Sarah Jenkins</p>
                        <p className="text-[11px] text-slate-500 mt-1">ID: #GST-8812</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">Grand Hall</span>
                      <span className="material-symbols-outlined text-slate-300 text-sm">trending_flat</span>
                      <span className="text-sm font-medium text-slate-700">Marriott Central</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">room</span> Main Entrance
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-200 overflow-hidden">
                        <img className="rounded-full size-full object-cover" data-alt="Professional driver male portrait"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIawyBNBcrIVLu2_MTwn0oGWqmreW3NQvA9amYcAOjo2I21x8OrmpPBipS0uvZPBa-jVTJHE98SLZS3I5IDdF3JF5dAsONSru-M7Xy2Ul7dmNaVAWIapR29krFG8eAy4brSCkkAcoiQn4nbqNlzr_EjGz0ZM4MLnNoiqPHye1GTH4JKMZnPN4ZXG2IAh4hOxcVlrKQKG0iniCC6MIZj54Wqo2xRUcA2R7akXiVWzPYI51-hyrYnwuXvMn4dC2r-kU8qp8NAdTAK4ec" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Robert Smith</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit status-badge-scheduled">Scheduled</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-300" style={{width: "0%"}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">0%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-slate-900">15:00</p>
                    <p className="text-[10px] text-slate-400 font-bold">Planned</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 3: Delayed --> */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xs border border-red-200">
                        MC</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">Michael Chen</p>
                        <p className="text-[11px] text-slate-500 mt-1">ID: #GST-1032</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">Ritz Carlton</span>
                      <span className="material-symbols-outlined text-slate-300 text-sm">trending_flat</span>
                      <span className="text-sm font-medium text-slate-700">Convention Ctr</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">traffic</span> High Traffic Detected
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-200 overflow-hidden">
                        <img className="rounded-full size-full object-cover" data-alt="Portrait of an experienced chauffeur"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1h7u9I4zPjPqM4oFxzba1qlvZhJUjASYq_S-Ivi5QPTnkBPI6qJaCir5oS2IlBK_7Neue3FVByxbIktYORDTetg-Glznh7k5KwXyf3XyebQpdqHRdm9ehEyFhX7_hlughaoIN1NM8MRH3dEWPJx65K7RW2RrLumlAw3uDovoVvVqwO2IiTQHKQUaHIgUJwqLEfp8Kc8iYqY1a0fAqgYp4ZqwpfQWWj9KKSmGxcfJgXEnJvkKaNgW6w7ptoVYdj6wJoTT0A1CYjgq9" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">David Wilson</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit status-badge-delayed">Delayed</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{width: "30%"}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-red-600">30%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-red-600">14:45</p>
                    <p className="text-[10px] text-red-400 font-bold">+15m Delay</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
                {/* <!-- Row 4: Arrived --> */}
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs border border-emerald-200">
                        ER</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">Elena Rodriguez</p>
                        <p className="text-[11px] text-slate-500 mt-1">ID: #GST-4450</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">Airport (LHR)</span>
                      <span className="material-symbols-outlined text-slate-300 text-sm">trending_flat</span>
                      <span className="text-sm font-medium text-slate-700">Hilton Garden</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span> Hand-off complete
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-200 overflow-hidden">
                        <img className="rounded-full size-full object-cover"
                          data-alt="Professional driver male portrait smiling"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJGA0-vkXC9bbTK9HY_UFM0E61PFh0gTpwRph4eTpnfsvF4aJryEcwQOFP7_iQPQjHfYelm7O-LH5CPncXZTqijliH99XfPHQ5-ckpO9gc2Edrj6I-r4X_p3gmNzrN-hyxZYH4o8e_lGhSPBK2tcW9ozh6ktu-e8BjkZc5eNwGmflVSLm5zlf30YXralrZYuZr6WecdVlBPNKamfJAKBPrX58TRTJnGDjol8P8vqgNjJUeV-oXdMx53L6FqjJNt9gNlaCTx_-DbTFm" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">James Bond</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <span
                        className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit status-badge-arrived">Arrived</span>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{width: "100%"}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">100%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <p className="text-sm font-bold text-slate-900">13:55</p>
                    <p className="text-[10px] text-slate-400 font-bold italic">Actual</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* <!-- Pagination --> */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Showing 1-10 of 42 trips</span>
              <div className="flex gap-1">
                <button
                  className="h-8 w-8 rounded flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  className="h-8 w-8 rounded flex items-center justify-center border border-primary bg-primary text-white text-xs font-bold">1</button>
                <button
                  className="h-8 w-8 rounded flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors text-xs font-bold">2</button>
                <button
                  className="h-8 w-8 rounded flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors text-xs font-bold">3</button>
                <button
                  className="h-8 w-8 rounded flex items-center justify-center border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          {/* <!-- Live Map Section Mini-Teaser --> */}
          <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-6">
            <div className="size-20 rounded-lg bg-slate-100 flex items-center justify-center relative overflow-hidden">
              <img className="object-cover size-full opacity-50" data-alt="Abstract map visualization of London streets"
                data-location="London"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo8sdM_b6OTuzMKhdN39AMebKkSysRtWcmA4xsgfZxPpdXwX_grQ3kHx-oseEqsdJaWA4FtoHWAP-D-ZbPDCyajcISYwQ44raVn2xzH9c-4SYhwkgMuN9ZDfLlEIRsYyZ1Q-VqDivG_U8hZZ81_7I_R4MTZZqYwVy-D554FQpVMWK3997uaBuS3HSYhwMePQfrp2FVhOXLjG6LyZa8dVy9770GsOxpaPkXd6IA0e4_sWz5SiZkAOpaBDTlY0PxFwL-6MMyz9aKHooN" />
              <span className="material-symbols-outlined text-primary text-3xl absolute z-10">map</span>
            </div>
            <div className="flex-1">
              <h4 className="text-slate-900 font-bold text-lg leading-tight">Interactive Fleet Map</h4>
              <p className="text-slate-500 text-sm">Switch to visual tracking mode to see all active vehicles on a live GPS
                map with traffic overlays.</p>
            </div>
            <button
              className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 transition-all flex items-center gap-2">
              <span>Open Fleet Map</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>
      </main>
      {/* <!-- Page Footer --> */}
      <footer className="mt-auto px-10 py-6 border-t border-slate-200 bg-white">
        <div className="flex flex-wrap justify-between items-center max-w-[1200px] mx-auto w-full">
          <p className="text-slate-400 text-xs">© 2024 Event Logistics Pro. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-slate-400 hover:text-primary text-xs font-medium" href="#">Privacy Policy</a>
            <a className="text-slate-400 hover:text-primary text-xs font-medium" href="#">Terms of Service</a>
            <a className="text-slate-400 hover:text-primary text-xs font-medium" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
  )
}

export default TransportCoordinationLogs