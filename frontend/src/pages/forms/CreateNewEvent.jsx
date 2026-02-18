import React from 'react'

function CreateNewEvent() {
  return (
    <div className="relative flex min-h-screen flex-col">
    {/* <!-- Top Navigation Bar --> */}
    <header className="sticky top-0 z-50 w-full border-b border-[#dbdee6] bg-white px-4 md:px-10 lg:px-20 py-3">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined">event_seat</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">EventOS</h2>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-sm font-semibold text-[#616e89] hover:text-primary" href="#">Dashboard</a>
            <a className="text-sm font-semibold text-primary" href="#">Events</a>
            <a className="text-sm font-semibold text-[#616e89] hover:text-primary" href="#">Venues</a>
            <a className="text-sm font-semibold text-[#616e89] hover:text-primary" href="#">Staff</a>
            <a className="text-sm font-semibold text-[#616e89] hover:text-primary" href="#">Reports</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89] text-xl">search</span>
            <input
              className="h-10 w-64 rounded-lg border-none bg-background-light pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="Search events..." type="text" />
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-background-light">
            <span className="material-symbols-outlined text-[#616e89]">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-cover bg-center border border-[#dbdee6]"
            data-alt="User profile avatar of an operations manager"
            style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEuIYtNPKHw1yuoAHY6AAWrTZ2GLovWEfyesvbjEjsclhOp1lHvoN9RCgSP0TAddTSbM3GCxIE9JScUA9XHCW-njPXjnl3PZQellv6AR5W8JZZq9OhHM2KfCxGoIMXdX1BBqNJ7dWpCgjo6Yv4cZY0Uv7jQnViLwcC1AqSYcvyDkvZ9LyMaBUBDHV4Yn4Shs4ZNBRNMMLuG5lmxlPdS8AwwskddKdrgpsD1q0l8URsZwpvNQik9FPkCsy6b7zKgqc7A1swRSGL8UtC')"}}>
          </div>
        </div>
      </div>
    </header>
    <main className="flex-1 px-4 py-8 md:px-10 lg:px-20">
      <div className="mx-auto max-w-[800px]">
        {/* <!-- Breadcrumbs --> */}
        <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-[#616e89]">
          <a className="hover:text-primary" href="#">Events</a>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#111318]">Create New Event</span>
        </nav>
        {/* <!-- Header --> */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#111318] md:text-4xl">Create New Event</h1>
          <p className="mt-2 text-lg text-[#616e89]">Fill in the details below to initialize your event logistics and venue
            management.</p>
        </div>
        {/* <!-- Form Card --> */}
        <div className="rounded-xl border border-[#dbdee6] bg-white p-6 shadow-sm md:p-10">
          <form className="space-y-8">
            {/* <!-- Section: Basic Info --> */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#111318]">Event Name</label>
                <input
                  className="w-full rounded-lg border border-[#dbdee6] px-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                  placeholder="e.g., Annual Tech Symposium 2024" type="text" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#111318]">Venue / Location</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89]">location_pin</span>
                  <input
                    className="w-full rounded-lg border border-[#dbdee6] pl-10 pr-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="Search or enter venue address" type="text" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#111318]">Start Date</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89]">calendar_today</span>
                  <input
                    className="w-full rounded-lg border border-[#dbdee6] pl-10 pr-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    type="date" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-[#111318]">End Date</label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#616e89]">event_upcoming</span>
                  <input
                    className="w-full rounded-lg border border-[#dbdee6] pl-10 pr-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                    type="date" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#111318]">Description</label>
                <textarea
                  className="w-full rounded-lg border border-[#dbdee6] px-4 py-3 text-base outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                  placeholder="Provide a brief overview of the event, its objectives, and key requirements..."
                  rows="5"></textarea>
                <p className="mt-2 text-right text-xs text-[#616e89]">Recommended: 200-500 words</p>
              </div>
            </div>
            {/* <!-- Visibility / Type Toggle (Extra logical context) --> */}
            <div className="flex flex-col gap-4 rounded-lg bg-background-light p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#111318]">Private Event</p>
                  <p className="text-xs text-[#616e89]">Only invited staff and vendors can view this event</p>
                </div>
                <button aria-checked="false"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  role="switch" type="button">
                  <span aria-hidden="true"
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
                </button>
              </div>
            </div>
            {/* <!-- Form Actions --> */}
            <div className="flex items-center justify-end gap-4 border-t border-[#dbdee6] pt-8">
              <button
                className="rounded-lg px-6 py-3 text-sm font-bold text-[#616e89] hover:bg-background-light transition-colors"
                type="button">
                Cancel
              </button>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-blue-700 transition-all active:scale-95"
                type="submit">
                <span className="material-symbols-outlined text-xl">add_circle</span>
                Create Event
              </button>
            </div>
          </form>
        </div>
        {/* <!-- Helper card --> */}
        <div className="mt-8 flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <span className="material-symbols-outlined text-primary">info</span>
          <div>
            <p className="text-sm font-semibold text-primary">Pro Tip</p>
            <p className="text-sm text-primary/80">Once created, you can begin assigning hospitality teams and inventory
              directly from the event dashboard.</p>
          </div>
        </div>
      </div>
    </main>
    {/* <!-- Footer Info --> */}
    <footer className="mt-auto py-6 text-center text-sm text-[#616e89]">
      <p>© 2024 EventOS Operations Platform. All rights reserved.</p>
    </footer>
  </div>
  )
}

export default CreateNewEvent