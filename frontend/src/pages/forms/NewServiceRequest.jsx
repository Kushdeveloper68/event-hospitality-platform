import React from 'react'

function NewServiceRequest() {
  return (
    <>
    {/* <!-- Modal Overlay Backdrop --> */}
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-0"></div>
  {/* <!-- Modal C/ontainer --> */}
  <div
    className="relative z-10 w-full max-w-[560px] bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col">
    {/* <!-- Modal Header --> */}
    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">New Service Request</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Assign a task to the operations team</p>
      </div>
      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>
    </div>
    {/* <!-- Modal Body / Form --> */}
    <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
      {/* <!-- Select Guest (Searchable Style) --> */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Select Guest</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <span className="material-symbols-outlined text-xl">search</span>
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            placeholder="Search for a guest by name or room..." type="text" />
        </div>
        <div className="flex gap-2 mt-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 rounded">
            Recent: Jonathan Doe (Room 402)
          </span>
        </div>
      </div>
      {/* <!-- Request Type --> */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Request Type</label>
        <div className="relative">
          <select
            className="custom-select w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none">
            <option disabled="" selected="" value="">Select service type (e.g. Housekeeping)</option>
            <option value="housekeeping">Housekeeping / Extra Towels</option>
            <option value="maintenance">Maintenance / Repair</option>
            <option value="fb">Food &amp; Beverage / Room Service</option>
            <option value="valet">Valet / Transportation</option>
            <option value="other">Other / Special Inquiry</option>
          </select>
        </div>
      </div>
      {/* <!-- Urgency Level (Segmented Control) --> */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Urgency Level</label>
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl gap-1">
          <label className="flex-1 cursor-pointer">
            <input className="sr-only peer" name="urgency" type="radio" value="low" />
            <div
              className="py-2.5 text-center text-sm font-medium rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:shadow-sm transition-all">
              Low
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input checked="" className="sr-only peer" name="urgency" type="radio" value="medium" />
            <div
              className="py-2.5 text-center text-sm font-medium rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:shadow-sm transition-all border-l border-slate-200 dark:border-slate-700 peer-checked:border-transparent">
              Medium
            </div>
          </label>
          <label className="flex-1 cursor-pointer">
            <input className="sr-only peer" name="urgency" type="radio" value="high" />
            <div
              className="py-2.5 text-center text-sm font-medium rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-white dark:peer-checked:bg-slate-700 peer-checked:text-slate-900 dark:peer-checked:text-white peer-checked:shadow-sm transition-all border-l border-slate-200 dark:border-slate-700 peer-checked:border-transparent">
              High
            </div>
          </label>
          <label className="flex-1 cursor-pointer group">
            <input className="sr-only peer" name="urgency" type="radio" value="emergency" />
            <div
              className="py-2.5 text-center text-sm font-medium rounded-lg text-slate-500 dark:text-slate-400 peer-checked:bg-red-500 peer-checked:text-white peer-checked:shadow-sm transition-all border-l border-slate-200 dark:border-slate-700 peer-checked:border-transparent flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px] hidden peer-checked:inline leading-none">warning</span>
              Emergency
            </div>
          </label>
        </div>
      </div>
      {/* <!-- Notes / Instructions --> */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Notes &amp; Instructions</label>
          <span className="text-xs text-slate-400">Optional</span>
        </div>
        <textarea
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
          placeholder="Add specific details, special requirements, or access codes here..." rows="4"></textarea>
      </div>
      {/* <!-- Additional Detail: Room Entry --> */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex items-center h-5">
          <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" id="permission"
            type="checkbox" />
        </div>
        <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer" for="permission">
          Permission to enter room if guest is not present
        </label>
      </div>
    </div>
    {/* <!-- Modal Footer --> */}
    <div
      className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
      <button
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
        Cancel
      </button>
      <button
        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 transition-all flex items-center gap-2">
        Create Request
        <span className="material-symbols-outlined text-[18px]">send</span>
      </button>
    </div>
  </div>
  {/* <!-- Background Decoration (Abstract patterns for SaaS feel) --> */}
  <div className="fixed top-0 right-0 p-8 pointer-events-none opacity-20">
    <div className="w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
  </div>
  <div className="fixed bottom-0 left-0 p-8 pointer-events-none opacity-20">
    <div className="w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
  </div></>
  )
}

export default NewServiceRequest