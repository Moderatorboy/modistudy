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
  const [quotes] = useState([
    "Success comes to those who work consistently.",
    "Never stop learning, because life never stops teaching.",
    "Hard work beats talent when talent doesn’t work hard.",
    "Small progress each day leads to big results.",
  ]);

  const batches = [class11, class12];

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const calcProgress = () => {
    if (!selectedChapter) return 0;
    const total = selectedChapter.lectures.length;
    const done = JSON.parse(localStorage.getItem("doneLectures") || "[]");
    const completed = selectedChapter.lectures.filter((l) =>
      done.includes(l.id)
    ).length;
    return Math.round((completed / total) * 100);
  };

  const markDone = (id) => {
    let done = JSON.parse(localStorage.getItem("doneLectures") || "[]");
    if (!done.includes(id)) {
      done.push(id);
      localStorage.setItem("doneLectures", JSON.stringify(done));
    }
    setSelectedLecture({ ...selectedLecture }); // refresh
  };

  return (
    <div>
      {/* ---------------- HEADER ---------------- */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* SEARCH BAR */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* BACK NAVIGATION */}
      <div className="back-nav">
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
          <button onClick={() => setSelectedBatch(null)}>⬅ Back</button>
        )}
      </div>

      {/* ---------------- MAIN SCREENS ---------------- */}

      {/* BATCH SCREEN */}
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
      ) : // SUBJECT SCREEN
      !selectedSubject ? (
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name}
            </button>
          ))}
        </div>
      ) : // CHAPTER SCREEN
      !selectedChapter ? (
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name}
            </button>
          ))}
        </div>
      ) : // LECTURE LIST SCREEN
      !selectedLecture ? (
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* RESOURCES */}
          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes}>📒 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet}>📘 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp}>📄 DPP</a>}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo}>🎥 DPP Video</a>
            )}
          </div>

          {/* PROGRESS */}
          <p className="progress">Progress: {calcProgress()}%</p>

          {/* LECTURES */}
          {selectedChapter.lectures.map((lec) => {
            const completed = JSON.parse(
              localStorage.getItem("doneLectures") || "[]"
            ).includes(lec.id);

            return (
              <button key={lec.id} onClick={() => setSelectedLecture(lec)}>
                {completed ? "✔ " : ""} {lec.title}
              </button>
            );
          })}

          {/* RANDOM QUOTE */}
          <p className="quote">💡 {quotes[Math.floor(Math.random() * quotes.length)]}</p>
        </div>
      ) : (
        /* ---------------- VIDEO PLAYER ---------------- */
        <div className="video-box">
          <h2>{selectedLecture.title}</h2>

          {/* END SCREEN */}
          {videoEnded && (
            <div className="end-screen">
              <h2>🎉 Lecture Complete!</h2>
              <p>Great job! Start next lecture 🚀</p>

              <button
                onClick={() => {
                  markDone(selectedLecture.id);
                  setVideoEnded(false);
                  const nextIndex =
                    selectedChapter.lectures.indexOf(selectedLecture) + 1;

                  if (selectedChapter.lectures[nextIndex]) {
                    setSelectedLecture(selectedChapter.lectures[nextIndex]);
                  }
                }}
              >
                ▶ Next Lecture
              </button>

              <button
                onClick={() => {
                  setVideoEnded(false);
                  const iframe = document.getElementById("player-frame");
                  iframe.src = iframe.src;
                }}
              >
                🔁 Replay
              </button>
            </div>
          )}

          {/* IFRAME */}
          <iframe
            id="player-frame"
            src={selectedLecture.url.replace("?pub=4no3cq", "")}
            allow="autoplay; fullscreen; encrypted-media"
            sandbox="allow-same-origin allow-scripts allow-presentation"
            allowFullScreen
            onLoad={() => {
              setTimeout(() => {
                try {
                  const vid = document
                    .getElementById("player-frame")
                    .contentWindow.document.querySelector("video");

                  if (vid) {
                    vid.onended = () => setVideoEnded(true);
                  }
                } catch {}
              }, 1500);
            }}
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
