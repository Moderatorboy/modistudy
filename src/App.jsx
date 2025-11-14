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
  const [progress, setProgress] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);

  const batches = [class11, class12];

  // THEME
  useEffect(() => {
    document.body.classList.toggle("alt-theme", !darkTheme);
  }, [darkTheme]);

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // WATCH PROGRESS MARK
  const toggleWatch = (lecId) => {
    setProgress((p) => {
      const updated = { ...p, [lecId]: !p[lecId] };
      localStorage.setItem("watchProgress", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem("watchProgress") || "{}");
    setProgress(loaded);
  }, []);

  // WHEN VIDEO LOADS → auto hide recommendations
  const onVideoLoad = () => {
    setTimeout(() => {
      setShowOverlay(true);
    }, 1000);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="top-header">
        <h1 className="logo">Modestudy</h1>

        {/* Toggle */}
        <button className="theme-toggle" onClick={() => setDarkTheme(!darkTheme)}>
          {darkTheme ? "🌤" : "🌙"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches, subjects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BACK NAVIGATION */}
      <div className="nav-back">
        {selectedLecture && (
          <button onClick={() => setSelectedLecture(null)}>← Back to Lectures</button>
        )}
        {!selectedLecture && selectedChapter && (
          <button onClick={() => setSelectedChapter(null)}>← Back to Subjects</button>
        )}
        {!selectedChapter && selectedSubject && (
          <button onClick={() => setSelectedSubject(null)}>← Back to Batches</button>
        )}
        {!selectedSubject && selectedBatch && (
          <button onClick={() => setSelectedBatch(null)}>← Home</button>
        )}
      </div>

      {/* MAIN UI */}
      {!selectedBatch ? (
        // ==== BATCH LIST ====
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="card" onClick={() => setSelectedBatch(batch)}>
              <img className="card-img" src={batch.img} alt={batch.name} />
              <div className="meta">
                <div className="name">{batch.name}</div>
                <div className="sub">Tap to view subjects</div>
              </div>
            </div>
          ))}
        </div>
      ) : !selectedSubject ? (
        // ==== SUBJECT LIST ====
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((s) => (
            <button key={s.id} className="item-btn" onClick={() => setSelectedSubject(s)}>
              {s.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        // ==== CHAPTER LIST ====
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} className="item-btn" onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        // ==== LECTURE LIST ====
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* RESOURCES */}
          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes} target="_blank">📒 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet} target="_blank">📘 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp} target="_blank">📄 DPP</a>}
            {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo} target="_blank">🎥 DPP Video</a>}
          </div>

          {/* LECTURES */}
          {selectedChapter.lectures.map((lec) => (
            <button key={lec.id} className="lecture-btn" onClick={() => setSelectedLecture(lec)}>
              <span className="lec-title">{lec.title}</span>
              <input
                type="checkbox"
                checked={progress[lec.id] || false}
                onChange={() => toggleWatch(lec.id)}
              />
            </button>
          ))}
        </div>
      ) : (
        // ==== VIDEO PLAYER ====
        <div className="video-box">
          <h2>{selectedLecture.title}</h2>

          <div className="player-wrapper">
            <iframe
              className="player"
              src={selectedLecture.url}
              onLoad={onVideoLoad}
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>

            {/* AUTO NO-RECOMMENDATION OVERLAY */}
            {showOverlay && <div className="overlay-block"></div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
