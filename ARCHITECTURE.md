# System Architecture & Data Flow

## 📐 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  PG Listing Page │  │ Roommate Matching│                │
│  │                  │  │      Page        │                │
│  │  - Map View      │  │  - Profile Select│                │
│  │  - Filter Panel  │  │  - Match List    │                │
│  │  - PG List       │  │  - Compatibility │                │
│  └──────────────────┘  └──────────────────┘                │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     Components Layer                         │
│                                                              │
│  ┌──────────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐  │
│  │  Map.tsx     │  │ Card.tsx │  │Badge.tsx│ │Button.tsx│  │
│  │              │  │          │  │         │  │          │  │
│  │ - Leaflet    │  │ - Styled │  │- Status │  │- Actions │  │
│  │ - OSM Tiles  │  │   wrapper│  │  tags   │  │  trigger │  │
│  │ - Markers    │  │          │  │         │  │          │  │
│  └──────────────┘  └──────────┘  └────────┘  └─────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     Logic/Utils Layer                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  helpers.ts                                           │  │
│  │                                                       │  │
│  │  • calculateDistance(lat1, lng1, lat2, lng2)        │  │
│  │    → Haversine formula for accurate distance         │  │
│  │                                                       │  │
│  │  • filterPGsByUniversity(pgs, university, radius)   │  │
│  │    → Find PGs within X km of university             │  │
│  │                                                       │  │
│  │  • filterPGs(pgs, filters)                          │  │
│  │    → Apply rent, rating, gender, verification       │  │
│  │                                                       │  │
│  │  • calculateCompatibility(student1, student2)       │  │
│  │    → 6-factor weighted scoring algorithm            │  │
│  │                                                       │  │
│  │  • findCompatibleRoommates(student, allStudents)    │  │
│  │    → Find matches above threshold                    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  mockData.ts                                          │  │
│  │                                                       │  │
│  │  • universities[] → 10 real universities            │  │
│  │  • pgs[] → 23 PG listings with real coords          │  │
│  │  • students[] → 5 student profiles                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow Diagrams

### PG Discovery Flow

```
User Opens App
      │
      ▼
┌─────────────────┐
│  Landing Page   │
│  Shows Map of   │
│  India with     │
│  University     │
│  Markers        │
└────────┬────────┘
         │
         │ (User clicks university marker)
         ▼
┌─────────────────┐
│  Popup Appears  │
│  "Find PGs near │
│   IIT Bombay"   │
└────────┬────────┘
         │
         │ (User clicks button)
         ▼
┌─────────────────────────────────┐
│  System Actions:                │
│  1. Get university coordinates  │
│  2. Calculate distances to PGs  │
│  3. Filter PGs within 5km       │
│  4. Display on map + list       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Results View:                  │
│  • Map zooms to university      │
│  • PG markers appear            │
│  • List shows PG details        │
│  • Filters become active        │
└────────┬────────────────────────┘
         │
         │ (User applies filters)
         ▼
┌─────────────────────────────────┐
│  Filtered Results:              │
│  • Max Rent: ₹9,000            │
│  • Min Rating: 4+               │
│  • Gender: Female               │
│  • Verified Only                │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Updated Map &  │
│  List (Real-    │
│  time)          │
└─────────────────┘
```

### Roommate Matching Flow

