import React from 'react';

export default function SearchBar({value,onChange}){
  return (
    <div className="container">
      <div className="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2"/></svg>
        <input placeholder="Search batch, class, subject, sir name, lecture..." value={value} onChange={e=>onChange(e.target.value)} />
        <div style={{color:'rgba(255,255,255,0.6)'}}>Token</div>
      </div>
    </div>
  )
}
