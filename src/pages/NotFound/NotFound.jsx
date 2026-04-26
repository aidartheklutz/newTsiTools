import React from "react";
import NavBar from "../../components/NavBar";
import { NavLink } from "react-router";
import roadSign from "../../assets/ducks_ahead.png";
import "./NotFound.css";

function NotFound(props) {
  return (
    <>
      <NavBar />
      <div className="content">
        <div className="center-0">
          <h1>СТРАНИЦА ЕЩЁ НЕ ГОТОВА</h1>
          <NavLink to="/" className="button-link">
            Вернуться домой
          </NavLink>
          <img src={roadSign} className="sign" />
        </div>
      </div>
    </>
  );
}

export default NotFound;
