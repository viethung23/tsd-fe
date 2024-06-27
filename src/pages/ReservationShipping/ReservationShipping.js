import React, { useState, useEffect } from "react";
import ReservationDetail from "../ReservationDetail/ReservationDetail";
import Header from "../Header/Header";

export default function ReservationShipping({ response }) {
  const [data, setData] = useState(null);
  if (!response) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }

  
  return (
    <div>
      <Header/>
      <div>
        <p>Goods Name: {response.goodsDto.name}</p>
        <p>{response.recipientName}</p>
        {/* You can add more details from the response as needed */}
      </div>
    </div>
  );
}
