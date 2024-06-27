import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container, Divider, Grid, Skeleton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import WidgetsIcon from "@mui/icons-material/Widgets";
import BikeScooterIcon from "@mui/icons-material/BikeScooter";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import { useAuth } from "../../context/AuthContext";
import "../UserHistory/UserHistory.css";
import searching from "../images/searching.png";
import { format } from "date-fns"; // Import thư viện date-fns
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  margin-top: 20px;
  display: block;
  margin: 0 auto;
  border-color: red;
`;
function History() {
  const [reservationData, setReservationData] = useState([]);
  const [loading, setLoading] = useState(true); // Biến trạng thái cho biết liệu đang nạp dữ liệu hay không
  const { token } = useAuth();

  useEffect(() => {
    // Gọi API và lưu dữ liệu vào state khi component được tạo
    fetch(
      "https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetReservationHistoryForUser",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setReservationData(data);
        setLoading(false); // Đã nạp dữ liệu xong, set loading thành false
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API: ", error);
        setLoading(false); // Có lỗi xảy ra, set loading thành false
      });
  }, []);

  // Hàm để xác định biểu tượng dựa trên vehicleType
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case "Xe máy":
        return <TwoWheelerIcon sx={{ color: "#F37022" }} />;
      case "Xe Ba gác":
        return <BikeScooterIcon sx={{ color: "#F37022" }} />;
      case "Xe Bán tải":
        return <DriveEtaIcon sx={{ color: "#F37022" }} />;
      default:
        return <LocalShippingIcon sx={{ color: "#F37022" }} />;
    }
  };

  const statusMapping = {
    AwaitingPayment: { label: "Chờ thanh toán", color: "#FFFF00" },
    AwaitingDriver: { label: "Chờ tài xế", color: "#FFFF00" },
    Cancelled: { label: "Đã hủy", color: "red" },
    Completed: { label: "Hoàn thành", color: "green" },
    OnTheWayToPickupPoint: { label: "Đang tới điểm đặt", color: "#FFFF00" },
    InDelivery: { label: "Đang vận chuyển", color: "#808080" },
  };

  return (
    <Container sx={{ marginBottom: "100px" }}>
      {loading ? (
        <Container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BeatLoader
            css={override} // Define the CSS styles for the loading spinner (you can customize it)
            size={10} // Set the size of the spinner
            color={"#F37022"} // Customize the color of the spinner// Set loading to true when reservationData is null
          />
        </Container>
      ) : Array.isArray(reservationData) && reservationData.length > 0 ? (
        reservationData.map((reservation) => (
          <Link
            to={`/userhistory/${reservation.id}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              sx={{
                border: "1px solid #F37022",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
              key={reservation.id}
            >
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle2">
                      <span
                        style={{
                          color:
                            statusMapping[reservation.reservationStatus].color,
                        }}
                      >
                        {statusMapping[reservation.reservationStatus].label}
                      </span>{" "}
                      -{" "}
                      {format(new Date(reservation.creationDate), "dd/MM/yyyy")}
                    </Typography>
                  </Grid>
                  <Grid item container alignItems="center" spacing={1}>
                    <Grid item>
                      <ArrowCircleUpIcon color="primary" />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="subtitle2"
                        className="ellipsis-text" // Thêm class cho phần tử này
                      >
                        {reservation.sendLocation}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container alignItems="center" spacing={1}>
                    <Grid item>
                      <ArrowCircleDownIcon sx={{ color: "red" }} />
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="subtitle2"
                        className="ellipsis-text" // Thêm class cho phần tử này
                      >
                        {reservation.reciveLocation}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container alignItems="center" spacing={1}>
                    <Grid item>{getVehicleIcon(reservation.vehicleType)}</Grid>{" "}
                    {/* Sử dụng hàm getVehicleIcon */}
                    <Grid item>
                      <Typography variant="body2">
                        {reservation.vehicleType}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <WidgetsIcon sx={{ color: "#F37022" }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {reservation.goodsName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Link>
        ))
      ) : (
        <Typography
          variant="body2"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "150px",
          }}
        >
          <img src={searching} className="img__search" />
          <h5 className="mt-4" style={{ fontWeight: "bold" }}>
            {" "}
            Bạn chưa đặt giao đơn hàng nào
          </h5>
        </Typography>
      )}
    </Container>
  );
}

export default History;
