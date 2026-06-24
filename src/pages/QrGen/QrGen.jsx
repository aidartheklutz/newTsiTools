import React, { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import NavBar from "../../components/NavBar";
import "./QrGen.css";

export default function QrGen() {
  const [text, setText] = useState("tsitools.vercel.app");
  const [rounded, setRounded] = useState(true);
  const [size, setSize] = useState(256);
  const qrRef = useRef(null);

  useEffect(() => {
    if (!qrRef.current) return;

    // Clear previous elements
    qrRef.current.innerHTML = "";

    if (!text.trim()) return;

    if (window.QRCode) {
      try {
        // Convert Unicode/Cyrillic strings to UTF-8 representation for compatibility with qrcodejs
        const utf8Text = unescape(encodeURIComponent(text));

        new window.QRCode(qrRef.current, {
          text: utf8Text,
          width: size,
          height: size,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.H,
        });
      } catch (error) {
        console.error("Failed to generate QR Code:", error);
      }
    }
  }, [text, size]);

  const handleDownload = () => {
    const node = document.getElementById("qr-preview-download-target");
    if (!node || !text.trim()) return;

    toPng(node, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `qr-code-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading QR Code image:", error);
      });
  };

  return (
    <>
      <NavBar />
      <div className="content">
        <div className="qr-wrapper">
          <div className="qr-inputs">
            <h2>Генератор QR</h2>
            <h3>Создайте QR-код для ссылки или текста</h3>

            <textarea
              className="qr-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите ссылку или текст для генерации QR-кода..."
            />

            <div className="qr-option-group">
              <label className="qr-checkbox-label">
                <input
                  type="checkbox"
                  checked={rounded}
                  onChange={(e) => setRounded(e.target.checked)}
                />
                Скруглить углы
              </label>

              <label className="qr-select-label">
                Размер кода (пиксели)
                <select
                  className="qr-select"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                >
                  <option value={128}>128 x 128</option>
                  <option value={256}>256 x 256</option>
                  <option value={512}>512 x 512</option>
                </select>
              </label>
            </div>
          </div>

          <div className="qr-output">
            <div className="qr-paper">
              <p>
                <b className="qr-result-text">Результат</b>
              </p>

              <div className="qr-preview-container">
                {text.trim() ? (
                  <div
                    id="qr-preview-download-target"
                    className={`qr-preview-box ${rounded ? "rounded" : ""}`}
                  >
                    <div ref={qrRef} />
                  </div>
                ) : (
                  <div className="qr-placeholder-text">
                    Здесь появится ваш QR-код
                  </div>
                )}
              </div>

              {text.trim() && (
                <button className="qr-download-button" onClick={handleDownload}>
                  <i className="bi bi-download"></i> Скачать изображение
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
