# 🔍 How to Test the PG Proof, Reviews & Owner Interaction System

**Dev Server Running:** http://localhost:3000  
**Status:** ✅ Ready to test

---

## 📋 Step-by-Step Testing Guide

### **PHASE 1: Media Gallery (Proof System)**

#### Step 1: Open Developer Console
```
1. Open http://localhost:3000 in browser
2. Press F12 (or Ctrl+Shift+I on Windows/Linux)
3. Open Console tab
4. No errors should show
```

#### Step 2: Test Media Gallery Component
Create a test file to see the media gallery:

**In browser console, run:**
```javascript
// Check if mock data is loaded
console.log('Testing Media Gallery...')

// You'll see the photos gallery in action
// The component is located at: src/components/PGMediaGallery.tsx
```

#### Step 3: Visual Elements to Check
Look for:
- ✅ **Verified Media Badge** (green badge saying "✓ Verified Media")
- ✅ **Filter Tabs** (tabs for "All", "Photos", "Videos")
- ✅ **Category Colors** (colored badges for room/washroom/common-area/food)
- ✅ **Grid Layout** (2-3 column grid on desktop, 1 column on mobile)
- ✅ **Lazy Loading** (images load as you scroll)

#### Step 4: Click an Image
```
1. Hover over any photo in the gallery
2. See the "✓ Verified" overlay
3. Click the image
4. A modal should open with:
   - Full-size image
   - Title and description
   - Category badge
   - Verified status
   - Upload date
   - Close button
```

---

### **PHASE 2: Student Reviews (Credibility System)**

#### Step 5: Test Reviews Component
Look for:

**Rating Summary at Top:**
```
Average Rating: 4.8 ★
Total Reviews: 5 reviews

Rating Breakdown:
⭐⭐⭐⭐⭐  5★ (3 reviews)
⭐⭐⭐⭐☆  4★ (1 review)
⭐⭐⭐☆☆  3★ (1 review)
```

#### Step 6: Test Review Sorting
```
1. Find the dropdown that says "Most Recent"
2. Click it
3. See options:
   ✓ Most Recent
   ✓ Most Helpful
   ✓ Highest Rating
4. Switch between them
5. Reviews should reorder
```

#### Step 7: Read Individual Reviews
For each review, you should see:
```
User Avatar (colored circle with first letter)
├─ User Name (e.g., "Rahul Kumar")
├─ ✓ Verified Stay badge
├─ Rating (5 stars)
├─ "Stayed X months" tag
├─ Review Title
├─ Review Description
├─ Aspect Ratings:
│  ├─ Cleanliness: 5/5 (green)
│  ├─ Food Quality: 4/5 (green)
│  ├─ Owner Behavior: 5/5 (green)
│  └─ Maintenance: 5/5 (green)
└─ 👍 Helpful (24) | 👎 (2)
```

#### Step 8: Test Expandable Reviews
```
1. Find a long review
2. Click "Show More"
3. Full text should expand
4. Click "Show Less"
5. Text collapses again
```

---

### **PHASE 3: Owner Contact & Scheduling (Distance Logic)**

#### Step 9: Test Contact CTA Buttons
Look for two buttons:

**Button 1: Video Call**
```
📱 Video Call
├─ Always available
├─ For any user anywhere
└─ Click to schedule
```

**Button 2: Physical Visit**
```
🏠 Physical Visit
├─ Available only if nearby (<50km)
├─ Greyed out if far away
└─ Click to schedule
```

#### Step 10: Schedule a Video Call
```
1. Click "Video Call" button
2. A form should appear with:
   - Date picker (shows tomorrow onwards)
   - Time dropdown (9 AM to 5 PM slots)
3. Select any date and time
4. Click "Confirm"
5. Success message should show:
   ✓ Video call scheduled!
   [Date] at [Time]
```

#### Step 11: Check Trust Indicators
In the contact section, you should see:
```
✓ Verified owner identity
✓ Real student reviews
✓ Media verified by admins
✓ Secure communication
```

#### Step 12: Read Safety Disclaimer
```
💡 Tip: Always video call or visit in person 
   before booking. Never share sensitive 
   information over phone.
```

---

## 🎯 Component Location in Code

### To View the Components:

**1. Media Gallery**
```
File: src/components/PGMediaGallery.tsx
Lines: 1-250
Features:
  - Lazy loading images
  - Filter by photo/video
  - Modal detail view
  - Verified badge
```

**2. Reviews**
```
File: src/components/PGReviews.tsx
Lines: 1-350
Features:
  - Rating distribution
  - Aspect scoring
  - Sort functionality
  - Expandable text
```

**3. Owner Contact**
```
File: src/components/OwnerContactCTA.tsx
Lines: 1-300
Features:
  - Distance awareness
  - Scheduling form
  - Date/time picker
  - Confirmation modal
```

**4. Full Page**
```
File: src/components/PGDetails.tsx
Lines: 1-280
Features:
  - Tab navigation
  - All 3 components combined
  - Floating action button
```

---

## 📊 Test Data Available

### PG 1 (pg-1): Skyrise Apartments
**Media:**
- 4 items (3 verified photos, 1 video)
- Room photos, bathroom, common area

**Reviews:**
- 5 reviews with 4.8 ★ average
- All verified stays
- 8-10 month stay durations
- Aspect ratings included

### PG 2 (pg-2): BombayBliss
**Media:**
- 2 items (2 verified)

**Reviews:**
- 1 review with 3.0 ★

### PG 3 (pg-3): Garden Vista
**Media:**
- 1 item (1 verified)

**Reviews:**
- 1 review with 4.0 ★

---

## 🖥️ How to View Each Component

