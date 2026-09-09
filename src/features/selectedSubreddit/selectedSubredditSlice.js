import { createSlice } from '@reduxjs/toolkit';

const selectedSubredditSlice = createSlice({
  name: 'selectedSubreddit',
  initialState: 'Home',
  reducers: {
    setSelectedSubreddit(state, action) {
      return action.payload;
    },
  },
});

export const { setSelectedSubreddit } = selectedSubredditSlice.actions;
export default selectedSubredditSlice.reducer;
