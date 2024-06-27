import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../LoginPage/Login.css";

import myImage from "../images/logoExe.png";
import { Box, Container } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AdminLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://tsdlinuxserverapi.azurewebsites.net/api/User/Login",
        {
          phoneNumber: username,
          password: password, // Sử dụng password từ state
          roleId: "eebc82eb-8893-43a7-a4ca-08dba3d1f4f1",
        }
      );

      if (response.status === 200) {
        const data = response.data;
        const userId = data.id; // Assuming the API response has an "id" field for the user ID
        const roleName = data.roleName;
        // Save the user ID in localStorage
        localStorage.setItem("userId", userId);
        localStorage.setItem("roleName", roleName);
        login(data.token);
        navigate("/admin/dashboard");
      } else {
        if (response.status === 400) {
          // Thay đổi thông báo lỗi bằng react-toastify
          toast.error("Số điện thoại hoặc mật khẩu không chính xác");
        } else {
          toast.error("Đã xảy ra lỗi khi đăng nhập");
        }
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi cho người dùng
    }
  };

  return (
    <Container>
      <form className="login-form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img className="logo" src={myImage} alt="Logo" />
          <TextField
            label="Admin"
            variant="outlined"
            sx={{ width: 600 }}
            margin="normal"
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            sx={{ width: 600 }}
            margin="normal"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: "15px",
              width: 600,
              height: 40, // Đặt chiều cao
              backgroundColor: "#F37022",
              "&:hover": {
                backgroundColor: "#F55f07", // Đặt màu sắc khi hover
              }, // Đặt màu sắc
            }}
          >
            Đăng nhập
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default AdminLoginForm;
