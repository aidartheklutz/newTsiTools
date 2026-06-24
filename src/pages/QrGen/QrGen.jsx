import React, { useState, useEffect, useRef } from "react";
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
    if (!text.trim() || !qrRef.current) return;

    const originalCanvas = qrRef.current.querySelector("canvas");
    if (!originalCanvas) {
      console.error("Original canvas not found");
      return;
    }

    try {
      const padding = size * 0.08; // 8% padding
      const totalSize = size + padding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = totalSize;
      canvas.height = totalSize;
      const ctx = canvas.getContext("2d");

      // Draw white background
      ctx.fillStyle = "#ffffff";

      if (rounded) {
        const radius = totalSize * 0.08; // 8% of total size
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(totalSize - radius, 0);
        ctx.quadraticCurveTo(totalSize, 0, totalSize, radius);
        ctx.lineTo(totalSize, totalSize - radius);
        ctx.quadraticCurveTo(
          totalSize,
          totalSize,
          totalSize - radius,
          totalSize,
        );
        ctx.lineTo(radius, totalSize);
        ctx.quadraticCurveTo(0, totalSize, 0, totalSize - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fill();
        ctx.clip();
      } else {
        ctx.fillRect(0, 0, totalSize, totalSize);
      }

      // Draw the QR code canvas
      ctx.drawImage(originalCanvas, padding, padding, size, size);

      // Trigger download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export QR code image:", error);
    }
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
