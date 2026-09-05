import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import "./TimeCalc.css";

const units = [
  {
    value: "seconds",
    label: "Секунды",
    one: "секунда",
    few: "секунды",
    many: "секунд",
  },
  {
    value: "minutes",
    label: "Минуты",
    one: "минута",
    few: "минуты",
    many: "минут",
  },
  { value: "hours", label: "Часы", one: "час", few: "часа", many: "часов" },
  { value: "days", label: "Дни", one: "день", few: "дня", many: "дней" },
  {
    value: "weeks",
    label: "Недели",
    one: "неделя",
    few: "недели",
    many: "недель",
  },
  {
    value: "months",
    label: "Месяцы",
    one: "месяц",
    few: "месяца",
    many: "месяцев",
  },
  { value: "years", label: "Годы", one: "год", few: "года", many: "лет" },
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function formatLocalDateTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDateTimeLocalValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatHumanRu(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hourCycle: "h23",
  }).format(date);
}

function parseTimeValue(raw) {
  const value = raw.trim();
  if (!value) return null;

  if (/^-?\d+$/.test(value)) {
    const digits = value.replace("-", "");
    const number = Number(value);
    const date = new Date(digits.length >= 12 ? number : number * 1000);
    return isValidDate(date) ? date : null;
  }

  if (/^-?\d+\.\d+$/.test(value)) {
    const date = new Date(Number(value) * 1000);
    return isValidDate(date) ? date : null;
  }

  const localMatch = value.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/,
  );
  if (localMatch) {
    const [, year, month, day, hour, minute, second = "0"] = localMatch;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
    return isValidDate(date) ? date : null;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed);
}

function parseDateTimeLocalValue(value) {
  if (!value) return null;
  return parseTimeValue(value.replace("T", " "));
}

function getFormats(date) {
  return [
    {
      key: "unix",
      label: "Unix (секунды)",
      value: String(Math.floor(date.getTime() / 1000)),
    },
    {
      key: "unixMs",
      label: "Unix (миллисекунды)",
      value: String(date.getTime()),
    },
    {
      key: "iso",
      label: "ISO 8601",
      value: date.toISOString(),
    },
    {
      key: "rfc",
      label: "RFC 822",
      value: date.toUTCString(),
    },
    {
      key: "local",
      label: "Дата и время",
      value: formatLocalDateTime(date),
    },
  ];
}

function pluralRu(amount, forms) {
  const abs = Math.abs(amount) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms.many;
  if (last === 1) return forms.one;
  if (last >= 2 && last <= 4) return forms.few;
  return forms.many;
}

function applyDateMath(date, operation, amount, unit) {
  const delta = amount * (operation === "add" ? 1 : -1);
  const result = new Date(date.getTime());

  switch (unit) {
    case "seconds":
      result.setSeconds(result.getSeconds() + delta);
      break;
    case "minutes":
      result.setMinutes(result.getMinutes() + delta);
      break;
    case "hours":
      result.setHours(result.getHours() + delta);
      break;
    case "days":
      result.setDate(result.getDate() + delta);
      break;
    case "weeks":
      result.setDate(result.getDate() + delta * 7);
      break;
    case "months":
      result.setMonth(result.getMonth() + delta);
      break;
    case "years":
      result.setFullYear(result.getFullYear() + delta);
      break;
    default:
      return null;
  }

  return isValidDate(result) ? result : null;
}

function FormatRows({ date, copiedKey, onCopy }) {
  return (
    <div className="timecalc-format-list">
      {getFormats(date).map((item) => (
        <div className="timecalc-format-row" key={item.key}>
          <span className="timecalc-format-label">{item.label}</span>
          <span className="timecalc-format-value">{item.value}</span>
          <button
            type="button"
            className="timecalc-quiet-btn timecalc-copy-btn"
            onClick={() => onCopy(item.key, item.value)}
            aria-label={`Копировать ${item.label}`}
          >
            <i
              className={`bi ${copiedKey === item.key ? "bi-check-lg" : "bi-copy"}`}
            ></i>
          </button>
        </div>
      ))}
    </div>
  );
}

