import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BannerSlider.css";

const BannerSlider = () => {
  const [sliders, setSliders] = useState([]);
  const [startIndex, setStartIndex] = useState(0); // first visible image
  const visibleCount = 5; // number of images visible at a time
const BASE_URL = "http://127.0.0.1:8000";
  // Fetch slider images from backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/slider/`)
      .then((res) => setSliders(res.data))
      .catch((err) => console.error("Failed to fetch sliders:", err));
  }, []);

  if (!sliders || sliders.length === 0) return <p>Loading sliders...</p>;

  // handle click on images
  const handleClick = (index) => {
    // click last visible image → move right
    if (index === startIndex + visibleCount - 1) {
      if (startIndex + visibleCount < sliders.length) {
        setStartIndex(startIndex + 1);
      } else {
        // wrap around to start
        setStartIndex(0);
      }
    }

    // click first visible image → move left
    if (index === startIndex) {
      if (startIndex > 0) {
        setStartIndex(startIndex - 1);
      } else {
        // wrap around to end
        setStartIndex(sliders.length - visibleCount);
      }
    }
  };

  // get only visible images
  const visibleSliders = sliders.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="banners-slider-container">
      {visibleSliders.map((slider, idx) => (
        <img
          key={slider.id}
          src={slider.image} // full URL from API
          alt={slider.title || "Slider Image"}
          className="banners-slider-image"
          onClick={() => handleClick(startIndex + idx)}
        />
      ))}
    </div>
  );
};

export default BannerSlider;