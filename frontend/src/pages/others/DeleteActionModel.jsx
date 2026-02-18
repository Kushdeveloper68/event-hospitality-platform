import React from 'react'

function DeleteActionModel() {
  return (
    <>
    {/* <!-- Mock Background Content (Simulating the Dashboard behind the modal) --> */}
  <div className="fixed inset-0 z-0 overflow-hidden filter blur-sm">
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">E</div>
        <h1 className="text-xl font-bold text-slate-900">EventOps Pro</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200"></div>
        <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200"></div>
        <div className="h-32 bg-white rounded-xl shadow-sm border border-slate-200"></div>
        <div className="col-span-3 h-96 bg-white rounded-xl shadow-sm border border-slate-200"></div>
      </div>
    </main>
  </div>
  {/* <!-- Modal Backdrop Overlay --> */}
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    {/* <!-- Destructive Action Modal --> */}
    <div aria-labelledby="modal-title" aria-modal="true"
      className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      role="dialog">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-5">
          {/* <!-- Warning Icon Container --> */}
          <div
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="material-symbols-outlined text-error-red text-3xl">warning</span>
          </div>
          <div className="flex-1">
            {/* <!-- Heading Component --> */}
            <div className="flex flex-col gap-2">
              <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight"
                id="modal-title">
                Delete Event?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
                Are you sure you want to delete the <span className="font-semibold text-slate-900 dark:text-white">'Global
                  Hospitality Summit 2024'</span>?
                This will permanently remove all scheduled sessions, guest lists, and dietary requirements.
              </p>
            </div>
          </div>
        </div>
        {/* <!-- Warning Callout Box --> */}
        <div
          className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-slate-500 text-xl">info</span>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            This action is irreversible and cannot be undone.
          </p>
        </div>
      </div>
      {/* <!-- Modal Footer / Action Buttons --> */}
      <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 transition-colors"
          type="button">
          Cancel
        </button>
        <button
          className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-error-red text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
          type="button">
          Delete Event
        </button>
      </div>
      {/* <!-- Close Icon (Top Right) --> */}
      <button
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  </div>
    </>
  )
}

export default DeleteActionModel