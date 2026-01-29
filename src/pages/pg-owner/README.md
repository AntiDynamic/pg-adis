# PG Owner Module - Complete Guide

## 📁 Folder Structure

```
src/pages/pg-owner/
├── components/           # Owner-specific components
│   ├── PGProofUpload.tsx            # Upload ownership docs, photos, video
│   ├── VerificationStatusBadge.tsx  # Status badge display
│   └── OwnerContactCTA.tsx          # Student-owner contact interface
├── pages/               # Owner-facing pages
│   ├── PGOwnerSignupPage.tsx        # 3-step PG registration wizard
│   └── PGOwnerDashboard.tsx         # Owner dashboard with all PG listings
├── types/               # Type definitions
│   └── index.ts                     # All PG owner related types
├── utils/               # Utility functions
│   └── ownerHelpers.ts              # Helper functions for owner operations
└── README.md            # This file
```

---

## 🎯 Features

### ✅ Owner Signup & Verification
- **3-Step Registration Process:**
  1. Owner information + OTP verification
  2. PG details (name, address, pricing, amenities)
  3. Proof uploads (ownership doc, 5+ photos, video)
- Mandatory proof verification before listing goes live
- Status tracking: `pending_verification` → `verified` / `rejected`

### ✅ Owner Dashboard
- View all PG listings with verification status
- Statistics: Total listings, verified count, occupancy rate
- Filter by status: All, Verified, Pending, Rejected
- Edit/Update listings
- View contact requests from students

### ✅ Verification System
- Only verified PGs visible to students
- Admin review process (24-48 hours)
- Rejection reasons with resubmission option
- Yearly re-verification policy

### ✅ Student-Owner Interaction
- Distance-based contact options:
  - **Video Call** - Available for all students
  - **Physical Visit** - Only within 50km radius
- Trust indicators and safety tips

---

## 🚀 Quick Start

### 1. Import Pages in Your Router

```tsx
// App.tsx or main.tsx
import PGOwnerSignupPage from './pages/pg-owner/pages/PGOwnerSignupPage';
import PGOwnerDashboard from './pages/pg-owner/pages/PGOwnerDashboard';

<Routes>
  {/* Owner Registration */}
  <Route path="/become-owner" element={<PGOwnerSignupPage />} />
  
  {/* Owner Dashboard */}
  <Route path="/owner/dashboard" element={
    <PGOwnerDashboard 
      ownerId="owner-123" 
      ownerName="Rajesh Kumar"
      ownerEmail="rajesh@example.com"
    />
  } />
</Routes>
```

### 2. Use Utility Functions

```tsx
import { 
  getVerifiedPGs, 
  getPGsByOwner,
  calculateOwnerStats 
} from './pages/pg-owner/utils/ownerHelpers';

// Student view - Only show verified PGs
const studentPGs = getVerifiedPGs(allPGs);

// Owner view - Show all their PGs
const ownerPGs = getPGsByOwner(ownerId, allPGs);

// Get dashboard stats
const stats = calculateOwnerStats(ownerId, allPGs);
```

### 3. Add Verification Badge to PG Cards

```tsx
import VerificationStatusBadge from './pages/pg-owner/components/VerificationStatusBadge';

<VerificationStatusBadge 
  status={pg.verificationStatus} 
  size="md" 
  showLabel={true} 
/>
```

---

## 📋 Component API

### PGOwnerSignupPage

```tsx
import PGOwnerSignupPage from './pages/pg-owner/pages/PGOwnerSignupPage';

<PGOwnerSignupPage />
```

**Features:**
- 3-step wizard with validation
- Auto-saves to backend on completion
- Sets status to `pending_verification`

### PGOwnerDashboard

```tsx
import PGOwnerDashboard from './pages/pg-owner/pages/PGOwnerDashboard';

<PGOwnerDashboard 
  ownerId="owner-123"
  ownerName="Rajesh Kumar"
  ownerEmail="rajesh@example.com"
/>
```

**Props:**
- `ownerId: string` - Unique owner identifier
- `ownerName: string` - Owner's display name
- `ownerEmail: string` - Owner's email address

### PGProofUpload

```tsx
import PGProofUpload from './pages/pg-owner/components/PGProofUpload';

<PGProofUpload 
  onComplete={(proofs) => {
    console.log('Proofs:', proofs);
    // Save to backend
  }}
  onBack={() => {
    // Go to previous step
  }}
/>
```

**Props:**
- `onComplete: (proofs) => void` - Callback when all proofs uploaded
- `onBack: () => void` - Callback for back navigation

### VerificationStatusBadge

```tsx
import VerificationStatusBadge from './pages/pg-owner/components/VerificationStatusBadge';

<VerificationStatusBadge 
  status="verified" 
  size="md" 
  showLabel={true} 
/>
```

