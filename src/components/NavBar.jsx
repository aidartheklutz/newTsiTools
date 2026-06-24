import React from "react";
import { NavLink } from "react-router";
import logo from "../assets/tsitools.png";
import { toggleDropdownMenu } from "./dropdown"; // i am reusing it  from aidartheklutz.github.io :)
import "./NavBar.css";

export default function NavBar() {
  return (
    <div className="navbar-wrapper">
      <div className="navbar-content">
        {/* Logo и ещё Title */}
        <NavLink to="/" className="nav-logo">
          <img src={logo} alt="TSI Tools" />
          <div>
            <h1>TSI Tools</h1>
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

        {/* Mobile Hamburger */}
        <p id="navMenu" onClick={toggleDropdownMenu}>
          <i className="bi bi-list"></i>
        </p>
      </div>

      {/* Dropdown Menu */}
      <div className="dropdownMenuWrapper">
        <div id="dropdownMenu" className="hide">
          <p>
            <NavLink to="/" className="navbarLinkDD">
              Главная
            </NavLink>
          </p>
          <p>
            <NavLink to="/gpa" className="navbarLinkDD">
              Калькулятор GPA
            </NavLink>
          </p>
          <p>
            <NavLink to="/teamdiv" className="navbarLinkDD">
              Делитель на команды
            </NavLink>
          </p>
          <p>
            <NavLink to="/qrgen" className="navbarLinkDD">
              Генератор QR
            </NavLink>
          </p>
          <p>
            <NavLink to="/excusegen" className="navbarLinkDD">
              Генератор объяснительных
            </NavLink>
          </p>
          <p>
            <NavLink to="/wordcounter" className="navbarLinkDD">
              Счётчик слов
            </NavLink>
          </p>
          <p>
            <NavLink to="/affirmations" className="navbarLinkDD">
              Аффирмации
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
