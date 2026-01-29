# PG Owner Verification System - Complete Guide

## 🎯 System Overview

The PG Owner Verification System ensures only legitimate, verified PG listings appear on the student platform, building trust and preventing fraud.

---

## 📋 Type Definitions (types/index.ts)

```typescript
// Verification status enum
export type VerificationStatus = 
  | 'pending_verification'  // Just submitted, awaiting review
  | 'verified'              // Approved and visible to students
  | 'rejected'              // Rejected due to fake/incomplete docs
  | 'resubmission_required'; // Needs corrections

// Enhanced PG Listing with verification
export interface PGListingWithVerification extends PGListing {
  ownerId: string;
  verificationStatus: VerificationStatus;
  ownershipProof?: PGOwnershipProof;
  lastVerifiedAt?: Date;
}
```

---

## 🔐 Verification Logic

### 1. **New PG Submission Flow**

```typescript
// When owner submits PG through PGOwnerSignupPage
const newPG = {
  ...pgDetails,
  verificationStatus: 'pending_verification', // ← CRITICAL
  verified: false,
  ownerId: ownerProfile.id
};

// Save to database
await savePGListing(newPG);
```

### 2. **Filtering for Students**

Only show verified PGs on:
- Dashboard
- Map
- Search results
- Filters

```typescript
// In mockData.ts
export function getVerifiedPGs(): PG[] {
  return pgs.filter(
    (pg) => pg.verificationStatus === 'verified' || 
            (pg.verified && !pg.verificationStatus) // Legacy support
  );
}

// Usage in DashboardPage, Map, etc.
const displayPGs = getVerifiedPGs();
```

### 3. **Owner Dashboard View**

Owners can see ALL their PGs (including pending):

```typescript
export function getPGsByOwner(ownerId: string): PG[] {
  return pgs.filter((pg) => pg.ownerId === ownerId);
}
```

---

## 🛡️ Best Practices to Prevent Fake PGs

### 1. **Mandatory Proof Requirements**

```typescript
interface PGOwnershipProof {
  // REQUIRED: Ownership document
  ownershipDocument: {
    type: 'electricity-bill' | 'water-bill' | 'property-tax' | 'rental-agreement' | 'ownership-deed';
    fileUrl: string;
    uploadedAt: Date;
  };
  
  // REQUIRED: Minimum 5 photos
  roomPhotos: Array<{
    url: string;
    category: 'room' | 'washroom' | 'kitchen' | 'common-area' | 'entrance' | 'exterior';
  }>;
  
  // REQUIRED: 30-90 sec video walkthrough
  videoWalkthrough: {
    url: string;
    duration: number; // Must be 30-90 seconds
  };
}
```

### 2. **Verification Checklist (For Admin Review)**

```typescript
const verificationChecklist = {
  documents: [
    'Ownership document is clear and readable',
    'Document matches PG address',
    'Document is recent (< 3 months old)',
    'Owner name matches submission'
  ],
  photos: [
    'Minimum 5 photos uploaded',
    'Photos are clear and well-lit',
    'Photos match video walkthrough',
    'No stock/internet photos detected'
  ],
  video: [
    'Duration is 30-90 seconds',
    'Shows all mentioned facilities',
    'Continuous walkthrough (no cuts)',
    'Matches submitted photos and address'
  ],
  address: [
    'Google Maps verification of coordinates',
    'Street view matches property',
    'Area matches city registration'
  ]
};
```

### 3. **Anti-Fraud Measures**

```typescript
// KYC Verification
interface PGOwnerProfile {
  aadharNumber?: string;  // Optional but strengthens trust
  verified: boolean;
  verifiedAt?: Date;
}

// Track submission history
interface OwnerHistory {
  ownerId: string;
  totalSubmissions: number;
  rejectedCount: number;
  lastRejectionReason?: string;
}

// Ban policy
const shouldBanOwner = (history: OwnerHistory): boolean => {
  // Ban if 3+ rejections for fake documents
  return history.rejectedCount >= 3;
};
```

### 4. **Verification Timeline**

```typescript
const VERIFICATION_SLA = {
  REVIEW_TIME: '24-48 hours',
  AUTO_EXPIRE: 7 * 24 * 60 * 60 * 1000, // 7 days
  RE_VERIFICATION: 365 * 24 * 60 * 60 * 1000 // Yearly
};

// Notify owner of status changes
const notifyOwner = (ownerId: string, status: VerificationStatus) => {
  const messages = {
    pending_verification: 'Your PG listing is under review. You will hear from us within 24-48 hours.',
    verified: '✓ Congratulations! Your PG is now live and visible to students.',
    rejected: 'Your submission was rejected. Please check email for details and resubmit.',
    resubmission_required: 'Additional information needed. Please update and resubmit.'
  };
  
  sendEmail(ownerId, messages[status]);
};
```

---

## 🎨 Component Usage Examples

