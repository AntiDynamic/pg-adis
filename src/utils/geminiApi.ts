/**
 * GEMINI AI INTEGRATION - Updated for New API (January 2026)
 * 
 * Uses Google's Gemini API (@google/genai) to:
 * 1. Enhance match explanations with natural language
 * 2. Provide personalized roommate advice
 * 3. Generate compatibility insights
 */

import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client with API key
const GEMINI_API_KEY = 'AIzaSyArBnjyaB9y8xb1D8dKYY-9W9DUutHFoh8';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Generate personalized match explanation using Gemini AI
 */
export async function generateMatchInsights(
  user1Name: string,
  user2Name: string,
  matchScore: number,
  reasons: string[],
  warnings: string[],
  user1Profile?: any,
  user2Profile?: any
): Promise<string> {
  // Build detailed context about both users for deeper insights
  let contextualInfo = '';
  
  if (user1Profile && user2Profile) {
    contextualInfo = `

DETAILED USER PROFILES:

${user1Name}:
- College: ${user1Profile.profile?.college || 'Not specified'}
- Year: ${user1Profile.profile?.year || 'Not specified'}
- Budget Range: ₹${user1Profile.profile?.budgetMin || '0'} - ₹${user1Profile.profile?.budgetMax || '0'}
- Lifestyle Preferences:
  * Cleanliness: ${user1Profile.preferences?.cleanlinessLevel || 'Not specified'}/5
  * Sleep Schedule: ${user1Profile.preferences?.sleepSchedule || 'Not specified'}
  * Food Preference: ${user1Profile.preferences?.foodPreference || 'Not specified'}
  * Smoking: ${user1Profile.preferences?.smokingTolerance || 'Not specified'}
  * Drinking: ${user1Profile.preferences?.drinkingTolerance || 'Not specified'}
  * Noise Tolerance: ${user1Profile.preferences?.noiseTolerance || 'Not specified'}
  * Guest Policy: ${user1Profile.preferences?.guestPolicy || 'Not specified'}
  * Personality: ${user1Profile.preferences?.personalityType || 'Not specified'}
${user1Profile.profile?.bio ? `- About: ${user1Profile.profile.bio}` : ''}

${user2Name}:
- College: ${user2Profile.profile?.college || 'Not specified'}
- Year: ${user2Profile.profile?.year || 'Not specified'}
- Budget Range: ₹${user2Profile.profile?.budgetMin || '0'} - ₹${user2Profile.profile?.budgetMax || '0'}
- Lifestyle Preferences:
  * Cleanliness: ${user2Profile.preferences?.cleanlinessLevel || 'Not specified'}/5
  * Sleep Schedule: ${user2Profile.preferences?.sleepSchedule || 'Not specified'}
  * Food Preference: ${user2Profile.preferences?.foodPreference || 'Not specified'}
  * Smoking: ${user2Profile.preferences?.smokingTolerance || 'Not specified'}
  * Drinking: ${user2Profile.preferences?.drinkingTolerance || 'Not specified'}
  * Noise Tolerance: ${user2Profile.preferences?.noiseTolerance || 'Not specified'}
  * Guest Policy: ${user2Profile.preferences?.guestPolicy || 'Not specified'}
  * Personality: ${user2Profile.preferences?.personalityType || 'Not specified'}
${user2Profile.profile?.bio ? `- About: ${user2Profile.profile.bio}` : ''}`;
  }

  const prompt = `You are an expert roommate compatibility analyst with deep understanding of student living dynamics in India. Analyze this potential roommate match in detail.

COMPATIBILITY OVERVIEW:
- Match Score: ${matchScore}/100
- Candidates: ${user1Name} and ${user2Name}
${contextualInfo}

COMPATIBILITY STRENGTHS:
${reasons.map((r) => `✓ ${r}`).join('\n')}

POTENTIAL CHALLENGES:
${warnings.length > 0 ? warnings.map((w) => `⚠ ${w}`).join('\n') : '✓ No major concerns identified'}

TASK: Provide a comprehensive, personalized compatibility analysis in 4-6 well-structured sentences covering:

1. **Overall Assessment**: Start with an honest, nuanced evaluation of their compatibility level
2. **Key Strengths**: Highlight the 2-3 most important alignments that make this a promising match
3. **Lifestyle Compatibility**: Discuss how their daily routines, habits, and preferences complement each other
4. **Challenge Management**: Address potential friction points and provide practical advice on handling them
5. **Actionable Recommendations**: Give 1-2 specific suggestions for making this roommate relationship successful

Write in a warm, conversational, yet insightful tone. Be realistic but encouraging. Focus on practical living dynamics relevant to Indian college students sharing a PG. Use natural language without bullet points or section headers in your response.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text;
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

Provide 3 brief, actionable tips to improve their profile and find better matches. Focus on completeness and specificity. Each tip should be one short sentence.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text || '';

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text || '';

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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Test',
    });

    return !!response.text;
  } catch {
    return false;
  }
}
