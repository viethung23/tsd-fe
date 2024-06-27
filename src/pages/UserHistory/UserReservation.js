import React, { useEffect, useState } from "react";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { Button, Container, Divider, Grid, Typography } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import UserHeader from "../UserPage/UserHeader";
import UserFooter from "../UserPage/UserFooter";
import searching from "../images/searching.png";
import { BeatLoader } from "react-spinners";
import { css } from "@emotion/react";

const override = css`
  margin-top: 20px;
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function UserReservation() {
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true); // Biến trạng thái cho việc hiển thị BeatLoader
  const { token } = useAuth();
  const navigate = useNavigate();
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const statusMapping = {
    AwaitingPayment: { label: "Chờ thanh toán", color: "#FFFF00" },
    AwaitingDriver: { label: "Chờ tài xế", color: "#FFFF00" },
    Cancelled: { label: "Đã hủy", color: "red" },
    Completed: { label: "Hoàn thành", color: "green" },
    OnTheWayToPickupPoint: { label: "Đang tới điểm đặt", color: "#FFFF00" },
    InDelivery: { label: "Đang vận chuyển", color: "#808080" },
  };

  const [paymentLink, setPaymentLink] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://tsdlinuxserverapi.azurewebsites.net/api/current-reservation-of-user?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setReservationData(data);
          setLoading(false);

          // Kiểm tra xem có liên kết thanh toán hay không và lưu vào state
          if (data.linkPayment) {
            setPaymentLink(data.linkPayment);
          }
        } else if (response.status === 204) {
          console.log("No Content received from the API");
          setReservationData(null);
          setLoading(false);
        } else {
          console.error("Error fetching data from the API");
        }
      } catch (error) {
        console.error("Error fetching data from the API", error);
      }
    };

    fetchData();
  }, [userId]);
  console.log(paymentLink);
  // Hàm xử lý khi người dùng bấm vào nút "Thanh toán ngay"
  const handlePayment = () => {
    const { deeplink, paymentUrl } = reservationData.linkPayment;
    const order_id = reservationData.linkPayment.id;
    // Chuyển hướng đến trang khác và truyền order_id qua URL
    navigate(`/confirm-order/${order_id}`);
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobileDevice) {
      // window.location.href = deeplink;
      window.open(deeplink, "_blank");
    } else {
      // window.location.href = paymentUrl;
      window.open(paymentUrl, "_blank");
    }
  };
  return (
    <>
      <UserHeader />
      <Container>
        {loading ? ( // Hiển thị BeatLoader trong quá trình gọi API
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BeatLoader
              css={override}
              size={10}
              color={"#F37022"}
              loading={loading}
            />
          </Container>
        ) : reservationData ? (
          <>
            {" "}
            <Grid className="mt-3">
              <Typography
                textAlign="right"
                variant="h6"
                sx={{
                  color: statusMapping[reservationData.reservationStatus].color,
                }}
              >
                {statusMapping[reservationData.reservationStatus].label}
              </Typography>
            </Grid>
            {["Completed", "OnTheWayToPickupPoint", "InDelivery"].includes(
              reservationData.reservationStatus
            ) ? (
              <Grid className="mt-2" container alignItems="center">
                <Grid item>
                  <PermIdentityIcon
                    sx={{ fontSize: "40px", marginRight: "10px" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontWeight: "bold" }} variant="h6">
                    {reservationData.driverDto.fullName}
                  </Typography>
                  <Typography variant="body1">
                    {reservationData.driverDto.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
            <Divider />
            <Grid container alignItems="center" className="mt-3">
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold" }} variant="h6">
                  Thanh toán:
                </Typography>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <Typography sx={{ fontWeight: "bold" }} variant="h6">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(reservationData.totallPrice)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container alignItems="center" className="mt-3">
              <Grid>
                <Typography sx={{ fontWeight: "bold" }} variant="h6">
                  Chi tiết đơn hàng
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {format(
                    new Date(reservationData.pickUpDateTime),
                    "HH:mm, dd/MM/yyyy"
                  )}
                </Typography>
              </Grid>
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Typography>Xe máy</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography> {reservationData.distance}km</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Grid className="mt-1" container alignItems="center" spacing={2}>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item>
                  <ArrowCircleUpIcon color="primary" />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: "bold", fontSize: "15px" }}>
                    {reservationData.sender}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={`ellipsis-text ${
                      expanded ? "expanded-text" : ""
                    }`}
                    sx={{ fontSize: "13px", cursor: "pointer" }}
                    onClick={toggleExpanded}
                  >
                    {reservationData.sendLocation}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item>
                  <ArrowCircleDownIcon sx={{ color: "red" }} />
                </Grid>
                <Grid item>
                  <Typography sx={{ fontWeight: "bold", fontSize: "15px" }}>
                    {reservationData.recipientName}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    className={`ellipsis-text ${
                      expanded ? "expanded-text" : ""
                    }`}
                    sx={{ fontSize: "13px", cursor: "pointer" }}
                    onClick={toggleExpanded}
                  >
                    {reservationData.reciveLocation}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {["OnTheWayToPickupPoint", "InDelivery"].includes(
              reservationData.reservationStatus
            ) && (
              <Grid
                className="container"
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
                item
                xs={12}
              >
                <Button
                  className="mb-3"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "#F37022",
                    height: "50px",
                    width: "100%",
                    color: "white",
                  }}
                >
                  <a
                    href={`tel:${reservationData.driverDto.phoneNumber}`}
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Gọi ngay
                  </a>
                </Button>
              </Grid>
            )}
            {["AwaitingPayment"].includes(
              reservationData.reservationStatus
            ) && (
              <Grid
                className="container"
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
                item
                xs={12}
              >
                <Button
                  className="mb-3"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "#F37022",
                    height: "50px",
                    width: "100%", // Make the button full-width
                    color: "white", // Set text color to white for better visibility
                  }}
                  onClick={handlePayment} // Gọi hàm xử lý thanh toán khi bấm vào nút
                >
                  Thanh toán ngay
                </Button>
              </Grid>
            )}
          </>
        ) : (
          // Hiển thị thông báo "Hiện tại chưa có đơn đặt" nếu không có dữ liệu
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
    </>
  );
}
export default UserReservation;
