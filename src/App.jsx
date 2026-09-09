import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header';
import Subreddits from './components/Subreddits';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import { fetchPosts } from './features/posts/postsSlice';

export default function App() {
  const dispatch = useDispatch();
  const selectedSubreddit = useSelector((state) => state.selectedSubreddit);
  const isDemo = useSelector((state) => state.posts.isDemo);

  useEffect(() => {
    dispatch(fetchPosts(selectedSubreddit));
  }, [selectedSubreddit, dispatch]);

  return (
    <div className="app">
      <Header />
      {isDemo && (
        <div className="app__demo-banner" role="status">
          ⓘ Live Reddit API unreachable from this network (403 network-security block) — showing the bundled sample dataset. See README to enable live data.
        </div>
      )}
      <main className="app__layout">
        <aside className="app__sidebar">
          <Subreddits />
        </aside>
        <section className="app__feed">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="*" element={<PostList />} />
          </Routes>
        </section>
      </main>
      <footer className="app__footer">
        <p>Reddit Client — a Codecademy Full-Stack Engineer portfolio project. Data from Reddit’s public JSON API.</p>
      </footer>
    </div>
  );
}
