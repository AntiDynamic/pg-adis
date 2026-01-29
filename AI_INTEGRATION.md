# AI Integration Guide (Gemini)
## For Future Implementation

This document outlines how to integrate Google Gemini AI into the PG Finder application **after the core features are working**.

## ⚠️ Important: AI is NOT for Location Data

**AI should NEVER be used for:**
- ❌ Fetching PG locations
- ❌ Finding university coordinates
- ❌ Scraping map data
- ❌ Generating location information

**All location data must come from:**
- ✅ OpenStreetMap API
- ✅ Manual data entry with verification
- ✅ Existing databases with real coordinates

## ✅ Valid AI Use Cases

### 1. PG Recommendation Explanations

**Purpose:** Help students understand why a PG is recommended

**Example Prompt:**
```typescript
const prompt = `
You are a helpful housing advisor for Indian students. 

PG Details:
- Name: ${pg.name}
- Location: ${pg.distance}km from ${university.name}
- Rent: ₹${pg.rent}/month
- Rating: ${pg.rating}/5
- Amenities: ${pg.amenities.join(', ')}
- Gender: ${pg.gender}

Student Profile:
- Budget: ₹${student.budgetMin} - ₹${student.budgetMax}
- Food habit: ${student.foodHabit}
- Cleanliness preference: ${student.cleanliness}/5

Explain in 2-3 sentences why this PG is a good match for this student.
Focus on practical benefits, proximity, and value.
`;
```

**Expected Output:**
> "This PG is an excellent match for your budget and location preferences, being just 0.8km from IIT Bombay. The verified status and 4.2 rating indicate reliable management, while the included meals suit your vegetarian preferences. The AC and WiFi amenities align well with student needs."

### 2. Local Area Insights

**Purpose:** Provide neighborhood context for universities

**Example Prompt:**
```typescript
const prompt = `
You are a local guide for students moving to ${city}, India.

University: ${university.name}
Neighborhood: ${area}

Provide a brief overview (3-4 sentences) covering:
1. What the area is known for (student-friendly, IT hub, etc.)
2. Transportation options
3. Key facilities nearby (malls, hospitals, restaurants)
4. General safety and student community presence

Keep it factual, helpful, and relevant for PG-seeking students.
`;
```

**Expected Output:**
> "Powai is a thriving student hub near IIT Bombay, known for its safety and connectivity. The area has excellent public transport with buses and autos readily available. You'll find major shopping centers like R City Mall, multiple hospitals, and diverse food options. It's considered very student-friendly with a large academic community."

### 3. Roommate Compatibility Narratives

**Purpose:** Add human context to numeric compatibility scores

**Example Prompt:**
```typescript
const prompt = `
You are a roommate matching advisor.

Student 1:
- Sleep schedule: ${getScheduleLabel(student1.sleepSchedule)}
- Cleanliness: ${student1.cleanliness}/5
- Food: ${student1.foodHabit}
- Lifestyle: ${student1.smoking ? 'Smokes' : 'No smoking'}, ${student1.drinking ? 'Drinks' : 'No drinking'}

Student 2:
- Sleep schedule: ${getScheduleLabel(student2.sleepSchedule)}
- Cleanliness: ${student2.cleanliness}/5
- Food: ${student2.foodHabit}
- Lifestyle: ${student2.smoking ? 'Smokes' : 'No smoking'}, ${student2.drinking ? 'Drinks' : 'No drinking'}

Compatibility Score: ${compatibilityScore}%

Write a 2-sentence summary explaining why these students are compatible or what they should be aware of.
`;
```

**Expected Output:**
> "Your similar sleep schedules and cleanliness standards suggest harmonious daily routines. While you have different food preferences, this is easily manageable with separate kitchen arrangements."

### 4. PG Review Summarization

**Purpose:** Condense multiple reviews into key insights

**Example Prompt:**
```typescript
const prompt = `
Summarize these PG reviews in 3 bullet points highlighting:
1. Most praised aspect
2. Common concern
3. Overall sentiment

Reviews:
${reviews.map(r => `- ${r.text}`).join('\n')}

Keep it concise and balanced.
`;
```

### 5. Smart Search Query Understanding

**Purpose:** Parse natural language search queries

**Example:**
```typescript
// User types: "cheap pg near iit bombay for girls"

const prompt = `
Parse this housing search query into structured filters:
Query: "${userQuery}"

Extract:
- University/location mentioned
- Budget indication (cheap/expensive/specific amount)
- Gender preference
- Other preferences

Return as JSON.
`;
```

## 🔧 Implementation Steps

### Step 1: Install Gemini SDK

```bash
npm install @google/generative-ai
```

### Step 2: Set Up API Key

```typescript
// src/config/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
```

### Step 3: Create AI Service

