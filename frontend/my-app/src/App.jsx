import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

// Pages
import LoginPage from "./LoginPage";
import Dashboard from "./pages/Dashboard";
import GithubSetupPage from "./pages/GithubSetupPage";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/github/setup"
          element={<GithubSetupPage />}
          />
        


        {/* ==================== PROTECTED ROUTES ==================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          


          {/* Add future protected pages here */}
          {/*
          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/deployments"
            element={<Deployments />}
          />

          <Route
            path="/environment"
            element={<Environment />}
          />
          */}

        </Route>


        {/* ==================== DEFAULT ==================== */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
