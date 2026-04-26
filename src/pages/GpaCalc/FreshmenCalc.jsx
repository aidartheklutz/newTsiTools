import { useState } from "react";
import "./CalcTables.css";
import NavBar from "../../components/NavBar";

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

const fallSubjects = [
  { name: "math1", credits: 6 },
  { name: "lang1", credits: 6 },
  { name: "phy1", credits: 3 },
  { name: "inf1", credits: 3 },
  { name: "art1", credits: 1.5 },
  { name: "crit1", credits: 1.5 },
  { name: "kg1", credits: 1.5 },
  { name: "rus1", credits: 1.5 },
  { name: "whist1", credits: 1.5 },
  { name: "geo1", credits: 1.5 },
  { name: "chem1", credits: 1.5 },
  { name: "bio1", credits: 1 },
  { name: "civ1", credits: 1 },
  { name: "khist1", credits: 1 },
  { name: "kglit1", credits: 1 },
  { name: "ruslit1", credits: 1 },
];

const springSubjects = [
  { name: "math2", credits: 8 },
  { name: "lang2", credits: 8 },
  { name: "phy2", credits: 5 },
  { name: "inf2", credits: 5 },
  { name: "art2", credits: 2.5 },
  { name: "crit2", credits: 2.5 },
  { name: "kg2", credits: 2.5 },
  { name: "rus2", credits: 2.5 },
  { name: "whist2", credits: 1.5 },
  { name: "geo2", credits: 1.5 },
  { name: "chem2", credits: 1.5 },
  { name: "bio2", credits: 1 },
  { name: "civ2", credits: 1 },
  { name: "khist2", credits: 1 },
  { name: "kglit2", credits: 1 },
  { name: "ruslit2", credits: 1 },
  { name: "astr", credits: 1 },
];

const allSubjects = [...fallSubjects, ...springSubjects];

const initialGrades = allSubjects.reduce((acc, subj) => {
  acc[subj.name] = "A";
  return acc;
}, {});

function GPAField({ value }) {
  return <div className="gpa-output">GPA: {value.toFixed(2)}</div>;
}

export function FreshmenCalc() {
  const [grades, setGrades] = useState(initialGrades);

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

  const overallGPA = calcGPA([...fallSubjects, ...springSubjects]);

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
      <NavBar />
      <div className="content">
        <div className="center-0">
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
                {renderRow("Математика", fallSubjects[0])}
                {renderRow("Английский язык", fallSubjects[1])}
                {renderRow("Физика", fallSubjects[2])}
                {renderRow("Информатика", fallSubjects[3])}
                {renderRow("История искусства", fallSubjects[4])}
                {renderRow("Критическое мышление", fallSubjects[5])}
                {renderRow("Кыргызский язык", fallSubjects[6])}
                {renderRow("Русский язык", fallSubjects[7])}
                {renderRow("Всемирная история", fallSubjects[8])}
                {renderRow("География", fallSubjects[9])}
                {renderRow("Химия", fallSubjects[10])}
                {renderRow("Биология", fallSubjects[11])}
                {renderRow("Граждановедение", fallSubjects[12])}
                {renderRow("История Кыргызстана", fallSubjects[13])}
                {renderRow("Кыргызская литература", fallSubjects[14])}
                {renderRow("Русская литература", fallSubjects[15])}
              </tbody>
            </table>

            <GPAField value={calcGPA(fallSubjects)} />
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
                {renderRow("Математика", springSubjects[0])}
                {renderRow("Английский язык", springSubjects[1])}
                {renderRow("Физика", springSubjects[2])}
                {renderRow("Информатика", springSubjects[3])}
                {renderRow("История искусства", springSubjects[4])}
                {renderRow("Критическое мышление", springSubjects[5])}
                {renderRow("Кыргызский язык", springSubjects[6])}
                {renderRow("Русский язык", springSubjects[7])}
                {renderRow("Всемирная история", springSubjects[8])}
                {renderRow("География", springSubjects[9])}
                {renderRow("Химия", springSubjects[10])}
                {renderRow("Биология", springSubjects[11])}
                {renderRow("Граждановедение", springSubjects[12])}
                {renderRow("История Кыргызстана", springSubjects[13])}
                {renderRow("Кыргызская литература", springSubjects[14])}
                {renderRow("Русская литература", springSubjects[15])}
                {renderRow("Астрономия", springSubjects[16])}
              </tbody>
            </table>
            <GPAField value={calcGPA(springSubjects)} />
          </div>
        </div>
      </div>
    </>
  );
}
