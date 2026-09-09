import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getListing } from '../posts/postsAPI';

/** permalink looks like "/r/sub/comments/abc123/title/" — Reddit returns
 *  [ postListing, commentsListing ] for `${permalink}.json`. */
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (permalink, { rejectWithValue }) => {
    try {
      const { json, demo } = await getListing(`${permalink}.json?limit=50&depth=3`);
      const commentsListing = json[1]?.data?.children || [];
      const comments = commentsListing
        .filter((child) => child.kind === 't1')
        .map((child) => child.data);
      return { permalink, comments, demo };
    } catch (err) {
      return rejectWithValue({ name: err.name, message: err.message });
    }
  }
);

const initialState = {
  comments: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
  lastPermalink: '',
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload.comments;
        state.lastPermalink = action.payload.permalink;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.payload?.message || 'Failed to load comments';
      });
  },
});

export default commentsSlice.reducer;
