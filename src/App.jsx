import React, { useState, useEffect } from "react";
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
  const [completed, setCompleted] = useState({});
  const [quote, setQuote] = useState("");

  const quotesList = [
    "Success doesn’t come from what you do occasionally.",
    "Small progress is still progress.",
    "Focus is your superpower.",
    "Consistency beats talent.",
    "One lecture at a time. Keep going."
  ];

  useEffect(() => {
    setQuote(quotesList[Math.floor(Math.random() * quotesList.length)]);
  }, [selectedLecture]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleComplete = (lecId) => {
    const updated = { ...completed, [lecId]: !completed[lecId] };
    setCompleted(updated);
    localStorage.setItem("progress", JSON.stringify(updated));
  };

  useEffect(() => {
    const saved = localStorage.getItem("progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const chapterProgress = selectedChapter
    ? Math.floor(
        (selectedChapter.lectures.filter(l => completed[l.id]).length /
          selectedChapter.lectures.length) *
          100
      )
    : 0;

  return (
    <div className="main-container">
      <header className="hero">
        <h1 className="logo">Modestudy</h1>
      </header>

      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Light Mode 🌤" : "Dark Mode 🌙"}
      </button>

      {/* SEARCH BAR */}
      {!selectedBatch && (
        <div className="search-box">
          <input
            type="text"
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* BACK BUTTONS */}
      <div className="nav-back">
        {selectedLecture && (
          <button onClick={() => setSelectedLecture(null)}>⬅ Back</button>
        )}
        {!selectedLecture && selectedChapter && (
          <button onClick={() => setSelectedChapter(null)}>⬅ Back</button>
        )}
        {!selectedChapter && selectedSubject && (
          <button onClick={() => setSelectedSubject(null)}>⬅ Back</button>
        )}
        {!selectedSubject && selectedBatch && (
          <button onClick={() => setSelectedBatch(null)}>⬅ Home</button>
        )}
      </div>

      {/* BATCHES */}
      {!selectedBatch ? (
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
                <div className="sub">Tap to open subjects</div>
              </div>
            </div>
          ))}
        </div>
      ) : !selectedSubject ? (
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((s) => (
            <button key={s.id} onClick={() => setSelectedSubject(s)}>
              {s.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((c) => (
            <button key={c.id} onClick={() => setSelectedChapter(c)}>
              {c.name}
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          <div className="progress-bar">
            <div style={{ width: `${chapterProgress}%` }}></div>
          </div>
          <p className="progress-text">{chapterProgress}% completed</p>

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
          </div>

          {/* Lecture List */}
          {selectedChapter.lectures.map((lec) => (
            <div className="lecture-row" key={lec.id}>
              <input
                type="checkbox"
                checked={!!completed[lec.id]}
                onChange={() => toggleComplete(lec.id)}
              />
              <button
                className="lec-btn"
                onClick={() => setSelectedLecture(lec)}
              >
                {lec.title}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="video-page">
          <h2>{selectedLecture.title}</h2>

          <p className="quote">💡 {quote}</p>

          <div className="embed">
            <iframe
              src={selectedLecture.url.replace("?pub=4no3cq", "")}
              allow="autoplay; fullscreen; encrypted-media"
              sandbox="allow-same-origin allow-scripts allow-presentation"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
