const admin = require('../firebaseAdmin');

// Verifies the Firebase ID token sent in the Authorization header
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Checks if the authenticated user has the "admin" custom claim set in Firebase
// To set admin claim, run in your backend or Firebase Admin console:
//   admin.auth().setCustomUserClaims(uid, { admin: true })
const verifyAdmin = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if (req.user?.admin === true) {
      next();
    } else {
      return res.status(403).json({ error: 'Admin access required' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
