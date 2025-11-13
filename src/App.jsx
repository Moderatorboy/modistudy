import React, { useState, useEffect } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

const quotes = [
  "Consistency beats talent.",
  "Small steps every day.",
  "Keep going, you’re doing great!",
  "Focus on progress, not perfection.",
  "Discipline > Motivation.",
  "Every expert was once a beginner.",
];

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [completed, setCompleted] = useState(
    JSON.parse(localStorage.getItem("completedLectures") || "[]")
  );
  const [search, setSearch] = useState("");

  const allBatches = [class11, class12];

  const toggleComplete = (id) => {
    let updated = completed.includes(id)
      ? completed.filter((lecId) => lecId !== id)
      : [...completed, id];
    setCompleted(updated);
    localStorage.setItem("completedLectures", JSON.stringify(updated));
  };

  const goBack = () => {
    if (selectedLecture) setSelectedLecture(null);
    else if (selectedChapter) setSelectedChapter(null);
    else if (selectedSubject) setSelectedSubject(null);
    else if (selectedBatch) setSelectedBatch(null);
  };

  return (
    <div className="app-container">
      {/* 🌟 Header */}
      <header className="app-header">
        <h1 className="logo">MODESTUDY</h1>
        <input
          type="text"
          placeholder="Search chapters or lectures..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </header>

      {/* 🔙 Back Navigation */}
      {(selectedBatch || selectedSubject || selectedChapter || selectedLecture) && (
        <button className="back-btn" onClick={goBack}>
          ⬅ Back
        </button>
      )}

      {/* 🧩 View Sections */}
      {!selectedBatch && (
        <div className="grid">
          {allBatches.map((b) => (
            <div key={b.id} className="card" onClick={() => setSelectedBatch(b)}>
              <img src={b.img} alt={b.name} />
              <h2>{b.name}</h2>
            </div>
          ))}
        </div>
      )}

      {selectedBatch && !selectedSubject && (
        <div className="grid">
          {selectedBatch.subjects.map((s) => (
            <div key={s.id} className="card" onClick={() => setSelectedSubject(s)}>
              <h3>{s.name}</h3>
            </div>
          ))}
        </div>
      )}

      {selectedSubject && !selectedChapter && (
        <div className="grid">
          {selectedSubject.chapters
            .filter((c) => c.name.toLowerCase().includes(search))
            .map((c) => (
              <div key={c.id} className="card" onClick={() => setSelectedChapter(c)}>
                <h3>{c.name}</h3>
              </div>
            ))}
        </div>
      )}

      {/* 📚 Chapter View */}
      {selectedChapter && !selectedLecture && (
        <div className="chapter-view">
          <h2>{selectedChapter.name}</h2>

          {/* 📊 Progress */}
          <div className="progress-bar">
            <div
              className="fill"
              style={{
                width: `${
                  (selectedChapter.lectures.filter((l) => completed.includes(l.id)).length /
                    selectedChapter.lectures.length) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <p>
            {
              Math.round(
                (selectedChapter.lectures.filter((l) => completed.includes(l.id)).length /
                  selectedChapter.lectures.length) *
                  100
              )
            }
            % Completed
          </p>

          {/* 📘 Notes / DPP / etc */}
          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes}>📒 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet}>📘 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp}>📄 DPP</a>}
            {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo}>🎥 DPP Video</a>}
          </div>

          {/* 🎥 Lectures */}
          <div className="lecture-list">
            {selectedChapter.lectures.map((lec) => (
              <div key={lec.id} className="lecture-card">
                <div className="lecture-row">
                  <input
                    type="checkbox"
                    checked={completed.includes(lec.id)}
                    onChange={() => toggleComplete(lec.id)}
                  />
                  <button onClick={() => setSelectedLecture(lec)}>{lec.title}</button>
                </div>
                <p className="quote">
                  {quotes[Math.floor(Math.random() * quotes.length)]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ▶️ Lecture Player */}
      {selectedLecture && (
        <div className="player">
          <h3>{selectedLecture.title}</h3>
          <iframe
            src={selectedLecture.url || selectedLecture.embed}
            allowFullScreen
            title={selectedLecture.title}
          ></iframe>
        </div>
      )}
    </div>
  );
}
