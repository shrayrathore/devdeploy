import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./GithubSetupPage.css";

const GithubSetupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pending = searchParams.get("pending");

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!pending) {
      setError("Your GitHub session is invalid or expired.");
      return;
    }

    if (loginId.trim().length < 3) {
      setError("Login ID must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/github/setup", {
        pendingId: pending,
        loginId: loginId.trim(),
        password,
      });

      if (response.data?.success) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="github-setup-page">
      <div className="github-setup-card">
        <div className="github-setup-icon">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="
                M12 .5C5.65.5.5 5.65.5 12
                c0 5.09 3.29 9.4 7.86 10.93
                .57.1.79-.25.79-.55
                0-.27-.01-1.16-.02-2.11
                -3.2.7-3.87-1.36-3.87-1.36
                -.53-1.33-1.29-1.69-1.29-1.69
                -1.05-.72.08-.7.08-.7
                1.16.08 1.77 1.19 1.77 1.19
                1.03 1.77 2.71 1.26 3.37.96
                .1-.75.4-1.26.73-1.55
                -2.55-.29-5.24-1.28-5.24-5.69
                0-1.26.45-2.29 1.19-3.09
                -.12-.29-.52-1.47.11-3.06
                0 0 .97-.31 3.18 1.18
                a11.06 11.06 0 0 1 5.79 0
                c2.2-1.49 3.17-1.18 3.17-1.18
                .63 1.59.23 2.77.11 3.06
                .74.8 1.19 1.83 1.19 3.09
                0 4.42-2.7 5.4-5.26 5.68
                .41.36.78 1.07.78 2.16
                0 1.56-.01 2.82-.01 3.2
                0 .31.21.66.79.55
                C20.21 21.39 23.5 17.08 23.5 12
                c0-6.35-5.15-11.5-11.5-11.5Z
              "
            />
          </svg>
        </div>

        <h1>Create your DevDeploy account</h1>

        <p className="github-setup-subtitle">
          Your GitHub account is connected. Create a Login ID
          and password for future DevDeploy logins.
        </p>

        {error && (
          <div className="github-setup-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Login ID
            <input
              type="text"
              placeholder="Choose your Login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={loading}
              autoComplete="username"
              required
            />
          </label>

          <label>
            Password
            <div className="setup-password">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label>
            Confirm password
            <div className="setup-password">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={loading}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm((prev) => !prev)
                }
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="github-setup-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GithubSetupPage;