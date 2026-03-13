require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const admin = require('../firebaseAdmin');

const email = process.argv[2];

if (!email) {
  console.error('❌  Usage: node scripts/setAdmin.js <email>');
  process.exit(1);
}

async function setAdmin() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅  Admin claim set for ${email} (UID: ${user.uid})`);
    console.log('   The user must log out and log back in for the change to take effect.');
    process.exit(0);
  } catch (err) {
    console.error('❌  Error:', err.message);
    process.exit(1);
  }
}

setAdmin();
