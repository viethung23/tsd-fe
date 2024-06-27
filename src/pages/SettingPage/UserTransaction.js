import React, { useEffect, useState } from "react";
import UserHeader from "../UserPage/UserHeader";
import {
  Container,
  Typography,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import UserFooter from "../UserPage/UserFooter";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import wallet from "../images/wallet.png";
import axios from "axios";
import Footer from "../Footer/Footer";

export default function UserTransaction() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const { token } = useAuth();
  const roleUser = localStorage.getItem("roleUser");
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Lấy số dư từ API
    axios
      .get(
        `https://tsdlinuxserverapi.azurewebsites.net/api/Wallet/GetWalletByUserId?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setBalance(response.data.balance))
      .catch((error) => console.error("Lỗi khi lấy số dư từ API", error));

    // Lấy lịch sử giao dịch từ API
    axios
      .get(
        `https://tsdlinuxserverapi.azurewebsites.net/api/Transaction/GetAllTransactionsByUserId?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => setTransactions(response.data))
      .catch((error) =>
        console.error("Lỗi khi lấy lịch sử giao dịch từ API", error)
      );
  }, [token]);

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
          <Typography variant="h6" gutterBottom>
            Số dư tài khoản:{" "}
            <span style={{ fontWeight: "bold" }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(balance)}{" "}
            </span>
          </Typography>

          <Typography
            style={{ color: "#f37022", textAlign: "start" }}
            variant="h6"
            gutterBottom
          >
            Lịch sử giao dịch
          </Typography>

          {transactions.length === 0 ? (
            <div className="mt-4" style={{ color: "red", textAlign: "center" }}>
              <img
                className="mb-3"
                style={{ width: "90px" }}
                src={wallet}
                alt="wallet"
              />
              <p>Bạn chưa có giao dịch nào</p>
            </div>
          ) : (
            <List>
              {transactions.map((transaction) => (
                <ListItem key={transaction.id}>
                  <ListItemAvatar>
                    <Avatar
                      style={{
                        backgroundColor:
                          transaction.transactionType === 0 ? "green" : "red",
                      }}
                    >
                      {transaction.transactionType === 0 ? "+" : "-"}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={transaction.description}
                    secondary={
                      <div
                        className="mt-2"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          {format(
                            new Date(transaction.creationDate),
                            "HH:mm dd/MM/yyyy"
                          )}
                        </div>
                        <div className="fw-bold">
                          {transaction.transactionType === 0 ? "+" : "-"}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(transaction.price)}{" "}
                        </div>
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Container>
      {roleUser === "USER" && <UserFooter />}
      {roleUser === "DRIVER" && <Footer />}
    </div>
  );
}
