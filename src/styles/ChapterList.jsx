import React, { useState } from "react";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

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
              notes: "https://example.com/notes-basic-maths.pdf",
              dpp: "https://example.com/dpp-basic-maths.pdf",
              dppVideo: "https://odysee.com/$/embed/p8Ho7dGvF1",
              lectures: [
                { id: "l1", title: "Lecture 1 — Intro", embed: "https://odysee.com/$/embed/p8Ho7dGvF1" },
                { id: "l2", title: "Lecture 2 — Vectors", embed: "https://www.youtube.com/embed/tgbNymZ7vqY" },
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
      <div className="hero">
        <h1 className="logo">✨ Modestudy Premium ✨</h1>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "🌤 Light Mode" : "🌙 Dark Mode"}
      </button>

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

      {/* Subject List */}
      {selectedBatch && !selectedSubject && (
        <div className="list">
          <h2>📘 {selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name} — View Chapters
            </button>
          ))}
          <button onClick={() => setSelectedBatch(null)} className="back-btn">
            🔙 Back to Batches
          </button>
        </div>
      )}

      {/* Chapter List */}
      {selectedSubject && !selectedChapter && (
        <div className="list">
          <h2>📗 {selectedSubject.name} — Chapters</h2>
          {selectedSubject.chapters.map((ch) => (
            <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
              {ch.name} — View Lectures
            </button>
          ))}
          <button onClick={() => setSelectedSubject(null)} className="back-btn">
            🔙 Back to Subjects
          </button>
        </div>
      )}

      {/* Lectures + Notes + DPP + DPP Video */}
      {selectedChapter && (
        <div className="list">
          <h2>🎬 {selectedChapter.name}</h2>

          <div className="resources">
            <a href={selectedChapter.notes} target="_blank" rel="noopener noreferrer">📄 Notes PDF</a>
            <a href={selectedChapter.dpp} target="_blank" rel="noopener noreferrer">🧩 DPP Sheet</a>
            <a href={selectedChapter.dppVideo} target="_blank" rel="noopener noreferrer">🎥 DPP Video</a>
          </div>

          {selectedChapter.lectures.map((lec) => (
            <div key={lec.id} className="lecture-card">
              <h3>{lec.title}</h3>
              <div className="video-container">
                <iframe src={lec.embed} title={lec.title} allowFullScreen></iframe>
              </div>
            </div>
          ))}

          <button onClick={() => setSelectedChapter(null)} className="back-btn">
            🔙 Back to Chapters
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
