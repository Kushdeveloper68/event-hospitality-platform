import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
} from '../../api/passwordResetApi'

// ── Password strength helper ──────────────────────────────────────────────────
function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special char', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const barColors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-500']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < score ? barColors[score - 1] : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(c => (
          <span
            key={c.label}
            className={`text-micro normal-case flex items-center gap-1 font-medium ${
              c.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">
              {c.ok ? 'check_circle' : 'radio_button_unchecked'}
            </span>
            {c.label}
          </span>
        ))}
        {score > 0 && (
          <span className={`text-micro normal-case font-bold ml-auto ${barColors[score - 1].replace('bg-', 'text-')}`}>
            {labels[score]}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  const steps = ['Email', 'Verify OTP', 'New Password']
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const step = i + 1
        const done = step < currentStep
        const active = step === currentStep
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-body font-bold transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                    ? 'bg-primary-500 text-white ring-4 ring-primary-500/20'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}
              >
                {done ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-micro normal-case tracking-wider ${
                  active ? 'text-primary-500 dark:text-primary-400' : done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 mb-5 rounded-full transition-all ${
                  step < currentStep ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
function ResetPassword() {
  const navigate = useNavigate()

  // step: 1 = email, 2 = otp, 3 = new password, 4 = success
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // form values kept in state — resetToken lives in memory only, never localStorage
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  // ── OTP box input handling ──────────────────────────────────────────────────
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)
    // auto-focus next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
    }
  }

  const otpValue = otp.join('')

  // ── Resend cooldown timer ───────────────────────────────────────────────────
  const startResendCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // ── Step 1: submit email ────────────────────────────────────────────────────
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    const res = await requestPasswordReset(email.trim().toLowerCase())
    setLoading(false)

    if (res.success) {
      setStep(2)
      startResendCooldown()
    } else {
      setError(res.message)
    }
  }

  // ── Step 2: verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit code.')
      return
    }

    setLoading(true)
    const res = await verifyResetOTP(email.trim().toLowerCase(), otpValue)
    setLoading(false)

    if (res.success) {
      setResetToken(res.resetToken)
      setStep(3)
    } else {
      setError(res.message)
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    }
  }

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return
    setError('')
    setOtp(['', '', '', '', '', ''])
    setLoading(true)
    const res = await requestPasswordReset(email.trim().toLowerCase())
    setLoading(false)
    if (res.success) {
      startResendCooldown()
    } else {
      setError(res.message)
    }
  }

  // ── Step 3: reset password ──────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in both password fields.')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const res = await resetPassword(resetToken, newPassword, confirmPassword)
    setLoading(false)

    if (res.success) {
      setStep(4)
    } else {
      setError(res.message)
      // If reset token expired, send user back to step 1
      if (res.message?.toLowerCase().includes('expired') || res.message?.toLowerCase().includes('invalid')) {
        setTimeout(() => {
          setStep(1)
          setError('Your reset session expired. Please start again.')
          setResetToken('')
          setNewPassword('')
          setConfirmPassword('')
          setOtp(['', '', '', '', '', ''])
        }, 2000)
      }
    }
  }

  // ── Shared input class ──────────────────────────────────────────────────────
  const inputClass = `w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none
    transition-all text-body`

  return (
    <div className="min-h-screen bg-surface-soft dark:bg-surface-dark-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 transition-opacity hover:opacity-90">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0">
            <img
              src="/event-logo-with-icon-dark-bg-removebg-preview.png"
              alt="EventCure Logo"
              loading="lazy"
            />
          </div>
          <span className="font-display text-card-h3 text-slate-900 dark:text-white tracking-tight">EventCure</span>
        </Link>

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-card dark:shadow-card-dark border border-slate-200 dark:border-slate-800 p-8">

          {/* ── Step 4: Success ── */}
          {step === 4 ? (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400">
                  check_circle
                </span>
              </div>
              <div>
                <h2 className="font-display text-section-h2 text-slate-900 dark:text-slate-100 mb-2">
                  Password Reset!
                </h2>
                <p className="text-body text-slate-500 dark:text-slate-400">
                  Your password has been updated successfully. You can now sign in with your new password.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-11 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">login</span>
                Go to Login
              </button>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <StepIndicator currentStep={step} />

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 mb-5">
                  <span className="material-symbols-outlined text-red-500 text-lg mt-0.5 shrink-0">
                    error
                  </span>
                  <p className="text-body text-red-700 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}

              {/* ── Step 1: Enter email ── */}
              {step === 1 && (
                <form onSubmit={handleRequestOTP} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-section-h2 text-slate-900 dark:text-slate-100">Forgot Password?</h2>
                    <p className="text-body text-slate-500 dark:text-slate-400 mt-1">
                      Enter your email and we'll send you a reset code.
                    </p>
                  </div>

                  <div>
                    <label className="block text-body font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl pointer-events-none">
                        mail
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        placeholder="you@example.com"
                        className={`${inputClass} pl-11`}
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending OTP…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">send</span>
                        Send Reset Code
                      </>
                    )}
                  </button>

                  <p className="text-center text-body text-slate-500 dark:text-slate-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary-500 dark:text-primary-400 font-bold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              )}

              {/* ── Step 2: Enter OTP ── */}
              {step === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-section-h2 text-slate-900 dark:text-slate-100">Check Your Email</h2>
                    <p className="text-body text-slate-500 dark:text-slate-400 mt-1">
                      We sent a 6-digit code to{' '}
                      <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>
                    </p>
                  </div>

                  {/* OTP boxes */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, i)}
                        onKeyDown={e => handleOtpKeyDown(e, i)}
                        onPaste={i === 0 ? handleOtpPaste : undefined}
                        className={`size-12 text-center text-xl font-black border-2 rounded-xl outline-none transition-all
                          ${digit
                            ? 'border-primary-500 bg-primary-500/5 text-primary-500 dark:text-primary-400'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
                          }
                          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpValue.length < 6}
                    className="w-full h-11 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">verified</span>
                        Verify Code
                      </>
                    )}
                  </button>

                  {/* Resend */}
                  <div className="text-center space-y-2">
                    <p className="text-body text-slate-500 dark:text-slate-400">Didn't receive the code?</p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || loading}
                      className="text-body font-bold text-primary-500 dark:text-primary-400 hover:underline disabled:text-slate-400 dark:disabled:text-slate-600 disabled:no-underline transition-colors"
                    >
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Code'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); setOtp(['', '', '', '', '', '']) }}
                    className="flex items-center gap-1 text-body text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mx-auto"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Change email
                  </button>
                </form>
              )}

              {/* ── Step 3: New password ── */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="font-display text-section-h2 text-slate-900 dark:text-slate-100">Set New Password</h2>
                    <p className="text-body text-slate-500 dark:text-slate-400 mt-1">
                      Choose a strong password for your account.
                    </p>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-body font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl pointer-events-none">
                        lock
                      </span>
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setError('') }}
                        placeholder="Min. 8 characters"
                        className={`${inputClass} pl-11 pr-11`}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showNew ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    <PasswordStrength password={newPassword} />
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-body font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xl pointer-events-none">
                        lock_reset
                      </span>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                        placeholder="Repeat your password"
                        className={`${inputClass} pl-11 pr-11 ${
                          confirmPassword && confirmPassword !== newPassword
                            ? 'border-red-400 focus:ring-red-200 dark:border-red-500'
                            : confirmPassword && confirmPassword === newPassword
                            ? 'border-emerald-400 focus:ring-emerald-200 dark:border-emerald-500'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showConfirm ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-caption text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword && confirmPassword === newPassword && (
                      <p className="text-caption text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Passwords match
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                    className="w-full h-11 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Resetting Password…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">lock_reset</span>
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword