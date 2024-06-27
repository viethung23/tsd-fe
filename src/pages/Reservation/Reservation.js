import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import "../Reservation/Reservation.css";
import Header from "../Header/Header";
import { useAuth } from "../../context/AuthContext";
import LocationComponent from "../LocationComponent/LocationComponent";

export default function Reservation() {


  return (
    <div>
      <Header title="Đơn cần xe" />
      <LocationComponent />
      
      <Footer />
    </div>
  );
}
