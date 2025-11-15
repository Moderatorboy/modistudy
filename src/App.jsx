// src/App.jsx
import React, { useState } from "react";
import BatchGrid from "./components/BatchGrid";
import SubjectList from "./components/SubjectList";
import ContentTabs from "./components/ContentTabs";
import VideoPlayer from "./components/VideoPlayer";
import SearchBar from "./components/SearchBar";

import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [
    {
      id: "b1",
      name: "CLASS 11th (JP SIR)",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      class: "11th",
      sir: "JP SIR",
      subjects: [
        {
          id: "phy",
          name: "Physics",
          chapters: [
            {
              id: "c1",
              name: "Basic Mechanics",
              notes: ["https://example.com/notes.pdf"],
              sheet: ["https://example.com/sheet.pdf"],
              dpp: ["https://example.com/dpp.pdf"],
              dppVideo: "https://odysee.com/$/embed/p8Ho7dGvF1",
              lectures: [
                { id: "l1", title: "Lecture 1 — Intro", url: "https://odysee.com/$/embed/p8Ho7dGvF1" },
                { id: "l2", title: "Lecture 2 — Motion", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
              ],
            },
          ],
        },
      ],
    },
    // Add more batches here
  ];

  const filteredBatches = batches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="hero">
        <h1 className="logo">✨ Modestudy Premium ✨</h1>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "🌤 Light Mode" : "🌙 Dark Mode"}
      </button>

      {!selectedBatch && (
        <>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <BatchGrid batches={filteredBatches} onSelect={setSelectedBatch} />
        </>
      )}

      {selectedBatch && !selectedSubject && (
        <SubjectList
          batch={selectedBatch}
          onSelect={setSelectedSubject}
          onBack={() => setSelectedBatch(null)}
        />
      )}

      {selectedSubject && !selectedChapter && (
        <ContentTabs
          chapter={{ lectures: [], notes: [], dpp: [] }} // placeholder
          onSelectVideo={(lec) => setSelectedVideo(lec)}
          onBack={() => setSelectedSubject(null)}
          chapters={selectedSubject.chapters} // pass chapters here
          onSelectChapter={(ch) => setSelectedChapter(ch)}
        />
      )}

      {selectedChapter && !selectedVideo && (
        <ContentTabs
          chapter={selectedChapter}
          onSelectVideo={setSelectedVideo}
          onBack={() => setSelectedChapter(null)}
        />
      )}

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onBack={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

export default App;
