import React, { useState, useMemo } from "react";
import NavBar from "../../components/NavBar";
import "./GradeConverter.css";

const gradeScale = [
  {
    range: "93–100",
    min: 93.0,
    max: 100.0,
    grade: "A",
    gpa: 4.0,
    color: "#4caf50",
  },
  {
    range: "90–92.99",
    min: 90.0,
    max: 92.99,
    grade: "A-",
    gpa: 3.67,
    color: "#8bc34a",
  },
  {
    range: "87–89.99",
    min: 87.0,
    max: 89.99,
    grade: "B+",
    gpa: 3.33,
    color: "#cddc39",
  },
  {
    range: "83–86.99",
    min: 83.0,
    max: 86.99,
    grade: "B",
    gpa: 3.0,
    color: "#ffeb3b",
  },
  {
    range: "80–82.99",
    min: 80.0,
    max: 82.99,
    grade: "B-",
    gpa: 2.67,
    color: "#ffc107",
  },
  {
    range: "77–79.99",
    min: 77.0,
    max: 79.99,
    grade: "C+",
    gpa: 2.33,
    color: "#ff9800",
  },
  {
    range: "73–76.99",
    min: 73.0,
    max: 76.99,
    grade: "C",
    gpa: 2.0,
    color: "#ff5722",
  },
  {
    range: "70–72.99",
    min: 70.0,
    max: 72.99,
    grade: "C-",
    gpa: 1.67,
    color: "#f44336",
  },
  {
    range: "67–69.99",
    min: 67.0,
    max: 69.99,
    grade: "D+",
    gpa: 1.33,
    color: "#e91e63",
  },
  {
    range: "63–66.99",
    min: 63.0,
    max: 66.99,
    grade: "D",
    gpa: 1.0,
    color: "#9c27b0",
  },
  {
    range: "60–62.99",
    min: 60.0,
    max: 62.99,
    grade: "D-",
    gpa: 0.67,
    color: "#673ab7",
  },
  {
    range: "0–59.99",
    min: 0.0,
    max: 59.99,
    grade: "F",
    gpa: 0.0,
    color: "#9e9e9e",
  },
];

