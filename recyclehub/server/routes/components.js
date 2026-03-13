const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// POST /api/components
// Donor submits a new component with photos
router.post('/', verifyToken, upload.array('photos', 5), async (req, res) => {
  try {
    const {
      donorName,
      donorEmail,
      donorPhone,
      category,
      description,
      condition,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const photos = req.files?.map((f) => f.path) || [];

    const component = new Component({
      donorName,
      donorEmail,
      donorPhone,
      donorFirebaseUID: req.user.uid,
      category,
      description,
      condition,
      location: { address, city, state, pincode },
      photos,
    });

    await component.save();
    res.status(201).json({ message: 'Component submitted successfully!', component });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/components/my
// Donor views their own submissions
router.get('/my', verifyToken, async (req, res) => {
  try {
    const components = await Component.find({ donorFirebaseUID: req.user.uid }).sort({ createdAt: -1 });
    res.json(components);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
