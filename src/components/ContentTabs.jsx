// src/components/ContentTabs.jsx
import React, { useState } from "react";

export default function ContentTabs({ chapter, onSelectVideo, onBack }) {
  const [tab, setTab] = useState("lectures");

  // Helper to safely map over a string or array
  const mapLinks = (item) => {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  };

  return (
    <div className="container">
      <div className="panel">
        <button className="backbtn" onClick={onBack}>← Back</button>
        <div className="breadcrumbs">Chapter • {chapter.name}</div>

        {/* Tabs */}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={() => setTab("lectures")}>Lectures</button>
          <button onClick={() => setTab("notes")}>Notes</button>
          <button onClick={() => setTab("dpp")}>DPP</button>
          <button onClick={() => setTab("sheet")}>Sheet</button>
        </div>

        <div style={{ marginTop: 12 }}>
          {tab === "lectures" && chapter.lectures && chapter.lectures.map((lec) => (
            <div key={lec.id} style={{ marginBottom: 8 }}>
              <button
                onClick={() => onSelectVideo(lec)}
                style={{ width: "100%", textAlign: "left" }}
              >
                {lec.title}
              </button>
            </div>
          ))}

          {tab === "notes" && (
            <ul>
              {mapLinks(chapter.notes).length > 0
                ? mapLinks(chapter.notes).map((n, i) => (
                    <li key={i}>
                      <a href={n} target="_blank" rel="noreferrer">{n}</a>
                    </li>
                  ))
                : <li style={{ color: "rgba(255,255,255,0.6)" }}>No Notes</li>}
            </ul>
          )}

          {tab === "dpp" && (
            <ul>
              {mapLinks(chapter.dpp).length > 0
                ? mapLinks(chapter.dpp).map((d, i) => (
                    <li key={i}>
                      <a href={d} target="_blank" rel="noreferrer">{d}</a>
                    </li>
                  ))
                : <li style={{ color: "rgba(255,255,255,0.6)" }}>No DPP</li>}
            </ul>
          )}

          {tab === "sheet" && (
            <ul>
              {mapLinks(chapter.sheet).length > 0
                ? mapLinks(chapter.sheet).map((s, i) => (
                    <li key={i}>
                      <a href={s} target="_blank" rel="noreferrer">{s}</a>
                    </li>
                  ))
                : <li style={{ color: "rgba(255,255,255,0.6)" }}>No Sheet</li>}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
