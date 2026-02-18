import React from 'react'

function ResetPassword() {
  return (
   <>
   {/* <!-- Header / Logo Section (Minimal) --> */}
  <header className="w-full p-8 flex justify-center items-center">
    <div className="flex items-center gap-2">
      <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
        <span className="material-symbols-outlined text-white text-2xl">event_seat</span>
      </div>
      <span className="text-[#111318] dark:text-white font-bold text-xl tracking-tight">EventOps Pro</span>
    </div>
  </header>
  {/* <!-- Main Content: Centered Card --> */}
  <main className="flex-1 flex items-center justify-center px-4 pb-20">
    <div
      className="bg-white dark:bg-[#1e2533] w-full max-w-[480px] rounded-xl shadow-xl border border-[#dbdee6] dark:border-[#2d364a] overflow-hidden">
      {/* <!-- Visual Accent (Optional Enterprise Styling) --> */}
      <div className="h-1.5 w-full bg-primary"></div>
      <div className="p-8 sm:p-10 flex flex-col items-center">
        {/* <!-- Heading & Icon --> */}
        <div className="bg-primary/10 dark:bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
        </div>
        <h1 className="text-[#111318] dark:text-white text-2xl sm:text-3xl font-bold leading-tight text-center mb-3">
          Reset your password
        </h1>
        <p className="text-[#616e89] dark:text-gray-400 text-base font-normal leading-relaxed text-center mb-8">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
        {/* <!-- Form Section --> */}
        <form className="w-full space-y-6" onsubmit="return false;">
          <div className="flex flex-col gap-2">
            <label className="text-[#111318] dark:text-gray-200 text-sm font-semibold" for="email">
              Email address
            </label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#616e89] text-xl">mail</span>
              <input
                className="form-input flex w-full rounded-lg text-[#111318] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dbdee6] dark:border-[#2d364a] bg-white dark:bg-[#111621] focus:border-primary h-12 pl-12 pr-4 placeholder:text-[#616e89] text-base font-normal transition-all"
                id="email" name="email" placeholder="name@company.com" required="" type="email" />
            </div>
          </div>
          <button
            className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"
            type="submit">
            <span>Send reset link</span>
          </button>
        </form>
        {/* <!-- Footer Link --> */}
        <div className="mt-8 pt-6 border-t border-[#dbdee6] dark:border-[#2d364a] w-full text-center">
          <a className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
            href="#">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to login
          </a>
        </div>
      </div>
    </div>
  </main>
  {/* <!-- Footer (Minimal) --> */}
  <footer className="p-8 text-center text-[#616e89] text-xs">
    <p>© 2024 EventOps Pro. Enterprise Hospitality Operations. All rights reserved.</p>
    <div className="flex justify-center gap-4 mt-2">
      <a className="hover:underline" href="#">Privacy Policy</a>
      <a className="hover:underline" href="#">Security</a>
      <a className="hover:underline" href="#">Contact Support</a>
    </div>
  </footer>
   </>
  )
}

export default ResetPassword