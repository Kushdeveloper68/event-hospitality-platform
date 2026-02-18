import React from 'react'

function LogoutConfirmation() {
  return (
  //  <!-- Main Layout Container (Mock Dashboard Background) -->
  <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
    {/* <!-- Top Navigation Bar --> */}
    <header
      className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3 lg:px-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-primary">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">event_seat</span>
          </div>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Event Hospitality
          </h2>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Dashboard</a>
          <a className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Events</a>
          <a className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Operations</a>
          <a className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors"
            href="#">Reports</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 gap-2 border border-transparent focus-within:border-primary transition-all">
          <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 w-48"
            placeholder="Search operations..." type="text" />
        </div>
        <div
          className="size-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
          <img alt="User Profile" className="w-full h-full object-cover" data-alt="Professional user profile avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbKt7kpUNj2K0-0JQQ3rXxRt6pFBXULldr6rsigt2hIa_WpVGhNfYTPtX0geQA8lE0zyBSoVHXrt2f9dGTsByKGg4oD4FmcbEb-K_X8OxlHd8cjoEDRq6P2ol_sOxLwQESXMJtN-31Ac1KlGsBIwK-4Pyn-skXEXsT67Rf9bh6DeN2ydUcDn5mQgvL_fv0aBCuCLRLEqM_k0dKvo2O8toY1QghS3binIIEfXrQ56IJzVWTq2sjnaEA6TSe1Y4LmIknq_Ze3o6utwQ-" />
        </div>
      </div>
    </header>
    {/* <!-- Page Content Mockup (Blurred) --> */}
    <main className="flex-1 p-6 lg:p-10 filter blur-sm transition-all duration-500 pointer-events-none">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Operations Overview</h1>
            <p className="text-gray-500 mt-1">Real-time status of all ongoing hospitality events.</p>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <span className="material-symbols-outlined">add</span> Create Event
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 font-medium">Active Guests</p>
            <h3 className="text-2xl font-bold mt-2">1,248</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
            <h3 className="text-2xl font-bold mt-2 text-amber-500">14</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 font-medium">Staff on Duty</p>
            <h3 className="text-2xl font-bold mt-2">82</h3>
          </div>
        </div>
        <div
          className="h-64 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-200 dark:text-gray-800 text-6xl">analytics</span>
        </div>
      </div>
    </main>
    {/* <!-- Modal Backdrop Overlay --> */}
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      {/* <!-- Logout Confirmation Dialog --> */}
      <div
        className="w-full max-w-[440px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-300">
        {/* <!-- Modal Content Container --> */}
        <div className="p-8">
          {/* <!-- Icon Header --> */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className="size-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4 border border-red-100 dark:border-red-500/20">
              <span className="material-symbols-outlined text-red-600 dark:text-red-500 text-3xl">logout</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Logout Confirmation</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              Are you sure you want to log out? You will need to re-authenticate to access your event hospitality
              dashboard.
            </p>
          </div>
          {/* <!-- Action Buttons --> */}
          <div className="flex flex-col gap-3">
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-all focus:ring-4 focus:ring-primary/20 outline-none flex items-center justify-center gap-2">
              <span>Logout</span>
            </button>
            <button
              className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-all outline-none border border-gray-200 dark:border-gray-700">
              <span>Keep me signed in</span>
            </button>
          </div>
        </div>
        {/* <!-- Subtle Progress/Security Indicator --> */}
        <div
          className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
          <p className="text-xs text-gray-500 dark:text-gray-400">Secure session termination for Enterprise Platform</p>
        </div>
      </div>
    </div>
    {/* <!-- Footer --> */}
    <footer
      className="mt-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-6 lg:px-10 filter blur-sm pointer-events-none">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <a className="text-gray-500 text-sm hover:underline" href="#">Privacy Policy</a>
          <a className="text-gray-500 text-sm hover:underline" href="#">Terms of Service</a>
          <a className="text-gray-500 text-sm hover:underline" href="#">Help Center</a>
        </div>
        <p className="text-gray-500 text-sm">© 2024 Enterprise SaaS Event Hospitality. All rights reserved.</p>
      </div>
    </footer>
  </div>
  )
}

export default LogoutConfirmation