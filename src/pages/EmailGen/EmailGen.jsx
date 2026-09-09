import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { createQueryEmail } from "../../components/ai";
import "./EmailGen.css";

const placeholderTexts = [
  "Я хочу объяснить...",
  "Мне нужно спросить...",
  "Я хочу спросить...",
  "Я хочу спросить...",
  "Я хочу попросить...",
  "Мне нужно продлить...",
  "Мне надо отправить...",
  "Я попрошу...",
  "Я должен скинуть...",
];

const placeholderText =
  placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)];

const names = [
  "Ырысов Айдар",
  "Грейс Райланд",
  "Уотни Марк",
  "Стратт Ева",
  "Илюхина Олеся",
  "Дент Артур",
  "Префект Форд",
  "Монтаг Гай",
  "Смит Уинстон",
  "Гордон Чарли",
  "Декард Рик",
  "Салливан Това",
  "Кассмор Кэмерон",
  "Пуаро Эркюль",
  "Поттер Гарри",
  "Уизли Рон",
  "Раскольников Родион",
  "Карамазов Иван",
  "Скайуолкер Анакин",
  "Скайуолкер Люк",
  "Холмс Шерлок",
  "Кихот Дон",
  "Бендер Остап",
];

const namePlaceholder = names[Math.floor(Math.random() * names.length)];

function NameInput({ setName }) {
  function setInput() {
    setName(event.target.value);
  }

  return (
    <input
      placeholder={namePlaceholder}
      className="name-input"
      onChange={setInput}
    />
  );
}

function QueryInput({
  setPrompt,
  prompt,
  name,
  language,
  setLanguage,
  setAiResponse,
  blockRequest,
  setBlockRequest,
}) {
  function setInput() {
    setPrompt(event.target.value);
  }

  function sendMessage() {
    if (!blockRequest) {
      if (prompt != "") {
        setBlockRequest(true);
        createQueryEmail(setAiResponse, name, prompt, setBlockRequest, language);
      }
    }
  }

  return (
    <div className="query-input-wrapper">
      <textarea
        cols="50"
        rows="10"
        placeholder={placeholderText}
        className="query-input"
        onChange={setInput}
      />
      <label className="language-select-label">
        Язык текста
        <select
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="русский">Русский</option>
          <option value="английский">English</option>
        </select>
      </label>
      <button className="query-input-button" onClick={sendMessage}>
        Создать текст
      </button>
    </div>
  );
}

function FastType({ text, setBlockRequest }) {
  setBlockRequest(true);
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      i += 3; // кусочки текста
      setDisplay(text.slice(0, i));

      if (i >= text.length) clearInterval(interval);
    }, 5); // скорость печати

    return () => clearInterval(interval);
  }, [text]);

  setBlockRequest(false);
  return <span>{display}</span>;
}

function parseEmailResponse(raw) {
  const text = (raw ?? "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  if (!text) return { subject: "", body: "" };

  const unfenced = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  const tryParse = (candidate) => {
    try {
      const parsed = JSON.parse(candidate);
      if (!parsed || typeof parsed !== "object") return null;

      const subject = parsed.subject;
      const body = parsed.body;
      if (typeof subject === "string" && typeof body === "string" && body) {
        return {
          subject: subject.replace(/^(Subject|Тема)\s*:\s*/i, "").trim(),
          body,
        };
      }
    } catch {
      return null;
    }
    return null;
  };

  const direct = tryParse(unfenced);
  if (direct) return direct;

  const objectMatch = unfenced.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    const extracted = tryParse(objectMatch[0]);
    if (extracted) return extracted;
  }

  return { subject: "", body: text };
}

function Sheet({ aiResponse, setBlockRequest }) {
  const raw = aiResponse?.choices?.[0]?.message?.content ?? "";
  const { subject, body } = parseEmailResponse(raw);

  return body ? (
    <div className="sheet-of-paper">
      <p>
        <b>Subject: {subject}</b>
      </p>

      <p>
        <FastType text={body} setBlockRequest={setBlockRequest} />
      </p>
    </div>
  ) : null;
}

export function EmailGen() {
  const [name, setName] = useState("NOT SET (Используй [ФИО]");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("русский");
  const [aiResponse, setAiResponse] = useState(null);
  const [blockRequest, setBlockRequest] = useState(false);

  return (
    <>
      <meta
        name="description"
        content="Генератор объяснительных записок"
      ></meta>
      <NavBar />
      <div className="content">
        <div className="wrapper">
          <div className="inputs-wrapper">
            <h2>Ваше полное имя</h2>

            <div>
              <NameInput setName={setName} />
            </div>
            <br />
            <div>
              <h2>Что вы хотите написать?</h2>
              <h3>Вкратце объясните ваше сообщение</h3>
            </div>
            <div>
              <QueryInput
                setPrompt={setPrompt}
                prompt={prompt}
                name={name}
                language={language}
                setLanguage={setLanguage}
                setAiResponse={setAiResponse}
                blockRequest={blockRequest}
                setBlockRequest={setBlockRequest}
              />
            </div>
          </div>
          <div className="ai-output">
            <Sheet aiResponse={aiResponse} setBlockRequest={setBlockRequest} />
          </div>
        </div>
      </div>
    </>
  );
}
