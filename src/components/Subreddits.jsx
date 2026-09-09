import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedSubreddit,
} from '../features/selectedSubreddit/selectedSubredditSlice';
import { setSearchTerm } from '../features/searchTerm/searchTermSlice';

export const SUBREDDITS = [
  { name: 'Home', icon: '🏠' },
  { name: 'javascript', icon: '🟨' },
  { name: 'reactjs', icon: '⚛️' },
  { name: 'webdev', icon: '🌐' },
  { name: 'programming', icon: '💻' },
  { name: 'technology', icon: '🔧' },
  { name: 'science', icon: '🔬' },
  { name: 'space', icon: '🚀' },
  { name: 'gaming', icon: '🎮' },
  { name: 'music', icon: '🎵' },
  { name: 'movies', icon: '🎬' },
  { name: 'funny', icon: '😂' },
];

export default function Subreddits() {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.selectedSubreddit);

  return (
    <nav className="subreddits" aria-label="Subreddit filters">
      <h2 className="subreddits__title">Communities</h2>
      <ul className="subreddits__list">
        {SUBREDDITS.map(({ name, icon }) => (
          <li key={name}>
            <button
              type="button"
              className={`subreddits__item ${selected === name ? 'subreddits__item--active' : ''}`}
              aria-pressed={selected === name}
              onClick={() => {
                dispatch(setSelectedSubreddit(name));
                dispatch(setSearchTerm(''));
              }}
            >
              <span className="subreddits__icon" aria-hidden="true">{icon}</span>
              <span className="subreddits__name">{name === 'Home' ? 'r/Home (popular)' : `r/${name}`}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
