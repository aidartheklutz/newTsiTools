import { NavLink } from "react-router";

export function CalculatorBackLink() {
  return (
    <NavLink
      to="/gpa"
      className="calculator-back-button"
      aria-label="Назад к выбору калькулятора"
    >
      <i className="bi bi-caret-left-fill" aria-hidden="true" />
      Назад
    </NavLink>
  );
}
