import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

const BASE_URL = "http://127.0.0.1:8000";

const LoginModal = ({ onClose, onLogin }) => {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 👉 Username only letters
    if (name === "username") {
      if (!/^[A-Za-z]*$/.test(value)) return;
    }

    // 👉 Phone only numbers
    if (name === "phone") {
      if (!/^[0-9]*$/.test(value)) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= VALIDATION =================
  const validate = () => {
    let newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username required";
    } else if (!/^[A-Za-z]+$/.test(formData.username)) {
      newErrors.username = "Only letters allowed";
    }

    if (view === "register") {
      if (!formData.email) {
        newErrors.email = "Email required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Invalid email";
      }

      if (!formData.phone) {
  newErrors.phone = "Phone required";
} else if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
  newErrors.phone = "Must start with 6-9 and be 10 digits";
}
    }

    if (!formData.password) {
      newErrors.password = "Password required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Min 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post(`${BASE_URL}/api/login/`, {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", formData.username);

      alert("✅ Login successful");
      onLogin(formData.username);

    } catch (err) {
      alert(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "❌ Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/register/`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
      });

      alert("✅ Registration successful");

      // auto login
      await handleLogin(e);

    } catch (err) {
      alert(err.response?.data?.message || "❌ Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">

        <span className="close-btn" onClick={onClose}>✖</span>

        <h2>{view === "login" ? "Login" : "Register"}</h2>

        <form onSubmit={view === "login" ? handleLogin : handleRegister}>
          
          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Username (letters only)"
            value={formData.username}
            onChange={handleChange}
          />
          <small className="error">{errors.username}</small>

          {/* REGISTER FIELDS */}
          {view === "register" && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <small className="error">{errors.email}</small>

              <input
                type="text"
                name="phone"
                placeholder="Phone (10 digits)"
                value={formData.phone}
                onChange={handleChange}
              />
              <small className="error">{errors.phone}</small>
            </>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password (min 4 chars)"
            value={formData.password}
            onChange={handleChange}
          />
          <small className="error">{errors.password}</small>

          <button type="submit">
            {loading
              ? "Please wait..."
              : view === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p>
          {view === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            className="link-text"
            onClick={() =>
              setView(view === "login" ? "register" : "login")
            }
          >
            {view === "login" ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;