import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Station.css";

const BASE_URL = "http://127.0.0.1:8000";

const Station = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async (query = "") => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/stations/?search=${query}`
      );
      setStations(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchStations(value);
  };

  return (
    <div className="station-container">

      {/* LEFT */}
      <div className="station-left">
        <h2>Stations</h2>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
        />

        <div className="station-list">
          {stations.map((s) => (
            <div
              key={s.id}
              className={`station-item ${
                selected?.id === s.id ? "active" : ""
              }`}
              onClick={() => setSelected(s)}
            >
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      {selected && (
        <div className="station-right">
          <img
  src={
    selected.image
      ? selected.image.startsWith("http")
        ? selected.image
        : `${BASE_URL}${selected.image}`
      : "https://via.placeholder.com/600x300"
  }
  alt={selected.name}
/>

          <div className="station-details">
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>

            <p><strong>Code:</strong> {selected.code}</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <p><strong>Hours:</strong> {selected.hours}</p>

            {selected.phone && (
              <p><strong>Phone:</strong> {selected.phone}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Station;