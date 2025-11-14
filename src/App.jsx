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
  const [videoEnded, setVideoEnded] = useState(false);

  const quotes = [
    "Success isn’t for the lazy.",
    "Push harder than yesterday!",
    "Small steps = Big results.",
    "Do it for your future self.",
    "Winners train, losers complain."
  ];

  const getRandomQuote = () =>
    quotes[Math.floor(Math.random() * quotes.length)];

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const replayVideo = () => {
    setVideoEnded(false);
    const iframe = document.getElementById("player");
    iframe.src = iframe.src; // reload video
  };

  const nextVideo = () => {
    if (!selectedChapter || !selectedLecture) return;

    const index = selectedChapter.lectures.findIndex(
      l => l.id === selectedLecture.id
    );

    if (index < selectedChapter.lectures.length - 1) {
      setSelectedLecture(selectedChapter.lectures[index + 1]);
      setVideoEnded(false);
    }
  };

  return (
    <div>
      {/* Header */}
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
      <div style={{ width: "90%", margin: "0 auto 20px" }}>
        {selectedLecture && (
          <button className="nav-btn" onClick={() => setSelectedLecture(null)}>
            🔙 Back to Chapters
          </button>
        )}
        {!selectedLecture && selectedChapter && (
          <button className="nav-btn" onClick={() => setSelectedChapter(null)}>
            🔙 Back to Subjects
          </button>
        )}
        {!selectedChapter && selectedSubject && (
          <button className="nav-btn" onClick={() => setSelectedSubject(null)}>
            🔙 Back to Batches
          </button>
        )}
        {!selectedSubject && selectedBatch && (
          <button className="nav-btn" onClick={() => setSelectedBatch(null)}>
            🔙 Home
          </button>
        )}
      </div>

      {/* MAIN UI SWITCH */}
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
              {sub.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
        </div>
      ) : !selectedLecture ? (
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* Resources */}
          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes}>📒 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet}>📘 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp}>📄 DPP</a>}
            {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo}>🎥 DPP Video</a>}
          </div>

          {/* Lecture list */}
          {selectedChapter.lectures.map((lec) => (
            <button key={lec.id} onClick={() => setSelectedLecture(lec)}>
              {lec.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="video-container">
          <h2>{selectedLecture.title}</h2>

          <div className="embed">
            <iframe
              id="player"
              src={selectedLecture.url}
              title={selectedLecture.title}
              allow="autoplay; fullscreen"
              onLoad={() => {
                const iframe = document.getElementById("player");
                iframe.contentWindow.postMessage(
                  '{"event":"command","func":"addEventListener","args":"ended"}',
                  "*"
                );
              }}
              onEnded={handleVideoEnd}
              allowFullScreen
            ></iframe>

            {/* END SCREEN OVERLAY */}
            {videoEnded && (
              <div className="end-screen">
                <h3>🎉 Lecture Complete!</h3>
                <p>{getRandomQuote()}</p>

                <button onClick={replayVideo} className="end-btn">
                  🔄 Replay
                </button>

                <button onClick={nextVideo} className="end-btn">
                  ⏭ Next Lecture
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
