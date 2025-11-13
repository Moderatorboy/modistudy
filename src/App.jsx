import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [playing, setPlaying] = useState(null); // ✅ track playing video

  const batches = [class11, class12];

  return (
    <div className="app-container">
      {/* 🔹 Step 1: Batch Selection */}
      {!selectedBatch && (
        <div className="grid">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => setSelectedBatch(batch)}
            >
              <img src={batch.img} alt={batch.name} />
              <div className="meta">
                <div className="name">{batch.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Step 2: Subject Selection */}
      {selectedBatch && !selectedSubject && (
        <div className="grid">
          <button className="back-btn" onClick={() => setSelectedBatch(null)}>
            ← Back
          </button>
          {selectedBatch.subjects.map((sub) => (
            <div
              key={sub.id}
              className="card"
              onClick={() => setSelectedSubject(sub)}
            >
              <div className="meta">
                <div className="name">{sub.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Step 3: Chapter Selection */}
      {selectedSubject && !selectedChapter && (
        <div className="grid">
          <button className="back-btn" onClick={() => setSelectedSubject(null)}>
            ← Back
          </button>
          {selectedSubject.chapters.map((chap) => (
            <div
              key={chap.id}
              className="card"
              onClick={() => setSelectedChapter(chap)}
            >
              <div className="meta">
                <div className="name">{chap.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Step 4: Chapter View */}
      {selectedChapter && (
        <div className="chapter-view">
          <button className="back-btn" onClick={() => setSelectedChapter(null)}>
            ← Back
          </button>
          <h2>{selectedChapter.name}</h2>

          {/* 📘 Notes + DPP Section */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank" rel="noopener noreferrer">📘 Notes</a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank" rel="noopener noreferrer">📄 Sheet</a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank" rel="noopener noreferrer">🧩 DPP</a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank" rel="noopener noreferrer">🎥 DPP Video</a>
            )}
          </div>

          {/* 🎬 Lectures */}
          <div className="lectures-grid">
            {selectedChapter.lectures.map((lec) => (
              <div key={lec.id} className="lecture-card">
                <h3>{lec.title}</h3>
                {playing === lec.id ? (
                  <iframe
                    src={lec.url}
                    title={lec.title}
                    allowFullScreen
                    className="lecture-video"
                  ></iframe>
                ) : (
                  <div
                    className="thumbnail"
                    onClick={() => setPlaying(lec.id)}
                  >
                    <div className="play-btn">▶</div>
                    <p>Click to Play</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
