import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { currentUser, isAdmin } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">🌿 E-Waste Reusability Platform</div>
          <h1>Give electronics a <em>second life</em></h1>
          <p className="hero-desc">
            ReCycle Hub connects component donors with certified recycling warehouses.
            Report reusable parts, track their journey, and keep e-waste out of landfills.
          </p>
          <div className="hero-cta">
            {currentUser ? (
              isAdmin ? (
                <Link to="/admin" className="btn btn-primary">Go to Admin Panel →</Link>
              ) : (
                <>
                  <Link to="/donate" className="btn btn-primary">+ Donate a Component</Link>
                  <Link to="/dashboard" className="btn btn-outline">View My Donations</Link>
                </>
              )
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary">Start Donating</Link>
                <Link to="/login" className="btn btn-outline">Log In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How ReCycle Hub works</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">📸</div>
            <h3>Report & Photograph</h3>
            <p>Submit photos, category, condition, and pickup location for your reusable electronic component.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <h3>Expert Verification</h3>
            <p>Our admin team confirms receipt, tests the component, and produces a detailed technical report.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🏭</div>
            <h3>Warehouse Routing</h3>
            <p>Approved components are matched to the right recycling or reuse warehouse for responsible handling.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Full Transparency</h3>
            <p>Track every step of your donation — from submission to final delivery — in real time.</p>
          </div>
        </div>
      </section>
    </>
  );
}
