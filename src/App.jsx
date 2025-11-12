import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import BatchGrid from './components/BatchGrid';
import SubjectList from './components/SubjectList';
import ChapterList from './components/ChapterList';
import ContentTabs from './components/ContentTabs';
import VideoPlayer from './components/VideoPlayer';
import { class11 } from './data/class11';
import { class12 } from './data/class12';
import './styles/theme.css';

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [q, setQ] = useState('');
  const [dark, setDark] = useState(true);

  // sync body class for theme
  useEffect(() => {
    document.body.classList.toggle('alt-theme', !dark);
  }, [dark]);

  // build batches array (keeps data object)
  const batches = [
    { id: 'class11', name: 'Class 11th 🔮', data: class11, image: '/images/class11.jpg' },
    { id: 'class12', name: 'Class 12th 🚀', data: class12, image: '/images/class12.jpg' }
  ];

  const filtered = batches.filter(b => {
    if (!q) return true;
    return b.name.toLowerCase().includes(q.toLowerCase());
  });

  function reset(level) {
    if (level === 'batch') {
      setSelectedBatch(null); setSelectedSubject(null); setSelectedChapter(null); setSelectedVideo(null);
    } else if (level === 'subject') {
      setSelectedSubject(null); setSelectedChapter(null); setSelectedVideo(null);
    } else if (level === 'chapter') {
      setSelectedChapter(null); setSelectedVideo(null);
    }
  }

  return (
    <div className="app-root">
      {/* Top centered theme toggle + logo */}
      <div className="topbar">
        <button
          className="theme-toggle"
          onClick={() => setDark(prev => !prev)}
          aria-label="Toggle theme"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <header className="hero">
        <div className="hero-bg" />
        <h1 className="logo">MODESTUDY</h1>
        <div className="logo-sub">Premium learning • Clean • Fast</div>
        <div className="logo-underline" />
      </header>

      <main className="container">
        <SearchBar value={q} onChange={setQ} />

        {/* BATCH GRID */}
        {!selectedBatch && (
          <BatchGrid
            batches={filtered.map(b => ({
              id: b.id,
              name: b.name,
              image: b.image,
              onClick: () => setSelectedBatch(b) // pass full object
            }))}
          />
        )}

        {/* SUBJECTS */}
        {selectedBatch && !selectedSubject && (
          <SubjectList
            batch={selectedBatch.data}
            onSelect={s => setSelectedSubject(s)}
            onBack={() => reset('batch')}
          />
        )}

        {/* CHAPTERS */}
        {selectedSubject && !selectedChapter && (
          <ChapterList
            subject={selectedSubject}
            onSelect={c => setSelectedChapter(c)}
            onBack={() => reset('subject')}
          />
        )}

        {/* CONTENT / LECTURES */}
        {selectedChapter && !selectedVideo && (
          <ContentTabs
            chapter={selectedChapter}
            onSelectVideo={v => setSelectedVideo(v)}
            onBack={() => reset('chapter')}
          />
        )}

        {/* VIDEO PLAYER */}
        {selectedVideo && (
          <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} />
        )}
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Modestudy — Crafted with care ✨</small>
      </footer>
    </div>
  );
}