**Props:**
- `status: VerificationStatus` - Current verification status
- `size?: 'sm' | 'md' | 'lg'` - Badge size (default: 'md')
- `showLabel?: boolean` - Show text label (default: true)

### OwnerContactCTA

```tsx
import { OwnerContactCTA } from './pages/pg-owner/components/OwnerContactCTA';

<OwnerContactCTA 
  pgId="pg-123"
  pgName="Sunshine PG"
  pgCoordinates={{ lat: 18.5466, lng: 73.8250 }}
  pgCity="Pune"
  ownerName="Rajesh Kumar"
  userCity="Mumbai"
  userCoordinates={{ lat: 19.0760, lng: 72.8777 }}
/>
```

---

## 🔐 Verification Flow

```
┌─────────────────────────────────────┐
│   Owner Submits PG (Step 3)        │
│   status = 'pending_verification'   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Admin Reviews (24-48 hours)       │
│   - Check documents                 │
│   - Verify photos/video             │
│   - Geo-verify address              │
└────────┬───────────────────┬────────┘
         │                   │
    APPROVED              REJECTED
         │                   │
         ▼                   ▼
┌────────────────┐   ┌──────────────────┐
│ status =       │   │ status =         │
│ 'verified'     │   │ 'rejected'       │
│                │   │ rejectionReason  │
│ Visible to     │   │                  │
│ students ✓     │   │ Email sent to    │
└────────────────┘   │ owner            │
                     └──────────────────┘
```

---

## 📊 Data Flow

### Student Search

```tsx
// ❌ OLD - Shows all PGs
const pgs = allPGs.filter(pg => pg.city === userCity);

// ✅ NEW - Shows only verified PGs
const pgs = getVerifiedPGs(allPGs).filter(pg => pg.city === userCity);
```

### Owner Dashboard

```tsx
// Owner sees ALL their PGs (including pending/rejected)
const ownerPGs = getPGsByOwner(ownerId, allPGs);

// Filter by status
const pendingPGs = getPGsByStatus(ownerId, 'pending_verification', allPGs);
const verifiedPGs = getPGsByStatus(ownerId, 'verified', allPGs);
```

---

## 🛡️ Security & Validation

### Proof Requirements

| Document | Requirements | Validation |
|----------|-------------|-----------|
| **Ownership Doc** | 1 file, PDF/JPG/PNG, < 5MB | Check type, size, readability |
| **Room Photos** | 5-10 photos, JPG/PNG | Min 5, verify no stock photos |
| **Video** | 1 video, 30-90 sec, < 100MB | Check duration, continuity |

### Anti-Fraud Measures

1. ✅ Mandatory document verification
2. ✅ Photos must match video walkthrough
3. ✅ Geo-verification of address
4. ✅ No duplicate submissions (file hash check)
5. ✅ Yearly re-verification policy
6. ✅ 3-strike ban for fake documents
7. ✅ Rate limit: Max 3 submissions/month

---

## 🎨 Styling & Theming

All components use Tailwind CSS with custom theme colors:

```css
/* tailwind.config.js */
colors: {
  trust: {
    50: '#f0f9ff',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7'
  },
  surface: {
    DEFAULT: '#0f0f23',
    elevated: '#1a1a2e'
  }
}
```

---

## 🔗 Integration Examples

### Add "List Your PG" CTA to Landing Page

```tsx
import { Button } from './components/ui/Button';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* ...existing content... */}
      
      <section className="py-16 bg-trust-500/5">
        <h2 className="text-3xl font-bold text-center mb-4">
          Are You a PG Owner?
        </h2>
        <p className="text-center text-gray-400 mb-6">
          List your property and reach thousands of students
        </p>
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/become-owner')}
          >
            Register Your PG →
          </Button>
        </div>
      </section>
    </div>
  );
}
```

### Filter Map Markers (Only Verified)

```tsx
import { getVerifiedPGs } from './pages/pg-owner/utils/ownerHelpers';

function PGMap() {
  const verifiedPGs = getVerifiedPGs(allPGs);
  
  return (
    <MapContainer>
      {verifiedPGs.map(pg => (
        <Marker 
          key={pg.id} 
          position={[pg.coordinates.lat, pg.coordinates.lng]}
        />
      ))}
    </MapContainer>
  );
}
```

---

## 📞 Backend Integration

### Submit PG Listing

