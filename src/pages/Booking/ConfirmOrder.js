import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import confirmImg from "../images/confirm.png";
import UserHeader from "../UserPage/UserHeader";
import UserFooter from "../UserPage/UserFooter";

const confirmText = {
  fontSize: "24px", // Kích thước chữ
  fontWeight: "bold", // Độ đậm
  color: "#F37022", // Màu chữ
};

const ConfirmOrder = () => {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const handleConfirm = async () => {
    try {
      // Gọi API xác nhận thanh toán thành công
      const response = await fetch(
        `https://tsdlinuxserverapi.azurewebsites.net/api/payment/zalopay-handle-return?orderId=${id}`
      );

      if (response.ok) {
        // Xác nhận thành công, chuyển hướng đến trang thành công
        navigate("/order-success");
      } else {
        // Xác nhận thất bại, chuyển hướng đến trang thất bại
        navigate("/payment-failed");
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận thanh toán: ", error);
      // Xác nhận thất bại, chuyển hướng đến trang thất bại
      navigate("/payment-failed");
    }
  };

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
        <img style={{ width: "90px" }} src={confirmImg} alt="Error" />
        <Typography
          className="mt-3"
          variant="h4"
          gutterBottom
          style={confirmText}
        >
          Xác nhận hoàn tất thanh toán
        </Typography>
        <div>
          {" "}
          <Button
            className="mx-2"
            variant="contained"
            color="success"
            onClick={() => handleConfirm()}
          >
            Có
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate("/payment-failed")}
          >
            Không
          </Button>
        </div>
      </Container>
      <UserFooter />
    </div>
  );
};

export default ConfirmOrder;
