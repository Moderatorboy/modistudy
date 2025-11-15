import React, { useEffect, useState, useRef } from "react";
import { class11 } from "./data/class11";
import { class12 } from "./data/class12";
import "./styles/theme.css";

const PLACEHOLDER_BATCH = "/images/placeholder_batch.png";
const PLACEHOLDER_TEACHER = "/images/placeholder_teacher.png";
const PLACEHOLDER_CHAPTER = "/images/placeholder_chapter.png";

// Rumble utility
function rumbleIdFromUrl(url) {
  try {
    const m =
      url.match(/\/embed\/([a-zA-Z0-9_-]+)/) ||
      url.match(/\/([a-zA-Z0-9_-]+)(?:\.html|$)/);
    if (m) return m[1];
  } catch {}
  return null;
}
function rumbleThumbnail(url) {
  const id = rumbleIdFromUrl(url);
  if (!id) return PLACEHOLDER_CHAPTER;
  return `https://rumble.com/${id}.thumbnail.jpg`;
}

// Quiz modal
function QuizModal({ quiz, onClose, onSubmit, existingResult }) {
  const [answers, setAnswers] = useState(quiz.questions.map(() => null));
  const [timeLeft, setTimeLeft] = useState(quiz.time || 0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!quiz.time) return;
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
  }, [quiz]);

  const handleChoose = (qIdx, optIdx) => {
    const n = [...answers];
    n[qIdx] = optIdx;
    setAnswers(n);
  };

  const handleSubmit = () => {
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
  };

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

