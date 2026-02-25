import React, { useState } from 'react';
import { login } from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      console.log('Login error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        <p>Access your rewards dashboard</p>
        
        {error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick login for demo */}
        <div className="demo-credentials">
          <p><strong>Demo Accounts:</strong></p>
          <p>Resident: maria.garcia@email.com / resident123</p>
          <p>Admin: admin@casaperks.com / admin123!</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
