import React from 'react'

function PageNotFound() {
  return (
     <div className="relative flex h-screen w-full flex-col overflow-x-hidden bg-grid-pattern">
    {/* <!-- Header / Navigation --> */}
    <header
      className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white">
          <span className="material-symbols-outlined !text-2xl">event_seat</span>
        </div>
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-tight">EventOps SaaS</h2>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Dashboard</a>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Events</a>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Venues</a>
          <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Reports</a>
        </nav>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
        <div
          className="bg-slate-200 dark:bg-slate-700 rounded-full size-9 overflow-hidden border border-slate-200 dark:border-slate-800">
          <img alt="User Profile Avatar" className="w-full h-full object-cover" data-alt="Professional user profile avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrH9UpaRX-C8-_MqchanvCrh1RAnab4pbWAEvgOZGsxjRQJBVdrhayqwHMhcdAMxFykBNP3318Yl_q2Yejnq_4_PUsr-Uc-vCvtQjyzbmXh6YY-N5DBeEtC2MdUxAfCC0AmuKG8hDOvXUwYEtNqPzv7j_wRvLG4SJ106ma-rVUQXcHbYc1Cu4-za0N4YOIG87r2CG09sMh-SsWborDHjA6Hje6jLWE-eWP5OTGQJcVztK1vAwrg4snPGZRwXcg97M3aYS1cS7N9Mx_" />
        </div>
      </div>
    </header>
    {/* <!-- Main Content --> */}
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* <!-- Background Decorative Elements --> */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-primary/5 rounded-full blur-3xl -z-10">
      </div>
      <div className="max-w-[640px] w-full text-center space-y-8">
        {/* <!-- Large 404 Visual --> */}
        <div className="relative flex flex-col items-center">
          <div
            className="text-[120px] md:text-[180px] font-black leading-none text-slate-200 dark:text-slate-800 tracking-tighter select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center mt-8">
            <div
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined !text-6xl text-primary"
                style={{fontVariationSettings:" 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;"}}>search_off</span>
            </div>
          </div>
        </div>
        {/* <!-- Error Message --> */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Oops! Page not found.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The requested hospitality floor plan or event resource could not be found. It might have been archived or
            the URL has changed.
          </p>
        </div>
        {/* <!-- Action Buttons --> */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a className="flex min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-lg h-14 px-8 bg-primary text-white text-base font-semibold transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            href="#">
            <span className="material-symbols-outlined !text-xl">dashboard</span>
            <span>Back to Dashboard</span>
          </a>
          <a className="flex min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-lg h-14 px-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-base font-semibold transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
            href="#">
            <span className="material-symbols-outlined !text-xl">support_agent</span>
            <span>Contact Support</span>
          </a>
        </div>
        {/* <!-- Quick Links --> */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto">
          <div
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <span className="material-symbols-outlined text-slate-400">calendar_today</span>
            <a className="text-sm font-medium text-primary hover:underline" href="#">Active Events</a>
          </div>
          <div
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <span className="material-symbols-outlined text-slate-400">room</span>
            <a className="text-sm font-medium text-primary hover:underline" href="#">Venue List</a>
          </div>
          <div
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <span className="material-symbols-outlined text-slate-400">help</span>
            <a className="text-sm font-medium text-primary hover:underline" href="#">Help Center</a>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Footer Footer --> */}
    <footer
      className="mt-auto px-10 py-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-slate-500 dark:text-slate-500">© 2024 EventOps Solutions Inc. All rights reserved.</p>
      <div className="flex items-center gap-6">
        <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Privacy Policy</a>
        <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">Security</a>
        <a className="text-xs text-slate-500 hover:text-primary transition-colors" href="#">System Status</a>
      </div>
    </footer>
  </div>
  )
}

export default PageNotFound