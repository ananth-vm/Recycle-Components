import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const STATUS_ORDER = ['Pending', 'Verified', 'Testing', 'Approved', 'PickupAssigned', 'Delivered'];

export default function AdminComponentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states for each action panel
  const [verifyNotes, setVerifyNotes] = useState('');
  const [testReport, setTestReport]   = useState('');
  const [testPassed, setTestPassed]   = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [warehouse, setWarehouse] = useState({ name: '', contact: '', address: '' });

  useEffect(() => {
    api.get(`/admin/components/${id}`)
      .then((res) => setComponent(res.data))
      .catch(() => toast.error('Could not load component'))
      .finally(() => setLoading(false));
  }, [id]);

  const reload = async () => {
    const res = await api.get(`/admin/components/${id}`);
    setComponent(res.data);
  };

  const doAction = async (endpoint, payload, successMsg) => {
    setActionLoading(true);
    try {
      await api.patch(`/admin/components/${id}/${endpoint}`, payload);
      toast.success(successMsg);
      await reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="page"><div className="loading-spinner">Loading...</div></div>;
  if (!component) return <div className="page"><p>Component not found.</p></div>;

  const c = component;
  const statusIdx = STATUS_ORDER.indexOf(c.status);

  return (
    <div className="page detail-page">
      {/* Back nav */}
      <button className="back-btn" onClick={() => navigate('/admin')}>← Back to Admin Panel</button>

      {/* Header */}
      <div className="detail-header">
        <div>
          <h1>{c.category}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
            <StatusBadge status={c.status} />
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Condition: <strong>{c.condition}</strong>
            </span>
          </div>
        </div>
        <div className="detail-date">
          Submitted {new Date(c.createdAt).toLocaleString('en-IN')}
        </div>
      </div>

      {/* Status timeline */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Progress</h3>
        <div className="timeline">
          {STATUS_ORDER.map((s, i) => {
            // Skip 'Testing' in the visual — it's an internal state
            const done = i <= statusIdx;
            const rejected = c.status === 'Rejected';
            return (
              <div key={s} className={`timeline-step ${done && !rejected ? 'done' : ''} ${rejected && s === 'Approved' ? 'skipped' : ''}`}>
                <div className="step-dot" />
                <div className="step-label">{s}</div>
              </div>
            );
          })}
          {c.status === 'Rejected' && (
            <div className="timeline-step rejected-step">
              <div className="step-dot step-dot-red" />
              <div className="step-label">Rejected</div>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="detail-grid">
        {/* Left: info */}
        <div>
          <div className="card detail-card">
            <div className="detail-section">
              <h3>Donor Information</h3>
              <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value">{c.donorName}</span></div>
              <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{c.donorEmail}</span></div>
              <div className="detail-row"><span className="detail-label">Phone</span><span className="detail-value">{c.donorPhone}</span></div>
            </div>

            <div className="detail-section">
              <h3>Pickup Location</h3>
              <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{c.location.address}</span></div>
              <div className="detail-row"><span className="detail-label">City</span><span className="detail-value">{c.location.city}</span></div>
              <div className="detail-row"><span className="detail-label">State</span><span className="detail-value">{c.location.state}</span></div>
              <div className="detail-row"><span className="detail-label">Pincode</span><span className="detail-value">{c.location.pincode}</span></div>
            </div>

            <div className="detail-section">
              <h3>Component Description</h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text)' }}>{c.description}</p>
            </div>

            {c.adminNotes && (
              <div className="detail-section">
                <h3>Admin Notes</h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{c.adminNotes}</p>
              </div>
            )}

            {c.testReport && (
              <div className="detail-section">
                <h3>Test Report</h3>
                <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{c.testReport}</p>
              </div>
            )}

            {c.status === 'Rejected' && c.rejectionReason && (
              <div className="detail-section">
                <h3>Rejection Reason</h3>
                <p style={{ color: '#c0392b', fontSize: '0.92rem' }}>{c.rejectionReason}</p>
              </div>
            )}

            {c.assignedWarehouse?.name && (
              <div className="detail-section">
                <h3>Assigned Warehouse</h3>
                <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value">{c.assignedWarehouse.name}</span></div>
                <div className="detail-row"><span className="detail-label">Contact</span><span className="detail-value">{c.assignedWarehouse.contact}</span></div>
                <div className="detail-row"><span className="detail-label">Address</span><span className="detail-value">{c.assignedWarehouse.address}</span></div>
              </div>
            )}
          </div>

          {/* Photos */}
          {c.photos?.length > 0 && (
            <div className="card detail-card" style={{ marginTop: '1rem' }}>
              <div className="detail-section">
                <h3>Component Photos</h3>
                <div className="photo-grid">
                  {c.photos.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Component ${i + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: action panel */}
        <div>
          {/* ACTION: Verify receipt */}
          {c.status === 'Pending' && (
            <div className="action-panel">
              <h3>✅ Verify Receipt</h3>
              <p className="action-desc">Confirm that you have physically received this component.</p>
              <div className="form-group">
                <label>Admin Notes (optional)</label>
                <textarea value={verifyNotes} onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Any initial observations..." />
              </div>
              <button className="btn btn-success btn-block" disabled={actionLoading}
                onClick={() => doAction('verify', { adminNotes: verifyNotes }, 'Component verified!')}>
                {actionLoading ? 'Saving...' : 'Confirm Receipt'}
              </button>
            </div>
          )}

          {/* ACTION: Test & Report */}
          {(c.status === 'Verified' || c.status === 'Testing') && (
            <div className="action-panel">
              <h3>🔬 Submit Test Report</h3>
              <p className="action-desc">Test the component and record your findings below.</p>
              <div className="form-group">
                <label>Test Report *</label>
                <textarea value={testReport} onChange={(e) => setTestReport(e.target.value)}
                  placeholder="Describe test results: functionality, damage, reusability potential..." required />
              </div>
              <div className="form-group">
                <label>Outcome</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" checked={testPassed} onChange={() => setTestPassed(true)} />
                    ✅ Approve — component is reusable
                  </label>
                  <label className="radio-label">
                    <input type="radio" checked={!testPassed} onChange={() => setTestPassed(false)} />
                    ❌ Reject — component is not reusable
                  </label>
                </div>
              </div>
              {!testPassed && (
                <div className="form-group">
                  <label>Rejection Reason *</label>
                  <input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Burnt capacitors, non-functional, no reuse value" />
                </div>
              )}
              <button
                className={`btn btn-block ${testPassed ? 'btn-success' : 'btn-danger'}`}
                disabled={actionLoading || !testReport || (!testPassed && !rejectReason)}
                onClick={() => doAction('test-report', { testReport, passed: testPassed, rejectionReason: rejectReason },
                  testPassed ? 'Component approved!' : 'Component rejected')}
              >
                {actionLoading ? 'Saving...' : testPassed ? 'Approve Component' : 'Reject Component'}
              </button>
            </div>
          )}

          {/* ACTION: Assign Warehouse */}
          {c.status === 'Approved' && (
            <div className="action-panel">
              <h3>🏭 Assign to Warehouse</h3>
              <p className="action-desc">Assign a warehouse for this component to be picked up and delivered to.</p>
              <div className="form-group">
                <label>Warehouse Name *</label>
                <input value={warehouse.name} onChange={(e) => setWarehouse({ ...warehouse, name: e.target.value })}
                  placeholder="e.g. GreenBridge Recycling Hub" required />
              </div>
              <div className="form-group">
                <label>Warehouse Contact *</label>
                <input value={warehouse.contact} onChange={(e) => setWarehouse({ ...warehouse, contact: e.target.value })}
                  placeholder="Phone or email" required />
              </div>
              <div className="form-group">
                <label>Warehouse Address *</label>
                <textarea value={warehouse.address} onChange={(e) => setWarehouse({ ...warehouse, address: e.target.value })}
                  placeholder="Full warehouse address" required />
              </div>
              <button className="btn btn-primary btn-block" disabled={actionLoading || !warehouse.name || !warehouse.contact || !warehouse.address}
                onClick={() => doAction('assign-warehouse', warehouse, 'Warehouse assigned!')}>
                {actionLoading ? 'Saving...' : 'Assign Warehouse'}
              </button>
            </div>
          )}

          {/* ACTION: Confirm Delivery */}
          {c.status === 'PickupAssigned' && (
            <div className="action-panel">
              <h3>📦 Confirm Delivery</h3>
              <p className="action-desc">
                Mark this component as successfully delivered to <strong>{c.assignedWarehouse?.name}</strong>.
              </p>
              <button className="btn btn-success btn-block" disabled={actionLoading}
                onClick={() => doAction('confirm-delivery', {}, 'Delivery confirmed! 🎉')}>
                {actionLoading ? 'Saving...' : 'Confirm Delivery'}
              </button>
            </div>
          )}

          {/* Final state messages */}
          {c.status === 'Delivered' && (
            <div className="action-panel success-panel">
              <div className="success-icon">🎉</div>
              <h3>Journey Complete</h3>
              <p>This component has been successfully delivered to {c.assignedWarehouse?.name} and will be responsibly reused or recycled.</p>
            </div>
          )}
          {c.status === 'Rejected' && (
            <div className="action-panel danger-panel">
              <div className="success-icon">⛔</div>
              <h3>Component Rejected</h3>
              <p>This component did not pass testing and cannot be reused. The donor has been notified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
