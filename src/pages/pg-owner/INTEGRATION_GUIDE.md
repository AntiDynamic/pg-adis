# PG Owner Module - Integration Guide

## 📦 What's Included

The **pg-owner** folder is a complete, self-contained module for PG owner functionality:

```
src/pages/pg-owner/
├── components/              # 4 owner components
├── pages/                   # 2 main pages
├── types/                   # All type definitions
├── utils/                   # Helper functions
├── index.ts                 # Central exports
└── README.md               # Complete documentation
```

---

## 🚀 Quick Integration (3 Steps)

### Step 1: Import and Add Routes

```tsx
// App.tsx or main.tsx
import { 
  PGOwnerSignupPage, 
  PGOwnerDashboard 
} from './pages/pg-owner';

function App() {
  return (
    <Routes>
      {/* Existing routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* NEW: Owner routes */}
      <Route path="/become-owner" element={<PGOwnerSignupPage />} />
      <Route path="/owner/dashboard" element={
        <PGOwnerDashboard 
          ownerId={currentUser.id} 
          ownerName={currentUser.name}
          ownerEmail={currentUser.email}
        />
      } />
    </Routes>
  );
}
```

### Step 2: Filter PGs for Students (Only Verified)

```tsx
// DashboardPage.tsx, Map.tsx, Search.tsx
import { getVerifiedPGs } from './pages/pg-owner';

function DashboardPage() {
  // ❌ OLD - Shows all PGs
  // const pgs = allPGs;
  
  // ✅ NEW - Shows only verified PGs
  const pgs = getVerifiedPGs(allPGs);
  
  return (
    <div>
      {pgs.map(pg => <PGCard key={pg.id} pg={pg} />)}
    </div>
  );
}
```

### Step 3: Add Verification Badge to PG Cards

```tsx
// PGCard.tsx
import { VerificationStatusBadge } from './pages/pg-owner';

function PGCard({ pg }) {
  return (
    <Card>
      <h3>{pg.name}</h3>
      
      {/* Add this */}
      {pg.verificationStatus === 'verified' && (
        <VerificationStatusBadge 
          status="verified" 
          size="sm" 
        />
      )}
      
      {/* Rest of card */}
    </Card>
  );
}
```

**Done! 🎉 Your app now has complete PG owner verification.**

---

## 📋 Feature Checklist

After integration, verify these features work:

### ✅ Owner Signup
- [ ] Navigate to `/become-owner`
- [ ] Complete 3-step form
- [ ] Upload proofs (doc + photos + video)
- [ ] Submit successfully
- [ ] Status shows "Pending Verification"

### ✅ Owner Dashboard
- [ ] Navigate to `/owner/dashboard`
- [ ] See all PG listings with status
- [ ] Filter by verification status
- [ ] View stats (total, verified, pending)
- [ ] Edit/update listings

### ✅ Student View (Verification Filter)
- [ ] Only verified PGs appear on dashboard
- [ ] Only verified PGs on map
- [ ] Only verified PGs in search
- [ ] Verification badge shows on cards

### ✅ Admin Panel (Optional)
- [ ] View pending verifications
- [ ] Approve/Reject with reasons
- [ ] Send notifications to owners

---

## 🔗 Common Use Cases

### Use Case 1: Add "List Your PG" Button

```tsx
// LandingPage.tsx
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <section className="cta">
      <h2>Are You a PG Owner?</h2>
      <button onClick={() => navigate('/become-owner')}>
        List Your Property
      </button>
    </section>
  );
}
```

### Use Case 2: Show Owner's PG List

```tsx
// OwnerProfile.tsx
import { getPGsByOwner } from './pages/pg-owner';

function OwnerProfile({ ownerId }) {
  const ownerPGs = getPGsByOwner(ownerId, allPGs);
  
  return (
    <div>
      <h2>My Listings ({ownerPGs.length})</h2>
      {ownerPGs.map(pg => (
        <PGListItem key={pg.id} pg={pg} />
      ))}
    </div>
  );
}
```

### Use Case 3: Filter Map Markers

```tsx
// Map.tsx
import { getVerifiedPGs } from './pages/pg-owner';

function PGMap() {
  const verifiedPGs = getVerifiedPGs(allPGs);
  
  return (
    <MapContainer>
      {verifiedPGs.map(pg => (
        <Marker 
          position={[pg.lat, pg.lng]}
          popup={<PGPopup pg={pg} />}
        />
      ))}
    </MapContainer>
  );
}
```

