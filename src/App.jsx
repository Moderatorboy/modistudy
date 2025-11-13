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

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* 🌟 Header */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* 🎚 Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Switch to Light Mode 🌤" : "Switch to Dark Mode 🌙"}
      </button>

      {/* 🔍 Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔙 Navigation */}
      <div style={{ width: "90%", margin: "0 auto 20px" }}>
        {selectedLecture && (
          <button className="theme-toggle" onClick={() => setSelectedLecture(null)}>🔙 Back to Chapters</button>
        )}
        {!selectedLecture && selectedChapter && (
          <button className="theme-toggle" onClick={() => setSelectedChapter(null)}>🔙 Back to Subjects</button>
        )}
        {!selectedChapter && selectedSubject && (
          <button className="theme-toggle" onClick={() => setSelectedSubject(null)}>🔙 Back to Batches</button>
        )}
        {!selectedSubject && selectedBatch && (
          <button className="theme-toggle" onClick={() => setSelectedBatch(null)}>🔙 Back to Home</button>
        )}
      </div>

      {/* 🧱 Main Display */}
      {!selectedBatch ? (
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
                <div className="sub">Tap to open subjects</div>
              </div>
            </div>
          ))}
        </div>
      ) : !selectedSubject ? (
        <div className="list" style={{ width: "90%", margin: "0 auto" }}>
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        <div className="list" style={{ width: "90%", margin: "0 auto" }}>
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        <div className="list" style={{ width: "90%", margin: "0 auto" }}>
          <h2>{selectedChapter.name}</h2>

          {/* 📘 Resources Section */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank" rel="noreferrer">📒 Notes</a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank" rel="noreferrer">📘 Sheet</a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank" rel="noreferrer">📄 DPP (PDF)</a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank" rel="noreferrer">🎥 DPP Video</a>
            )}
          </div>

          {/* 📺 Lecture Buttons */}
          {selectedChapter.lectures.map((lec) => (
            <button key={lec.id} onClick={() => setSelectedLecture(lec)}>
              {lec.title}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ width: "90%", margin: "0 auto" }}>
          <h2>{selectedLecture.title}</h2>
          <div className="embed">
            <iframe
              src={selectedLecture.url.replace("?pub=4no3cq", "")}
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
