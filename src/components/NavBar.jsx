import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { mainPages } from "../assets/pageList";
import logo from "../assets/tsitools.png";
import "./NavBar.css";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="navbar-wrapper">
      <div className="navbar-content">
        <NavLink to="/" className="nav-logo" onClick={closeMenu}>
          <img src={logo} alt="TSI Tools" />
          <div>
            <h1>TSITools</h1>
            <p>For students - by a student</p>
          </div>
        </NavLink>

        <div className="nav-menu" ref={menuRef}>
          <button
            type="button"
            className="nav-menu-button"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню инструментов"}
            aria-expanded={isMenuOpen}
            aria-controls="tools-menu"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <span>Инструменты</span>
            <i
              className={`bi ${isMenuOpen ? "bi-x-lg" : "bi-list"}`}
              aria-hidden="true"
            ></i>
          </button>

          {isMenuOpen && (
            <div className="nav-menu-panel" id="tools-menu">
              <div className="nav-menu-heading">
                <span>Все инструменты</span>
              </div>

              <nav className="nav-menu-grid" aria-label="Инструменты сайта">
                {mainPages.map((page) => (
                  <NavLink
                    key={page.id}
                    to={`/${page.path}`}
                    className={({ isActive }) =>
                      `nav-menu-link${isActive ? " active" : ""}`
                    }
                    onClick={closeMenu}
                  >
                    <span className="nav-menu-icon" aria-hidden="true">
                      {page.icon}
                    </span>
                    <span>{page.title}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="nav-menu-footer">
                <NavLink to="/" onClick={closeMenu}>
                  Главная
                </NavLink>
                <NavLink to="/about" onClick={closeMenu}>
                  О проекте
                </NavLink>
              </div>
            </div>
          )}
        </div>

        <NavLink
          to="/"
          className="nav-mobile-home"
          aria-label="Главная"
          onClick={closeMenu}
        >
          <i className="bi bi-house-fill" aria-hidden="true"></i>
        </NavLink>
      </div>
    </div>
  );
}
