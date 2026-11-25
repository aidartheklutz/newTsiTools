import "./AiLoading.css";

export default function AiLoading() {
  return (
    <div className="ai-loading" role="status" aria-live="polite">
      <div className="ai-loading-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Создаём текст...</p>
    </div>
  );
}
