import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getListing } from './postsAPI';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit, { rejectWithValue }) => {
    try {
      const path = subreddit === 'Home' ? '/r/popular/.json?limit=25' : `/r/${subreddit}/.json?limit=25`;
      const { json, demo } = await getListing(path);
      const posts = (json.data?.children || []).map((child) => child.data);
      return { subreddit, posts, demo };
    } catch (err) {
      return rejectWithValue({
        name: err.name,
        message: err.message,
        retryAfterSeconds: err.retryAfterSeconds ?? null,
      });
    }
  }
);

const initialState = {
  posts: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
  rateLimited: false,
  retryAfterSeconds: 3,
  retryCount: 0,
  lastSubreddit: 'Home',
  isDemo: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearRateLimit(state) {
      state.rateLimited = false;
      state.retryCount = 0;
    },
    resetRetries(state) {
      state.retryCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.lastSubreddit = action.payload.subreddit;
        state.isDemo = Boolean(action.payload.demo);
        state.rateLimited = false;
        state.retryCount = 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload?.message || 'Failed to load posts';
        if (action.payload?.name === 'RateLimitError') {
          state.rateLimited = true;
          state.retryAfterSeconds = action.payload.retryAfterSeconds || 3;
          state.retryCount += 1;
        }
      });
  },
});

export const { clearRateLimit, resetRetries } = postsSlice.actions;
export default postsSlice.reducer;
