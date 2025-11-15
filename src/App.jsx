// src/App.jsx
import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import ContentTabs from "./components/ContentTabs"; // fixed ContentTabs
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  // Combine batches
  const batches = [class11, class12];

  // Filter by search
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

      {/* Search Box */}
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

      {/* Chapter Content + Lecture Tabs */}
      {selectedChapter && !selectedLecture && (
        <ContentTabs
          chapter={{
            ...selectedChapter,
            // Make notes, dpp, sheet arrays if they are strings
            notes: Array.isArray(selectedChapter.notes)
              ? selectedChapter.notes
              : selectedChapter.notes ? [selectedChapter.notes] : [],
            dpp: Array.isArray(selectedChapter.dpp)
              ? selectedChapter.dpp
              : selectedChapter.dpp ? [selectedChapter.dpp] : [],
            sheet: Array.isArray(selectedChapter.sheet)
              ? selectedChapter.sheet
              : selectedChapter.sheet ? [selectedChapter.sheet] : [],
          }}
          onSelectVideo={(lec) => setSelectedLecture(lec)}
          onBack={() => setSelectedChapter(null)}
        />
      )}

      {/* Lecture Player */}
      {selectedLecture && (
        <div className="list">
          <h2>🎬 {selectedLecture.title}</h2>
          <div className="video-container">
            <iframe
              src={selectedLecture.embed}
              title={selectedLecture.title}
              allowFullScreen
            ></iframe>
          </div>
          <button onClick={() => setSelectedLecture(null)}>🔙 Back to Chapter</button>
        </div>
      )}
    </div>
  );
}

export default App;
