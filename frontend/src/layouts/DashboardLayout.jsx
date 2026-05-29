import React from 'react'
import DashboardNavbar from '../components/DashboardNavbar'

function DashboardLayout({ children }) {
	return (
		<div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text">
			<DashboardNavbar />
			<div className="flex-1 flex flex-col min-w-0">
				<main className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8 lg:px-10 pb-24">
					{children}
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout
