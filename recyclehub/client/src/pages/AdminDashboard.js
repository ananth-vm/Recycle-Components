import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['All', 'Pending', 'Verified', 'Testing', 'Approved', 'Rejected', 'PickupAssigned', 'Delivered'];

const CATEGORY_ICONS = {
  'CPU / Processor': '🖥️', 'RAM / Memory': '💾', 'Motherboard': '🔌',
  'GPU / Graphics Card': '🎮', 'Hard Drive / SSD': '💿', 'Power Supply': '⚡',
  'Monitor / Display': '🖥', 'Battery': '🔋', 'Circuit Board': '🔧',
  'Cable / Connector': '🔗', 'Cooling Fan': '🌀', 'Keyboard / Input Device': '⌨️', 'Other': '📦',
};

export default function AdminDashboard() {
  const [components, setComponents] = useState([]);
  const [stats, setStats] = useState({ total: 0, breakdown: [] });
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchData = async (status) => {
    setLoading(true);
    try {
      const params = status && status !== 'All' ? `?status=${status}` : '';
      const [compRes, statsRes] = await Promise.all([
        api.get(`/admin/components${params}`),
        api.get('/admin/stats'),
      ]);
      setComponents(compRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(activeFilter); }, [activeFilter]);

  const getStatCount = (status) => {
    const found = stats.breakdown.find((b) => b._id === status);
    return found ? found.count : 0;
  };

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1>Admin Panel</h1>
          <p className="page-subtitle">Manage and route donated components</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Components</div>
        </div>
        {['Pending', 'Verified', 'Approved', 'Delivered'].map((s) => (
          <div className="stat-card" key={s}>
            <div className="stat-number">{getStatCount(s)}</div>
            <div className="stat-label">{s}</div>
          </div>
        ))}
        <div className="stat-card stat-card-danger">
          <div className="stat-number">{getStatCount('Rejected')}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tab-bar">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`tab ${activeFilter === s ? 'active' : ''}`}
            onClick={() => setActiveFilter(s)}
          >
            {s}
            {s !== 'All' && <span className="tab-count">{getStatCount(s)}</span>}
          </button>
        ))}
      </div>

      {/* Component list */}
      {loading ? (
        <div className="loading-spinner">Loading components...</div>
      ) : components.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗂️</div>
          <h3>No components found</h3>
          <p>No components with status "{activeFilter}".</p>
        </div>
      ) : (
        <div className="component-list">
          {components.map((c) => (
            <Link to={`/admin/component/${c._id}`} key={c._id} className="component-card">
              <div className="component-card-icon">{CATEGORY_ICONS[c.category] || '📦'}</div>
              <div className="component-card-body">
                <div className="component-card-title">{c.category}</div>
                <div className="component-card-meta">
                  <strong>{c.donorName}</strong> · {c.donorPhone}
                </div>
                <div className="component-card-meta">
                  📍 {c.location.city}, {c.location.state} · {c.location.pincode}
                </div>
                <div className="component-card-meta text-muted">
                  Submitted {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="component-card-right">
                <StatusBadge status={c.status} />
                <span className="arrow-icon">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
