import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Booking.css";
import Payment from "./Payment"; // 👈 import payment

const Booking = () => {
  const location = useLocation();

  // Get data from TrainDetails
  const { train, classType, price } = location.state || {};

  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [totalAmount, setTotalAmount] = useState(price || 0);

  // 👇 NEW STATES FOR MODAL
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Update total when passengers change
  useEffect(() => {
    if (price) {
      setTotalAmount(passengers.length * price);
    }
  }, [passengers, price]);

  // Add passenger
  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: "" }]);
  };

  // Remove passenger
  const removePassenger = (index) => {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated.length ? updated : [{ name: "", age: "" }]);
  };

  // Handle passenger input
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // 👇 UPDATED BOOK FUNCTION (NO NAVIGATION)
  const handleBooking = () => {
    if (!train || !classType || !price) {
      alert("Train details missing! Please select a train.");
      return;
    }

    if (!mobile || !email) {
      alert("Please enter contact details (mobile & email).");
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name || !passengers[i].age) {
        alert(`Please enter name & age for passenger ${i + 1}`);
        return;
      }
    }

    const data = {
      train_id: train.id,
      train_name: train.train_name,
      classType,
      pricePerPassenger: price,
      passengers,
      mobile,
      email,
      totalAmount,
      autoUpgrade,
    };

    setBookingData(data);
    setShowPayment(true); // 👈 OPEN PAYMENT MODAL
  };

  if (!train) {
    return <p>No train selected. Please go back and choose a train.</p>;
  }

  return (
    <div className="booking-page container">
      <h2>
        Booking for {train.train_name} ({classType})
      </h2>

      <p>
        From: {train.source} → To: {train.destination}
      </p>
      <p>
        Departure: {train.departure_time} | Arrival: {train.arrival_time}
      </p>
      <p>Price per passenger: ₹{price}</p>

      {/* Passengers */}
      <div className="passenger-section">
        <h3>Passengers</h3>

        {passengers.map((p, index) => (
          <div key={index} className="passenger-card">
            <input
              type="text"
              placeholder="Name"
              value={p.name}
              onChange={(e) =>
                handlePassengerChange(index, "name", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Age"
              value={p.age}
              onChange={(e) =>
                handlePassengerChange(index, "age", e.target.value)
              }
            />

            {passengers.length > 1 && (
              <button
                className="remove-btn"
                onClick={() => removePassenger(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button className="add-passenger-btn" onClick={addPassenger}>
          Add Passenger
        </button>
      </div>

      {/* Contact */}
      <div className="contact-section">
        <h3>Contact Information</h3>

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Terms */}
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

      {/* Total */}
      <div className="total-section">
        <h3>Total Amount: ₹{totalAmount}</h3>
      </div>

      {/* Button */}
      <div className="book-btn-section">
        <button className="book-btned active" onClick={handleBooking}>
          Book Now
        </button>
      </div>

      {/* 👇 PAYMENT MODAL */}
      {showPayment && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <button
              className="close-btn"
              onClick={() => setShowPayment(false)}
            >
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