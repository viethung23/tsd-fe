import * as React from "react";
import { useState, useEffect } from "react";
import format from "date-fns/format";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AdminListItem from "./ListItem";
import { Container, Grid, Select, MenuItem } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function OrderList() {
  const { token } = useAuth();
  const [orderData, setOrderData] = useState([]);

  // Define status mapping
  const statusMapping = {
    AwaitingPayment: { label: "Chờ thanh toán", color: "#FFFF00" },
    AwaitingDriver: { label: "Chờ tài xế", color: "#FFFF00" },
    Cancelled: { label: "Đã hủy", color: "red" },
    Completed: { label: "Hoàn thành", color: "green" },
    OnTheWayToPickupPoint: { label: "Đang tới điểm đặt", color: "#FFFF00" },
    InDelivery: { label: "Đang vận chuyển", color: "#808080" },
  };

  useEffect(() => {
    // Fetch data from the API with the Bearer token
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tsdlinuxserverapi.azurewebsites.net/api/Reservation/GetAllReservation",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOrderData(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Grid container sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Grid
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          borderTopRightRadius: "20px",
          borderBottomRightRadius: "20px",
          border: "1px solid #F37022",
        }}
        item
        xs={2}
      >
        <AdminListItem />
      </Grid>
      {/* Main Content */}
      <Grid item xs={10}>
        <Container className="my-4">
          <h4>Danh sách đơn hàng</h4>{" "}
          <TableContainer
            component={Paper}
            className="mt-4"
            sx={{ borderRadius: "15px" }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#F37022" }}>
                <TableRow>
                  <TableCell className="fw-bold text-white" align="center">
                    Mã đơn hàng
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Người đặt hàng
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Số điện thoại
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Thời gian
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Hàng hóa
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Trạng thái
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Thành tiền
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="fw-bold" align="center">
                      <Link
                        style={{ color: "black", textDecoration: "none" }}
                        to={`/admin/orderdetail/${order.id}`}
                      >
                        {order.code}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      {order.senderDto.fullName}
                    </TableCell>
                    <TableCell align="center">{order.recipientPhone}</TableCell>
                    <TableCell align="center">
                      {format(
                        new Date(order.pickUpDateTime),
                        "HH:mm, dd/MM/yyyy"
                      )}
                    </TableCell>
                    <TableCell align="center">{order.goodsDto.name}</TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          color: statusMapping[order.reservationStatus].color,
                        }}
                      >
                        {statusMapping[order.reservationStatus].label}
                      </span>
                    </TableCell>
                    <TableCell align="center" className="fw-bold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.totallPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Grid>
    </Grid>
  );
}
