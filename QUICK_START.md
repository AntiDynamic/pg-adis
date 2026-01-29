# 🚀 QUICK START - PG Owner System Integration

## ✅ What's Been Done

### 1. **Database-Ready Type System**
📁 `src/types/owner.types.ts`
- Complete TypeScript interfaces for MongoDB/PostgreSQL
- Collections: `pg_owners`, `pg_listings`, `verification_proofs`, `owner_interactions`
- Fully documented with field descriptions

### 2. **Service Layer (API Ready)**
📁 `src/services/ownerService.ts`
- All CRUD operations for owners, listings, proofs, interactions
- Mock implementations (easy to replace with real API calls)
- Helper functions for validation and distance calculation

### 3. **Enhanced Dashboard (Main Integration)**
📁 `src/pages/EnhancedDashboardPage.tsx`
- **Single dashboard** with student/owner mode switcher
- Integrated into main route: `/dashboard`
- Shows verification status, stats, and PG listings
- "Become an Owner" CTA for students

### 4. **Owner Interaction Component**
📁 `src/components/OwnerInteraction.tsx`
- Smart distance-based recommendations:
  - Far away? → Video call button
  - Nearby (<10km)? → Schedule visit button
- Schedule date/time selection
- In-app messaging

### 5. **Existing PG Owner Components** (Already working)
📁 `src/pages/pg-owner/`
- PGOwnerSignupPage - 3-step signup flow
- PGProofUpload - File uploads with validation
- VerificationStatusBadge - Status indicators
- AdminVerificationPanel - Admin review interface

---

## 🎯 Current State

✅ **npm install** - Done  
✅ **Types defined** - Database-ready  
✅ **Service layer** - Mock APIs (replace with real ones)  
✅ **Dashboard integrated** - Working on `/dashboard`  
✅ **Components created** - All verification features  
✅ **Import errors fixed** - Clean build  
✅ **Server running** - http://localhost:3002/

---

## 🌐 How to Access

### Main Dashboard (Integrated View)
```
http://localhost:3002/dashboard
```
- Toggle between Student/Owner modes
- See verification status
- Manage PG listings
- View stats and interactions

### Direct Owner Routes (Still available)
```
http://localhost:3002/owner/signup     - Add new PG
http://localhost:3002/owner/dashboard  - Owner-only view
```

---

## 🔄 Next Steps: Connect to Real Database

### Step 1: Replace Mock APIs in `ownerService.ts`

**Current:**
```typescript
export async function createPGOwner(data: CreatePGOwnerRequest) {
  // TODO: Replace with actual API call
  // Mock implementation
  return { success: true, owner: mockOwner };
}
```

**Replace with:**
```typescript
export async function createPGOwner(data: CreatePGOwnerRequest) {
  const response = await fetch(`${API_BASE}/owners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
}
```

### Step 2: Set Up Backend

**MongoDB Example:**
```javascript
// Node.js + Express + MongoDB
const express = require('express');
const mongoose = require('mongoose');

// Define schemas based on types in owner.types.ts
const PGOwnerSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  phone: String,
  accountStatus: String,
  totalPGs: Number,
  verifiedPGs: Number,
  createdAt: Date,
  updatedAt: Date
});

const PGListingSchema = new mongoose.Schema({
  id: String,
  ownerId: String,
  name: String,
  address: Object,
  coordinates: Object,
  verificationStatus: String,
  verified: Boolean,
  isPublished: Boolean,
  // ... other fields from owner.types.ts
});

// API endpoints
app.post('/api/v1/owners', async (req, res) => {
  const owner = new PGOwner(req.body);
  await owner.save();
  res.json({ success: true, owner });
});

app.post('/api/v1/listings', async (req, res) => {
  const listing = new PGListing(req.body);
  await listing.save();
  res.json({ success: true, listing });
});

// CRITICAL: Student queries must filter by verified
app.get('/api/v1/listings/verified', async (req, res) => {
  const listings = await PGListing.find({
    verified: true,
    isPublished: true
  });
  res.json(listings);
});
```

### Step 3: File Uploads (S3, Cloudinary, etc.)

```typescript
// Example with AWS S3
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

export async function uploadToS3(file: File, folder: string) {
  const params = {
    Bucket: 'your-bucket-name',
    Key: `${folder}/${Date.now()}-${file.name}`,
    Body: file,
    ACL: 'public-read'
  };
  
  const result = await s3.upload(params).promise();
  return result.Location; // URL
}

