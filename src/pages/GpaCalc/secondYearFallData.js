export const gpaGradeMap = {
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

export const gpaGradeOptions = Object.keys(gpaGradeMap);

export const secondYearMajors = [
  { slug: "sest", label: "SEST", available: true },
  { slug: "dht", label: "DHT", available: true },
  { slug: "sfht", label: "SFHT", available: true },
  { slug: "ehi", label: "EHI", available: true },
  { slug: "dmdt", label: "DMDT", available: true },
  { slug: "ecol", label: "ECOL", available: false },
];

const secondYearFallSubjects = [
  {
    id: "3d-design",
    name: "3D моделирование в дизайне",
    credits: 4,
    majors: ["dht"],
  },
  {
    id: "english-composition-1",
    name: "English composition 1",
    credits: 6,
    majors: [],
  },
  {
    id: "academic-reading-writing-1",
    name: "Академическое чтение и письмо 1",
    credits: 3,
    majors: [],
  },
  {
    id: "algorithms-data-structures",
    name: "Алгоритмы и структуры данных",
    credits: 6,
    majors: ["sest"],
  },
  {
    id: "data-analysis-visualization-1",
    name: "Анализ и визуализация данных",
    credits: 4.5,
    majors: [],
  },
  {
    id: "business-modeling",
    name: "Бизнес-моделирование",
    credits: 3,
    majors: ["sfht", "ehi", "dmdt"],
  },
  {
    id: "accounting",
    name: "Бухгалтерский учет",
    credits: 4,
    majors: ["sfht"],
  },
  {
    id: "design-thinking",
    name: "Дизайн-мышление",
    credits: 4,
    majors: ["dmdt"],
  },
  {
    id: "fine-art-design",
    name: "Изобразительное искусство в дизайне",
    credits: 6,
    majors: ["dht"],
  },
  {
    id: "innovation-history-logic-trends",
    name: "Инновации: история, логика, тренды",
    credits: 3,
    majors: ["dmdt", "ehi"],
  },
  {
    id: "sound-art-design",
    name: "Искусство звука и дизайн",
    credits: 3,
    majors: ["dht"],
  },
  {
    id: "photography-art-design",
    name: "Искусство фотографии и дизайн",
    credits: 3,
    majors: ["dht"],
  },
  {
    id: "entrepreneurship-history-logic",
    name: "История и логика предпринимательства",
    credits: 3,
    majors: ["dmdt", "ehi"],
  },
  {
    id: "creative-thinking-human-intelligence",
    name: "Креативное мышление и человеческий интеллект",
    credits: 3,
    majors: ["dmdt", "dht", "ehi"],
  },
  {
    id: "linear-algebra-analytic-geometry",
    name: "Линейная алгебра и аналитическая геометрия",
    credits: 6,
    majors: ["sest", "sfht"],
  },
  { id: "marketing", name: "Маркетинг", credits: 3, majors: ["ehi"] },
  {
    id: "math-machine-learning",
    name: "Математика для машинного обучения",
    credits: 3,
    majors: ["sest"],
  },
  {
    id: "business-microeconomics",
    name: "Микроэкономика для бизнеса",
    credits: 3,
    majors: ["sfht", "ehi", "dmdt"],
  },
  {
    id: "object-oriented-programming",
    name: "Объектно-ориентированное программирование",
    credits: 3,
    majors: ["sest"],
  },
  {
    id: "web-development",
    name: "Основы веб-разработки",
    credits: 3,
    majors: ["sest"],
  },
  {
    id: "design-design-thinking",
    name: "Основы дизайна и дизайн мышление",
    credits: 4,
    majors: ["dmdt", "dht"],
  },
  {
    id: "machine-learning-basics",
    name: "Основы машинного обучения",
    credits: 4,
    majors: ["sest"],
  },
  {
    id: "startup-management",
    name: "Стартап-менеджмент",
    credits: 3,
    majors: ["sfht", "ehi"],
  },
  {
    id: "screenwriting",
    name: "Сценарное мастерство",
    credits: 3,
    majors: ["dht"],
  },
  {
    id: "project-management",
    name: "Управление проектами",
    credits: 3,
    majors: [],
  },
  {
    id: "emotional-learning",
    name: "Эмоциональное обучение",
    credits: 3,
    majors: ["dmdt"],
  },
];

export function getSecondYearFallSubjects(majorSlug) {
  return secondYearFallSubjects
    .map((subject, sourceOrder) => ({ ...subject, sourceOrder }))
    .filter(
      (subject) =>
        subject.majors.length === 0 || subject.majors.includes(majorSlug),
    )
    .sort(
      (left, right) =>
        right.credits - left.credits || left.sourceOrder - right.sourceOrder,
    )
    .map(({ id, name, credits }) => ({ id, name, credits }));
}
