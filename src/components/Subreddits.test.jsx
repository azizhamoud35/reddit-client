import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Subreddits, { SUBREDDITS } from './Subreddits';
import selectedSubredditReducer from '../features/selectedSubreddit/selectedSubredditSlice';
import searchTermReducer from '../features/searchTerm/searchTermSlice';

function renderSubreddits(starting = 'Home', search = '') {
  const store = configureStore({
    reducer: {
      selectedSubreddit: selectedSubredditReducer,
      searchTerm: searchTermReducer,
    },
    preloadedState: { selectedSubreddit: starting, searchTerm: search },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Subreddits />
      </MemoryRouter>
    </Provider>
  );
  return store;
}

describe('Subreddits', () => {
  it('renders the predefined category filters', () => {
    renderSubreddits();
    for (const { name } of SUBREDDITS.slice(0, 4)) {
      expect(screen.getByRole('button', { name: new RegExp(name, 'i') })).toBeInTheDocument();
    }
  });

  it('marks the selected subreddit as active', () => {
    renderSubreddits('javascript');
    const active = screen.getByRole('button', { name: /javascript/i });
    expect(active).toHaveAttribute('aria-pressed', 'true');
    expect(active.className).toMatch(/--active/);
  });

  it('selecting a filter dispatches and clears the search term', () => {
    const store = renderSubreddits('Home', 'old search');
    fireEvent.click(screen.getByRole('button', { name: /space/i }));
    expect(store.getState().selectedSubreddit).toBe('space');
    expect(store.getState().searchTerm).toBe('');
  });
});
