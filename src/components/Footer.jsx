import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-section">
          <h3>E-Track</h3>
          <p>
            Smart Railway Ticket Booking & Train Tracking System.
            Book tickets, check schedules and explore travel packages easily.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Tickets</li>
            <li>Schedule</li>
            <li>Packages</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@etrack.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} E-Track. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;