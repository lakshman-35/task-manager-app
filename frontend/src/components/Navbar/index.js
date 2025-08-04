import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import "./index.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("/api/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const getUserInfo = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const user = getUserInfo();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            TaskManager
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/tasks" className="nav-link">Tasks</Link>
          {user && (
            <div className="user-profile">
              <FaUser className="profile-icon" />
              <span className="user-name">{user.fullName}</span>
            </div>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
