import React from 'react'

function SystemLoadingState() {
  return (
    <>
    {/* <!-- Progress Indicator Top Bar --> */}
  <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-50">
    <div className="h-full bg-primary w-1/3 rounded-r-full"></div>
  </div>
  <div className="flex h-screen overflow-hidden">
    {/* <!-- Sidebar Skeleton --> */}
    <aside className="w-64 border-r border-[#dbdee6] bg-white flex flex-col p-4 gap-6">
      <div className="flex items-center gap-3 px-2">
        <div className="size-8 rounded bg-primary/10 flex items-center justify-center">
          <div className="size-5 rounded-sm bg-primary/40"></div>
        </div>
        <div className="h-5 w-32 rounded skeleton-shimmer"></div>
      </div>
      <nav className="flex flex-col gap-2">
        <div className="h-10 w-full rounded-lg bg-[#f0f1f4]/50 flex items-center px-3 gap-3">
          <div className="size-5 rounded bg-[#dbdee6]"></div>
          <div className="h-3 w-20 rounded bg-[#dbdee6]"></div>
        </div>
        {/* <!-- Nav Items Repeat --> */}
        <div className="h-10 w-full rounded-lg flex items-center px-3 gap-3">
          <div className="size-5 rounded bg-[#f0f1f4]"></div>
          <div className="h-3 w-24 rounded bg-[#f0f1f4]"></div>
        </div>
        <div className="h-10 w-full rounded-lg flex items-center px-3 gap-3">
          <div className="size-5 rounded bg-[#f0f1f4]"></div>
          <div className="h-3 w-16 rounded bg-[#f0f1f4]"></div>
        </div>
        <div className="h-10 w-full rounded-lg flex items-center px-3 gap-3">
          <div className="size-5 rounded bg-[#f0f1f4]"></div>
          <div className="h-3 w-28 rounded bg-[#f0f1f4]"></div>
        </div>
        <div className="h-10 w-full rounded-lg flex items-center px-3 gap-3">
          <div className="size-5 rounded bg-[#f0f1f4]"></div>
          <div className="h-3 w-20 rounded bg-[#f0f1f4]"></div>
        </div>
      </nav>
      <div className="mt-auto p-2 bg-[#f6f6f8] rounded-xl flex flex-col gap-2">
        <div className="h-3 w-3/4 rounded bg-[#dbdee6]"></div>
        <div className="h-2 w-full rounded bg-[#e5e7eb]"></div>
        <div className="h-8 w-full rounded-lg bg-white border border-[#dbdee6] mt-1"></div>
      </div>
    </aside>
    {/* <!-- Main Content Area --> */}
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* <!-- Top Navbar Skeleton --> */}
      <header className="h-16 border-b border-[#dbdee6] bg-white px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 w-96">
          <div className="h-10 flex-1 rounded-lg bg-[#f0f1f4] flex items-center px-4">
            <span className="material-symbols-outlined text-[#616e89] text-xl">search</span>
            <div className="ml-2 h-3 w-24 rounded bg-[#dbdee6]"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-lg bg-[#f0f1f4] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#616e89]">notifications</span>
          </div>
          <div className="size-10 rounded-lg bg-[#f0f1f4] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#616e89]">help</span>
          </div>
          <div className="h-8 w-[1px] bg-[#dbdee6] mx-1"></div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <div className="h-3 w-20 rounded bg-[#f0f1f4]"></div>
              <div className="h-2 w-12 rounded bg-[#f0f1f4]"></div>
            </div>
            <div className="size-10 rounded-full bg-[#f0f1f4] border-2 border-white shadow-sm overflow-hidden">
              <div className="w-full h-full skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Scrollable Content --> */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
        {/* <!-- Welcome Section Skeleton --> */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-64 rounded-lg skeleton-shimmer"></div>
            <div className="h-4 w-96 rounded bg-[#e5e7eb]"></div>
          </div>
          <div className="h-10 w-32 rounded-lg bg-primary/10 border border-primary/20"></div>
        </div>
        {/* <!-- Metrics Grid Skeleton --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#dbdee6] flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#f0f1f4]"></div>
              <div className="size-8 rounded-lg bg-primary/5"></div>
            </div>
            <div className="h-8 w-16 rounded skeleton-shimmer"></div>
            <div className="h-2 w-32 rounded bg-[#f0f1f4]"></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#dbdee6] flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 rounded bg-[#f0f1f4]"></div>
              <div className="size-8 rounded-lg bg-primary/5"></div>
            </div>
            <div className="h-8 w-20 rounded skeleton-shimmer"></div>
            <div className="h-2 w-24 rounded bg-[#f0f1f4]"></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#dbdee6] flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#f0f1f4]"></div>
              <div className="size-8 rounded-lg bg-primary/5"></div>
            </div>
            <div className="h-8 w-12 rounded skeleton-shimmer"></div>
            <div className="h-2 w-28 rounded bg-[#f0f1f4]"></div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#dbdee6] flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-[#f0f1f4]"></div>
              <div className="size-8 rounded-lg bg-primary/5"></div>
            </div>
            <div className="h-8 w-24 rounded skeleton-shimmer"></div>
            <div className="h-2 w-20 rounded bg-[#f0f1f4]"></div>
          </div>
        </div>
        {/* <!-- Table Container Skeleton --> */}
        <div className="bg-white rounded-xl border border-[#dbdee6] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#dbdee6] flex items-center justify-between">
            <div className="h-5 w-40 rounded bg-[#f0f1f4]"></div>
            <div className="flex gap-2">
              <div className="h-9 w-24 rounded-lg bg-[#f0f1f4]"></div>
              <div className="h-9 w-24 rounded-lg bg-[#f0f1f4]"></div>
            </div>
          </div>
          <div className="w-full">
            {/* <!-- Table Head Skeleton --> */}
            <div className="flex bg-[#f9fafb] border-b border-[#dbdee6] px-6 py-3">
              <div className="w-1/4 h-3 rounded bg-[#e5e7eb] mr-4"></div>
              <div className="w-1/6 h-3 rounded bg-[#e5e7eb] mr-4"></div>
              <div className="w-1/6 h-3 rounded bg-[#e5e7eb] mr-4"></div>
              <div className="w-1/6 h-3 rounded bg-[#e5e7eb] mr-4"></div>
              <div className="flex-1 h-3 rounded bg-[#e5e7eb]"></div>
            </div>
            {/* <!-- Table Rows Skeleton --> */}
            <div className="flex flex-col">
              {/* <!-- Row 1 --> */}
              <div className="flex px-6 py-5 border-b border-[#f0f1f4] items-center">
                <div className="w-1/4 flex items-center gap-3 mr-4">
                  <div className="size-10 rounded bg-[#f0f1f4]"></div>
                  <div className="h-3 w-32 rounded bg-[#f0f1f4]"></div>
                </div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-6 rounded-full bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="flex-1 flex justify-end">
                  <div className="size-6 rounded bg-[#f0f1f4]"></div>
                </div>
              </div>
              {/* <!-- Row 2 --> */}
              <div className="flex px-6 py-5 border-b border-[#f0f1f4] items-center">
                <div className="w-1/4 flex items-center gap-3 mr-4">
                  <div className="size-10 rounded bg-[#f0f1f4] skeleton-shimmer"></div>
                  <div className="h-3 w-24 rounded bg-[#f0f1f4]"></div>
                </div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-6 rounded-full bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="flex-1 flex justify-end">
                  <div className="size-6 rounded bg-[#f0f1f4]"></div>
                </div>
              </div>
              {/* <!-- Row 3 --> */}
              <div className="flex px-6 py-5 border-b border-[#f0f1f4] items-center">
                <div className="w-1/4 flex items-center gap-3 mr-4">
                  <div className="size-10 rounded bg-[#f0f1f4]"></div>
                  <div className="h-3 w-40 rounded bg-[#f0f1f4]"></div>
                </div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-6 rounded-full bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="flex-1 flex justify-end">
                  <div className="size-6 rounded bg-[#f0f1f4]"></div>
                </div>
              </div>
              {/* <!-- Row 4 --> */}
              <div className="flex px-6 py-5 border-b border-[#f0f1f4] items-center">
                <div className="w-1/4 flex items-center gap-3 mr-4">
                  <div className="size-10 rounded bg-[#f0f1f4] skeleton-shimmer"></div>
                  <div className="h-3 w-28 rounded bg-[#f0f1f4]"></div>
                </div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-6 rounded-full bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="flex-1 flex justify-end">
                  <div className="size-6 rounded bg-[#f0f1f4]"></div>
                </div>
              </div>
              {/* <!-- Row 5 --> */}
              <div className="flex px-6 py-5 border-b border-[#f0f1f4] items-center">
                <div className="w-1/4 flex items-center gap-3 mr-4">
                  <div className="size-10 rounded bg-[#f0f1f4]"></div>
                  <div className="h-3 w-36 rounded bg-[#f0f1f4]"></div>
                </div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-6 rounded-full bg-[#f0f1f4] mr-4"></div>
                <div className="w-1/6 h-3 rounded bg-[#f0f1f4] mr-4"></div>
                <div className="flex-1 flex justify-end">
                  <div className="size-6 rounded bg-[#f0f1f4]"></div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Table Footer Skeleton --> */}
          <div className="p-4 flex items-center justify-between">
            <div className="h-3 w-40 rounded bg-[#f0f1f4]"></div>
            <div className="flex gap-2">
              <div className="size-8 rounded border border-[#dbdee6] bg-white"></div>
              <div className="size-8 rounded border border-[#dbdee6] bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  {/* <!-- Centered Loading Overlay (Subtle) --> */}
  <div className="fixed inset-0 pointer-events-none flex items-center justify-center bg-white/10">
    <div className="flex flex-col items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-xl border border-[#dbdee6]">
      <div className="flex gap-1 items-center">
        <div className="size-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0s"}}></div>
        <div className="size-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0.2s"}}></div>
        <div className="size-2 rounded-full bg-primary animate-bounce" style={{animationDelay: "0.4s"}}></div>
      </div>
      <p className="text-sm font-medium text-[#111318]">Fetching operations data...</p>
    </div>
  </div>
    </>
  )
}

export default SystemLoadingState