import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Typography, Spinner, Textarea } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import {
  BuildingOfficeIcon,
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useComplexColor } from '@/hooks/useComplexColor';
import residentComplexDashboardAPI from './api';
import { DEMO_STORY_GROUPS, StoriesBar } from '@/pages/resident/components/StoriesBar';

// ── helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return diff + ' saniyə əvvəl';
  if (diff < 3600) return Math.floor(diff / 60) + ' dəqiqə əvvəl';
  if (diff < 86400) return Math.floor(diff / 3600) + ' saat əvvəl';
  return Math.floor(diff / 86400) + ' gün əvvəl';
}

const DEMO_POSTS = [
  {
    id: '_d1',
    author: 'SmartLife İdarəetmə',
    body: 'Bu həftəsonu kompleksdə uşaqlar üçün mini festival keçiriləcək. Bütün sakinlər dəvətlidir! 🎉',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    likes_count: 24,
    comments: [
      { id: '_c1', author: 'Sakin', body: 'Əla xəbər! Uşaqlarım çox sevinəcək.', created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
    ],
    liked: false,
  },
  {
    id: '_d2',
    author: 'Texniki Xidmət',
    body: 'B blokunda lift üçün planlı texniki baxış sabah saat 11:00-da olacaq. Narahatlıq üçün üzr istəyirik.',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    likes_count: 11,
    comments: [],
    liked: false,
  },
  {
    id: '_d3',
    author: 'Kompleks Xəbərləri',
    body: 'Yeni yaşıl zona istifadəyə verildi. Axşam saatlarında giriş açıqdır. Zibili yalnız müəyyən edilmiş yerə töküldüyünüzü xahiş edirik.',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    likes_count: 37,
    comments: [
      { id: '_c2', author: 'Sakin A.', body: 'Çox gözəl olmuşdur!', created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString() },
      { id: '_c3', author: 'Sakin B.', body: 'Saçaq işığı da əlavə olunacaqmı?', created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString() },
    ],
    liked: false,
  },
];

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, color, getRgba, currentUserName }) {
  const [liked, setLiked]           = useState(post.liked || false);
  const [likeCount, setLikeCount]   = useState(post.likes_count || 0);
  const [showComments, setShow]     = useState(false);
  const [comments, setComments]     = useState(post.comments || []);
  const [commentText, setComment]   = useState('');
  const [sending, setSending]       = useState(false);
  const textareaRef = useRef(null);

  const toggleLike = async () => {
    setLiked((v) => !v);
    setLikeCount((n) => liked ? n - 1 : n + 1);
    if (!String(post.id).startsWith('_')) {
      await residentComplexDashboardAPI.likePost(post.id);
    }
  };

  const openComments = () => {
    setShow((v) => !v);
    if (!showComments) setTimeout(() => textareaRef.current?.focus(), 150);
  };

  const submitComment = async () => {
    const text = commentText.trim();
    if (!text || sending) return;
    setSending(true);
    const optimistic = {
      id: '_new_' + Date.now(),
      author: currentUserName || 'Siz',
      body: text,
      created_at: new Date().toISOString(),
    };
    setComments((c) => [...c, optimistic]);
    setComment('');
    if (!String(post.id).startsWith('_')) {
      try { await residentComplexDashboardAPI.addComment(post.id, text); }
      catch { /* keep optimistic */ }
    }
    setSending(false);
  };

  return (
    <Card className='shadow-md dark:bg-gray-800 border' style={{ borderColor: getRgba(0.18) }}>
      <CardBody className='p-0'>
        {/* Post header */}
        <div className='flex items-center gap-3 px-4 pt-4 pb-2'>
          <div className='flex-shrink-0 p-2 rounded-full' style={{ backgroundColor: getRgba(0.15) }}>
            <UserCircleIcon className='h-7 w-7' style={{ color }} />
          </div>
          <div>
            <Typography className='text-sm font-bold text-gray-900 dark:text-white leading-tight'>
              {post.author || post.author_name || 'İdarəetmə'}
            </Typography>
            <div className='flex items-center gap-1'>
              <ClockIcon className='h-3 w-3 text-gray-400' />
              <Typography variant='small' className='text-[11px] text-gray-400 dark:text-gray-500'>
                {timeAgo(post.created_at || post.date)}
              </Typography>
            </div>
          </div>
        </div>

        {/* Post body */}
        <div className='px-4 pb-3'>
          <Typography className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
            {post.body || post.text || post.message || post.content}
          </Typography>
        </div>

        {/* Divider */}
        <div className='mx-4 border-t border-gray-100 dark:border-gray-700' />

        {/* Actions */}
        <div className='flex items-center gap-1 px-3 py-2'>
          <button
            onClick={toggleLike}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
            style={liked ? { color } : { color: '#9ca3af' }}
          >
            {liked
              ? <HeartSolid className='h-4 w-4' />
              : <HeartIcon   className='h-4 w-4' />}
            <span>{likeCount > 0 ? likeCount : ''}</span>
          </button>

          <button
            onClick={openComments}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'
          >
            <ChatBubbleOvalLeftEllipsisIcon className='h-4 w-4' />
            <span>{comments.length > 0 ? comments.length : 'Şərh'}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className='border-t border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/30'>
            {comments.length > 0 && (
              <div className='divide-y divide-gray-100 dark:divide-gray-700/50'>
                {comments.map((c) => (
                  <div key={c.id} className='flex items-start gap-2 px-4 py-3'>
                    <div className='flex-shrink-0 mt-0.5 p-1.5 rounded-full bg-gray-200 dark:bg-gray-700'>
                      <UserCircleIcon className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-baseline gap-2'>
                        <Typography className='text-xs font-bold text-gray-800 dark:text-white'>
                          {c.author || c.author_name || 'Sakin'}
                        </Typography>
                        <Typography variant='small' className='text-[10px] text-gray-400'>
                          {timeAgo(c.created_at)}
                        </Typography>
                      </div>
                      <Typography className='text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-snug'>
                        {c.body || c.text || c.message}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment input */}
            <div className='flex items-end gap-2 px-4 py-3'>
              <div className='flex-shrink-0 p-1.5 rounded-full' style={{ backgroundColor: getRgba(0.12) }}>
                <UserCircleIcon className='h-4 w-4' style={{ color }} />
              </div>
              <Textarea
                ref={textareaRef}
                value={commentText}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Şərhinizi yazın...'
                rows={1}
                className='flex-1 !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-800 text-sm resize-none'
                labelProps={{ className: 'hidden' }}
                containerProps={{ className: 'flex-1' }}
              />
              <button
                onClick={submitComment}
                className='flex-shrink-0 p-2 rounded-lg transition-opacity disabled:opacity-40'
                style={{ backgroundColor: color }}
              >
                <PaperAirplaneIcon className='h-4 w-4 text-white' />
              </button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
export default function ResidentComplexDashboardPage() {
  const selectedProperty = useSelector((state) => state.property.selectedProperty);
  const user             = useSelector((state) => state.auth.user);
  const { color, getRgba, headerStyle } = useComplexColor();

  const [posts, setPosts]         = useState([]);
  const [storyGroups, setStoryGroups] = useState(DEMO_STORY_GROUPS);
  const [loading, setLoading]     = useState(true);

  const complex   = selectedProperty?.sub_data?.complex  || selectedProperty?.complex  || null;
  const mtk       = selectedProperty?.sub_data?.mtk      || selectedProperty?.mtk      || null;
  const complexName = complex?.name || 'Kompleks';
  const mtkName     = mtk?.name     || 'MTK';
  const currentUserName = user ? (user.name || user.email || 'Siz') : 'Siz';

  useEffect(() => {
    let active = true;
    setLoading(true);
    residentComplexDashboardAPI.getPosts().then((data) => {
      const list = Array.isArray(data) && data.length > 0 ? data : DEMO_POSTS;
      setPosts(list);
      setLoading(false);
    });
    return () => { active = false; };
  }, [selectedProperty]);

  return (
    <div className='space-y-5' style={{ position: 'relative', zIndex: 0 }}>

      {/* Header */}
      <div className='p-4 sm:p-6 rounded-xl shadow-lg border' style={headerStyle}>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <BuildingOfficeIcon className='h-6 w-6 sm:h-8 sm:w-8 text-white' />
          </div>
          <div>
            <Typography variant='h4' className='text-white font-bold leading-tight'>
              {complexName}
            </Typography>
            <Typography variant='small' className='text-white/80'>
              {mtkName} · Kompleks xəbər lenti
            </Typography>
          </div>
        </div>
      </div>

      {/* Stories */}
      <StoriesBar groups={storyGroups} height={300} />

      {/* Feed */}
      {loading ? (
        <div className='flex flex-col items-center justify-center py-16'>
          <Spinner className='h-7 w-7' />
          <Typography variant='small' className='text-gray-400 mt-3'>Yüklənir...</Typography>
        </div>
      ) : posts.length === 0 ? (
        <Card className='shadow-md dark:bg-gray-800 border' style={{ borderColor: getRgba(0.18) }}>
          <CardBody className='flex flex-col items-center justify-center py-16 text-center'>
            <ChatBubbleOvalLeftEllipsisIcon className='h-12 w-12 text-gray-300 dark:text-gray-600 mb-3' />
            <Typography className='text-gray-500 dark:text-gray-400 font-semibold'>Hələlik heç bir yazı yoxdur</Typography>
            <Typography variant='small' className='text-gray-400 dark:text-gray-500 mt-1'>İdarəetmə yazı paylaşanda burada görünəcək.</Typography>
          </CardBody>
        </Card>
      ) : (
        <div className='space-y-4'>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              color={color}
              getRgba={getRgba}
              currentUserName={currentUserName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
