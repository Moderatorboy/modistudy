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

  // ALL BATCHES
  const batches = [
    { ...class11, img: "/images/class11.png" },
    { ...class12, img: "/images/class12.png" },
  ];

  // UNIVERSAL SEARCH SYSTEM
  const filterText = search.toLowerCase();

  // 1) Batch Search
  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(filterText)
  );

  // 2) Subject Search
  const filteredSubjects =
    selectedBatch?.subjects?.filter((s) =>
      s.name.toLowerCase().includes(filterText)
    ) || [];

  // 3) Chapter Search
  const filteredChapters =
    selectedSubject?.chapters?.filter((c) =>
      c.name.toLowerCase().includes(filterText)
    ) || [];

  // PAGE UI LOGIC
  const showBatches = !selectedBatch;
  const showSubjects = selectedBatch && !selectedSubject;
  const showChapters = selectedSubject && !selectedChapter;
  const showLectures = selectedChapter && !selectedLecture;
  const showLectureVideo = selectedLecture;

  return (
    <div>
      {/* HEADER */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Switch to Light Mode 🌤" : "Switch to Dark Mode 🌙"}
      </button>

      {/* SEARCH BAR */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BACK BUTTONS */}
      <div style={{ width: "90%", margin: "0 auto 20px" }}>
        {showLectureVideo && (
          <button className="theme-toggle" onClick={() => setSelectedLecture(null)}>
            🔙 Back to Lectures
          </button>
        )}
        {showLectures && (
          <button className="theme-toggle" onClick={() => setSelectedChapter(null)}>
            🔙 Back to Chapters
          </button>
        )}
        {showChapters && (
          <button className="theme-toggle" onClick={() => setSelectedSubject(null)}>
            🔙 Back to Subjects
          </button>
        )}
        {showSubjects && (
          <button className="theme-toggle" onClick={() => setSelectedBatch(null)}>
            🔙 Back to Home
          </button>
        )}
      </div>

      {/* MAIN SCREEN */}
      {showBatches && (
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => {
                setSelectedBatch(batch);
                setSearch("");
              }}
            >
              <img src={batch.img} alt={batch.name} />
              <div className="meta">
                <div className="name">{batch.name}</div>
                <div className="sub">Tap to open subjects</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSubjects && (
        <div className="list">
          <h2>{selectedBatch.name}</h2>

          {filteredSubjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub);
                setSearch("");
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {showChapters && (
        <div className="list">
          <h2>{selectedSubject.name}</h2>

          {filteredChapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChapter(ch);
                setSearch("");
              }}
            >
              {ch.name}
            </button>
          ))}
        </div>
      )}

      {showLectures && (
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* RESOURCES */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank" rel="noreferrer">
                📒 Notes
              </a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank" rel="noreferrer">
                📘 Sheet
              </a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank" rel="noreferrer">
                📄 DPP
              </a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank" rel="noreferrer">
                🎥 DPP Video
              </a>
            )}
          </div>

          {/* LECTURES */}
          {selectedChapter.lectures.map((lec) => (
            <button key={lec.id} onClick={() => setSelectedLecture(lec)}>
              {lec.title}
            </button>
          ))}
        </div>
      )}

      {showLectureVideo && (
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
