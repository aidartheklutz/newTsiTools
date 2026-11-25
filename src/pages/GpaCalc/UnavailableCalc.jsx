import { NavLink } from "react-router";
import NavBar from "../../components/NavBar";
import roadSign from "../../assets/ducks_ahead.png";
import "../NotFound/NotFound.css";

export function UnavailableCalc() {
  return (
    <>
      <meta name="description" content="Калькулятор GPA ещё не готов" />
      <NavBar />
      <div className="content">
        <div className="center-0">
          <h1>Калькулятор для вашей группы не закончен. Попробуйте открыть его позже.</h1>
          <NavLink to="/gpa" className="button-link">
            Вернуться к выбору группы
          </NavLink>
          <img src={roadSign} className="sign" alt="Дорожный знак с утками" />
        </div>
      </div>
    </>
  );
}

