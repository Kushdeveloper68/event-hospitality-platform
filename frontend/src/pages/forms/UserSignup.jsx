import React, {useState, useEffect} from "react"
import { signupInitiate, verifyOTP, resendOTP } from "../../api/userApi"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from "../../components/ui";

function UserSignup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-background-light">
      <div className="w-full max-w-lg space-y-6">
        <Card className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-card">
              <span className="material-symbols-outlined text-3xl">layers</span>
            </div>
            {step === 1 ? (
              <>
                <h1 className="text-text text-3xl font-bold tracking-tight mb-2">
                  Create your account
                </h1>
                <p className="text-text-muted text-base">
                  Join your operations team on the hospitality platform.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-text text-3xl font-bold tracking-tight mb-2">
                  Verify your email
                </h1>
                <p className="text-text-muted text-base">
                  We sent a verification code to <strong>{email}</strong>
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              {success}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-5" onSubmit={handleSignupSubmit}>
              <Input
                label="Full Name"
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Business Email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Organization Name"
                placeholder="Acme Events Corp"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={loading}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                helperText="Must be at least 8 characters with a symbol."
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                }
              />
              <div className="flex items-start gap-3 py-2">
                <input
                  className="mt-1 size-4 rounded border-border text-primary focus:ring-primary"
                  id="terms"
                  type="checkbox"
                  checked={termConditions}
                  onChange={(e) => setTermConditions(e.target.checked)}
                  disabled={loading}
                />
                <label className="text-sm text-text-muted leading-tight" htmlFor="terms">
                  I agree to the{" "}
                  <a className="text-primary hover:underline" href="#">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a className="text-primary hover:underline" href="#">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
              <Button type="submit" className="w-full" isLoading={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleOTPSubmit}>
              <Input
                label="Verification Code"
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
                helperText={`This code expires in: ${formatTime(otpTimer)}`}
                inputClassName="text-center text-2xl font-bold tracking-widest"
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-text-muted mb-3">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || otpTimer > 0}
                >
                  {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : "Resend Code"}
                </Button>
              </div>

              <Button
                variant="secondary"
                type="button"
                className="w-full"
                onClick={() => {
                  setStep(1)
                  setOtp('')
                  setOtpTimer(0)
                }}
                disabled={loading}
              >
                Back to Signup
              </Button>
            </form>
          )}
        </Card>

        <footer className="text-center text-xs text-text-muted uppercase tracking-widest font-medium">
          Enterprise Reliability • ISO 27001 Certified
        </footer>
      </div>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  )
}

export default UserSignup