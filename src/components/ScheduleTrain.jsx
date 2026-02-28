import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ScheduleTrain.css";

const BASE_URL = "https://train-app-backend-cdpt.onrender.com";

const ScheduleTrain = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Enter train number or name");
      return;
    }

    setLoading(true);

    try {
      let res;

      // ✅ Correct logic INSIDE function
      if (/^\d+$/.test(query)) {
        res = await axios.get(
          `${BASE_URL}/api/trains/?train_number=${query}`
        );
      } else {
        res = await axios.get(
          `${BASE_URL}/api/trains/?search=${query}`
        );
      }

      if (res.data.length === 0) {
        alert("No train found");
        return;
      }

      const train = res.data[0];

      // ✅ Navigate to your Schedule page
      navigate(`/schedule/${train.id}`);

    } catch (err) {
      console.error(err);
      alert("Error fetching train");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-train-page">

      {/* HEADER */}
      <div className="schedule-hero">
        <h1>Train Schedule | Train Time Table</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter the train number or name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button onClick={handleSearch}>
            {loading ? "Checking..." : "Check Train Schedule"}
          </button>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="info-section">
        <h2>Why Book Train Tickets With Confirmtkt?</h2>

        <div className="info-grid">
          <div className="info-card">
            <h3>Get Confirmed Train Tickets</h3>
            <p>
              Increase your chances of getting confirmed tickets with smart prediction.
            </p>
          </div>

          <div className="info-card">
            <h3>UPI Enabled Secured Payment</h3>
            <p>
              Easy and secure payments with UPI and multiple payment options.
            </p>
          </div>

          <div className="info-card">
            <h3>Free Cancellation</h3>
            <p>
              Get full refund on train tickets with free cancellation feature.
            </p>
          </div>

          <div className="info-card">
            <h3>24x7 Support</h3>
            <p>
              Round-the-clock support for all booking and enquiry needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTrain;
