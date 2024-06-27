import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import success from "../images/success.png";
import UserHeader from "../UserPage/UserHeader";
import Footer from "../Footer/Footer";
import UserFooter from "../UserPage/UserFooter";

const specialTextStyle = {
  fontSize: "30px", // Kích thước chữ
  fontWeight: "bold", // Độ đậm
  color: "#61d686", // Màu chữ
};

export default function OrderSuccess() {
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
        <img style={{ width: "90px" }} src={success} alt="Success" />
        <Typography
          className="my-3"
          variant="h4"
          gutterBottom
          style={specialTextStyle}
        >
          Thanh toán thành công
        </Typography>
      </Container>
      <UserFooter />
    </div>
  );
}