```
User Opens Roommate Page
      │
      ▼
┌─────────────────────────────┐
│  Profile Selection Screen   │
│  (Demo: 5 mock profiles)    │
│                             │
│  [ Rahul Kumar    ] Select  │
│  [ Priya Sharma   ] Select  │
│  [ Arjun Patel    ] Select  │
│  [ Sneha Reddy    ] Select  │
│  [ Amit Singh     ] Select  │
└────────┬────────────────────┘
         │
         │ (User selects profile)
         ▼
┌──────────────────────────────────────┐
│  System Calculates Compatibility:   │
│                                      │
│  FOR each other student:             │
│    1. Budget overlap → 20% weight   │
│    2. Sleep schedule → 15% weight   │
│    3. Cleanliness → 20% weight      │
│    4. Food habits → 15% weight      │
│    5. Lifestyle → 20% weight        │
│    6. Study hours → 10% weight      │
│                                      │
│  Total Score = Weighted Sum          │
│  IF score >= 60%: SHOW MATCH        │
└────────┬─────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Match Results Display:             │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ Priya Sharma         87%    │  │
│  │ Great Match                  │  │
│  │                              │  │
│  │ ✓ Budget overlap ₹2,000     │  │
│  │ ✓ Similar sleep schedules   │  │
│  │ ✓ Same cleanliness          │  │
│  │ ~ Different food habits     │  │
│  │                              │  │
│  │ [Connect] [View Profile]    │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 📊 Data Models & Relationships

```
┌────────────────────┐
│    University      │
│                    │
│ - id: string       │
│ - name: string     │
│ - city: string     │
│ - lat: number      │
│ - lng: number      │
└─────┬──────────────┘
      │
      │ 1:N
      │
      ▼
┌────────────────────┐         ┌────────────────────┐
│       PG           │         │      Student       │
│                    │         │                    │
│ - id: string       │         │ - id: string       │
│ - name: string     │         │ - name: string     │
│ - universityId ────┼────────▶│ - universityId     │
│ - lat: number      │         │ - budgetMin: num   │
│ - lng: number      │         │ - budgetMax: num   │
│ - rent: number     │         │ - sleepSchedule: 1-5│
│ - rating: number   │         │ - cleanliness: 1-5  │
│ - verified: bool   │         │ - foodHabit: enum   │
│ - gender: enum     │         │ - smoking: bool     │
│ - amenities: []    │         │ - drinking: bool    │
│ - distance: number │         │ - studyHours: 1-5   │
└────────────────────┘         └────────────────────┘
```

## 🧮 Compatibility Algorithm Breakdown

```
Input: Student A, Student B

┌────────────────────────────────────────────────────────┐
│  Factor 1: Budget Overlap (20% weight)                │
│                                                        │
│  A: ₹7,000 - ₹10,000                                  │
│  B: ₹8,000 - ₹12,000                                  │
│                                                        │
│  Overlap: ₹8,000 - ₹10,000 = ₹2,000                  │
│  Avg Range: ₹3,500                                     │
│  Score: (2000 / 3500) * 100 = 57%                    │
│  Weighted: 57 * 0.20 = 11.4 points                   │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Factor 2: Sleep Schedule (15% weight)                │
│                                                        │
│  A: 2 (Early bird)                                     │
│  B: 3 (Normal)                                         │
│                                                        │
│  Difference: |2 - 3| = 1                              │
│  Score: 100 - (1 * 25) = 75%                          │
│  Weighted: 75 * 0.15 = 11.25 points                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Factor 3: Cleanliness (20% weight)                   │
│                                                        │
│  A: 4 (Clean)                                          │
│  B: 5 (Very clean)                                     │
│                                                        │
│  Difference: |4 - 5| = 1                              │
│  Score: 100 - (1 * 25) = 75%                          │
│  Weighted: 75 * 0.20 = 15 points                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Factor 4: Food Habits (15% weight)                   │
│                                                        │
│  A: veg                                                │
│  B: veg                                                │
│                                                        │
│  Match: Same = 100%                                    │
│  Weighted: 100 * 0.15 = 15 points                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Factor 5: Lifestyle (20% weight)                     │
│                                                        │
│  A: No smoking, No drinking                            │
│  B: No smoking, No drinking                            │
│                                                        │
│  Perfect match = 100%                                  │
│  Weighted: 100 * 0.20 = 20 points                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Factor 6: Study Hours (10% weight)                   │
│                                                        │
│  A: 5 (Very intensive)                                 │
│  B: 4 (Intensive)                                      │
│                                                        │
│  Difference: |5 - 4| = 1                              │
│  Score: 100 - (1 * 25) = 75%                          │
│  Weighted: 75 * 0.10 = 7.5 points                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  TOTAL COMPATIBILITY SCORE                            │
│                                                        │
│  11.4 + 11.25 + 15 + 15 + 20 + 7.5 = 80.15%          │
│                                                        │
│  Result: "Great Match" ✓                              │
└────────────────────────────────────────────────────────┘
```

## 🗺️ Map Interaction Flow

```
Map Component Lifecycle:

