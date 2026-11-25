import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../../components/NavBar";
import "./CalcTables.css";
import {
  getSecondYearFallSubjects,
  gpaGradeMap,
  gpaGradeOptions,
  secondYearMajors,
} from "./secondYearFallData";
import { UnavailableCalc } from "./UnavailableCalc";

function calculateGpa(subjects, grades) {
  const totals = subjects.reduce(
    (result, subject) => ({
      credits: result.credits + subject.credits,
      weightedPoints:
        result.weightedPoints + gpaGradeMap[grades[subject.id]] * subject.credits,
    }),
    { credits: 0, weightedPoints: 0 },
  );

  return totals.credits === 0 ? 0 : totals.weightedPoints / totals.credits;
}

function AvailableMajorCalc({ major, year, majorLabel }) {
  const subjects = useMemo(() => getSecondYearFallSubjects(major), [major]);
  const storageKey = `gpaGrades:${major}:${year}:fall`;

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

  const gpa = calculateGpa(subjects, grades);

  return (
    <>
      <meta
        name="description"
        content={`${majorLabel}, второй курс | Калькулятор GPA`}
      />
      <NavBar />
      <div className="content">
        <div className="center-0 gpa-calculator">
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

