import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const CATEGORY_ICONS = {
  'CPU / Processor': '🖥️',
  'RAM / Memory': '💾',
  'Motherboard': '🔌',
  'GPU / Graphics Card': '🎮',
  'Hard Drive / SSD': '💿',
  'Power Supply': '⚡',
  'Monitor / Display': '🖥',
  'Battery': '🔋',
  'Circuit Board': '🔧',
  'Cable / Connector': '🔗',
  'Cooling Fan': '🌀',
  'Keyboard / Input Device': '⌨️',
  'Other': '📦',
};

const STATUS_MESSAGES = {
  Pending: 'Awaiting admin review',
  Verified: 'Admin confirmed receipt',
  Testing: 'Component under testing',
  Approved: 'Passed testing — ready for pickup',
  Rejected: 'Component could not be reused',
  PickupAssigned: 'Warehouse assigned for pickup',
  Delivered: 'Successfully delivered to warehouse ✓',
};

export default function DonorDashboard() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/components/my')
      .then((res) => setComponents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loading-spinner">Loading your donations...</div></div>;

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1>My Donations</h1>
          <p className="page-subtitle">{components.length} component{components.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <Link to="/donate" className="btn btn-primary">+ Donate Component</Link>
      </div>

      {components.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No donations yet</h3>
          <p>Start by donating your first reusable component.</p>
          <Link to="/donate" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Donate Now
          </Link>
        </div>
      ) : (
        <div className="component-list">
          {components.map((c) => (
            <div key={c._id} className="component-card donor-card">
              <div className="component-card-icon">
                {CATEGORY_ICONS[c.category] || '📦'}
              </div>
              <div className="component-card-body">
                <div className="component-card-title">{c.category}</div>
                <div className="component-card-meta">
                  {c.location.city}, {c.location.state} · {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="status-message">{STATUS_MESSAGES[c.status]}</div>
              </div>
              <div className="component-card-right">
                <StatusBadge status={c.status} />
                {c.status === 'Rejected' && c.rejectionReason && (
                  <div className="rejection-note">Reason: {c.rejectionReason}</div>
                )}
                {c.status === 'PickupAssigned' && c.assignedWarehouse?.name && (
                  <div className="warehouse-note">📦 {c.assignedWarehouse.name}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
