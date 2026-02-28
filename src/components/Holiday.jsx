import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Holiday.css";
import BannerSlider from "./BannerSlider";
const BASE_URL = "https://train-app-backend-cdpt.onrender.com";
const Holiday = () => {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  // ------------------ FAQ DATA ------------------
  const faqData = [
    {
      question: "How can I book an IRCTC tour package?",
      answer:
        "Book the best tour packages easily on IRCTC’s official website. Click on ‘Holidays’ on the homepage and select ‘Packages’. Then choose from land, air, and rail tour packages."
    },
    {
      question: "What does a tour package include?",
      answer:
        "Tour packages typically include travel, accommodation, sightseeing, meals, and transfers depending on the selected plan."
    },
    {
      question: "How can I book a hotel through IRCTC?",
      answer:
        "Visit the hotel booking section on the IRCTC website and choose your preferred destination and dates."
    },
    {
      question: "How can I book my retiring room in IRCTC?",
      answer:
        "Retiring rooms can be booked online through the IRCTC website under the accommodation section."
    },
    {
      question: "Some famous religious IRCTC tour packages?",
      answer:
        "Char Dham Yatra, Vaishno Devi Tour, Shirdi Tour, and Tirupati Balaji Darshan are popular religious packages."
    },
    {
      question: "How do I book domestic and international packages?",
      answer:
        "Visit the IRCTC Holidays section and choose domestic or international packages as per your preference."
    }
  ];

  // ------------------ FETCH BANNERS ------------------
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/tour-banner/`)
      .then((res) => setBanners(res.data))
      .catch((err) => console.error("Failed to fetch banners:", err));
  }, []);

  // ------------------ FORM HANDLING ------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter valid email";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone";
    }

    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.message.trim())
      newErrors.message = "Query message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });
      setErrors({});
    }
  };

  // ------------------ FAQ TOGGLE ------------------
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="holiday-page">
      {/* Banner Section */}
      <div className="bannersed-section">
        {banners.length === 0 ? (
          <p>No banners available</p>
        ) : (
          banners.map((banner) => (
            <img
              key={banner.id}
              src={banner.image}
              alt={banner.title}
              className="bannersed-image"
            />
          ))
        )}
      </div>

      {/* Slider */}
      <div className="slider-section">
        <BannerSlider />
      </div>

      {/* Query Form */}
      <div className="query-container">
        <h1 className="title">YOUR QUERY</h1>
        <p className="subtitle">
          Just pack and go! Leave your travel plan to experts!
        </p>

        <form className="query-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>

          <div className="row">
            <div className="form-group">
              <input
                type="text"
                name="phone"
                placeholder="Your Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Domestic Tour">Domestic Tour</option>
                <option value="International Tour">International Tour</option>
                <option value="Honeymoon Package">Honeymoon Package</option>
              </select>
              {errors.service && <span className="error">{errors.service}</span>}
            </div>
          </div>

          <div className="form-group full">
            <textarea
              name="message"
              placeholder="Type Your Query"
              rows="4"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && <span className="error">{errors.message}</span>}
          </div>

          <div className="button-container">
            <button type="submit" className="submit-btn">
              Send Now ✈
            </button>
          </div>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="faq-container">
        <h1 className="faq-title">FAQ</h1>

        <div className="faq-grid">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
                <span
                  className={`arrow ${
                    activeIndex === index ? "rotate" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {activeIndex === index && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Holiday;
