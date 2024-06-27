import React from "react";
import myImage from "../images/logoExe.png";
import "../Header/Header.css";

export default function Header({ title }) {
  return (
    <div className="header">
      <div className="header__content d-flex justify-content-between">
        <div>
          <img src={myImage} alt="" className="header__logo" />
        </div>
        <div>
          <h4 className="header__title">{title}</h4>
        </div>
      </div>
    </div>
  );
}
