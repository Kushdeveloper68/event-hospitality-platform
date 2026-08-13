import React from 'react'
import DashboardNavbar from '../components/DashboardNavbar'
import { Footer } from '../components/'

function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-soft dark:bg-surface-dark-soft">
      <DashboardNavbar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout