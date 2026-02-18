import React from 'react'

function UnauthorizedAccessWarning() {
  return (
    <>
     <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
    <div className="layout-container flex h-full grow flex-col">
      {/* <!-- Top Navigation Bar --> */}
      <header
        className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 bg-white dark:bg-background-dark px-10 py-3">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary" style={{fontSize: "20px"}}>layers</span>
          </div>
          <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">EventOps SaaS
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <a className="text-[#111318] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Dashboard</a>
            <a className="text-[#111318] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Events</a>
            <a className="text-[#111318] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Operations</a>
            <a className="text-[#111318] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary transition-colors"
              href="#">Reports</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-primary/20"
              dataAlt="User profile avatar of an operations manager"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDw1teDAi6CBHDiNE3XH77aiWkGITOZEJ9Ups6wxh7thBERF5Dun6j6lNo6tyLOUIU1RtydN7QXbDFjhI6sAIGDX__p3tRYk7HvWz3klKLkOzkp8Uc0mcxVndBjds4Vn7XDmGJsufeTyawv8wK7QqxzVT7L-b_gjPhJw5Z_7G9apIA4ZqoAGInbiSkpy8wodqaD8mhaip6euasjQpfrMdJw2NISBWHQv5gq9CR8gly1yyMVMzgcOGqckPcd4qeD6kU_dm--CHXDr0j1")'}}>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Main Content Area --> */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div
          className="max-w-[560px] w-full bg-white dark:bg-[#1a202c] rounded-xl shadow-sm border border-primary/5 p-8 md:p-12 text-center">
          {/* <!-- Warning Icon --> */}
          <div
            className="mb-8 inline-flex items-center justify-center size-20 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">
            <span className="material-symbols-outlined" style={{fontSize: "48px"}}>lock_person</span>
          </div>
          {/* <!-- Heading --> */}
          <h1 className="text-[#111318] dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-4">
            Access Denied
          </h1>
          {/* <!-- Description --> */}
          <p className="text-[#4b5563] dark:text-gray-400 text-base font-normal leading-relaxed mb-10">
            You do not have the necessary permissions to view this resource. This could be due to your assigned role, an
            expired link, or restricted workspace settings. If you believe this is an error, please contact your systems
            administrator.
          </p>
          {/* <!-- Action Buttons --> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-all shadow-md active:scale-95">
              <span className="truncate">Go to Dashboard</span>
            </button>
            <button
              className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-background-light dark:bg-background-dark border border-primary/10 text-[#111318] dark:text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95">
              <span className="truncate">Contact Support</span>
            </button>
          </div>
          {/* <!-- Decorative Background Element --> */}
          <div
            className="mt-12 pt-8 border-t border-primary/5 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            Security Protocol v4.2
          </div>
        </div>
      </main>
      {/* <!-- Footer Section --> */}
      <footer className="flex flex-col gap-6 px-10 py-10 text-center @container border-t border-primary/5">
        <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
          <a className="text-[#616e89] hover:text-primary transition-colors text-sm font-medium leading-normal min-w-40"
            href="#">Terms of Service</a>
          <a className="text-[#616e89] hover:text-primary transition-colors text-sm font-medium leading-normal min-w-40"
            href="#">Privacy Policy</a>
          <a className="text-[#616e89] hover:text-primary transition-colors text-sm font-medium leading-normal min-w-40"
            href="#">Help Center</a>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[#616e89] text-sm font-normal leading-normal">© 2024 EventOps Management Platform. All rights
            reserved.</p>
          <div className="flex items-center gap-1 text-[#616e89]/50">
            <span className="material-symbols-outlined text-[12px]">security</span>
            <span className="text-[10px]">ENCRYPTED ENTERPRISE ENVIRONMENT</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
  {/* <!-- Background Pattern --> */}
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
  </div></>
  )
}

export default UnauthorizedAccessWarning