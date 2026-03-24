import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://127.0.0.1:8000";

const Home = () => {
  const navigate = useNavigate();

  // 🔹 States
  const [banner, setBanner] = useState(null);
  const [banners, setBanners] = useState([]);
  const [packages, setPackages] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [quota, setQuota] = useState("GENERAL");
  const [travelClass, setTravelClass] = useState("All Classes");
  const [passengers, setPassengers] = useState("1 Passenger");

  // 🔹 STATIC STATIONS (can replace with API later)
  const stations = [
    "Chennai",
    "Coimbatore",
    "Bangalore",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Madurai",
    "Trichy",
    "Salem",
    "Kanyakumari",
    "Nagercoil",
    "Tiruvandrum",
    "Rameswaram",
    "Guruvayur",
  ];

  // 🔹 Fetch data
  useEffect(() => {
    axios.get(`${BASE_URL}/api/train-banner/`)
      .then((res) => {
        if (res.data.length > 0) setBanner(res.data[0]);
      })
      .catch((err) => console.log(err));

    axios.get(`${BASE_URL}/api/banners/`)
      .then((res) => setBanners(res.data))
      .catch((err) => console.log(err));

    axios.get(`${BASE_URL}/api/packages/`)
      .then((res) => setPackages(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔹 Autocomplete handlers
  const handleFromChange = (value) => {
    setFrom(value);

    if (value.length > 0) {
      const filtered = stations.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFromSuggestions(filtered);
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToChange = (value) => {
    setTo(value);

    if (value.length > 0) {
      const filtered = stations.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setToSuggestions(filtered);
    } else {
      setToSuggestions([]);
    }
  };

  // 🔍 Search handler
  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      alert("Please enter From and To locations");
      return;
    }

    navigate(
      `/train-details?from=${from}&to=${to}&quota=${quota}&class=${travelClass}&passengers=${passengers}`
    );
  };

  return (
    <div className="home-container">

      {/* ================= HERO ================= */}
      <div
        className="hero-section"
        style={{
          backgroundImage: banner?.image
            ? `url(${banner.image})`
            : "none",
        }}
      >
        <div className="hero-overlay">
          <div className="booking-card">
            <h2>BOOK TICKET</h2>

            {/* FROM */}
            <div className="input-box">
              <input
                type="text"
                placeholder="From"
                value={from}
                onChange={(e) => handleFromChange(e.target.value)}
              />

              {fromSuggestions.length > 0 && (
                <ul className="suggestions">
                  {fromSuggestions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setFrom(item);
                        setFromSuggestions([]);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* TO */}
            <div className="input-box">
              <input
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => handleToChange(e.target.value)}
              />

              {toSuggestions.length > 0 && (
                <ul className="suggestions">
                  {toSuggestions.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setTo(item);
                        setToSuggestions([]);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* QUOTA */}
            <select value={quota} onChange={(e) => setQuota(e.target.value)}>
              <option>GENERAL</option>
              <option>TATKAL</option>
              <option>LADIES</option>
            </select>

            {/* CLASS + PASSENGERS */}
            <div className="row">
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
              >
                <option>All Classes</option>
                <option>Sleeper</option>
                <option>AC</option>
              </select>

              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              >
                <option>1 Passenger</option>
                <option>2 Passengers</option>
                <option>3 Passengers</option>
              </select>
            </div>

            <button className="book-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ================= SERVICES ================= */}
       <div className="services-container">
        

        <div
          className="services-item"
          onClick={() => navigate("/tickets")}
        >
          <i className="fas fa-ticket-alt"></i>
          <p>Tickets</p>
        </div>

        <div
          className="services-item"
          onClick={() => navigate("/schedule")}
        >
          <i className="fas fa-calendar-alt"></i>
          <p>Schedule</p>
        </div>

        <div className="services-item"
         onClick={() => navigate("/parcel")}>
          <i className="fas fa-box"></i>
          <p>Parcels</p>
        </div>

        <div className="services-item"
         onClick={() => navigate("/station")}>
          <i className="fas fa-subway"></i>
          <p>Stations</p>
        </div>
{/*
        <div className="services-item">
          <i className="fas fa-bell"></i>
          <p>Notifications</p>
        </div>*/}
      </div>

      

      {/* ================= BANNERS ================= */}
      <div className="banner-container">
        {banners.length > 0 ? (
          banners.map((item) => (
            <img
              key={item.id}
              src={item.image}
              alt="banner"
              className="banner-image"
            />
          ))
        ) : (
          <p>No banners available</p>
        )}
      </div>

      {/* ================= PACKAGES ================= */}
      <div className="package-container">
        {packages.map((item) => (
          <div className="package-card" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="package-content">
              <h2>{item.title}</h2>
              <p>{item.short_description}</p>

              <button
                onClick={() =>
                  navigate("/holiday", { state: { packageData: item } })
                }
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;