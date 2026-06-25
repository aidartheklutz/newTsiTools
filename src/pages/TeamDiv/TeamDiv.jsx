import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import "./TeamDiv.css";

const pickNames = [
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
  "Чынгыз",
  "Атай",
  "Уултан",
  "Айдин",
];

const randomNames = shuffleNames(pickNames).slice(0, 6);

function getNames(value) {
  return value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function shuffleNames(names) {
  const shuffled = [...names];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function splitIntoTeams(names, teamCount) {
  const teams = Array.from({ length: teamCount }, () => []);
  const shuffled = shuffleNames(names);

  shuffled.forEach((name, index) => {
    teams[index % teamCount].push(name);
  });

  return teams;
}

function TeamBox({ members, number }) {
  return (
    <div className="teamdiv-team-box">
      <h3>Группа {number}</h3>
      <ul>
        {members.map((name) => (
          <li key={`${number}-${name}`}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

const STORAGE_KEY = "teamDivNames";

export function TeamDiv() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const [namesText, setNamesText] = useState(saved ? saved : "");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, namesText);
  }, [namesText]);

  const [teamCount, setTeamCount] = useState("2");
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const names = useMemo(() => getNames(namesText), [namesText]);

  function generateTeams() {
    const count = Number(teamCount);

    if (count == -67) {
      setTeams([]);
      setMessage("Хахахахаха сикс сэээвен");
      return;
    }

    if (count < 0) {
      setTeams([]);
      setMessage("Отрицательное количество команд? Ты что, самый умный?");
      return;
    }

    if (count == 0) {
      setTeams([]);
      setMessage("Ноль команд??? Так не пойдёт");
      return;
    }

    if (count < 2) {
      setTeams([]);
      setMessage("Нужно хотя бы две команды");
      return;
    }

    if (names.length < count) {
      setTeams([]);
      setMessage(`Слишком мало человек для деления на ${count} групп(-ы)`);
      return;
    }

    setTeams(splitIntoTeams(names, count));
    setMessage("");
  }

  function clearTeams() {
    setNamesText("");
    setTeamCount(2);
    setTeams([]);
    setMessage("");
  }

  return (
    <>
      <NavBar />
      <div className="content">
        <div className="teamdiv-wrapper">
          <div className="teamdiv-inputs">
            <h2>Делитель на команды</h2>
            <h3>Введите каждого человека с новой строки</h3>

            <textarea
              className="teamdiv-textarea"
              value={namesText}
              onChange={(event) => {
                setNamesText(event.target.value);
                setTeams([]);
                setMessage("");
              }}
              placeholder={randomNames.join("\n")}
            />

            <label className="teamdiv-number-label" htmlFor="team-count">
              Количество групп
            </label>
            <input
              id="team-count"
              className="teamdiv-number-input"
              type="number"
              inputMode="numeric"
              value={teamCount}
              onChange={(event) => {
                setTeamCount(event.target.value);
                setTeams([]);
                setMessage("");
              }}
            />

            <div className="teamdiv-actions">
              <button className="teamdiv-secondary-button" onClick={clearTeams}>
                Очистить
              </button>
              <button
                className="teamdiv-primary-button"
                onClick={generateTeams}
              >
                Поделить
              </button>
            </div>
          </div>

          <div className="teamdiv-output">
            {message ? (
              <p className="teamdiv-message">
                <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                <b>ОШИБКА:</b> {message}
              </p>
            ) : null}

            {!message && teams.length === 0 ? (
              <div className="teamdiv-empty">
                <i className="bi bi-people-fill"></i>
                <p>Группы появятся здесь после деления.</p>
                <span>Сейчас в списке: {names.length}</span>
              </div>
            ) : null}

            {teams.length > 0 ? (
              <div className="teamdiv-team-grid">
                {teams.map((team, index) => (
                  <TeamBox
                    key={`team-${index + 1}`}
                    members={team}
                    number={index + 1}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
