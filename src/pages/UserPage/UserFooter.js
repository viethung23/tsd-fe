import React from "react";
import "../Footer/Footer.css";
import { Link } from "react-router-dom";

export default function UserFooter() {
  return (
    <div className="footer">
      <div className="footer__content">
        <Link to="/user">
          <button>
            <i className="fa-solid fa-house" />
          </button>
        </Link>
        <Link to="/userhistory">
          <button>
            <i class="fa-solid fa-clock-rotate-left"></i>
          </button>
        </Link>
        <Link to="/create">
          <button className="search">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
        </Link>
        <Link to="/userreservation">
          <button>
            <i class="fa-solid fa-location-arrow"></i>
          </button>
        </Link>
        <Link to="/settings">
          <button>
            <i className="fa-solid fa-gear" />
          </button>
        </Link>
      </div>
    </div>
  );
}
