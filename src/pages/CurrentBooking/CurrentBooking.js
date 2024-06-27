import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "../ReservationDetail/ReservationDetail.css";
import Footer from "../Footer/Footer";

export default function CurrentBooking() {
  const { token } = useAuth(); // Make sure to access the token correctly from your authentication context.
  const [data, setData] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [completedData, setCompletedData] = useState(null);

  const navigate = useNavigate();

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
        const userId = localStorage.getItem("userId");
        const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/current-reservation-of-driver?driverId=${userId}`;

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
          setData(responseData);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        // You might want to handle the error here or set an error state.
      }
    }

    fetchData();
  }, [token]); // Include any dependencies for useEffect

  const handleShipping = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/DriverReservationAction?driverId=${userId}&reservationId=${data.id}&action=1`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const responseData = await response.json();
      setShippingData(responseData);
      console.log("responseData: ", responseData);
      window.location.reload();
    } catch (error) {
      console.error("Error in handleShipping:", error);
      // You might want to handle the error here or set an error state.
    }
  };

  const handleShippingCompleted = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/DriverReservationAction?driverId=${userId}&reservationId=${data.id}&action=2`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response);
        setCompletedData(null);
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const responseData = await response.json();
      setCompletedData(responseData);
      console.log("responseData: ", responseData);
      navigate("/driver");
    } catch (error) {
      console.error("Error in handleShipping:", error);
      // You might want to handle the error here or set an error state.
    }
  };

  console.log("completed", completedData);

  return (
    <div>
      <Header title="Đơn hàng đang nhận" />
      {data ? (
        <div className="detail">
          <div className="currentBooking">
            <div>
              <div className="user__info">
                <p>
                  Người gửi: {data.senderDto.fullName}{" "}
                  {data.senderDto.phoneNumber}
                </p>
                <p>
                  Người nhận: {data.recipientName} {data.recipientPhone}
                </p>
              </div>
              <h5>Địa chỉ vận chuyển</h5>
              <div className="transportation">
                <p>
                  <i class="fa-regular fa-circle-up"></i> Địa chỉ bốc hàng
                </p>
                <p className="send">{data.sendLocation}</p>
                <p>
                  <i class="fa-regular fa-circle-down"></i> Địa chỉ xuống hàng
                </p>
                <p className="receive">{data.reciveLocation}</p>
              </div>
              <h5>Thông tin hàng hóa</h5>
              <div className="goods__content">
                {data.isNow === true ? (
                  <p>
                    Thời gian bốc hàng: {formatDateTime(data.pickUpDateTime)}
                  </p>
                ) : (
                  <p>Thời gian bốc hàng: Đang cần xe bây giờ</p>
                )}
                <p>Loại hàng hóa: {data.goodsDto.name}</p>
                <p>Trọng tải: {data.goodsDto.weight}kg</p>
              </div>
              <div className="shippingButton">
                {data.reservationStatus === "OnTheWayToPickupPoint" ? (
                  <div>
                    <button className="call">Gọi ngay</button>
                    <button className="accept" onClick={handleShipping}>
                      Đã tới điểm nhận hàng
                    </button>
                  </div>
                ) : (
                  <div>
                    <button className="call">Gọi ngay</button>
                    <button
                      className="accept"
                      onClick={handleShippingCompleted}
                    >
                      Đã giao
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-center">Hiện tại bạn chưa nhận đơn nào</p>
          <div className="back">
            <button className="backButton" onClick={() => navigate("/driver")}>
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
