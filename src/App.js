// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>My Personal Blog</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/admin">Admin</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
