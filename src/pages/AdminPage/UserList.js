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
import {
  Container,
  Grid,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { Button, Modal, Backdrop, Fade } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "20px",
  width: 800, // Adjust the width as needed
  bgcolor: "background.paper", // Use a theme color if available
  border: "2px solid #F37022", // Adjust border properties as needed
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Adjust shadow properties as needed
  p: 4, // Adjust padding as needed
};

export default function UserList() {
  const { token } = useAuth();
  const [userData, setUserData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [vehicleData, setVehicleData] = useState({}); // Thêm state để lưu trữ thông tin chi tiết xe
  const [newVehicleData, setNewVehicleData] = useState({
    NameVehicle: "",
    Description: "",
    VehicleLoad: "",
    LicensePlate: "",
    VehicleTypeId: "",
    UserId: "",
  });
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [openAddVehicleModal, setOpenAddVehicleModal] = useState(false);

  useEffect(() => {
    fetchData();

    fetchVehicleTypes(); // Call fetchData function when the component mounts
  }, [token]);

  // Define the fetchData function to fetch user data
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://tsdlinuxserverapi.azurewebsites.net/api/User/GetAllUsers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      let apiUrl;
      if (newStatus === "Active") {
        apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/User/ActiveUser?userId=${userId}`;
      } else {
        apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/User/DisableUser?userId=${userId}`;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the user's status in the local state
        setUserData((prevUserData) =>
          prevUserData.map((user) =>
            user.id === userId ? { ...user, isDelete: !user.isDelete } : user
          )
        );
        toast.success("Cập nhật thành công!");
      } else {
        console.error("Failed to update user status");
        toast.error("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Lỗi khi update!");
    }
  };

  // Hàm này được gọi khi bạn nhấp vào nút "Chi tiết xe"
  const handleOpenModal = async (userId) => {
    try {
      const response = await fetch(
        `https://tsdlinuxserverapi.azurewebsites.net/api/Vehicle/GetVehicleByIdDriver?idDriver=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setVehicleData(data);
        setOpenModal(true); // Mở Modal khi có dữ liệu chi tiết xe
      } else {
        console.error("Failed to fetch vehicle data");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchVehicleTypes = async () => {
    try {
      const response = await fetch(
        "https://tsdlinuxserverapi.azurewebsites.net/api/VehicleType/GetAllVehicleType",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVehicleTypes(data);
      } else {
        console.error("Failed to fetch vehicle types");
      }
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };
  const handleOpenAddVehicleModal = (userId) => {
    setNewVehicleData({
      ...newVehicleData,
      UserId: userId,
    });
    setOpenAddVehicleModal(true);
  };
  const handleCloseAddVehicleModal = () => {
    setOpenAddVehicleModal(false);
    // Đặt lại thông tin xe về trạng thái ban đầu
    setNewVehicleData({
      NameVehicle: "",
      Description: "",
      VehicleLoad: "",
      LicensePlate: "",
      VehicleTypeId: "",
      UserId: "",
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicleData({
      ...newVehicleData,
      [name]: value,
    });
  };
  const handleSubmitAddVehicle = async (e) => {
    e.preventDefault();

    try {
      const {
        NameVehicle,
        Description,
        VehicleLoad,
        LicensePlate,
        VehicleTypeId,
        UserId,
      } = newVehicleData;

      const apiUrl = `https://tsdlinuxserverapi.azurewebsites.net/api/Vehicle/CreateVehicle?NameVehicle=${NameVehicle}&Description=${Description}&VehicleLoad=${VehicleLoad}&LicensePlate=${LicensePlate}&VehicleTypeId=${VehicleTypeId}&UserId=${UserId}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Đóng Modal sau khi thêm xe thành công
        handleCloseAddVehicleModal();
        toast.success("Đăng ký xe thành công!");
        // Cập nhật danh sách người dùng sau khi thêm xe
        fetchData();
      } else {
        toast.error("Đăng ký xe thất bại!");
        console.error("Failed to add vehicle");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Vui lòng thử lại!");
    }
  };

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
          <h4>Danh sách người dùng</h4>{" "}
          <TableContainer
            component={Paper}
            className="mt-4"
            sx={{ borderRadius: "15px" }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#F37022" }}>
                <TableRow>
                  <TableCell className="fw-bold text-white">
                    Tên người dùng
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Email
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Số điện thoại
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Vai trò
                  </TableCell>
                  <TableCell className="fw-bold text-white" align="center">
                    Trạng thái
                  </TableCell>
                  <TableCell className="fw-bold" align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData
                  .filter((user) => user.roleName !== "ADMIN")
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="fw-bold">{user.fullName}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.phoneNumber}</TableCell>
                      <TableCell align="center">
                        {user.roleName === "USER"
                          ? "Chủ hàng"
                          : user.roleName === "DRIVER"
                          ? "Chủ xe"
                          : user.roleName}
                      </TableCell>

                      <TableCell align="center">
                        <Select
                          sx={{
                            height: "40px",
                            width: "130px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#F37022",
                              borderRadius: "15px",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#F37022",
                            },
                            "&:focus .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#F37022",
                            },
                          }}
                          value={user.isDelete ? "Inactive" : "Active"}
                          onChange={(e) =>
                            handleStatusChange(user.id, e.target.value)
                          }
                        >
                          <MenuItem value="Active">Hoạt động</MenuItem>
                          <MenuItem value="Inactive">Khóa</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        {user.roleName === "DRIVER" ? (
                          user.vehicleDto ? (
                            <Button
                              style={{
                                backgroundColor: "#F37022",
                                borderRadius: "12px",
                                color: "white",
                                borderColor: "#F37022",
                              }}
                              onClick={() => handleOpenModal(user.id)}
                            >
                              Chi tiết xe
                            </Button>
                          ) : (
                            <>
                              <Button
                                style={{
                                  backgroundColor: "#F37022",
                                  borderRadius: "12px",
                                  color: "white",
                                  borderColor: "#F37022",
                                  marginRight: "10px",
                                }}
                                onClick={() =>
                                  handleOpenAddVehicleModal(user.id)
                                } // Gọi hàm để mở Modal "Thêm xe"
                              >
                                Đăng ký xe
                              </Button>
                            </>
                          )
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Grid>
      {/* Modal for Vehicle Details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h2 id="vehicle-modal-title">{vehicleData.nameVehicle}</h2>
            <p id="vehicle-modal-description">
              Loại xe: {vehicleData.vehicleTypeDto?.vehicleTypeName}
            </p>
            <p>Biển số xe: {vehicleData.licensePlate}</p>
            <p>Chi tiết: {vehicleData.description}</p>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openAddVehicleModal}
        onClose={handleCloseAddVehicleModal}
        aria-labelledby="modal-add-vehicle-title"
        aria-describedby="modal-add-vehicle-description"
      >
        <Box sx={style}>
          <div>
            <h2 id="modal-add-vehicle-title">Đăng ký xe</h2>
            <form onSubmit={handleSubmitAddVehicle}>
              <div>
                <TextField
                  className="mb-2"
                  id="NameVehicle"
                  name="NameVehicle"
                  label="Tên xe"
                  variant="outlined"
                  fullWidth
                  value={newVehicleData.NameVehicle}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  className="mb-2"
                  id="Description"
                  name="Description"
                  label="Chi tiết"
                  variant="outlined"
                  fullWidth
                  value={newVehicleData.Description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  className="mb-2"
                  id="VehicleLoad"
                  name="VehicleLoad"
                  label="Khối lượng xe"
                  variant="outlined"
                  fullWidth
                  value={newVehicleData.VehicleLoad}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  className="mb-2"
                  id="LicensePlate"
                  name="LicensePlate"
                  label="Biển số xe"
                  variant="outlined"
                  fullWidth
                  value={newVehicleData.LicensePlate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <TextField
                  className="mb-2"
                  id="VehicleTypeId"
                  name="VehicleTypeId"
                  label="Loại xe"
                  variant="outlined"
                  fullWidth
                  select
                  value={newVehicleData.VehicleTypeId}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Chọn loại xe</MenuItem>
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.vehicleTypeName}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <Button
                style={{
                  width: "95px",
                  backgroundColor: "#F37022",
                  borderRadius: "12px",
                  color: "white",
                  borderColor: "#F37022",
                  marginRight: "10px",
                }}
                type="submit"
              >
                Thêm xe
              </Button>
            </form>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </Grid>
  );
}
