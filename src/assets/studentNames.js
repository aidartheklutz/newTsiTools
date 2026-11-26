export const studentNames = [
  "Айдар", // я :3
  "Кылымдар",
  "Раяна",
  "Даниил",
  "Урмат",
  "Али",
  "Даурен",
  "Айым",
  "Искендер",
  "Эрнур",
  "Алия",
  "Саид",
  "Бексултан",
  "Дениза",
  "Бегимай",
  "Жамиля",
  "Дина",
  "Влад",
  "Анжелина",
  "Амалия",
  "Милана",
  "Айзирек",
  "Тимур",
];

export function shuffleNames(names) {
  const shuffled = [...names];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
