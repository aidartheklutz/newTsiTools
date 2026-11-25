import React from "react";
import NavBar from "../../components/NavBar";
import { NavLink } from "react-router";
import { secondYearMajors } from "./secondYearFallData";
import "./GpaCalc.css";

function GpaCalc() {
  return (
    <>
      <meta name="description" content="Калькулятор GPA"></meta>
      <NavBar />
      <div className="content">
        <div className="gpa-choice-page">
          <h1>Калькулятор GPA</h1>
          <p>Выберите свой курс и направление.</p>

          <div className="freshmen-choice">
            <NavLink to="/gpa/freshmen" className="button-link">
              Первокурсники
            </NavLink>
          </div>

          <div className="major-choice-grid">
            {secondYearMajors.map((major) => (
              <section className="major-choice" key={major.slug}>
                <h2>{major.label}</h2>
                <div className="major-choice-buttons">
                  <NavLink to={`/gpa/${major.slug}/2`} className="button-link">
                    Второй курс
                  </NavLink>
                  <NavLink to={`/gpa/${major.slug}/3`} className="button-link">
                    Третий курс
                  </NavLink>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default GpaCalc;
