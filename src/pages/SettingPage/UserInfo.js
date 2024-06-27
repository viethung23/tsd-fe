import React, { useEffect, useState } from "react";
import UserHeader from "../UserPage/UserHeader";

import { Container, Typography, Avatar, Box } from "@mui/material";
import { format } from "date-fns";
import UserFooter from "../UserPage/UserFooter";
import Footer from "../Footer/Footer";

export default function UserInfo() {
  const [userData, setUserData] = useState(null);
  const roleUser = localStorage.getItem("roleUser");
  useEffect(() => {
    // Lấy id từ localStorage
    const userId = localStorage.getItem("userId");

    // Thực hiện yêu cầu API để lấy thông tin người dùng dựa trên userId
    fetch(
      `https://tsdlinuxserverapi.azurewebsites.net/api/User/GetUserById?id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu từ API", error));
  }, []);

  return (
    <div>
      <UserHeader />
      <Container maxWidth="xs">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginTop="20px"
        >
          {userData && (
            <Avatar
              src={userData.avatarUrl || "url_of_default_avatar"}
              alt={userData.fullName}
              sx={{ width: 100, height: 100 }}
            />
          )}
          {userData && (
            <Typography
              className="mt-3"
              style={{ color: "#f37022", fontWeight: "bold" }}
              variant="h6"
              gutterBottom
            >
              {userData.fullName}
            </Typography>
          )}
          {userData && (
            <Typography className="mt-1" variant="body1">
              Email: {userData.email}
            </Typography>
          )}
          {userData && (
            <Typography variant="body1">
              Số điện thoại: {userData.phoneNumber}
            </Typography>
          )}
          {userData && (
            <Typography variant="body1">
              Ngày tạo: {format(new Date(userData.creationDate), "dd/MM/yyyy")}
            </Typography>
          )}
        </Box>
      </Container>
      {roleUser === "USER" && <UserFooter />}
      {roleUser === "DRIVER" && <Footer />}
    </div>
  );
}
