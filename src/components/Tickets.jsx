import React, { useEffect, useState } from "react";
import "./Ticket.css";
import jwt_decode from "jwt-decode"; // ONLY this line // for ESM style // ✅ Vite fix

const BASE_URL = "http://127.0.0.1:8000";

const Tickets = ({ logo }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    let currentUser = null;
    if (token) {
      try {
        const decoded = jwt_decode(token); // ✅ Notice .default
        currentUser = decoded.username; // make sure your token has username
      } catch (err) {
        console.log("Invalid token", err);
      }
    }

    const stored = JSON.parse(localStorage.getItem("bookings")) || [];

    const userTickets = stored.filter((t) => t.username === currentUser);

    setTickets(userTickets);
  }, []);

  if (tickets.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "200px" }}>
        You have no booked tickets yet.
      </p>
    );
  }

  return (
    <div className="tickets-page">
      {tickets.map((t, index) => (
        <div className="ticket-card" key={index}>
          <div className="ticket-left">
            <div className="ticket-top">
              <div className="train-img">
                <img
                  src={
                    logo?.logo
                      ? logo.logo.startsWith("http")
                        ? logo.logo
                        : `${BASE_URL}${logo.logo}`
                      : `${BASE_URL}/media/logo/logo_train_mTv0tut.png`
                  }
                  alt="Logo"
                  className="logo-img"
                />
              </div>
              <div>
                <div className="ticket-title">TRAIN TICKET</div>
                <p>
                  <strong>Name:</strong> {t.passengers?.[0]?.name || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="ticket-info">
              <p><strong>Train:</strong> {t.train_name || "Unknown"}</p>
              <p><strong>Seat:</strong> {t.seat || "B6"}</p>
              <p><strong>Class:</strong> {t.classType || "General"}</p>
              <p><strong>Mobile:</strong> {t.mobile || "N/A"}</p>
            </div>

            <div className="ticket-bottom">
              <p>
                <strong>Route:</strong> {t.source || "Unknown"} → {t.destination || "Unknown"}
              </p>
            </div>
          </div>

          <div className="ticket-right">
            <div className="ticket-number">
              TICKET NUMBER <strong>{Math.floor(Math.random() * 1000000)}</strong>
            </div>
            <div className="price">
              <span>PRICE</span>
              <h2>₹{t.totalAmount || 0}</h2>
            </div>
            <div className="barcode"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tickets;