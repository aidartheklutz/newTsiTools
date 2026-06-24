import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { createQuery } from "../../components/ai";
import "./ExcuseGen.css";

let placeholderText = "Вкратце объясните ситуацию";
placeholderText =
  Math.random() <= 0.05
    ? "Я опоздал, потому что..."
    : Math.random() <= 0.1
      ? "Я не пришёл на занятия в связи с..."
      : Math.random() <= 0.15
        ? "Я неправильно повёл себя на..."
        : Math.random() <= 0.2
          ? "Мне сделали замечание из-за..."
          : Math.random() <= 0.25
            ? "Я отсутствовал на занятиях по причине..."
            : Math.random() <= 0.3
              ? "Мне аннулировали работу за..."
              : Math.random() <= 0.35
                ? "Я опоздал из-за..."
                : Math.random() <= 0.4
                  ? "Я не подготовился к..."
                  : Math.random() <= 0.8
                    ? "Меня отругали за..."
                    : "Я провинился во время...";

const r = Math.random() * 0.5;

const namePlaceholder =
  r <= 0.06
    ? "Ырысов Айдар"
    : r <= 0.08
      ? "Грейс Райланд"
      : r <= 0.1
        ? "Уотни Марк"
        : r <= 0.12
          ? "Стратт Ева"
          : r <= 0.14
            ? "Илюхина Олеся"
            : r <= 0.16
              ? "Дент Артур"
              : r <= 0.18
                ? "Префект Форд"
                : r <= 0.2
                  ? "Монтаг Гай"
                  : r <= 0.22
                    ? "Смит Уинстон"
                    : r <= 0.24
                      ? "Гордон Чарли"
                      : r <= 0.26
                        ? "Декард Рик"
                        : r <= 0.28
                          ? "Салливан Това"
                          : r <= 0.3
                            ? "Кассмор Кэмерон"
                            : r <= 0.32
                              ? "Пуаро Эркюль"
                              : r <= 0.34
                                ? "Поттер Гарри"
                                : r <= 0.36
                                  ? "Уизли Рон"
                                  : r <= 0.38
                                    ? "Раскольников Родион"
                                    : r <= 0.4
                                      ? "Карамазов Иван"
                                      : r <= 0.42
                                        ? "Скайуолкер Анакин"
                                        : r <= 0.44
                                          ? "Скайуолкер Люк"
                                          : r <= 0.46
                                            ? "Холмс Шерлок"
                                            : r <= 0.48
                                              ? "Кихот Дон"
                                              : "Бендер Остап";

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
        createQuery(
          setAiResponse,
          name,
          prompt,
          setBlockRequest,
        );
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

function Sheet({ aiResponse, setBlockRequest }) {
  const text = aiResponse?.choices?.[0]?.message?.content ?? "";

  return text ? (
    <div className="sheet-of-paper">
      <p>
        <b>Объяснительная записка</b>
      </p>

      <p>
        <FastType text={text} setBlockRequest={setBlockRequest} />
      </p>
    </div>
  ) : null;
}

export function ExcuseGen() {
  const [name, setName] = useState("NOT SET (Используй 'ФИО')");
  const [prompt, setPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [blockRequest, setBlockRequest] = useState(false);

  return (
    <>
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