### 1. **PG Owner Signup Page**

```tsx
import { PGOwnerSignupPage } from './pages/PGOwnerSignupPage';

// In your router
<Route path="/pg-owner/signup" element={<PGOwnerSignupPage />} />

// Component handles:
// - Step 1: Owner info + OTP
// - Step 2: PG details
// - Step 3: Proof uploads
// - Auto-submit with status='pending_verification'
```

### 2. **Verification Status Badge**

```tsx
import VerificationStatusBadge from './components/VerificationStatusBadge';

// On PG cards (owner view)
<VerificationStatusBadge 
  status={pg.verificationStatus} 
  size="md" 
  showLabel={true} 
/>

// On student view (only show verified)
{pg.verificationStatus === 'verified' && (
  <VerificationStatusBadge status="verified" size="sm" />
)}
```

### 3. **Owner Interaction (Video Call / Visit)**

```tsx
import { OwnerContactCTA } from './components/OwnerContactCTA';

// In PGDetails.tsx
<OwnerContactCTA
  pgId={pg.id}
  pgName={pg.name}
  pgCoordinates={{ lat: pg.lat, lng: pg.lng }}
  ownerName="Rajesh Kumar"
  userCity={currentUser.city}
  userCoordinates={currentUser.coordinates}
/>

// Logic:
// - If distance < 50km → Show "Schedule Visit" (recommended)
// - If distance > 50km → Show "Request Video Call" (recommended)
// - Both options always available
```

---

## 🚀 Data Flow Example

### Scenario: Owner Submits New PG

```typescript
// Step 1: Owner fills form
const ownerData = {
  ownerInfo: { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210' },
  pgDetails: { name: 'Sunshine PG', city: 'Pune', totalBeds: 20, rent: 8000 },
  proofs: { photos: [file1, file2, ...], video: videoFile, document: docFile }
};

// Step 2: System creates PG listing
const newPG = {
  id: generateId(),
  ...ownerData.pgDetails,
  ownerId: ownerData.ownerInfo.id,
  verificationStatus: 'pending_verification', // ← Hidden from students
  verified: false,
  createdAt: new Date()
};

// Step 3: Student searches for PGs
const studentSearchResults = getVerifiedPGs(); // ← Does NOT include newPG

// Step 4: Admin reviews
// ✓ Approved → verificationStatus = 'verified', verified = true
// ✗ Rejected → verificationStatus = 'rejected', send email with reason

// Step 5: Once verified
const studentSearchResults = getVerifiedPGs(); // ← NOW includes newPG
```

---

## 📊 Dashboard Integration

### Student Dashboard

```typescript
// Only show verified PGs
const displayPGs = getVerifiedPGs().filter(pg => 
  pg.city === user.city && 
  pg.rent >= user.budgetMin && 
  pg.rent <= user.budgetMax
);
```

### Owner Dashboard

```typescript
// Show all PGs with status
const ownerPGs = getPGsByOwner(ownerId);

ownerPGs.forEach(pg => {
  console.log(`${pg.name} - Status: ${pg.verificationStatus}`);
  // "Sunshine PG - Status: pending_verification"
  // "Happy Homes - Status: verified"
});
```

---

## 🔄 Re-verification Policy

```typescript
// Yearly re-verification for trust maintenance
const shouldReVerify = (pg: PGListingWithVerification): boolean => {
  if (!pg.lastVerifiedAt) return false;
  
  const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
  return pg.lastVerifiedAt.getTime() < oneYearAgo;
};

// Trigger re-verification
if (shouldReVerify(pg)) {
  pg.verificationStatus = 'resubmission_required';
  notifyOwner(pg.ownerId, 'resubmission_required');
}
```

---

## ⚠️ Important Notes

1. **NEVER show unverified PGs to students** - This is the core security principle
2. **OTP verification for owner signup** - Prevents spam submissions
3. **Store original filenames** - Helps detect duplicate/fake submissions
4. **Rate limit submissions** - Max 3 PG submissions per owner per month
5. **Track rejection reasons** - Ban after 3 strikes for fake documents
6. **Geo-verify coordinates** - Compare with Google Maps API
7. **Video authenticity** - Check for continuous recording, no edits

---

## 🎬 Quick Start

```bash
# 1. Add route to App.tsx
import PGOwnerSignupPage from './pages/PGOwnerSignupPage';

<Route path="/become-owner" element={<PGOwnerSignupPage />} />

# 2. Update dashboard to use getVerifiedPGs()
const pgs = getVerifiedPGs();

# 3. Add verification badge to PG cards
<VerificationStatusBadge status={pg.verificationStatus} />

# 4. Done! System is live.
```

---

## 📞 Support

For questions about the verification system:
- Check `src/types/index.ts` for all type definitions
- Review `src/components/PGProofUpload.tsx` for upload logic
- See `src/data/mockData.ts` for filter functions

**Security First. Trust Always.**