### Option 1: Use Browser DevTools
```
1. Open http://localhost:3000
2. Press F12
3. Check Console for any errors
4. All components load automatically
```

### Option 2: Check Source Code
```
1. Open src/components/ folder
2. Read component files:
   - PGMediaGallery.tsx
   - PGReviews.tsx
   - OwnerContactCTA.tsx
   - PGDetails.tsx
```

### Option 3: Import & Test Locally
Create a test page:
```tsx
import { PGDetails } from './components/PGDetails'

export function TestPage() {
  return <PGDetails pgId="pg-1" />
}
```

---

## ✅ Testing Checklist

### Media Gallery ✓
- [ ] Images display in grid
- [ ] Verified badges show
- [ ] Filter tabs work (All/Photos/Videos)
- [ ] Category colors appear
- [ ] Click opens modal
- [ ] Modal shows full image
- [ ] Close button works
- [ ] Lazy loading active

### Reviews ✓
- [ ] Rating summary shows
- [ ] Histogram displays
- [ ] Average rating correct (4.8)
- [ ] Sort dropdown works
- [ ] Reviews list updates when sorted
- [ ] User avatars show
- [ ] Verified badges appear
- [ ] Aspect ratings display (4 dimensions)
- [ ] Expandable text works
- [ ] Helpful/unhelpful counters show

### Owner Contact ✓
- [ ] Video Call button visible
- [ ] Physical Visit button visible
- [ ] Date picker works
- [ ] Time dropdown populated
- [ ] Can submit form
- [ ] Success message appears
- [ ] Trust indicators display
- [ ] Safety disclaimer shows

### Full Page ✓
- [ ] 4 tabs visible (Overview/Media/Reviews/Owner)
- [ ] Clicking tabs switches content
- [ ] All components render
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Floating button visible

---

## 🐛 Troubleshooting

### Images Not Loading
```
✓ Check browser console (F12)
✓ Look for image URL errors
✓ Verify Unsplash URLs are accessible
✓ Try different browser
```

### Reviews Not Showing
```
✓ Check pgId matches mockData
✓ Verify studentReviews array populated
✓ Open Console tab in DevTools
✓ Should see no errors
```

### Buttons Not Clickable
```
✓ Check Tailwind CSS loaded
✓ Inspect element styling
✓ Verify onClick handlers attached
✓ Try refreshing page (Ctrl+R)
```

### Styling Broken
```
✓ Clear browser cache (Ctrl+Shift+Del)
✓ Hard refresh: Ctrl+Shift+R
✓ Check if Tailwind CSS loaded
✓ Look for CSS errors in Console
```

---

## 🚀 Quick Navigation

### To Test Each Feature:

**Media Proof:**
- Go to any PG page
- Click "Media & Proof" tab
- See gallery grid
- Click images to view

**Reviews:**
- Click "Reviews" tab
- See rating summary
- Read student experiences
- Switch sort order

**Owner Contact:**
- Click "Contact Owner" tab
- Try scheduling video call
- See success confirmation
- Check trust badges

---

## 📱 Mobile Testing

To test on mobile:
```
1. Open http://localhost:3000 on your phone
   (same WiFi network)
   
2. Or use Chrome DevTools:
   - F12 → Click phone icon (top-left)
   - Select device: iPhone 12, Samsung, etc.
   - See responsive layout
```

Check for:
- ✓ Single column layout
- ✓ Touch-friendly buttons
- ✓ Readable text size
- ✓ Image proportions correct
- ✓ No horizontal scroll

---

## 🎥 What You'll See

### When Everything Works:

**Media Tab:**
```
[Verified Media (7)]

[Photo Grid: 2-3 columns]
[✓ Verified badges]
[Category colors]

[Click image]
[Modal with full image]
```

**Reviews Tab:**
```
[4.8 ★ · 5 reviews]

[Rating Histogram]
[⭐ Distribution bars]

[Sort: Recent/Helpful/Rating]

[Review Cards]
[✓ Verified Stay]
[5 stars] [Stayed 8 months]
[Aspect ratings shown]
[👍 Helpful counters]
```

**Owner Tab:**
```
[Meet Rajesh Kumar]

[📱 Video Call] [🏠 Physical Visit]

[Schedule form appears]
[Date picker] [Time slots]

[✓ Scheduled successfully!]

[Trust indicators]
[✓ Verified owner]
[✓ Real reviews]
```

---

## 💡 Pro Tips for Testing

1. **Open Console First**
   - Press F12
   - Watch for any errors
   - All should be green ✓

2. **Test on Different Breakpoints**
   - Desktop (full width)
   - Tablet (medium)
   - Mobile (small)

3. **Slow Network Simulation**
   - DevTools → Network tab
   - Set to "Slow 3G"
   - See lazy loading in action

4. **Check Images**
   - Right-click image → Open in new tab
   - Should load from Unsplash
   - Verify sizes are optimized

5. **Test All Interactions**
   - Click every button
   - Fill every form
   - Sort every dropdown

---

## ✨ Success Signs

You'll know it's working when you see:

✅ Images load smoothly  
✅ Verified badges appear in green  
✅ Reviews show realistic data  
✅ Sorting changes order  
✅ Scheduling form submits  
✅ Success message shows  
✅ No console errors  
✅ Mobile layout responsive  

---

## 🎯 Next Steps After Testing

1. ✓ Verify all features work
2. ✓ Check mobile responsiveness
3. ✓ Review trust indicators
4. ✓ Test scheduling form
5. ✓ Confirm no console errors

Then:
- Integrate into your pages
- Connect to real database
- Add image hosting
- Deploy!

---

**Dev Server:** http://localhost:3000  
**Status:** ✅ Running  
**Components:** ✅ Ready  
**Data:** ✅ Loaded  

**Start testing now!** 🚀
