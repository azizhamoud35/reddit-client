import { describe, it, expect } from 'vitest';
import postsReducer, { fetchPosts } from './postsSlice';

const fakePosts = [
  { id: 'a1', title: 'React 19 is out', score: 120 },
  { id: 'b2', title: 'Vite tips', score: 80 },
];

describe('postsSlice', () => {
  it('sets isLoading while fetching', () => {
    const state = postsReducer(undefined, fetchPosts.pending('req-1', 'reactjs'));
    expect(state.isLoading).toBe(true);
    expect(state.hasError).toBe(false);
  });

  it('stores posts and remembers the subreddit on success', () => {
    const action = {
      type: fetchPosts.fulfilled.type,
      payload: { subreddit: 'reactjs', posts: fakePosts },
    };
    const state = postsReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.posts).toEqual(fakePosts);
    expect(state.lastSubreddit).toBe('reactjs');
    expect(state.rateLimited).toBe(false);
  });

  it('captures plain API errors', () => {
    const action = {
      type: fetchPosts.rejected.type,
      payload: { name: 'ApiError', message: 'Reddit API error (HTTP 503)' },
    };
    const state = postsReducer(undefined, action);
    expect(state.hasError).toBe(true);
    expect(state.errorMessage).toContain('503');
    expect(state.rateLimited).toBe(false);
  });

  it('flags rate limiting and counts retries', () => {
    const action = {
      type: fetchPosts.rejected.type,
      payload: { name: 'RateLimitError', message: 'rate-limiting', retryAfterSeconds: 7 },
    };
    const state = postsReducer(undefined, action);
    expect(state.rateLimited).toBe(true);
    expect(state.retryAfterSeconds).toBe(7);
    expect(state.retryCount).toBe(1);
  });

  it('increments retryCount across repeated rate-limit rejections', () => {
    const action = {
      type: fetchPosts.rejected.type,
      payload: { name: 'RateLimitError', message: 'rate-limiting' },
    };
    let state = postsReducer(undefined, action);
    state = postsReducer(state, action);
    expect(state.retryCount).toBe(2);
  });

  it('clears rate-limit state on a successful refetch', () => {
    const rejected = {
      type: fetchPosts.rejected.type,
      payload: { name: 'RateLimitError', message: 'rate-limiting' },
    };
    let state = postsReducer(undefined, rejected);
    const recovered = postsReducer(state, {
      type: fetchPosts.fulfilled.type,
      payload: { subreddit: 'Home', posts: [] },
    });
    expect(recovered.rateLimited).toBe(false);
    expect(recovered.retryCount).toBe(0);
  });
});