```typescript
// src/services/aiService.ts
import { model } from '../config/gemini';

export async function generatePGExplanation(
  pg: PG,
  student: Student,
  university: University
): Promise<string> {
  const prompt = `...`; // See use case examples above
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI generation failed:', error);
    return 'This PG matches your preferences based on location, budget, and amenities.';
  }
}

export async function generateAreaInsights(
  university: University,
  area: string
): Promise<string> {
  const prompt = `...`;
  // Similar implementation
}
```

### Step 4: Add to UI Components

```typescript
// In PGListingPage.tsx or PGDetailPage.tsx
import { generatePGExplanation } from '../services/aiService';

function PGCard({ pg }: { pg: PG }) {
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGetExplanation = async () => {
    setLoading(true);
    const explanation = await generatePGExplanation(pg, currentStudent, university);
    setAiExplanation(explanation);
    setLoading(false);
  };

  return (
    <Card>
      {/* ... PG details ... */}
      
      <Button onClick={handleGetExplanation} disabled={loading}>
        {loading ? 'Generating...' : '✨ Why this PG?'}
      </Button>
      
      {aiExplanation && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">{aiExplanation}</p>
        </div>
      )}
    </Card>
  );
}
```

## 🎯 Best Practices

### 1. Always Have Fallbacks
```typescript
try {
  return await aiService.generate(prompt);
} catch (error) {
  // Return sensible default
  return "This PG matches your search criteria.";
}
```

### 2. Show Loading States
```typescript
{loading && <Spinner />}
{!loading && aiResponse && <AIInsight text={aiResponse} />}
```

### 3. Cache Results
```typescript
// Cache AI responses to avoid repeated API calls
const cache = new Map<string, string>();

function getCachedOrGenerate(key: string, generator: () => Promise<string>) {
  if (cache.has(key)) return cache.get(key)!;
  const result = await generator();
  cache.set(key, result);
  return result;
}
```

### 4. Rate Limiting
```typescript
// Limit AI calls per user
const rateLimiter = {
  calls: 0,
  resetTime: Date.now() + 60000, // 1 minute
  maxCalls: 10,
  
  canCall(): boolean {
    if (Date.now() > this.resetTime) {
      this.calls = 0;
      this.resetTime = Date.now() + 60000;
    }
    return this.calls < this.maxCalls;
  }
};
```

### 5. User Control
```typescript
// Let users enable/disable AI features
<Toggle
  label="Show AI insights"
  checked={showAI}
  onChange={setShowAI}
/>
```

## 💰 Cost Considerations

### Gemini API Pricing (as of 2024)
- **Free Tier**: 60 requests/minute
- **Pay-as-you-go**: ~$0.00025 per request

### Optimization Tips
1. **Batch requests** where possible
2. **Cache common queries** (university insights, etc.)
3. **Use shorter prompts** (less tokens = lower cost)
4. **Lazy load** AI features (don't generate until user requests)

## 🧪 Testing AI Integration

### 1. Mock AI Responses (Development)
```typescript
// src/services/aiService.mock.ts
export const mockAiService = {
  async generatePGExplanation() {
    await delay(1000); // Simulate network delay
    return "This is a mock AI response for testing.";
  }
};

// Use in development
const aiService = import.meta.env.DEV ? mockAiService : realAiService;
```

### 2. Test Different Scenarios
- [ ] API key missing
- [ ] API rate limit exceeded
- [ ] Network timeout
- [ ] Invalid response format
- [ ] Empty/null inputs

## 📋 Implementation Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Add API key to `.env` (never commit!)
- [ ] Install `@google/generative-ai` package
- [ ] Create `aiService.ts` with typed functions
- [ ] Implement error handling and fallbacks
- [ ] Add loading states to UI
- [ ] Test with real API calls
- [ ] Add caching layer
- [ ] Implement rate limiting
- [ ] Document for future maintainers

## ⚡ Quick Start Example

```typescript
// src/services/aiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function explainPGMatch(
  pgName: string,
  rent: number,
  rating: number,
  distance: number,
  studentBudget: number
): Promise<string> {
  const prompt = `
    Explain in one sentence why "${pgName}" (₹${rent}/mo, ${rating}★, ${distance}km away) 
    is a good match for a student with ₹${studentBudget} budget.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "This PG fits your budget and is conveniently located.";
  }
}
```

```typescript
// Usage in component
const explanation = await explainPGMatch(
  pg.name,
  pg.rent,
  pg.rating,
  pg.distance,
  student.budgetMax
);
```

## 🚫 What NOT to Do

1. ❌ Don't use AI to generate fake PG listings
2. ❌ Don't use AI for critical data (coordinates, pricing)
3. ❌ Don't expose API keys in frontend code
4. ❌ Don't make AI responses look like facts (add "AI-generated" label)
5. ❌ Don't rely solely on AI without human verification

## ✅ What TO Do

1. ✅ Use AI for explanations and insights
2. ✅ Always have non-AI fallback text
3. ✅ Show users when AI is being used
4. ✅ Cache responses to reduce costs
5. ✅ Let users opt-in to AI features

---

**Remember:** AI enhances UX but core functionality (maps, search, matching) must work without it!
