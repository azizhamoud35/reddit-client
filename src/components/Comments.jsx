import { decodeRedditUrl, timeAgo } from '../utils/format';

function Comment({ comment, depth = 0 }) {
  const replies = (comment.replies?.data?.children || []).filter(
    (child) => child.kind === 't1'
  );

  return (
    <li className="comment" style={{ '--depth': depth }}>
      <div className="comment__header">
        <span className="comment__author">u/{comment.author}</span>
        <span className="comment__dot">·</span>
        <time className="comment__time">{timeAgo(comment.created_utc)}</time>
        {comment.score !== undefined && (
          <span className="comment__score">· {comment.score} points</span>
        )}
      </div>
      <p className="comment__body">{comment.body}</p>
      {replies.length > 0 && (
        <ul className="comment__replies">
          {replies.map((child) => (
            <Comment key={child.data.id} comment={child.data} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Comments({ comments, isLoading, hasError, onRetry }) {
  if (isLoading) {
    return (
      <div className="comments comments--loading" aria-busy="true">
        {[1, 2, 3].map((n) => (
          <div key={n} className="skeleton__block skeleton__block--lg" />
        ))}
      </div>
    );
  }
  if (hasError) {
    return (
      <div className="comments comments--error" role="alert">
        <p>Couldn’t load comments.</p>
        <button type="button" className="error-state__retry" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  if (!comments.length) {
    return <p className="comments comments--empty">No comments yet — be the first!</p>;
  }
  return (
    <ul className="comments__list" data-testid="comments-list">
      {comments.map((c) => (
        <Comment key={c.id} comment={c} />
      ))}
    </ul>
  );
}

export { decodeRedditUrl };
