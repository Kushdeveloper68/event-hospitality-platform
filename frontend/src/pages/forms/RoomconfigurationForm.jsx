import React from 'react'

function RoomconfigurationForm() {
  return (
    <>
     {/* <!-- Top Navigation Bar --> */}
  <header
    className="sticky top-0 z-50 w-full border-b border-[#dbdee6] bg-white px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-1.5 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd"
              d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              fill="currentColor" fill-rule="evenodd"></path>
          </svg>
        </div>
        <h2 className="text-[#111318] text-lg font-bold leading-tight tracking-tight">
          EventOps Pro
        </h2>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <a className="text-[#616e89] text-sm font-medium hover:text-primary transition-colors" href="#">Dashboard</a>
        <a className="text-primary text-sm font-semibold border-b-2 border-primary py-4 -mb-4 transition-colors"
          href="#">Events</a>
        <a className="text-[#616e89] text-sm font-medium hover:text-primary transition-colors" href="#">Rooms</a>
        <a className="text-[#616e89] text-sm font-medium hover:text-primary transition-colors" href="#">Staff</a>
        <a className="text-[#616e89] text-sm font-medium hover:text-primary transition-colors" href="#">Settings</a>
      </nav>
    </div>
    <div className="flex items-center gap-4">
      <div
        className="hidden sm:flex items-center bg-[#f0f1f4] rounded-lg px-3 py-1.5 border border-transparent focus-within:border-primary/30 transition-all">
        <span className="material-symbols-outlined text-[#616e89] text-[20px]">search</span>
        <input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-[#616e89]"
          placeholder="Search operations..." type="text" />
      </div>
      <div className="w-10 h-10 rounded-full border border-[#dbdee6] p-0.5">
        <img className="w-full h-full rounded-full object-cover" data-alt="User profile avatar circle"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVyR7FR447Z25BFo_J-5vqZxiJZ_u-CDEZunw0reYWTLsQADyhtuSkpvlzBrxJRPPy7SyWu907AqvY248c6p031dUpetsbh8pEpIDmiL5hBLFRMYBEA8D4yhjHhpVEpsTPJrgipWB7MVnrmcmoklRwV2nYFZHPxoCmERMZcw7UmLbu_v0ymXFmHqq2MwNgT7LUWThDoW1W9ckEICkD1afXW7TYh64E4YMDTBAdn2PjEOhbw17QZbjktK4b7Nqfdi4OOFqvhWP7u86V" />
      </div>
    </div>
  </header>
  <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
    {/* <!-- Breadcrumbs --> */}
    <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
      <a className="text-[#616e89] hover:text-primary" href="#">Events</a>
      <span className="material-symbols-outlined text-[#616e89] text-sm">chevron_right</span>
      <a className="text-[#616e89] hover:text-primary" href="#">Annual Tech Summit 2024</a>
      <span className="material-symbols-outlined text-[#616e89] text-sm">chevron_right</span>
      <span className="text-[#111318]">Add Room</span>
    </nav>
    {/* <!-- Header --> */}
    <div className="mb-10">
      <h1 className="text-3xl font-black text-[#111318] tracking-tight mb-2">
        Add New Room
      </h1>
      <p className="text-[#616e89] text-lg max-w-2xl">
        Configure room details for hospitality allocation. This information
        will be used for automated capacity planning and guest check-ins.
      </p>
    </div>
    {/* <!-- Form Card --> */}
    <div className="bg-white rounded-xl shadow-sm border border-[#dbdee6] overflow-hidden">
      <form className="p-6 md:p-8 space-y-8">
        {/* <!-- Section 1: Basic Info --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111318]" for="room-number">Room Number / Name <span
                className="text-red-500">*</span></label>
            <div className="relative">
              <input
                className="w-full h-12 rounded-lg border-[#dbdee6] focus:border-primary focus:ring-1 focus:ring-primary text-base px-4 transition-all"
                id="room-number" placeholder="e.g. 101 or Executive Suite A" type="text" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111318]" for="capacity">Capacity (Occupants) <span
                className="text-red-500">*</span></label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#616e89] text-[20px]">groups</span>
              <input
                className="w-full h-12 rounded-lg border-[#dbdee6] focus:border-primary focus:ring-1 focus:ring-primary text-base pl-10 pr-4 transition-all"
                id="capacity" min="1" placeholder="0" type="number" />
            </div>
          </div>
        </div>
        {/* <!-- Section 2: Details --> */}
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#111318]" for="room-type">Room Category <span
                className="text-red-500">*</span></label>
            <select
              className="w-full h-12 rounded-lg border-[#dbdee6] focus:border-primary focus:ring-1 focus:ring-primary text-base px-4 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%23616e89%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat transition-all"
              id="room-type">
              <option disabled="" selected="" value="">
                Select room type
              </option>
              <option value="standard">Standard Single</option>
              <option value="double">Double Occupancy</option>
              <option value="suite">Executive Suite</option>
              <option value="meeting">Meeting Room / Breakout</option>
              <option value="accessible">ADA Accessible</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[#111318]" for="notes">Internal Operations Notes</label>
              <span className="text-[12px] text-[#616e89] font-normal">Optional</span>
            </div>
            <textarea
              className="w-full rounded-lg border-[#dbdee6] focus:border-primary focus:ring-1 focus:ring-primary text-base p-4 transition-all resize-none"
              id="notes"
              placeholder="Mention special amenities, maintenance requirements, or restricted access details..."
              rows="4"></textarea>
          </div>
        </div>
        {/* <!-- Action Footer --> */}
        <div className="pt-6 border-t border-[#dbdee6] flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            className="w-full sm:w-auto px-6 h-12 rounded-lg border border-[#dbdee6] text-[#111318] font-semibold hover:bg-[#f0f1f4] transition-colors"
            type="button">
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-8 h-12 rounded-lg bg-primary text-white font-semibold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            type="submit">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Add Room
          </button>
        </div>
      </form>
    </div>
    {/* <!-- Helper Suggestion --> */}
    <div className="mt-8 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <span className="material-symbols-outlined text-[24px]">edit</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#111318]">
          Need to add multiple rooms?
        </p>
        <p className="text-sm text-[#616e89] mt-1">
          You can save time by
          <a className="text-primary font-medium hover:underline" href="#">uploading a CSV file</a>
          with your entire room inventory at once.
        </p>
      </div>
    </div>
  </main>
  {/* <!-- Success Toast Mockup --> */}
  <div
    className="fixed bottom-8 right-8 flex items-center gap-3 bg-white border border-[#dbdee6] shadow-2xl rounded-xl p-4 max-w-md hidden sm:flex">
    <div className="bg-green-100 text-green-600 p-2 rounded-full">
      <span className="material-symbols-outlined text-[20px]">check_circle</span>
    </div>
    <div className="pr-8">
      <p className="text-sm font-bold text-[#111318]">Ready to scale</p>
      <p className="text-xs text-[#616e89]">
        Field validation active for all inputs.
      </p>
    </div>
    <button className="absolute top-2 right-2 text-[#616e89] hover:text-[#111318]">
      <span className="material-symbols-outlined text-[18px]">close</span>
    </button>
  </div></>
  )
}

export default RoomconfigurationForm