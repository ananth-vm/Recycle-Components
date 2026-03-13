import React from 'react';

const STATUS_CONFIG = {
  Pending:        { label: 'Pending',         className: 'badge-pending' },
  Verified:       { label: 'Verified',         className: 'badge-verified' },
  Testing:        { label: 'Testing',          className: 'badge-testing' },
  Approved:       { label: 'Approved',         className: 'badge-approved' },
  Rejected:       { label: 'Rejected',         className: 'badge-rejected' },
  PickupAssigned: { label: 'Pickup Assigned',  className: 'badge-pickupassigned' },
  Delivered:      { label: 'Delivered',        className: 'badge-delivered' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'badge-pending' };
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
