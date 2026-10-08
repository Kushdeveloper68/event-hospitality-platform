import React, { useState, useEffect, useRef } from "react";
import { signupInitiate, verifyOTP, resendOTP } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "../../components/";
import GoogleSignInButton from "../../components/GoogleSignInButton";

const OTP_EXPIRY_SECONDS = 600; // how long a code stays valid
const RESEND_COOLDOWN_SECONDS = 30; // how soon a new code can be requested

// ─── Shared auth styles ───────────────────────────────────────────────────────
const INPUT_BASE =
  "h-11 w-full rounded-xl border bg-slate-50 pl-10 pr-3.5 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900";
const INPUT_OK =
  "border-slate-200 focus:border-blue-400 focus:ring-blue-100 dark:border-slate-700 dark:focus:border-blue-500/60 dark:focus:ring-blue-500/20";
const INPUT_ERR =
  "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-500/40 dark:focus:border-red-500/60 dark:focus:ring-red-500/20";

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      ) : (
        hint
      )}
    </div>
  );
}

function IconInput({ icon, error, className = "", inputRef, children, ...props }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">{icon}</span>
      <input ref={inputRef} className={`${INPUT_BASE} ${error ? INPUT_ERR : INPUT_OK} ${className}`} {...props} />
      {children}
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

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "A symbol (!@#$…)", ok: /[^A-Za-z0-9]/.test(password) },
    { label: "A number", ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const bar = ["bg-slate-200 dark:bg-slate-700", "bg-red-500", "bg-amber-500", "bg-emerald-500"][score];
  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < score ? bar : "bg-slate-200 dark:bg-slate-700"}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`flex items-center gap-1 text-[11px] font-medium ${
              c.ok ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{c.ok ? "check_circle" : "radio_button_unchecked"}</span>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [termConditions, setTermConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: signup form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [expiresIn, setExpiresIn] = useState(0);
  const [resendIn, setResendIn] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const otpRef = useRef(null);
  const lastTriedOtp = useRef("");

  // One ticking interval for both countdowns (code expiry and resend cooldown)
  useEffect(() => {
    if (step !== 2) return undefined;
    const t = setInterval(() => {
      setExpiresIn((s) => (s > 0 ? s - 1 : 0));
      setResendIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (step === 1) nameRef.current?.focus();
    else otpRef.current?.focus();
  }, [step]);

  const clearField = (key) => fieldErrors[key] && setFieldErrors((p) => ({ ...p, [key]: null }));

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errs = {};
    if (!name.trim()) errs.name = "Please enter your full name";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email address";
    if (!organizationName.trim()) errs.organizationName = "Please enter your organization";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!termConditions) errs.terms = "Please accept the Terms and Privacy Policy";
    setFieldErrors(errs);

    const first = ["name", "email", "organizationName", "password", "terms"].find((k) => errs[k]);
    if (first) {
      document.getElementById(`signup-${first}`)?.focus();
      return;
    }

    setLoading(true);
    try {
      const response = await signupInitiate({
        email: email.trim(),
        password,
        name: name.trim(),
        organizationName: organizationName.trim(),
        termCondition: termConditions,
      });

      if (response.success) {
        setSuccess("We sent a 6-digit code to your email.");
        setStep(2);
        setExpiresIn(OTP_EXPIRY_SECONDS);
        setResendIn(RESEND_COOLDOWN_SECONDS);
        setOtp("");
        lastTriedOtp.current = "";
      } else {
        setError(response.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code) => {
    setError("");
    setSuccess("");
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(email.trim(), code);
      if (response.success) {
        if (response.user) login(response.user);
        setSuccess("Email verified — taking you to your dashboard…");
        navigate("/dashboard");
        return;
      }
      setError(response.message || "OTP verification failed");
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Verify automatically as soon as the 6th digit is entered
  useEffect(() => {
    if (otp.length < 6) {
      lastTriedOtp.current = "";
      return;
    }
    if (step === 2 && !loading && lastTriedOtp.current !== otp) {
      lastTriedOtp.current = otp;
      verifyCode(otp);
    }
    // eslint-disable-next-line
  }, [otp, step]);

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await resendOTP(email.trim());
      if (response.success) {
        setSuccess("A new code is on its way.");
        setExpiresIn(OTP_EXPIRY_SECONDS);
        setResendIn(RESEND_COOLDOWN_SECONDS);
        setOtp("");
        lastTriedOtp.current = "";
        otpRef.current?.focus();
      } else {
        setError(response.message || "Failed to resend code");
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <AuthHeader hint="Already have an account?" linkTo="/login" linkLabel="Log in" />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
            {/* Step indicator */}
            <div className="mb-5 flex items-center gap-2" aria-label={`Step ${step} of 2`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">Step {step} of 2</span>
              <div className="flex flex-1 gap-1.5">
                <div className="h-1 flex-1 rounded-full bg-blue-600 dark:bg-blue-500" />
                <div className={`h-1 flex-1 rounded-full transition-colors ${step === 2 ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              </div>
            </div>

            <div className="mb-6">
              {step === 1 ? (
                <>
                  <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-950 dark:text-slate-50">Create your account</h1>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Join your operations team on the hospitality platform.</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-950 dark:text-slate-50">Verify your email</h1>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    Enter the 6-digit code we sent to{" "}
                    <strong className="font-bold text-slate-800 dark:text-slate-200">{email}</strong>.{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp("");
                        setError("");
                        setSuccess("");
                      }}
                      disabled={loading}
                      className="font-bold text-blue-700 hover:underline dark:text-blue-300"
                    >
                      Wrong email?
                    </button>
                  </p>
                </>
              )}
            </div>

            {error && <Alert onClose={() => setError("")}>{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <GoogleSignInButton mode="signup" />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-xs font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-500">or sign up with email</span>
                  </div>
                </div>

                <form onSubmit={handleSignupSubmit} noValidate className="space-y-4">
                  <Field label="Full name" htmlFor="signup-name" error={fieldErrors.name}>
                    <IconInput
                      inputRef={nameRef}
                      id="signup-name"
                      icon="person"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearField("name");
                      }}
                      disabled={loading}
                      error={fieldErrors.name}
                    />
                  </Field>

                  <Field label="Business email" htmlFor="signup-email" error={fieldErrors.email}>
                    <IconInput
                      id="signup-email"
                      icon="mail"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearField("email");
                      }}
                      disabled={loading}
                      error={fieldErrors.email}
                    />
                  </Field>

                  <Field label="Organization name" htmlFor="signup-organizationName" error={fieldErrors.organizationName}>
                    <IconInput
                      id="signup-organizationName"
                      icon="business"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Events Corp"
                      value={organizationName}
                      onChange={(e) => {
                        setOrganizationName(e.target.value);
                        clearField("organizationName");
                      }}
                      disabled={loading}
                      error={fieldErrors.organizationName}
                    />
                  </Field>

                  <Field
                    label="Password"
                    htmlFor="signup-password"
                    error={fieldErrors.password}
                    hint={!password && <p className="mt-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">At least 8 characters, with a symbol.</p>}
                  >
                    <IconInput
                      id="signup-password"
                      icon="lock"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearField("password");
                      }}
                      disabled={loading}
                      error={fieldErrors.password}
                      className="pr-11"
                    >
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </IconInput>
                    <PasswordStrength password={password} />
                  </Field>

                  {/* Terms */}
                  <div>
                    <div className="flex items-start gap-3">
                      <input
                        id="signup-terms"
                        type="checkbox"
                        checked={termConditions}
                        onChange={(e) => {
                          setTermConditions(e.target.checked);
                          clearField("terms");
                        }}
                        disabled={loading}
                        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 accent-blue-600 dark:border-slate-600"
                      />
                      <label htmlFor="signup-terms" className="cursor-pointer text-sm leading-snug text-slate-600 dark:text-slate-400">
                        I agree to the{" "}
                        <Link to="/terms" className="font-bold text-blue-700 hover:underline dark:text-blue-300">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="font-bold text-blue-700 hover:underline dark:text-blue-300">
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>
                    {fieldErrors.terms && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {fieldErrors.terms}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="!mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    {loading ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create account
                        <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyCode(otp);
                }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="signup-otp" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Verification code
                  </label>
                  <input
                    ref={otpRef}
                    id="signup-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={loading}
                    className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-2xl font-extrabold tracking-[0.5em] text-slate-900 outline-none transition placeholder:font-bold placeholder:text-slate-300 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-blue-500/60 dark:focus:bg-slate-900 dark:focus:ring-blue-500/20"
                  />
                  <p className="mt-2 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                    {expiresIn > 0 ? (
                      <>
                        Code expires in <strong className="tabular-nums text-slate-700 dark:text-slate-200">{formatTime(expiresIn)}</strong>
                      </>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-300">This code has expired — request a new one below.</span>
                    )}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {loading ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      Verify email
                      <span className="material-symbols-outlined text-[19px]">check_circle</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <span>Didn't get it?</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading || resendIn > 0}
                    className="font-bold text-blue-700 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline dark:text-blue-300 dark:disabled:text-slate-500"
                  >
                    {resendIn > 0 ? `Resend in ${formatTime(resendIn)}` : "Resend code"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-700 hover:underline dark:text-blue-300">
              Log in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UserSignup;