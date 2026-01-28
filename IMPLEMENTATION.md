# PG Finder MVP - Implementation Guide

## 🎯 Overview

A university-first, map-driven web application for PG (Paying Guest) students in India to find trusted accommodations, compatible roommates, and nearby mess food options.

## ✅ Implemented Features

### 1. Map-Based UI (OpenStreetMap + Leaflet.js)
- ✅ Real OpenStreetMap tiles integration
- ✅ Custom markers for universities (🎓) and PGs (🏠)
- ✅ Interactive popups with actionable buttons
- ✅ Real latitude/longitude coordinates for all locations
- ✅ Smooth animations and zoom controls

### 2. University-First Flow
- ✅ Display 10 major Indian universities as map markers
  - IIT Bombay, Mumbai University
  - IISc Bangalore, Bangalore University
  - Delhi University, JNU
  - Pune University, COEP
  - IIT Madras, University of Hyderabad
- ✅ Click university marker → Popup with "Find PGs near this university" button
- ✅ Search triggered by university selection (5km radius)

### 3. PG Listings
- ✅ 23 PG listings with **real coordinates** near universities
- ✅ Mock but realistic data:
  - Rent (₹6,500 - ₹12,000)
  - Ratings (3.8 - 4.6 stars)
  - Verification status
  - Gender preferences (male/female/unisex)
  - Amenities (WiFi, Meals, AC, Security, etc.)
  - Distance from university (0.5 - 1.8 km)

### 4. Advanced Filtering System
- ✅ Filter by max rent
- ✅ Filter by minimum rating (3+, 4+, 4.5+)
- ✅ Filter by gender preference
- ✅ Verified PGs only toggle
- ✅ Real-time filter application

### 5. Roommate Matching Algorithm
- ✅ **Compatibility scoring** (0-100%)
- ✅ Weighted factors:
  - Budget overlap (20% weight)
  - Sleep schedule (15% weight)
  - Cleanliness standards (20% weight)
  - Food habits (15% weight)
  - Lifestyle (smoking/drinking) (20% weight)
  - Study hours (10% weight)
- ✅ Minimum 60% threshold for matches
- ✅ Human-readable explanations for each match
- ✅ Detailed breakdown on demand

### 6. Student Profiles
- ✅ 5 diverse mock student profiles
- ✅ Profile attributes:
  - University affiliation
  - Budget range
  - Sleep schedule (1-5 scale)
  - Cleanliness (1-5 scale)
  - Food habits (veg/non-veg/vegan)
  - Smoking/drinking preferences
  - Study intensity (1-5 scale)

## 📁 Project Structure

```
src/
├── components/
│   ├── Map.tsx                    # OpenStreetMap + Leaflet integration
│   └── ui/                        # Existing UI components
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Rating.tsx
│       └── ...
├── data/
│   └── mockData.ts                # Universities, PGs, Students data
├── pages/
│   ├── PGListingPage.tsx          # University → PG search flow
│   ├── RoommateMatchingPage.tsx   # Compatibility matching
│   ├── DashboardPage.tsx
│   ├── LandingPage.tsx
│   └── MessDiscoveryPage.tsx
├── utils/
│   └── helpers.ts                 # Search & matching algorithms
├── styles/
│   └── globals.css
└── main.tsx
```

## 🔧 Key Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js + OpenStreetMap
- **State**: React hooks (useState)

## 🚀 Getting Started

### Installation

```bash
# Dependencies already installed:
npm install leaflet @types/leaflet
```

### Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

## 📍 Core Implementation Details

### 1. Map Component (`src/components/Map.tsx`)

**Features:**
- Renders OpenStreetMap tiles
- Custom markers with emoji icons (🎓 for universities, 🏠 for PGs)
- Dynamic popups with university info and action buttons
- Automatic bounds adjustment
- Marker clustering for better UX

**Key Code:**
```typescript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

### 2. Mock Data (`src/data/mockData.ts`)

**Universities:**
- 10 major Indian universities
- Real coordinates (lat/lng)
- City information

**PGs:**
- 23 PG listings
- Real coordinates within 1-5km of universities
- Realistic pricing, ratings, amenities

**Students:**
- 5 diverse profiles
- Complete lifestyle attributes
- Budget preferences

### 3. Search Logic (`src/utils/helpers.ts`)

**Distance Calculation:**
```typescript
// Haversine formula for accurate distance
function calculateDistance(lat1, lng1, lat2, lng2): number
```

**PG Filtering:**
```typescript
// Filter PGs within radius
filterPGsByUniversity(pgs, university, radiusKm)

