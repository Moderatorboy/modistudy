import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [search, setSearch] = useState("");

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  // Filter batches by search
  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* 🌟 HEADER */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* 🎚 Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Switch to Light Mode 🌤" : "Switch to Dark Mode 🌙"}
      </button>

      {/* 🔍 Search */}
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

      {/* 🧱 Batch List */}
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
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name} — View Chapters
            </button>
          ))}
          <button
            className="theme-toggle"
            style={{ marginTop: "20px" }}
            onClick={() => setSelectedBatch(null)}
          >
            🔙 Back to Batches
          </button>
        </div>
      ) : !selectedChapter ? (
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name} — View Resources
            </button>
          ))}
          <button
            className="theme-toggle"
            style={{ marginTop: "20px" }}
            onClick={() => setSelectedSubject(null)}
          >
            🔙 Back to Subjects
          </button>
        </div>
      ) : (
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* Lectures */}
          {selectedChapter.lectures && selectedChapter.lectures.map((lec) => (
            <div key={lec.id} style={{ marginBottom: "20px" }}>
              <h3>{lec.title}</h3>
              <div className="embed">
                <iframe
                  src={lec.embed}
                  title={lec.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}

          {/* Resources */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank" rel="noopener noreferrer">
                Notes PDF
              </a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank" rel="noopener noreferrer">
                Sheet PDF
              </a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank" rel="noopener noreferrer">
                DPP PDF
              </a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank" rel="noopener noreferrer">
                DPP Video
              </a>
            )}
          </div>

          <button
            className="theme-toggle"
            style={{ marginTop: "30px" }}
            onClick={() => setSelectedChapter(null)}
          >
            🔙 Back to Chapters
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
