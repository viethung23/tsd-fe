import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import myImage from "../images/logoExe.png";
import "../SignUpPage/SignUp.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleId: "1cb47d53-a12c-4fd6-a4cc-08dba3d1f4f1",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
    if (formData.fullName.trim() === "") {
      setError("Vui lòng nhập tên người dùng.");
      return;
    }

    if (formData.email.trim() === "") {
      setError("Vui lòng nhập email.");
      return;
    }

    if (formData.phoneNumber.trim() === "") {
      setError("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      setError("Tên người dùng chỉ được chứa chữ cái.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email không hợp lệ.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError("Số điện thoại phải gồm 10 số.");
      return;
    }

    try {
      const response = await fetch(
        "https://tsdlinuxserverapi.azurewebsites.net/api/User/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Đăng ký thành công!");

        setTimeout(() => {
          // Sau khi thông báo biến mất, chuyển hướng đến trang /login
          navigate("/login");
        }, 3000); // Thời gian chờ trước khi chuyển hướng (ở đây là 3 giây)

        setError("");
        setSuccessMessage("Đăng ký thành công");
      } else {
        toast.error("Đăng ký thất bại");
        setError("Đăng ký thất bại");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Lỗi kết nối đến API", error);
      setError("Lỗi kết nối đến API");
      setSuccessMessage("");
    }
  };

  return (
    <div className="page__signUp">
      <div>
        <img src={myImage} alt="" className="logo" />
      </div>
      <div>
        <input
          className="name"
          type="text"
          placeholder="Tên người dùng"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <input
          className="email"
          type="text"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <input
          className="password"
          type="password"
          placeholder="Mật khẩu"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <input
          className="phone"
          type="text"
          placeholder="Số điện thoại"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <select
          name="roleId"
          id="roleId"
          className="select__signUp"
          value={formData.roleId}
          onChange={handleInputChange}
        >
          <option value="1cb47d53-a12c-4fd6-a4cc-08dba3d1f4f1">Chủ xe</option>
          <option value="0170ca46-f56b-4575-a4cb-08dba3d1f4f1">Chủ hàng</option>
        </select>
      </div>
      <div>
        {error && <div className="error-message text-danger mt-1">{error}</div>}
        {/* {successMessage && (
          <div className="success-message text-success mt-1">
            {successMessage}
          </div>
        )} */}
      </div>
      <div>
        <button className="signUp" onClick={handleSignUp}>
          Đăng Ký
        </button>
      </div>
      <ToastContainer /> {/* Hiển thị ToastContainer để render thông báo */}
    </div>
  );
}
