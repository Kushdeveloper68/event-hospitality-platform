import React, { useEffect, useRef, useState } from "react";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Footer } from "../../components/";
import GoogleSignInButton from "../../components/GoogleSignInButton";

// ─── Shared auth styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  "h-11 w-full rounded-xl border bg-slate-50 pl-10 pr-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900";
const INPUT_OK =
  "border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20";
const INPUT_ERR =
  "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20";

function Field({ label, htmlFor, error, action, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

function Alert({ type = "error", children, onClose }) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300";
  return (
    <div role={type === "error" ? "alert" : "status"} className={`mb-5 flex items-start gap-3 rounded-xl border p-3.5 ${styles}`}>
      <span className="material-symbols-outlined mt-0.5 shrink-0 text-[19px]">{type === "error" ? "error" : "check_circle"}</span>
      <p className="flex-1 text-sm font-medium">{children}</p>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="flex shrink-0">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

function AuthHeader({ hint, linkTo, linkLabel }) {
  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-xl">
            <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure Logo" className="size-full object-contain" />
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">EventCure</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 sm:inline">{hint}</span>
          <Link
            to={linkTo}
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const emailRef = useRef(null);

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

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    setFieldErrors(errs);
    if (errs.email) return emailRef.current?.focus();
    if (errs.password) return document.getElementById("login-password")?.focus();

    setLoading(true);

    try {
      const response = await loginUser(email.trim(), password);

      if (response.success) {
        if (response.user) login(response.user);
        setSuccess("Signed in — taking you to your dashboard…");
        navigate("/dashboard");
        return;
      }
      setError(response.message || "Login failed. Please try again.");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthHeader hint="New to EventCure?" linkTo="/signup" linkLabel="Create account" />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-950 dark:text-slate-50">Welcome back</h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Sign in to manage your events.</p>
            </div>

            {oauthErrorMessage && <Alert>{oauthErrorMessage}</Alert>}
            {error && <Alert onClose={() => setError("")}>{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            {/* Google Sign-In */}
            <GoogleSignInButton mode="signin" />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">or sign in with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field label="Email" htmlFor="login-email" error={fieldErrors.email}>
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">mail</span>
                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: null }));
                    }}
                    disabled={loading}
                    placeholder="name@company.com"
                    className={`${INPUT_BASE} ${fieldErrors.email ? INPUT_ERR : INPUT_OK}`}
                  />
                </div>
              </Field>

              <Field
                label="Password"
                htmlFor="login-password"
                error={fieldErrors.password}
                action={
                  <Link to="/reset-password" className="text-xs font-bold text-blue-700 hover:underline dark:text-blue-300">
                    Forgot password?
                  </Link>
                }
              >
                <div className="relative">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">lock</span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: null }));
                    }}
                    onKeyUp={(e) => setCapsLock(e.getModifierState && e.getModifierState("CapsLock"))}
                    onBlur={() => setCapsLock(false)}
                    disabled={loading}
                    placeholder="Enter your password"
                    className={`${INPUT_BASE} pr-11 ${fieldErrors.password ? INPUT_ERR : INPUT_OK}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {capsLock && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    <span className="material-symbols-outlined text-[14px]">keyboard_capslock</span>
                    Caps Lock is on
                  </p>
                )}
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="!mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {loading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-blue-700 hover:underline dark:text-blue-300">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UserLogin;