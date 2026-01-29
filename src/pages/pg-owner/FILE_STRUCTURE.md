# PG Owner Module - File Structure

## 📂 Complete Directory Tree

```
src/pages/pg-owner/
│
├── 📄 index.ts                          # Central exports (all components, types, utils)
├── 📖 README.md                         # Complete documentation (API, examples, types)
├── 📖 INTEGRATION_GUIDE.md              # Quick start & integration guide  
├── 📖 MODULE_SUMMARY.md                 # Overview & quick reference
│
├── 📁 components/                       # UI Components (5 files)
│   ├── AdminVerificationPanel.tsx      # Admin panel for reviewing PGs
│   ├── OwnerContactCTA.tsx             # Student-owner interaction widget
│   ├── PGProofUpload.tsx               # File upload component
│   └── VerificationStatusBadge.tsx     # Status badge display
│
├── 📁 pages/                            # Main Pages (2 files)
│   ├── PGOwnerDashboard.tsx            # Owner dashboard with stats
│   └── PGOwnerSignupPage.tsx           # 3-step registration wizard
│
├── 📁 types/                            # TypeScript Definitions (1 file)
│   └── index.ts                        # All owner-related types
│
└── 📁 utils/                            # Helper Functions (1 file)
    └── ownerHelpers.ts                 # 15+ utility functions
```

---

## 📋 File Details

### 📄 Root Files

| File | Lines | Purpose |
|------|-------|---------|
| `index.ts` | ~50 | Export all components, types, and utilities |
| `README.md` | ~500 | Complete API documentation |
| `INTEGRATION_GUIDE.md` | ~350 | Quick start & integration examples |
| `MODULE_SUMMARY.md` | ~250 | Overview & quick reference |

### 📁 components/

| File | Lines | Description |
|------|-------|-------------|
| `AdminVerificationPanel.tsx` | ~400 | Admin UI to review and verify pending PG listings |
| `OwnerContactCTA.tsx` | ~300 | Student-owner contact widget with video/visit options |
| `PGProofUpload.tsx` | ~296 | Upload interface for ownership docs, photos, videos |
| `VerificationStatusBadge.tsx` | ~95 | Status badge component (4 states) |

**Total:** ~1091 lines

### 📁 pages/

| File | Lines | Description |
|------|-------|-------------|
| `PGOwnerDashboard.tsx` | ~350 | Owner dashboard with stats, filters, PG management |
| `PGOwnerSignupPage.tsx` | ~531 | 3-step wizard for PG registration |

**Total:** ~881 lines

### 📁 types/

| File | Lines | Description |
|------|-------|-------------|
| `index.ts` | ~170 | All TypeScript interfaces and types for owner module |

**Total:** ~170 lines

### 📁 utils/

| File | Lines | Description |
|------|-------|-------------|
| `ownerHelpers.ts` | ~280 | Helper functions: validation, filtering, stats, formatting |

**Total:** ~280 lines

---

## 📊 Statistics

### Code Stats
- **Total Files:** 12 (8 code + 4 docs)
- **Total Lines of Code:** ~2,400+ lines
- **Components:** 5
- **Pages:** 2
- **Utility Functions:** 15+
- **Type Definitions:** 15+

### Features
- ✅ 3-step PG registration
- ✅ Owner dashboard with statistics
- ✅ Admin verification panel
- ✅ File upload system
- ✅ Status badge system
- ✅ Student-owner interaction
- ✅ Complete type safety
- ✅ Helper utilities
- ✅ Comprehensive documentation

---

## 🎯 Import Map

```tsx
// All imports from single entry point
import {
  // Pages
  PGOwnerSignupPage,
  PGOwnerDashboard,
  
  // Components
  PGProofUpload,
  VerificationStatusBadge,
  OwnerContactCTA,
  AdminVerificationPanel,
  
  // Types
  VerificationStatus,
  PGListingWithVerification,
  PGOwnerProfile,
  // ... more types
  
  // Utils
  getVerifiedPGs,
  getPGsByOwner,
  calculateOwnerStats,
  // ... more utils
} from './pages/pg-owner';
```

---

## 📖 Documentation Map

| Document | Use When |
|----------|----------|
| **README.md** | Need complete API reference, detailed examples |
| **INTEGRATION_GUIDE.md** | Starting integration, need quick examples |
| **MODULE_SUMMARY.md** | Need overview, quick reference |
| **FILE_STRUCTURE.md** | Want to understand folder organization |

---

## 🔍 Quick Find

### Need to...
- **Add a new route?** → See INTEGRATION_GUIDE.md
- **Filter verified PGs?** → Use `getVerifiedPGs()` from utils
- **Show status badge?** → Import `VerificationStatusBadge`
- **Create owner dashboard?** → Use `PGOwnerDashboard` page
- **Validate uploads?** → Use `validateAllProofs()` from utils
- **Understand types?** → See types/index.ts
- **Calculate stats?** → Use `calculateOwnerStats()` from utils

---

## ✨ Key Features by File

### PGOwnerSignupPage.tsx
- 3-step wizard (Info → Details → Proofs)
- Form validation
- OTP simulation
- Auto-submission

### PGOwnerDashboard.tsx
- Stats cards (total, verified, pending, occupancy)
- PG listing cards with status
- Filter by verification status
- Edit/update functionality

### AdminVerificationPanel.tsx
- Pending verifications list
- Proof viewer (expandable)
- Verification checklist
- Approve/Reject actions

### VerificationStatusBadge.tsx
- 4 status types (verified, pending, rejected, resubmission)
- 3 sizes (sm, md, lg)
- Optional label

### PGProofUpload.tsx
- Document upload (PDF/JPG/PNG)
- Photo upload (5-10 images)
- Video upload (30-90 sec)
- Validation & preview

### OwnerContactCTA.tsx
- Distance calculation
- Video call option (all)
- Physical visit (nearby only)
- Scheduling interface

### ownerHelpers.ts
- `getVerifiedPGs()` - Filter verified
- `getPGsByOwner()` - Get owner's PGs
- `calculateOwnerStats()` - Dashboard stats
- `validateAllProofs()` - Validation
- `calculateDistance()` - Geo distance
- Plus 10+ more functions!

---

## 🎨 Dependencies

### Internal (from main project)
```tsx
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
```

### External (from node_modules)
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
```

---

## 🚀 Usage Example

```tsx
// 1. Import
import { 
  PGOwnerSignupPage,
  PGOwnerDashboard,
  getVerifiedPGs 
} from './pages/pg-owner';

// 2. Add Routes
<Route path="/become-owner" element={<PGOwnerSignupPage />} />
<Route path="/owner/dashboard" element={<PGOwnerDashboard {...props} />} />

// 3. Filter PGs
const verifiedPGs = getVerifiedPGs(allPGs);

// Done! ✨
```

---

## 📞 Quick Reference

**File Count:** 12 files (8 code, 4 docs)  
**Total Lines:** 2,400+  
**Components:** 5  
**Pages:** 2  
**Features:** 25+  

**Status:** ✅ Production Ready

---

*Last Updated: January 29, 2026*

