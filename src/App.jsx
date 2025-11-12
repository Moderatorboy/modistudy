import React, { useState } from 'react';
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

  // 🌗 Theme toggle
  const [darkTheme, setDarkTheme] = useState(true);
  const toggleTheme = () => {
    setDarkTheme(prev => !prev);
    document.body.classList.toggle('alt-theme', !darkTheme);
  };

  const batches = [
    { id: 'class11', name: 'Class 11th', data: class11, image: '/images/class11.jpg' },
    { id: 'class12', name: 'Class 12th', data: class12, image: '/images/class12.jpg' }
  ];

  const filtered = batches.filter(b => !q || b.name.toLowerCase().includes(q.toLowerCase()));

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
    <div className="app-container">
      {/* 🌟 HEADER */}
      <header className="hero-header">
        <div className="header-bg"></div>
        <h1 className="brand">MODESTUDY</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* 🔍 SEARCH */}
      <SearchBar value={q} onChange={setQ} />

      {/* 📚 BATCHES */}
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
          onSelect={setSelectedSubject}
          onBack={() => reset('batch')}
        />
      )}

      {/* 🧩 CHAPTERS */}
      {selectedSubject && !selectedChapter && (
        <ChapterList
          subject={selectedSubject}
          onSelect={setSelectedChapter}
          onBack={() => reset('subject')}
        />
      )}

      {/* 🎥 LECTURES */}
      {selectedChapter && !selectedVideo && (
        <ContentTabs
          chapter={selectedChapter}
          onSelectVideo={setSelectedVideo}
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
