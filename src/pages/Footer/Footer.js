import React, { useState, useEffect } from "react";
import axios from "axios";
import { Autocomplete, Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import LocationComponent from "../LocationComponent/LocationComponent";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.css";
import "../Footer/Footer.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CurrentBooking from "./../CurrentBooking/CurrentBooking";
import { Link } from "react-router-dom";

export default function Footer() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [pickupAddress, setPickupAddress] = useState(null);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [allData, setAllData] = useState({ now: null, future: null });

  const navigate = useNavigate();

  const handlePickupChange = (event, newValue) => {
    setPickupAddress(newValue);
    if (newValue) {
      // Gọi hàm để lấy kinh độ và vĩ độ cho pickup
      getGeocode(newValue.id).then((coordinates) => {
        setPickupCoordinates(coordinates);
      });
    } else {
      setPickupCoordinates(null);
    }
  };
  const loadOptions = async (inputValue, setAddressState, setOptionsState) => {
    try {
      // Gọi API GET để lấy danh sách địa chỉ gợi ý dựa trên inputValue
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?input=${inputValue}&api_key=oLlIcCqn7OC5JAj9MaEthx4oKtQJvyIZXYrxyiCN`
      );
      const data = await response.json();

      // Kiểm tra xem có dữ liệu gợi ý không
      if (data?.predictions) {
        const formattedOptions = data.predictions.map((prediction) => ({
          label: prediction.description,
          id: prediction.place_id,
        }));
        setOptionsState(formattedOptions);
      } else {
        setOptionsState([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getGeocode = async (placeId) => {
    try {
      // Gọi API geocoding để lấy kinh độ và vĩ độ dựa trên place_id
      const response = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=oLlIcCqn7OC5JAj9MaEthx4oKtQJvyIZXYrxyiCN`
      );
      const data = await response.json();

      // Kiểm tra xem có dữ liệu geocoding không
      if (data?.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
    return null;
  };

  console.log(pickupCoordinates);

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

  const handleOKClick = () => {
    handleClose(); // Close the modal
    // Trigger the useEffect with updated pickupCoordinates
    if (pickupCoordinates) {
      const { lat, lng } = pickupCoordinates;
      const apiUrlNow = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetAwaitingDriverReservation?Latitude=${lat}&Longitude=${lng}&isNow=true`;
      const apiUrlFuture = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetAwaitingDriverReservation?Latitude=${lat}&Longitude=${lng}&isNow=false`;

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
  };

  async function getCurrentBooking() {
    navigate("/currentBooking");
  }

  const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="footer">
      <div className="footer__content">
        <Link to="/driver">
          <button>
            <i className="fa-solid fa-house" />
          </button>
        </Link>
        <Link to="/driverHistory">
          <button>
            <i className="fa-solid fa-list" />
          </button>
        </Link>
        {/* tìm kiếm */}
        <Link>
          <button className="search" onClick={handleOpen}>
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </Link>
        {/* đơn hàng đang nhận */}
        <Link to="/currentBooking">
          <button>
            <i className="fa-solid fa-bell" />
          </button>
        </Link>
        <Link to="/settings">
          <button>
            <i className="fa-solid fa-gear" />
          </button>
        </Link>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Autocomplete
            value={pickupAddress}
            onChange={handlePickupChange}
            options={pickupOptions}
            getOptionLabel={(option) => option.label}
            onInputChange={(event, newInputValue) =>
              loadOptions(newInputValue, setPickupAddress, setPickupOptions)
            }
            renderInput={(params) => (
              <Grid sx={{ mb: 1 }} container spacing={2}>
                <Grid item xs={10}>
                  {" "}
                  <TextField
                    {...params}
                    placeholder="Lấy hàng tại đâu?"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#F37022",
                        },
                        "&:hover fieldset": {
                          borderColor: "#F37022",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#F37022",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "#F37022", // Màu label khi trỏ vào ô input
                      },
                    }}
                  />
                  <button className="ok" onClick={handleOKClick}>OK</button>
                </Grid>
              </Grid>
            )}
          />
        </Box>
      </Modal>
    </div>
  );
}
