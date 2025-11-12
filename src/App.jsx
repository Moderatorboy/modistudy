import React, { useState } from "react";
import "./styles/theme.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("alt-theme", !darkTheme);
  };

  const batches = [
    {
      id: "b1",
      name: "CLASS 11th (JP SIR)",
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      subjects: [
        { id: "phy", name: "Physics" },
        { id: "chem", name: "Chemistry" },
        { id: "math", name: "Maths" },
      ],
    },
    {
      id: "b2",
      name: "CLASS 12th (NK SIR)",
      img: "https://images.unsplash.com/photo-1584697964192-89e9e02c5b87?w=800",
      subjects: [
        { id: "phy", name: "Physics" },
        { id: "chem", name: "Chemistry" },
        { id: "math", name: "Maths" },
      ],
    },
  ];

  return (
    <div>
      {/* 🌟 HEADER */}
      <div className="hero">
        <h1 className="logo">Modestudy</h1>
      </div>

      {/* 🎚 Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkTheme ? "Switch to Light Mode 🌤" : "Switch to Dark Mode 🌙"}
      </button>

      {/* 🔍 Search */}
      <div className="search-box">
        <input type="text" placeholder="Search batches..." />
      </div>

      {/* 🧱 Batch Grid */}
      {!selectedBatch ? (
        <div className="grid">
          {batches.map((batch) => (
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
      ) : (
        <div className="list">
          <h2>{selectedBatch.name}</h2>
          {selectedBatch.subjects.map((sub) => (
            <button key={sub.id}>
              {sub.name} — View Chapters
            </button>
          ))}
          <button
            onClick={() => setSelectedBatch(null)}
            className="theme-toggle"
            style={{ marginTop: "30px" }}
          >
            🔙 Back to Batches
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
