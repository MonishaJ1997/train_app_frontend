import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./TrainDetails.css";

const BASE_URL = "http://127.0.0.1:8000";

const TrainDetails = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeDate, setActiveDate] = useState(0);
  const [loginModal, setLoginModal] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("username") || null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const from = query.get("from");
  const to = query.get("to");

  // ================= DYNAMIC DATE STRIP =================
  const getNextDays = (numDays = 5) => {
    const days = [];
    const options = { weekday: "short", day: "2-digit" };
    for (let i = 0; i <= numDays; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const formatted = d.toLocaleDateString("en-US", options).replace(",", "");
      days.push(formatted);
    }
    return days;
  };
  const dateList = getNextDays(5);

  // ================= FETCH TRAINS =================
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/trains/?source=${from}&destination=${to}`)
      .then((res) => setTrains(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [from, to]);

  // ================= HANDLE BOOK =================
  const handleBookNow = (train) => {
    if (user) {
      if (!selectedOption) {
        alert("Please select a class first");
        return;
      }
      navigate("/booking", {
        state: {
          train,
          classType: selectedOption.classType,
          price: selectedOption.price,
        },
      });
    } else {
      setLoginModal(true);
    }
  };

  const handleLoginSuccess = (username) => {
    localStorage.setItem("username", username);
    localStorage.setItem("access", "true"); // optional token
    setUser(username);
    setLoginModal(false);
    window.dispatchEvent(new Event("user-logged-in"));
  };

  return (
    <div className="train-page">
      {/* HEADER */}
      <div className="train-header-top">
        <h2>
          {from} → {to} Trains
        </h2>
        {!loading && trains.length > 0 && <p>{trains.length} Trains found</p>}
      </div>

      {/* DATE STRIP */}
      <div className="date-strip">
        {dateList.map((d, i) => (
          <div
            key={i}
            className={`date-box ${activeDate === i ? "active" : ""}`}
            onClick={() => setActiveDate(i)}
          >
            <span>{i === 0 ? "Today" : d}</span>
            <small className="date-status">Filling Fast</small>
          </div>
        ))}
      </div>

      {/* GREEN BANNER */}
      <div className="free-cancel">
        <div>
          <h3>Free Cancellation</h3>
          <p>Get full refund on cancellation *</p>
        </div>
        <div>FCF</div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loading-message">
          <p>Loading trains...</p>
        </div>
      )}

      {/* NO TRAINS AVAILABLE */}
      {!loading && trains.length === 0 && (
        <div className="no-trains">
          <h3>No Trains Available</h3>
          <p>
            Sorry, we couldn't find any trains for your selected route and date.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No trains"
          />
        </div>
      )}

      {/* TRAIN LIST */}
      {trains.map((train) => {
        const isSelected = selectedOption?.train?.id === train.id;
        return (
          <div className="train-card" key={train.id}>
            {/* TOP ROW */}
            <div className="train-row-top">
              <div>
                <h4 className="bold">
                  {train.train_number} {train.train_name}
                </h4>
                <div className="train-time">
                  <span className="time">
                    {train.departure_time} {train.source}
                  </span>
                  <span className="duration">• 19h 55m •</span>
                  <span className="time">
                    {train.arrival_time} {train.destination}
                  </span>
                </div>
              </div>
              <div
                className="schedule"
                onClick={() => navigate(`/schedule/${train.id}`)}
              >
                Schedule
              </div>
            </div>

            {/* AVAILABILITY ROW */}
            <div className="availability-row">
              <div
                className="av-card green"
                onClick={() =>
                  setSelectedOption({ train, classType: "SL", price: 655 })
                }
              >
                <p className="class">SL</p>
                <p className="price">₹655</p>
                <p className="status">Available</p>
              </div>
              <div
                className="av-card red"
                onClick={() =>
                  setSelectedOption({ train, classType: "3A", price: 1670 })
                }
              >
                <p className="class">3A</p>
                <p className="price">₹1670</p>
                <p className="status red-text">WL 20</p>
              </div>
              <div
                className="av-card green"
                onClick={() =>
                  setSelectedOption({ train, classType: "2A", price: 2200 })
                }
              >
                <p className="class">2A</p>
                <p className="price">₹2200</p>
                <p className="status">WL 9</p>
              </div>
            </div>

            {/* BOOK NOW */}
            {isSelected && (
              <div className="global-book-section">
                <button
                  className="book-btned active"
                  onClick={() => handleBookNow(train)}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* LOGIN MODAL */}
      {loginModal && (
        <LoginModal
          onClose={() => setLoginModal(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default TrainDetails;