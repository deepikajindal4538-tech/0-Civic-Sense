import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';
import Feed from './components/Feed';
import ReportIssue from './components/ReportIssue';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header id="main-header" className="site-header">
            <div className="main-nav-bar">
                <div className="brand brand-logo" style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)'}}>
                    <span>CivicConnect</span>
                </div>
                <nav className="horizontal-nav">
                    <ul className="nav-links">
                        <li><Link to="/" className="nav-link">Public Feed</Link></li>
                        <li><Link to="/report" className="nav-link">Report Issue</Link></li>
                        <li><Link to="/dashboard" className="nav-link">Admin Dashboard</Link></li>
                    </ul>
                </nav>
                <div className="nav-actions">
                    <Link to="/login" className="btn-primary" style={{padding: '10px 20px', textDecoration: 'none'}}>Login</Link>
                </div>
            </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Auth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