1. Initialize
   ├─ Create Leaflet map instance
   ├─ Add OpenStreetMap tiles
   ├─ Set view to India (20.5937°N, 78.9629°E)
   └─ Zoom level: 5

2. Add University Markers
   FOR each university:
   ├─ Create custom icon (🎓 emoji, blue circle)
   ├─ Set position (lat, lng)
   ├─ Create popup with:
   │  ├─ University name
   │  ├─ City name
   │  └─ "Find PGs" button
   └─ Add click handler

3. User Clicks University
   ├─ Execute onUniversityClick callback
   ├─ Component triggers PG search
   ├─ Map receives new PGs to display
   └─ Trigger marker update

4. Add PG Markers
   FOR each PG:
   ├─ Create custom icon (🏠 emoji, green circle)
   ├─ Set position (lat, lng)
   ├─ Create popup with:
   │  ├─ PG name
   │  ├─ Rent, rating, distance
   │  ├─ Gender preference
   │  ├─ Amenities
   │  └─ Verification badge
   └─ Add click handler

5. Adjust Map View
   ├─ Calculate bounds of all markers
   ├─ Fit bounds with padding
   └─ Animate zoom transition
```

## 🔍 Search & Filter Logic

```
PG Search Process:

Input: University, Filters
  │
  ▼
┌──────────────────────────────────────┐
│ Step 1: Distance Filtering          │
│                                      │
│ FOR each PG in database:             │
│   distance = haversine(              │
│     university.lat,                  │
│     university.lng,                  │
│     pg.lat,                          │
│     pg.lng                           │
│   )                                  │
│   IF distance <= 5km:                │
│     ADD to nearbyPGs[]               │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Step 2: Apply User Filters           │
│                                      │
│ IF maxRent specified:                │
│   FILTER pg.rent <= maxRent          │
│                                      │
│ IF minRating specified:              │
│   FILTER pg.rating >= minRating      │
│                                      │
│ IF gender specified:                 │
│   FILTER pg.gender == gender OR      │
│          pg.gender == 'unisex'       │
│                                      │
│ IF verifiedOnly:                     │
│   FILTER pg.verified == true         │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│ Step 3: Sort Results                 │
│                                      │
│ SORT BY distance ASC                 │
│ (Closest PGs first)                  │
└─────────┬────────────────────────────┘
          │
          ▼
        Output: Filtered PG List
```

## 🎨 Component Hierarchy

```
App
│
├─ LandingPage
│  └─ Hero, Features, CTA
│
├─ PGListingPage
│  ├─ Header
│  │  ├─ Title
│  │  └─ Reset Button (if university selected)
│  │
│  ├─ FilterPanel (Card)
│  │  ├─ Max Rent Input
│  │  ├─ Min Rating Select
│  │  ├─ Gender Select
│  │  ├─ Verified Checkbox
│  │  └─ Apply Button
│  │
│  ├─ PG List (Card)
│  │  └─ PGListItem[]
│  │     ├─ Name
│  │     ├─ Price
│  │     ├─ Rating
│  │     ├─ Distance
│  │     └─ Badges
│  │
│  └─ Map (Card)
│     ├─ Leaflet Map
│     ├─ University Markers
│     └─ PG Markers
│
└─ RoommateMatchingPage
   ├─ Header
   │
   ├─ Profile Selection (if no profile)
   │  └─ Student Cards[]
   │
   └─ Match View (if profile selected)
      ├─ YourProfileCard (sticky)
      │  ├─ Profile Details
      │  └─ Change Button
      │
      └─ Matches List (Card)
         └─ MatchCard[]
            ├─ Header (name, score)
            ├─ Quick Info
            ├─ Explanation
            ├─ Breakdown (expandable)
            └─ Actions
```

---

This architecture ensures:
- **Separation of concerns**: UI / Logic / Data
- **Reusability**: Components are composable
- **Scalability**: Easy to add more universities, PGs, features
- **Maintainability**: Clear structure, TypeScript types
- **Performance**: Efficient calculations, minimal re-renders
