import React, { useState, useEffect } from "react";
import "../Reservation/Reservation.css";
import HistoryIcon from "@mui/icons-material/History";
import History from "./UserHistory";
import UserHeader from "../UserPage/UserHeader";
import UserFooter from "../UserPage/UserFooter";

export default function PageUserHistory() {
  return (
    <div>
      <UserHeader
        title={
          <>
            <HistoryIcon /> Lịch sử
          </>
        }
      />
      <History />
      <UserFooter />
    </div>
  );
}
