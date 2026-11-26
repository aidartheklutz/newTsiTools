import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import NavBar from "../../components/NavBar";
import "./CalcTables.css";
import { CalculatorBackLink } from "./CalculatorBackLink";
import {
  getSecondYearFallSubjects,
  gpaGradeMap,
  gpaGradeOptions,
  secondYearMajors,
} from "./secondYearFallData";
import { UnavailableCalc } from "./UnavailableCalc";
import { getPriorCourseTotals } from "./priorCourseGpa";

function calculateTotals(subjects, grades) {
  return subjects.reduce(
    (result, subject) => ({
      credits: result.credits + subject.credits,
      weightedPoints:
        result.weightedPoints +
        gpaGradeMap[grades[subject.id]] * subject.credits,
    }),
    { credits: 0, weightedPoints: 0 },
  );
}

function AvailableMajorCalc({ major, year, majorLabel }) {
  const subjects = useMemo(() => getSecondYearFallSubjects(major), [major]);
  const storageKey = `gpaGrades:${major}:${year}:fall`;
  const [includePreviousCourses, setIncludePreviousCourses] = useState(false);

  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    let parsed = {};

    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse saved grades", error);
      }
    }

    return subjects.reduce((result, subject) => {
      result[subject.id] = gpaGradeOptions.includes(parsed[subject.id])
        ? parsed[subject.id]
        : "A";
      return result;
    }, {});
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(grades));
  }, [grades, storageKey]);

  const currentTotals = calculateTotals(subjects, grades);
  const gpa = currentTotals.weightedPoints / currentTotals.credits;
  const priorTotals = includePreviousCourses
    ? getPriorCourseTotals({ major, year })
    : null;
  const cumulativeGpa = priorTotals
    ? (currentTotals.weightedPoints + priorTotals.weightedPoints) /
      (currentTotals.credits + priorTotals.credits)
    : null;
  const displayedOverallGpa = includePreviousCourses ? cumulativeGpa : gpa;

  return (
    <>
      <meta
        name="description"
        content={`${majorLabel}, второй курс | Калькулятор GPA`}
      />
      <NavBar />
      <div className="content">
        <div className="center-0 gpa-calculator">
          <CalculatorBackLink />
          <h1>{majorLabel}, второй курс: Калькулятор GPA</h1>
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
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>{subject.credits}</td>
                    <td>
                      <select
                        value={grades[subject.id]}
                        onChange={(event) =>
                          setGrades((current) => ({
                            ...current,
                            [subject.id]: event.target.value,
                          }))
                        }
                        aria-label={`Оценка: ${subject.name}`}
                      >
                        {gpaGradeOptions.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="gpa-output">GPA: {gpa.toFixed(2)}</div>
          </div>
          <div className="overall-gpa-section">
            <div className="gpa-output">
              Общий GPA:{" "}
              {displayedOverallGpa === null
                ? "—"
                : displayedOverallGpa.toFixed(2)}
            </div>
            <label className="cgpa-toggle">
              <input
                type="checkbox"
                checked={includePreviousCourses}
                onChange={(event) =>
                  setIncludePreviousCourses(event.target.checked)
                }
              />
              <span>Учитывать GPA за прошлые курсы</span>
            </label>
            {includePreviousCourses && priorTotals === null && (
              <p className="cgpa-message">
                Сначала сохраните оценки в{" "}
                <Link to="/gpa/freshmen" className="cgpa-message-link">
                  калькуляторе первого курса
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export function MajorCalc() {
  const { major, year } = useParams();
  const majorConfig = secondYearMajors.find((item) => item.slug === major);
  const isAvailable = year === "2" && majorConfig?.available;

  if (!isAvailable) {
    return <UnavailableCalc />;
  }

  return (
    <AvailableMajorCalc
      key={`${major}:${year}`}
      major={major}
      year={year}
      majorLabel={majorConfig.label}
    />
  );
}
