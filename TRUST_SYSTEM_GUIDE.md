# PG Proof, Reviews & Owner Interaction System
## Implementation Guide & Best Practices

---

## 🎯 Overview

This system builds trust in the PG discovery platform by combining:
- **Media Verification** (photos/videos with admin approval)
- **Real Student Reviews** (post-stay only)
- **Distance-Based Owner Interaction** (video call or physical visit)

---

## 📦 Component Architecture

### 1. **PGMediaGallery** 
```typescript
- Lazy-loads images and videos
- Shows verification badges
- Categorizes content (room, washroom, common-area, food)
- Modal detail view with metadata
```

**Features:**
- Filters by photo/video type
- Verified media count display
- Category color-coding
- Responsive grid layout

**Performance:**
- Lazy loading with `loading="lazy"` attribute
- Prevents image overload in low-bandwidth networks
- Only loads modal content on demand

---

### 2. **PGReviews**
```typescript
- Rating distribution histogram
- Sorted reviews (recent/helpful/rating)
- Aspect-level scoring (cleanliness, food, owner, maintenance)
- Verified stay badges
- Stay duration tags ("Stayed 8 months")
```

**Features:**
- Real-time sort switching
- Expandable review descriptions
- Helpful/Unhelpful counters
- Visual rating breakdowns

**Trust Indicators:**
- ✓ Verified Stay tag
- Average rating calculation
- Aspect-level scoring

---

### 3. **OwnerContactCTA**
```typescript
- Distance-aware CTAs (video call always, physical visit if nearby)
- Scheduling form with date/time slots
- Success confirmation
- Trust indicators summary
- Safety disclaimer
```

**Features:**
- Auto-detect user location (city or coordinates)
- 50km radius for "nearby" users
- Pre-filled time slots
- Confirmation via SMS simulation

---

### 4. **PGDetails**
```typescript
- Full PG profile page
- Tab navigation (overview/media/reviews/owner)
- Floating "Contact Owner" CTA
- Amenities showcase
- Quick facts section
```

---

## 🔒 Trust & Fraud Prevention

### Media Verification
```typescript
// Two levels of verification
type uploadedBy = 'owner' | 'verified-admin'
verified: boolean  // Mark after manual review
verifiedAt: Date   // Track verification timestamp
```

**Process:**
1. Owner/admin uploads media
2. Admin manually reviews (checks for authenticity, quality, relevance)
3. Mark as `verified: true`
4. Display "✓ Verified" badge to users

### Review Verification
```typescript
// Only post-stay reviews
stayDuration: { months, from, to }
verified: boolean  // Verified resident
```

**Validation:**
- Compare user ID with booking history
- Duration must be > 1 month to qualify
- Cross-check against payment records (future)

### Owner Verification
```typescript
// In future expansion
ownerInfo: {
  name: string
  verified: boolean
  document_id: string  // Aadhaar/PAN
  phone_verified: boolean
  response_rate: number
}
```

---

## 📱 Low-Bandwidth Optimization

### Image Optimization
```typescript
// Use appropriate image sizes
src="https://images.unsplash.com/photo-...?w=500&h=500&fit=crop"

// Lazy load in gallery
<img src={url} loading="lazy" />

// Placeholder while loading
className="bg-gray-300 animate-pulse"
```

### Data Reduction
```typescript
// Pagination for reviews
- Show 5 recent by default
- "Load more" button for rest
- Reduces initial payload

// Summary instead of full data
- Rating distribution (bar chart)
- Not full review text initially
```

### Network-Aware Loading
```typescript
// Detect connection type
const connection = (navigator as any).connection
if (connection?.effectiveType === '4g') {
  // Load high-res media
} else {
  // Load optimized versions
}
```

---

## 🔄 User Flow

### Discovery Flow
```
1. Browse PGs on map
2. Click PG marker
3. See summary (rating, rent, distance)
4. Click "View Details"
5. Land on PGDetails page
```

### Media Proof Flow
```
1. User lands on PG details → overview tab
2. Clicks "Media & Proof" tab
3. Sees gallery grid with verified badges
4. Lazy-loads as they scroll
5. Can click image for full-screen view
```

### Reviews Flow
```
1. User clicks "Reviews" tab
2. Sees rating summary at top
3. Can sort by recent/helpful/rating
4. Reads reviews with stay duration
5. Sees aspect ratings (cleanliness, food, etc.)
```

### Owner Interaction Flow
```
1. User interested in PG
2. Clicks "Contact Owner" tab/button
3. Sees owner info and trust indicators
4. If nearby: Can schedule physical visit
5. If far: Can schedule video call
6. Books time slot
7. Gets confirmation via SMS
```

---

## 🏗️ TypeScript Interfaces

```typescript
// Media
interface PGMedia {
  id: string
  pgId: string
  type: 'photo' | 'video'
  title: string
  description?: string
  url: string
  category: 'room' | 'washroom' | 'common-area' | 'food' | 'other'
  uploadedBy: 'owner' | 'verified-admin'
  verified: boolean
  verifiedAt?: Date
  uploadedAt: Date
  views?: number
}

// Review
interface StudentReview {
  id: string
  pgId: string
  userId: string
  userName: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string
  description: string
  stayDuration: { months: number; from: Date; to: Date }
  aspects?: {
    cleanliness: number
    foodQuality: number
    ownerBehavior: number
    maintenance: number
  }
  verified: boolean  // Verified as actual resident
  helpful: number
  unhelpful: number
  createdAt: Date
}

// Owner Interaction
interface OwnerInteractionState {
  pgId: string
  userId: string
  userCity: string
  userCoordinates?: { lat: number; lng: number }
  pgCoordinates: { lat: number; lng: number }
  distanceKm?: number
  isNearby: boolean  // Within same city or <50km
  preferredContact: 'video-call' | 'physical-visit' | 'both'
}

// Contact Log
interface OwnerContactLog {
  id: string
  pgId: string
  userId: string
  contactType: 'video-call' | 'physical-visit' | 'message'
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled'
  scheduledAt?: Date
  completedAt?: Date
  notes?: string
  createdAt: Date
}
```

