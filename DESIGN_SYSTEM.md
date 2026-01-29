# 🎨 PGLife Design System - Complete Guide

## 📋 Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Component Library](#component-library)
5. [Layout Patterns](#layout-patterns)
6. [Interactions & Animations](#interactions--animations)
7. [Page-by-Page Breakdown](#page-by-page-breakdown)

---

## 🎯 Design Philosophy

### Core Principles
1. **Trust First**: Every design decision reinforces safety and credibility
2. **Student-Centric**: Built for Indian college students and young professionals
3. **Premium, Not Luxury**: Sophisticated without being intimidating
4. **Information Clarity**: Complex data made simple and scannable
5. **Mobile-First**: Touch-friendly, thumb-reachable, fast-loading

### Visual Language
- **Dark Foundation**: Black/gray-900 background signals premium, reduces eye strain
- **Green Accent**: Trust-building emerald green (not neon, not corporate)
- **Subtle Depth**: Soft shadows, layered cards, gentle gradients
- **Rounded Geometry**: 12-24px corners for approachability
- **Smart Whitespace**: Breathing room without feeling empty

---

## 🎨 Color System

### Primary Palette
```css
Background Layers:
├─ dark-900: #0a0a0a (Page background)
├─ dark-800: #121212 (Section backgrounds)
├─ dark-700: #1a1a1a (Elevated elements)
└─ surface:  #1f1f1f (Card default)

Trust Green (Primary):
├─ trust-400: #4ade80 (Interactive elements)
├─ trust-500: #22c55e (Primary CTA, verified badges)
└─ trust-600: #16a34a (Hover states)

Text Hierarchy:
├─ gray-50:  Primary text (headings, emphasis)
├─ gray-300: Body text
├─ gray-400: Secondary text (labels)
└─ gray-500: Placeholder text
```

### Usage Guidelines

**Verified Elements**
- Background: `trust-500/10` (10% opacity)
- Border: `trust-500/20`
- Text: `trust-400`
- Glow: `shadow-glow-sm`

**Interactive States**
- Default: `bg-surface border-gray-700`
- Hover: `bg-surface-hover border-gray-600`
- Focus: `ring-2 ring-trust-500`
- Active: `bg-trust-500 text-white`

---

## ✍️ Typography

### Font Family
**Inter** - Modern geometric sans-serif
- Clean, professional, highly readable
- Excellent hinting for screens
- Wide character set (supports Indian languages)

### Type Scale
```css
Display (Hero):    text-6xl (60px) / font-bold (700)
Heading 1:         text-4xl (36px) / font-bold (700)
Heading 2:         text-3xl (30px) / font-bold (700)
Heading 3:         text-xl (20px) / font-bold (700)
Body Large:        text-lg (18px) / font-normal (400)
Body:              text-base (16px) / font-normal (400)
Small:             text-sm (14px) / font-normal (400)
Tiny:              text-xs (12px) / font-medium (500)
```

### Usage Examples
```tsx
// Hero headline
<h1 className="text-6xl font-bold text-balance">
  Find Your Perfect <span className="text-gradient">Student Home</span>
</h1>

// Section heading
<h2 className="text-3xl font-bold mb-4">Featured PGs</h2>

// Card title
<h3 className="text-xl font-bold text-gray-100">Green Valley PG</h3>

// Body text
<p className="text-base text-gray-300 leading-relaxed">
  Verified PG with excellent food quality...
</p>
```

---

## 🧩 Component Library

### 1. Button Component

**Variants:**
```tsx
// Primary - Main CTAs
<Button variant="primary">Find Your PG</Button>
// → Green background, white text, shadow

// Secondary - Alternative actions
<Button variant="secondary">View Details</Button>
// → Gray surface, border, no shadow

// Outline - Tertiary actions
<Button variant="outline">Learn More</Button>
// → Transparent, green border

// Ghost - Subtle actions
<Button variant="ghost">Cancel</Button>
// → Transparent, hover effect only
```

**Sizes:**
- `sm`: 40px height (compact lists)
- `md`: 48px height (forms, cards)
- `lg`: 56px height (hero CTAs)

### 2. Card Component

**Structure:**
```tsx
<Card hoverable elevated>
  {/* Image or visual header */}
  <div className="h-56 bg-gradient-to-br from-gray-700 to-gray-800">
    {/* Visual content */}
  </div>
  
  {/* Content padding */}
  <div className="p-6">
    {/* Title, metadata, actions */}
  </div>
</Card>
```

**Props:**
- `elevated`: Slightly lighter background
- `hoverable`: Lift animation on hover (-translate-y-1)

### 3. Badge Component

**Use Cases:**
```tsx
// Verified status - most important
<Badge variant="verified" icon={<VerifiedIcon />}>
  Verified PG
</Badge>

// Premium features
<Badge variant="premium">Premium</Badge>

// New listings
<Badge variant="new">Just Listed</Badge>

// General tags
<Badge variant="default">WiFi Available</Badge>
```

### 4. Rating Component

**Configuration:**
```tsx
<Rating 
  rating={4.7}           // Decimal support
  maxRating={5}          // Usually 5 stars
  size="md"              // sm | md | lg
  showValue={true}       // Display number
/>
```

**Visual Details:**
- Filled stars: `text-trust-500`
- Empty stars: `text-gray-700`
- Partial fill for decimals (4.7 shows 4 full + 0.7 partial)

### 5. Input Component

**Structure:**
```tsx
<Input
  type="text"
  label="Location"
  placeholder="Enter city or area..."
  icon={<SearchIcon />}
  error="Please enter a valid location"
/>
```

**States:**
- Default: `border-gray-700`
- Focus: `ring-2 ring-trust-500`
- Error: `border-red-500`
- Disabled: `opacity-50 cursor-not-allowed`

---

## 📐 Layout Patterns

### Container System
```tsx
// Standard container with responsive padding
<div className="container-custom">
  {/* max-w-7xl + responsive padding */}
</div>

// Section spacing
<section className="section-padding">
  {/* py-12 md:py-20 lg:py-24 */}
</section>
```

### Grid Layouts

**Responsive Card Grid:**
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

**Dashboard Layout:**
```tsx
<div className="grid lg:grid-cols-12 gap-8">
  <aside className="lg:col-span-3">{/* Sidebar */}</aside>
  <main className="lg:col-span-9">{/* Main content */}</main>
</div>
```

### Sticky Navigation
```tsx
<nav className="sticky top-0 z-50 backdrop-blur-xl bg-dark-900/80">
  {/* Frosted glass effect with blur */}
</nav>
```

---

## ✨ Interactions & Animations

### Hover Effects

**Cards:**
```css
.card-hoverable {
  transition: all 200ms ease-in-out;
  &:hover {
    transform: translateY(-4px);
    box-shadow: card-hover;
    border-color: gray-700;
  }
}
```

**Buttons:**
```css
.btn-transition {
  transition: all 200ms ease-in-out;
  &:hover {
    transform: scale(1.02);
    box-shadow: lg;
  }
}
```

### Micro-interactions

**Loading States:**
```tsx
<Button disabled={loading}>
  {loading ? <Spinner /> : 'Submit'}
</Button>
```

**Success Feedback:**
```tsx
// Green check animation on save
<CheckIcon className="w-5 h-5 text-trust-400 animate-scale-in" />
```

**Slide-in Animations:**
```tsx
// For page entries
<div className="animate-slide-up">
  {/* Content fades in + slides up */}
</div>
```

---

## 📄 Page-by-Page Breakdown

### 1. Landing Page

**Section Structure:**
```
1. Navigation (Sticky)
   ├─ Logo + Brand
   ├─ Main Links (Find PG, Roommates, Food)
   └─ Auth Buttons (Sign In, Get Started)

2. Hero Section
   ├─ Trust Badge (50k+ students)
   ├─ Value Prop Headline (Find Your Perfect Student Home)
   ├─ Supporting Copy (Verified PGs, Roommate Matching, Mess Food)
   ├─ Search Bar (Primary action)
   └─ Quick City Links

3. Trust Indicators (Stats Bar)
   ├─ 50K+ Verified Students
   ├─ 10K+ Verified PGs
   ├─ 95% Match Success
   └─ 25+ Cities

4. Features Grid (3 Cards)
   ├─ Verified PGs (Shield icon, physical verification)
   ├─ Smart Matching (Users icon, AI compatibility)
   └─ Quality Food (Food icon, hygiene ratings)

5. Social Proof (Testimonials)
   ├─ 3 Student Reviews
   ├─ Rating Stars
   ├─ Verified Badges
   └─ Real Names + Roles

6. Final CTA (Gradient Card)
   ├─ Headline + Supporting Text
   └─ Dual CTAs (Get Started / View Listings)

7. Footer
   ├─ Logo + Tagline
   ├─ Link Columns (Students, Company, Support)
   └─ Copyright
```

**Key Design Decisions:**
- Search bar is FIRST action (remove friction)
- Trust signals appear 3 times (nav badge, stats, testimonials)
- No pricing on landing (focus on value, not cost)
- City quick links reduce cognitive load
- Gradient backgrounds only for emphasis (CTA section)

### 2. PG Listing Page

**Layout:**
```
Sticky Header:
├─ Title + Breadcrumb
├─ Search Bar
└─ Active Filters (Pills)

Main Grid:
├─ Sidebar (Filters)
│  ├─ Budget Range
│  ├─ Room Type
│  ├─ Amenities
│  └─ Food Preference
│
└─ Listings (2 columns)
   └─ PG Card:
      ├─ Image with badges
      ├─ Name + Location
      ├─ Rating
      ├─ Quality Indicators (Food, Safety)
      ├─ Highlights (3 tags)
      ├─ Room Types
      └─ Actions (View / Contact)
```

**PG Card Anatomy:**
```tsx
<Card hoverable>
  {/* Image Section (224px height) */}
  <div className="relative h-56">
    <Image />
    <Badge variant="verified" position="top-left" />
    <HeartButton position="top-right" />
    <PriceTag position="bottom-left" />
  </div>

  {/* Content Section */}
  <div className="p-6">
    {/* Title + Location */}
    <h3 className="text-xl font-bold">PG Name</h3>
    <Location icon + text />
    
    {/* Rating */}
    <Rating + Review Count />
    
    {/* Quality Grid (2x2) */}
    <div className="grid grid-cols-2 gap-3">
      <QualityCard type="food" score={4.5} />
      <QualityCard type="safety" score={9.1} />
    </div>
    
    {/* Tags */}
    <Tags limit={3} />
    
    {/* Room Types */}
    <RoomTypeChips />
    
    {/* Actions */}
    <ButtonGroup />
  </div>
</Card>
```

**Quality Indicators Design:**
- Small cards within main card
- Icon + Label + Large Score
- Color-coded (green = good, yellow = okay)
- Hygiene sub-score for food

### 3. Roommate Matching Page

**Unique Elements:**

**Compatibility Badge:**
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 
     rounded-xl border bg-trust-500/10 border-trust-500/20">
  <SparklesIcon />
  <span className="text-2xl font-bold">94%</span>
  <span className="text-sm">Match</span>
</div>
```

**Lifestyle Highlights:**
- Icon-based chips (Clock, Sparkles, Users)
- Color-coded by category
- Scannable at a glance

**Profile Card Structure:**
```
Avatar Section:
├─ 80px circular gradient avatar with initials
├─ Verified badge overlay (bottom-right)
└─ Name + Age + Gender

Compatibility:
└─ Large % badge with sparkle icon

Bio:
└─ 2-3 sentence description

Lifestyle Chips (3 key traits):
├─ Sleep schedule
├─ Cleanliness level
└─ Social preference

Preferences (Checklist):
├─ Smoking/drinking status
├─ Food habits
└─ Work location

Looking For:
├─ Budget range
├─ Preferred areas
└─ Move-in date

Actions:
├─ View Full Profile (Secondary)
└─ Connect (Primary)
```

**Matching Algorithm Transparency:**
- Show matched factors ("You both are early birds")
- Explain compatibility score
- Filter by lifestyle preferences

### 4. Mess Discovery Page

**Menu Card Design:**
```tsx
<MessCard>
  {/* Header */}
  <div className="flex items-start gap-4">
    <FoodIcon 64px />
    <TitleSection>
      <Name />
      <Location />
      <VerifiedBadge />
    </TitleSection>
    <HeartButton />
  </div>

  {/* Rating + Hygiene */}
  <div className="flex gap-6">
    <Rating stars={4.6} reviews={342} />
    <Divider />
    <HygieneScore value={9.2} />
  </div>

  {/* Cuisine Tags */}
  <Tags list={['South Indian', 'North Indian']} />

  {/* Pricing (Side by side) */}
  <PricingGrid>
    <Monthly value={4500} />
    <PerMeal value={60} />
  </PricingGrid>

  {/* Timings Table */}
  <TimingsTable>
    Breakfast: 7:00 AM - 9:30 AM
    Lunch: 12:00 PM - 2:30 PM
    Dinner: 7:00 PM - 9:30 PM
  </TimingsTable>

  {/* Expandable Menu */}
  <MenuToggle>
    {showMenu && (
      <WeeklyMenu days={['Monday', 'Tuesday']} />
    )}
  </MenuToggle>

  {/* Actions */}
  <ButtonGroup />
</MessCard>
```

**Daily Menu Layout:**
```tsx
<DayCard day="Monday">
  <MealRow label="Breakfast">
    Idli, Vada, Sambar, Chutney, Coffee/Tea
  </MealRow>
  <MealRow label="Lunch">
    Rice, Dal, Veg Curry, Chapati, Curd, Salad
  </MealRow>
  <MealRow label="Dinner">
    Rice, Sambar, Rasam, Dry Veg, Chapati, Sweet
  </MealRow>
</DayCard>
```

**Trust Section:**
- Verification promise card at top
- Kitchen inspection checklist
- Quality check badges
- Student review transparency

### 5. Dashboard Page

**Layout Structure:**
```
Header:
├─ Welcome Message
├─ Profile Completion CTA
└─ Quick Stats (4 Cards)
   ├─ Saved PGs
   ├─ Matches
   ├─ Subscriptions
   └─ Verified Views

Main Grid (8/4 split):
├─ Main Content (8 cols)
│  ├─ Tabs (Saved, Matches, Subscriptions)
│  └─ Tab Content (Grid or List)
│
└─ Sidebar (4 cols)
   ├─ Profile Completion Card
   ├─ Recommendations
   └─ Quick Actions
```

**Profile Completion Card:**
```tsx
<Card gradient="trust">
  <Header icon={SparklesIcon} title="Complete Profile" />
  
  <ProgressBar percentage={70} completed={7} total={10} />
  
  <Checklist>
    <Item checked>Basic info added</Item>
    <Item checked>Preferences set</Item>
    <Item unchecked>Add profile photo</Item>
  </Checklist>
  
  <Button primary fullWidth>Complete Now</Button>
</Card>
```

**Saved PG Compact Card:**
- Smaller image (160px height)
- Name + Location
- Price (prominent)
- Single CTA (View)
- Heart icon (filled red)

**Match Status Cards:**
- Avatar + Name
- Compatibility %
- Matched factors (2 chips)
- Status badge (Pending/Accepted)
- Accept/Decline or Message CTA

---

## 🚀 Implementation Guidelines

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### File Structure
```
src/
├── components/
│   ├── ui/              # Design system components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Rating.tsx
│   │   └── Icons.tsx
│   │
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   └── features/        # Feature-specific
│       ├── PGCard.tsx
│       ├── RoommateCard.tsx
│       └── MessCard.tsx
│
├── pages/               # Route pages
│   ├── LandingPage.tsx
│   ├── PGListingPage.tsx
│   ├── RoommateMatchingPage.tsx
│   ├── MessDiscoveryPage.tsx
│   └── DashboardPage.tsx
│
├── types/               # TypeScript definitions
│   └── index.ts
│
└── styles/              # Global styles
    └── globals.css
```

### Component Usage Example

```tsx
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { VerifiedIcon } from '@/components/ui/Icons';

function MyPage() {
  return (
    <div className="container-custom section-padding">
      <Card hoverable elevated>
        <Badge variant="verified" icon={<VerifiedIcon />}>
          Verified
        </Badge>
        <h2 className="text-2xl font-bold mb-4">Card Title</h2>
        <p className="text-gray-300 mb-6">Card content...</p>
        <Button variant="primary" fullWidth>
          Take Action
        </Button>
      </Card>
    </div>
  );
}
```

---

## 📱 Responsive Behavior

### Breakpoints
```css
sm:  640px  (Mobile landscape)
md:  768px  (Tablet portrait)
lg:  1024px (Tablet landscape)
xl:  1280px (Desktop)
```

### Mobile Optimizations

**Navigation:**
- Hamburger menu on mobile
- Fixed bottom action bar for CTAs
- Swipeable cards on mobile

**Card Grids:**
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop

**Filters:**
- Hidden by default on mobile
- Slide-in panel when activated
- Floating filter button

**Forms:**
- Full-width inputs
- Larger touch targets (48px minimum)
- Thumb-reachable CTAs

---

## 🎯 Trust & Safety Design

### Verification Indicators
1. **Verified Badge** - Green checkmark, subtle glow
2. **Physical Verification** - "Inspected by our team" text
3. **Response Rate** - Owner reliability metric
4. **Real Reviews** - Student names + verified badge

### Safety Scores
- **Area Safety**: 1-10 score with breakdown
- **Hygiene Rating**: 1-10 for food quality
- **Factors Visible**: Night safety, transport, policing

### Transparency
- No hidden fees
- Clear deposit amounts
- Honest pricing (rent + deposit upfront)
- Real photos (no stock images)

---

## 🎨 Design Tokens Reference

```css
/* Spacing Scale */
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-6:  24px
--space-8:  32px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px

/* Border Radius */
--radius-md:  8px
--radius-lg:  12px
--radius-xl:  16px
--radius-2xl: 24px
--radius-3xl: 32px

/* Shadows */
--shadow-card:       0 4px 6px rgba(0,0,0,0.3)
--shadow-card-hover: 0 10px 15px rgba(0,0,0,0.4)
--shadow-glow-sm:    0 0 10px rgba(34,197,94,0.15)

/* Transitions */
--transition-fast:   150ms ease-in-out
--transition-base:   200ms ease-in-out
--transition-slow:   300ms ease-in-out
```

---

## ✅ Design Checklist

### Before Shipping
- [ ] All interactive elements have hover states
- [ ] Focus rings visible for keyboard navigation
- [ ] Loading states for async actions
- [ ] Error states for forms
- [ ] Empty states for lists
- [ ] Success feedback for submissions
- [ ] Mobile touch targets ≥ 48px
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Images have alt text
- [ ] Verified badges on all trusted content

---

## 🎯 Investor Pitch Highlights

**Why This Design Works:**

1. **Trust-First**: Verification badges, hygiene scores, safety ratings everywhere
2. **Data-Driven**: Compatibility scores, quality metrics, transparent pricing
3. **Student-Focused**: Not luxury, not cheap - premium middle ground
4. **Scalable**: Component system ready for feature expansion
5. **Modern Stack**: React + TypeScript + Tailwind (industry standard)
6. **Mobile-Ready**: Touch-optimized, fast, installable as PWA

**Differentiation:**
- Unlike competitors (99acres, NoBroker), we're student-specific
- Roommate matching is AI-powered, not just filters
- Food quality as first-class feature (other platforms ignore this)
- Dark theme = premium positioning

---

**This design system is production-ready and investor-grade. Every component is built with scalability, accessibility, and user trust in mind.**
