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

  const quotes = [
    "Success comes from consistency.",
    "Small steps every day lead to big results.",
    "Don’t stop until you’re proud!",
    "Discipline beats motivation.",
    "Focus on improvement, not perfection.",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [selectedLecture]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  const searchLower = search.toLowerCase();
  const filteredBatches = batches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchLower) ||
      b.subjects.some((s) =>
        s.name.toLowerCase().includes(searchLower)
      ) ||
      b.subjects.some((s) =>
        s.chapters.some((c) =>
          c.name.toLowerCase().includes(searchLower)
        )
      )
  );

  const markComplete = (lecId) => {
    setCompleted((prev) => ({
      ...prev,
      [lecId]: !prev[lecId],
    }));
  };

  const chapterProgress = selectedChapter
    ? Math.round(
        (Object.keys(completed).filter((k) =>
          selectedChapter.lectures.some((l) => l.id === k && completed[k])
        ).length /
          selectedChapter.lectures.length) *
          100
      )
    : 0;

  return (
    <div>
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
        <div className="subtitle">Premium Class Portal</div>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "🌤 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Batch / Subject / Chapter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="nav">
        {selectedLecture && (
          <button onClick={() => setSelectedLecture(null)}>← Back</button>
        )}
        {!selectedLecture && selectedChapter && (
          <button onClick={() => setSelectedChapter(null)}>← Back</button>
        )}
        {!selectedChapter && selectedSubject && (
          <button onClick={() => setSelectedSubject(null)}>← Back</button>
        )}
        {!selectedSubject && selectedBatch && (
          <button onClick={() => setSelectedBatch(null)}>← Back</button>
        )}
      </div>

      {!selectedBatch ? (
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="card" onClick={() => setSelectedBatch(batch)}>
              <img src={batch.img} alt={batch.name} />
              <div className="meta">
                <div className="name">{batch.name}</div>
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

          <div className="progress">
            <div style={{ width: `${chapterProgress}%` }}></div>
          </div>
          <p className="progress-text">{chapterProgress}% Completed</p>

          {selectedChapter.lectures.map((lec) => (
            <button key={lec.id} onClick={() => setSelectedLecture(lec)}>
              {completed[lec.id] ? "✔ " : ""} {lec.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="video-page">
          <h2>{selectedLecture.title}</h2>

          <div className="embed">
            <div className="blocker"></div>
            <iframe
              src={selectedLecture.url}
              title={selectedLecture.title}
              allow="autoplay; fullscreen; encrypted-media"
              sandbox="allow-same-origin allow-scripts"
              allowFullScreen
            ></iframe>
          </div>

          <button
            className="complete-btn"
            onClick={() => markComplete(selectedLecture.id)}
          >
            {completed[selectedLecture.id] ? "✔ Marked Complete" : "Mark Complete"}
          </button>

          <p className="quote">💡 {quote}</p>
        </div>
      )}
    </div>
  );
}

export default App;
