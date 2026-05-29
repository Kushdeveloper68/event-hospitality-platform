import React, { useState } from "react";
import { loginUser } from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate , Link } from "react-router-dom";
import { Button, Card, Input } from "../../components/ui";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success) {
        // update context immediately
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
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-background-light">
      <div className="w-full max-w-md space-y-6">
        <Card className="p-8">
          <div className="flex flex-col items-center text-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-card">
              <span className="material-symbols-outlined text-3xl">event</span>
            </div>
            <h2 className="text-text text-2xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="text-text-muted text-sm">
              Please enter your details to sign in.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              id="email"
              placeholder="Enter your email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Password"
              labelAction={
                <Link
                  to="/reset-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              }
              id="password"
              placeholder="Enter your password"
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              }
            />

            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label
                className="ml-2 block text-xs text-text-muted"
                htmlFor="remember-me"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-sm text-text-muted">
            Don't have an account?
            <Link
              className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1"
              to="/signup"
            >
              Create an account
            </Link>
          </div>
        </Card>

        <p className="text-xs font-medium uppercase tracking-widest text-text-muted text-center">
          Enterprise SaaS Hospitality Platform
        </p>
      </div>

      <div className="fixed top-0 left-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default UserLogin;
