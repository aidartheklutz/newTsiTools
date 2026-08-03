import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import "./EndTimer.css";

const schedule = [
  { label: "ПАРА 1", start: "08:00", end: "09:20", type: "lesson" },
  { label: "ПЕРЕМЕНА", start: "09:20", end: "09:30", type: "break" },
  { label: "ПАРА 2", start: "09:30", end: "10:50", type: "lesson" },
  {
    label: "Большая перемена",
    start: "10:50",
    end: "11:40",
    type: "break",
  },
  { label: "ПАРА 3", start: "11:40", end: "13:00", type: "lesson" },
  { label: "ПЕРЕМЕНА", start: "13:00", end: "13:10", type: "break" },
  { label: "ПАРА 4", start: "13:10", end: "14:30", type: "lesson" },
  { label: "ПЕРЕМЕНА", start: "14:30", end: "14:40", type: "break" },
  { label: "ПАРА 5", start: "14:40", end: "16:00", type: "lesson" },
  { label: "ПЕРЕМЕНА", start: "16:00", end: "16:10", type: "break" },
  { label: "ПАРА 6", start: "16:10", end: "17:30", type: "lesson" },
  { label: "ПЕРЕМЕНА", start: "17:30", end: "17:40", type: "break" },
  { label: "ПАРА 7", start: "17:40", end: "19:00", type: "lesson" },
];

function secondsFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );
  const remainingSeconds = String(safeSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${remainingSeconds}`;
}

function getBishkekTime(now) {
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Bishkek",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return {
    seconds:
      Number(values.hour) * 3600 +
      Number(values.minute) * 60 +
      Number(values.second),
    display: `${values.hour}:${values.minute}:${values.second}`,
  };
}

function getTimerState(now) {
  const bishkekTime = getBishkekTime(now);
  const activeSlot = schedule.find(
    (slot) =>
      bishkekTime.seconds >= secondsFromTime(slot.start) &&
      bishkekTime.seconds < secondsFromTime(slot.end),
  );

  if (!activeSlot) return { isActive: false, bishkekTime };

  return {
    isActive: true,
    bishkekTime,
    slot: activeSlot,
    secondsLeft: secondsFromTime(activeSlot.end) - bishkekTime.seconds,
  };
}

export default function EndTimer() {
  const [now, setNow] = useState(() => new Date());
  const timer = getTimerState(now);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <>
      <meta name="description" content="Таймер до конца пары или перемены" />
      <NavBar />
      <main className="content endtimer-page">
        {timer.isActive ? (
          <section
            className={`endtimer-card ${timer.slot.type === "break" ? "endtimer-card-break" : ""}`}
            aria-live="polite"
          >
            <p className="endtimer-heading">До конца</p>
            <time className="endtimer-countdown">
              {formatDuration(timer.secondsLeft)}
            </time>
            <div className="endtimer-details">
              <span>{timer.slot.label}</span>
              <span aria-hidden="true">|</span>
              <span>{timer.bishkekTime.display}</span>
            </div>
          </section>
        ) : (
          <section className="endtimer-card endtimer-card-finished">
            <p>Пары не идут! Ура!</p>
          </section>
        )}
      </main>
    </>
  );
}
