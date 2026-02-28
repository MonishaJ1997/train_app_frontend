import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Schedule.css";

const BASE_URL = "http://127.0.0.1:8000";

const Schedule = () => {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/trains/${id}/`)
      .then((res) => setTrain(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">Loading Schedule...</p>;

  if (!train) return <p>No Schedule Found</p>;

  return (
    <div className="schedule-page">
      {/* HEADER */}
      <div className="schedule-header">
        <h2>
          {train.train_number} - {train.train_name}
        </h2>
        <p>
          {train.source} ➝ {train.destination}
        </p>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Code</th>
              <th>Station</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Halt</th>
              <th>Distance</th>
              <th>Day</th>
            </tr>
          </thead>

          <tbody>
            {train.schedules && train.schedules.length > 0 ? (
              train.schedules.map((station, index) => (
                <tr key={station.id}>
                  <td>{index + 1}</td>
                  <td>{station.station_code}</td>
                  <td>{station.station_name}</td>
                  <td>{station.arrival_time || "--"}</td>
                  <td>{station.departure_time || "--"}</td>
                  <td>
                    {station.halt_minutes
                      ? `${station.halt_minutes} min`
                      : "--"}
                  </td>
                  <td>{station.distance} km</td>
                  <td>{station.day_number}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Schedule Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;