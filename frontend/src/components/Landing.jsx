import React from 'react';
import { Car, CheckSquare, Calendar } from 'lucide-react';

const Landing = ({ onAuthTrigger, onDemoTrigger }) => {
  return (
    <div className="landing-container">
      {/* Landing Navbar */}
      <header className="landing-navbar">
        <div className="brand">
          <img src="/favicon.svg" alt="TrackMyServices Logo" className="brand-logo" />
          <span className="brand-name">TrackMyServices</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="landing-title">
          Track Your Vehicle Maintenance <br />
          <span>With Precision & Ease</span>
        </h1>

        <div className="landing-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => onAuthTrigger('register')}
            >
              Create Account
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '14px 28px' }}
              onClick={() => onAuthTrigger('login')}
            >
              Sign In
            </button>
          </div>
          
          <button
            className="btn-primary"
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              padding: '12px 24px',
              fontSize: '0.95rem',
              minHeight: 'auto'
            }}
            onClick={onDemoTrigger}
          >
            Try Demo Mode
          </button>
        </div>

        <span className="landing-features-title">Core Capabilities</span>

        <div className="landing-features" style={{ gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '1000px', marginTop: '32px' }}>
          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, #2563eb 100%)' }}>
              <Car size={20} />
            </div>
            <h3>Multi-Vehicle Separation</h3>
            <p>Manage separate service history, total spent details, and logs for every single vehicle you own.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <CheckSquare size={20} />
            </div>
            <h3>Detailed Cost Breakdown</h3>
            <p>Itemize and track specific parts, labor costs, and service totals clearly.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
              <Calendar size={20} />
            </div>
            <h3>Maintenance Reminders</h3>
            <p>Never miss services with automatic countdown status notifications for upcoming maintenance tasks.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