export function GradeConverter() {
  const [inputMode, setInputMode] = useState("points"); // 'points' | 'grade' | 'gpa'
  const [pointsVal, setPointsVal] = useState("95");
  const [gradeVal, setGradeVal] = useState("A");
  const [gpaVal, setGpaVal] = useState("4.00");

  const conversionResult = useMemo(() => {
    if (inputMode === "points") {
      const points = parseFloat(pointsVal);
      if (isNaN(points) || points < 0 || points > 100) {
        return { error: "Введите корректные баллы от 0 до 100" };
      }
      const matched = gradeScale.find((item) => points >= item.min);
      return {
        matched,
        exactPoints: points.toFixed(2),
        displayPoints: points.toFixed(2),
        grade: matched?.grade,
        gpa: matched?.gpa.toFixed(2),
      };
    } else if (inputMode === "grade") {
      const matched = gradeScale.find((item) => item.grade === gradeVal);
      return {
        matched,
        displayPoints: matched?.range,
        grade: matched?.grade,
        gpa: matched?.gpa.toFixed(2),
      };
    } else if (inputMode === "gpa") {
      const gpa = parseFloat(gpaVal);
      if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
        return { error: "Введите корректный GPA от 0.00 до 4.00" };
      }
      // Find nearest GPA in scale
      const matched = gradeScale.reduce((prev, curr) => {
        return Math.abs(curr.gpa - gpa) < Math.abs(prev.gpa - gpa)
          ? curr
          : prev;
      });
      return {
        matched,
        displayPoints: matched?.range,
        grade: matched?.grade,
        gpa: gpa.toFixed(2),
        approxGpa: matched?.gpa.toFixed(2),
      };
    }
    return null;
  }, [inputMode, pointsVal, gradeVal, gpaVal]);

  const activeGrade = conversionResult?.matched?.grade;

  const activeSegment = useMemo(() => {
    if (!conversionResult || conversionResult.error) return "";
    const grade = conversionResult.grade;
    if (!grade) return "";

    if (grade.startsWith("A")) return "A";
    if (grade.startsWith("B")) return "B";
    if (grade.startsWith("C")) return "C";
    if (grade.startsWith("D")) return "D";

    if (grade === "F") {
      if (inputMode === "points") {
        const pts = parseFloat(pointsVal);
        if (!isNaN(pts) && pts >= 50) return "E";
      } else if (inputMode === "gpa") {
        const gpa = parseFloat(gpaVal);
        if (!isNaN(gpa) && gpa >= 0.2) return "E";
      }
      return "F";
    }
    return "";
  }, [conversionResult, inputMode, pointsVal, gpaVal]);

  return (
    <>
      <meta name="description" content="Конвертер оценок и GPA"></meta>
      <NavBar />
      <div className="content">
        <div className="converter-container-outer">
          <div className="converter-wrapper">
            {/* лев панель (ввод) */}
            <div className="converter-inputs">
              <h2>Конвертер оценок</h2>
              <h3>Переводите баллы, буквенные оценки и GPA</h3>

              <div className="converter-tabs">
                <button
                  className={`converter-tab-btn ${inputMode === "points" ? "active" : ""}`}
                  onClick={() => setInputMode("points")}
                >
                  Баллы
                </button>
                <button
                  className={`converter-tab-btn ${inputMode === "grade" ? "active" : ""}`}
                  onClick={() => setInputMode("grade")}
                >
                  Оценка
                </button>
                <button
                  className={`converter-tab-btn ${inputMode === "gpa" ? "active" : ""}`}
                  onClick={() => setInputMode("gpa")}
                >
                  GPA
                </button>
              </div>

              <div className="converter-field-container">
                {inputMode === "points" && (
                  <div className="converter-field">
                    <label htmlFor="points-input">Баллы (0 – 100)</label>
                    <input
                      id="points-input"
                      className="converter-text-input"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={pointsVal}
                      onChange={(e) => setPointsVal(e.target.value)}
                      placeholder="Например: 95"
                    />
                    <input
                      type="range"
                      className="converter-slider"
                      min="0"
                      max="100"
                      step="0.5"
                      value={
                        isNaN(parseFloat(pointsVal)) ? 0 : parseFloat(pointsVal)
                      }
                      onChange={(e) => setPointsVal(e.target.value)}
                    />
                  </div>
                )}

                {inputMode === "grade" && (
                  <div className="converter-field">
                    <label htmlFor="grade-select">Буквенная оценка</label>
                    <select
                      id="grade-select"
                      className="converter-select"
                      value={gradeVal}
                      onChange={(e) => setGradeVal(e.target.value)}
                    >
                      {gradeScale.map((item) => (
                        <option key={item.grade} value={item.grade}>
                          {item.grade} (GPA: {item.gpa.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {inputMode === "gpa" && (
                  <div className="converter-field">
                    <label htmlFor="gpa-input">GPA (0.00 – 4.00)</label>
                    <input
                      id="gpa-input"
                      className="converter-text-input"
                      type="number"
                      min="0"
                      max="4"
                      step="0.01"
                      value={gpaVal}
                      onChange={(e) => setGpaVal(e.target.value)}
                      placeholder="Например: 3.67"
                    />
                    <input
                      type="range"
                      className="converter-slider"
                      min="0"
                      max="4"
                      step="0.01"
                      value={isNaN(parseFloat(gpaVal)) ? 0 : parseFloat(gpaVal)}
                      onChange={(e) => setGpaVal(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* прав панель (результат) */}
            <div className="converter-output">
              {conversionResult?.error ? (
                <div className="converter-message error">
                  <p>
                    <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                    <b>Ошибка:</b> {conversionResult.error}
                  </p>
                </div>
              ) : (
                <div className="converter-result-card">
                  <div className="result-horizontal-layout">
                    <div className="result-metric">
                      <span className="metric-label">Баллы</span>
                      <span className="metric-value">
                        {conversionResult?.displayPoints}
                      </span>
                    </div>

                    <div className="result-metric">
                      <span className="metric-label">Оценка</span>
                      <span
                        className="metric-value grade-display"
                        style={{
                          color: conversionResult?.matched?.color,
                          textShadow:
                            conversionResult?.grade === "A" ||
                            conversionResult?.grade === "A-"
                              ? `0 0 15px ${conversionResult?.matched?.color}80`
                              : "none",
                        }}
                      >
                        {conversionResult?.grade}
                      </span>
                    </div>

                    <div className="result-metric">
                      <span className="metric-label">GPA</span>
                      <span className="metric-value">
                        {conversionResult?.gpa}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* нижняя панель */}
          <div className="converter-grade-bar">
            <div
              className={`bar-segment ${activeSegment === "F" ? "active" : ""}`}
              style={{
                "--segment-color": "#d32f2f",
                "--text-color": "#ffffff",
              }}
            >
              F
            </div>
            <div
              className={`bar-segment ${activeSegment === "E" ? "active" : ""}`}
              style={{
                "--segment-color": "#ff5722",
                "--text-color": "#ffffff",
              }}
            >
              E
            </div>
            <div
              className={`bar-segment ${activeSegment === "D" ? "active" : ""}`}
              style={{
                "--segment-color": "#9c27b0",
                "--text-color": "#ffffff",
              }}
            >
              D
            </div>
            <div
              className={`bar-segment ${activeSegment === "C" ? "active" : ""}`}
              style={{
                "--segment-color": "#ff9800",
                "--text-color": "#ffffff",
              }}
            >
              C
            </div>
            <div
              className={`bar-segment ${activeSegment === "B" ? "active" : ""}`}
              style={{
                "--segment-color": "#ffeb3b",
                "--text-color": "#070523",
              }}
            >
              B
            </div>
            <div
              className={`bar-segment ${activeSegment === "A" ? "active" : ""}`}
              style={{
                "--segment-color": "#4caf50",
                "--text-color": "#ffffff",
              }}
            >
              A
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GradeConverter;
