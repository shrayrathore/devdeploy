// import Sidebar from '../components/Sidebar'
// import Navbar from '../components/Navbar'
// import {Router, BrowserRouter } from 'react-router-dom';
// import React, { useState } from 'react';

// export default function Dashboard() {
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     return (
//     <>
//       <div className="app">
//         <Navbar onMenuClick={() => setSidebarOpen(true)} />

//         <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//         <main className="main-content"></main>
//       </div>
//     </>

//   )
// }

import NewProjectModal from "../components/NewProjectModel";
import React, { useState, useEffect } from "react";
import { Folder, Rocket, CheckCircle2, XCircle, Plus, Eye } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import "./Dashboard.css";

export default function Dashboard() {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  //loading user
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");

        if (response.data?.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const deployments = [
    {
      project: "E-Commerce API",
      environment: "Production",
      version: "v1.4.2",
      status: "Success",
      deployedAt: "2 mins ago",
    },
    {
      project: "User Service",
      environment: "Staging",
      version: "v1.2.0",
      status: "Success",
      deployedAt: "15 mins ago",
    },
    {
      project: "Payment Service",
      environment: "Production",
      version: "v1.0.1",
      status: "Failed",
      deployedAt: "32 mins ago",
    },
    {
      project: "Notification Service",
      environment: "Development",
      version: "v0.3.0",
      status: "Running",
      deployedAt: "1 hour ago",
    },
    {
      project: "Analytics Service",
      environment: "Production",
      version: "v2.1.3",
      status: "Success",
      deployedAt: "2 hours ago",
    },
  ];

  return (
    <div className="app">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content dashboard-main">
        <NewProjectModal
          isOpen={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
          onCreated={(project) => {
            console.log("Project created:", project);

            // Later we can update dashboard statistics
            // or refresh project data here.
          }}
        />
        {/* ================= HEADER ================= */}
        <section className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome Back {user?.name || "Loading..."}!</p>
          </div>

        
          <button
            className="new-project-btn"
            onClick={() => setNewProjectOpen(true)}
          >
            <Plus size={17} />
            New Project
          </button>

         

        </section>

        {/* ================= STATS ================= */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Projects</span>

              <div className="stat-icon blue">
                <Folder size={17} />
              </div>
            </div>

            <strong>12</strong>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Deployments</span>

              <div className="stat-icon purple">
                <Rocket size={17} />
              </div>
            </div>

            <strong>34</strong>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Running</span>

              <div className="stat-icon green">
                <span className="status-dot green-dot"></span>
              </div>
            </div>

            <strong>18</strong>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Failed</span>

              <div className="stat-icon red">
                <span className="status-dot red-dot"></span>
              </div>
            </div>

            <strong className="failed-number">3</strong>
          </div>
        </section>

        {/* ================= RECENT DEPLOYMENTS ================= */}
        <section className="dashboard-card deployments-card">
          <div className="card-heading">
            <h2>Recent Deployments</h2>

            <button className="view-all-btn">View All</button>
          </div>

          <div className="deployment-table-wrapper">
            <table className="deployment-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Environment</th>
                  <th>Version</th>
                  <th>Status</th>
                  <th>Deployed At</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {deployments.map((deployment, index) => (
                  <tr key={index}>
                    <td className="project-name">{deployment.project}</td>

                    <td>{deployment.environment}</td>

                    <td>{deployment.version}</td>

                    <td>
                      <span
                        className={`deployment-status ${deployment.status.toLowerCase()}`}
                      >
                        {deployment.status}
                      </span>
                    </td>

                    <td>{deployment.deployedAt}</td>

                    <td>
                      <button className="view-btn">
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= BOTTOM CARDS ================= */}
        <section className="dashboard-bottom-grid">
          {/* PROJECT HEALTH */}
          <div className="dashboard-card health-card">
            <div className="card-heading">
              <h2>Projects Health</h2>
            </div>

            <div className="health-content">
              <div className="donut-wrapper">
                <div className="donut-chart">
                  <div className="donut-inner">
                    <strong>12</strong>
                    <span>Total</span>
                  </div>
                </div>
              </div>

              <div className="health-legend">
                <div className="legend-row">
                  <span className="legend-color healthy"></span>
                  <span>Healthy</span>
                  <strong>10 (83%)</strong>
                </div>

                <div className="legend-row">
                  <span className="legend-color warning"></span>
                  <span>Warning</span>
                  <strong>1 (8%)</strong>
                </div>

                <div className="legend-row">
                  <span className="legend-color unhealthy"></span>
                  <span>Unhealthy</span>
                  <strong>1 (8%)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* DEPLOYMENT TREND */}
          <div className="dashboard-card trend-card">
            <div className="card-heading">
              <h2>Deployments Trend</h2>

              <div className="chart-legend">
                <span>
                  <i className="chart-dot success"></i>
                  Success
                </span>

                <span>
                  <i className="chart-dot failed"></i>
                  Failed
                </span>

                <span>
                  <i className="chart-dot total"></i>
                  Total
                </span>
              </div>
            </div>

            <div className="chart-wrapper">
              <svg
                className="deployment-chart"
                viewBox="0 0 620 210"
                preserveAspectRatio="none"
              >
                {/* Horizontal grid */}
                <line x1="45" y1="25" x2="600" y2="25" />
                <line x1="45" y1="65" x2="600" y2="65" />
                <line x1="45" y1="105" x2="600" y2="105" />
                <line x1="45" y1="145" x2="600" y2="145" />
                <line x1="45" y1="185" x2="600" y2="185" />

                {/* Y axis */}
                <text x="15" y="29">
                  30
                </text>
                <text x="15" y="69">
                  20
                </text>
                <text x="15" y="109">
                  10
                </text>
                <text x="22" y="149">
                  5
                </text>
                <text x="22" y="189">
                  0
                </text>

                {/* Total */}
                <polyline
                  className="line-total"
                  points="
                    55,105
                    95,65
                    135,105
                    175,85
                    215,100
                    255,115
                    295,65
                    335,65
                    375,105
                    415,105
                    455,65
                    495,45
                    535,55
                    575,55
                  "
                />

                {/* Success */}
                <polyline
                  className="line-success"
                  points="
                    55,145
                    95,125
                    135,145
                    175,125
                    215,145
                    255,145
                    295,125
                    335,145
                    375,125
                    415,145
                    455,125
                    495,105
                    535,125
                    575,125
                  "
                />

                {/* Failed */}
                <polyline
                  className="line-failed"
                  points="
                    55,165
                    95,145
                    135,165
                    175,125
                    215,165
                    255,145
                    295,165
                    335,145
                    375,165
                    415,145
                    455,165
                    495,105
                    535,125
                    575,145
                  "
                />

                {/* Total points */}
                <circle cx="55" cy="105" r="3" />
                <circle cx="95" cy="65" r="3" />
                <circle cx="135" cy="105" r="3" />
                <circle cx="175" cy="85" r="3" />
                <circle cx="215" cy="100" r="3" />
                <circle cx="255" cy="115" r="3" />
                <circle cx="295" cy="65" r="3" />
                <circle cx="335" cy="65" r="3" />
                <circle cx="375" cy="105" r="3" />
                <circle cx="415" cy="105" r="3" />
                <circle cx="455" cy="65" r="3" />
                <circle cx="495" cy="45" r="3" />
                <circle cx="535" cy="55" r="3" />
                <circle cx="575" cy="55" r="3" />

                {/* X labels */}
                <text x="48" y="205">
                  7d
                </text>
                <text x="90" y="205">
                  6d
                </text>
                <text x="130" y="205">
                  5d
                </text>
                <text x="170" y="205">
                  4d
                </text>
                <text x="210" y="205">
                  3d
                </text>
                <text x="250" y="205">
                  2d
                </text>
                <text x="290" y="205">
                  1d
                </text>
              </svg>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
