import { useSelector } from 'react-redux';
import { selectFilteredPosts } from '../features/posts/selectors';
import Post from './Post';
import Skeleton from './Skeleton';
import ErrorState from './ErrorState';

export default function PostList() {
  const posts = useSelector(selectFilteredPosts);
  const { isLoading, hasError, errorMessage, rateLimited, retryAfterSeconds, lastSubreddit } =
    useSelector((state) => state.posts);
  const searchTerm = useSelector((state) => state.searchTerm);

  if (isLoading) {
    return (
      <div className="post-list" aria-busy="true">
        {[1, 2, 3, 4, 5].map((n) => <Skeleton key={n} />)}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="post-list">
        <ErrorState
          message={errorMessage}
          rateLimited={rateLimited}
          retryAfterSeconds={retryAfterSeconds}
          subreddit={lastSubreddit}
        />
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="post-list post-list--empty">
        <p className="post-list__empty-title">No posts found</p>
        <p className="post-list__empty-hint">
          {searchTerm
            ? `Nothing matches “${searchTerm}” — try a different search.`
            : 'This feed is empty — try another community.'}
        </p>
      </div>
    );
  }

  return (
    <div className="post-list" data-testid="post-list">
      {searchTerm && (
        <p className="post-list__searching">
          {posts.length} result{posts.length === 1 ? '' : 's'} for “{searchTerm}”
        </p>
      )}
      {posts.map((post) => <Post key={post.id} post={post} />)}
    </div>
  );
}
