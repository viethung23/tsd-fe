import React, { useState } from "react";
import myImage from "../images/logoExe.png";
import "../UserPage/UserHeader.css";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ForgetPassword() {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const clientHost = `${protocol}//${host}`;

  const [email, setEmail] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Thêm state để kiểm soát tình trạng nút

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = () => {
    if (isButtonDisabled) {
      return; // Nếu nút đã bị tắt, không thực hiện gì cả
    }

    setIsButtonDisabled(true); // Tắt nút

    const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/User/ForgotPassword?email=${email}`;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "X-Client-Host": clientHost,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Vui lòng kiểm tra email để lấy lại mật khẩu");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          response.json().then((data) => {
            if (data.statusCode === 400) {
              toast.error(data.errors[0]);
            } else if (data.errors && data.errors.email) {
              toast.error(data.errors.email[0]);
            } else {
              toast.error("Đã xảy ra lỗi khi gọi API");
            }
          });
        }
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi gọi API");
        console.error("Error:", error);
      })
      .finally(() => {
        setIsButtonDisabled(false); // Bật nút trở lại sau khi xử lý xong
      });
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      spacing={2}
      sx={{ padding: 2 }}
    >
      <Grid item>
        <img src={myImage} alt="Logo" width="100" height="100" />
      </Grid>
      <Grid item>
        <Typography variant="h5">Đặt lại mật khẩu</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Nhập email để đặt lại mật khẩu của bạn:
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          type="email"
          label="Nhập email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          fullWidth
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#F37022" }}
          startIcon={<Send />}
          onClick={handleResetPassword}
          disabled={isButtonDisabled} // Tắt nút nếu isButtonDisabled là true
        >
          Xác nhận
        </Button>
      </Grid>
      <ToastContainer />
    </Grid>
  );
}
