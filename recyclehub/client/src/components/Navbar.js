import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ♻ ReCycle<span>Hub</span>
      </Link>
      <div className="navbar-links">
        {currentUser ? (
          <>
            {isAdmin ? (
              <Link to="/admin">Admin Panel</Link>
            ) : (
              <>
                <Link to="/dashboard">My Donations</Link>
                <Link to="/donate" className="btn btn-primary btn-sm">+ Donate Component</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
