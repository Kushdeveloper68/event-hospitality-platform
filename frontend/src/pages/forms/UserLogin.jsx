import React, { useState } from "react";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Footer } from "../../components/";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const oauthError = searchParams.get("error");
  const oauthErrorMessage =
    oauthError === "google_auth_failed"
      ? "Google sign-in failed. Please try again."
      : oauthError === "server_error"
      ? "A server error occurred. Please try again."
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        if (response.user) login(response.user);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-surface-soft text-slate-900 dark:bg-surface-dark-soft dark:text-slate-100">
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-8 shadow-card backdrop-blur dark:border-slate-800 dark:bg-surface-dark/95 dark:shadow-card-dark md:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <Link to="/" className="mb-4 flex items-center gap-2 transition-opacity hover:opacity-90">
                <div className="size-10 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src="/event-logo-with-icon-dark-bg-removebg-preview.png"
                    alt="EventCure Logo"
                    loading="lazy"
                  />
                </div>
              </Link>
              <h2 className="font-display text-section-h2 text-slate-900 dark:text-slate-100">
                Welcome back
              </h2>
              <p className="mt-2 text-body text-slate-500 dark:text-slate-400 text-center">
                Please enter your details to sign in.
              </p>
            </div>

            {/* OAuth error from redirect */}
            {oauthErrorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/40">
                <p className="text-body text-red-700 dark:text-red-400">
                  {oauthErrorMessage}
                </p>
              </div>
            )}

            {/* Alert messages */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/40">
                <p className="text-body text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/40">
                <p className="text-body text-green-700 dark:text-green-400">
                  {success}
                </p>
              </div>
            )}

            {/* Google Sign-In */}
            <div className="mb-6">
              <GoogleSignInButton mode="signin" />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-caption">
                <span className="bg-white px-3 text-slate-400 dark:bg-surface-dark dark:text-slate-500">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email / password form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className="mb-1.5 block text-body font-medium text-slate-900 dark:text-slate-100"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-body text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:disabled:bg-slate-900"
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="block text-body font-medium text-slate-900 dark:text-slate-100"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <Link
                    to="/reset-password"
                    className="text-caption font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-body text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:disabled:bg-slate-900"
                    id="password"
                    placeholder="Enter your password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500 dark:border-slate-600"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label
                  className="ml-2 block text-caption text-slate-600 dark:text-slate-400"
                  htmlFor="remember-me"
                >
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                className="flex w-full items-center justify-center rounded-lg bg-primary-500 px-4 py-3 text-body font-bold text-white shadow-sm transition-all hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-slate-400"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
              <p className="text-body text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  className="font-semibold text-primary-500 dark:text-primary-400 transition-colors hover:text-primary-600"
                  to="/signup"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UserLogin;