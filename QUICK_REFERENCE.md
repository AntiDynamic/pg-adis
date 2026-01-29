# 🚀 Quick Reference Card

## Instant Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## File Locations

| What | Where |
|------|-------|
| Map Component | `src/components/Map.tsx` |
| Mock Data | `src/data/mockData.ts` |
| Algorithms | `src/utils/helpers.ts` |
| PG Page | `src/pages/PGListingPage.tsx` |
| Roommate Page | `src/pages/RoommateMatchingPage.tsx` |

## Key Functions

### Distance Calculation
```typescript
import { calculateDistance } from './utils/helpers';
const km = calculateDistance(lat1, lng1, lat2, lng2);
```

### Filter PGs by University
```typescript
import { filterPGsByUniversity } from './utils/helpers';
const nearbyPGs = filterPGsByUniversity(pgs, university, 5); // 5km radius
```

### Calculate Compatibility
```typescript
import { calculateCompatibility } from './utils/helpers';
const result = calculateCompatibility(student1, student2);
console.log(result.score); // 0-100
console.log(result.explanation); // ["✓ Similar...", "✗ Different..."]
```

## Data Quick Access

### Universities
```typescript
import { universities } from './data/mockData';
// 10 universities: IIT Bombay, IISc, DU, etc.
```

### PGs
```typescript
import { pgs } from './data/mockData';
// 23 PG listings with real coordinates
```

### Students
```typescript
import { students } from './data/mockData';
// 5 student profiles for matching
```

## Component Props

### Map Component
```typescript
<Map
  universities={universities}
  pgs={filteredPGs}
  onUniversityClick={(uni) => {...}}
  onPGClick={(pg) => {...}}
  selectedUniversityId={selectedId}
/>
```

### Card Component
```typescript
<Card className="p-4">
  Content here
</Card>
```

### Button Component
```typescript
<Button
  variant="default" | "outline" | "ghost"
  size="sm" | "md" | "lg"
  onClick={() => {...}}
>
  Click me
</Button>
```

### Badge Component
```typescript
<Badge variant="default" | "verified" | "premium" | "new">
  Label
</Badge>
```

## Compatibility Weights

| Factor | Weight | Range |
|--------|--------|-------|
| Budget overlap | 20% | 0-100 |
| Sleep schedule | 15% | 0-100 |
| Cleanliness | 20% | 0-100 |
| Food habits | 15% | 0-100 |
| Lifestyle | 20% | 0-100 |
| Study hours | 10% | 0-100 |

**Threshold**: 60% minimum for showing matches

## Common Tasks

### Add a New University
1. Open `src/data/mockData.ts`
2. Add to `universities` array:
```typescript
{
  id: 'my-university',
  name: 'My University',
  city: 'City Name',
  lat: 12.3456,  // Real latitude
  lng: 78.9012,  // Real longitude
}
```

### Add a New PG
1. Open `src/data/mockData.ts`
2. Add to `pgs` array:
```typescript
{
  id: 'pg-new',
  name: 'New PG',
  lat: 12.3456,
  lng: 78.9012,
  universityId: 'my-university',  // Link to university
  rent: 8000,
  rating: 4.2,
  verified: true,
  gender: 'unisex',
  amenities: ['WiFi', 'Meals'],
  distance: 1.5,  // km from university
}
```

### Change Compatibility Weights
1. Open `src/utils/helpers.ts`
2. Find `calculateCompatibility` function
3. Modify the final calculation:
```typescript
const score = Math.round(
  breakdown.budgetMatch * 0.20 +       // Change these
  breakdown.sleepScheduleMatch * 0.15 + // weights to
  breakdown.cleanlinessMatch * 0.20 +   // adjust the
  breakdown.foodHabitMatch * 0.15 +     // algorithm
  breakdown.lifestyleMatch * 0.20 +
  breakdown.studyHoursMatch * 0.10
);
```

### Adjust Search Radius
```typescript
// In PGListingPage.tsx, line ~34
const nearbyPGs = filterPGsByUniversity(pgs, university, 5); // Change 5 to desired km
```

## Styling Quick Reference

### Tailwind Classes Used

```css
/* Layouts */
grid, flex, space-y-4, gap-6

/* Sizing */
w-full, h-screen, max-w-7xl

/* Colors */
bg-gray-50, text-gray-900, border-gray-200
bg-blue-500, text-blue-600

/* Spacing */
p-4, px-6, py-8, m-4, mt-2

/* Borders */
rounded-lg, border, border-b

/* Effects */
hover:bg-gray-50, transition-colors, shadow-lg
```

## Debugging Tips

### Map Not Loading?
```typescript
// Check console for:
// 1. Leaflet CSS imported in globals.css
// 2. No TypeScript errors in Map.tsx
// 3. Universities data has valid lat/lng
```

### PGs Not Appearing?
```typescript
// Check:
// 1. University is selected
// 2. PGs have correct universityId
// 3. Distance calculation is working
// 4. Filters aren't too restrictive
```

### Compatibility Score Wrong?
```typescript
// Check:
// 1. Student profiles have all required fields
// 2. Values are in correct ranges (1-5, etc.)
// 3. Weights sum to 1.0 (100%)
```

## Performance Tips

### Optimize Map Rendering
```typescript
// Use React.memo for expensive components
const Map = React.memo(({ universities, pgs }) => {
  // ...
});
```

### Cache Distance Calculations
```typescript
const distanceCache = new Map();
function getCachedDistance(lat1, lng1, lat2, lng2) {
  const key = `${lat1},${lng1},${lat2},${lng2}`;
  if (!distanceCache.has(key)) {
    distanceCache.set(key, calculateDistance(lat1, lng1, lat2, lng2));
  }
  return distanceCache.get(key);
}
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm install` again |
| Map markers not showing | Check Leaflet CSS import |
| Type errors | Run `npx tsc --noEmit` to see all errors |
| Filters not working | Clear filters and try again |
| Page is blank | Check console for JavaScript errors |

## URLs

| Page | URL |
|------|-----|
| Landing | `http://localhost:5173/` |
| PG Listing | `http://localhost:5173/pg-listing` |
| Roommate Matching | `http://localhost:5173/roommate-matching` |

## Environment Setup

```bash
# Required Node version
node --version  # Should be >= 16

# Install dependencies
npm install

# Start development
npm run dev

# Access at
http://localhost:5173
```

## Git Commands (If Using)

```bash
# Initial commit
git init
git add .
git commit -m "Complete MVP implementation"

# Create GitHub repo and push
git remote add origin https://github.com/username/pgs-finder.git
git push -u origin main
```

## Deploy to Vercel

```bash
# Build locally
npm run build

# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel

# Or just drag 'dist' folder to vercel.com
```

## Testing Checklist

- [ ] All pages load without errors
- [ ] Map displays universities
- [ ] Clicking university shows PGs
- [ ] Filters work correctly
- [ ] Roommate matching calculates scores
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No console warnings

## Resources

- [Leaflet Docs](https://leafletjs.com/reference.html)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Keep this card handy during development!** 📌
