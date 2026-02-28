import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Success.css";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.bookingData;

  if (!bookingData) {
    return (
      <div className="success-page">
        <h2>No Booking Found</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="tickets-card">
        <h2>🎉 Booking Confirmed</h2>

        <h3>{bookingData.train_name}</h3>
        <p>Class: {bookingData.classType}</p>

        <hr />

        <h4>Passengers:</h4>
        {bookingData.passengers.map((p, index) => (
          <div key={index} className="passenger-item">
            {p.name} (Age: {p.age})
          </div>
        ))}

        <hr />

        <p><strong>Mobile:</strong> {bookingData.mobile}</p>
        <p><strong>Email:</strong> {bookingData.email}</p>

        <h3>Total Paid: ₹{bookingData.totalAmount}</h3>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Success;