require('dotenv').config();

/* console.log("🔍 ENV CHECK:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID ? "✅ " + process.env.FIREBASE_PROJECT_ID : "❌ Missing");
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL ? "✅ " + process.env.FIREBASE_CLIENT_EMAIL : "❌ Missing");
console.log("FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "✅ Set (length: " + process.env.FIREBASE_PRIVATE_KEY.length + ")" : "❌ Missing");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ " + process.env.CLOUDINARY_CLOUD_NAME : "❌ Missing");
 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const componentRoutes = require('./routes/components');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://10.5.10.132:3000',
  ],
  credentials: true,
}));app.use(express.json());

// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected to recyclehub database'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/components', componentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ReCycle Hub API is running 🌱' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`🚀 ReCycle Hub server running on port ${PORT}`);
});
