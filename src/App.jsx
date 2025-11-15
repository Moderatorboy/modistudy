import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  // Combine class11 and class12 into batches
  const batches = [...class11, ...class12];

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="hero">
        <h1 className="logo">✨ Modestudy Premium ✨</h1>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "🌤 Light Mode" : "🌙 Dark Mode"}
      </button>

      {!selectedBatch && (
        <div className="search-box">
          <input
            type="text"
            placeholder="🔎 Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Batch Grid */}
      {!selectedBatch && (
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => setSelectedBatch(batch)}
            >
              <img src={batch.img} alt={batch.name} />
              <div className="meta">
                <div className="name">{batch.name}</div>
                <div className="sub">📚 Tap to open subjects</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subject List */}
      {selectedBatch && !selectedSubject && (
        <div className="list">
          <h2>📘 {selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name} — View Chapters
            </button>
          ))}
          <button onClick={() => setSelectedBatch(null)}>🔙 Back to Batches</button>
        </div>
      )}

      {/* Chapter List */}
      {selectedSubject && !selectedChapter && (
        <div className="list">
          <h2>📗 {selectedSubject.name} — Chapters</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name} — View Resources
            </button>
          ))}
          <button onClick={() => setSelectedSubject(null)}>🔙 Back to Subjects</button>
        </div>
      )}

      {/* Lecture + Notes/Sheet/DPP/DPP Video */}
      {selectedChapter && (
        <div className="list">
          <h2>🎬 {selectedChapter.name}</h2>

          {/* Resources */}
          <div className="resources">
            {selectedChapter.notes &&
              selectedChapter.notes.map((note, i) => (
                <a key={i} href={note} target="_blank" rel="noopener noreferrer">
                  📄 Notes PDF
                </a>
              ))}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank" rel="noopener noreferrer">
                📑 Sheet PDF
              </a>
            )}
            {selectedChapter.dpp &&
              selectedChapter.dpp.map((dpp, i) => (
                <a key={i} href={dpp} target="_blank" rel="noopener noreferrer">
                  🧩 DPP PDF
                </a>
              ))}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank" rel="noopener noreferrer">
                🎥 DPP Video
              </a>
            )}
          </div>

          {/* Lecture Videos */}
          {selectedChapter.lectures &&
            selectedChapter.lectures.map((lec) => (
              <div key={lec.id} className="lecture-card">
                <h3>{lec.title}</h3>
                <div className="video-container">
                  <iframe src={lec.embed} title={lec.title} allowFullScreen></iframe>
                </div>
              </div>
            ))}

          <button onClick={() => setSelectedChapter(null)}>🔙 Back to Chapters</button>
        </div>
      )}
    </div>
  );
}

export default App;
