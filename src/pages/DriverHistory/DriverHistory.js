import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "../ReservationDetail/ReservationDetail.css";

export default function DriverHistory() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetReservationHistoryForDriver`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }

        if (response.status === 204) {
          // No content, return an empty object or an appropriate value
          setData(null);
        } else {
          const responseData = await response.json();
          console.log("responseData: ", responseData);
          setData(responseData);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        // You might want to handle the error here or set an error state.
      }
    }

    fetchData();
  }, [token]); // Include any dependencies for useEffect

  console.log(data);

  return (
    <div>
      <Header title="Lịch sử đơn hàng" />
      {data ? (
        <div className="driverHistory">
          {data.map((item, index) => (
            <div key={index} className="historyContent">
              <p className="text-center">
                <i class="fa-regular fa-calendar-days text-success"></i>{" "}
                {formatDateTime(item.creationDate)}
              </p>
              <p>
                <i class="fa-regular fa-circle-up text-primary"></i>
                {item.sendLocation}
              </p>
              <p>
                <i class="fa-regular fa-circle-down text-danger"></i>
                {item.reciveLocation}
              </p>
              <p className="text-center"><i class="fa-solid fa-boxes-packing text-info"></i>{"   "}{item.goodsName}</p>
              <p className="text-center"><i class="fa-solid fa-coins text-warning"></i>{"  "}{item.totallPrice}đ</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Bạn chưa chạy cuốc xe nào</p>
      )}
      <Footer />
    </div>
  );
}
