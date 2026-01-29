# PG OWNER VERIFICATION SYSTEM 🏠✅

A comprehensive PG (Paying Guest) verification system integrated into the main dashboard. This system ensures only verified, legitimate PG properties are shown to students.

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Database Architecture](#database-architecture)
3. [Key Features](#key-features)
4. [Type Definitions](#type-definitions)
5. [API Integration Guide](#api-integration-guide)
6. [Verification Flow](#verification-flow)
7. [Security & Anti-Fraud](#security--anti-fraud)
8. [Usage Examples](#usage-examples)

---

## 🎯 SYSTEM OVERVIEW

### The Problem
- Fake PG listings harm students
- No verification of ownership
- Poor quality photos/videos
- Misleading information

### The Solution
**Mandatory Verification System** where PG owners must provide:
1. ✅ Ownership document (bill/agreement/deed)
2. ✅ Minimum 5 high-quality room photos
3. ✅ 30-90 second video walkthrough
4. ✅ Admin approval before going live

**Result**: Only verified PGs appear in student searches, maps, and discovery.

---

## 🗄️ DATABASE ARCHITECTURE

### Collections/Tables

#### 1. `pg_owners`
Owner account management
```typescript
{
  _id: ObjectId,
  id: "uuid",
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91-9876543210",
  accountStatus: "active" | "suspended" | "pending",
  kycStatus: "verified" | "pending" | "rejected",
  totalPGs: 3,
  verifiedPGs: 1,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. `pg_listings`
Individual property listings
```typescript
{
  _id: ObjectId,
  id: "uuid",
  ownerId: "owner-uuid",
  name: "Green Valley PG",
  address: { street, area, city, state, pincode },
  coordinates: { lat, lng },
  genderType: "male" | "female" | "unisex",
  totalBeds: 20,
  availableBeds: 5,
  rentRange: { min: 8000, max: 12000 },
  amenities: ["WiFi", "AC", "Laundry"],
  verificationStatus: "pending_verification" | "verified" | "rejected",
  verified: true,  // Quick query field
  isPublished: true,  // Only verified PGs are published
  views: 127,
  contactRequests: 15,
  createdAt: Date,
  verifiedAt: Date
}
```

#### 3. `verification_proofs`
Uploaded verification documents
```typescript
{
  _id: ObjectId,
  id: "uuid",
  pgListingId: "pg-uuid",
  ownerId: "owner-uuid",
  ownershipDocument: {
    type: "electricity_bill",
    fileUrl: "https://s3.../doc.pdf",
    status: "approved",
    uploadedAt: Date,
    verifiedAt: Date
  },
  roomPhotos: [
    {
      id: "photo-1",
      url: "https://s3.../room1.jpg",
      category: "room",
      status: "approved",
      uploadedAt: Date
    }
  ],
  videoWalkthrough: {
    url: "https://s3.../walkthrough.mp4",
    duration: 60,
    status: "approved",
    uploadedAt: Date
  },
  overallStatus: "verified",
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: "admin-id"
}
```

#### 4. `owner_interactions`
Student-Owner communication
```typescript
{
  _id: ObjectId,
  studentId: "student-uuid",
  ownerId: "owner-uuid",
  pgListingId: "pg-uuid",
  type: "video_call_request" | "physical_visit_request",
  status: "pending" | "accepted" | "completed",
  scheduledDate: Date,
  scheduledTime: "10:00 AM",
  studentLocation: { city, coordinates },
  distance: 15.3,  // km
  message: "I'd like to visit on Saturday",
  ownerResponse: "Sure, see you then!",
  createdAt: Date,
  completedAt: Date
}
```

---

## ✨ KEY FEATURES

### 1. Integrated Dashboard
- **Single Dashboard** for both students and PG owners
- **Mode Switcher** - toggle between student/owner views
- **Real-time Stats** - views, bookings, conversion rates
- **Verification Status** - clear badges showing approval status

### 2. Verification Flow
```
Owner Signup
   ↓
Fill PG Details
   ↓
Upload Proofs (mandatory)
   ↓
Submit for Review
   ↓
Admin Reviews
   ↓
Approved/Rejected
   ↓
If Approved → Published to Students
If Rejected → Feedback & Resubmit
```

### 3. Smart Interaction System
- **Distance-based recommendations**
  - Far away? → Suggest video call
  - Nearby (< 10km)? → Suggest physical visit
- **Scheduled meetings** with date/time
- **In-app messaging**
- **Phone integration** (optional)

### 4. Student Safety
- ✅ Only verified PGs shown in search
- ✅ Verified badge on all listings
- ✅ Proof documents viewable by students
- ✅ Admin-reviewed content
- ✅ Rating and review system (post-verification)

---

## 📝 TYPE DEFINITIONS

### Core Types

```typescript
// Owner Profile
interface PGOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  kycStatus: 'verified' | 'pending' | 'rejected';
  totalPGs: number;
  verifiedPGs: number;
}

// PG Listing
interface PGListing {
  id: string;
  ownerId: string;
  name: string;
  address: PGAddress;
  verificationStatus: VerificationStatus;
  verified: boolean;
  isPublished: boolean;
  views: number;
  contactRequests: number;
}

// Verification Status
type VerificationStatus = 
  | 'pending_verification'
  | 'under_review'
  | 'verified'
  | 'rejected'
  | 'resubmission_required';
```

All types are in:
- `src/types/owner.types.ts` - Complete type system

---

## 🔌 API INTEGRATION GUIDE

### Setup Your API

All API calls are centralized in `src/services/ownerService.ts`

**Current state**: Mock implementations  
**Your task**: Replace with actual API calls

### Example: Create PG Owner

```typescript
// In ownerService.ts
export async function createPGOwner(data: CreatePGOwnerRequest) {
  // TODO: Replace this mock with actual API call
  /*
  const response = await fetch(`${API_BASE}/owners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
  */
  
  // Current mock implementation
  return { success: true, owner: mockOwner };
}
```

### API Endpoints to Implement

#### Owner Management
```
POST   /api/v1/owners              - Create owner
GET    /api/v1/owners/:id          - Get owner details
PATCH  /api/v1/owners/:id          - Update owner
```

#### Listing Management
```
POST   /api/v1/listings            - Create PG listing
GET    /api/v1/listings            - Get all listings (filter by owner)
GET    /api/v1/listings/:id        - Get single listing
PATCH  /api/v1/listings/:id        - Update listing
DELETE /api/v1/listings/:id        - Delete listing
```

#### Verification Proofs
```
POST   /api/v1/proofs              - Upload verification proofs
GET    /api/v1/proofs/:pgId        - Get proofs for a PG
POST   /api/v1/proofs/review       - Admin review proofs
```

#### Interactions
```
POST   /api/v1/interactions        - Create interaction request
GET    /api/v1/interactions        - Get interactions (filter by owner/student)
PATCH  /api/v1/interactions/:id    - Update interaction status
```

#### Student Queries (IMPORTANT)
```
GET    /api/v1/listings/verified   - Get ONLY verified PGs
                                     MUST filter: verified=true, isPublished=true
```

---

## 🔄 VERIFICATION FLOW

### Step 1: Owner Signup
```typescript
// Component: PGOwnerSignupPage
// Route: /owner/signup

// Collect:
- Owner name, email, phone
- PG name, address, coordinates
- Room types, rent, amenities
```

### Step 2: Proof Upload
```typescript
// Component: PGProofUpload
// Mandatory uploads:
- 1 ownership document (PDF/Image, < 5MB)
- 5+ room photos (Images, < 5MB each)
- 1 video walkthrough (MP4, 30-90 sec, < 100MB)

// Validation in: ownerService.validateProofs()
```

### Step 3: Admin Review
```typescript
// Admin checks:
✓ Document authenticity
✓ Photo quality and accuracy
✓ Video shows actual property
✓ Address verification
✓ No duplicate listings

// Actions:
- Approve → status='verified', isPublished=true
- Reject → status='rejected', provide reason
- Request resubmission → status='resubmission_required'
```

### Step 4: Publication
```typescript
// Once verified=true:
✓ Appears in student searches
✓ Shows on map
✓ Visible in filters
✓ Displays "Verified" badge
✓ Proofs viewable by students
```

---

## 🔐 SECURITY & ANTI-FRAUD

### Measures Implemented

1. **Mandatory Verification**
   - No PG goes live without admin approval
   - Triple check: Document + Photos + Video

2. **Ownership Proof**
   - Must upload official document
   - Cross-verify address with document
   - Check document date (not too old)

3. **Photo Verification**
   - Minimum 5 photos required
   - Must cover all areas
   - Check for watermarks (reject stock photos)
   - Verify location matches

4. **Video Verification**
   - Live walkthrough required
   - Check video duration (30-90 sec)
   - Continuous shot (no cuts)
   - Shows owner or person on premise

5. **Admin Review**
   - Human verification before approval
   - Audit trail of all actions
   - Rejection reasons documented

6. **Post-Verification**
   - Student reviews and ratings
   - Report fake listing option
   - Periodic re-verification
   - Suspension for violations

### Red Flags to Check
- ❌ Stock photos
- ❌ Photos from different properties
- ❌ Old/expired documents
- ❌ Edited/photoshopped images
- ❌ Video with cuts or transitions
- ❌ Document address ≠ listed address
- ❌ Same owner with many properties in short time

---

## 💻 USAGE EXAMPLES

### For Students

#### Viewing Verified PGs
```typescript
// All student-facing queries MUST filter by verified
import { getVerifiedPGListings } from '../services/ownerService';

const verifiedPGs = await getVerifiedPGListings({
  city: 'Bangalore',
  genderType: 'male',
  rentMax: 12000,
  amenities: ['WiFi', 'AC']
});

// All PGs returned are verified=true and isPublished=true
```

#### Requesting Video Call or Visit
```typescript
import OwnerInteraction from '../components/OwnerInteraction';

<OwnerInteraction
  pgId="pg-123"
  pgName="Green Valley PG"
  pgCoordinates={{ lat: 12.9716, lng: 77.5946 }}
  pgCity="Bangalore"
  ownerId="owner-456"
  ownerName="Rajesh Kumar"
  studentId="student-789"
  studentLocation={{ 
    city: 'Bangalore',
    coordinates: { lat: 12.9352, lng: 77.6245 }
  }}
  onInteractionCreated={(interaction) => {
    console.log('Request sent:', interaction);
  }}
/>
```

### For PG Owners

#### Dashboard View
```typescript
import EnhancedDashboardPage from '../pages/EnhancedDashboardPage';

<EnhancedDashboardPage
  userId="owner-123"
  userName="Rajesh Kumar"
  userType="owner"
  ownerProfile={ownerProfile}
/>
```

#### Creating New PG
```typescript
import { createPGOwner, createPGListing, uploadVerificationProofs } from '../services/ownerService';

// Step 1: Create owner
const ownerResult = await createPGOwner({
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  phone: '+91-9876543210'
});

// Step 2: Create listing
const listingResult = await createPGListing({
  ownerId: ownerResult.owner.id,
  pgDetails: {
    name: 'Green Valley PG',
    address: { /* ... */ },
    roomTypes: [ /* ... */ ],
    // ... other details
  }
});

// Step 3: Upload proofs
const proofsResult = await uploadVerificationProofs({
  pgListingId: listingResult.listing.id,
  ownerId: ownerResult.owner.id,
  ownershipDocument: documentFile,
  roomPhotos: [photo1, photo2, photo3, photo4, photo5],
  videoWalkthrough: videoFile
});

// Now wait for admin verification
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Going Live

- [ ] Implement actual API endpoints (replace mocks in `ownerService.ts`)
- [ ] Set up file storage (AWS S3, Cloudinary, etc.)
- [ ] Configure video processing/compression
- [ ] Set up admin panel for verification
- [ ] Implement authentication system
- [ ] Add email notifications
- [ ] Add SMS notifications
- [ ] Set up monitoring and logging
- [ ] Test verification flow end-to-end
- [ ] Load test with sample data
- [ ] Security audit
- [ ] Legal review of terms & conditions

### Database Indexes (for performance)

```javascript
// MongoDB indexes
db.pg_listings.createIndex({ verified: 1, isPublished: 1 });
db.pg_listings.createIndex({ city: 1, verificationStatus: 1 });
db.pg_listings.createIndex({ ownerId: 1 });
db.pg_listings.createIndex({ coordinates: '2dsphere' });
db.verification_proofs.createIndex({ pgListingId: 1 });
db.owner_interactions.createIndex({ ownerId: 1, status: 1 });
```

---

## 📂 FILE STRUCTURE

```
src/
├── types/
│   └── owner.types.ts              # Complete type system
├── services/
│   └── ownerService.ts             # API service layer
├── components/
│   └── OwnerInteraction.tsx        # Video call/visit component
├── pages/
│   ├── EnhancedDashboardPage.tsx   # Main dashboard (student + owner)
│   └── pg-owner/
│       ├── pages/
│       │   ├── PGOwnerSignupPage.tsx
│       │   └── PGOwnerDashboard.tsx
│       ├── components/
│       │   ├── PGProofUpload.tsx
│       │   ├── VerificationStatusBadge.tsx
│       │   └── AdminVerificationPanel.tsx
│       └── types/
│           └── index.ts
```

---

## 🎨 UI COMPONENTS

### Verification Status Badge
```typescript
<VerificationStatusBadge status="verified" />
// Shows: ✅ Verified (green badge)

<VerificationStatusBadge status="pending_verification" />
// Shows: ⏳ Pending Verification (yellow badge)

<VerificationStatusBadge status="rejected" />
// Shows: ❌ Rejected (red badge)
```

### Owner Interaction
```typescript
<OwnerInteraction
  // Automatically shows appropriate option:
  // - Video call if student is far
  // - Physical visit if student is nearby (< 10km)
  // - Always shows contact option
/>
```

---

## 📞 SUPPORT

For questions or issues:
1. Check this README first
2. Review type definitions in `owner.types.ts`
3. Check service implementations in `ownerService.ts`
4. Review examples in this document

---

## 🔄 FUTURE ENHANCEMENTS

- [ ] Automated photo quality check (AI)
- [ ] Automated document verification (OCR + AI)
- [ ] Real-time chat between student and owner
- [ ] Virtual tours (360° photos)
- [ ] Booking and payment integration
- [ ] Review and rating system
- [ ] Owner reputation score
- [ ] Seasonal pricing
- [ ] Early bird discounts
- [ ] Referral system

---

**Built with ❤️ for student safety and trust**