---

## 🎨 UI/UX Best Practices

### Clear Trust Indicators
```tsx
// Always show verification status
<span className="text-green-700 font-medium">✓ Verified Media</span>

// Show lack of info as disclaimer
{reviews.length === 0 && (
  <p className="text-blue-900">
    No reviews yet. Be the first to review after your stay!
  </p>
)}

// Distance awareness
{isNearby ? (
  <button>Schedule Physical Visit</button>
) : (
  <button disabled>Physical Visit (Available only if nearby)</button>
)}
```

### Progressive Disclosure
```tsx
// Don't overwhelm with all reviews
- Show 5 recent by default
- "Load more" button for rest
- Details in expandable cards

// Filter options available but not forced
<select>
  <option>Most Recent</option>
  <option>Most Helpful</option>
  <option>Highest Rating</option>
</select>
```

### Responsive Design
```tsx
// Mobile-first grid
grid-cols-2 md:grid-cols-3 lg:grid-cols-4

// Touch-friendly buttons
py-3 px-6  // Minimum 44x44px for tap targets

// Stacked on mobile
grid-cols-1 md:grid-cols-2
```

---

## 🚀 Implementation Checklist

### MVP Features
- [x] Media gallery with lazy loading
- [x] Photo/video categorization
- [x] Verified badges
- [x] Student reviews with ratings
- [x] Aspect-level scoring
- [x] Verified stay indicator
- [x] Distance-based CTAs
- [x] Scheduling form
- [x] Success confirmation

### Future Enhancements
- [ ] Admin verification workflow
- [ ] Fraud detection system
- [ ] Real backend API integration
- [ ] User authentication
- [ ] Booking history verification
- [ ] Report inappropriate media
- [ ] Review moderation
- [ ] Video hosting integration
- [ ] SMS notifications
- [ ] Payment gateway integration

---

## 📊 Mock Data Structure

```typescript
// Example: 5 reviews for pg-1
export const studentReviews = [
  {
    id: 'review-1',
    pgId: 'pg-1',
    userName: 'Rahul Kumar',
    rating: 5,
    stayDuration: { months: 8, from: '2023-06-01', to: '2024-02-01' },
    aspects: {
      cleanliness: 5,
      foodQuality: 4,
      ownerBehavior: 5,
      maintenance: 5,
    },
    verified: true,
    helpful: 24,
  },
  // ... more reviews
]

// Example: 4 media items for pg-1
export const pgMedia = [
  {
    id: 'media-1',
    pgId: 'pg-1',
    type: 'photo',
    category: 'room',
    verified: true,
    uploadedBy: 'owner',
  },
  // ... more media
]
```

---

## 🔧 Configuration Options

### Distance Threshold
```typescript
const NEARBY_DISTANCE_KM = 50  // Adjust based on city

// Or use city-based logic
const isNearby = userCity === pgCity
```

### Review Count Threshold
```typescript
const MIN_STAY_MONTHS = 1  // Minimum stay to review
const REVIEWS_PER_PAGE = 5  // Pagination limit
```

### Aspect Weights
```typescript
const ASPECT_WEIGHTS = {
  cleanliness: 0.25,
  foodQuality: 0.25,
  ownerBehavior: 0.25,
  maintenance: 0.25,
}
```

---

## 🧪 Testing Scenarios

### Positive Flow
```
✓ PG with rich media (8+ items, 3+ verified)
✓ PG with excellent reviews (4.5+ rating, 20+ reviews)
✓ User nearby - Shows physical visit option
✓ User far - Shows video call only
✓ Scheduling form accepts date/time
```

### Edge Cases
```
✓ PG with no media - Shows disclaimer
✓ PG with no reviews - Shows call-to-action
✓ User coordinates missing - Falls back to city comparison
✓ Review with no photos - Still displays text
✓ Unverified media - No badge shown
```

---

## 📈 Success Metrics

### Trust Building
- Review count per PG
- Media verification rate
- User-generated review rate
- Owner response time

### Engagement
- Click-through to contact owner
- Scheduling rate
- Review submission rate
- Video walkthrough views

### Quality
- Average rating trend
- Helpful vs unhelpful ratio
- Reported inappropriate content
- User churn rate

---

## 🛡️ Security Considerations

### Data Privacy
- Don't expose owner phone number directly
- Mask user emails in reviews
- Use encrypted contact logs
- GDPR-compliant data storage

### Fraud Prevention
- Verify reviews against booking history
- Check for review spam patterns
- Monitor for fake media uploads
- Rate limit scheduling requests

### Content Moderation
- Manual review of all media
- Automated filters for inappropriate content
- User reporting system
- Review approval workflow

---

## 📞 Support & Troubleshooting

### Common Issues

**Images not loading?**
```typescript
// Fallback image on error
<img onError={(e) => {
  e.currentTarget.src = '/placeholder.jpg'
}} />
```

**Slow media loading?**
```typescript
// Use CDN URLs with optimization
src="https://cdn.example.com/image.jpg?w=500&q=80"
```

**Reviews not showing?**
```typescript
// Check PG ID matches
console.log('PG ID:', pgId)
console.log('Reviews:', getPGReviews(pgId))
```

---

## 🎓 Learning Resources

- Lazy loading: MDN Web Docs
- Image optimization: Web.dev
- Trust in marketplaces: Nielsen Norman Group
- Fraud detection: OWASP

---

**Built with ❤️ for student safety and trust**
