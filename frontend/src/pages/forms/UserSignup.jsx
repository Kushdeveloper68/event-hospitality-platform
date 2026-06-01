import React, {useState, useEffect} from "react"
import { signupInitiate, verifyOTP, resendOTP } from "../../api/userApi"
import { useAuth } from "../../context/AuthContext"
import { useNavigate, Link } from 'react-router-dom';
import {Footer} from "../../components/";
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
  const { login } = useAuth();
  const navigate = useNavigate();

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
        // update auth context if user object provided
        if (response.user) login(response.user);
        setSuccess('Email verified successfully! Redirecting...')
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000)
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
  <header className="w-full border-b border-slate-200 bg-slate-50/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-primary transition-opacity hover:opacity-90">
        <div className="size-8 rounded-lg flex items-center justify-center">
              <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure Logo" loading='lazy'/>
            </div>
          
          <div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              EventCure
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 tracking-wider uppercase">
              Hospitality
            </p>
          </div>
      </Link>
      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm text-slate-600 dark:text-slate-400">Already have an account?</span>
        <Link to="/login" className="text-sm font-semibold text-primary hover:underline">
          Log in
        </Link>
      </div>
    </div>
  </header>
  {/* <!-- Main Content Area --> */}
  <main className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-12">
    <div className="w-full max-w-120">
      {/* <!-- Signup Card --> */}
      <div
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/30">
        <div className="p-8 sm:p-10">
          {/* <!-- Header --> */}
          <div className="mb-8 text-center sm:text-left">
            {step === 1 ? (
              <>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Create your account
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Join your operations team on the hospitality platform.
                </p>
              </>
            ) : (
              <>
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Verify your email
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </>
            )}
          </div>

          {/* <!-- Alert Messages --> */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/40">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/40">
              <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* <!-- STEP 1: Signup Form --> */}
          { step === 1 && (
            <form className="space-y-5" onSubmit={handleSignupSubmit}>
              {/* <!-- Full Name --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Full Name</label>
                <div className="relative">
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
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
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Business Email</label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                  placeholder="name@company.com" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {/* <!-- Organization Name --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Organization Name</label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                  placeholder="Acme Events Corp" 
                  type="text" 
                  value={organizationName} 
                  onChange={(e) => setOrganizationName(e.target.value)}
                  disabled={loading}
                />
              </div>
              {/* <!-- Password --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Password</label>
                <div className="relative group">
                  <input
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                    placeholder="••••••••" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    type="button">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
                <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-400">
                  Must be at least 8 characters with a symbol.
                </p>
              </div>
              {/* <!-- Terms --> */}
              <div className="flex items-start gap-3 py-2">
                <input 
                  className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600" 
                  id="terms"
                  type="checkbox" 
                  checked={termConditions}  
                  onChange={(e) => setTermConditions(e.target.checked)}
                  disabled={loading}
                />
                <label className="text-sm leading-tight text-slate-600 dark:text-slate-400" htmlFor="terms">
                  I agree to the <span className="text-primary">Terms of Service</span> and <span className="text-primary">Privacy Policy</span>.
                </label>
              </div>
              {/* <!-- Primary Button --> */}
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-bold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:bg-gray-400"
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
                <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Verification Code
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-4 text-center text-2xl font-bold tracking-widest text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
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
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  This code expires in: <strong>{formatTime(otpTimer)}</strong>
                </p>
              </div>

              {/* <!-- Submit Button --> */}
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-bold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:bg-gray-400"
                type="submit"
                disabled={loading || otp.length !== 6}
              >
                <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
                {!loading && <span className="material-symbols-outlined text-[20px]">check_circle</span>}
              </button>

              {/* <!-- Resend OTP --> */}
              <div className="text-center">
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
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
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="flex-1 rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
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
                <Link
                  to="/login"
                  className="flex flex-1 items-center justify-center rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary dark:hover:text-primary"
                >
                  Go to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* <!-- Card Footer (Mobile Visible) --> */}
        <div className="bg-slate-50 px-8 py-4 text-center dark:bg-slate-900/60 md:hidden">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?
            <Link className="font-semibold text-primary hover:underline" to="/login">Log in</Link>
          </p>
        </div>
      </div>

      
    </div>
  </main>
  <Footer />
    </>
  )
}

export default UserSignup