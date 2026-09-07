import React from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="navbar">
      {/* Left section */}
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>

        <div className="navbar-logo">
          <div className="logo-icon">◇</div>
          <span>DevPlatform</span>
        </div>
      </div>

      {/* Search */}
      <div className="navbar-search">
        <Search size={17} />
        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      {/* Right section */}
      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">
          <div className="profile-avatar">
            S
          </div>

          <span className="profile-name">
            Shray Rathore
          </span>

          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;