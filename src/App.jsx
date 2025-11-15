import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import ContentTabs from "./components/ContentTabs";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const batches = [class11, class12];

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  return (
    <div>
      <div className="hero">
        <h1 className="logo">✨ Modestudy Premium ✨</h1>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "🌤 Light Mode" : "🌙 Dark Mode"}
      </button>

      {!selectedBatch && (
        <div className="grid">
          {batches.map((b) => (
            <div key={b.id} className="card" onClick={() => setSelectedBatch(b)}>
              <img src={b.img} alt={b.name} />
              <div className="meta">
                <div className="name">{b.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBatch && !selectedSubject && (
        <div className="list">
          <h2>{selectedBatch.name} — Subjects</h2>
          {selectedBatch.subjects.map((s) => (
            <button key={s.id} onClick={() => setSelectedSubject(s)}>
              {s.name}
            </button>
          ))}
          <button onClick={() => setSelectedBatch(null)}>🔙 Back to Batches</button>
        </div>
      )}

      {selectedSubject && !selectedChapter && (
        <div className="list">
          <h2>{selectedSubject.name} — Chapters</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
          <button onClick={() => setSelectedSubject(null)}>🔙 Back to Subjects</button>
        </div>
      )}

      {selectedChapter && (
        <ContentTabs chapter={selectedChapter} onBack={() => setSelectedChapter(null)} />
      )}
    </div>
  );
}

export default App;
