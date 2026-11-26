import { useEffect, useMemo, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import tadaSound from "../../assets/tada.m4a";
import "./DecisionWheel.css";

const NAMES_STORAGE_KEY = "decisionWheelNames";
const COLOR_MODE_STORAGE_KEY = "decisionWheelColorMode";
const SPIN_DURATION = 4200;
const COLOR_PALETTE = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#f59e0b",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#ea580c",
];

function parseNames(value) {
  return value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function pointOnCircle(angle, radius, center = 200) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function createSlicePath(index, total) {
  if (total === 1) {
    return "M 200 12 A 188 188 0 1 1 200 388 A 188 188 0 1 1 200 12 Z";
  }

  const sliceAngle = 360 / total;
  const start = -90 + index * sliceAngle;
  const end = start + sliceAngle;
  const startPoint = pointOnCircle(start, 188);
  const endPoint = pointOnCircle(end, 188);
  const largeArc = sliceAngle > 180 ? 1 : 0;

  return [
    "M 200 200",
    `L ${startPoint.x} ${startPoint.y}`,
    `A 188 188 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`,
    "Z",
  ].join(" ");
}

function getLabelPosition(index, total) {
  const angle = -90 + (index + 0.5) * (360 / total);
  const radius = total > 14 ? 127 : total > 8 ? 122 : 116;
  const point = pointOnCircle(angle, radius);
  let rotation = angle + 90;
  const normalized = ((rotation % 360) + 360) % 360;

  if (normalized > 90 && normalized < 270) rotation += 180;

  return { ...point, rotation };
}

function shortenName(name, total) {
  const limit = total > 16 ? 11 : total > 10 ? 14 : 18;
  return name.length > limit ? `${name.slice(0, limit - 1)}…` : name;
}

function WinnerDialog({ winner, onClose, onRemove }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="wheel-dialog-backdrop" onMouseDown={onClose}>
      <section
        className="wheel-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wheel-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="wheel-dialog-label">Выпало имя</p>
        <h2 id="wheel-dialog-title">{winner}</h2>
        <div className="wheel-dialog-actions">
          <button
            ref={closeButtonRef}
            type="button"
            className="wheel-dialog-secondary"
            onClick={onClose}
          >
            Оставить в списке
          </button>
          <button type="button" onClick={onRemove}>
            <i className="bi bi-trash3" aria-hidden="true"></i> Удалить имя
          </button>
        </div>
      </section>
    </div>
  );
}