```typescript
// POST /api/owner/submit-pg
router.post('/submit-pg', 
  upload.fields([
    { name: 'ownershipDoc', maxCount: 1 },
    { name: 'roomPhotos', maxCount: 10 },
    { name: 'videoWalkthrough', maxCount: 1 }
  ]),
  async (req, res) => {
    const { ownerInfo, pgDetails } = req.body;
    const files = req.files;
    
    const newPG = await PG.create({
      ...pgDetails,
      ownerId: ownerInfo.id,
      verificationStatus: 'pending_verification',
      verified: false,
      ownershipProof: {
        ownershipDocument: files.ownershipDoc[0],
        roomPhotos: files.roomPhotos,
        videoWalkthrough: files.videoWalkthrough[0]
      }
    });
    
    await sendEmail(ownerInfo.email, 
      'PG Submission Received', 
      'Your listing is under review. We will notify you within 24-48 hours.'
    );
    
    res.json({ success: true, pgId: newPG.id });
  }
);
```

### Admin Verification

```typescript
// POST /api/admin/verify-pg
router.post('/admin/verify-pg', requireAdmin, async (req, res) => {
  const { pgId, status, rejectionReason } = req.body;
  
  await PG.update(pgId, {
    verificationStatus: status,
    verified: status === 'verified',
    lastVerifiedAt: status === 'verified' ? new Date() : null,
    rejectionReason
  });
  
  const pg = await PG.findById(pgId);
  const owner = await Owner.findById(pg.ownerId);
  
  await sendEmail(owner.email, 
    status === 'verified' ? 'PG Verified!' : 'PG Verification Update',
    status === 'verified' 
      ? 'Your PG is now live and visible to students.'
      : `Rejection reason: ${rejectionReason}`
  );
  
  res.json({ success: true });
});
```

---

## 🧪 Testing

### Test Owner Signup Flow

```bash
# 1. Navigate to owner signup
http://localhost:3000/become-owner

# 2. Fill Step 1: Owner Info
Name: Rajesh Kumar
Email: rajesh@example.com
Phone: 9876543210

# 3. Fill Step 2: PG Details
Name: Sunshine PG
City: Pune
Beds: 20
Rent: 8000

# 4. Upload Proofs
- Ownership doc (PDF/JPG)
- 5+ photos
- Video walkthrough

# 5. Submit
Status should be: "Pending Verification"
```

### Test Owner Dashboard

```bash
# View dashboard
http://localhost:3000/owner/dashboard

# Should show:
- Total listings count
- Verified/Pending/Rejected counts
- Individual PG cards with status badges
- Filter tabs working
```

---

## 💡 Best Practices

1. **Always use `getVerifiedPGs()`** for student-facing pages
2. **Show verification badge** on all PG cards
3. **Keep owner dashboard separate** - owners see all statuses
4. **Send email notifications** on every status change
5. **Rate limit submissions** to prevent spam (3/month)
6. **Geo-verify coordinates** with Google Maps API
7. **Re-verify annually** to maintain trust
8. **Store file hashes** to detect duplicate/fake documents
9. **Implement admin panel** for manual verification
10. **Ban policy**: 3 strikes for fake documents

---

## 🐛 Troubleshooting

### Issue: PG not appearing in student search

**Solution:** Check verification status
```tsx
console.log(pg.verificationStatus); // Should be 'verified'
console.log(pg.verified); // Should be true
```

### Issue: Dashboard not showing statistics

**Solution:** Ensure ownerId is correct
```tsx
const stats = calculateOwnerStats(ownerId, allPGs);
console.log(stats); // Check if pgs are being filtered correctly
```

### Issue: File upload failing

**Solution:** Check file size and type validation
```tsx
const errors = validateAllProofs({
  ownershipDoc: file1,
  roomPhotos: [file2, file3, ...],
  videoWalkthrough: file4
});
console.log(errors); // Will show which validations failed
```

---

## 📚 Type Reference

See [types/index.ts](./types/index.ts) for complete type definitions:

- `VerificationStatus` - Verification status enum
- `PGOwnerProfile` - Owner profile interface
- `PGOwnershipProof` - Proof documents interface
- `PGListingWithVerification` - Enhanced PG listing
- `PGOwnerSignupData` - Signup form data
- `OwnerDashboardStats` - Dashboard statistics
- `OwnerContactRequest` - Contact request interface

---

## 🔄 Migration Guide

### From Old System to PG Owner Module

```tsx
// OLD
import PGOwnerSignupPage from './pages/PGOwnerSignupPage';
import VerificationStatusBadge from './components/VerificationStatusBadge';

// NEW
import PGOwnerSignupPage from './pages/pg-owner/pages/PGOwnerSignupPage';
import VerificationStatusBadge from './pages/pg-owner/components/VerificationStatusBadge';
```

---

## 📞 Support

For questions or issues:
- Review [type definitions](./types/index.ts)
- Check [utility functions](./utils/ownerHelpers.ts)
- See component source code for detailed implementation

**Security First. Trust Always.**

---

## 📄 License

Part of the PG-ADIS project. All rights reserved.

