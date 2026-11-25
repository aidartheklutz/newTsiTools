export const FRESHMEN_GPA_STORAGE_KEY = "freshmenGPAGrades";

export const freshmenFallSubjects = [
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

export const freshmenSpringSubjects = [
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

export const freshmenSubjects = [
  ...freshmenFallSubjects,
  ...freshmenSpringSubjects,
];
