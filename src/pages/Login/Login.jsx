// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiLogIn } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/admin/gallery";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    // Small delay so the button/loading state actually feels real.
    await new Promise((resolve) => setTimeout(resolve, 400));
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="uka-login-page">
      <div className="uka-login-bg" />
      <div className="uka-login-card">
        <button className="uka-login-back" onClick={() => navigate("/")}>
          <FiArrowLeft /> Back to Home
        </button>

        <div className="uka-login-header">
          <div className="uka-login-badge">UK</div>
          <h1>Admin Login</h1>
          <p>Sign in to manage the UK Academy gallery</p>
        </div>

        <form className="uka-login-form" onSubmit={handleSubmit}>
          <label className="uka-login-field">
            <span className="uka-login-label">Email</span>
            <div className="uka-login-input-wrap">
              <FiMail className="uka-login-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="uka-login-field">
            <span className="uka-login-label">Password</span>
            <div className="uka-login-input-wrap">
              <FiLock className="uka-login-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="uka-login-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          {(localError || authError) && (
            <p className="uka-login-error">{localError || authError}</p>
          )}

          <button type="submit" className="uka-login-submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : (
              <>
                <FiLogIn /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
