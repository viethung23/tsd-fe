import React from "react";
import { Link } from "react-router-dom";
import failedImg from "../images/remove.png";
import UserHeader from "../UserPage/UserHeader";
import { Button, Container, Typography } from "@mui/material";
import UserFooter from "../UserPage/UserFooter";

const specialTextStyle = {
  fontSize: "30px", // Kích thước chữ
  fontWeight: "bold", // Độ đậm
  color: "#e94030", // Màu chữ
  textTransform: "uppercase", // Chuyển đổi chữ thành HOA
};
const button = {
  border: "1px solid #F37022",
  padding: "10px",
  borderRadius: "15px",
  backgroundColor: "#F37022",
  fontWeight: "bold",
  color: "white",
};

const PaymentFailure = () => {
  return (
    <div>
      <UserHeader />
      <Container
        className="redirect"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <img style={{ width: "90px" }} src={failedImg} alt="Error" />
        <Typography
          className="mt-4"
          variant="h4"
          gutterBottom
          style={specialTextStyle}
        >
          Thanh toán thất bại
        </Typography>
        <Link to="/userreservation">
          <button style={button}>Xem đơn hàng</button>
        </Link>
      </Container>
      <UserFooter />
    </div>
  );
};

export default PaymentFailure;
