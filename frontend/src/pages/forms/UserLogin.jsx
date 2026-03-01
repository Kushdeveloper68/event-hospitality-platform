import React, {useState} from "react"
import { loginUser } from "../../api/userApi"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)

    try {
      const response = await loginUser(email, password)

      if (response.success) {
        // update context immediately
        if (response.user) login(response.user);
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        {/* <!-- Main Login Card --> */}
        <div className="w-full max-w-md bg-white dark:bg-[#1c222d] rounded-lg shadow-sm border border-[#e5e7eb] dark:border-[#2d3646] p-8 md:p-10">
          {/* <!-- Logo Section --> */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white mb-4">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_6_543)">
                  <path
                    d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clippath id="clip0_6_543">
                    <rect fill="white" height="48" width="48"></rect>
                  </clippath>
                </defs>
              </svg>
            </div>
            <h2 className="text-[#111318] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-[#6b7280] dark:text-[#9ca3af] text-sm text-center">
              Please enter your details to sign in.
            </p>
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

          {/* <!-- Login Form --> */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <!-- Email Field --> */}
            <div>
              <label
                className="block text-sm font-medium text-[#111827] dark:text-white mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="block w-full rounded-lg border border-[#d1d5db] dark:border-[#374151] bg-white dark:bg-[#111621] px-4 py-3 text-[#111827] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* <!-- Password Field --> */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="block text-sm font-medium text-[#111827] dark:text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  href="/forgot-password"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  className="block w-full rounded-lg border border-[#d1d5db] dark:border-[#374151] bg-white dark:bg-[#111621] px-4 py-3 text-[#111827] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm disabled:bg-gray-100 dark:disabled:bg-gray-800"
                  id="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6b7280] hover:text-[#111827] dark:hover:text-white transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* <!-- Remember Me & Terms (Optional context placeholder) --> */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-[#d1d5db] text-primary focus:ring-primary"
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label
                className="ml-2 block text-xs text-[#6b7280] dark:text-[#9ca3af]"
                htmlFor="remember-me"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* <!-- Sign In Button --> */}
            <button
              className="flex w-full items-center justify-center rounded-lg bg-primary disabled:bg-gray-400 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* <!-- Footer Section --> */}
          <div className="mt-8 border-t border-[#f3f4f6] dark:border-[#2d3646] pt-6 text-center">
            <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
              Don't have an account?
              <a
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                href="/signup"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>

        {/* <!-- Decorative Background Element (Subtle context indicator) --> */}
        <div className="mt-8 text-center opacity-40">
          <p className="text-xs font-medium uppercase tracking-widest text-[#6b7280] dark:text-[#9ca3af]">
            Enterprise SaaS Hospitality Platform
          </p>
        </div>
      </div>

      {/* <!-- Image Placeholder Context (Background decorative pattern) --> */}
      <div className="fixed top-0 left-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </>
  );
}

export default UserLogin;
