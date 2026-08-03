import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Key, UserPlus, AlertCircle, X } from 'lucide-react';
import { apiRequest } from '../utils/api';

const Auth = ({ isOpen, onClose, defaultIsLogin = true, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(defaultIsLogin);
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  }, [defaultIsLogin, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && name.length < 3) {
      setError('Name must be at least 3 characters long.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    const { success, data, error: apiError } = await apiRequest(endpoint, 'POST', payload);

    setLoading(false);

    if (success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      onAuthSuccess(data.token, data.user.name);
      onClose(); // Close modal upon success
    } else {
      setError(apiError);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} title="Close modal">
          <X size={20} />
        </button>

        <div className="auth-header">
          <h1>TrackMyServices</h1>
          <p>{isLogin ? 'Welcome back! Log in to view your logs' : 'Create an account to start tracking services'}</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="driver@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {isLogin ? (
              <>
                <Key size={18} />
                {loading ? 'Logging in...' : 'Log In'}
              </>
            ) : (
              <>
                <UserPlus size={18} />
                {loading ? 'Creating Account...' : 'Register'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
