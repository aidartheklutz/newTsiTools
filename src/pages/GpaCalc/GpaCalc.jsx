import React from "react";
import NavBar from "../../components/NavBar";
import { NavLink } from "react-router";

function GpaCalc(props) {
  return (
    <>
      <NavBar />
      <div className="content">
        <h1>
          По синей кнопке ниже доступен калькулятор для первокурсников. Позже
          будут добавлены и другие курсы.
        </h1>
        <NavLink to="/gpa/freshmen" className="button-link">
          Первокурсники
        </NavLink>
      </div>
    </>
  );
}

export default GpaCalc;
