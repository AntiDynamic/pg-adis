# Quick Integration Guide - Trust System

## 🎯 5-Minute Integration

### Step 1: Import Components in Your Page
```tsx
import { PGDetails } from './components/PGDetails'
import { PGMediaGallery } from './components/PGMediaGallery'
import { PGReviews } from './components/PGReviews'
import { OwnerContactCTA } from './components/OwnerContactCTA'
```

### Step 2: Add to Your PG Listing Page
```tsx
// In PGListingPage.tsx or wherever you show PG details

export function PGListingPage() {
  const pgId = 'pg-1'  // Get from URL param: useParams().pgId
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1>PG Details</h1>
      
      {/* Use the full PG Details page */}
      <PGDetails pgId={pgId} />
    </div>
  )
}
```

### Step 3: Or Add Individual Components
```tsx
// Show just media gallery
<PGMediaGallery pgId={pgId} />

// Show just reviews
<PGReviews pgId={pgId} />

// Show owner contact
<OwnerContactCTA 
  pgId={pgId}
  pgName="Skyrise Apartments"
  pgCoordinates={{ lat: 19.1334, lng: 72.9133 }}
  pgCity="Mumbai"
  ownerName="Rajesh Kumar"
  userCity="Mumbai"
/>
```

---

## 📍 Minimal Example

```tsx
import React from 'react'
import { PGDetails } from './components/PGDetails'

export default function App() {
  return <PGDetails pgId="pg-1" />
}
```

That's it! The component handles everything:
- ✓ Fetches media/reviews
- ✓ Calculates ratings
- ✓ Shows distance-based CTAs
- ✓ Handles scheduling

---

## 🔧 Customization

### Change Distance Threshold
In `src/components/OwnerContactCTA.tsx`, change:
```typescript
const NEARBY_DISTANCE_KM = 50  // Change this value
```

### Change Tab Layout
In `src/components/PGDetails.tsx`, modify:
```tsx
const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'reviews' | 'owner'>('overview')
// Add or remove tabs here
```

### Connect to Real Backend
In `src/data/mockData.ts`, replace with API calls:
```typescript
export async function getPGReviews(pgId: string) {
  const res = await fetch(`/api/pgs/${pgId}/reviews`)
  return res.json()
}
```

---

## 🚀 Testing

### Test Media Gallery
```
1. Navigate to PG Details page
2. Click "Media & Proof" tab
3. Click any image
4. See full-screen modal
5. Check verified badge
```

### Test Reviews
```
1. Click "Reviews" tab
2. See rating histogram
3. Change sort dropdown
4. Expand a review
5. See aspect ratings
```

### Test Owner Contact
```
1. Click "Contact Owner" tab
2. Click "Video Call" button
3. Select date and time
4. See confirmation
5. Try "Physical Visit" (disabled if far)
```

---

## 📊 Current Mock Data

### PGs with Media
- **pg-1**: 4 media items (3 verified)
- **pg-2**: 2 media items (2 verified)
- **pg-3**: 1 media item (1 verified)

### PGs with Reviews
- **pg-1**: 3 reviews (avg 4.7 ★)
- **pg-2**: 1 review (avg 3.0 ★)
- **pg-3**: 1 review (avg 4.0 ★)

### Add More
Edit `src/data/mockData.ts`:
```typescript
export const pgMedia: PGMediaData[] = [
  // Add new items here
]

export const studentReviews: StudentReviewData[] = [
  // Add new reviews here
]
```

---

## 🎨 Styling

All components use Tailwind CSS. Colors used:
- **Blue**: Primary actions, trust
- **Green**: Verified, success
- **Yellow**: Ratings
- **Gray**: Neutral elements

To change theme, search and replace:
- `bg-blue-600` → your color
- `text-green-600` → your color
- `border-blue-200` → your color

---

## ⚡ Performance Tips

1. **Images**: Already lazy-loaded
   ```tsx
   <img loading="lazy" src={url} />
   ```

2. **Reviews**: Paginated in UI
   - Shows 5 recent by default
   - Add "Load more" button

3. **Network**: Optimized URLs
   ```
   src="https://...?w=500&h=500&fit=crop"
   ```

---

## 🐛 Troubleshooting

### "PG not found"
- Check pgId matches data in mockData.ts
- Verify PG exists in `pgs` array

### Images not loading
- Check image URLs are valid
- Ensure CORS headers are set
- Use placeholder on error

### Reviews not showing
- Verify pgId matches in studentReviews
- Check `getPGReviews()` function
- Look at console for errors

---

## 📚 Related Files

- `src/types/index.ts` - TypeScript interfaces
- `src/data/mockData.ts` - Sample data
- `TRUST_SYSTEM_GUIDE.md` - Complete guide
- `TRUST_SYSTEM_EXAMPLES.tsx` - 10 code examples

---

## ✅ Checklist Before Deploy

- [ ] Components compile (no TS errors)
- [ ] Media gallery loads images
- [ ] Reviews display with ratings
- [ ] Owner contact CTA works
- [ ] Scheduling form submits
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Trust badges show correctly

---

## 🎯 Quick Wins to Add

### 1. Add to PG Listing Card
```tsx
<div className="border rounded-lg p-4">
  <h3>PG Name</h3>
  <p>₹8500/month</p>
  <PGReviews pgId="pg-1" />
  <button>View Details</button>
</div>
```

### 2. Add to Search Results
```tsx
{results.map(pg => (
  <div>
    <PGMediaGallery pgId={pg.id} />
    <p>Rating: {pg.rating} ★</p>
  </div>
))}
```

### 3. Add Trust Banner
```tsx
<div className="bg-green-50 p-4 rounded">
  <p>✓ Verified by 5 real residents</p>
  <p>✓ 7 verified photos</p>
</div>
```

---

## 🚀 Deploy Checklist

```bash
# 1. Build
npm run build

# 2. Check for errors
npm run lint

# 3. Type check
npx tsc --noEmit

# 4. Deploy
# Vercel:
vercel deploy dist/

# Netlify:
netlify deploy --prod --dir=dist/
```

---

## 💬 Still Need Help?

Check:
1. **TRUST_SYSTEM_GUIDE.md** - Full architecture
2. **TRUST_SYSTEM_EXAMPLES.tsx** - Code samples
3. **Type definitions** - `src/types/index.ts`
4. **Mock data** - `src/data/mockData.ts`

---

**You're all set! Deploy with confidence.** 🚀
