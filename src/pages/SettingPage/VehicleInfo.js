import React, { useEffect, useState } from "react";
import UserHeader from "../UserPage/UserHeader";
import {
  Container,
  Typography,
  Avatar,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import UserFooter from "../UserPage/UserFooter";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Footer from "../Footer/Footer";

export default function VehicleInfo() {
  const [vehicleData, setVehicleData] = useState(null);
  const { token } = useAuth();
  const roleUser = localStorage.getItem("roleUser");
  useEffect(() => {
    // Lấy id từ localStorage
    const userId = localStorage.getItem("userId");

    // Thực hiện yêu cầu API để lấy thông tin xe dựa trên userId
    axios
      .get(
        `https://tsdlinuxserverapi.azurewebsites.net/api/Vehicle/GetVehicleByIdDriver?idDriver=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setVehicleData(response.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu từ API", error));
  }, [token]);

  return (
    <div>
      <UserHeader />
      <Container maxWidth="xs">
        {vehicleData && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginTop="20px"
          >
            <Avatar
              src={vehicleData.imageVehicle || "url_of_default_image"}
              alt={vehicleData.nameVehicle}
              sx={{ width: 100, height: 100 }}
            />
            <Typography
              className="mt-3 fw-bold"
              style={{ color: "#f37022" }}
              variant="h6"
              gutterBottom
            >
              Tên xe: {vehicleData.nameVehicle}
            </Typography>
            <Typography variant="body1">
              Loại xe: {vehicleData.vehicleTypeDto.vehicleTypeName}
            </Typography>
            <Typography variant="body1">
              Chi tiết: {vehicleData.description}
            </Typography>
            <Typography variant="body1">
              Biển số xe: {vehicleData.licensePlate}
            </Typography>
          </Box>
        )}
      </Container>
      {roleUser === "USER" && <UserFooter />}
      {roleUser === "DRIVER" && <Footer />}
    </div>
  );
}
