import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
// auth context + guard
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";
import PageErrorBoundary from './components/PageErrorBoundary';
import GoogleAuthSuccess from "./pages/auth/GoogleAuthSuccess";

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
            <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

            {/* Dashboard routes wrapped with layout and protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Dashboard">
                      <MainOprationDashboard />
                    </PageErrorBoundary>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Events">
                      <EventDirectory />
                    </PageErrorBoundary>
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
                    <PageErrorBoundary pageName="Event workspace">
                      <EventWorkspaceShell />
                    </PageErrorBoundary>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:eventId"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Event analytics reports">
                      <EventAnalyticsReports />
                    </PageErrorBoundary>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Organization analytics dashboard">
                      <OrganizationAnalyticsDashboards />
                    </PageErrorBoundary>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Organization settings">
                      <OragnizationSetting />
                    </PageErrorBoundary>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Create event">
                      <CreateNewEvent />
                    </PageErrorBoundary>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PageErrorBoundary pageName="Activity and notification logs">
                      <ActivityAndNotificationLogs />
                    </PageErrorBoundary>
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
