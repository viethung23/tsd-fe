import React, { useState } from "react";
import myImage from "../images/logoExe.png";
import "../UserPage/UserHeader.css";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function ResetPassword(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const resetTokenParam = searchParams.get("code").replace(/ /g, "+");
  const resetToken = decodeURIComponent(resetTokenParam);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const handleResetPassword = () => {
    if (isButtonDisabled) {
      return; // Nếu nút đã bị tắt, không thực hiện gì cả
    }

    if (!password || !confirmPassword) {
      toast.error("Vui lòng điền cả hai mật khẩu.");
      return;
    }

    setIsButtonDisabled(true); // Tắt nút

    // Make an API call to reset the password here
    const apiUrl =
      "https://tsdlinuxserverapi.azurewebsites.net/api/User/ResetPassword";
    const requestData = {
      code: resetToken,
      password,
      confirmPassword,
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          // Password reset was successful
          toast.success("Thay đổi mật khẩu thành công");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          // Password reset failed
          response.json().then((data) => {
            toast.error(data.errors[0]);
          });
        }
      })
      .catch((error) => {
        console.error("API error:", error);
        toast.error("An error occurred. Please try again later.");
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
        <Typography variant="h5">Đặt mật khẩu mới</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          Nhập & xác thực mật khẩu mới của bạn bên dưới:
        </Typography>
      </Grid>
      <Grid item>
        <TextField
          type="password"
          label="Mật khẩu mới"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          type="password"
          label="Xác thực mật khẩu mới"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
