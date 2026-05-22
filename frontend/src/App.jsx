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
} from "./pages";
// form pages
import { UserSignup, UserLogin, CreateNewEvent } from "./pages";
// settings / others
import { OragnizationSetting, PageNotFound } from "./pages";

function App() {
  return (
    <AuthProvider>
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

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
