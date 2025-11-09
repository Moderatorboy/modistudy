import React from 'react';

export default function SubjectList({batch,onSelect,onBack}){
  return (
    <div className="container">
      <div className="panel">
        <button className="backbtn" onClick={onBack}>← Back to Batches</button>
        <div className="breadcrumbs">Batch • {batch.name}</div>
        <div className="list">
          {batch.subjects.map(s=>(
            <button key={s.id} onClick={()=>onSelect(s)}>{s.name}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
