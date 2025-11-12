import React, { useState } from "react";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🌗 Theme toggle
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  // 📚 Data structure with chapters & lectures
  const batches = [
    {
      id: "b1",
      name: "CLASS 11th (JP SIR)",
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      subjects: [
        {
          id: "phy",
          name: "Physics",
          chapters: [
            {
              id: "c1",
              name: "Basic Maths",
              lectures: [
                {
                  id: "l1",
                  title: "Lecture 1 — Basic Introduction",
                  embed: "https://odysee.com/$/embed/p8Ho7dGvF1",
                },
                {
                  id: "l2",
                  title: "Lecture 2 — Vectors & Units",
                  embed: "https://www.youtube.com/embed/tgbNymZ7vqY",
                },
              ],
            },
            {
              id: "c2",
              name: "Kinematics",
              lectures: [
                {
                  id: "l1",
                  title: "Lecture 1 — Motion in 1D",
                  embed: "https://odysee.com/$/embed/abc123xyz",
                },
              ],
            },
          ],
        },
        {
          id: "chem",
          name: "Chemistry",
          chapters: [
            {
              id: "c1",
              name: "Basic Concepts",
              lectures: [
                {
                  id: "l1",
                  title: "Lecture 1 — Mole Concept",
                  embed: "https://odysee.com/$/embed/qwe789rty",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 🌟 HEADER */}
      <div className="hero">
        <h1 className="logo">✨ Modestudy Premium ✨</h1>
      </div>

      {/* 🎚 THEME TOGGLE */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "🌤 Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* 🔍 SEARCH BOX */}
      {!selectedBatch && (
        <div className="search-box">
          <input
            type="text"
            placeholder="🔎 Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* 🧱 STEP 1 — BATCHES */}
      {!selectedBatch && (
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
                <div className="sub">📚 Tap to open subjects</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧩 STEP 2 — SUBJECTS */}
      {selectedBatch && !selectedSubject && (
        <div className="list">
          <h2>📘 {selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name} — View Chapters
            </button>
          ))}
          <button
            onClick={() => setSelectedBatch(null)}
            className="back-btn"
          >
            🔙 Back to Batches
          </button>
        </div>
      )}

      {/* 🧾 STEP 3 — CHAPTERS */}
      {selectedSubject && !selectedChapter && (
        <div className="list">
          <h2>📗 {selectedSubject.name} — Chapters</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name} — View Lectures
            </button>
          ))}
          <button
            onClick={() => setSelectedSubject(null)}
            className="back-btn"
          >
            🔙 Back to Subjects
          </button>
        </div>
      )}

      {/* 🎥 STEP 4 — LECTURES */}
      {selectedChapter && (
        <div className="list">
          <h2>🎬 {selectedChapter.name} — Lectures</h2>
          {selectedChapter.lectures.map((lec) => (
            <div key={lec.id} className="lecture-card">
              <h3>{lec.title}</h3>
              <div className="video-container">
                <iframe
                  src={lec.embed}
                  title={lec.title}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
          <button
            onClick={() => setSelectedChapter(null)}
            className="back-btn"
          >
            🔙 Back to Chapters
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
