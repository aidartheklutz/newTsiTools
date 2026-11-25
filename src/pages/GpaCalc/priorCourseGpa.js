import {
  getSecondYearFallSubjects,
  gpaGradeMap,
  gpaGradeOptions,
} from "./secondYearFallData";
import {
  FRESHMEN_GPA_STORAGE_KEY,
  freshmenSubjects,
} from "./freshmenGpaData";

function readSavedGrades(storageKey) {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error(`Failed to parse saved grades from ${storageKey}`, error);
    return null;
  }
}

function calculateSavedTotals(subjects, grades, getGradeKey) {
  if (!grades) {
    return null;
  }

  return subjects.reduce(
    (totals, subject) => {
      if (!totals) {
        return null;
      }

      const grade = grades[getGradeKey(subject)];

      if (!gpaGradeOptions.includes(grade)) {
        return null;
      }

      return {
        credits: totals.credits + subject.credits,
        weightedPoints:
          totals.weightedPoints + gpaGradeMap[grade] * subject.credits,
      };
    },
    { credits: 0, weightedPoints: 0 },
  );
}

function getSavedFreshmanTotals() {
  return calculateSavedTotals(
    freshmenSubjects,
    readSavedGrades(FRESHMEN_GPA_STORAGE_KEY),
    (subject) => subject.name,
  );
}

function getSavedSecondYearTotals(major) {
  return calculateSavedTotals(
    getSecondYearFallSubjects(major),
    readSavedGrades(`gpaGrades:${major}:2:fall`),
    (subject) => subject.id,
  );
}

export function getPriorCourseTotals({ major, year }) {
  const targetYear = Number(year);
  const priorTotals = [];

  if (targetYear > 1) {
    priorTotals.push(getSavedFreshmanTotals());
  }

  // A future third-year calculator will also include the saved second-year
  // grades for the same major through this branch.
  if (targetYear > 2) {
    priorTotals.push(getSavedSecondYearTotals(major));
  }

  if (priorTotals.some((totals) => !totals)) {
    return null;
  }

  return priorTotals.reduce(
    (combined, totals) => ({
      credits: combined.credits + totals.credits,
      weightedPoints: combined.weightedPoints + totals.weightedPoints,
    }),
    { credits: 0, weightedPoints: 0 },
  );
}
