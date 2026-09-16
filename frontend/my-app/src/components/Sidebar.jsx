import React from "react";
import {
  Home,
  FolderKanban,
  Layers,
  Rocket,
  FileText,
  Settings,
  BookOpen,
  LogOut,
  X
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
      path: "/dashboard"
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects"
    },
    {
      name: "Environments",
      icon: Layers,
      path: "/environments"
    },
    {
      name: "Deployments",
      icon: Rocket,
      path: "/deployments"
    },
    {
      name: "Logs",
      icon: FileText,
      path: "/logs"
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose} 
        /> 
      )}
      {/*onClose -> setSidebarOpen(false)*/}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>  
        {/* Mobile close button */}
        <button
          className="sidebar-close"
          onClick={onClose}
        >
          <X size={21} />
        </button>

        {/* Main navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                href={item.path}
                className={`sidebar-item ${
                  item.name === "Dashboard"
                    ? "active"
                    : ""
                }`}
                key={item.name}
              >
                <Icon size={17} strokeWidth={1.8} />

                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="sidebar-bottom">
          <a href="/docs" className="sidebar-item">
            <BookOpen size={17} strokeWidth={1.8} />
            <span>Docs</span>
          </a>

          <button className="sidebar-item logout">
            <LogOut size={17} strokeWidth={1.8} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;