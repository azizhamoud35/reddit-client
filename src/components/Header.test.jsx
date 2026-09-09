import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import searchTermReducer from '../features/searchTerm/searchTermSlice';

function renderHeader() {
  const store = configureStore({
    reducer: { searchTerm: searchTermReducer },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </Provider>
  );
  return store;
}

describe('Header', () => {
  it('renders the logo and the search input', () => {
    renderHeader();
    expect(screen.getByLabelText(/reddit client home/i)).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText(/search posts/i)).toBeInTheDocument();
  });

  it('updates the search term in the store as the user types', () => {
    const store = renderHeader();
    const input = screen.getByLabelText(/search posts/i);
    fireEvent.change(input, { target: { value: 'react' } });
    expect(store.getState().searchTerm).toBe('react');
  });

  it('shows a clear button and clears the term on click', () => {
    const store = renderHeader();
    const input = screen.getByLabelText(/search posts/i);
    fireEvent.change(input, { target: { value: 'hooks' } });
    fireEvent.click(screen.getByLabelText(/clear search/i));
    expect(store.getState().searchTerm).toBe('');
  });
});
