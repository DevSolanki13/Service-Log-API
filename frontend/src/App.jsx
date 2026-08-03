import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('landing'); // 'landing', 'login', 'register'

  useEffect(() => {
    // Load auth info
    const savedToken = localStorage.getItem('token');
    const savedName = localStorage.getItem('userName');
    if (savedToken && savedName) {
      setToken(savedToken);
      setUserName(savedName);
    }
    
    // Clear light-theme body class if any, since Light theme is now the only theme
    document.body.classList.remove('light-theme');
    
    setLoading(false);
  }, []);

  const handleAuthSuccess = (newToken, name) => {
    setToken(newToken);
    setUserName(name);
    setAuthView('landing');
  };

  const handleDemoTrigger = () => {
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('userName', 'Demo Driver');
    setToken('demo-token');
    setUserName('Demo Driver');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    // Also clean up demo items on logout to allow clean starts
    localStorage.removeItem('demo_vehicles');
    localStorage.removeItem('demo_services');
    setToken(null);
    setUserName('');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'sans-serif'
      }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading Service Tracker...</p>
      </div>
    );
  }

  return (
    <>
      {token ? (
        <Dashboard 
          token={token} 
          userName={userName} 
          onLogout={handleLogout} 
        />
      ) : (
        <>
          <Landing 
            onAuthTrigger={setAuthView} 
            onDemoTrigger={handleDemoTrigger}
          />
          <Auth 
            isOpen={authView !== 'landing'} 
            onClose={() => setAuthView('landing')} 
            defaultIsLogin={authView === 'login'} 
            onAuthSuccess={handleAuthSuccess} 
          />
        </>
      )}
    </>
  );
}

export default App;
