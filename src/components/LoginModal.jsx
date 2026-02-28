import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

const BASE_URL = "http://127.0.0.1:8000";

const LoginModal = ({ onClose, logo, onLogin }) => {
  const [view, setView] = useState("login"); // "login" | "register" | "reset"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // convert backend-relative logo path to full URL
  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------ REGISTER ------------------
  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        username: formData.name,  // backend expects username
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      const res = await axios.post(`${BASE_URL}/api/register/`, payload);
      alert(res.data.message || "Registration successful!");
      setView("login"); // switch to login
      setFormData({ name: "", phone: "", email: "", password: "" });
    } catch (error) {
      console.log(error.response?.data); // debug backend message
      alert(
        error.response?.data?.message || "Registration failed or user exists"
      );
    }
  };

  // ------------------ LOGIN ------------------
  const handleLogin = async () => {
    if (!formData.name || !formData.password) {
      alert("Please enter username and password");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/login/`, {
        username: formData.name,
        password: formData.password,
      });

      // store token and username
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", formData.name);

      alert("Login successful");

      if (onLogin) onLogin(formData.name); // notify navbar
      onClose(); // close modal
      setFormData({ name: "", phone: "", email: "", password: "" });
    } catch (error) {
      console.log(error.response?.data);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div className="login-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Image */}
        <div className="top-image">
          {logo && <img src={getImageUrl(logo.logo)} alt="logo" />}
        </div>

        {/* LOGIN VIEW */}
        {view === "login" && (
          <>
            <input
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <p className="forgot" onClick={() => setView("reset")}>
              Forgot password?
            </p>

            <button onClick={handleLogin} className="login-btn-main">
              Login
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <span className="link-text" onClick={() => setView("register")}>
                Sign Up
              </span>
            </p>
          </>
        )}

        {/* REGISTER VIEW */}
        {view === "register" && (
          <>
            <h3 className="form-title">Create Account</h3>

            <input
              name="name"
              placeholder="Username"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button onClick={handleRegister} className="login-btn-main">
              Create Account
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <span className="link-text" onClick={() => setView("login")}>
                Login
              </span>
            </p>
          </>
        )}

        {/* RESET PASSWORD VIEW */}
        {view === "reset" && (
          <>
            <h3 className="form-title">Reset Password</h3>
            <p className="reset-text">Enter your email to reset password</p>

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <button className="login-btn-main">Send</button>

            <p className="switch-text">
              Back to{" "}
              <span className="link-text" onClick={() => setView("login")}>
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;