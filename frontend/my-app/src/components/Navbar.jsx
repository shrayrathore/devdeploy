import React, { useEffect, useState } from "react";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import "./Navbar.css";
import api from "../services/api";

const Navbar = ({ onMenuClick }) => {
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

  // Get first letter of user's name
  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name.trim().charAt(0).toUpperCase();
  };

  return (
    <header className="navbar">

      {/* Left section */}
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
        >
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

          {/* User initial */}
          <div className="profile-avatar">
            {getInitial()}
          </div>

          {/* User name from MongoDB */}
          <span className="profile-name">
            {user?.name || "Loading..."}
          </span>

          <ChevronDown size={15} />

        </div>

      </div>
    </header>
  );
};

export default Navbar;