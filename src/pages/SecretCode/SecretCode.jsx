import React, { useState, useRef, useEffect } from "react";

export function SecretCode() {
  const [history, setHistory] = useState([
    "Добро пожаловать в ЭТАП 2.2.",
    "Введите ключ для продолжения...",
    "",
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const correctKey = "манеры лицо мужчины";

  const poem = [
    "Стоит на парте небольшой,",
    "Но внутри бардак такой:",
    "Ручка есть — но не сейчас,",
    "Она исчезла в тот же час.",
    "И ластик был… и след простыл,",
    "Как будто кто-то пошутил.",
    "А замазка — вот беда —",
    "Жила там будто бы всегда,",
    "Но стоит только ей нужна —",
    "Её как будто нету, да.",
    "В нём всё есть… и ничего.",
    "Найди ответ - открой его.",
  ];

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const next = [...history, `> ${currentInput}`];

    if (currentInput.trim() === correctKey) {
      next.push(...poem);
      setIsUnlocked(true);
    } else {
      next.push("КЛЮЧ НЕВЕРНЫЙ");
    }

    setHistory(next);
    setCurrentInput("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        color: "#00ff00",
        fontFamily: "monospace",
        display: "flex",
        justifyContent: "center",
        padding: 20,
        overflow: "auto",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#00ff00",
          fontFamily: "monospace",
          display: "flex",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div style={{ width: "100%", maxWidth: 800 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h1 style={{ margin: 0, letterSpacing: 3 }}>
              KINGSMAN: FINAL CHALLENGE
            </h1>
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              TERMINAL v6.7 • CLASSIFIED ACCESS
            </div>
          </div>

          {/* Terminal */}
          <div
            ref={terminalRef}
            style={{
              background: "#050505",
              border: "1px solid #00aa00",
              padding: 16,
              height: "60vh",
              overflowY: "auto",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {history.map((line, i) => (
              <div key={i} style={{ marginBottom: line ? 4 : 12 }}>
                {line}
              </div>
            ))}

            {isUnlocked && (
              <div style={{ marginTop: 20, color: "#00ff88" }}>
                ДОСТУП РАЗРЕШЁН
              </div>
            )}
          </div>

          {/* Input */}
          {!isUnlocked && (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                marginTop: 10,
                border: "1px solid #00aa00",
                background: "#050505",
                padding: "10px",
              }}
            >
              <span style={{ marginRight: 10 }}>{">"}</span>
              <input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#00ff00",
                  fontFamily: "monospace",
                }}
              />
            </form>
          )}

          {isUnlocked && (
            <div style={{ marginTop: 10, textAlign: "center" }}>
              ПОЗДРАВЛЯЕМ, АГЕНТ. ВЫПОЛНИТЕ ДЕЙСТВИЕ ИЗ ЗАГАДКИ.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
