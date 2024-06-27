import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Reservation from "../Reservation/Reservation";
import { Link, useNavigate } from "react-router-dom";
import ReservationDetail from "../ReservationDetail/ReservationDetail";
import Autocomplete from "@mui/material/Autocomplete";
import "../Reservation/Reservation.css";

function LocationComponent() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [allData, setAllData] = useState({ now: null, future: null });
  const navigate = useNavigate();
  const [tabToShow, setTabToShow] = useState("now");

  const [isLocationComponentVisible, setLocationComponentVisibility] =
    useState(true); // State for controlling visibility

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (index) => {
    console.log("yes");
    setLocationComponentVisibility(false);

    const selectedData = tabToShow === "now" ? data1[index] : data2[index];
    const selectedReservationId = selectedData.id;
    setSelectedItem(selectedData); // Set the selected item in the state
    console.log("Selected reservationId:", selectedReservationId);
    navigate(`/reservationDetail/${selectedReservationId}`);
  };

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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError(null);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setError("Bạn chưa bật vị trí.");
          } else {
            setError(err.message);
          }
        }
      );
    } else {
      setError("Geolocation is not available in this browser.");
    }
  }, []);

  async function getApiDataNow(apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer  ${token}`, // Replace 'your-api-key' with your actual API key if needed
          "Content-Type": "application/json",
        },
      });

      // Assuming the response contains JSON data
      const responseData = response.data;
      console.log("nowData: ", responseData);
      setLoading(false);
      // Update the 'data' state with the fetched data
      setData1(responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getApiDataFuture(apiUrl) {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer  ${token}`, // Replace 'your-api-key' with your actual API key if needed
          "Content-Type": "application/json",
        },
      });

      // Assuming the response contains JSON data
      const responseData = response.data;
      console.log("futureData: ", responseData);
      setLoading(false);
      // Update the 'data' state with the fetched data
      setData2(responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const apiUrlNow = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetAwaitingDriverReservation?Latitude=${latitude}&Longitude=${longitude}&LatitudeDes=0&LongitudeDes=0&isNow=true`;
      const apiUrlFuture = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetAwaitingDriverReservation?Latitude=${latitude}&Longitude=${longitude}&LatitudeDes=0&LongitudeDes=0&isNow=false`;

      // Call getApiData for "now" data
      getApiDataNow(apiUrlNow).then((data) => {
        setAllData((prevState) => ({
          ...prevState,
          now: data,
        }));
      });

      // Call getApiData for "future" data
      getApiDataFuture(apiUrlFuture).then((data) => {
        setAllData((prevState) => ({
          ...prevState,
          future: data,
        }));
      });
    }
  }, [latitude, longitude, token]); // Add dependencies

  return (
    <div>
      {latitude && longitude ? (
        <p className="text-center"></p>
      ) : (
        <p className="text-center"></p>
      )}
      {isLocationComponentVisible ? (
        <div className="page__journey">
          {loading ? (
            <p>Loading data...</p>
          ) : error ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              <div className="tab-buttons d-flex justify-content-around">
                <button onClick={() => setTabToShow("now")} className={tabToShow === "now" ? "active-tab" : ""}>Now</button>
                <button onClick={() => setTabToShow("future")} className={tabToShow === "future" ? "active-tab" : ""}>Future</button>
              </div>
              <div className="journey-list">
                {tabToShow === "now" &&
                  data1 &&
                  data1.map((item, index) => (
                    <div key={index} onClick={() => handleItemClick(index)} className="journey-list-item">
                      {item.highPriorityLevel == true ? (
                        <p className="priority d-flex">
                          <p>{item.distanceFromCurrentReservationToYou} km</p>
                          <i class="fa-solid fa-circle-check text-center"></i>
                        </p>
                      ) : (
                        <p></p>
                      )}
                      <div className="journey d-flex justify-content-between">
                        <div className="start">{item.sendLocation}</div>
                        <i className="fa-solid fa-arrow-right"></i>
                        <div className="end">{item.reciveLocation}</div>
                      </div>
                      <hr />
                      <div className="list__journey">
                        {/* <div className="time d-flex justify-content-between">
                          <p>Đang cần xe</p>
                        </div> */}
                        <div className="goods d-flex justify-content-between">
                          <p>Tên hàng hóa: </p>
                          <p>{item.goodsDto.name}</p>
                        </div>
                        <div className="payload d-flex justify-content-between">
                          <p>Trọng tải: </p>
                          <p>{item.goodsDto.weight}kg</p>
                        </div>
                      </div>
                      <hr />
                      <div className="money__journey d-flex justify-content-between">
                        <p>Báo giá: </p>
                        <p>{item.totallPrice}vnd</p>
                      </div>
                    </div>
                  ))}
                {tabToShow === "future" &&
                  data2 &&
                  data2.map((item, index) => (
                    <div key={index} onClick={() => handleItemClick(index)}>
                      {item.highPriorityLevel == true ? (
                        <p className="priority">
                          <i class="fa-solid fa-circle-check"></i>
                        </p>
                      ) : (
                        <p></p>
                      )}
                      <div className="journey d-flex justify-content-between">
                        <div className="start">{item.sendLocation}</div>
                        <i className="fa-solid fa-arrow-right"></i>
                        <div className="end">{item.reciveLocation}</div>
                      </div>
                      <hr />
                      <div className="list__journey">
                        <div className="time d-flex justify-content-between">
                          <p>
                            Thời gian bốc hàng:{" "}
                            {formatDateTime(item.pickUpDateTime)}
                          </p>
                        </div>
                        <div className="goods d-flex justify-content-between">
                          <p>Tên hàng hóa: </p>
                          <p>{item.goodsDto.name}</p>
                        </div>
                        <div className="payload d-flex justify-content-between">
                          <p>Trọng tải: </p>
                          <p>{item.goodsDto.weight}kg</p>
                        </div>
                      </div>
                      <hr />
                      <div className="money__journey d-flex justify-content-between">
                        <p>Báo giá: </p>
                        <p>{item.totallPrice}vnd</p>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      ) : null}
      {!isLocationComponentVisible && (
        <ReservationDetail selectedItem={selectedItem} />
      )}
    </div>
  );
}

export default LocationComponent;
