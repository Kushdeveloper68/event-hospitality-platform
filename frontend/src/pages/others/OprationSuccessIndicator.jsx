import React from 'react'

function OprationSuccessIndicator() {
  return (
   <div
    className="relative flex h-auto min-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Top Navigation Bar --> */}
      <header
        className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Hospitality Ops
            </h2>
          </div>
          <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div
                className="text-slate-400 flex border-none bg-slate-100 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg"
                data-icon="search">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-0 border-none bg-slate-100 dark:bg-slate-800 placeholder:text-slate-400 px-4 pl-2 text-sm font-normal"
                placeholder="Search events..." value="" />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <nav className="hidden lg:flex items-center gap-8">
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
              href="#">Dashboard</a>
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
              href="#">Events</a>
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
              href="#">Guests</a>
            <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors"
              href="#">Reports</a>
          </nav>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
          <div
            className="bg-slate-200 dark:bg-slate-700 rounded-full size-9 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700"
            data-alt="User profile avatar of the operations manager"
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCklP_N3s0sqFrO1ISTmfLd7k3xax00IKGDUNqYpnGafQN6C54G13tSzmBxCBOjM8FANjE76skdSVDUFuoAulZBeTAy1jdZ22JumiSeWy65nCpyQn9Yk2nR8yq0vAapdv95y6BKf00OmHd3j3xXY77pEUJg4l9Ymzulx-9xKcvDqin1bmWIHlq39fbuDAnTuBi4EGvTMVYChX0ogUFATsCxVhh5LFv3PLtCDZyw9mAIjZW3BZrd5fK47XI2-o7i_GFGX5RGodker5sV")', backgroundSize: "cover"}}>
          </div>
        </div>
      </header>
      {/* <!-- Main Content Area: Centered Success State --> */}
      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50 dark:bg-slate-950">
        <div
          className="max-w-[520px] w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 lg:p-10 flex flex-col items-center text-center">
          {/* <!-- Success Icon Wrapper --> */}
          <div className="mb-6 relative">
            <div className="size-20 rounded-full bg-success/10 flex items-center justify-center">
              <div className="size-14 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
                <span className="material-symbols-outlined text-white text-3xl font-bold">check</span>
              </div>
            </div>
          </div>
          {/* <!-- Message Content --> */}
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Event Created
            Successfully</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-[380px]">
            The <span className="font-semibold text-slate-700 dark:text-slate-200">'Annual Tech Gala'</span> has been added
            to your operations schedule. Your hospitality suite is now live and ready for guest management.
          </p>
          {/* <!-- Preview Thumbnail (Optional Contextual UI) --> */}
          <div className="w-full h-32 mb-8 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden relative group">
            <div className="absolute inset-0 bg-cover bg-center opacity-80"
              data-alt="Corporate gala event hall with blue lighting"
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcqnqx_PE9GPqUECtO09l3YrfngZYfnTDk42I4Bs08qCEEKQcZ6TLLajZxWzUHJdJbymiaKBocrx7mO_XP5YjbI8O3X7SRfoE8A7W80_KUaGTZ_InQtZQssKEuoeTmHJ0__sZ4SXEvmcMO3zvICa3-dTlVBQ9LzXCuf0eAMg3aOzzFMg4-wQ0xHiTaBIGH_xDJ_xiHUmVI_zajvIa8mxwlKCyo275-KJyRAzZSE-CBmrpu2IHGNbANuqqCxt_iwhzcKp112jgtmuS2')"}}>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <div className="absolute bottom-3 left-4 text-left">
              <span
                className="text-[10px] font-bold text-white uppercase tracking-widest bg-primary px-2 py-0.5 rounded mb-1 inline-block">Event
                Live</span>
              <div className="text-white text-xs font-medium">Nov 24, 2024 • Ballroom A</div>
            </div>
          </div>
          {/* <!-- Actions --> */}
          <div className="flex flex-col w-full gap-3">
            <button
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold h-12 rounded-lg transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
              View Event Details
            </button>
            <button
              className="w-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium h-12 rounded-lg transition-colors">
              Return to Calendar
            </button>
          </div>
        </div>
      </main>
      {/* <!-- Footer --> */}
      <footer
        className="flex flex-col gap-4 px-6 py-8 border-t border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          <a className="text-slate-400 dark:text-slate-500 text-sm font-medium hover:text-primary transition-colors"
            href="#">Support</a>
          <a className="text-slate-400 dark:text-slate-500 text-sm font-medium hover:text-primary transition-colors"
            href="#">Privacy Policy</a>
          <a className="text-slate-400 dark:text-slate-500 text-sm font-medium hover:text-primary transition-colors"
            href="#">Terms of Service</a>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 text-xs">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          <p>© 2024 Enterprise SaaS Event Hospitality Management Platform</p>
        </div>
      </footer>
    </div>
  </div>
  )
}

export default OprationSuccessIndicator