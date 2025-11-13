import React, { useState } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const batches = [class11, class12];

  const filteredBatches = batches.map(batch => ({
    ...batch,
    subjects: batch.subjects.map(subject => ({
      ...subject,
      chapters: subject.chapters.map(chapter => ({
        ...chapter,
        lectures: chapter.lectures.filter(l =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })),
    })),
  }));

  return (
    <div className="app-container">
      <h1 className="app-title">MODESTUDY ✨</h1>

      <input
        type="text"
        placeholder="Search lectures..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {!selectedBatch && (
        <div className="grid">
          {filteredBatches.map(batch => (
            <div key={batch.id} className="card" onClick={() => setSelectedBatch(batch)}>
              <img src={batch.img} alt={batch.name} className="card-img" />
              <h2>{batch.name}</h2>
            </div>
          ))}
        </div>
      )}

      {selectedBatch && !selectedSubject && (
        <div>
          <button className="back-btn" onClick={() => setSelectedBatch(null)}>← Back</button>
          <div className="grid">
            {selectedBatch.subjects.map(sub => (
              <div key={sub.id} className="card" onClick={() => setSelectedSubject(sub)}>
                <h2>{sub.name}</h2>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSubject && !selectedChapter && (
        <div>
          <button className="back-btn" onClick={() => setSelectedSubject(null)}>← Back</button>
          <div className="grid">
            {selectedSubject.chapters.map(ch => (
              <div key={ch.id} className="card" onClick={() => setSelectedChapter(ch)}>
                <h2>{ch.name}</h2>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedChapter && !selectedLecture && (
        <div>
          <button className="back-btn" onClick={() => setSelectedChapter(null)}>← Back</button>

          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes} target="_blank">📘 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet} target="_blank">📗 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp} target="_blank">📕 DPP</a>}
            {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo} target="_blank">🎥 DPP Video</a>}
          </div>

          <div className="grid">
            {selectedChapter.lectures.map(lec => (
              <div key={lec.id} className="card" onClick={() => setSelectedLecture(lec)}>
                <h3>{lec.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedLecture && (
        <div className="video-section">
          <button className="back-btn" onClick={() => setSelectedLecture(null)}>← Back</button>
          <h2>{selectedLecture.title}</h2>
          <div className="video-container">
            <iframe
              src={selectedLecture.url}
              title={selectedLecture.title}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
