import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const batches = [class11, class12];

  return (
    <div className="app-container">
      {/* 🔹 Step 1: Batch Selection */}
      {!selectedBatch && (
        <div className="batch-grid">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="batch-card"
              onClick={() => setSelectedBatch(batch)}
            >
              <img src={batch.img || batch.image} alt={batch.name} />
              <h2>{batch.name}</h2>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Step 2: Subject Selection */}
      {selectedBatch && !selectedSubject && (
        <div className="subject-grid">
          <button
            className="back-btn"
            onClick={() => setSelectedBatch(null)}
          >
            ← Back to Batches
          </button>
          <h2>{selectedBatch.name}</h2>

          {selectedBatch.subjects.map((sub) => (
            <div
              key={sub.id}
              className="subject-card"
              onClick={() => setSelectedSubject(sub)}
            >
              <h3>{sub.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Step 3: Chapter Selection */}
      {selectedSubject && !selectedChapter && (
        <div className="chapter-grid">
          <button
            className="back-btn"
            onClick={() => setSelectedSubject(null)}
          >
            ← Back to Subjects
          </button>
          <h2>{selectedSubject.name}</h2>

          {selectedSubject.chapters.map((chap) => (
            <div
              key={chap.id}
              className="chapter-card"
              onClick={() => setSelectedChapter(chap)}
            >
              <h3>{chap.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Step 4: Chapter Details (Lectures + Notes + Sheet + DPP) */}
      {selectedChapter && (
        <div className="chapter-view">
          {/* 🧭 Back Button Top */}
          <button
            className="back-btn"
            onClick={() => setSelectedChapter(null)}
          >
            ← Back to Chapters
          </button>

          {/* 🧩 Chapter Title */}
          <h2>{selectedChapter.name}</h2>

          {/* 📘 Notes / Sheet / DPP Section (Top) */}
          <div className="resources">
            {selectedChapter.notes && (
              <a href={selectedChapter.notes} target="_blank" rel="noopener noreferrer">
                📘 Notes
              </a>
            )}
            {selectedChapter.sheet && (
              <a href={selectedChapter.sheet} target="_blank" rel="noopener noreferrer">
                📄 Sheet
              </a>
            )}
            {selectedChapter.dpp && (
              <a href={selectedChapter.dpp} target="_blank" rel="noopener noreferrer">
                🧩 DPP (PDF)
              </a>
            )}
            {selectedChapter.dppVideo && (
              <a href={selectedChapter.dppVideo} target="_blank" rel="noopener noreferrer">
                🎥 DPP Video
              </a>
            )}
          </div>

          {/* 🎬 Lectures Grid */}
          <div className="lectures-grid">
            {selectedChapter.lectures && selectedChapter.lectures.length > 0 ? (
              selectedChapter.lectures.map((lec) => (
                <div key={lec.id} className="lecture-card">
                  <h3>{lec.title}</h3>
                  <iframe
                    src={lec.url}
                    title={lec.title}
                    allowFullScreen
                    className="lecture-video"
                  ></iframe>
                </div>
              ))
            ) : (
              <p>No lectures available for this chapter.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
