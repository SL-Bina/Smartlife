import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Typography } from '@material-tailwind/react';
import {
  UserCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return diff + ' saniyə əvvəl';
  if (diff < 3600)  return Math.floor(diff / 60) + ' dəqiqə əvvəl';
  if (diff < 86400) return Math.floor(diff / 3600) + ' saat əvvəl';
  return Math.floor(diff / 86400) + ' gün əvvəl';
}

// ── StoryViewer ───────────────────────────────────────────────────────────────
function StoryViewer({ stories, startIndex, onClose }) {
  const [idx, setIdx]           = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const DURATION = 5000;

  const goNext = () => {
    if (idx < stories.length - 1) { setIdx((i) => i + 1); setProgress(0); }
    else onClose();
  };
  const goPrev = () => {
    if (idx > 0) { setIdx((i) => i - 1); setProgress(0); }
  };

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { clearInterval(intervalRef.current); goNext(); }
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [idx]);

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };
  const story = stories[idx];

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-[200000] flex items-center justify-center bg-black/80 backdrop-blur-sm'
      onClick={handleBackdrop}
    >
      <div
        className='relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl'
        style={{ height: '85vh', background: story.gradient }}
      >
        {/* Progress bars */}
        <div className='absolute top-0 left-0 right-0 flex gap-1 p-2 z-10'>
          {stories.map((_, i) => (
            <div key={i} className='flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden'>
              <div
                className='h-full bg-white rounded-full transition-none'
                style={{ width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className='absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-10'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-white/30 flex items-center justify-center'>
              <UserCircleIcon className='h-5 w-5 text-white' />
            </div>
            <div>
              <Typography className='text-white text-xs font-bold leading-tight'>{story.author}</Typography>
              <Typography className='text-white/70 text-[10px]'>{timeAgo(story.created_at)}</Typography>
            </div>
          </div>
          <button onClick={onClose} className='p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors'>
            <XMarkIcon className='h-5 w-5 text-white' />
          </button>
        </div>

        {/* Tap zones */}
        <div className='absolute inset-0 flex z-[5]'>
          <div className='flex-1' onClick={goPrev} />
          <div className='flex-1' onClick={goNext} />
        </div>

        {idx > 0 && (
          <button onClick={goPrev} className='absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/25 hover:bg-black/40 transition-colors'>
            <ChevronLeftIcon className='h-5 w-5 text-white' />
          </button>
        )}
        {idx < stories.length - 1 && (
          <button onClick={goNext} className='absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/25 hover:bg-black/40 transition-colors'>
            <ChevronRightIcon className='h-5 w-5 text-white' />
          </button>
        )}

        {/* Content */}
        <div className='absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent z-10'>
          <Typography variant='h4' className='text-white font-bold mb-2 drop-shadow'>
            {story.title}
          </Typography>
          <Typography className='text-white/90 text-sm leading-relaxed whitespace-pre-wrap drop-shadow'>
            {story.body}
          </Typography>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── StoriesBar ────────────────────────────────────────────────────────────────
export function StoriesBar({ groups, height = 160 }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [seen, setSeen]               = useState({});

  const open = (group) => {
    setActiveGroup(group);
    setViewerOpen(true);
    setSeen((s) => ({ ...s, [group.id]: true }));
  };

  if (!groups || groups.length === 0) return null;

  return (
    <>
      <div className='flex gap-2.5 overflow-x-auto pb-1' style={{ scrollbarWidth: 'none' }}>
        {groups.map((group) => {
          const hasSeen = seen[group.id];
          return (
            <button
              key={group.id}
              onClick={() => open(group)}
              className='flex-shrink-0 relative rounded-xl overflow-hidden shadow-md focus:outline-none'
              style={{
                width: 'calc(25% - 8px)',
                minWidth: 80,
                height,
                background: hasSeen ? '#9ca3af' : group.gradient,
                opacity: hasSeen ? 0.75 : 1,
              }}
            >
              {group.stories.length > 1 && (
                <div className='absolute top-1.5 right-1.5 bg-black/40 rounded-full px-1.5 py-0.5'>
                  <span className='text-white text-[9px] font-bold'>{group.stories.length}</span>
                </div>
              )}
              <div className='flex flex-col items-center justify-center h-full px-1 pb-5'>
                <span className='text-3xl leading-none select-none drop-shadow'>{group.emoji}</span>
              </div>
              <div className='absolute bottom-0 left-0 right-0 px-1.5 pb-1.5 bg-gradient-to-t from-black/50 to-transparent'>
                <span className='text-white text-[9px] font-semibold leading-tight block text-center truncate drop-shadow'>
                  {group.author}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {viewerOpen && activeGroup && (
        <StoryViewer
          stories={activeGroup.stories}
          startIndex={0}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

// ── Demo data ─────────────────────────────────────────────────────────────────
export const DEMO_STORY_GROUPS = [
  {
    id: 'g1',
    author: 'SmartLife İdarəetmə',
    emoji: '🏢',
    gradient: 'linear-gradient(160deg,#6366f1,#8b5cf6)',
    stories: [
      { id: '_s1', title: 'Mini Festival 🎉', body: 'Bu həftəsonu kompleksdə uşaqlar üçün mini festival keçiriləcək!\nSaat 15:00-da başlayır. Hamı dəvətlidir.', gradient: 'linear-gradient(160deg,#6366f1,#8b5cf6)', created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
      { id: '_s4', title: 'Ödəniş Xatırlatması 💳', body: 'Kommunal xidmətlər üzrə martın 10-na qədər\nödənişi tamamlamanızı xahiş edirik.', gradient: 'linear-gradient(160deg,#3b82f6,#6366f1)', created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
      { id: '_s5', title: 'Yeni Qaydalar 📋', body: 'Kompleks daxilində yanlış park etmə haqqında\nyeni qaydalar qəbul edilib.', gradient: 'linear-gradient(160deg,#8b5cf6,#6366f1)', created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    ],
  },
  {
    id: 'g2',
    author: 'Texniki Xidmət',
    emoji: '🔧',
    gradient: 'linear-gradient(160deg,#f59e0b,#ef4444)',
    stories: [
      { id: '_s2', title: 'Lift Baxışı 🔧', body: 'B blokunda lift texniki baxışı sabah saat 11:00-dadır.\nNarahatlıq üçün üzr istəyirik.', gradient: 'linear-gradient(160deg,#f59e0b,#ef4444)', created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
      { id: '_s6', title: 'Su Kəsilməsi 💧', body: 'Sabah saat 09:00-13:00 arasında A blokunda planlı su kəsilməsi olacaq.', gradient: 'linear-gradient(160deg,#06b6d4,#3b82f6)', created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
    ],
  },
  {
    id: 'g3',
    author: 'Kompleks Xəbərləri',
    emoji: '📢',
    gradient: 'linear-gradient(160deg,#10b981,#059669)',
    stories: [
      { id: '_s3', title: 'Yeni Yaşıl Zona 🌿', body: 'Yeni yaşıl zona istifadəyə verildi.\nAxşam saatlarında giriş açıqdır.', gradient: 'linear-gradient(160deg,#10b981,#059669)', created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
      { id: '_s7', title: 'Aylıq Hesabat 📊', body: 'Fevral ayı üzərə kompleks hesabatı hazırlandı.\nAilə başına orta xərc 145 AZN olub.', gradient: 'linear-gradient(160deg,#059669,#10b981)', created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString() },
      { id: '_s8', title: 'Oyun Meydançası 🎮', body: 'Uşaqlar üçün yeni oyun meydançası quraşdırılıb.\nBazar ertəsi istifadəyə verilib.', gradient: 'linear-gradient(160deg,#f59e0b,#10b981)', created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString() },
    ],
  },
  {
    id: 'g4',
    author: 'Günəşlik',
    emoji: '⚡',
    gradient: 'linear-gradient(160deg,#0ea5e9,#6366f1)',
    stories: [
      { id: '_s9', title: 'Elektroenerjiyə qənaət ⚡', body: 'Gecə saatlarında (22:00-07:00) elektrik sarfiyatını azaldın.\nKompleks enerji qənaətini birlikdə həyata keçirək!', gradient: 'linear-gradient(160deg,#0ea5e9,#6366f1)', created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString() },
    ],
  },
];
