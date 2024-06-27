import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Grid, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PlaceIcon from "@mui/icons-material/Place";
import CategoryIcon from "@mui/icons-material/Category";
import ImportExportIcon from "@mui/icons-material/ImportExport";

import "./AdminPage.css"; // Import your custom CSS here
import AdminListItem from "./ListItem";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const statusMapping = {
    AwaitingPayment: { label: "Chờ thanh toán", color: "#FFFF00" },
    AwaitingDriver: { label: "Chờ tài xế", color: "#FFFF00" },
    Cancelled: { label: "Đã hủy", color: "red" },
    Completed: { label: "Hoàn thành", color: "green" },
    OnTheWayToPickupPoint: { label: "Đang tới điểm đặt", color: "#FFFF00" },
    InDelivery: { label: "Đang vận chuyển", color: "#808080" },
  };
  useEffect(() => {
    // Define the API URL with the reservationId and the Bearer token
    const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetReservationHistoryDetailForUser?reservationId=${id}`;

    // Make the API request
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrder(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id, token]);

  if (!order) {
    return <div>Loading...</div>;
  }
  return (
    <Grid container sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Grid
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
          border: "1px solid #F37022",
        }}
        item
        xs={2}
      >
        <AdminListItem />
      </Grid>

      {/* Main Content */}
      <Grid item xs={10}>
        <Container className="container">
          <Typography variant="h4" gutterBottom>
            Chi tiết đơn hàng
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="info-item">
              <DateRangeIcon />{" "}
              {format(new Date(order.pickUpDateTime), "HH:mm dd/MM/yyyy")}
            </div>
            <div>
              <h5
                style={{ color: statusMapping[order.reservationStatus].color }}
              >
                {statusMapping[order.reservationStatus].label}
              </h5>
            </div>
          </div>

          <Paper elevation={3} className="order-card">
            {/* Render driver information only if driverDto is not null */}
            {order.driverDto && (
              <Grid className="mb-3" item xs={12} sm={6}>
                <Typography variant="h6">Tài xế</Typography>
                <div className="info-item">
                  <AccountCircleIcon /> {order.driverDto.fullName}
                </div>
                <div className="info-item">
                  <PhoneIcon /> {order.driverDto.phoneNumber}
                </div>
              </Grid>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Thông tin người gửi</Typography>
                <div className="info-item">
                  <PersonIcon /> {order.sender}
                </div>
                <div className="info-item">
                  <PhoneIcon /> {order.senderPhone}
                </div>
                <div className="info-item">
                  <GpsFixedIcon /> {order.sendLocation}
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Thông tin người nhận</Typography>
                <div className="info-item">
                  <PersonIcon /> {order.recipientName}
                </div>
                <div className="info-item">
                  <PhoneIcon /> {order.recipientPhone}
                </div>
                <div className="info-item">
                  <PlaceIcon /> {order.reciveLocation}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Thông tin đơn hàng</Typography>
                <div className="info-item">
                  <CategoryIcon />
                  {order.goodsDto.name}
                </div>
                <div className="info-item">
                  <ImportExportIcon /> {order.distance} km
                </div>
              </Grid>
            </Grid>
            <div className="fw-bold h6" style={{ textAlign: "end" }}>
              Thành tiền:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.totallPrice)}
            </div>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
}
