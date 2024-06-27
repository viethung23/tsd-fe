import React from "react";
import myImage from "../images/logoExe.png";
import "../UserPage/UserHeader.css";

export default function UserHeader({ title }) {
  return (
    <div className="user__header__bg mb-3">
      <div className="user__header container">
        <img src={myImage} alt="" className="user__header__logo" />
        <h4>{title}</h4>
      </div>
    </div>
  );
}
