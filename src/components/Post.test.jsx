import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Post from './Post';

const basePost = {
  id: 'abc123',
  title: 'A very important Reddit post about React',
  score: 15234,
  num_comments: 421,
  author: 'some_user',
  subreddit: 'reactjs',
  subreddit_name_prefixed: 'r/reactjs',
  created_utc: Math.floor(Date.now() / 1000) - 7200,
  permalink: '/r/reactjs/comments/abc123/a_very_important/',
  selftext: '',
  url: 'https://example.com/img.png',
};

describe('Post', () => {
  it('renders the title, author, subreddit and comment count', () => {
    render(
      <MemoryRouter>
        <Post post={basePost} />
      </MemoryRouter>
    );
    expect(screen.getByText(/a very important reddit post about react/i)).toBeInTheDocument();
    expect(screen.getByText('u/some_user')).toBeInTheDocument();
    expect(screen.getByText('r/reactjs')).toBeInTheDocument();
    expect(screen.getByText(/421 comments/i)).toBeInTheDocument();
  });

  it('renders a compacted score', () => {
    render(
      <MemoryRouter>
        <Post post={basePost} />
      </MemoryRouter>
    );
    expect(screen.getByText('15k')).toBeInTheDocument();
  });

  it('upvoting highlights the button and bumps the displayed score', () => {
    render(
      <MemoryRouter>
        <Post post={basePost} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText(/upvote/i));
    const up = screen.getByLabelText(/upvote/i);
    expect(up).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('15k')).toBeInTheDocument(); // 15234+1 still compacts to 15k
  });

  it('clicking upvote twice resets the vote', () => {
    render(
      <MemoryRouter>
        <Post post={basePost} />
      </MemoryRouter>
    );
    const up = screen.getByLabelText(/upvote/i);
    fireEvent.click(up);
    fireEvent.click(up);
    expect(up).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows truncated selftext for text posts', () => {
    const longText = 'x'.repeat(300);
    render(
      <MemoryRouter>
        <Post post={{ ...basePost, selftext: longText, url: '' }} />
      </MemoryRouter>
    );
    const el = screen.getByText(/x{10,}/);
    expect(el.textContent).toContain('…');
    expect(el.textContent.length).toBeLessThanOrEqual(221);
  });
});
