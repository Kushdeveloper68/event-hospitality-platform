import './App.css'
import {BrowserRouter , Routes, Route} from "react-router-dom"
import DashboardLayout from './layouts/DashboardLayout'
// dashboard pages
import {PlatformLandingPage, EventDirectory, MainOprationDashboard, EventAnalyticsReports, OrganizationAnalyticsDashboards} from "./pages"
// form pages
import {UserSignup, UserLogin} from "./pages"
// settings / others
import {OragnizationSetting, PageNotFound} from "./pages"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLandingPage />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />

        {/* Dashboard routes wrapped with layout */}
        <Route path="/dashboard" element={<DashboardLayout><MainOprationDashboard /></DashboardLayout>} />
        <Route path="/events" element={<DashboardLayout><EventDirectory /></DashboardLayout>} />
        <Route path="/reports" element={<DashboardLayout><EventAnalyticsReports /></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout><OrganizationAnalyticsDashboards /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><OragnizationSetting /></DashboardLayout>} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
