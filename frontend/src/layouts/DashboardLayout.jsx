import React from 'react'
import DashboardNavbar from '../components/DashboardNavbar'

function DashboardLayout({ children }) {
	return (
		<div className="flex h-screen overflow-hidden">
				<DashboardNavbar />
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
					{children}
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout
