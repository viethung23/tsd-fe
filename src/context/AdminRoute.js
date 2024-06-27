import React from "react";
import { Navigate } from "react-router-dom";

const AdminRouteGuard = ({ element }) => {
  // Check if roleName is ADMIN and token is not null
  const roleName = localStorage.getItem("roleName");
  const token = localStorage.getItem("token");

  if (roleName === "ADMIN" && token) {
    return element; // Render the protected element
  } else {
    return <Navigate to="/error" />; // Redirect to the error page
  }
};

export default AdminRouteGuard;
