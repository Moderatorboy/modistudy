import React, { useState } from "react";

export default function ContentTabs({ chapter, onBack }) {
  const [tab, setTab] = useState("lectures");

  return (
    <div className="container">
      <div className="panel">
        <button className="backbtn" onClick={onBack}>← Back</button>
        <div className="breadcrumbs">{chapter.name}</div>

        {/* Tabs */}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={() => setTab("lectures")}>Lectures</button>
          <button onClick={() => setTab("notes")}>Notes</button>
          <button onClick={() => setTab("sheet")}>Sheet</button>
          <button onClick={() => setTab("dpp")}>DPP</button>
          <button onClick={() => setTab("quiz")}>Quiz</button>
        </div>

        <div style={{ marginTop: 12 }}>
          {tab === "lectures" && chapter.lectures.map((lec) => (
            <div key={lec.id} style={{ marginBottom: 8 }}>
              <img src={lec.thumbnail} alt={lec.title} style={{ width: "100%", borderRadius: 8 }} />
              <button style={{ width: "100%", textAlign: "left", marginTop: 4 }} onClick={() => window.open(lec.embed, "_blank")}>
                {lec.title}
              </button>
            </div>
          ))}

          {tab === "notes" && (chapter.notes.length
            ? chapter.notes.map((n, i) => <a key={i} href={n} target="_blank" rel="noreferrer">📄 Note {i+1}</a>)
            : <div style={{ color: "rgba(255,255,255,0.6)" }}>No Notes</div>
          )}

          {tab === "sheet" && (chapter.sheet.length
            ? chapter.sheet.map((s, i) => <a key={i} href={s} target="_blank" rel="noreferrer">📑 Sheet {i+1}</a>)
            : <div style={{ color: "rgba(255,255,255,0.6)" }}>No Sheet</div>
          )}

          {tab === "dpp" && (chapter.dpp.length
            ? chapter.dpp.map((d, i) => <a key={i} href={d} target="_blank" rel="noreferrer">🧩 DPP {i+1}</a>)
            : <div style={{ color: "rgba(255,255,255,0.6)" }}>No DPP</div>
          )}

          {tab === "quiz" && (chapter.quiz.length
            ? chapter.quiz.map((q, i) => <a key={i} href={q} target="_blank" rel="noreferrer">📝 Quiz {i+1}</a>)
            : <div style={{ color: "rgba(255,255,255,0.6)" }}>No Quiz</div>
          )}
        </div>
      </div>
    </div>
  );
}
