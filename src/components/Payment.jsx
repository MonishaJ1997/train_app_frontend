import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Payment.css";
const BASE_URL = "http://127.0.0.1:8000";
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

// ✅ Checkout Form
const CheckoutForm = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
 // ✅ NOT "India"
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("IN");

  useEffect(() => {
    if (!bookingData) return;

    setAmount(bookingData.totalAmount);

    axios
      .post(`${BASE_URL}/api/create-payment/`, {
        totalAmount: Number(bookingData.totalAmount),
        bookingData,
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error(err);
        alert("Error creating payment. Check backend.");
      });
  }, [bookingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!fullName) {
      alert("Please enter your full name");
      return;
    }

    if (!clientSecret) {
      alert("Payment not initialized properly");
      return;
    }

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: fullName,
          address: {
            country: country,
          },
        },
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      alert("Payment Successful 🎉");


      const token = localStorage.getItem("token");
    let username = "guest";
    if (token) {
      try {
        username = jwt_decode(token).username;
      } catch (err) {
        console.log("Invalid token", err);
      }
    }

 const existing = JSON.parse(localStorage.getItem("bookings")) || [];
  existing.push(bookingData);
  localStorage.setItem("bookings", JSON.stringify(existing));
      // 👉 You can also close modal instead of navigating
      navigate("/success", { state: { bookingData } });
    }

    setLoading(false);
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2>Payment Details</h2>

        <form onSubmit={handleSubmit} className="payment-form">
          {/* Name */}
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          {/* Country */}
          <label>Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option>India</option>
            <option>USA</option>
            <option>UK</option>
            <option>Canada</option>
            <option>Australia</option>
          </select>

          {/* Card */}
          <label>Card Information</label>
          <div className="card-element-wrapper">
            <CardElement className="card-element" />
          </div>

          {/* Button */}
          <button type="submit" disabled={!stripe || loading}>
            {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
          </button>
        </form>

        <p className="secure-info">
          🔒 Secure Payment | Stripe Protected
        </p>
      </div>
    </div>
  );
};

// ✅ Wrapper Component (IMPORTANT)
const Payment = ({ bookingData }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm bookingData={bookingData} />
    </Elements>
  );
};

export default Payment;