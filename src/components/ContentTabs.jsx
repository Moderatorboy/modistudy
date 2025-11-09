import React, { useState } from 'react';

export default function ContentTabs({chapter,onSelectVideo,onBack}){
  const [tab,setTab] = useState('lectures');
  return (
    <div className="container">
      <div className="panel">
        <button className="backbtn" onClick={onBack}>← Back to Chapters</button>
        <div className="breadcrumbs">Chapter • {chapter.name}</div>

        <div style={{marginTop:12}}>
          <button onClick={()=>setTab('lectures')}>Lectures</button>
          <button onClick={()=>setTab('notes')}>Notes</button>
          <button onClick={()=>setTab('dpp')}>DPP</button>
        </div>

        <div style={{marginTop:12}}>
          {tab==='lectures' && chapter.lectures.map(l=>(
            <div key={l.id} style={{marginBottom:8}}>
              <button onClick={()=>onSelectVideo(l)} style={{width:'100%',textAlign:'left'}}>{l.title}</button>
            </div>
          ))}

          {tab==='notes' && (
            <ul>
              {chapter.notes.map((n,i)=><li key={i}><a href={n} target="_blank" rel="noreferrer">{n}</a></li>)}
              {chapter.notes.length===0 && <li style={{color:'rgba(255,255,255,0.6)'}}>No notes</li>}
            </ul>
          )}

          {tab==='dpp' && (
            <ul>
              {chapter.dpp.map((d,i)=><li key={i}><a href={d} target="_blank" rel="noreferrer">{d}</a></li>)}
              {chapter.dpp.length===0 && <li style={{color:'rgba(255,255,255,0.6)'}}>No DPP</li>}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
