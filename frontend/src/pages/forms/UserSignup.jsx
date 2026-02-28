import React, {useState, useEffect} from "react"
import { signupInitiate, verifyOTP, resendOTP } from "../../api/userApi"

function UserSignup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [termConditions, setTermConditions] = useState(false)
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: signup form, 2: OTP verification
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [otpTimer])

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!email || !password || !name || !organizationName) {
      setError('All fields are required')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!termConditions) {
      setError('Please accept Terms and Conditions')
      return
    }

    setLoading(true)

    try {
      const response = await signupInitiate({
        email,
        password,
        name,
        organizationName,
        termCondition: termConditions
      })

      if (response.success) {
        setSuccess('OTP sent to your email!')
        setStep(2) // Move to OTP verification step
        setOtpTimer(600) // 10 minutes
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)

    try {
      const response = await verifyOTP(email, otp)

      if (response.success) {
        setSuccess('Email verified successfully! Redirecting...')
        setTimeout(() => {
          window.location.href = '/dashboard' // Redirect to dashboard
        }, 2000)
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await resendOTP(email)
      if (response.success) {
        setSuccess('OTP resent successfully!')
        setOtpTimer(600) // 10 minutes
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <>
     {/* <!-- Top Navigation Bar --> */}
  <header className="w-full bg-white dark:bg-background-dark border-b border-border-subtle dark:border-gray-800 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2 text-primary">
        <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-xl">layers</span>
        </div>
        <h2 className="text-neutral-text dark:text-white text-lg font-bold tracking-tight">
          Hospitality Platform
        </h2>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">Already have an account?</span>
        <button className="text-primary text-sm font-semibold hover:underline">
          Log in
        </button>
      </div>
    </div>
  </header>
  {/* <!-- Main Content Area --> */}
  <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
    <div className="w-full max-w-[480px]">
      {/* <!-- Signup Card --> */}
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-border-subtle dark:border-gray-800 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* <!-- Header --> */}
          <div className="mb-8 text-center sm:text-left">
            {step === 1 ? (
              <>
                <h1 className="text-neutral-text dark:text-white text-3xl font-bold tracking-tight mb-2">
                  Create your account
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base">
                  Join your operations team on the hospitality platform.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-neutral-text dark:text-white text-3xl font-bold tracking-tight mb-2">
                  Verify your email
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </>
            )}
          </div>

          {/* <!-- Alert Messages --> */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* <!-- STEP 1: Signup Form --> */}
          { step === 1 && (
            <form className="space-y-5" onSubmit={handleSignupSubmit}>
              {/* <!-- Full Name --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Full Name</label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="John Doe" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              {/* <!-- Business Email --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Business Email</label>
                <input
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="name@company.com" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {/* <!-- Organization Name --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Organization Name</label>
                <input
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Acme Events Corp" 
                  type="text" 
                  value={organizationName} 
                  onChange={(e) => setOrganizationName(e.target.value)}
                  disabled={loading}
                />
              </div>
              {/* <!-- Password --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">Password</label>
                <div className="relative group">
                  <input
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all pr-12"
                    placeholder="••••••••" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                  Must be at least 8 characters with a symbol.
                </p>
              </div>
              {/* <!-- Terms --> */}
              <div className="flex items-start gap-3 py-2">
                <input 
                  className="mt-1 size-4 rounded border-border-subtle text-primary focus:ring-primary" 
                  id="terms"
                  type="checkbox" 
                  checked={termConditions}  
                  onChange={(e) => setTermConditions(e.target.checked)}
                  disabled={loading}
                />
                <label className="text-sm text-gray-500 dark:text-gray-400 leading-tight" htmlFor="terms">
                  I agree to the
                  <a className="text-primary hover:underline" href="#">Terms of Service</a>
                  and
                  <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>
              {/* <!-- Primary Button --> */}
              <button
                className="w-full bg-primary hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              </button>
            </form>
          )}

          {/* <!-- STEP 2: OTP Verification --> */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleOTPSubmit}>
              {/* <!-- OTP Input --> */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-neutral-text dark:text-gray-200">
                  Verification Code
                </label>
                <input
                  className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-border-subtle dark:border-gray-700 rounded-lg text-neutral-text dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-center text-2xl font-bold tracking-widest"
                  placeholder="000000"
                  type="text"
                  maxLength="6"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setOtp(value.slice(0, 6))
                  }}
                  disabled={loading}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This code expires in: <strong>{formatTime(otpTimer)}</strong>
                </p>
              </div>

              {/* <!-- Submit Button --> */}
              <button
                className="w-full bg-primary hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                type="submit"
                disabled={loading || otp.length !== 6}
              >
                <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
                {!loading && <span className="material-symbols-outlined text-[20px]">check_circle</span>}
              </button>

              {/* <!-- Resend OTP --> */}
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  className="text-primary font-semibold hover:underline disabled:text-gray-400 text-sm"
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || otpTimer > 0}
                >
                  {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : 'Resend Code'}
                </button>
              </div>

              {/* <!-- Back to Signup --> */}
              <button
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-neutral-text dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                type="button"
                onClick={() => {
                  setStep(1)
                  setOtp('')
                  setOtpTimer(0)
                }}
                disabled={loading}
              >
                Back to Signup
              </button>
            </form>
          )}
        </div>

        {/* <!-- Card Footer (Mobile Visible) --> */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-8 py-4 text-center md:hidden">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?
            <a className="text-primary font-semibold hover:underline" href="#">Log in</a>
          </p>
        </div>
      </div>

      {/* <!-- Global Footer --> */}
      <footer className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-medium">
        Enterprise Reliability • ISO 27001 Certified
      </footer>
    </div>
  </main>

  {/* <!-- Visual Background Element (Subtle) --> */}
  <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
  </div>
    </>
  )
}

export default UserSignup