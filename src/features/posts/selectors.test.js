import { describe, it, expect } from 'vitest';
import { selectFilteredPosts } from './selectors';

const posts = [
  { id: 'a1', title: 'React 19 is officially out' },
  { id: 'b2', title: 'Ten Vite tricks you should know' },
  { id: 'c3', title: 'Why I still write plain CSS' },
];

const state = (searchTerm) => ({
  posts: { posts },
  searchTerm,
});

describe('selectFilteredPosts', () => {
  it('returns all posts when the search term is empty', () => {
    expect(selectFilteredPosts(state(''))).toHaveLength(3);
  });

  it('filters by title, case-insensitively', () => {
    const result = selectFilteredPosts(state('REACT'));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a1');
  });

  it('matches substrings anywhere in the title', () => {
    const result = selectFilteredPosts(state('vite'));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b2');
  });

  it('returns an empty array when nothing matches', () => {
    expect(selectFilteredPosts(state('webpack'))).toEqual([]);
  });
});
