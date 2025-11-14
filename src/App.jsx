import React, { useState, useEffect } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

export default function App() {
  // UI states
  const [darkTheme, setDarkTheme] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // progress / watched
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ms_completed") || "{}");
    } catch {
      return {};
    }
  });

  // batches
  const batches = [class11, class12];

  useEffect(() => {
    localStorage.setItem("ms_completed", JSON.stringify(completedMap));
  }, [completedMap]);

  // toggle theme
  const toggleTheme = () => {
    setDarkTheme((s) => {
      const next = !s;
      document.body.classList.toggle("alt-theme", !next);
      return next;
    });
  };

  // toggle completion for a lecture id
  const toggleComplete = (lecId) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [lecId]: !prev[lecId] };
      return next;
    });
  };

  // chapter progress percent
  const chapterPercent = (chapter) => {
    if (!chapter || !chapter.lectures) return 0;
    const total = chapter.lectures.length;
    const done = chapter.lectures.filter((l) => completedMap[l.id]).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  // mark watched when a lecture is opened (auto)
  useEffect(() => {
    if (selectedLecture) {
      setCompletedMap((prev) => ({ ...prev, [selectedLecture.id]: true }));
      setVideoEnded(false);
    }
  }, [selectedLecture]);

  // search filter (batch/subject/chapter)
  const filteredBatches = batches.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    if (b.name.toLowerCase().includes(q)) return true;
    return b.subjects.some(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.chapters.some((c) => c.name.toLowerCase().includes(q))
    );
  });

  // next lecture helper
  const playNextLecture = () => {
    if (!selectedChapter || !selectedLecture) return;
    const idx = selectedChapter.lectures.findIndex((l) => l.id === selectedLecture.id);
    if (idx >= 0 && idx < selectedChapter.lectures.length - 1) {
      setSelectedLecture(selectedChapter.lectures[idx + 1]);
      setVideoEnded(false);
    }
  };

  // replay
  const replay = () => {
    setVideoEnded(false);
    // reload iframe by toggling key (quick hack)
    const frame = document.getElementById("ms_player");
    if (frame) frame.src = frame.src;
  };

  return (
    <div className="ms-app">
      {/* SIDEBAR */}
      <aside className={`ms-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="ms-sidebar-top">
          <h2 className="ms-logo">Modestudy</h2>
          <button className="ms-toggle" onClick={() => setSidebarOpen((s) => !s)}>
            {sidebarOpen ? "⟨" : "⟩"}
          </button>
        </div>

        <nav className="ms-nav">
          <button className="nav-item" onClick={() => { setSelectedBatch(null); setSelectedSubject(null); setSelectedChapter(null); setSelectedLecture(null); }}>
            Home
          </button>
          <button className="nav-item" onClick={() => { setSelectedBatch(class11); setSelectedSubject(null); setSelectedChapter(null); setSelectedLecture(null); }}>
            Class 11
          </button>
          <button className="nav-item" onClick={() => { setSelectedBatch(class12); setSelectedSubject(null); setSelectedChapter(null); setSelectedLecture(null); }}>
            Class 12
          </button>

          <div className="nav-divider" />

          <div className="recent-heading">Recent watched</div>
          <div className="recent-list">
            {Object.keys(completedMap).length === 0 && <div className="recent-empty">No history yet</div>}
            {Object.keys(completedMap).filter(k => completedMap[k]).slice(-8).reverse().map((id) => (
              <div key={id} className="recent-item" onClick={() => {
                // try find lecture by id in data
                let found = null;
                for (const b of batches) {
                  for (const s of b.subjects) {
                    for (const c of s.chapters) {
                      for (const l of c.lectures) {
                        if (l.id === id) {
                          found = { b, s, c, l };
                          break;
                        }
                      }
                      if (found) break;
                    }
                    if (found) break;
                  }
                  if (found) break;
                }
                if (found) {
                  setSelectedBatch(found.b);
                  setSelectedSubject(found.s);
                  setSelectedChapter(found.c);
                  setSelectedLecture(found.l);
                }
              }}>{id}</div>
            ))}
          </div>
        </nav>

        <div className="ms-sidebar-bottom">
          <button className="ms-theme-btn" onClick={toggleTheme}>{darkTheme ? "Light" : "Dark"}</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ms-main">
        {/* header */}
        <header className="ms-header">
          <div className="ms-header-left">
            <button className="hamb" onClick={() => setSidebarOpen((s) => !s)}>{sidebarOpen ? "≡" : "☰"}</button>
            <h1 className="ms-title">Modestudy</h1>
          </div>

          <div className="ms-header-right">
            <input className="ms-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batch / subject / chapter..." />
          </div>
        </header>

        {/* content area */}
        <section className="ms-content">
          {/* 1. Batches view */}
          {!selectedBatch && (
            <div className="ms-grid">
              {filteredBatches.map((b) => (
                <div key={b.id} className="ms-card" onClick={() => setSelectedBatch(b)}>
                  <div className="ms-card-img-wrap">
                    <img src={b.img} alt={b.name} className="ms-card-img" />
                  </div>
                  <div className="ms-card-meta">
                    <div className="ms-card-title">{b.name}</div>
                    <div className="ms-card-sub">Tap to open subjects</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Subjects */}
          {selectedBatch && !selectedSubject && (
            <div className="ms-list">
              <h2>{selectedBatch.name}</h2>
              <div className="ms-sub-grid">
                {selectedBatch.subjects.map((s) => (
                  <div key={s.id} className="ms-sub-card" onClick={() => setSelectedSubject(s)}>
                    <div className="ms-sub-title">{s.name}</div>
                    <div className="ms-sub-count">{s.chapters.length} chapters</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Chapters */}
          {selectedSubject && !selectedChapter && (
            <div className="ms-list">
              <h2>{selectedSubject.name}</h2>
              <div className="ms-chapter-list">
                {selectedSubject.chapters.map((c) => (
                  <div key={c.id} className="ms-ch-item" onClick={() => setSelectedChapter(c)}>
                    <div className="ms-ch-left">
                      <div className="ms-ch-name">{c.name}</div>
                      <div className="ms-ch-sub">Lectures: {c.lectures.length}</div>
                    </div>
                    <div className="ms-ch-right">
                      <div className="ms-ch-percent">{chapterPercent(c)}%</div>
                      <div className="ms-progress-shell">
                        <div className="ms-progress-fill" style={{ width: `${chapterPercent(c)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Lecture list */}
          {selectedChapter && !selectedLecture && (
            <div className="ms-list">
              <h2>{selectedChapter.name}</h2>

              <div className="ms-resources">
                {selectedChapter.notes && <a href={selectedChapter.notes} target="_blank" rel="noreferrer">📒 Notes</a>}
                {selectedChapter.sheet && <a href={selectedChapter.sheet} target="_blank" rel="noreferrer">📘 Sheet</a>}
                {selectedChapter.dpp && <a href={selectedChapter.dpp} target="_blank" rel="noreferrer">📄 DPP</a>}
                {selectedChapter.dppVideo && <a href={selectedChapter.dppVideo} target="_blank" rel="noreferrer">🎥 DPP Video</a>}
              </div>

              <div className="ms-lectures">
                {selectedChapter.lectures.map((l) => (
                  <div key={l.id} className="ms-lecture-row">
                    <button className="ms-lecture-play" onClick={() => setSelectedLecture(l)}>▶ {l.title}</button>
                    <label className="ms-complete">
                      <input type="checkbox" checked={!!completedMap[l.id]} readOnly />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Video player */}
          {selectedLecture && (
            <div className="ms-video-area">
              <h2>{selectedLecture.title}</h2>

              <div className="ms-video-wrap">
                <iframe
                  id="ms_player"
                  src={selectedLecture.url}
                  title={selectedLecture.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  onLoad={() => {
                    // we cannot reliably detect 'ended' for external iframe; instead rely on user to tap End or we provide overlay controls below
                    // keep videoEnded false until user clicks replay/next via overlay
                  }}
                />
                {/* overlay when videoEnded true */}
                {videoEnded && (
                  <div className="ms-overlay">
                    <div className="ms-overlay-card">
                      <h3>🎉 Lecture Finished</h3>
                      <p>{getRandomQuote()}</p>
                      <div className="ms-overlay-actions">
                        <button onClick={() => { replay(); setVideoEnded(false); }}>🔄 Replay</button>
                        <button onClick={() => { playNextLecture(); setVideoEnded(false); }}>⏭ Next</button>
                        <button onClick={() => { setVideoEnded(false); }}>✖ Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="ms-video-controls">
                <button onClick={() => setVideoEnded(true)} className="ms-end-btn">Simulate End Screen</button>
                <button onClick={replay}>Replay</button>
                <button onClick={playNextLecture}>Next Lecture</button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );

  // helper for random quote (local)
  function getRandomQuote() {
    const pool = [
      "Small progress every day.",
      "Focus on your goals.",
      "Consistency beats intensity.",
      "Practice > Perfection.",
      "Keep learning, keep growing."
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  }
}
