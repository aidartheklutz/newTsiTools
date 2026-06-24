import { useMemo, useRef, useState } from "react";
import NavBar from "../../components/NavBar";
import "./WordCounter.css";

const acceptedTypes = ".txt,.md,.rtf,.doc,.docx";

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripRtf(value) {
  return value
    .replace(/\\'[0-9a-fA-F]{2}/g, " ")
    .replace(/\\[a-z]+-?\d* ?/gi, " ")
    .replace(/[{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findZipEntry(bytes, fileName) {
  const decoder = new TextDecoder();

  for (let offset = 0; offset < bytes.length - 30; offset += 1) {
    if (
      bytes[offset] !== 0x50 ||
      bytes[offset + 1] !== 0x4b ||
      bytes[offset + 2] !== 0x03 ||
      bytes[offset + 3] !== 0x04
    ) {
      continue;
    }

    const view = new DataView(bytes.buffer, bytes.byteOffset + offset);
    const compression = view.getUint16(8, true);
    const compressedSize = view.getUint32(18, true);
    const fileNameLength = view.getUint16(26, true);
    const extraLength = view.getUint16(28, true);
    const nameStart = offset + 30;
    const nameEnd = nameStart + fileNameLength;
    const name = decoder.decode(bytes.slice(nameStart, nameEnd));
    const dataStart = nameEnd + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (name === fileName) {
      return { compression, data: bytes.slice(dataStart, dataEnd) };
    }

    offset = Math.max(offset, dataEnd - 1);
  }

  return null;
}

async function inflateRaw(data) {
  if (!("DecompressionStream" in window)) {
    throw new Error("Браузер не поддерживает распаковку DOCX.");
  }

  const stream = new Blob([data])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  return await new Response(stream).text();
}

async function extractDocxText(buffer) {
  const bytes = new Uint8Array(buffer);
  const entry = findZipEntry(bytes, "word/document.xml");

  if (!entry) throw new Error("Не получилось найти текст внутри DOCX.");

  const xml =
    entry.compression === 0
      ? new TextDecoder().decode(entry.data)
      : await inflateRaw(entry.data);

  return decodeXml(
    xml
      .replace(/<\/w:p>/g, "\n")
      .replace(/<w:tab\/>/g, "\t")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

async function readDroppedFile(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "docx") {
    return await extractDocxText(await file.arrayBuffer());
  }

  const text = await file.text();

  if (extension === "rtf") return stripRtf(text);
  if (extension === "doc") {
    return text
      .replace(/[^\t\n\r -~А-Яа-яЁё]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return text;
}

function getStats(text) {
  const trimmed = text.trim();
  const words = trimmed.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? [];
  const sentences =
    trimmed
      .match(/[^.!?…]+[.!?…]+|[^.!?…]+$/gu)
      ?.filter((item) => item.trim()) ?? [];
  const readingMinutes = words.length
    ? Math.max(1, Math.ceil(words.length / 180))
    : 0;

  return {
    words: words.length,
    chars: text.length,
    sentences: sentences.length,
    readingMinutes,
  };
}

function StatBox({ label, value }) {
  return (
    <div className="wordcounter-stat">
      <span>{value}</span>
      <p>{label}</p>
    </div>
  );
}

export function WordCounter() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [notice, setNotice] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef(null);
  const stats = useMemo(() => getStats(text), [text]);

  async function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;

    setNotice("Читаю файл...");
    setFileName(file.name);

    try {
      const nextText = await readDroppedFile(file);
      setText(nextText);
      setNotice(
        nextText
          ? "Текст из файла добавлен."
          : "Файл прочитан, но текст пустой.",
      );
    } catch (error) {
      setNotice(error.message);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function clearText() {
    setText("");
    setFileName("");
    setNotice("");
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <>
      <NavBar />
      <div className="content">
        <div className="wordcounter-wrapper">
          <div className="wordcounter-inputs">
            <h2>Счётчик слов</h2>
            <h3>Вставьте текст или загрузите документ</h3>

            <textarea
              className="wordcounter-textarea"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Вставьте сюда текст работы, эссе или конспекта..."
            />

            <div
              className={`wordcounter-dropzone ${isDragging ? "wordcounter-dropzone-active" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInput.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  fileInput.current?.click();
              }}
            >
              <i className="bi bi-file-earmark-arrow-up-fill"></i>
              <p>{fileName || "DOC, DOCX, RTF, MD или TXT"}</p>
              <span>Перетащите файл сюда или нажмите для выбора</span>
            </div>

            <input
              ref={fileInput}
              className="wordcounter-file-input"
              type="file"
              accept={acceptedTypes}
              onChange={(event) => handleFiles(event.target.files)}
            />

            <div className="wordcounter-actions">
              <button className="wordcounter-button" onClick={clearText}>
                Очистить
              </button>
            </div>

            {notice ? <p className="wordcounter-notice">{notice}</p> : null}
          </div>

          <div className="wordcounter-output">
            <div className="wordcounter-paper">
              <p>
                <b>Результат</b>
              </p>

              <div className="wordcounter-stats">
                <StatBox label="слов" value={stats.words} />
                <StatBox label="символов" value={stats.chars} />
                <StatBox label="предложений" value={stats.sentences} />
                <StatBox label="мин. чтения" value={stats.readingMinutes} />
              </div>

              <div className="wordcounter-preview">
                {text ? text.slice(0, 900) : ""}
                {text.length > 900 ? "..." : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
