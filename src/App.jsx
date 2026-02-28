// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

import Tickets from "./components/Tickets"; 
import Schedule from "./components/Schedule";
import '@fortawesome/fontawesome-free/css/all.min.css';
import TrainDetails from "./components/TrainDetails";
import Booking from "./components/Booking";
import Footer from "./components/Footer";
import Payment from "./components/Payment";
import Success from "./components/Success";
import ScheduleTrain from "./components/ScheduleTrain";
import Parcel from "./components/Parcel";
import Station from "./components/Station"
import Holiday from "./components/Holiday"




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
         <Route path="/tickets" element={<Tickets />} />
         <Route path="/schedule" element={<ScheduleTrain />} />
         <Route path="/schedule/:id" element={<Schedule />} />
         <Route path="/train-details" element={<TrainDetails />} />
         <Route path="/booking" element={<Booking />} />
         <Route path="/payment" element={<Payment />} />
         <Route path="/success" element={<Success />} />
         <Route path="/parcel" element={<Parcel />} />
         <Route path="/station" element={<Station/>} />
          <Route path="/holiday" element={<Holiday/>} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;