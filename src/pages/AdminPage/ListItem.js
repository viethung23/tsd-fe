import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  AccountCircle,
  Description,
  AccountBalanceWallet,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";

export default function AdminListItem() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login"); // Chuyển hướng sau khi logout
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <List>
        <ListItem button component={Link} to="/admin/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/admin/userlist">
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Quản lý người dùng" />
        </ListItem>
        <ListItem button component={Link} to="/admin/orderlist">
          <ListItemIcon>
            <Description />
          </ListItemIcon>
          <ListItemText primary="Quản lý đơn hàng" />
        </ListItem>
        <ListItem button component={Link} to="/admin/transaction">
          <ListItemIcon>
            <AccountBalanceWallet />
          </ListItemIcon>
          <ListItemText primary="Quản lý giao dịch" />
        </ListItem>
      </List>
      <div style={{ marginTop: "auto" }}>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </div>
    </div>
  );
}
