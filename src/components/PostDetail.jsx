import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments } from '../features/comments/commentsSlice';
import Post from './Post';
import Comments from './Comments';

export default function PostDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.posts.posts.find((p) => p.id === id));
  const commentsState = useSelector((state) => state.comments);

  useEffect(() => {
    if (post?.permalink) {
      dispatch(fetchComments(post.permalink));
    }
  }, [post?.permalink, dispatch]);

  if (!post) {
    return (
      <div className="post-detail post-detail--missing" data-testid="post-missing">
        <h2>Post not found</h2>
        <p>The post may have been loaded in another session. Head back to the feed and open it again.</p>
        <Link className="error-state__retry" to="/">← Back to feed</Link>
      </div>
    );
  }

  return (
    <div className="post-detail" data-testid="post-detail">
      <Link to="/" className="post-detail__back">← Back to feed</Link>
      <Post post={post} />
      {post.selftext && post.selftext.length > 220 && (
        <div className="post-detail__selftext">
          <h3>Full text</h3>
          <p>{post.selftext}</p>
        </div>
      )}
      <section className="post-detail__comments" aria-label="Comments">
        <h3 className="post-detail__comments-title">
          Comments {commentsState.comments.length > 0 && `(${commentsState.comments.length})`}
        </h3>
        <Comments
          comments={commentsState.comments}
          isLoading={commentsState.isLoading}
          hasError={commentsState.hasError}
          onRetry={() => dispatch(fetchComments(post.permalink))}
        />
      </section>
    </div>
  );
}
