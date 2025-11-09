import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BatchGrid from './components/BatchGrid';
import SubjectList from './components/SubjectList';
import ChapterList from './components/ChapterList';
import ContentTabs from './components/ContentTabs';
import VideoPlayer from './components/VideoPlayer';
import { batches } from './data/batchesData';

export default function App(){
  const [selectedBatch,setSelectedBatch] = useState(null);
  const [selectedSubject,setSelectedSubject] = useState(null);
  const [selectedChapter,setSelectedChapter] = useState(null);
  const [selectedVideo,setSelectedVideo] = useState(null);
  const [q,setQ] = useState('');

  function reset(level){
    if(level==='batch'){ setSelectedBatch(null); setSelectedSubject(null); setSelectedChapter(null); setSelectedVideo(null); }
    else if(level==='subject'){ setSelectedSubject(null); setSelectedChapter(null); setSelectedVideo(null); }
    else if(level==='chapter'){ setSelectedChapter(null); setSelectedVideo(null); }
  }

  // simple search filter on batch name / class / sir
  const filtered = batches.filter(b=>{
    if(!q) return true;
    const s = q.toLowerCase();
    return b.name.toLowerCase().includes(s) || (b.class||'').toLowerCase().includes(s) || (b.sir||'').toLowerCase().includes(s);
  });

  return (
    <div>
      <Header />
      <SearchBar value={q} onChange={setQ} />

      {!selectedBatch && <BatchGrid batches={filtered} onSelect={b=>setSelectedBatch(b)} />}

      {selectedBatch && !selectedSubject && <SubjectList batch={selectedBatch} onSelect={s=>setSelectedSubject(s)} onBack={()=>reset('batch')} />}

      {selectedSubject && !selectedChapter && <ChapterList subject={selectedSubject} onSelect={c=>setSelectedChapter(c)} onBack={()=>reset('subject')} />}

      {selectedChapter && !selectedVideo && <ContentTabs chapter={selectedChapter} onSelectVideo={v=>setSelectedVideo(v)} onBack={()=>reset('chapter')} />}

      {selectedVideo && <VideoPlayer video={selectedVideo} onBack={()=>setSelectedVideo(null)} />}

    </div>
  )
}
