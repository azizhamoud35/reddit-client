import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchPosts } from '../features/posts/postsSlice';

export default function ErrorState({ message, rateLimited, retryAfterSeconds, subreddit }) {
  const dispatch = useDispatch();
  const retryCount = useSelector((state) => state.posts.retryCount);

  // Automatic recovery for rate limiting: retry a bounded number of times,
  // honouring the delay Reddit asks for. Manual retry is always available.
  useEffect(() => {
    if (!rateLimited || retryCount > 3) return undefined;
    const t = setTimeout(() => {
      dispatch(fetchPosts(subreddit));
    }, Math.max(retryAfterSeconds, 3) * 1000);
    return () => clearTimeout(t);
  }, [rateLimited, retryCount, retryAfterSeconds, subreddit, dispatch]);

  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">
        {rateLimited ? '⏳' : '⚠️'}
      </span>
      <h2 className="error-state__title">
        {rateLimited ? 'Reddit is rate-limiting us' : 'Something went wrong'}
      </h2>
      <p className="error-state__message">{message}</p>
      {rateLimited && retryCount <= 3 && (
        <p className="error-state__hint">
          Retrying automatically in {Math.max(retryAfterSeconds, 3)}s
          {retryCount > 1 ? ` (attempt ${retryCount})` : ''}…
        </p>
      )}
      <button
        type="button"
        className="error-state__retry"
        onClick={() => dispatch(fetchPosts(subreddit))}
      >
        Try again
      </button>
    </div>
  );
}
