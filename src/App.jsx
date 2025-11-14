import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // NEW: completion tracker
  const [completed, setCompleted] = useState({});

  const quotes = [
    "Success comes to those who keep moving.",
    "Be stronger than your excuses.",
    "Hard work beats talent.",
    "Focus. Study. Win.",
    "Don't stop until you're proud.",
  ];

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const toggleComplete = (lecId) => {
    setCompleted((old) => ({ ...old, [lecId]: !old[lecId] }));
  };

  const batches = [class11, class12];

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Percentage calculation
  const chapterLectures = selectedChapter?.lectures || [];
  const completedCount = chapterLectures.filter((l) => completed[l.id]).length;
  const percent =
    chapterLectures.length > 0
      ? Math.round((completedCount / chapterLectures.length) * 100)
      : 0;

  return (
    <div>
      {/* TOP HEADER */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>

        {/* THEME BUTTON */}
        <button className="theme-toggle small" onClick={toggleTheme}>
          {darkTheme ? "Light 🌤" : "Dark 🌙"}
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches, subjects, chapters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Navigation */}
      <div style={{ width: "90%", margin: "0 auto 20px" }}>
        {selectedLecture && (
          <button className="theme-toggle" onClick={() => setSelectedLecture(null)}>
            🔙 Back to Chapters
          </button>
        )}
        {!selectedLecture && selectedChapter && (
          <button className="theme-toggle" onClick={() => setSelectedChapter(null)}>
            🔙 Back to Subjects
          </button>
        )}
        {!selectedChapter && selectedSubject && (
          <button className="theme-toggle" onClick={() => setSelectedSubject(null)}>
            🔙 Back to Batches
          </button>
        )}
        {!selectedSubject && selectedBatch && (
          <button className="theme-toggle" onClick={() => setSelectedBatch(null)}>
            🔙 Back Home
          </button>
        )}
      </div>

      {/* MAIN UI */}
      {!selectedBatch ? (
        // BATCHES
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => setSelectedBatch(batch)}
            >
              <img src={batch.img} alt={batch.name} className="batch-img" />
              <div className="meta">
                <div className="name">{batch.name}</div>
                <div className="sub">Tap to open subjects</div>
              </div>
            </div>
          ))}
        </div>
      ) : !selectedSubject ? (
        // SUBJECTS
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        // CHAPTERS
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        // CHAPTER VIEW + Progress + Notes
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* Resources */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank">
                📒 Notes
              </a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank">
                📘 Sheet
              </a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank">
                📄 DPP (PDF)
              </a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank">
                🎥 DPP Video
              </a>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progress-box">
            <div className="progress-label">
              Progress: {percent}% ({completedCount}/{chapterLectures.length})
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: percent + "%" }}></div>
            </div>
          </div>

          {/* Lecture List */}
          {selectedChapter.lectures.map((lec) => (
            <div key={lec.id} className="lecture-item">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={completed[lec.id] || false}
                  onChange={() => toggleComplete(lec.id)}
                />
                <span onClick={() => setSelectedLecture(lec)} className="lec-title">
                  {lec.title}
                </span>
              </label>

              {/* Quote */}
              <div className="quote">
                {quotes[Math.floor(Math.random() * quotes.length)]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // VIDEO PLAYER
        <div className="video-box">
          <h2>{selectedLecture.title}</h2>
          <div className="embed">
            <iframe
              src={selectedLecture.url}
              title={selectedLecture.title}
              allow="autoplay; fullscreen; encrypted-media"
              sandbox="allow-same-origin allow-scripts allow-presentation"
              referrerPolicy="no-referrer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
