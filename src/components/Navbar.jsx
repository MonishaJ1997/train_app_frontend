import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

const Navbar = () => {
  const [logo, setLogo] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Fetch site logo from backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/site-logo/`)
      .then((res) => {
        console.log("Logo API response:", res.data);
        setLogo(res.data);
      })
      .catch((err) => console.log("Logo error:", err));
  }, []);

  // Check login state on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username"); // optional
    setIsLoggedIn(!!token);
    if (storedName) setUsername(storedName);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="navbar">
        {/* LEFT SIDE */}
        <div className="nav-left">
          {logo?.logo && (
            <img
              src={
                logo.logo.startsWith("http")
                  ? logo.logo
                  : `${BASE_URL}${logo.logo}`
              }
              alt="logo"
              className="logo-img"
            />
          )}
          <h2 className="logo-text">E-Track</h2>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">
          <button 
  className="nav-btn"
  onClick={() => navigate("/")}
>
  Home
</button>
          {isLoggedIn ? (
            <>
              <button className="nav-btn username-btn">
  {username || "User"}
</button>
              <button className="nav-btn login-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="nav-btn login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* ================= RUNNING ANNOUNCEMENT LINE ================= */}
      <div className="running-line">
        <div className="running-text">
          🚆 Book Tickets Fast • 🎫 Special Offers Available •
          🔔 New Trains Added Daily • 💳 Secure Online Payment •
          🚄 Track Train Live • ⭐ Easy Cancellation
        </div>
      </div>

      {/* ================= LOGIN MODAL ================= */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          logo={logo}
          onLogin={(name) => {
            setIsLoggedIn(true);
            if (name) setUsername(name);
          }}
        />
      )}
    </>
  );
};

export default Navbar;