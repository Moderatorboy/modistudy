import React, { useState, useEffect } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

function App() {
  const batches = [class11, class12];

  const [darkTheme, setDarkTheme] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  const [progress, setProgress] = useState({});
  const [quote, setQuote] = useState("");

  const quotes = [
    "Success is no accident!",
    "Hard work beats talent!",
    "Push yourself, no one else will!",
    "Small steps every day!",
    "Consistency is power!",
    "Focus = Success!"
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [selectedLecture]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const toggleComplete = (lecId) => {
    const updated = { ...progress };
    updated[lecId] = !updated[lecId];
    setProgress(updated);

    localStorage.setItem("progress", JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = localStorage.getItem("progress");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const calcPercentage = () => {
    if (!selectedChapter) return 0;

    const total = selectedChapter.lectures.length;
    const done = selectedChapter.lectures.filter(l => progress[l.id]).length;

    return Math.round((done / total) * 100);
  };

  return (
    <div>
      {/* 🔥 Premium Header */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Light Mode 🌤" : "Dark Mode 🌙"}
      </button>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Navigation */}
      <div className="nav-controls">
        {selectedLecture && (
          <button onClick={() => setSelectedLecture(null)}>🔙 Back</button>
        )}
        {!selectedLecture && selectedChapter && (
          <button onClick={() => setSelectedChapter(null)}>🔙 Back</button>
        )}
        {!selectedChapter && selectedSubject && (
          <button onClick={() => setSelectedSubject(null)}>🔙 Back</button>
        )}
        {!selectedSubject && selectedBatch && (
          <button onClick={() => setSelectedBatch(null)}>🔙 Home</button>
        )}
      </div>

      {/* UI Switch */}
      {!selectedBatch ? (
        /* ------------------------- BATCHES ---------------------------- */
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => setSelectedBatch(batch)}
            >
              <div className="img-wrap">
                <img src={batch.img} alt={batch.name} />
              </div>
              <div className="meta">
                <div className="name">{batch.name}</div>
                <div className="sub">Open Subjects →</div>
              </div>
            </div>
          ))}
        </div>
      ) : !selectedSubject ? (
        /* ------------------------- SUBJECTS ---------------------------- */
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        /* ------------------------- CHAPTERS ---------------------------- */
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        /* ------------------------- LECTURES ---------------------------- */
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          <div className="progress-box">
            Progress: {calcPercentage()}%
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: calcPercentage() + "%" }}
              ></div>
            </div>
          </div>

          {/* Resources */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank">📒 Notes</a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank">📘 Sheet</a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank">📄 DPP</a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank">🎥 DPP Video</a>
            )}
          </div>

          {selectedChapter.lectures.map((lec) => (
            <button
              key={lec.id}
              className="lec-btn"
              onClick={() => setSelectedLecture(lec)}
            >
              <input
                type="checkbox"
                checked={progress[lec.id] || false}
                onChange={() => toggleComplete(lec.id)}
                onClick={(e) => e.stopPropagation()}
              />
              {lec.title}
            </button>
          ))}
        </div>
      ) : (
        /* ------------------------- VIDEO ---------------------------- */
        <div className="video-page">
          <h2>{selectedLecture.title}</h2>

          <div className="embed">
            <iframe
              src={selectedLecture.url + "&autoplay=1&mute=0"}
              title={selectedLecture.title}
              allow="autoplay; encrypted-media; fullscreen"
              sandbox="allow-same-origin allow-scripts"
              allowFullScreen
            ></iframe>
          </div>

          {/* Motivational quote */}
          <div className="quote-box">✨ {quote}</div>
        </div>
      )}
    </div>
  );
}

export default App;
