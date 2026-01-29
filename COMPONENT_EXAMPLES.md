# 🎨 Component Examples & Usage Guide

## Quick Reference for Building New Features

### 1. Building a New Card Feature

```tsx
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { VerifiedIcon, LocationIcon } from '@/components/ui/Icons';

function FeatureCard() {
  return (
    <Card hoverable elevated className="overflow-hidden">
      {/* Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800">
        <Badge 
          variant="verified" 
          icon={<VerifiedIcon className="w-4 h-4" />}
          className="absolute top-3 left-3"
        >
          Verified
        </Badge>
        <div className="absolute bottom-3 left-3">
          <span className="text-2xl font-bold text-trust-400">₹12,000</span>
          <span className="text-gray-400 text-sm">/month</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">Feature Title</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <LocationIcon className="w-4 h-4" />
          <span>Location details</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-300">
            Tag 1
          </span>
          <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-300">
            Tag 2
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" size="sm" fullWidth>
            Secondary
          </Button>
          <Button variant="primary" size="sm" fullWidth>
            Primary
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

---

## 2. Creating a Search + Filter Section

```tsx
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { SearchIcon, FilterIcon } from '@/components/ui/Icons';

function SearchSection() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-xl sticky top-0 z-40">
      <div className="container-custom py-6">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">Page Title</h1>
          <p className="text-gray-400">Supporting description</p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<SearchIcon />}
            />
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <FilterIcon className="w-5 h-5" />
            Filters
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Verified', 'Budget-Friendly', 'Premium'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeFilter === filter.toLowerCase()
                  ? 'bg-trust-500/10 text-trust-400 border border-trust-500/20'
                  : 'bg-surface hover:bg-surface-hover text-gray-300 border border-gray-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Sidebar Filter Panel

```tsx
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

function FilterSidebar() {
  return (
    <Card className="p-6 sticky top-32">
      <h3 className="font-bold mb-4">Filters</h3>

      {/* Budget Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Budget (per month)
        </label>
        <div className="space-y-2">
          {['Under ₹8,000', '₹8,000 - ₹12,000', '₹12,000+'].map((range) => (
            <label key={range} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-700 bg-surface" 
              />
              <span className="text-sm text-gray-300">{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Category
        </label>
        <div className="space-y-2">
          {['Option 1', 'Option 2', 'Option 3'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="category" 
                className="w-4 h-4 border-gray-700 bg-surface" 
              />
              <span className="text-sm text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <Button variant="primary" size="sm" fullWidth>
        Apply Filters
      </Button>
    </Card>
  );
}
```

---

## 4. Profile/Stats Card

```tsx
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { VerifiedIcon, CheckIcon } from '@/components/ui/Icons';

function ProfileCard() {
  return (
    <Card className="p-6">
      {/* Avatar + Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            AB
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-dark-900 rounded-full flex items-center justify-center">
            <VerifiedIcon className="w-4 h-4 text-trust-400" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-100 mb-1">Name</h3>
          <p className="text-sm text-gray-400">Role or description</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-elevated rounded-lg p-3 border border-gray-800">
          <div className="text-2xl font-bold text-trust-400 mb-1">50+</div>
          <div className="text-xs text-gray-400">Stat Label</div>
        </div>
        <div className="bg-surface-elevated rounded-lg p-3 border border-gray-800">
          <div className="text-2xl font-bold text-trust-400 mb-1">95%</div>
          <div className="text-xs text-gray-400">Stat Label</div>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <CheckIcon className="w-4 h-4 text-trust-400" />
          <span>Completed item</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-700 rounded"></div>
          <span>Pending item</span>
        </div>
      </div>

      {/* Action */}
      <Button variant="primary" fullWidth>
        Primary Action
      </Button>
    </Card>
  );
}
```

---

## 5. Info Banner / Alert

```tsx
import Card from '@/components/ui/Card';
import { SparklesIcon, CheckIcon, ShieldIcon } from '@/components/ui/Icons';

// Success Banner
function SuccessBanner() {
  return (
    <Card className="p-4 bg-trust-500/5 border-trust-500/20">
      <div className="flex items-start gap-3">
        <SparklesIcon className="w-5 h-5 text-trust-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-trust-400 mb-1">Success Title</h4>
          <p className="text-sm text-gray-300">
            Success message or helpful information goes here.
          </p>
        </div>
      </div>
    </Card>
  );
}

// Trust Indicator Banner
function TrustBanner() {
  return (
    <Card className="p-6 bg-gradient-to-r from-trust-500/5 to-emerald-500/5 border-trust-500/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldIcon className="w-6 h-6 text-trust-400" />
        </div>
        <div>
          <h3 className="font-bold text-trust-400 mb-2">Trust Headline</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Explanation of trust features or verification process.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckIcon className="w-4 h-4 text-trust-400" />
              <span>Feature 1</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <CheckIcon className="w-4 h-4 text-trust-400" />
              <span>Feature 2</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

---

## 6. Grid Layout with Sidebar

```tsx
function PageLayout() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Sticky Header */}
      <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold">Page Title</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar (3 columns on large screens) */}
          <aside className="lg:col-span-3">
            <FilterSidebar />
          </aside>

          {/* Main Content (9 columns on large screens) */}
          <main className="lg:col-span-9">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Content cards */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Tabbed Interface

