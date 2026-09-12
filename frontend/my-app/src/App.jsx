import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import ProjectDetails from "./pages/ProjectDetails";
// import Deployments from "./pages/Deployments";
// import Environment from "./pages/Environment";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";
import { Heading1 } from "lucide-react";
import LoginPage from "./LoginPage";
import Dashboard from "./pages/Dashboard";
import GithubSetupPage from "./pages/GithubSetupPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // <BrowserRouter>
    //   <div className="app">
    //     <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
    //     <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    //     <main className="main-content">{/* Your page content */}</main>
    //   </div>

    // </BrowserRouter>
     <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* New GitHub user */}
        <Route
          path="/github/setup"
          element={<GithubSetupPage />}
        />

        {/* Existing dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
