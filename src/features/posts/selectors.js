import { createSelector } from '@reduxjs/toolkit';

/** All currently loaded posts (raw). */
export const selectPosts = (state) => state.posts.posts;

/** Current search term. */
export const selectSearchTerm = (state) => state.searchTerm;

/** Posts filtered by the search term (case-insensitive match on title). */
export const selectFilteredPosts = createSelector(
  [selectPosts, selectSearchTerm],
  (posts, searchTerm) => {
    if (!searchTerm) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter((post) => post.title.toLowerCase().includes(term));
  }
);
