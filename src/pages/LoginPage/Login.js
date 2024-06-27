import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import myImage from "../images/logoExe.png";
import "../LoginPage/Login.css";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("1cb47d53-a12c-4fd6-a4cc-08dba3d1f4f1");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://tsdlinuxserverapi.azurewebsites.net/api/User/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber,
            password,
            roleId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const userId = data.id;
        console.log("userId: ", userId);
        const roleUser = data.roleName;
        localStorage.setItem("userId", userId);
        localStorage.setItem("roleUser", roleUser);
        login(data.token);
        navigate(`/${data.roleName.toLowerCase()}`);
      } else {
        if (response.status === 400) {
          // Thử lấy thông báo lỗi từ Response JSON (nếu có)
          const errorResponse = await response.json();
          if (errorResponse.errors && errorResponse.errors.length > 0) {
            const errorMessage = errorResponse.errors[0];
            console.log(errorMessage);
            toast.error(errorMessage);
          } else {
            toast.error("Số điện thoại hoặc mật khẩu không chính xác");
          }
        } else {
          toast.error("Đã xảy ra lỗi khi đăng nhập");
        }
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đăng nhập");
    }
  };

  return (
    <div className="page">
      <div>
        <img src={myImage} alt="" className="logo" />
      </div>
      <div>
        <input
          className="phone__login"
          type="text"
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <input
          className="password__login"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <select
          name=""
          id=""
          className="select__login"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="1cb47d53-a12c-4fd6-a4cc-08dba3d1f4f1">Chủ xe</option>
          <option value="0170ca46-f56b-4575-a4cb-08dba3d1f4f1">Chủ hàng</option>
        </select>
      </div>
      <div className="forgotPass">
        <Link to="/forget-password" className="forgotPassLink">
          Quên mật khẩu?
        </Link>
      </div>
      <div>
        <button className="login" onClick={handleLogin}>
          Đăng nhập
        </button>
      </div>
      <div className="register">
        <Link to="/signUp" className="forgotPassLink">
          Đăng ký
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}