// Use in ownerService.ts
export async function uploadVerificationProofs(data: UploadProofsRequest) {
  // Upload to S3
  const docUrl = await uploadToS3(data.ownershipDocument, 'documents');
  const photoUrls = await Promise.all(
    data.roomPhotos.map(photo => uploadToS3(photo, 'photos'))
  );
  const videoUrl = await uploadToS3(data.videoWalkthrough, 'videos');
  
  // Save URLs to database
  const proofs = {
    pgListingId: data.pgListingId,
    ownershipDocument: { fileUrl: docUrl, ... },
    roomPhotos: photoUrls.map(url => ({ url, ... })),
    videoWalkthrough: { url: videoUrl, ... }
  };
  
  // POST to API
  return await fetch('/api/v1/proofs', { ... });
}
```

---

## 📊 Key Features Implemented

### ✅ Verification System
- Mandatory document/photo/video uploads
- Admin review workflow
- Status tracking (pending → verified → published)
- Only verified PGs shown to students

### ✅ Dual Dashboard
- Student mode: Search PGs, save favorites, matches
- Owner mode: Manage properties, view stats, handle requests
- Easy toggle between modes
- Same URL (`/dashboard`)

### ✅ Smart Interactions
- Distance calculation between student and PG
- Automatic recommendation (video call vs visit)
- Scheduling with date/time picker
- Message exchange

### ✅ Security Measures
- Verified badge on all listings
- Document verification required
- Admin approval before publishing
- Audit trail of all changes

---

## 🎨 UI Components Available

### Main Dashboard
```typescript
import EnhancedDashboardPage from './pages/EnhancedDashboardPage';

<EnhancedDashboardPage 
  userId="user-123"
  userName="Priya"
  userType="both"  // or "student" or "owner"
  ownerProfile={ownerData}
/>
```

### Owner Interaction
```typescript
import OwnerInteraction from './components/OwnerInteraction';

<OwnerInteraction 
  pgId="pg-123"
  ownerId="owner-456"
  studentId="student-789"
  pgCoordinates={{ lat: 12.9716, lng: 77.5946 }}
  studentLocation={{ city: "Bangalore", coordinates: {...} }}
/>
```

### Verification Badge
```typescript
import { VerificationStatusBadge } from './pages/pg-owner';

<VerificationStatusBadge status="verified" />
```

---

## 📝 Critical Implementation Rules

### 1. **Student Queries MUST Filter by Verified**
```typescript
// ✅ CORRECT
const pgs = await PGListing.find({ 
  verified: true, 
  isPublished: true 
});

// ❌ WRONG - Would show unverified PGs
const pgs = await PGListing.find({});
```

### 2. **Proof Upload Must Be Complete**
```typescript
// All three required:
✓ Ownership document (1 file)
✓ Room photos (min 5 files)
✓ Video walkthrough (1 file, 30-90 sec)
```

### 3. **Admin Review Before Publishing**
```typescript
// New PG flow:
1. Owner creates listing → status: 'pending_verification'
2. Owner uploads proofs → status: 'pending_verification'
3. Admin reviews → status: 'verified' or 'rejected'
4. If verified → isPublished: true (now visible to students)
```

---

## 📁 File Reference

### Types
- `src/types/owner.types.ts` - All TypeScript interfaces

### Services
- `src/services/ownerService.ts` - API service layer

### Pages
- `src/pages/EnhancedDashboardPage.tsx` - Main integrated dashboard
- `src/pages/pg-owner/pages/PGOwnerSignupPage.tsx` - Owner signup
- `src/pages/pg-owner/pages/PGOwnerDashboard.tsx` - Owner-only view

### Components
- `src/components/OwnerInteraction.tsx` - Video call/visit requests
- `src/pages/pg-owner/components/PGProofUpload.tsx` - File uploads
- `src/pages/pg-owner/components/VerificationStatusBadge.tsx` - Status badge
- `src/pages/pg-owner/components/AdminVerificationPanel.tsx` - Admin UI

### Documentation
- `PG_OWNER_SYSTEM_GUIDE.md` - Complete system documentation

---

## 🐛 Troubleshooting

### Issue: Can't see owner dashboard
**Solution:** Go to `/dashboard` and toggle to "PG Owner Dashboard" mode

### Issue: Import errors
**Solution:** All imports fixed. Clear cache: `npm run dev`

### Issue: Types not found
**Solution:** Import from `src/types/owner.types.ts`

### Issue: Mock data showing
**Solution:** Expected! Replace mock implementations in `ownerService.ts` with real API calls

---

## ✅ Testing Checklist

- [ ] Visit http://localhost:3002/dashboard
- [ ] Toggle between Student/Owner modes
- [ ] Click "Become a PG Owner" CTA
- [ ] Try owner signup flow at /owner/signup
- [ ] Upload sample files (document, photos, video)
- [ ] Check verification status badges
- [ ] Test distance-based interaction (mock locations)

---

## 🎯 Production Deployment

### Before Launch:
1. ✅ Replace all mocks with real APIs
2. ✅ Set up file storage (S3/Cloudinary)
3. ✅ Implement authentication
4. ✅ Create admin panel
5. ✅ Add email/SMS notifications
6. ✅ Security audit
7. ✅ Load testing
8. ✅ Legal review

### Database Indexes:
```javascript
db.pg_listings.createIndex({ verified: 1, isPublished: 1 });
db.pg_listings.createIndex({ city: 1, verificationStatus: 1 });
db.pg_listings.createIndex({ coordinates: '2dsphere' });
```

---

**System is ready! Just connect to your database and replace mock APIs.** 🚀
