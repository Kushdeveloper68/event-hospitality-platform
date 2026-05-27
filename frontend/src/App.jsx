import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
// auth context + guard
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

// dashboard pages
import {
  PlatformLandingPage,
  EventDirectory,
  EventWorkspaceShell,
  MainOprationDashboard,
  EventAnalyticsReports,
  OrganizationAnalyticsDashboards,
  ActivityAndNotificationLogs,
} from "./pages";
// form pages
import { UserSignup, UserLogin, CreateNewEvent, ResetPassword } from "./pages";
// settings / others
import { OragnizationSetting, PageNotFound } from "./pages";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PlatformLandingPage />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/login" element={<UserLogin />} />

            {/* Dashboard routes wrapped with layout and protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <MainOprationDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EventDirectory />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* route accepts optional tab segment for workspace, e.g. /events/123/rooms */}
            {/* allow additional segments after the tab (e.g. /add or /edit/:id) */}
            <Route
              path="/events/:eventId/:tab/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EventWorkspaceShell />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:eventId"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <EventAnalyticsReports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <OrganizationAnalyticsDashboards />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <OragnizationSetting />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CreateNewEvent />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ActivityAndNotificationLogs />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
