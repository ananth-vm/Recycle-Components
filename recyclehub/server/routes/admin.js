const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { verifyAdmin } = require('../middleware/auth');

// GET /api/admin/components
// View all components with optional status filter
router.get('/components', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const components = await Component.find(filter).sort({ createdAt: -1 });
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/components/:id
// View single component details
router.get('/components/:id', verifyAdmin, async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ error: 'Component not found' });
    res.json(component);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/components/:id/verify
// Admin confirms physical receipt of the component
router.patch('/components/:id/verify', verifyAdmin, async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Verified',
        verifiedAt: new Date(),
        adminNotes: req.body.adminNotes || '',
      },
      { new: true }
    );
    res.json({ message: 'Component verified', component });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/components/:id/test-report
// Admin submits a test report (moves to Approved or Rejected)
router.patch('/components/:id/test-report', verifyAdmin, async (req, res) => {
  try {
    const { testReport, passed, rejectionReason } = req.body;
    const update = {
      testReport,
      status: passed ? 'Approved' : 'Rejected',
    };
    if (passed) update.approvedAt = new Date();
    else {
      update.rejectionReason = rejectionReason || 'Failed testing';
      update.rejectedAt = new Date();
    }

    const component = await Component.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ message: `Component ${passed ? 'approved' : 'rejected'}`, component });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/components/:id/assign-warehouse
// Admin assigns the component to a warehouse for pickup
router.patch('/components/:id/assign-warehouse', verifyAdmin, async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      {
        status: 'PickupAssigned',
        assignedWarehouse: { name, contact, address },
        pickedUpAt: new Date(),
      },
      { new: true }
    );
    res.json({ message: 'Warehouse assigned', component });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/components/:id/confirm-delivery
// Admin marks component as delivered to warehouse
router.patch('/components/:id/confirm-delivery', verifyAdmin, async (req, res) => {
  try {
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      { status: 'Delivered', deliveredAt: new Date() },
      { new: true }
    );
    res.json({ message: 'Delivery confirmed', component });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats
// Dashboard summary stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const stats = await Component.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = await Component.countDocuments();
    res.json({ total, breakdown: stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
