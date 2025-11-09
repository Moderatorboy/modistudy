import React from 'react';

export default function ChapterList({subject,onSelect,onBack}){
  return (
    <div className="container">
      <div className="panel">
        <button className="backbtn" onClick={onBack}>← Back to Subjects</button>
        <div className="breadcrumbs">Subject • {subject.name}</div>
        <div className="list">
          {subject.chapters.map(c=>(
            <button key={c.id} onClick={()=>onSelect(c)}>{c.name}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
