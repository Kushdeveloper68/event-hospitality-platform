import React from 'react'

function CheckInOprationDesk() {
  return (
    <>
     {/* <!-- Top Navigation Bar --> */}
  
  <main className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-64px)] overflow-hidden">
    {/* <!-- Dashboard Operations Grid --> */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
      {/* <!-- Column 1: Arriving Today --> */}
      <section
        className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <header
          className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Arriving Today</h2>
          </div>
          <span
            className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full">84</span>
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* <!-- Guest Card --> */}
          <div
            className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Alex Johnson
                  <span
                    className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase font-black">VIP</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">TechCorp Solutions</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">09:30
                AM</span>
            </div>
            <button
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              Check-in
            </button>
          </div>
          {/* <!-- Guest Card --> */}
          <div
            className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Maria Garcia</h3>
                <p className="text-xs text-slate-500 font-medium">Global Logistics Inc</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">09:45
                AM</span>
            </div>
            <button
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              Check-in
            </button>
          </div>
          {/* <!-- Guest Card --> */}
          <div
            className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Sarah Chen</h3>
                <p className="text-xs text-slate-500 font-medium">Design Studio X</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">10:00
                AM</span>
            </div>
            <button
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              Check-in
            </button>
          </div>
          {/* <!-- Repeat for more items --> */}
        </div>
      </section>
      {/* <!-- Column 2: Currently Checked-in --> */}
      <section
        className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <header
          className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/30 dark:bg-emerald-900/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Checked-in</h2>
          </div>
          <span
            className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">142</span>
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
          {/* <!-- Guest Card: Checked In --> */}
          <div
            className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">James Smith</h3>
                <p className="text-xs text-slate-500 font-medium">Innovation Hub</p>
              </div>
              <span
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded">ON-SITE</span>
            </div>
            <button
              className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Check-out
            </button>
          </div>
          <div
            className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Robert Taylor</h3>
                <p className="text-xs text-slate-500 font-medium">Build Co</p>
              </div>
              <span
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded">ON-SITE</span>
            </div>
            <button
              className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Check-out
            </button>
          </div>
          <div
            className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 transition-all opacity-80">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Emily Blunt</h3>
                <p className="text-xs text-slate-500 font-medium">Talent Agency</p>
              </div>
              <span
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded">ON-SITE</span>
            </div>
            <button
              className="w-full border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Check-out
            </button>
          </div>
        </div>
      </section>
      {/* <!-- Column 3: Pending Arrivals --> */}
      <section
        className="flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <header
          className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/30 dark:bg-amber-900/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">warning</span>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Pending Arrivals</h2>
          </div>
          <span
            className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">27</span>
        </header>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* <!-- Guest Card: Action Needed / Late --> */}
          <div
            className="group p-4 bg-amber-50/40 dark:bg-amber-900/5 border border-amber-200 dark:border-amber-900/30 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  David Miller
                  <span className="material-symbols-outlined text-amber-500 text-[16px]">priority_high</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Summit Partners</p>
              </div>
              <span
                className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">LATE</span>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                Call
              </button>
              <button
                className="flex-[2] bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
                Check-in
              </button>
            </div>
          </div>
          <div className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Lisa Wong</h3>
                <p className="text-xs text-slate-500 font-medium">Fintech Flow</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">11:30
                AM</span>
            </div>
            <button
              className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
              Pre-Verify
            </button>
          </div>
          {/* <!-- Empty State Example --> */}
          <div
            className="mt-8 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">info</span>
            <p className="text-sm font-medium text-slate-400">No more pending<br />urgent arrivals</p>
          </div>
        </div>
      </section>
    </div>
  </main>
  {/* <!-- Operational Footer (Hotkeys Tip) --> */}
  <footer
    className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 py-2 px-6">
    <div
      className="max-w-[1600px] mx-auto flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1"><kbd
            className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">CTRL +
            S</kbd> Search</span>
        <span className="flex items-center gap-1"><kbd
            className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">ENTER</kbd>
          Quick Check-in</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-emerald-500">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
          System Online
        </span>
        <span>V2.4.1 Ops-Stable</span>
      </div>
    </div>
  </footer></>
  )
}

export default CheckInOprationDesk