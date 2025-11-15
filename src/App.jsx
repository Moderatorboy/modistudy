// src/App.jsx
import React, { useEffect, useState, useRef } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

/* placeholders */
const PLACEHOLDER_BATCH = "/images/placeholder_batch.png";
const PLACEHOLDER_TEACHER = "/images/placeholder_teacher.png";
const PLACEHOLDER_CHAPTER = "/images/placeholder_chapter.png";

/* Utility: extract rumble id from embed/url and return thumbnail URL */
function rumbleIdFromUrl(url) {
  try {
    // try /embed/<id>
    let m = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (m && m[1]) return m[1];
    // try /v<id> or /<id>.html patterns -> pick last path segment without extension
    m = url.match(/\/([a-zA-Z0-9_-]+)(?:\.html|$)/g);
    if (m && m.length) {
      const last = m[m.length - 1].replace(/\//g, "");
      return last;
    }
  } catch (e) {}
  return null;
}
function rumbleThumbnail(url) {
  const id = rumbleIdFromUrl(url);
  if (!id) return PLACEHOLDER_CHAPTER;
  // common pattern that works often
  return `https://rumble.com/${id}.thumbnail.jpg`;
}

/* Quiz modal same as before (unchanged) */
function QuizModal({ quiz, onClose, onSubmit, existingResult }) {
  const [answers, setAnswers] = useState(() =>
    (quiz?.questions || []).map(() => null)
  );
  const [timeLeft, setTimeLeft] = useState(quiz?.time || 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!quiz?.time) return;
    setTimeLeft(quiz.time);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [quiz]);

  function handleChoose(qIdx, optIdx) {
    const n = [...answers];
    n[qIdx] = optIdx;
    setAnswers(n);
  }

  function handleSubmit() {
    clearInterval(timerRef.current);
    const total = quiz.questions.length;
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const wrong = total - correct;
    const timeTaken = (quiz.time || 0) - timeLeft;
    const result = {
      score: Math.round((correct / total) * 100),
      correct,
      wrong,
      total,
      timeTaken,
      submittedAt: new Date().toISOString(),
    };
    onSubmit(result);
    onClose();
  }

  return (
    <div className="quiz-modal">
      <div className="quiz-card">
        <div className="quiz-header">
          <h3>{quiz.title || "DPP Quiz"}</h3>
          <div className="quiz-timer">⏱ {formatTime(timeLeft)}</div>
        </div>

        <div className="quiz-body">
          {quiz.questions.map((q, i) => (
            <div key={i} className="quiz-q">
              <div className="quiz-q-title">
                <strong>{i + 1}.</strong> {q.q}
              </div>
              <div className="quiz-options">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    className={`quiz-opt ${answers[i] === oi ? "selected" : ""}`}
                    onClick={() => handleChoose(i, oi)}
                  >
                    <span className="opt-label">{String.fromCharCode(65 + oi)}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="quiz-actions">
          <button className="btn-muted" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Submit Quiz</button>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function App() {
  const batches = [class11, class12];

  // UI state
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

  // persistent state
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ms_completed") || "{}");
    } catch {
      return {};
    }
  });

  const [quizResults, setQuizResults] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ms_quiz_results") || "{}");
    } catch {
      return {};
    }
  });

  // UI extras
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null); // lecture id for 3-dot

  useEffect(() => {
    localStorage.setItem("ms_completed", JSON.stringify(completedMap));
  }, [completedMap]);

  useEffect(() => {
    localStorage.setItem("ms_quiz_results", JSON.stringify(quizResults));
  }, [quizResults]);

  // search filter (multi-level)
  const q = search.trim().toLowerCase();
  const filteredBatches = batches.filter((b) => {
    if (!q) return true;
    if (b.name.toLowerCase().includes(q)) return true;
    return b.subjects.some((s) => {
      if (s.name.toLowerCase().includes(q)) return true;
      return s.chapters.some((c) => c.name.toLowerCase().includes(q));
    });
  });

  // computed: chapter progress: count items (lectures + notes + sheet + dpp + dppVideo + quiz)
  function chapterPercent(ch) {
    if (!ch) return 0;
    let items = 0;
    let done = 0;
    // lectures
    (ch.lectures || []).forEach((l) => {
      items++;
      if (completedMap[l.id]) done++;
    });
    // resources
    if (ch.notes) { items++; if (completedMap[`${ch.id}_notes`]) done++; }
    if (ch.sheet) { items++; if (completedMap[`${ch.id}_sheet`]) done++; }
    if (ch.dpp) { items++; if (completedMap[`${ch.id}_dpp`]) done++; }
    if (ch.dppVideo) { items++; if (completedMap[`${ch.id}_dppVideo`]) done++; }
    if (ch.dppQuiz) { items++; if (quizResults[ch.id]) done++; }
    if (items === 0) return 0;
    return Math.round((done / items) * 100);
  }

  function toggleComplete(id) {
    setCompletedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  }

  function openQuiz(chapter) {
    if (!chapter.dppQuiz) {
      alert("No quiz found for this chapter.");
      return;
    }
    setActiveQuiz(chapter.dppQuiz);
    setShowQuiz(true);
  }

  function onSubmitQuiz(chId, result) {
    // save result under chapter id
    setQuizResults((prev) => {
      const next = { ...prev, [chId]: result };
      return next;
    });
    // mark quiz completed (for progress)
    setCompletedMap((p) => ({ ...p, [`${chId}_quiz`]: true }));
  }

  return (
    <div className="ms-app">
      <header className="ms-header">
        <div className="ms-title">Modestudy</div>
        <div className="ms-controls">
          <input
            className="ms-search"
            placeholder="Search batch / subject / chapter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="ms-main">
        {/* BATCH LIST */}
        {!selectedBatch ? (
          <section className="ms-grid">
            {filteredBatches.map((b) => (
              <div
                key={b.id}
                className="ms-card"
                onClick={() => { setSelectedBatch(b); setSelectedSubject(null); }}
              >
                <div className="ms-card-thumb">
                  <img
                    src={b.img || PLACEHOLDER_BATCH}
                    alt={b.name}
                    style={{ width: "100%", height: "auto", objectFit: "contain", background: "#000" }}
                  />
                </div>
                <div className="ms-card-body">
                  <div className="ms-card-title">{b.name}</div>
                  <div className="ms-card-sub">Click to open subjects</div>
                </div>
              </div>
            ))}
          </section>
        ) : !selectedSubject ? (
          // SUBJECTS
          <section className="ms-list">
            <button className="ms-back" onClick={() => setSelectedBatch(null)}>← Home</button>
            <h2>{selectedBatch.name}</h2>
            <div className="ms-sub-grid">
              {selectedBatch.subjects.map((s) => (
                <div
                  key={s.id}
                  className="ms-sub-card"
                  onClick={() => { setSelectedSubject(s); }}
                >
                  <img
                    className="ms-sub-teacher"
                    src={s.img || PLACEHOLDER_TEACHER}
                    alt={s.name}
                    style={{ width: 90, height: 90, objectFit: "contain", borderRadius: "999px", background: "#000" }}
                  />
                  <div className="ms-sub-name">{s.name}</div>
                </div>
              ))}
            </div>
          </section>
        ) : !selectedChapter ? (
          // CHAPTERS (card clickable — no "Open" button)
          <section className="ms-list">
            <button className="ms-back" onClick={() => setSelectedSubject(null)}>← Back</button>
            <h2>{selectedSubject.name}</h2>
            <div className="ms-chapters">
              {selectedSubject.chapters.map((c) => (
                <div
                  key={c.id}
                  className="ms-ch-card"
                  onClick={() => setSelectedChapter(c)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="ms-ch-thumb"
                    src={c.img || (c.lectures && c.lectures[0] ? rumbleThumbnail(c.lectures[0].url) : PLACEHOLDER_CHAPTER)}
                    alt={c.name}
                    style={{ width: 140, height: "auto", objectFit: "contain", borderRadius: 8, background: "#000" }}
                  />
                  <div className="ms-ch-body">
                    <div className="ms-ch-title">{c.name}</div>
                    <div className="ms-ch-meta">
                      <div className="ms-ch-percent">{chapterPercent(c)}% completed</div>
                      <div className="ms-ch-actions">
                        {/* Removed Open button — entire card is clickable */}
                        {c.dppQuiz && <button className="ms-quiz-btn" onClick={(e) => { e.stopPropagation(); openQuiz(c); }}>Start DPP Quiz</button>}
                      </div>
                    </div>
                    <div className="ms-progress-shell">
                      <div className="ms-progress-fill" style={{ width: `${chapterPercent(c)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : !selectedLecture ? (
          // LECTURE list + resources
          <section className="ms-list">
            <button className="ms-back" onClick={() => setSelectedChapter(null)}>← Back</button>
            <h2>{selectedChapter.name}</h2>

            <div className="ms-resources-row">
              {selectedChapter.notes && <a className="ms-resource" href={selectedChapter.notes} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_notes`)}>📒 Notes</a>}
              {selectedChapter.sheet && <a className="ms-resource" href={selectedChapter.sheet} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_sheet`)}>📘 Sheet</a>}
              {selectedChapter.dpp && <a className="ms-resource" href={selectedChapter.dpp} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_dpp`)}>📄 DPP</a>}
              {selectedChapter.dppVideo && <a className="ms-resource" href={selectedChapter.dppVideo} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_dppVideo`)}>🎥 DPP Video</a>}
              {selectedChapter.dppQuiz && <button className="ms-resource ms-resource-quiz" onClick={() => openQuiz(selectedChapter)}>📝 DPP Quiz</button>}
            </div>

            <div className="ms-lecture-list">
              {selectedChapter.lectures.map((lec) => {
                const completed = !!completedMap[lec.id];
                return (
                  <div key={lec.id} className="ms-lecture-row">
                    <div className="ms-lecture-left" onClick={() => setSelectedLecture(lec)} style={{ cursor: "pointer" }}>
                      <img
                        className="ms-lecture-thumb"
                        src={rumbleThumbnail(lec.url)}
                        alt={lec.title}
                        style={{ width: 110, height: "auto", objectFit: "contain", borderRadius: 6, background: "#000" }}
                      />
                      <div className="ms-lecture-info">
                        <div className="ms-lecture-title">{lec.title}</div>
                        <div className="ms-lecture-sub">{lec.duration || ""}</div>
                      </div>
                    </div>

                    <div className="ms-lecture-right">
                      <button className="ms-dots" onClick={(e) => { e.stopPropagation(); setMenuOpenFor(menuOpenFor === lec.id ? null : lec.id); }}>⋯</button>

                      {/* small menu */}
                      {menuOpenFor === lec.id && (
                        <div className="ms-menu" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => { toggleComplete(lec.id); setMenuOpenFor(null); }}>{completed ? "Unmark Complete" : "Mark Complete"}</button>
                          <button onClick={() => { window.open(lec.url, "_blank"); setMenuOpenFor(null); }}>Open in Rumble</button>
                          <button onClick={() => { navigator.clipboard?.writeText(lec.url); alert("Link copied"); setMenuOpenFor(null); }}>Copy link</button>
                        </div>
                      )}

                      {/* green tick */}
                      {completed && (<svg className="ms-tick" viewBox="0 0 24 24"><path fill="none" stroke="#00e676" strokeWidth="2.5" d="M4 12l4 4L20 6" /></svg>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          // VIDEO player page
          <section className="ms-player">
            <button className="ms-back" onClick={() => setSelectedLecture(null)}>← Back</button>
            <h2>{selectedLecture.title}</h2>
            <div className="ms-player-wrap">
              {/* overlay blocker to hide suggested thumbnails */}
              <div className="ms-player-overlay" />
              <iframe
                className="ms-player-iframe"
                src={selectedLecture.url}
                title={selectedLecture.title}
                allow="autoplay; fullscreen"
                sandbox="allow-same-origin allow-scripts allow-presentation"
                allowFullScreen
                onLoad={() => {
                  // mark lecture done when iframe loads
                  setCompletedMap((p) => ({ ...p, [selectedLecture.id]: true }));
                }}
              />
            </div>

            <div className="ms-player-actions">
              <button onClick={() => { setCompletedMap((p) => ({ ...p, [selectedLecture.id]: true })); }} className="btn-primary">Mark Complete</button>

              {/* quiz summary if any */}
              {selectedChapter.dppQuiz && quizResults[selectedChapter.id] && (
                <div className="ms-quiz-summary">
                  <div>Quiz: {quizResults[selectedChapter.id].score}%</div>
                  <div>{quizResults[selectedChapter.id].correct}/{quizResults[selectedChapter.id].total} correct</div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* QUIZ MODAL */}
      {showQuiz && activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setShowQuiz(false)}
          onSubmit={(res) => {
            const chId = selectedChapter ? selectedChapter.id : activeQuiz.chapterId || "unknown";
            setQuizResults((p) => ({ ...p, [chId]: res }));
            setShowQuiz(false);
          }}
          existingResult={quizResults[selectedChapter?.id]}
        />
      )}
    </div>
  );
}
