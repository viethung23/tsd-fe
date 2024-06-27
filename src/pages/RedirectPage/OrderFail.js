import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import error from "../images/fail.png";
import UserHeader from "../UserPage/UserHeader";
import Footer from "../Footer/Footer";
import UserFooter from "../UserPage/UserFooter";

const specialTextStyle = {
  fontSize: "30px", // Kích thước chữ
  fontWeight: "bold", // Độ đậm
  color: "#F37022", // Màu chữ
};

export default function OrderFail() {
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
        <img style={{ width: "90px" }} src={error} alt="Error" />
        <Typography
          className="mt-2"
          variant="h4"
          gutterBottom
          style={specialTextStyle}
        >
          Thanh toán thất bại
        </Typography>
      </Container>
      <UserFooter />
    </div>
  );
}
