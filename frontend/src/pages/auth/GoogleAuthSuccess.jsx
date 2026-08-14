import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * This page is the landing target after a successful Google OAuth redirect.
 * The backend redirects to /auth/google/success?token=...&user=...
 * We extract those params, store them, update AuthContext, then go to /dashboard.
 */
function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userRaw = searchParams.get("user");

    if (!token || !userRaw) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    try {
      const user = JSON.parse(userRaw);

      // Mirror what the email/password login flow does
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update the AuthContext so the rest of the app knows who's logged in
      login(user);

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Failed to process login. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-soft dark:bg-surface-dark-soft">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-card dark:border-red-900/40 dark:bg-surface-dark dark:shadow-card-dark">
          <span className="material-symbols-outlined text-4xl text-red-500">error</span>
          <p className="mt-3 text-body text-red-600 dark:text-red-400">{error}</p>
          <p className="mt-1 text-caption text-slate-400 dark:text-slate-500">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-soft dark:bg-surface-dark-soft">
      <div className="flex flex-col items-center gap-4">
        <span className="size-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary-500" />
        <p className="text-body font-medium text-slate-500 dark:text-slate-400">
          Signing you in…
        </p>
      </div>
    </div>
  );
}

export default GoogleAuthSuccess;