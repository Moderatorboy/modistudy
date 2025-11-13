import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

export default function App() {
  const [activeBatch, setActiveBatch] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const batches = [class11, class12];

  // 🔍 Search Logic
  const filteredBatches = batches.map((batch) => ({
    ...batch,
    subjects: batch.subjects.map((subject) => ({
      ...subject,
      chapters: subject.chapters.filter(
        (ch) =>
          ch.name.toLowerCase().includes(query.toLowerCase()) ||
          subject.name.toLowerCase().includes(query.toLowerCase())
      ),
    })),
  }));

  // 🧭 Back button handler
  const goBack = () => {
    if (activeChapter) setActiveChapter(null);
    else if (activeSubject) setActiveSubject(null);
    else if (activeBatch) setActiveBatch(null);
  };

  return (
    <div className="app-container">
      {/* 🌟 Header */}
      <header className="header">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        <h1 className="logo">MODESTUDY</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search chapter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      {/* 📱 Mobile Navigation */}
      {menuOpen && (
        <nav className="mobile-nav">
          {batches.map((batch) => (
            <button
              key={batch.id}
              onClick={() => {
                setActiveBatch(batch);
                setActiveSubject(null);
                setActiveChapter(null);
                setMenuOpen(false);
              }}
            >
              {batch.name}
            </button>
          ))}
        </nav>
      )}

      {/* 🧭 Back Button */}
      {(activeBatch || activeSubject || activeChapter) && (
        <div className="back-nav">
          <button onClick={goBack}>← Back</button>
        </div>
      )}

      {/* 🎓 Batch Grid */}
      {!activeBatch && (
        <div className="grid">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="card"
              onClick={() => setActiveBatch(batch)}
            >
              <img src={batch.img} alt={batch.name} />
              <div className="meta">
                <div className="name">{batch.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📘 Subject List */}
      {activeBatch && !activeSubject && (
        <div className="grid">
          {activeBatch.subjects.map((subject) => (
            <div
              key={subject.id}
              className="card"
              onClick={() => setActiveSubject(subject)}
            >
              <div className="meta">
                <div className="name">{subject.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📗 Chapter List */}
      {activeSubject && !activeChapter && (
        <div className="list">
          {activeSubject.chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(chapter)}
            >
              {chapter.name}
            </button>
          ))}
        </div>
      )}

      {/* 🎥 Lecture Page */}
      {activeChapter && (
        <div className="chapter-page">
          <h2>{activeChapter.name}</h2>

          {/* 📚 Top Resources */}
          <div className="resources">
            {activeChapter.notes && (
              <a href={activeChapter.notes} target="_blank">Notes</a>
            )}
            {activeChapter.sheet && (
              <a href={activeChapter.sheet} target="_blank">Sheet</a>
            )}
            {activeChapter.dpp && (
              <a href={activeChapter.dpp} target="_blank">DPP PDF</a>
            )}
            {activeChapter.dppVideo && (
              <a href={activeChapter.dppVideo} target="_blank">DPP Video</a>
            )}
          </div>

          {/* 🎞️ Lectures */}
          <div className="lecture-grid">
            {activeChapter.lectures.map((lec) => (
              <div key={lec.id} className="lecture-card">
                <iframe
                  src={lec.url}
                  title={lec.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                <p>{lec.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
