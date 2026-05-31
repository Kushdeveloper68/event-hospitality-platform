import React from 'react'
import DashboardNavbar from '../components/DashboardNavbar'
import {Footer} from '../components/'
function DashboardLayout({ children }) {
	return (
		<div className="flex h-screen overflow-hidden">
				<DashboardNavbar />
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<main className="flex-1 overflow-y-auto custom-scrollbar dark:bg-slate-950">
					{children}
					<Footer />
				</main>
			</div>
		</div>
	)
}

export default DashboardLayout
