import { useEffect, useState } from "react";
import "./AiLimitModal.css";

function formatTimeLeft(milliseconds) {
  const totalMinutes = Math.max(1, Math.ceil(milliseconds / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} мин`;
  if (minutes === 0) return `${hours} ч`;
  return `${hours} ч ${minutes} мин`;
}

export default function AiLimitModal({ millisecondsLeft, onClose }) {
  const [timeLeft, setTimeLeft] = useState(millisecondsLeft);

  useEffect(() => {
    const startedAt = Date.now();
    const updateTimeLeft = () => {
      setTimeLeft(Math.max(0, millisecondsLeft - (Date.now() - startedAt)));
    };

    const interval = window.setInterval(updateTimeLeft, 60000);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [millisecondsLeft, onClose]);

  return (
    <div className="ai-limit-backdrop" role="presentation">
      <div
        className="ai-limit-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ai-limit-title"
        aria-describedby="ai-limit-description"
      >
        <div className="ai-limit-icon" aria-hidden="true">
          <i className="bi bi-hourglass-split"></i>
        </div>
        <h2 id="ai-limit-title">Лимит запросов достигнут</h2>
        <p id="ai-limit-description">
          Вы использовали 5 успешных AI-запросов за последние 18 часов.
        </p>
        <p className="ai-limit-time">
          {timeLeft > 0 ? (
            <>
              Следующий запрос будет доступен через <b>{formatTimeLeft(timeLeft)}</b>.
            </>
          ) : (
            "Лимит обновлён. Можно отправить новый запрос."
          )}
        </p>
        <button type="button" onClick={onClose} autoFocus>
          Понятно
        </button>
      </div>
    </div>
  );
}
