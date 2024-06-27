import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import error from "../images/404.png";
import UserHeader from "../UserPage/UserHeader";
import Footer from "../Footer/Footer";
import UserFooter from "../UserPage/UserFooter";

const specialTextStyle = {
  fontSize: "30px", // Kích thước chữ
  fontWeight: "bold", // Độ đậm
  color: "#F37022", // Màu chữ
  textTransform: "uppercase", // Chuyển đổi chữ thành HOA
};

export default function ErrorPage() {
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
          Page not found
        </Typography>
      </Container>
      <UserFooter />
    </div>
  );
}
