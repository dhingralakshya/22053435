import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/TrendingPosts';
import Feed from './components/Feed';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Social Analytics</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Top Users</Link>
            <Link className="nav-link" to="/trending">Trending Posts</Link>
            <Link className="nav-link" to="/feed">Live Feed</Link>
          </div>
        </div>
      </nav>
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<TopUsers />} />
          <Route path="/trending" element={<TrendingPosts />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;