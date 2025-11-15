import React, { useState, useEffect } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

//  ⭐ Simple Quotes List
const quotes = [
  "Success doesn’t come from what you do occasionally—it comes from what you do consistently.",
  "Small progress is still progress.",
  "Focus on progress, not perfection.",
  "Don’t stop until you’re proud.",
];

// ⭐ Random Quote Component
function QuoteBox() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return <div className="quote-box">💡 {quote}</div>;
}

// ⭐ ADS Component
function Ads() {
  return (
    <div className="ads-card">
      <p>Advertisment</p>
      <img src="https://i.imgur.com/4M7IWwP.jpeg" alt="ads" />
    </div>
  );
}

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // ⭐ Progress Save in LocalStorage
  const [progress, setProgress] = useState(
    JSON.parse(localStorage.getItem("progress")) || {}
  );

  const updateProgress = (lecID) => {
    const newProgress = { ...progress, [lecID]: true };
    setProgress(newProgress);
    localStorage.setItem("progress", JSON.stringify(newProgress));
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [class11, class12];

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* HEADER */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* THEME BUTTON */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Light Mode 🌤" : "Dark Mode 🌙"}
      </button>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search batches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* QUOTES */}
      <QuoteBox />

      {/* ADS */}
      <Ads />

      {/* BACK BUTTONS */}
      <div className="back-box">
        {selectedLecture && (
          <button onClick={() => setSelectedLecture(null)}>🔙 Back</button>
        )}
        {!selectedLecture && selectedChapter && (
          <button onClick={() => setSelectedChapter(null)}>🔙 Back</button>
        )}
        {!selectedChapter && selectedSubject && (
          <button onClick={() => setSelectedSubject(null)}>🔙 Back</button>
        )}
        {!selectedSubject && selectedBatch && (
          <button onClick={() => setSelectedBatch(null)}>🔙 Home</button>
        )}
      </div>

      {/* MAIN UI */}
      {!selectedBatch ? (
        // 1. BATCHES
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
        // 2. SUBJECTS
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id} onClick={() => setSelectedSubject(sub)}>
              {sub.name}
            </button>
          ))}
        </div>
      ) : !selectedChapter ? (
        // 3. CHAPTERS
        <div className="list">
          <h2>{selectedSubject.name}</h2>
          {selectedSubject.chapters.map((ch) => {
            // ⭐ Chapter progress count
            const total = ch.lectures.length;
            const done = ch.lectures.filter((lec) => progress[lec.id]).length;
            const percent = Math.round((done / total) * 100);

            return (
              <button key={ch.id} onClick={() => setSelectedChapter(ch)}>
                {ch.name} — {percent}% completed
              </button>
            );
          })}
        </div>
      ) : !selectedLecture ? (
        // 4. LECTURES
        <div className="list">
          <h2>{selectedChapter.name}</h2>

          {/* RESOURCES */}
          <div className="resources">
            {selectedChapter.notes && <a href={selectedChapter.notes}>📒 Notes</a>}
            {selectedChapter.sheet && <a href={selectedChapter.sheet}>📘 Sheet</a>}
            {selectedChapter.dpp && <a href={selectedChapter.dpp}>📄 DPP</a>}
            {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo}>🎥 DPP Video</a>}
          </div>

          {/* LECTURE LIST */}
          {selectedChapter.lectures.map((lec) => (
            <button key={lec.id} onClick={() => setSelectedLecture(lec)}>
              {lec.title} {progress[lec.id] ? "✔" : ""}
            </button>
          ))}
        </div>
      ) : (
        // 5. VIDEO PLAYER
        <div className="video-area">
          <h2>{selectedLecture.title}</h2>

          <iframe
            src={
              selectedLecture.url +
              "?autoplay=1&rel=0&hideTitle=true&hideRelated=true"
            }
            title={selectedLecture.title}
            allow="autoplay; fullscreen"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-presentation"
            onLoad={() => updateProgress(selectedLecture.id)}
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default App;
