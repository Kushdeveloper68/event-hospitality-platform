import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
// dashboard pages
import {
  PlatformLandingPage,
  EventDirectory,
  MainOprationDashboard,
  EventAnalyticsReports,
  OrganizationAnalyticsDashboards,
} from "./pages";
// form pages
import { UserSignup, UserLogin, CreateNewEvent } from "./pages";
// settings / others
import { OragnizationSetting, PageNotFound } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          {/* Dashboard routes wrapped with layout */}
          <Route path="/dashboard" element={<MainOprationDashboard />} />
          <Route path="/events" element={<EventDirectory />} />
          <Route path="/reports" element={<EventAnalyticsReports />} />
          <Route
            path="/analytics"
            element={<OrganizationAnalyticsDashboards />}
          />
          <Route path="/settings" element={<OragnizationSetting />} />
          <Route path="/create-event" element={<CreateNewEvent />} />
        </Routes>
      </DashboardLayout>

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PlatformLandingPage />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