---

## 🛠️ Configuration

### Required Dependencies

Already included in your project:
- ✅ React 18+
- ✅ React Router
- ✅ Tailwind CSS
- ✅ TypeScript

### Optional Backend Setup

```javascript
// api/routes/owner.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// File upload config
const upload = multer({ dest: 'uploads/' });

// Submit PG
router.post('/submit-pg', 
  upload.fields([
    { name: 'ownershipDoc', maxCount: 1 },
    { name: 'roomPhotos', maxCount: 10 },
    { name: 'videoWalkthrough', maxCount: 1 }
  ]),
  async (req, res) => {
    // Create PG with status='pending_verification'
    // Send confirmation email
  }
);

// Get owner's PGs
router.get('/my-pgs/:ownerId', async (req, res) => {
  // Return all PGs for this owner
});

module.exports = router;
```

---

## 🎨 Customization

### Change Theme Colors

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Modify these for your brand
        trust: {
          400: '#your-color',
          500: '#your-color',
        }
      }
    }
  }
}
```

### Modify Verification Requirements

```tsx
// utils/ownerHelpers.ts

// Change minimum photos
export function validateRoomPhotos(files: File[]): string | null {
  if (files.length < 3) { // Was 5, now 3
    return 'Minimum 3 photos required';
  }
  // ...
}

// Change video duration limits
// Modify in PGProofUpload.tsx video validation
```

---

## 📊 Data Structure

### PG Object with Verification

```typescript
{
  id: 'pg-123',
  ownerId: 'owner-456',
  name: 'Sunshine PG',
  
  // Verification fields
  verificationStatus: 'verified', // or 'pending_verification', 'rejected'
  verified: true,
  lastVerifiedAt: Date,
  
  // Ownership proofs
  ownershipProof: {
    ownershipDocument: { ... },
    roomPhotos: [ ... ],
    videoWalkthrough: { ... }
  },
  
  // Standard PG fields
  address: { ... },
  rent: 8000,
  totalBeds: 20,
  // ...
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Module not found"
**Solution:** Ensure import path is correct
```tsx
// ✅ Correct
import { PGOwnerSignupPage } from './pages/pg-owner';

// ❌ Wrong
import { PGOwnerSignupPage } from './pages/pg-owner/pages/PGOwnerSignupPage';
```

### Issue: Types not recognized
**Solution:** Import types from module
```tsx
import { VerificationStatus, PGListingWithVerification } from './pages/pg-owner';
```

### Issue: Verified PGs not showing
**Solution:** Check filter function usage
```tsx
// Make sure you're using getVerifiedPGs
const displayPGs = getVerifiedPGs(allPGs);
console.log(displayPGs); // Check if filtering works
```

---

## 🔐 Security Checklist

Before production:
- [ ] Implement actual OTP verification
- [ ] Add file upload size limits (backend)
- [ ] Validate file types on backend
- [ ] Store files in secure cloud storage (S3, etc.)
- [ ] Implement rate limiting (max 3 submissions/month)
- [ ] Add admin authentication for verification panel
- [ ] Set up email notifications (SendGrid/AWS SES)
- [ ] Enable HTTPS for file uploads
- [ ] Implement CSRF protection
- [ ] Add audit logs for verification actions

---

## 📚 Further Reading

- [Complete Documentation](./README.md) - Full API reference
- [Type Definitions](./types/index.ts) - All TypeScript types
- [Utility Functions](./utils/ownerHelpers.ts) - Helper functions
- [Component Source](./components/) - Implementation details

---

## 🆘 Need Help?

1. **Check the README.md** in this folder for detailed docs
2. **Review component source** for implementation details
3. **Check type definitions** in `types/index.ts`
4. **Test with mock data** provided in components

---

## ✅ Production Checklist

- [ ] All routes integrated
- [ ] Verified PG filter applied everywhere
- [ ] Verification badges showing
- [ ] Owner dashboard accessible
- [ ] Backend API implemented
- [ ] File uploads working
- [ ] Email notifications configured
- [ ] Admin panel secured
- [ ] Testing completed
- [ ] Documentation updated

---

**Security First. Trust Always.** 🔒

