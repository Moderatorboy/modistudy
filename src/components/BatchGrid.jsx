import React from 'react';

export default function BatchGrid({batches,onSelect}){
  return (
    <div className="container">
      <div className="grid">
        {batches.map(b=>(
          <div key={b.id} className="card" onClick={()=>onSelect(b)}>
            <img src={b.image} alt={b.name} />
            <div className="meta">
              <div className="name">{b.name}</div>
              <div className="sub">{b.class} • {b.sir}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