// Apply additional filters
filterPGs(pgs, { maxRent, minRating, verifiedOnly, gender })
```

### 4. Matchmaking Algorithm (`src/utils/helpers.ts`)

**Compatibility Calculation:**
```typescript
calculateCompatibility(student1, student2): CompatibilityResult
```

**Returns:**
- Overall score (0-100%)
- Breakdown by factor
- Human-readable explanations

**Example Output:**
```
Score: 87%
✓ Budget ranges overlap by ₹2,000
✓ Very similar sleep schedules
✓ Similar cleanliness standards
~ Different food habits (manageable)
✓ Identical lifestyle preferences
```

## 🎨 User Flow

### PG Search Flow
1. **Landing** → User sees map of India with university markers
2. **Select University** → Click a university marker
3. **View Popup** → See university name, click "Find PGs"
4. **Results** → Map zooms to university, shows nearby PGs
5. **Filter** → Apply price, rating, gender filters
6. **Explore** → Click PG markers to see details

### Roommate Matching Flow
1. **Select Profile** → Choose/create student profile
2. **View Matches** → See compatible students (60%+ score)
3. **Explore Match** → Read compatibility explanation
4. **Details** → Expand to see factor breakdown
5. **Connect** → Initiate connection (placeholder)

## 🔮 Future Enhancements (Not Implemented)

### AI Integration (Gemini)
**Planned uses:**
- Generate natural language explanations for PG suitability
- Provide local area insights near universities
- Answer questions about neighborhoods
- Summarize PG reviews

**Example prompts:**
```typescript
// PG Recommendation
`Why is ${pgName} a good fit for a first-year student at ${universityName}?`

// Local Area Guide
`What are the key things to know about living near ${universityName} in ${city}?`

// Roommate Fit
`Explain why these two students with compatibility score ${score}% would make good roommates.`
```

### Additional Features
- [ ] Real authentication & user profiles
- [ ] Image uploads for PGs
- [ ] Booking/contact system
- [ ] Review system
- [ ] In-app messaging
- [ ] Payment integration
- [ ] Verified owner dashboard
- [ ] Real-time availability updates
- [ ] Push notifications

## 📊 Data Models

### University
```typescript
{
  id: string
  name: string
  city: string
  lat: number
  lng: number
}
```

### PG
```typescript
{
  id: string
  name: string
  lat: number
  lng: number
  universityId: string
  rent: number
  rating: number
  verified: boolean
  gender: 'male' | 'female' | 'unisex'
  amenities: string[]
  distance: number  // km from university
}
```

### Student
```typescript
{
  id: string
  name: string
  universityId: string
  budgetMin: number
  budgetMax: number
  sleepSchedule: 1-5
  cleanliness: 1-5
  foodHabit: 'veg' | 'non-veg' | 'vegan'
  smoking: boolean
  drinking: boolean
  studyHours: 1-5
}
```

## 🧪 Testing Scenarios

### Test PG Search
1. Open `/pg-listing` page
2. Click "IIT Bombay" marker
3. Verify 3 PGs appear
4. Apply filter: Max Rent ₹9,000
5. Verify results update

### Test Roommate Matching
1. Open `/roommate-matching` page
2. Select "Rahul Kumar" profile
3. Verify compatibility scores shown
4. Click "Show more details" on a match
5. Verify breakdown appears

## 🐛 Known Limitations

1. **Mock Data Only**: All data is hardcoded
2. **No Backend**: No persistence or real API calls
3. **No Auth**: No user authentication system
4. **Limited PGs**: Only 23 PG listings
5. **No Real Images**: Placeholder images only
6. **Static Coordinates**: PG locations are fixed

## 🎓 Learning Resources

- [Leaflet.js Documentation](https://leafletjs.com/)
- [OpenStreetMap Usage Policy](https://operations.osmfoundation.org/policies/tiles/)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- [React + TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)

## 📝 Notes for Hackathon Presentation

### Key Differentiators
1. **University-First** (not generic location search)
2. **Real Maps** (OpenStreetMap, not Google Maps)
3. **Algorithmic Matching** (explainable logic, not black-box AI)
4. **Real Coordinates** (all locations are actual places)
5. **Transparent Scoring** (users see why compatibility score is X%)

### Demo Script
1. Show landing page with universities
2. Click IIT Bombay → Show PG search
3. Apply filters → Show real-time updates
4. Switch to roommate matching
5. Show compatibility explanations
6. Highlight transparency & logic

### Technical Highlights
- Clean separation of concerns
- Type-safe TypeScript
- Reusable components
- Scalable architecture
- No vendor lock-in (OSM vs Google Maps)

## 🤝 Contributing

This is an MVP. To extend:

1. **Add Universities**: Update `src/data/mockData.ts`
2. **Add PGs**: Ensure real lat/lng, link to university
3. **Improve Algorithm**: Adjust weights in `calculateCompatibility()`
4. **Add Features**: Create new pages in `src/pages/`

## 📄 License

MIT License - Built for educational/hackathon purposes.

---

**Built with ❤️ for PG students in India** 🇮🇳