export function TimeCalc() {
  const [now, setNow] = useState(() => new Date());
  const [tab, setTab] = useState("math");
  const [inputValue, setInputValue] = useState(() =>
    formatLocalDateTime(new Date()),
  );
  const [startValue, setStartValue] = useState(() =>
    formatDateTimeLocalValue(new Date()),
  );
  const [operation, setOperation] = useState("add");
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState("days");
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!copiedKey) return undefined;
    const timeoutId = window.setTimeout(() => setCopiedKey(null), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [copiedKey]);

  const parsedInput = useMemo(() => parseTimeValue(inputValue), [inputValue]);
  const startDate = useMemo(
    () => parseDateTimeLocalValue(startValue),
    [startValue],
  );
  const amountNumber = Number(amount);
  const selectedUnit = units.find((item) => item.value === unit);
  const dateMathResult = useMemo(() => {
    if (!startDate || !Number.isFinite(amountNumber) || !selectedUnit) {
      return null;
    }
    return applyDateMath(startDate, operation, amountNumber, unit);
  }, [startDate, amountNumber, operation, unit, selectedUnit]);

  async function copyValue(key, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
    } catch {
      setCopiedKey(null);
    }
  }

  function useCurrentTime() {
    const current = new Date();
    setInputValue(formatLocalDateTime(current));
  }

  function useNowForMath() {
    setStartValue(formatDateTimeLocalValue(new Date()));
  }

  let dateMathError = "";
  if (!startDate) dateMathError = "Введите корректную начальную дату и время";
  else if (amount.trim() === "" || !Number.isFinite(amountNumber))
    dateMathError = "Введите корректное количество";
  else if (!dateMathResult) dateMathError = "Не получилось выполнить операцию";

  const amountLabel = selectedUnit
    ? `${operation === "add" ? "+" : "−"} ${Math.abs(amountNumber) || 0} ${pluralRu(Math.abs(amountNumber) || 0, selectedUnit)}`
    : "";

  return (
    <>
      <meta
        name="description"
        content="Калькулятор времени: Unix-метки и арифметика дат"
      ></meta>
      <NavBar />
      <div className="content">
        <div className="timecalc-now">
          <p className="timecalc-now-label">Текущее время</p>
          <p className="timecalc-now-date" aria-live="polite">
            {formatHumanRu(now)}
          </p>
          <p className="timecalc-now-unix">
            Unix: {Math.floor(now.getTime() / 1000)}
          </p>
        </div>

        <div className="timecalc-wrapper">
          <div className="timecalc-inputs">
            <h2>Калькулятор времени</h2>
            <h3>Unix-метки и арифметика дат</h3>

            <div className="timecalc-tabs">
              <button
                type="button"
                className={`timecalc-quiet-btn timecalc-tab-btn ${tab === "math" ? "active" : ""}`}
                onClick={() => setTab("math")}
              >
                Операции с датами
              </button>
              <button
                type="button"
                className={`timecalc-quiet-btn timecalc-tab-btn ${tab === "convert" ? "active" : ""}`}
                onClick={() => setTab("convert")}
              >
                Конвертер
              </button>
            </div>

            {tab === "convert" ? (
              <div className="timecalc-field">
                <label htmlFor="timecalc-source">Исходное значение</label>
                <input
                  id="timecalc-source"
                  className="timecalc-text-input"
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="1704067200 или 2024-01-01 00:00:00"
                  spellCheck="false"
                  autoComplete="off"
                />
                <span className="timecalc-hint">
                  Unix, ISO 8601, RFC 822 или ГГГГ-ММ-ДД ЧЧ:ММ:СС
                </span>
                <button
                  type="button"
                  className="timecalc-full-btn"
                  onClick={useCurrentTime}
                >
                  Использовать текущее время
                </button>
              </div>
            ) : (
              <div className="timecalc-math-fields">
                <div className="timecalc-field">
                  <label htmlFor="timecalc-start">Начальная дата и время</label>
                  <div className="timecalc-datetime-row">
                    <input
                      id="timecalc-start"
                      className="timecalc-text-input"
                      type="datetime-local"
                      step="1"
                      value={startValue}
                      onChange={(event) => setStartValue(event.target.value)}
                    />
                    <button
                      type="button"
                      className="timecalc-quiet-btn timecalc-now-btn"
                      onClick={useNowForMath}
                    >
                      Сейчас
                    </button>
                  </div>
                </div>

                <div className="timecalc-field">
                  <span className="timecalc-field-label">Операция</span>
                  <div className="timecalc-tabs">
                    <button
                      type="button"
                      className={`timecalc-quiet-btn timecalc-tab-btn ${operation === "add" ? "active" : ""}`}
                      onClick={() => setOperation("add")}
                    >
                      + Добавить
                    </button>
                    <button
                      type="button"
                      className={`timecalc-quiet-btn timecalc-tab-btn ${operation === "subtract" ? "active" : ""}`}
                      onClick={() => setOperation("subtract")}
                    >
                      − Вычесть
                    </button>
                  </div>
                </div>

                <div className="timecalc-field">
                  <label htmlFor="timecalc-amount">Количество</label>
                  <div className="timecalc-amount-row">
                    <input
                      id="timecalc-amount"
                      className="timecalc-text-input"
                      type="number"
                      min="0"
                      step="1"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                    <select
                      className="timecalc-select"
                      value={unit}
                      onChange={(event) => setUnit(event.target.value)}
                      aria-label="Единица времени"
                    >
                      {units.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="timecalc-output">
            {tab === "convert" ? (
              parsedInput ? (
                <div className="timecalc-result-card">
                  <p className="timecalc-result-kicker">Результат</p>
                  <p className="timecalc-result-title">
                    {formatHumanRu(parsedInput)}
                  </p>
                  <FormatRows
                    date={parsedInput}
                    copiedKey={copiedKey}
                    onCopy={copyValue}
                  />
                </div>
              ) : (
                <div className="timecalc-message error">
                  <p>
                    <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                    <b>Ошибка:</b> Введите корректную дату или Unix-метку
                  </p>
                </div>
              )
            ) : dateMathError ? (
              <div className="timecalc-message error">
                <p>
                  <i className="bi bi-exclamation-triangle-fill"></i>{" "}
                  <b>Ошибка:</b> {dateMathError}
                </p>
              </div>
            ) : (
              <div className="timecalc-result-card">
                <p className="timecalc-result-kicker">Результат</p>
                <p className="timecalc-result-title">
                  {formatHumanRu(dateMathResult)}
                </p>
                <p className="timecalc-result-delta">{amountLabel}</p>
                <FormatRows
                  date={dateMathResult}
                  copiedKey={copiedKey}
                  onCopy={copyValue}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TimeCalc;
