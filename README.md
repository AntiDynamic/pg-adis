# PG Living Platform - MVP Design System

## 🎯 Product Vision
A premium PG & student-living platform for India that builds trust through verification, matches roommates by lifestyle compatibility, and helps students thrive in new cities.

## 🎨 Design Philosophy
- **Trust First**: Dark premium aesthetic that signals reliability
- **Student-Centric**: Built for Indian PG students, not luxury seekers
- **Smart Matching**: Data-driven compatibility over superficial filters
- **Clarity Over Clutter**: Every element serves a purpose

## 🚀 Tech Stack
- React 18 + TypeScript
- Tailwind CSS (JIT mode)
- Component-based architecture
- Mobile-first, desktop polished

## 📦 Project Structure
```
src/
├── components/
│   ├── ui/           # Reusable design system components
│   ├── layout/       # Layout components (Header, Footer)
│   └── features/     # Feature-specific components
├── pages/            # Route pages
├── styles/           # Global styles & Tailwind config
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```

## 🎨 Design System

### Colors
- **Background**: Gray-900 to Black
- **Primary**: Emerald-500 (trust green)
- **Accent**: Emerald-400 (lighter interactions)
- **Text**: Gray-50 (primary), Gray-400 (secondary)
- **Surface**: Gray-800 (cards), Gray-700 (elevated)
- **Border**: Gray-700 with subtle glow

### Typography
- **Headings**: Inter (700-800 weight)
- **Body**: Inter (400-500 weight)
- **Accent**: Inter (600 weight)

### Spacing Scale
- Base: 4px
- Components: 16-24px padding
- Sections: 48-96px margins

### Shadows & Effects
- Soft shadows on cards
- Subtle green glow on verified badges
- Smooth transitions (200-300ms)

## 📄 Pages

### 1. Landing Page
- Hero with clear value prop
- Trust indicators
- Student testimonials
- Primary CTA flow

### 2. PG Listing
- Verified badges
- Food quality scores
- Area safety indicators
- Transparent pricing

### 3. Roommate Matching
- Compatibility scores
- Lifestyle filters
- Honest profiles

### 4. Mess Discovery
- Daily menus
- Hygiene ratings
- Student reviews

### 5. Dashboard
- Saved items
- Active matches
- Subscription status

## 🔧 Getting Started

```bash
npm install
npm run dev
```

## 🎯 MVP Priorities
1. Trust & Safety signals everywhere
2. Fast, intuitive filtering
3. Mobile-first interactions
4. Clear information hierarchy
