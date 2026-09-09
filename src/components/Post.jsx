import { Link } from 'react-router-dom';
import { timeAgo, decodeRedditUrl } from '../utils/format';
import { useState } from 'react';

function compactNumber(n) {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** Decide what media (if any) to render for a post. */
function postMedia(post) {
  if (post.is_video) {
    const src = post.preview?.images?.[0]?.source?.url;
    return src ? { kind: 'video-thumb', src: decodeRedditUrl(src) } : null;
  }
  if (post.post_hint === 'image' || /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(post.url || '')) {
    const src = post.preview?.images?.[0]?.source?.url || post.url;
    return { kind: 'image', src: decodeRedditUrl(src) };
  }
  if (post.preview?.images?.[0]?.source?.url) {
    return { kind: 'image', src: decodeRedditUrl(post.preview.images[0].source.url) };
  }
  return null;
}

export default function Post({ post }) {
  const [vote, setVote] = useState(0);
  const media = postMedia(post);
  const score = post.score + vote;

  const onVote = (direction) => {
    setVote((current) => (current === direction ? 0 : direction));
  };

  return (
    <article className="post" data-testid="post-card">
      <div className="post__votes" aria-label="Votes">
        <button
          type="button"
          className={`post__vote-btn ${vote === 1 ? 'post__vote-btn--active-up' : ''}`}
          aria-label="Upvote"
          aria-pressed={vote === 1}
          onClick={() => onVote(1)}
        >
          ▲
        </button>
        <span className="post__score">{compactNumber(score)}</span>
        <button
          type="button"
          className={`post__vote-btn ${vote === -1 ? 'post__vote-btn--active-down' : ''}`}
          aria-label="Downvote"
          aria-pressed={vote === -1}
          onClick={() => onVote(-1)}
        >
          ▼
        </button>
      </div>

      <div className="post__content">
        <p className="post__meta">
          <span className="post__subreddit">{post.subreddit_name_prefixed || `r/${post.subreddit}`}</span>
          <span className="post__dot">·</span>
          <span className="post__author">u/{post.author}</span>
          <span className="post__dot">·</span>
          <time className="post__time">{timeAgo(post.created_utc)}</time>
        </p>

        <h2 className="post__title">
          <Link to={`/posts/${post.id}`} className="post__title-link">
            {post.title}
          </Link>
        </h2>

        {media?.kind === 'image' && (
          <img
            className="post__image"
            src={media.src}
            alt=""
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {media?.kind === 'video-thumb' && (
          <div className="post__video-thumb">
            <img className="post__image" src={media.src} alt="" loading="lazy" />
            <span className="post__play-badge" aria-hidden="true">▶ video</span>
          </div>
        )}
        {!media && post.selftext && (
          <p className="post__selftext">{post.selftext.slice(0, 220)}{post.selftext.length > 220 ? '…' : ''}</p>
        )}

        <div className="post__footer">
          <Link to={`/posts/${post.id}`} className="post__comments-link">
            💬 {compactNumber(post.num_comments)} comments
          </Link>
          {post.over_18 && <span className="post__nsfw-badge">NSFW</span>}
        </div>
      </div>
    </article>
  );
}
