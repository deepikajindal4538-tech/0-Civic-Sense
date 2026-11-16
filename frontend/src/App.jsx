import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Auth from './components/Auth';
import Feed from './components/Feed';
import ReportIssue from './components/ReportIssue';
import Dashboard from './components/Dashboard';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('civic_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('civic_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

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
                <div className="nav-actions" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <button 
                      className="theme-toggle-btn"
                      onClick={toggleTheme}
                      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                      aria-label="Toggle theme"
                    >
                      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
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