```tsx
function TabbedSection() {
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = [
    { id: 'tab1', label: 'Tab 1', count: 5 },
    { id: 'tab2', label: 'Tab 2', count: 3 },
    { id: 'tab3', label: 'Tab 3', count: 8 },
  ];

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? 'text-trust-400 border-b-2 border-trust-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'tab1' && <div>Tab 1 Content</div>}
        {activeTab === 'tab2' && <div>Tab 2 Content</div>}
        {activeTab === 'tab3' && <div>Tab 3 Content</div>}
      </div>
    </div>
  );
}
```

---

## 8. Empty State

```tsx
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { HeartIcon } from '@/components/ui/Icons';

function EmptyState() {
  return (
    <Card className="p-12 text-center bg-surface-elevated border-gray-800">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <HeartIcon className="w-8 h-8 text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-300 mb-2">
        No items yet
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Get started by exploring our listings and saving your favorites.
      </p>
      <Button variant="primary">
        Explore Now
      </Button>
    </Card>
  );
}
```

---

## 9. Loading Skeleton

```tsx
function SkeletonCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-800"></div>
      
      {/* Content Skeleton */}
      <div className="p-6">
        <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-800 rounded mb-4 w-1/2"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-8 bg-gray-800 rounded w-16"></div>
          <div className="h-8 bg-gray-800 rounded w-16"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-800 rounded flex-1"></div>
          <div className="h-10 bg-gray-800 rounded flex-1"></div>
        </div>
      </div>
    </Card>
  );
}
```

---

## 10. Modal/Dialog Pattern

```tsx
function Modal({ isOpen, onClose, children }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <Card className="relative z-10 max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-surface hover:bg-surface-hover flex items-center justify-center transition"
          >
            ✕
          </button>

          {children}
        </div>
      </Card>
    </div>
  );
}

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
        <p className="text-gray-300 mb-6">Modal content goes here...</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" fullWidth>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

---

## 🎨 Color Usage Examples

```tsx
// Backgrounds
className="bg-dark-900"           // Page background
className="bg-surface"            // Card default
className="bg-surface-elevated"   // Raised elements
className="bg-surface-hover"      // Hover state

// Trust/Primary
className="bg-trust-500"          // Solid green (buttons)
className="bg-trust-500/10"       // 10% opacity (verified badges)
className="text-trust-400"        // Green text
className="border-trust-500/20"   // Green border

// Text
className="text-gray-50"          // Headings
className="text-gray-300"         // Body
className="text-gray-400"         // Secondary
className="text-gray-500"         // Placeholder

// Borders
className="border-gray-800"       // Default
className="border-gray-700"       // Interactive
```

---

## 📏 Spacing Examples

```tsx
// Padding
className="p-4"     // 16px all sides
className="p-6"     // 24px all sides
className="px-4 py-2"  // 16px horizontal, 8px vertical

// Margin
className="mb-4"    // 16px bottom
className="mb-6"    // 24px bottom
className="gap-3"   // 12px gap in flex/grid

// Section spacing
className="section-padding"  // py-12 md:py-20 lg:py-24
```

---

## 🎯 Common Patterns

### Image with Overlay
```tsx
<div className="relative h-48">
  <img src="..." className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
  <div className="absolute bottom-4 left-4 text-white">
    <h3>Overlay Content</h3>
  </div>
</div>
```

### Horizontal Scroll Container
```tsx
<div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
  {items.map(item => (
    <div key={item.id} className="flex-shrink-0 w-72">
      <Card>{/* Item content */}</Card>
    </div>
  ))}
</div>
```

### Sticky CTA Bar (Mobile)
```tsx
<div className="fixed bottom-0 left-0 right-0 p-4 bg-dark-900 border-t border-gray-800 md:hidden">
  <Button variant="primary" fullWidth>
    Take Action
  </Button>
</div>
```

---

## ✅ Best Practices

1. **Always use Tailwind classes** (avoid inline styles)
2. **Use the design system components** (Button, Card, Badge, etc.)
3. **Maintain spacing consistency** (multiples of 4px)
4. **Add hover states** to interactive elements
5. **Include loading states** for async operations
6. **Show empty states** when no data
7. **Use verified badges** for trust elements
8. **Make CTAs prominent** with primary buttons
9. **Test on mobile** (80%+ traffic will be mobile)
10. **Keep text contrast high** (WCAG AA minimum)

---

**These patterns cover 90% of common UI needs. Mix and match components to build new features quickly!**
