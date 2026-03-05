import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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
function StoryViewer({ group, startIndex, onClose }) {
  const stories = group.stories;
  const [idx, setIdx]           = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);
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
    if (paused) return;
    const start = Date.now();
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { clearInterval(intervalRef.current); goNext(); }
    }, 40);
    return () => clearInterval(intervalRef.current);
  }, [idx, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  const story = stories[idx];
  const bg = story.image
    ? { backgroundImage: `url(${story.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: story.gradient || group.gradient };

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-[200000] flex items-center justify-center'
      style={{ background: 'rgba(0,0,0,0.92)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Phone-frame container */}
      <div
        className='relative overflow-hidden shadow-2xl'
        style={{ width: '100%', maxWidth: 400, height: '100dvh', maxHeight: 780, ...bg }}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Photo scrim */}
        {story.image && <div className='absolute inset-0 bg-black/25' style={{ zIndex: 1 }} />}

        {/* Progress bars */}
        <div className='absolute top-3 left-3 right-3 flex gap-1' style={{ zIndex: 20 }}>
          {stories.map((_, i) => (
            <div key={i} className='flex-1 rounded-full overflow-hidden' style={{ height: 3, background: 'rgba(255,255,255,0.3)' }}>
              <div
                className='h-full rounded-full'
                style={{
                  background: '#fff',
                  width: i < idx ? '100%' : i === idx ? `${progress}%` : '0%',
                  transition: i === idx ? 'none' : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Top bar */}
        <div className='absolute left-0 right-0 flex items-center justify-between px-3 pt-8 pb-3' style={{ zIndex: 20 }}>
          <div className='flex items-center gap-2.5'>
            {/* Mini avatar */}
            <div
              className='w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 border-2 border-white/70'
              style={{ background: group.gradient }}
            >
              {group.image
                ? <img src={group.image} alt='' className='w-full h-full object-cover rounded-full' />
                : <span className='text-base leading-none'>{group.emoji}</span>
              }
            </div>
            <div>
              <p className='text-white font-bold text-sm leading-tight drop-shadow'>{story.author || group.author}</p>
              <p className='text-white/65 text-[11px] leading-tight'>{timeAgo(story.created_at)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 rounded-full flex items-center justify-center transition-colors'
            style={{ background: 'rgba(0,0,0,0.35)' }}
          >
            <XMarkIcon className='h-4 w-4 text-white' />
          </button>
        </div>

        {/* Invisible tap zones */}
        <div className='absolute inset-0 flex' style={{ zIndex: 10 }}>
          <div className='w-1/3 h-full' onClick={goPrev} />
          <div className='w-2/3 h-full' onClick={goNext} />
        </div>

        {/* Prev/next arrow hints (small) */}
        {idx > 0 && (
          <button
            onClick={goPrev}
            className='absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all'
            style={{ zIndex: 30, background: 'rgba(0,0,0,0.3)' }}
          >
            <ChevronLeftIcon className='h-5 w-5 text-white' />
          </button>
        )}
        {idx < stories.length - 1 && (
          <button
            onClick={goNext}
            className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all'
            style={{ zIndex: 30, background: 'rgba(0,0,0,0.3)' }}
          >
            <ChevronRightIcon className='h-5 w-5 text-white' />
          </button>
        )}

        {/* Bottom content */}
        <div
          className='absolute bottom-0 left-0 right-0 px-5 pt-20 pb-10'
          style={{ zIndex: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}
        >
          <p className='text-white font-bold text-xl mb-2 drop-shadow leading-snug'>{story.title}</p>
          <p className='text-white/85 text-sm leading-relaxed drop-shadow whitespace-pre-wrap'>{story.body}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── StoriesBar ────────────────────────────────────────────────────────────────
export function StoriesBar({ groups }) {
  const [activeGroup, setActiveGroup] = useState(null);
  const [seen, setSeen]               = useState({});

  const open = (group) => {
    setActiveGroup(group);
    setSeen((s) => ({ ...s, [group.id]: true }));
  };

  const close = () => setActiveGroup(null);

  if (!groups || groups.length === 0) return null;

  return (
    <>
      <div className='flex gap-4 overflow-x-auto pb-1 px-0.5' style={{ scrollbarWidth: 'none' }}>
        {groups.map((group) => {
          const hasSeen = seen[group.id];

          return (
            <button
              key={group.id}
              onClick={() => open(group)}
              className='flex-shrink-0 flex flex-col items-center gap-1.5 focus:outline-none'
              style={{ minWidth: 64 }}
            >
              {/* Ring + avatar */}
              <div
                className='rounded-full p-[2.5px]'
                style={{
                  background: hasSeen
                    ? 'rgba(156,163,175,0.5)'
                    : group.gradient,
                  boxShadow: hasSeen ? 'none' : '0 2px 12px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  className='w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-[2.5px] border-white dark:border-gray-900'
                  style={{ background: group.gradient }}
                >
                  {group.image ? (
                    <img
                      src={group.image}
                      alt={group.author}
                      className='w-full h-full object-cover'
                      style={{ opacity: hasSeen ? 0.55 : 1 }}
                    />
                  ) : (
                    <span className='text-2xl leading-none select-none' style={{ opacity: hasSeen ? 0.55 : 1 }}>
                      {group.emoji}
                    </span>
                  )}
                </div>
              </div>

              {/* Story count badge */}
              {group.stories.length > 1 && (
                <span
                  className='absolute -mt-2 ml-10 text-[9px] font-bold text-white px-1 rounded-full'
                  style={{ background: '#ef4444', lineHeight: '14px', minWidth: 14, textAlign: 'center' }}
                >
                  {group.stories.length}
                </span>
              )}

              {/* Label */}
              <span
                className='text-[10px] font-semibold text-center leading-tight max-w-[60px] truncate'
                style={{ color: hasSeen ? '#9ca3af' : '' }}
              >
                {group.author.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <StoryViewer group={activeGroup} startIndex={0} onClose={close} />
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
    gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=75&fit=crop',
    stories: [
      {
        id: '_s1',
        title: 'Mini Festival 🎉',
        body: 'Bu həftəsonu kompleksdə uşaqlar üçün mini festival keçiriləcək!\nSaat 15:00-da başlayır. Hamı dəvətlidir.',
        gradient: 'linear-gradient(160deg,#6366f1,#8b5cf6)',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      },
      {
        id: '_s4',
        title: 'Ödəniş Xatırlatması 💳',
        body: 'Kommunal xidmətlər üzrə martın 10-na qədər\nödənişi tamamlamanızı xahiş edirik.',
        gradient: 'linear-gradient(160deg,#3b82f6,#6366f1)',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      },
      {
        id: '_s5',
        title: 'Yeni Qaydalar 📋',
        body: 'Kompleks daxilində yanlış park etmə haqqında\nyeni qaydalar qəbul edilib.',
        gradient: 'linear-gradient(160deg,#8b5cf6,#6366f1)',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'g2',
    author: 'Texniki Xidmət',
    emoji: '🔧',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=75&fit=crop',
    stories: [
      {
        id: '_s2',
        title: 'Lift Baxışı 🔧',
        body: 'B blokunda lift texniki baxışı sabah saat 11:00-dadır.\nNarahatlıq üçün üzr istəyirik.',
        gradient: 'linear-gradient(160deg,#f59e0b,#ef4444)',
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
      {
        id: '_s6',
        title: 'Su Kəsilməsi 💧',
        body: 'Sabah saat 09:00-13:00 arasında A blokunda planlı su kəsilməsi olacaq.',
        gradient: 'linear-gradient(160deg,#06b6d4,#3b82f6)',
        image: 'https://images.unsplash.com/photo-1543674892-7d64d45df18b?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'g3',
    author: 'Kompleks Xəbərləri',
    emoji: '📢',
    gradient: 'linear-gradient(135deg,#10b981,#059669)',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&q=75&fit=crop',
    stories: [
      {
        id: '_s3',
        title: 'Yeni Yaşıl Zona 🌿',
        body: 'Yeni yaşıl zona istifadəyə verildi.\nAxşam saatlarında giriş açıqdır.',
        gradient: 'linear-gradient(160deg,#10b981,#059669)',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        id: '_s7',
        title: 'Aylıq Hesabat 📊',
        body: 'Fevral ayı üzərə kompleks hesabatı hazırlandı.\nAilə başına orta xərc 145 AZN olub.',
        gradient: 'linear-gradient(160deg,#059669,#10b981)',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      },
      {
        id: '_s8',
        title: 'Oyun Meydançası 🎮',
        body: 'Uşaqlar üçün yeni oyun meydançası quraşdırılıb.\nBazar ertəsi istifadəyə verilib.',
        gradient: 'linear-gradient(160deg,#f59e0b,#10b981)',
        image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'g4',
    author: 'Günəşlik',
    emoji: '⚡',
    gradient: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=200&q=75&fit=crop',
    stories: [
      {
        id: '_s9',
        title: 'Elektroenerjiyə qənaət ⚡',
        body: 'Gecə saatlarında (22:00-07:00) elektrik sarfiyatını azaldın.\nKompleks enerji qənaətini birlikdə həyata keçirək!',
        gradient: 'linear-gradient(160deg,#0ea5e9,#6366f1)',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80&fit=crop',
        created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
    ],
  },
];
