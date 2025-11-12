import React, { useState } from 'react';
import Header from './components/Header';
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

  // 🌗 Theme toggle logic
  const [darkTheme, setDarkTheme] = useState(true);
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle('alt-theme', !darkTheme);
  };

  // 🏫 Batch list
  const batches = [
    { id: 'class11', name: 'Class 11th ✨', data: class11, image: '/images/class11.jpg' },
    { id: 'class12', name: 'Class 12th 🚀', data: class12, image: '/images/class12.jpg' }
  ];

  // 🔍 Search filter
  const filtered = batches.filter(b => {
    if (!q) return true;
    const s = q.toLowerCase();
    return b.name.toLowerCase().includes(s);
  });

  // ♻️ Reset function
  function reset(level) {
    if (level === 'batch') {
      setSelectedBatch(null);
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSelectedVideo(null);
    } else if (level === 'subject') {
      setSelectedSubject(null);
      setSelectedChapter(null);
      setSelectedVideo(null);
    } else if (level === 'chapter') {
      setSelectedChapter(null);
      setSelectedVideo(null);
    }
  }

  return (
    <div className="app-container">

      {/* 🌗 THEME TOGGLE CENTER TOP */}
      <div className="theme-toggle-wrapper">
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* 🌟 HEADER */}
      <Header />

      {/* 🔍 SEARCH BAR */}
      <SearchBar value={q} onChange={setQ} />

      {/* 📚 BATCH GRID */}
      {!selectedBatch && (
        <BatchGrid
          batches={filtered.map(b => ({
            id: b.id,
            name: b.name,
            image: b.image,
            onClick: () => setSelectedBatch(b.data)
          }))}
        />
      )}

      {/* 📘 SUBJECTS */}
      {selectedBatch && !selectedSubject && (
        <SubjectList
          batch={selectedBatch}
          onSelect={s => setSelectedSubject(s)}
          onBack={() => reset('batch')}
        />
      )}

      {/* 🧩 CHAPTERS */}
      {selectedSubject && !selectedChapter && (
        <ChapterList
          subject={selectedSubject}
          onSelect={c => setSelectedChapter(c)}
          onBack={() => reset('subject')}
        />
      )}

      {/* 🎥 LECTURES */}
      {selectedChapter && !selectedVideo && (
        <ContentTabs
          chapter={selectedChapter}
          onSelectVideo={v => setSelectedVideo(v)}
          onBack={() => reset('chapter')}
        />
      )}

      {/* ▶️ VIDEO PLAYER */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onBack={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
