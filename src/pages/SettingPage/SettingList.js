import React from "react";
import UserHeader from "../UserPage/UserHeader";
import Footer from "../Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Person,
  DirectionsCar,
  AccountBalanceWallet,
  Description,
} from "@mui/icons-material";

import UserFooter from "../UserPage/UserFooter";
import { useAuth } from "../../context/AuthContext";

export default function SettingList() {
  const { token } = useAuth();

  // Lấy roleUser từ localStorage
  const roleUser = localStorage.getItem("roleUser");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Chuyển hướng sau khi logout
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ flex: 1 }}>
        {" "}
        <UserHeader />
        <List>
          <ListItem button component={Link} to="/userinfo">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Thông tin cá nhân" />
          </ListItem>

          {roleUser === "USER" && (
            <ListItem button component={Link} to="/info">
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText primary="Thông tin doanh nghiệp" />
            </ListItem>
          )}

          {roleUser === "DRIVER" && (
            <ListItem button component={Link} to="/vehicleinfo">
              <ListItemIcon>
                <DirectionsCar />
              </ListItemIcon>
              <ListItemText primary="Thông tin xe" />
            </ListItem>
          )}

          <ListItem button component={Link} to="/transaction">
            <ListItemIcon>
              <AccountBalanceWallet />
            </ListItemIcon>
            <ListItemText primary="Lịch sử giao dịch" />
          </ListItem>
        </List>
      </div>
      <div className="footer">
        {roleUser === "USER" && <UserFooter />}
        {roleUser === "DRIVER" && <Footer />}
      </div>

      <div style={{ textAlign: "center" }}>
        <Button
          onClick={handleLogout}
          className="mb-3"
          style={{
            borderRadius: "12px",
            backgroundColor: "#F37022",
            height: "50px",
            width: "80%",
            color: "white",
            margin: "20px auto", // Thêm margin để căn chỉnh nút đăng xuất
          }}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