export function DecisionWheel() {
  const [namesText, setNamesText] = useState(
    () => localStorage.getItem(NAMES_STORAGE_KEY) ?? "",
  );
  const [colorMode, setColorMode] = useState(() => {
    const savedMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    return savedMode === null ? true : savedMode === "true";
  });
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const spinTimerRef = useRef(null);
  const winnerSoundRef = useRef(null);
  const names = useMemo(() => parseNames(namesText), [namesText]);

  useEffect(() => {
    localStorage.setItem(NAMES_STORAGE_KEY, namesText);
  }, [namesText]);

  useEffect(() => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, String(colorMode));
  }, [colorMode]);

  useEffect(
    () => () => {
      window.clearTimeout(spinTimerRef.current);
    },
    [],
  );

  function spinWheel() {
    if (isSpinning || names.length === 0) return;

    const winnerSound = winnerSoundRef.current;
    if (winnerSound) {
      winnerSound.volume = 0;
      winnerSound.currentTime = 0;
      winnerSound
        .play()
        .then(() => {
          winnerSound.pause();
          winnerSound.currentTime = 0;
          winnerSound.volume = 1;
        })
        .catch(() => {
          winnerSound.volume = 1;
        });
    }

    const winnerIndex = Math.floor(Math.random() * names.length);
    const sliceAngle = 360 / names.length;
    const targetRotation =
      ((-(winnerIndex + 0.5) * sliceAngle) % 360 + 360) % 360;
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const distance =
      ((targetRotation - currentNormalized + 360) % 360) + 360 * 6;

    setWinner("");
    setIsSpinning(true);
    setRotation((current) => current + distance);
    spinTimerRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      setWinner(names[winnerIndex]);
      if (winnerSound) {
        winnerSound.currentTime = 0;
        winnerSound.volume = 1;
        winnerSound.play().catch(() => {});
      }
    }, SPIN_DURATION);
  }

  function removeWinner() {
    const index = names.findIndex((name) => name === winner);
    const nextNames = names.filter((_, nameIndex) => nameIndex !== index);
    setNamesText(nextNames.join("\n"));
    setWinner("");
  }

  function clearNames() {
    if (isSpinning) return;
    setNamesText("");
    setWinner("");
    setRotation(0);
  }

  return (
    <>
      <meta name="description" content="Колесо выбора случайного имени" />
      <NavBar />
      <main className="content wheel-page">
        <section className="wheel-controls">
          <h1>Колесо решений</h1>
          <p>Введите каждое имя с новой строки</p>

          <textarea
            className="wheel-names-input"
            value={namesText}
            onChange={(event) => setNamesText(event.target.value)}
            placeholder={"Айдар\nРаяна\nДаниил\nАйым\nУрмат"}
            disabled={isSpinning}
          />

          <div className="wheel-list-meta">
            <span>Имён в списке: {names.length}</span>
            <button
              type="button"
              className="wheel-clear-button"
              onClick={clearNames}
              disabled={names.length === 0 || isSpinning}
            >
              Очистить
            </button>
          </div>

          <label className="wheel-color-option">
            <input
              type="checkbox"
              checked={colorMode}
              onChange={(event) => setColorMode(event.target.checked)}
              disabled={isSpinning}
            />
            <span>Цветной режим</span>
          </label>
        </section>

        <section className="wheel-stage" aria-label="Колесо решений">
          {names.length > 0 ? (
            <div className="wheel-pointer" aria-hidden="true"></div>
          ) : null}
          <div
            className={`wheel-frame${names.length === 0 ? " wheel-frame-empty" : ""}`}
          >
            {names.length > 0 ? (
              <svg
                className="decision-wheel"
                viewBox="0 0 400 400"
                role="img"
                aria-label={`Колесо с ${names.length} именами`}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {names.map((name, index) => {
                  const label = getLabelPosition(index, names.length);
                  const isBlueSlice = index % 2 === 0;
                  const fill = colorMode
                    ? COLOR_PALETTE[index % COLOR_PALETTE.length]
                    : isBlueSlice
                      ? "#2218a7"
                      : "#ffffff";

                  return (
                    <g key={`${name}-${index}`}>
                      <path
                        d={createSlicePath(index, names.length)}
                        fill={fill}
                        stroke="#070523"
                        strokeWidth="3"
                      />
                      <text
                        x={label.x}
                        y={label.y}
                        transform={`rotate(${label.rotation} ${label.x} ${label.y})`}
                        fill={colorMode || isBlueSlice ? "#ffffff" : "#070523"}
                        fontSize={names.length > 16 ? 10 : names.length > 10 ? 12 : 15}
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {shortenName(name, names.length)}
                      </text>
                    </g>
                  );
                })}
                <circle
                  cx="200"
                  cy="200"
                  r="188"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="5"
                />
              </svg>
            ) : (
              <div className="wheel-empty">
                <i className="bi bi-list-ul" aria-hidden="true"></i>
                <p>Добавьте имена, чтобы заполнить колесо</p>
              </div>
            )}

            {names.length > 0 ? (
              <button
                type="button"
                className="wheel-spin-button"
                onClick={spinWheel}
                disabled={isSpinning}
              >
                {isSpinning ? "..." : "Крутить"}
              </button>
            ) : null}
          </div>
          <p className="wheel-hint" aria-live="polite">
            {names.length === 0
              ? "Список пока пуст"
              : isSpinning
                ? "Колесо вращается..."
                : "Нажмите на центр колеса"}
          </p>
        </section>
      </main>

      <audio ref={winnerSoundRef} src={tadaSound} preload="auto" />

      {winner ? (
        <WinnerDialog
          winner={winner}
          onClose={() => setWinner("")}
          onRemove={removeWinner}
        />
      ) : null}
    </>
  );
}
