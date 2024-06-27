import * as React from "react";
import { useState, useEffect } from "react";
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
import { format } from "date-fns";

export default function TransactionList() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Fetch data from the API with the Bearer token
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://tsdlinuxserverapi.azurewebsites.net/api/Transaction/GetAllTransactionsByUserId?userId=${localStorage.getItem(
            "userId"
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch balance from another API
    const fetchBalance = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const balanceResponse = await fetch(
          `https://tsdlinuxserverapi.azurewebsites.net/api/Wallet/GetWalletByUserId?userId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setBalance(balanceData.balance);
        } else {
          console.error("Failed to fetch balance");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchData();
    fetchBalance();
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
            }}
          >
            <h4>Chi tiết giao dịch</h4>
            <h5>
              Số dư:{" "}
              {balance !== null
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(balance)
                : "Đang tải..."}
            </h5>
          </div>
          <TableContainer
            component={Paper}
            className="mt-4"
            sx={{ borderRadius: "15px" }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#F37022" }}>
                <TableRow>
                  <TableCell className="fw-bold text-white" align="center">
                    Thời gian
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Nội dung
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Phương thức thanh toán
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
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell align="center" className="fw-bold">
                      {format(
                        new Date(transaction.creationDate),
                        "HH:mm dd/MM/yyyy"
                      )}
                    </TableCell>
                    <TableCell align="center" style={{ maxWidth: "550px" }}>
                      {transaction.description}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.paymentMethod}
                    </TableCell>
                    <TableCell
                      align="center"
                      className={
                        transaction.status === "success"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {transaction.status === "success"
                        ? "Thành công"
                        : "Thất bại"}
                    </TableCell>

                    <TableCell align="center" className="fw-bold">
                      {`${
                        transaction.transactionType === 0 ? "+" : "-"
                      } ${new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(transaction.price)}`}
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
