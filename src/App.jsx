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
  const [quote, setQuote] = useState("");

  const quotes = [
    "Success = Consistency + Hard Work.",
    "Small progress is still progress.",
    "Winners focus on learning, not excuses.",
    "Do it for your future self.",
    "Discipline beats motivation."
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [selectedLecture]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  // 🔍 Search Filter: batch + subject + chapter
  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.subjects.some(s => s.name.toLowerCase().includes(search.toLowerCase())) ||
    b.subjects.some(s =>
      s.chapters.some(c => c.name.toLowerCase().includes(search.toLowerCase()))
    )
  );

  // 📊 Progress Calculation
  const completed = JSON.parse(localStorage.getItem("completed") || "{}");

  const toggleComplete = (id) => {
    const newData = { ...completed, [id]: !completed[id] };
    localStorage.setItem("completed", JSON.stringify(newData));
    window.dispatchEvent(new Event("storage"));
  };

  const chapterProgress = (chapter) => {
    const total = chapter.lectures.length;
    let done = 0;
    chapter.lectures.forEach(l => {
      if (completed[l.id]) done++;
    });
    return Math.round((done / total) * 100);
  };

  return (
    <div>
      {/* ⭐ Header */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* 🔍 Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches, subjects, chapters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🌙 Light/Dark Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Light Mode 🌤" : "Dark Mode 🌙"}
      </button>

      {/* 🔙 Back Navigation */}
      <div className="nav-area">
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
          <button onClick={() => setSelectedBatch(null)}>🔙 Back</button>
        )}
      </div>

      {/* 🅱 Main Display */}
      {!selectedBatch ? (
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => setSelectedBatch(batch)}
            >
              <img className="batch-img" src={batch.img} alt={batch.name} />
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
              <span className="progress-text">{chapterProgress(c)}%</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${chapterProgress(c)}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* 📄 Resource Links */}
          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes}>📒 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet}>📘 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp}>📄 DPP</a>}
            {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo}>🎥 DPP Video</a>}
          </div>

          {/* ▶ Lecture List */}
          {selectedChapter.lectures.map((lec) => (
            <div key={lec.id} className="lecture-row">
              <button className="lecture-btn" onClick={() => setSelectedLecture(lec)}>
                ▶ {lec.title}
              </button>

              {/* ✔️ Mark Complete */}
              <input
                type="checkbox"
                checked={completed[lec.id] || false}
                onChange={() => toggleComplete(lec.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="video-area">
          <h2>{selectedLecture.title}</h2>

          <div className="embed">
            <iframe
              src={selectedLecture.url}
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          </div>

          {/* ✨ Random Quote */}
          <p className="quote">"{quote}"</p>
        </div>
      )}
    </div>
  );
}

export default App;
