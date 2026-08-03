import React from "react";
import { NavLink } from "react-router";
import logo from "../assets/tsitools.png";
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar-wrapper">
      <div className="navbar-content">
        {/* Logo и ещё Title */}
        <NavLink to="/" className="nav-logo">
          <img src={logo} alt="TSI Tools" />
          <div>
            <h1>TSITools</h1>
            <p>For students - by a student</p>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <div className="nav-links">
          <p>
            <NavLink to="/" className="navbarLink">
              Главная
            </NavLink>
          </p>
          <p>
            <NavLink to="/gpa" className="navbarLink">
              Калькулятор GPA
            </NavLink>
          </p>
          <p>
            <NavLink to="/teamdiv" className="navbarLink">
              Команды
            </NavLink>
          </p>
          <p>
            <NavLink to="/qrgen" className="navbarLink">
              Генератор QR
            </NavLink>
          </p>
          <p>
            <NavLink to="/excusegen" className="navbarLink">
              Генератор объяснительных
            </NavLink>
          </p>
          <p>
            <NavLink to="/wordcounter" className="navbarLink">
              Счётчик слов
            </NavLink>
          </p>
          <p>
            <NavLink to="/affirmations" className="navbarLink">
              Аффирмации
            </NavLink>
          </p>
        </div>

        {/* Mobile Home Icon */}
        <NavLink to="/" id="navMenu">
          <i className="bi bi-house-door-fill"></i>
        </NavLink>
      </div>
    </div>
  );
}
