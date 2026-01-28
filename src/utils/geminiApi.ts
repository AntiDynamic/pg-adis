/**
 * GEMINI AI INTEGRATION
 * 
 * Optional AI layer on top of rule-based matching
 * Uses Google's Gemini API to:
 * 1. Enhance match explanations with natural language
 * 2. Provide personalized roommate advice
 * 3. Learn from successful matches over time
 */

const GEMINI_API_KEY = 'AIzaSyAihP_FmuArwrOqsgTwBdwNIBGM-kGZfsE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

/**
 * Generate personalized match explanation using Gemini AI
 */
export async function generateMatchInsights(
  user1Name: string,
  user2Name: string,
  matchScore: number,
  reasons: string[],
  warnings: string[]
): Promise<string> {
  const prompt = `You are a roommate compatibility expert. Two people, ${user1Name} and ${user2Name}, have been matched with a compatibility score of ${matchScore}/100.

Match reasons:
${reasons.map((r) => `- ${r}`).join('\n')}

Potential concerns:
${warnings.map((w) => `- ${w}`).join('\n')}

Write a brief (2-3 sentences), friendly, and honest assessment of their compatibility. Be encouraging but realistic. Focus on practical living together advice.`;

  try {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.statusText);
      return getFallbackInsight(matchScore);
    }

    const data: GeminiResponse = await response.json();
    const aiText = data.candidates[0]?.content?.parts[0]?.text;

    return aiText || getFallbackInsight(matchScore);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackInsight(matchScore);
  }
}

/**
 * Get profile improvement suggestions using AI
 */
export async function getProfileImprovementTips(
  profileCompleteness: number,
  preferences: any
): Promise<string[]> {
  if (profileCompleteness >= 90) {
    return ['Your profile looks great! Start exploring matches.'];
  }

  const prompt = `A user has filled out their roommate matching profile with ${profileCompleteness}% completeness. 
  
Preferences filled: ${JSON.stringify(preferences, null, 2)}

Suggest 3 brief, practical tips to improve their profile and get better matches. Each tip should be one short sentence.`;

  try {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return getDefaultImprovementTips(profileCompleteness);
    }

    const data: GeminiResponse = await response.json();
    const aiText = data.candidates[0]?.content?.parts[0]?.text || '';

    // Parse tips from AI response
    const tips = aiText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .slice(0, 3);

    return tips.length > 0 ? tips : getDefaultImprovementTips(profileCompleteness);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getDefaultImprovementTips(profileCompleteness);
  }
}

/**
 * Generate conversation starters between matched roommates
 */
export async function generateConversationStarters(
  matchScore: number,
  commonInterests: string[]
): Promise<string[]> {
  const prompt = `Two potential roommates matched with ${matchScore}% compatibility.
Common interests: ${commonInterests.join(', ')}

Generate 3 natural, friendly conversation starter questions they could ask each other when first chatting. Keep them casual and relevant to living together.`;

  try {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return getDefaultConversationStarters();
    }

    const data: GeminiResponse = await response.json();
    const aiText = data.candidates[0]?.content?.parts[0]?.text || '';

    const starters = aiText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .slice(0, 3);

    return starters.length > 0 ? starters : getDefaultConversationStarters();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getDefaultConversationStarters();
  }
}

// Fallback functions when AI is unavailable

function getFallbackInsight(matchScore: number): string {
  if (matchScore >= 85) {
    return 'Excellent match! Your lifestyles align very well. This could be a great roommate pairing with strong compatibility across key areas.';
  } else if (matchScore >= 70) {
    return 'Good match! You share several important preferences. Minor differences can be worked out with open communication.';
  } else if (matchScore >= 60) {
    return 'Decent compatibility. You have some differences, but many successful roommates do. Clear communication will be key.';
  } else {
    return 'Moderate match. There are notable lifestyle differences to discuss upfront before deciding to room together.';
  }
}

function getDefaultImprovementTips(_completeness: number): string[] {
  const tips = [
    'Add more details about your daily routine to find better matches',
    'Be specific about your deal-breakers to avoid incompatible matches',
    'Complete all preference sections for the most accurate matching',
  ];

  return tips;
}

function getDefaultConversationStarters(): string[] {
  return [
    "What's your typical daily routine like during weekdays?",
    'How do you usually handle household chores and cleaning?',
    'Do you prefer having people over or keeping the place quiet?',
  ];
}

/**
 * Check API key validity
 */
export async function validateGeminiApiKey(): Promise<boolean> {
  try {
    const testRequest: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: 'Test',
            },
          ],
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
    });

    return response.ok;
  } catch {
    return false;
  }
}
