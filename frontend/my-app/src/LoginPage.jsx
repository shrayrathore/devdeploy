import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import api from "./services/api";

/**
 * LoginPage
 *
 * Premium dark login screen for DevDeploy.
 * Existing UI/design is preserved.
 *
 * Authentication:
 * 1. Login ID + Password -> POST /auth/login
 * 2. GitHub -> GET /auth/github
 */
const LoginPage = ({ onLogin, onGithubLogin }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Normal Login
  // =========================
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter your Login ID and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        loginId: username.trim(),
        password,
      });

      if (response.data?.success) {
        // Allow parent component to handle login if provided
        if (typeof onLogin === "function") {
          onLogin(response.data.user);
        }

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError(response.data?.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GitHub OAuth
  // =========================
  const handleGithubLogin = () => {
    if (loading || githubLoading) return;

    setError("");
    setGithubLoading(true);

    // Allow parent callback if one exists
    if (typeof onGithubLogin === "function") {
      onGithubLogin();
      return;
    }

    // Start GitHub OAuth
    window.location.href = `${api.defaults.baseURL}/auth/github`;
  };

  // =========================
  // Password Visibility
  // =========================
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-page">
      {/* ================= LEFT: illustration ================= */}
      <section className="illustration-panel" aria-hidden="true">
        <div className="scene">
          {/* soft ambient sky decoration, pure CSS */}
          <div className="scene__sky">
            <span className="cloud cloud--a" />
            <span className="cloud cloud--b" />
            <span className="star star--a" />
            <span className="star star--b" />
            <span className="star star--c" />
            <span className="star star--d" />
            <span className="sparkle sparkle--a" />
            <span className="sparkle sparkle--b" />
          </div>

          <div className="scene__copy">
            <p className="scene__eyebrow">DEPLOY. SCALE.</p>
            <p className="scene__headline">REPEAT</p>
          </div>

          {/* hero artwork: plane, flight path, whale + containers */}
          <svg
            className="scene__art"
            viewBox="0 0 560 460"
            preserveAspectRatio="xMidYMax meet"
            focusable="false"
          >
            <defs>
              <linearGradient
                id="whaleBody"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#4c3f9e" />
                <stop offset="55%" stopColor="#332a6e" />
                <stop offset="100%" stopColor="#1f1a49" />
              </linearGradient>

              <linearGradient
                id="whaleBelly"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8b7cf0" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#8b7cf0" stopOpacity="0" />
              </linearGradient>

              <linearGradient
                id="planeFill"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#b3a4ff" />
                <stop offset="100%" stopColor="#7c6ff2" />
              </linearGradient>

              <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* flight path connecting the plane to the whale's back */}
            <path
              className="art__path"
              d="M 430 40 C 470 90, 420 140, 380 168 C 340 195, 305 190, 295 176"
              fill="none"
              stroke="#8b7cf0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 10"
              opacity="0.55"
            />

            {/* paper plane */}
            <g
              className="art__plane"
              transform="translate(415, 28) rotate(52)"
            >
              <path
                d="M0 0 L26 10 L0 20 L5 10 Z"
                fill="url(#planeFill)"
              />
              <path
                d="M0 0 L12 10 L5 10 Z"
                fill="#5c4fd6"
                opacity="0.6"
              />
            </g>

            {/* soft glow behind the whale */}
            <ellipse
              cx="270"
              cy="310"
              rx="220"
              ry="140"
              fill="url(#backGlow)"
            />

            {/* whale group */}
            <g className="art__whale">
              <path
                d="
                  M 92 322
                  C 97 266, 152 228, 228 224
                  C 258 222, 290 224, 322 234
                  C 362 246, 398 262, 424 288
                  L 462 250
                  L 442 292
                  L 480 324
                  L 426 320
                  C 404 348, 356 366, 288 370
                  C 214 374, 144 368, 104 350
                  C 96 344, 92 334, 92 322 Z
                "
                fill="url(#whaleBody)"
              />

              {/* belly highlight */}
              <path
                d="
                  M 110 336
                  C 140 360, 200 366, 250 356
                  C 275 350, 292 338, 298 322
                  C 260 344, 205 350, 160 344
                  C 140 341, 122 338, 110 336 Z
                "
                fill="url(#whaleBelly)"
              />

              {/* cheek blush */}
              <ellipse
                cx="168"
                cy="322"
                rx="15"
                ry="9"
                fill="#f0a8d0"
                opacity="0.35"
              />

              {/* eye */}
              <circle cx="186" cy="302" r="8.5" fill="#161238" />
              <circle cx="189" cy="299" r="2.6" fill="#f2f0ff" />

              {/* smile */}
              <path
                d="M 166 324 C 176 334, 194 334, 204 325"
                fill="none"
                stroke="#161238"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* subtle top highlight */}
              <path
                d="M 130 260 C 170 232, 225 220, 275 226"
                fill="none"
                stroke="#a99bff"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.35"
              />

              {/* deployment containers */}
              <g className="art__containers">
                <rect
                  x="238"
                  y="196"
                  width="38"
                  height="26"
                  rx="5"
                  fill="#2a2361"
                  stroke="#463a86"
                  strokeWidth="1"
                />

                <line
                  x1="245"
                  y1="204"
                  x2="266"
                  y2="204"
                  stroke="#6a5cc0"
                  strokeWidth="1.5"
                  opacity="0.5"
                />

                <rect
                  x="272"
                  y="176"
                  width="46"
                  height="34"
                  rx="5"
                  fill="#4c3f9e"
                  stroke="#7161d6"
                  strokeWidth="1"
                />

                <text
                  x="295"
                  y="197"
                  textAnchor="middle"
                  className="art__container-glyph"
                >
                  {"</>"}
                </text>

                <rect
                  x="316"
                  y="200"
                  width="34"
                  height="24"
                  rx="5"
                  fill="#3a3178"
                  stroke="#54479c"
                  strokeWidth="1"
                />

                <line
                  x1="322"
                  y1="208"
                  x2="342"
                  y2="208"
                  stroke="#7666c9"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </g>
            </g>

            {/* bubbles */}
            <circle
              className="art__bubble art__bubble--a"
              cx="88"
              cy="370"
              r="5"
              fill="#9d8ff5"
              opacity="0.4"
            />

            <circle
              className="art__bubble art__bubble--b"
              cx="70"
              cy="400"
              r="3.2"
              fill="#9d8ff5"
              opacity="0.35"
            />

            <circle
              className="art__bubble art__bubble--c"
              cx="106"
              cy="410"
              r="4"
              fill="#9d8ff5"
              opacity="0.3"
            />

            {/* sea-floor silhouette */}
            <path
              d="
                M 0 440
                C 120 420, 220 452, 340 434
                C 420 422, 500 438, 560 424
                L 560 460
                L 0 460 Z
              "
              fill="#0e0c22"
              opacity="0.6"
            />

            {/* underwater plants */}
            <path
              className="art__plant art__plant--a"
              d="M 40 440 C 34 410, 46 388, 42 362"
              fill="none"
              stroke="#3d3572"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              className="art__plant art__plant--b"
              d="M 54 442 C 62 418, 52 398, 60 378"
              fill="none"
              stroke="#463c86"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <path
              className="art__plant art__plant--c"
              d="M 512 444 C 520 418, 508 398, 516 376"
              fill="none"
              stroke="#3d3572"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      {/* ================= RIGHT: login card ================= */}
      <section className="login-panel">
        <div className="login-panel__sky" aria-hidden="true">
          <span className="cloud cloud--c" />
          <span className="star star--e" />
          <span className="star star--f" />
          <span
            className="star star--g"
            style={{ animationDelay: "0.9s" }}
          />
          <span className="sparkle sparkle--c" />
          <span
            className="sparkle sparkle--d"
            style={{ animationDelay: "1.3s" }}
          />
          <span className="sparkle sparkle--e" />
        </div>

        <form className="login-card" onSubmit={handleLogin} noValidate>
          <div className="login-card__icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path
                d="M16 34h16a8 8 0 0 0 1-15.9A10 10 0 0 0 14 20.2 7 7 0 0 0 16 34Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />

              <path
                d="M24 30v-9m0 0-4 4m4-4 4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="login-card__title">Welcome Back</h1>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {/* Login ID */}
          <div className="field">
            <label htmlFor="login-username" className="visually-hidden">
              Login ID
            </label>

            <span className="field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle
                  cx="12"
                  cy="8"
                  r="3.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M5 20c0-4 3.2-6.5 7-6.5S19 16 19 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Login ID"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              disabled={loading || githubLoading}
              required
            />
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="login-password" className="visually-hidden">
              Password
            </label>

            <span className="field__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <rect
                  x="5.5"
                  y="10.5"
                  width="13"
                  height="9.5"
                  rx="2.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••••••"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              disabled={loading || githubLoading}
              required
            />

            <button
              type="button"
              className="field__toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              disabled={loading || githubLoading}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="
                      M3.5 3.5l17 17
                      M9.9 5.6A10.4 10.4 0 0 1 12 5.4
                      c5 0 8.6 3.3 10.1 6.6
                      a11.6 11.6 0 0 1-3 3.9
                      M6.6 6.6C4.4 8.1 2.9 10 1.9 12
                      c1.5 3.3 5.1 6.6 10.1 6.6
                      1.4 0 2.7-.2 3.9-.7
                      M14.1 14.1a3 3 0 0 1-4.2-4.2
                    "
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="
                      M1.9 12
                      c1.5-3.3 5.1-6.6 10.1-6.6
                      S20.6 8.7 22.1 12
                      c-1.5 3.3-5.1 6.6-10.1 6.6
                      S3.4 15.3 1.9 12Z
                    "
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* GitHub OAuth */}
          <button
            type="button"
            className="github-button"
            onClick={handleGithubLogin}
            disabled={loading || githubLoading}
          >
            {githubLoading ? (
              <span className="login-spinner" aria-hidden="true" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="
                    M12 .5
                    C5.65.5.5 5.65.5 12
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
                    23.5 5.65 18.35.5 12 .5Z
                  "
                />
              </svg>
            )}

            <span>
              {githubLoading ? "Connecting..." : "Github"}
            </span>
          </button>

          {/* Normal Login */}
          <button
            type="submit"
            className="submit-button"
            aria-label="Log in"
            disabled={loading || githubLoading}
          >
            {loading ? (
              <span className="login-spinner" aria-hidden="true" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                focusable="false"
                aria-hidden="true"
              >
                <path
                  d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;