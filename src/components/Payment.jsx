import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import jwt_decode from "jwt-decode";
import "./Payment.css";

const BASE_URL = "https://train-app-backend-cdpt.onrender.com";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("IN");

  useEffect(() => {
    if (!bookingData) return;

    setAmount(bookingData.totalAmount);

    axios.post(`${BASE_URL}/api/create-payment/`, {
      totalAmount: Number(bookingData.totalAmount),
      bookingData,
    })
    .then(res => setClientSecret(res.data.clientSecret))
    .catch(err => {
      console.error(err);
      alert("Error creating payment. Check backend.");
    });
  }, [bookingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!fullName || !/^[A-Za-z\s]+$/.test(fullName)) {
      alert("Full name can only contain letters and spaces");
      return;
    }

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: fullName, address: { country } },
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment Successful 🎉");

      // ✅ Save booking ONCE after payment
      const token = localStorage.getItem("token");
      let username = "guest";
      if (token) {
        try { username = jwt_decode(token).username; } 
        catch(err){ console.log("Invalid token", err); }
      }

      const existing = JSON.parse(localStorage.getItem("bookings")) || [];
      existing.push({ ...bookingData, username });
      localStorage.setItem("bookings", JSON.stringify(existing));

      navigate("/success", { state: { bookingData } });
    }

    setLoading(false);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Payment Details</h2>
        <form onSubmit={handleSubmit} className="payment-form">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[A-Za-z\s]*$/.test(val)) setFullName(val);
            }}
            required
          />

          <label>Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="IN">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>

          <label>Card Information</label>
          <div className="card-element-wrapper">
            <CardElement className="card-element" />
          </div>

          <button type="submit" disabled={!stripe || loading}>
            {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
          </button>
        </form>

        <p className="secure-info">🔒 Secure Payment | Stripe Protected</p>
      </div>
    </div>
  );
};

const Payment = ({ bookingData }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm bookingData={bookingData} />
  </Elements>
);

export default Payment;
