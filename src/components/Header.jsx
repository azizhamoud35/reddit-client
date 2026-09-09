import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../features/searchTerm/searchTermSlice';
import { Link } from 'react-router-dom';

export default function Header() {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.searchTerm);

  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="Reddit Client home">
        <span className="header__logo-mark" aria-hidden="true">◉</span>
        <span className="header__logo-text">
          reddit<span className="header__logo-accent">client</span>
        </span>
      </Link>
      <div className="header__search" role="search">
        <span className="header__search-icon" aria-hidden="true">🔎</span>
        <input
          type="search"
          className="header__search-input"
          placeholder="Search posts…"
          aria-label="Search posts"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
        {searchTerm && (
          <button
            type="button"
            className="header__search-clear"
            aria-label="Clear search"
            onClick={() => dispatch(setSearchTerm(''))}
          >
            ✕
          </button>
        )}
      </div>
    </header>
  );
}
