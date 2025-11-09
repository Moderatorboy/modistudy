import React, { useEffect, useState } from 'react';

export default function VideoPlayer({video,onBack}){
  const quotes = [
    'Seek knowledge, not fame.',
    'Practice makes mastery.',
    'Small steps every day.',
    'Questions lead to progress.'
  ];
  const [quote,setQuote] = useState(quotes[Math.floor(Math.random()*quotes.length)]);

  useEffect(()=>{
    const id = setInterval(()=>setQuote(quotes[Math.floor(Math.random()*quotes.length)]),3500);
    return ()=>clearInterval(id);
  },[]);

  return (
    <div className="container">
      <div className="panel">
        <button className="backbtn" onClick={onBack}>← Back to Chapter</button>
        <div className="breadcrumbs">{video.title}</div>
        <div className="embed">
          <iframe src={video.url} allowFullScreen title={video.title}></iframe>
          <div className="quote">{quote}</div>
        </div>
      </div>
    </div>
  )
}
