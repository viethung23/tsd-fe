import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet"; // Import Leaflet
import polyline from "polyline";
import axios from "axios";
import { useRef } from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { Link } from "react-router-dom";
import MyLocationIcon from "@mui/icons-material/MyLocation"; // Import icon
import AddCircleIcon from "@mui/icons-material/AddCircle";
import recImg from "../images/BPing.png";
import delImg from "../images/APing.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

function AddressAutocomplete() {
  const [pickupAddress, setPickupAddress] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);
  const [distance, setDistance] = useState(null); // Biến để lưu khoảng cách

  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([10.776444, 106.70112]);
  const [map, setMap] = useState(null); // Sử dụng state để theo dõi bản đồ
  const [route, setRoute] = useState(null); // Thêm trạng thái để lưu trữ đường đi
  const mapRef = useRef();

  const [mapConfirmed, setMapConfirmed] = useState(false); // Trạng thái xác nhận địa chỉ
  const [selectedVehicle, setSelectedVehicle] = useState(""); // Id của loại xe đã chọn
  const [vehicleTypes, setVehicleTypes] = useState([]); // State để lưu danh sách loại xe từ API
  const [showVehicleSelectBox, setShowVehicleSelectBox] = useState(false);

  const [services, setServices] = useState([]); // State để lưu danh sách dịch vụ
  const [selectedServices, setSelectedServices] = useState([]);
  const [defaultServices, setDefaultServices] = useState([]);
  const { token } = useAuth();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const recIcon = L.icon({
    iconUrl: recImg, // Đường dẫn đến hình ảnh
    iconSize: [40, 40], // Kích thước của biểu tượng
    iconAnchor: [20, 40], // Anchor point của biểu tượng, điểm mà biểu tượng sẽ được đặt tại vị trí của Marker
  });
  const delIcon = L.icon({
    iconUrl: delImg, // Đường dẫn đến hình ảnh
    iconSize: [40, 40], // Kích thước của biểu tượng
    iconAnchor: [20, 40], // Anchor point của biểu tượng, điểm mà biểu tượng sẽ được đặt tại vị trí của Marker
  });

  const renderMap = () => {
    return (
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "350px", width: "100%" }}
        ref={mapRef} // Đảm bảo rằng mapRef đã được thiết lập
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pickupCoordinates && (
          <Marker
            position={[pickupCoordinates.lat, pickupCoordinates.lng]}
            icon={recIcon}
          >
            <Popup>Pickup Address</Popup>
          </Marker>
        )}
        {deliveryCoordinates && (
          <Marker
            position={[deliveryCoordinates.lat, deliveryCoordinates.lng]}
            icon={delIcon}
          >
            <Popup>Delivery Address</Popup>
          </Marker>
        )}
        {route && <Polyline positions={route} color="red" />}
      </MapContainer>
    );
  };

  useEffect(() => {
    if (selectedVehicle) {
      async function fetchServices() {
        try {
          const response = await axios.get(
            `https://tsdlinuxserverapi.azurewebsites.net/api/Service/GetServicesByVehicleTypeId?vehicleTypeId=${selectedVehicle}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the Bearer token in the header
              },
            }
          );
          if (response.data) {
            setServices(response.data);
          }
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      }
      fetchServices();
    }
  }, [selectedVehicle, token]);

  useEffect(() => {
    // Gọi API để lấy danh sách loại xe khi component được tải
    async function fetchVehicleTypes() {
      try {
        const response = await axios.get(
          "https://tsdlinuxserverapi.azurewebsites.net/api/VehicleType/GetAllVehicleType",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the header
            },
          }
        );
        if (response.data) {
          setVehicleTypes(response.data); // Cập nhật danh sách loại xe từ API
        }
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    }

    fetchVehicleTypes();
  }, [token]);

  const fetchDefaultServices = async () => {
    try {
      const response = await axios.get(
        "https://tsdlinuxserverapi.azurewebsites.net/api/Service/GetServicesByVehicleTypeId?vehicleTypeId=" +
          selectedVehicle
      );
      if (response.data) {
        // Lọc ra các dịch vụ có "isShow" là false
        const defaultServices = response.data.filter(
          (service) => !service.isShow
        );
        setDefaultServices(defaultServices);
      }
    } catch (error) {
      console.error("Error fetching default services:", error);
    }
  };
  useEffect(() => {
    if (selectedVehicle) {
      fetchDefaultServices();
    }
  }, [selectedVehicle]);

  const handleServiceChange = (serviceId) => {
    // Kiểm tra xem dịch vụ đã được chọn trước đó hay chưa
    if (selectedServices.includes(serviceId)) {
      // Nếu đã chọn, loại bỏ dịch vụ khỏi danh sách đã chọn
      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.filter((id) => id !== serviceId)
      );
    } else {
      // Nếu chưa chọn, thêm dịch vụ vào danh sách đã chọn
      setSelectedServices((prevSelectedServices) => [
        ...prevSelectedServices,
        serviceId,
      ]);
    }
  };

  const calculateAmount = async () => {
    if (distance) {
      // Tạo một mảng chứa ID của các dịch vụ đã chọn và ID của các dịch vụ có "isShow" là false
      const allSelectedServices = [...selectedServices];
      defaultServices.forEach((defaultService) => {
        if (!allSelectedServices.includes(defaultService.id)) {
          allSelectedServices.push(defaultService.id);
        }
      });

      try {
        // Gọi API tính tiền với danh sách dịch vụ đã chọn và dịch vụ có "isShow" là false
        const response = await axios.post(
          "https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/Calculate_Amount_By_Services_And_Km",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the Bearer token in the header
            },
          },
          {
            distance: parseFloat(distance),
            serviceIds: allSelectedServices,
          }
        );

        // Xử lý kết quả từ API
        if (response.data) {
          // Xử lý dữ liệu trả về từ API theo ý của bạn
          console.log("Calculated amount:", response.data);
          // Hiển thị hoặc lưu kết quả tính tiền tại đây
        } else {
          console.error("No data received from the API");
        }
      } catch (error) {
        console.error("Error calculating amount:", error);
      }
    } else {
      console.error("Invalid input data for calculating amount");
    }
  };

  const handleConfirmAddress = () => {
    if (pickupCoordinates && deliveryCoordinates) {
      setShowVehicleSelectBox(true); // Khi xác nhận địa chỉ, hiển thị select box
      setMapConfirmed(true); // Cập nhật trạng thái mapConfirmed thành true
    } else {
      toast.error("Hãy điền đầy đủ địa chỉ!");
    }
  };

  const handleVehicleChange = (event) => {
    setSelectedVehicle(event.target.value);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    if (pickupCoordinates && deliveryCoordinates && mapRef.current) {
      const bounds = L.latLngBounds(pickupCoordinates, deliveryCoordinates).pad(
        0.1
      ); // Tăng khoảng cách giữa bounds và viền bản đồ
      mapRef.current.fitBounds(bounds);
    }
  }, [pickupCoordinates, deliveryCoordinates]);

  const handleGetMyLocation = () => {
    if (userLocation) {
      // Nếu đã có thông tin vị trí của người dùng, cập nhật pickupAddress và pickupCoordinates
      const { lat, lng } = userLocation;

      // Gửi yêu cầu đến API Geocode để lấy địa chỉ từ tọa độ
      fetch(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=xHCBZ2ReaVMtYe1rhk9p9sFpKsZF8Sp3oDUT0M0r`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const formattedAddress = data.results[0].formatted_address;
            setPickupCoordinates({ lat, lng });
            setPickupAddress({ label: formattedAddress, id: "userLocation" });
          } else {
            setError("No address found for the given coordinates");
          }
        })
        .catch((error) => {
          setError(`Error getting user location: ${error.message}`);
        });
    } else {
      setError("User location is not available");
    }
  };

  // Lưu thông tin của địa chỉ giao và địa chỉ nhận vào state
  const handlePickupChange = (event, newValue) => {
    setPickupAddress(newValue);
    if (newValue) {
      // Gọi hàm để lấy kinh độ và vĩ độ cho pickup
      getGeocode(newValue.id).then((coordinates) => {
        setPickupCoordinates(coordinates);
        calculateDistance(coordinates, deliveryCoordinates);
        calculateAndDisplayRoute(coordinates, deliveryCoordinates); // Thêm dòng này
      });
    } else {
      setPickupCoordinates(null);
      calculateDistance(null, deliveryCoordinates);
      setRoute(null); // Đặt giá trị đường đi thành null khi người dùng xóa pickup
    }
  };

  const handleDeliveryChange = (event, newValue) => {
    setDeliveryAddress(newValue);
    if (newValue) {
      // Gọi hàm để lấy kinh độ và vĩ độ cho delivery
      getGeocode(newValue.id).then((coordinates) => {
        setDeliveryCoordinates(coordinates);
        calculateDistance(pickupCoordinates, coordinates);
        calculateAndDisplayRoute(pickupCoordinates, coordinates); // Thêm dòng này
      });
    } else {
      setDeliveryCoordinates(null);
      calculateDistance(pickupCoordinates, null);
      setRoute(null); // Đặt giá trị đường đi thành null khi người dùng xóa delivery
    }
  };

  const loadOptions = async (inputValue, setAddressState, setOptionsState) => {
    try {
      // Gọi API GET để lấy danh sách địa chỉ gợi ý dựa trên inputValue
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?input=${inputValue}&api_key=xHCBZ2ReaVMtYe1rhk9p9sFpKsZF8Sp3oDUT0M0r`
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
        `https://rsapi.goong.io/Place/Detail?place_id=${placeId}&api_key=xHCBZ2ReaVMtYe1rhk9p9sFpKsZF8Sp3oDUT0M0r`
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

  const calculateDistance = async (origin, destination) => {
    if (origin && destination) {
      try {
        // Lấy kinh độ và vĩ độ từ origin và destination
        const originLatLng = `${origin.lat},${origin.lng}`;
        const destinationLatLng = `${destination.lat},${destination.lng}`;

        // Gọi API đo khoảng cách
        const response = await fetch(
          `https://rsapi.goong.io/Direction?origin=${originLatLng}&destination=${destinationLatLng}&vehicle=truck&api_key=xHCBZ2ReaVMtYe1rhk9p9sFpKsZF8Sp3oDUT0M0r`
        );
        const data = await response.json();

        // Kiểm tra xem có dữ liệu khoảng cách không
        if (
          data?.routes?.[0]?.legs?.[0]?.distance?.value &&
          data?.routes?.[0]?.legs?.[0]?.distance?.text
        ) {
          const distanceInMeters = data.routes[0].legs[0].distance.value;
          const distanceText = data.routes[0].legs[0].distance.text;
          const distanceInKm = (distanceInMeters / 1000).toFixed(2); // Chuyển đổi thành km với 2 chữ số thập phân
          setDistance(distanceInKm);
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
        setDistance(null); // Đặt giá trị khoảng cách thành null nếu có lỗi
      }
    } else {
      setDistance(null); // Đặt giá trị khoảng cách thành null nếu không có đủ dữ liệu
    }
  };
  const calculateAndDisplayRoute = async (pickup, delivery) => {
    if (pickup && delivery) {
      try {
        // Lấy kinh độ và vĩ độ từ pickup và delivery
        const startPoint = `${pickup.lat},${pickup.lng}`;
        const endPoint = `${delivery.lat},${delivery.lng}`;
        const apiKey = "516acfba-d834-49b7-a970-38437a1a96c7"; // Thay thế bằng API key của bạn

        // Gọi API từ GraphHopper để lấy thông tin đường đi
        const apiUrl = `https://graphhopper.com/api/1/route?point=${startPoint}&point=${endPoint}&vehicle=car&key=${apiKey}`;
        const response = await axios.get(apiUrl);

        const { paths } = response.data;
        if (paths && paths.length > 0) {
          const firstPath = paths[0];
          if (firstPath.points) {
            const routeCoordinates = polyline.decode(firstPath.points);
            const formattedRoute = routeCoordinates.map((coordinate) => [
              coordinate[0],
              coordinate[1],
            ]);
            setRoute(formattedRoute);
          } else {
            console.error("Invalid route data format: missing coordinates");
          }
        } else {
          console.error("No route data found");
        }
      } catch (error) {
        console.error("Error calculating distance:", error);
        setRoute(null); // Đặt giá trị đường đi thành null nếu có lỗi
      }
    } else {
      setRoute(null); // Đặt giá trị đường đi thành null nếu không có đủ dữ liệu
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* Render Leaflet Map */}
        {renderMap()}
      </Grid>
      <Grid item xs={12}>
        <Container>
          {!mapConfirmed ? (
            <div>
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
                    </Grid>
                    <Grid item xs={2}>
                      {" "}
                      <IconButton
                        onClick={handleGetMyLocation}
                        edge="end"
                        aria-label="Lấy Vị Trí Của Tôi"
                        sx={{
                          color: "#F37022",
                        }}
                      >
                        <MyLocationIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
              />
              <Autocomplete
                sx={{ marginBottom: "80px" }}
                value={deliveryAddress}
                onChange={handleDeliveryChange}
                options={deliveryOptions}
                getOptionLabel={(option) => option.label}
                onInputChange={(event, newInputValue) =>
                  loadOptions(
                    newInputValue,
                    setDeliveryAddress,
                    setDeliveryOptions
                  )
                }
                renderInput={(params) => (
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      {" "}
                      <TextField
                        {...params}
                        placeholder="Giao đến đâu?"
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
                    </Grid>
                    <Grid item xs={2}>
                      {" "}
                      <IconButton
                        edge="end"
                        aria-label="+"
                        sx={{
                          color: "#F37022",
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
              />
              <div
                className="container"
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
              >
                <Button
                  className="mb-3"
                  onClick={handleConfirmAddress}
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "#F37022",
                    height: "50px",
                    width: "100%", // Make the button full-width
                    color: "white", // Set text color to white for better visibility
                  }}
                >
                  Xác nhận địa chỉ
                </Button>
              </div>
              <ToastContainer />
            </div>
          ) : (
            <div>
              {showVehicleSelectBox && (
                <div className="mb-4">
                  <h4>Thông tin xe</h4>
                  <Select
                    onChange={handleVehicleChange}
                    value={selectedVehicle}
                    displayEmpty
                    sx={{
                      width: "100%",
                      "&.MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#F37022",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Chọn loại xe</MenuItem>
                    {vehicleTypes.map((vehicleType) => (
                      <MenuItem key={vehicleType.id} value={vehicleType.id}>
                        {vehicleType.vehicleTypeName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )}

              {services.length > 0 && (
                <div>
                  <div style={{ marginBottom: "90px" }}>
                    <h5>Dịch vụ</h5>
                    {services
                      .filter((service) => service.isShow)
                      .map((service) => (
                        <FormControlLabel
                          key={service.id}
                          control={
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceChange(service.id)}
                              sx={{
                                color: "#F37022", // Đổi màu của checkbox ở đây
                                "&.Mui-checked": {
                                  color: "#F37022", // Đổi màu của checkbox khi đã được chọn
                                },
                              }}
                            />
                          }
                          label={`${service.serviceName} - Giá: ${service.price}`}
                        />
                      ))}
                  </div>
                  <div
                    className="container"
                    style={{
                      position: "fixed",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                    }}
                  >
                    {" "}
                    <Link
                      to="/book"
                      state={{
                        distance: distance,
                        selectedServices: selectedServices,
                        defaultServices: defaultServices,
                        pickupAddress: pickupAddress,
                        deliveryAddress: deliveryAddress,
                        pickupCoordinates: pickupCoordinates,
                        deliveryCoordinates: deliveryCoordinates,
                      }}
                    >
                      <Button
                        className="mb-3"
                        onClick={handleConfirmAddress}
                        style={{
                          borderRadius: "12px",
                          backgroundColor: "#F37022",
                          height: "50px",
                          width: "100%", // Make the button full-width
                          color: "white", // Set text color to white for better visibility
                        }}
                      >
                        Xác nhận
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </Grid>
    </Grid>
  );
}
export default AddressAutocomplete;
