import { useState, useEffect } from "react";
import "./CalcTables.css";
import NavBar from "../../components/NavBar";
import { CalculatorBackLink } from "./CalculatorBackLink";
import {
  FRESHMEN_GPA_STORAGE_KEY,
  freshmenFallSubjects,
  freshmenSpringSubjects,
  freshmenSubjects,
} from "./freshmenGpaData";

const gradeMap = {
  A: 4,
  "A-": 3.67,
  "B+": 3.33,
  B: 3,
  "B-": 2.67,
  "C+": 2.33,
  C: 2,
  "C-": 1.67,
  "D+": 1.33,
  D: 1,
  "D-": 0.67,
  F: 0,
};

const gradeOptions = Object.keys(gradeMap);

const initialGrades = freshmenSubjects.reduce((acc, subj) => {
  acc[subj.name] = "A";
  return acc;
}, {});

function GPAField({ value }) {
  return <div className="gpa-output">GPA: {value.toFixed(2)}</div>;
}

export function FreshmenCalc() {
  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem(FRESHMEN_GPA_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Проверка правильности сохр оценок
        return freshmenSubjects.reduce((acc, subj) => {
          acc[subj.name] = gradeOptions.includes(parsed[subj.name])
            ? parsed[subj.name]
            : "A";
          return acc;
        }, {});
      } catch (e) {
        console.error("Failed to parse saved grades", e);
      }
    }
    return initialGrades;
  });

  // Сохранение оценок в localStorage когда они изменяются
  useEffect(() => {
    localStorage.setItem(FRESHMEN_GPA_STORAGE_KEY, JSON.stringify(grades));
  }, [grades]);

  const handleChange = (name, value) => {
    setGrades((prev) => ({ ...prev, [name]: value }));
  };

  const calcGPA = (subjects) => {
    let totalCredits = 0;
    let weightedSum = 0;
    for (let subj of subjects) {
      const grade = grades[subj.name];
      if (!grade) return null;
      const num = gradeMap[grade];
      totalCredits += subj.credits;
      weightedSum += num * subj.credits;
    }
    return weightedSum / totalCredits;
  };

  const overallGPA = calcGPA(freshmenSubjects);

  const renderRow = (label, subj) => (
    <tr key={subj.name}>
      <td>{label}</td>
      <td>{subj.credits}</td>
      <td>
        <select
          value={grades[subj.name] || ""}
          onChange={(e) => handleChange(subj.name, e.target.value)}
        >
          {gradeOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );

  return (
    <>
      <meta name="description" content="Первокурсники | Калькулятор GPA"></meta>
      <NavBar />
      <div className="content">
        <div className="center-0 gpa-calculator">
          <CalculatorBackLink />
          <h1>Первокурсники: Калькулятор GPA</h1>
          {/* TOTAL */}
          <div className="gpa-output">Общий GPA: {overallGPA.toFixed(2)}</div>
          {/* FALL */}
          <div className="calc-table-wrapper">
            <h2>Осенний семестр</h2>
            <table className="calc-table">
              <thead>
                <tr>
                  <th>Предмет</th>
                  <th>Кредиты</th>
                  <th className="grade-col">Оценка</th>
                </tr>
              </thead>
              <tbody>
                {renderRow("Математика", freshmenFallSubjects[0])}
                {renderRow("Английский язык", freshmenFallSubjects[1])}
                {renderRow("Физика", freshmenFallSubjects[2])}
                {renderRow("Информатика", freshmenFallSubjects[3])}
                {renderRow("История искусства", freshmenFallSubjects[4])}
                {renderRow("Критическое мышление", freshmenFallSubjects[5])}
                {renderRow("Кыргызский язык", freshmenFallSubjects[6])}
                {renderRow("Русский язык", freshmenFallSubjects[7])}
                {renderRow("Всемирная история", freshmenFallSubjects[8])}
                {renderRow("География", freshmenFallSubjects[9])}
                {renderRow("Химия", freshmenFallSubjects[10])}
                {renderRow("Биология", freshmenFallSubjects[11])}
                {renderRow("Граждановедение", freshmenFallSubjects[12])}
                {renderRow("История Кыргызстана", freshmenFallSubjects[13])}
                {renderRow("Кыргызская литература", freshmenFallSubjects[14])}
                {renderRow("Русская литература", freshmenFallSubjects[15])}
              </tbody>
            </table>
            <GPAField value={calcGPA(freshmenFallSubjects)} />
          </div>
          {/* SPRING */}
          <div className="calc-table-wrapper">
            <h2>Весенний семестр</h2>
            <table className="calc-table">
              <thead>
                <tr>
                  <th>Предмет</th>
                  <th>Кредиты</th>
                  <th className="grade-col">Оценка</th>
                </tr>
              </thead>
              <tbody>
                {renderRow("Математика", freshmenSpringSubjects[0])}
                {renderRow("Английский язык", freshmenSpringSubjects[1])}
                {renderRow("Физика", freshmenSpringSubjects[2])}
                {renderRow("Информатика", freshmenSpringSubjects[3])}
                {renderRow("История искусства", freshmenSpringSubjects[4])}
                {renderRow("Критическое мышление", freshmenSpringSubjects[5])}
                {renderRow("Кыргызский язык", freshmenSpringSubjects[6])}
                {renderRow("Русский язык", freshmenSpringSubjects[7])}
                {renderRow("Всемирная история", freshmenSpringSubjects[8])}
                {renderRow("География", freshmenSpringSubjects[9])}
                {renderRow("Химия", freshmenSpringSubjects[10])}
                {renderRow("Биология", freshmenSpringSubjects[11])}
                {renderRow("Граждановедение", freshmenSpringSubjects[12])}
                {renderRow("История Кыргызстана", freshmenSpringSubjects[13])}
                {renderRow("Кыргызская литература", freshmenSpringSubjects[14])}
                {renderRow("Русская литература", freshmenSpringSubjects[15])}
                {renderRow("Астрономия", freshmenSpringSubjects[16])}
              </tbody>
            </table>
            <GPAField value={calcGPA(freshmenSpringSubjects)} />
          </div>
        </div>
      </div>
    </>
  );
}
