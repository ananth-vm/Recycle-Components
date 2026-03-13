# ♻️ ReCycle Hub
### E-Waste Component Reusability Platform

ReCycle Hub bridges the gap between e-waste donors and certified recycling warehouses.
Citizens can report reusable electronic components; admins verify, test, and route them to appropriate destinations.

---

## 🏗️ Tech Stack
- **Frontend:** React JS (with React Router, Axios)
- **Backend:** Express JS (Node.js)
- **Database:** MongoDB (via Mongoose)
- **Auth:** Firebase Authentication (Email/Password + Google)
- **Image Storage:** Cloudinary

---

## 📁 Project Structure
```
recyclehub/
├── server/          ← Express backend
│   ├── config/      ← DB & Firebase admin config
│   ├── middleware/  ← Auth verification middleware
│   ├── models/      ← Mongoose schemas
│   └── routes/      ← API routes
└── client/          ← React frontend
    └── src/
        ├── components/  ← Shared UI components
        ├── context/     ← Auth context
        ├── pages/       ← Route pages
        └── utils/       ← API helpers
```

---

## 🚀 Setup Guide

### 1. Clone & Install
```bash
git clone <your-repo>
cd recyclehub
npm run install-all
```

### 2. Configure Environment Variables

**Server** — copy `server/.env.example` → `server/.env` and fill in:
- MongoDB URI (from MongoDB Atlas)
- Firebase Admin SDK credentials (from Firebase Console → Service Accounts)
- Cloudinary credentials (from Cloudinary Dashboard)

**Client** — copy `client/.env.example` → `client/.env` and fill in:
- Firebase web app config values (from Firebase Console → Project Settings → Your Apps)

### 3. Set Admin Access
After a user signs up, grant admin rights via the backend script:
```bash
cd server
node scripts/setAdmin.js <user-email>
```

### 4. Run Development Servers
```bash
# From root
npm run dev
# Starts both Express (port 5000) and React (port 3000)
```

---

## 👥 User Roles

| Feature | Donor | Admin |
|---|---|---|
| Report component with photos | ✅ | - |
| View own submissions | ✅ | - |
| View all components | - | ✅ |
| Verify component receipt | - | ✅ |
| Test & submit test report | - | ✅ |
| Approve / Reject component | - | ✅ |
| Assign to warehouse | - | ✅ |
| Confirm delivery | - | ✅ |

---

## 📦 Component Status Flow
```
Pending → Verified → Testing → Approved → PickupAssigned → Delivered
                             ↘ Rejected
```
