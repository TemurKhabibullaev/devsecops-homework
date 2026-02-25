import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('casaperks_user');
    const savedToken = localStorage.getItem('casaperks_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('casaperks_token');
    localStorage.removeItem('casaperks_user');
    setUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏠 CasaPerks Rewards</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.firstName || user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        )}
      </header>
      <main>
        {user ? <Dashboard user={user} /> : <Login onLogin={handleLogin} />}
      </main>
    </div>
  );
}

export default App;
