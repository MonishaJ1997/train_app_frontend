import React, { useState } from "react";
import "./Parcel.css";

const Parcel = () => {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);

  const handleTrack = () => {
    if (!trackingId.trim()) {
      alert("Enter Parcel / Consignment Number");
      return;
    }

    // 👉 Dummy result (you can connect backend later)
    setResult({
      id: trackingId,
      status: "In Transit",
      from: "Chennai",
      to: "Bangalore",
      expected: "2 Mar 2026",
    });
  };

  return (
    <div className="parcel-page">
      {/* HEADER */}
      <div className="parcel-header">
        <h1>📦 Parcel Services</h1>
        <p>Track and manage your railway parcels </p>
      </div>

      {/* TRACK BOX */}
      <div className="parcel-card">
        <h2>Track Your Parcel</h2>

        <div className="track-box">
          <input
            type="text"
            placeholder="Enter Parcel ID / PNR"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button onClick={handleTrack}>Track</button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="parcel-result">
            <h3>Status: {result.status}</h3>
            <p><strong>From:</strong> {result.from}</p>
            <p><strong>To:</strong> {result.to}</p>
            <p><strong>Expected Delivery:</strong> {result.expected}</p>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="parcel-info">
        <h2>Parcel Services</h2>

        <div className="info-grid">
          <div className="info-card">
            <h3>📦 Book Parcel</h3>
            <p>Send packages across cities with Indian Railways.</p>
          </div>

          <div className="info-card">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick and reliable delivery with tracking support.</p>
          </div>

          <div className="info-card">
            <h3>💰 Affordable</h3>
            <p>Cost-effective parcel services for all users.</p>
          </div>

          <div className="info-card">
            <h3>📍 Live Tracking</h3>
            <p>Track your parcel in real-time easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parcel;