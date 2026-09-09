import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { createQuery } from "../../components/ai";
import "./ExcuseGen.css";

const placeholderTexts = [
  "Я опоздал, потому что...",
  "Я не пришёл на занятия в связи с...",
  "Я неправильно повёл себя на...",
  "Мне сделали замечание из-за...",
  "Я отсутствовал на занятиях по причине...",
  "Мне аннулировали работу за...",
  "Я опоздал из-за...",
  "Я не подготовился к...",
  "Меня отругали за...",
  "Я провинился во время...",
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
  setOutputLanguage,
}) {
  function setInput() {
    setPrompt(event.target.value);
  }

  function sendMessage() {
    if (!blockRequest) {
      if (prompt != "") {
        setBlockRequest(true);
        createQuery(setAiResponse, name, prompt, setBlockRequest, language);
        setOutputLanguage(language);
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

function Sheet({ aiResponse, setBlockRequest, language }) {
  const text = aiResponse?.choices?.[0]?.message?.content ?? "";
  const title =
    language === "английский" ? "Explanatory note" : "Объяснительная записка";

  return text ? (
    <div className="sheet-of-paper">
      <p>
        <b>{title}</b>
      </p>

      <p>
        <FastType text={text} setBlockRequest={setBlockRequest} />
      </p>
    </div>
  ) : null;
}

export function ExcuseGen() {
  const [name, setName] = useState("NOT SET (Используй [ФИО]");
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("русский");
  const [outputLanguage, setOutputLanguage] = useState("русский");
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
              <h2>Что произошло?</h2>
              <h3>Вкратце объясните ситуацию</h3>
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
                setOutputLanguage={setOutputLanguage}
              />
            </div>
          </div>
          <div className="ai-output">
            <Sheet
              aiResponse={aiResponse}
              setBlockRequest={setBlockRequest}
              language={outputLanguage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
