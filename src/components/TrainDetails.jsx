import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./TrainDetails.css";

const BASE_URL = "https://train-app-backend-cdpt.onrender.com";

const TrainDetails = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeDate, setActiveDate] = useState(0);
  const [loginWarnings, setLoginWarnings] = useState({}); // per train

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const from = query.get("from");
  const to = query.get("to");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/trains/?source=${from}&destination=${to}`)
      .then((res) => setTrains(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [from, to]);

  const handleBookNow = (train) => {
    const token = localStorage.getItem("token");
    if (token) {
      // logged in → navigate
      navigate("/booking", {
        state: {
          train,
          classType: selectedOption.classType,
          price: selectedOption.price,
        },
      });
    } else {
      // not logged in → show warning for this train
      setLoginWarnings((prev) => ({ ...prev, [train.id]: true }));
      // auto-hide warning after 3s
      setTimeout(() => {
        setLoginWarnings((prev) => ({ ...prev, [train.id]: false }));
      }, 3000);
    }
  };

  return (
    <div className="train-page">
      {/* HEADER */}
      <div className="train-header-top">
        <h2>{from} to {to} Trains</h2>
        <p>{trains.length} Trains found</p>
      </div>

      {/* DATE STRIP */}
      <div className="date-strip">
        {["Fri 27", "Sat 28", "Sun 01", "Mon 02", "Tue 03"].map((d, i) => (
          <div
            key={i}
            className={`date-box ${activeDate === i ? "active" : ""}`}
            onClick={() => setActiveDate(i)}
          >
            <span>{d}</span>
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
      {loading && <p>Loading trains...</p>}
      {!loading && trains.length === 0 && <p>No trains found</p>}

      {/* TRAIN LIST */}
      {trains.map((train) => {
        const isSelected = selectedOption?.train.id === train.id;
        return (
          <div className="train-card" key={train.id}>
            {/* TOP ROW */}
            <div className="train-row-top">
              <div>
                <h4 className="bold">{train.train_number} {train.train_name}</h4>
                <div className="train-time">
                  <span className="time">{train.departure_time} {train.source}</span>
                  <span className="duration">• 19h 55m •</span>
                  <span className="time">{train.arrival_time} {train.destination}</span>
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
                onClick={() => setSelectedOption({ train, classType: "SL", price: 655 })}
              >
                <p className="class">SL</p>
                <p className="price">₹655</p>
                <p className="status">Available</p>
              </div>
              <div
                className="av-card red"
                onClick={() => setSelectedOption({ train, classType: "3A", price: 1670 })}
              >
                <p className="class">3A</p>
                <p className="price">₹1670</p>
                <p className="status red-text">WL 20</p>
              </div>
              <div
                className="av-card green"
                onClick={() => setSelectedOption({ train, classType: "2A", price: 2200 })}
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

                {/* LOGIN WARNING */}
                {loginWarnings[train.id] && (
                  <p className="login-warning" style={{ color: "red", marginTop: "10px" }}>
                    Please login first to book tickets
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TrainDetails;