// Helpers
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// App
export default function App() {
  const batches = [class11, class12];

  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);

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

  const [showQuiz, setShowQuiz] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  useEffect(() => {
    localStorage.setItem("ms_completed", JSON.stringify(completedMap));
  }, [completedMap]);
  useEffect(() => {
    localStorage.setItem("ms_quiz_results", JSON.stringify(quizResults));
  }, [quizResults]);

  const q = search.trim().toLowerCase();
  const filteredBatches = batches.filter((b) => {
    if (!q) return true;
    if (b.name.toLowerCase().includes(q)) return true;
    return b.subjects.some((s) => {
      if (s.name.toLowerCase().includes(q)) return true;
      return s.chapters.some((c) => c.name.toLowerCase().includes(q));
    });
  });

  function chapterPercent(ch) {
    if (!ch) return 0;
    let items = 0, done = 0;
    (ch.lectures || []).forEach(l => { items++; if (completedMap[l.id]) done++; });
    if (ch.notes) { items++; if (completedMap[`${ch.id}_notes`]) done++; }
    if (ch.sheet) { items++; if (completedMap[`${ch.id}_sheet`]) done++; }
    if (ch.dpp) { items++; if (completedMap[`${ch.id}_dpp`]) done++; }
    if (ch.dppVideo) { items++; if (completedMap[`${ch.id}_dppVideo`]) done++; }
    if (ch.dppQuiz) { items++; if (quizResults[ch.id]) done++; }
    if (items === 0) return 0;
    return Math.round((done / items) * 100);
  }

  function toggleComplete(id) {
    setCompletedMap(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function openQuiz(chapter) {
    if (!chapter.dppQuiz) { alert("No quiz found"); return; }
    setActiveQuiz(chapter.dppQuiz);
    setShowQuiz(true);
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
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="ms-main">
        {!selectedBatch ? (
          <section className="ms-grid">
            {filteredBatches.map(b => (
              <div key={b.id} className="ms-card" onClick={() => { setSelectedBatch(b); setSelectedSubject(null); }}>
                <div className="ms-card-thumb"><img src={b.img || PLACEHOLDER_BATCH} alt={b.name} /></div>
                <div className="ms-card-body">
                  <div className="ms-card-title">{b.name}</div>
                  <div className="ms-card-sub">Click to open subjects</div>
                </div>
              </div>
            ))}
          </section>
        ) : !selectedSubject ? (
          <section className="ms-list">
            <button className="ms-back" onClick={() => setSelectedBatch(null)}>← Home</button>
            <h2>{selectedBatch.name}</h2>
            <div className="ms-sub-grid">
              {selectedBatch.subjects.map(s => (
                <div key={s.id} className="ms-sub-card" onClick={() => setSelectedSubject(s)}>
                  <img className="ms-sub-teacher" src={s.img || PLACEHOLDER_TEACHER} alt={s.name} />
                  <div className="ms-sub-name">{s.name}</div>
                </div>
              ))}
            </div>
          </section>
        ) : !selectedChapter ? (
          <section className="ms-list">
            <button className="ms-back" onClick={() => setSelectedSubject(null)}>← Back</button>
            <h2>{selectedSubject.name}</h2>
            <div className="ms-chapters">
              {selectedSubject.chapters.map(c => (
                <div key={c.id} className="ms-ch-card">
                  <img className="ms-ch-thumb" src={c.img || (c.lectures && c.lectures[0] ? rumbleThumbnail(c.lectures[0].url) : PLACEHOLDER_CHAPTER)} alt={c.name} />
                  <div className="ms-ch-body">
                    <div className="ms-ch-title">{c.name}</div>
                    <div className="ms-ch-meta">
                      <div className="ms-ch-percent">{chapterPercent(c)}% completed</div>
                      <div className="ms-ch-actions">
                        {c.dppQuiz && <button className="ms-quiz-btn" onClick={() => openQuiz(c)}>Start DPP Quiz</button>}
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
        ) : (
          <section className="ms-list">
            <button className="ms-back" onClick={() => setSelectedChapter(null)}>← Back</button>
            <h2>{selectedChapter.name}</h2>
            {/* Lecture + resources list */}
            <div className="ms-resources-row">
              {selectedChapter.notes && <a className="ms-resource" href={selectedChapter.notes} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_notes`)}>📒 Notes</a>}
              {selectedChapter.sheet && <a className="ms-resource" href={selectedChapter.sheet} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_sheet`)}>📘 Sheet</a>}
              {selectedChapter.dpp && <a className="ms-resource" href={selectedChapter.dpp} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_dpp`)}>📄 DPP</a>}
              {selectedChapter.dppVideo && <a className="ms-resource" href={selectedChapter.dppVideo} target="_blank" rel="noreferrer" onClick={() => toggleComplete(`${selectedChapter.id}_dppVideo`)}>🎥 DPP Video</a>}
              {selectedChapter.dppQuiz && <button className="ms-resource ms-resource-quiz" onClick={() => openQuiz(selectedChapter)}>📝 DPP Quiz</button>}
            </div>
            <div className="ms-lecture-list">
              {selectedChapter.lectures.map(lec => {
                const completed = !!completedMap[lec.id];
                return (
                  <div key={lec.id} className="ms-lecture-row">
                    <div className="ms-lecture-left" onClick={() => setSelectedLecture(lec)}>
                      <img className="ms-lecture-thumb" src={rumbleThumbnail(lec.url)} alt={lec.title} />
                      <div className="ms-lecture-info">
                        <div className="ms-lecture-title">{lec.title}</div>
                        <div className="ms-lecture-sub">{lec.duration || ""}</div>
                      </div>
                    </div>
                    <div className="ms-lecture-right">
                      <button className="ms-dots" onClick={(e) => { e.stopPropagation(); setMenuOpenFor(menuOpenFor === lec.id ? null : lec.id); }}>⋯</button>
                      {menuOpenFor === lec.id && (
                        <div className="ms-menu" onClick={e => e.stopPropagation()}>
                          <button onClick={() => { toggleComplete(lec.id); setMenuOpenFor(null); }}>{completed ? "Unmark Complete" : "Mark Complete"}</button>
                          <button onClick={() => { window.open(lec.url, "_blank"); setMenuOpenFor(null); }}>Open in Rumble</button>
                          <button onClick={() => { navigator.clipboard?.writeText(lec.url); alert("Link copied"); setMenuOpenFor(null); }}>Copy link</button>
                        </div>
                      )}
                      {completed && (<svg className="ms-tick" viewBox="0 0 24 24"><path fill="none" stroke="#00e676" strokeWidth="2.5" d="M4 12l4 4L20 6" /></svg>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {showQuiz && activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setShowQuiz(false)}
          onSubmit={(res) => {
            const chId = selectedChapter ? selectedChapter.id : activeQuiz.chapterId || "unknown";
            setQuizResults(p => ({ ...p, [chId]: res }));
            setCompletedMap(p => ({ ...p, [`${chId}_quiz`]: true }));
            setShowQuiz(false);
          }}
          existingResult={quizResults[selectedChapter?.id]}
        />
      )}
    </div>
  );
}
