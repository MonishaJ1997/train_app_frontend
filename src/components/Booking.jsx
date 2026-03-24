import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import Payment from "./Payment";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { train, classType, price } = location.state || {};

  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
  const [mobile, setMobile] = useState("");
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [totalAmount, setTotalAmount] = useState(price || 0);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (price) setTotalAmount(passengers.length * price);
  }, [passengers, price]);

  const addPassenger = () => setPassengers([...passengers, { name: "", age: "" }]);

  const removePassenger = (index) => {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated.length ? updated : [{ name: "", age: "" }]);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const validateBooking = () => {
    if (!train || !classType || !price) {
      alert("Train details missing! Please select a train.");
      return false;
    }

    if (!mobile || !/^[6-9][0-9]{9}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9.");
      return false;
    }

    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !/^[A-Za-z ]+$/.test(p.name)) {
        alert(`Passenger ${i + 1}: Name required (letters and spaces only).`);
        return false;
      }
      if (!p.age || !/^[0-9]+$/.test(p.age)) {
        alert(`Passenger ${i + 1}: Age required and must be numeric.`);
        return false;
      }
    }

    return true;
  };

  const handleBooking = () => {
   
    if (!autoUpgrade) {
    alert("Please agree to the terms & policies to proceed.");
    return;
  }
   if (!validateBooking()) return;
    const username = localStorage.getItem("username") || "guest";

    const data = {
      id: Date.now(), // unique booking id
      train_id: train.id,
      train_name: train.train_name,
      classType,
      pricePerPassenger: price,
      passengers,
      mobile,
      totalAmount,
      autoUpgrade,
      username,
    };

  const existing = JSON.parse(localStorage.getItem("bookings")) || [];
  existing.push(data);
  localStorage.setItem("bookings", JSON.stringify(existing));

  setBookingData(data);
  setShowPayment(true);
  };

  if (!train) {
    return <p className="center-msg">No train selected. Please go back and choose a train.</p>;
  }

  return (
    <div className="booking-page container">
      {/* BACK BUTTON */}
      <div className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </div>

      <h2>Booking for {train.train_name} ({classType})</h2>
      <p>From: {train.source} → To: {train.destination}</p>
      <p>Departure: {train.departure_time} | Arrival: {train.arrival_time}</p>
      <p>Price per passenger: ₹{price}</p>

      {/* PASSENGERS */}
      <div className="passenger-section">
        <h3>Passengers</h3>
        {passengers.map((p, index) => (
          <div key={index} className="passenger-card">
            <input
              type="text"
              placeholder="Name"
              value={p.name}
              onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              value={p.age}
              onChange={(e) => handlePassengerChange(index, "age", e.target.value)}
            />
            {passengers.length > 1 && (
              <button className="remove-btn" onClick={() => removePassenger(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button className="add-passenger-btn" onClick={addPassenger}>
          Add Passenger
        </button>
      </div>

      {/* CONTACT */}
      <div className="contact-section">
        <h3>Contact Information</h3>
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>

      {/* TERMS */}
      <div className="options-section">
        <label>
          <input
            type="checkbox"
            checked={autoUpgrade}
            onChange={() => setAutoUpgrade(!autoUpgrade)}
          />
          By clicking on 'Proceed to Pay', I agree to the terms & policies.
        </label>
      </div>

      {/* TOTAL */}
      <div className="total-section">
        <h3>Total Amount: ₹{totalAmount}</h3>
      </div>

      {/* BOOK BUTTON */}
      <div className="book-btn-section">
        <button className="book-btned active" onClick={handleBooking}>
          Book Now
        </button>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && bookingData && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <button className="close-btn" onClick={() => setShowPayment(false)}>
              ✖
            </button>
            <Payment bookingData={bookingData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;