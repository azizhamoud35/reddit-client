import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import commentsReducer from '../features/comments/commentsSlice';
import searchTermReducer from '../features/searchTerm/searchTermSlice';
import selectedSubredditReducer from '../features/selectedSubreddit/selectedSubredditSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    searchTerm: searchTermReducer,
    selectedSubreddit: selectedSubredditReducer,
  },
});
