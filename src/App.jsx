// Paste your full fixed React + CSS code here

// I will fill layout structure first, then you can tell me to adjust parts.

// App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import Quotes from './components/Quotes';
import Chapters from './components/Chapters';
import Player from './components/Player';
import './app.css';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Quotes />
      <Chapters />
      <Player />
    </div>
  );
}

// components/Navbar.jsx
import React from 'react';
export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Modestudy</h1>
      <div className="nav-links">
        <a>Home</a>
        <a>Lectures</a>
        <a>Notes</a>
      </div>
    </nav>
  );
}

// components/Quotes.jsx
import React from 'react';
export default function Quotes() {
  return (
    <div className="quotes-box">
      "Success = Daily Small Progress"
    </div>
  );
}

// components/Chapters.jsx
import React, { useState } from 'react';

const chaptersData = [
  {
    id: 1,
    name: 'Basic Maths',
    totalLectures: 10,
    completed: 4,
  },
  {
    id: 2,
    name: 'Trigonometry',
    totalLectures: 8,
    completed: 2,
  },
];

export default function Chapters() {
  const [data, setData] = useState(chaptersData);

  return (
    <div className="chapter-list">
      {data.map((ch) => {
        const percent = Math.round((ch.completed / ch.totalLectures) * 100);
        return (
          <div key={ch.id} className="chapter-card">
            <h3>{ch.name}</h3>
            <div className="progress-box">
              <div className="progress-bar" style={{ width: percent + '%' }}></div>
            </div>
            <p className="progress-text">{percent}% Completed</p>
          </div>
        );
      })}
    </div>
  );
}

// components/Player.jsx
import React from 'react';
export default function Player() {
  return (
    <div className="player-container">
      <iframe
        src="https://odysee.com/$/embed/p8Ho7dGvF1"
        allowFullScreen
        className="video-player"
      ></iframe>
    </div>
  );
}


// app.css
.app-container {
  background: #0d0d0d;
  color: white;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 15px 25px;
  background: #111;
  border-bottom: 1px solid #232323;
}
.logo {
  font-size: 22px;
  font-weight: 600;
}
.nav-links a {
  margin-left: 20px;
  cursor: pointer;
  opacity: 0.8;
}

.quotes-box {
  margin: 25px;
  padding: 10px 20px;
  background: #1a1a1a;
  border-left: 5px solid #06d6a0;
  font-size: 18px;
  border-radius: 6px;
}

.chapter-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 20px;
}
.chapter-card {
  background: #141414;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #222;
}
.progress-box {
  width: 100%;
  height: 8px;
  background: #222;
  border-radius: 10px;
  margin-top: 10px;
}
.progress-bar {
  height: 100%;
  background: #06d6a0;
  border-radius: 10px;
}
.progress-text {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.9;
}

.player-container {
  margin: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.video-player {
  width: 90%;
  height: 320px;
  border: none;
  border-radius: 10px;
}
