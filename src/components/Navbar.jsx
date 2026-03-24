import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://train-app-backend-cdpt.onrender.com";

const Navbar = () => {
  const [logo, setLogo] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  // ================= FETCH LOGO =================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/site-logo/`)
      .then((res) => setLogo(res.data))
      .catch((err) => console.log("Logo error:", err));
  }, []);

  // ================= CHECK LOGIN =================
  const checkLogin = () => {
    const token = localStorage.getItem("access");
    const storedName = localStorage.getItem("username");

    if (token && storedName) {
      setIsLoggedIn(true);
      setUsername(storedName);
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

 useEffect(() => {
  checkLogin(); // initial check

  const handleStorageChange = () => checkLogin();
  const handleUserLogin = () => checkLogin(); // listens to custom event

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("user-logged-in", handleUserLogin);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("user-logged-in", handleUserLogin);
  };
}, []);
  

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    alert("✅ Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        {/* LEFT */}
        <div className="nav-left">
          {logo?.logo && (
            <img
              src={logo.logo.startsWith("http") ? logo.logo : `${BASE_URL}${logo.logo}`}
              alt="logo"
              className="logo-img"
            />
          )}
          <h2 className="logo-text">E-Track</h2>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button className="nav-btn" onClick={() => navigate("/")}>
            Home
          </button>

          {isLoggedIn ? (
            <>
              <button className="nav-btn username-btn">
                👤 {username || "User"}
              </button>
              <button className="nav-btn login-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* RUNNING TEXT */}
      <div className="running-line">
        <div className="running-text">
          🚆 Book Tickets Fast • 🎫 Special Offers Available •
          🔔 New Trains Added Daily • 💳 Secure Online Payment •
          🚄 Track Train Live • ⭐ Easy Cancellation
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(name) => {
            localStorage.setItem("username", name);
            localStorage.setItem("access", "true"); // token placeholder
            setIsLoggedIn(true);
            setUsername(name);
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
