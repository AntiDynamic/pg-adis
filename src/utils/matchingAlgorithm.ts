import { UserProfile, UserPreferences, MatchResult, MatchBreakdown } from '../types';

/**
 * SMART ROOMMATE MATCHING ALGORITHM
 * 
 * Weighted scoring based on REAL compatibility factors:
 * - Cleanliness: 25%
 * - Sleep/Wake Schedule: 20%
 * - Food Habits: 15%
 * - Smoking/Drinking: 15%
 * - Noise Tolerance: 10%
 * - Guests Frequency: 10%
 * - Personality: 5%
 * 
 * Returns match score 0-100 with detailed breakdown
 */

interface UserWithPreferences {
  profile: UserProfile;
  preferences: UserPreferences;
}

export function calculateCompatibility(
  user1: UserWithPreferences,
  user2: UserWithPreferences
): MatchResult {
  const pref1 = user1.preferences;
  const pref2 = user2.preferences;

  // Calculate individual scores
  const cleanlinessScore = calculateCleanlinessMatch(
    pref1.cleanlinessLevel,
    pref2.cleanlinessLevel
  );

  const sleepScheduleScore = calculateSleepScheduleMatch(
    pref1.sleepTime,
    pref1.wakeTime,
    pref2.sleepTime,
    pref2.wakeTime
  );

  const foodHabitsScore = calculateFoodHabitsMatch(
    pref1.foodPreference,
    pref2.foodPreference
  );

  const smokingDrinkingScore = calculateSmokingDrinkingMatch(
    pref1.smoking,
    pref1.drinking,
    pref2.smoking,
    pref2.drinking
  );

  const noiseToleranceScore = calculateNoiseToleranceMatch(
    pref1.noiseTolerance,
    pref2.noiseTolerance
  );

  const guestsScore = calculateGuestsMatch(
    pref1.guestsFrequency,
    pref2.guestsFrequency
  );

  const personalityScore = calculatePersonalityMatch(
    pref1.introvertExtrovert,
    pref2.introvertExtrovert
  );

  // Apply weights to get final score
  const finalScore = Math.round(
    cleanlinessScore * 0.25 +
    sleepScheduleScore * 0.20 +
    foodHabitsScore * 0.15 +
    smokingDrinkingScore * 0.15 +
    noiseToleranceScore * 0.10 +
    guestsScore * 0.10 +
    personalityScore * 0.05
  );

  // Generate reasons and warnings
  const { reasons, warnings } = generateMatchExplanation(
    pref1,
    pref2,
    {
      cleanliness: cleanlinessScore,
      sleepSchedule: sleepScheduleScore,
      foodHabits: foodHabitsScore,
      smokingDrinking: smokingDrinkingScore,
      noiseTolerance: noiseToleranceScore,
      guests: guestsScore,
      personality: personalityScore,
    }
  );

  const breakdown: MatchBreakdown = {
    cleanliness: cleanlinessScore,
    sleepSchedule: sleepScheduleScore,
    foodHabits: foodHabitsScore,
    smokingDrinking: smokingDrinkingScore,
    noiseTolerance: noiseToleranceScore,
    guests: guestsScore,
    personality: personalityScore,
    reasons,
    warnings,
  };

  return {
    userId: user1.profile.id,
    matchedUserId: user2.profile.id,
    matchScore: finalScore,
    breakdown,
    status: 'pending',
    createdAt: new Date(),
  };
}

// Cleanliness Match - 25% weight (MOST IMPORTANT)
function calculateCleanlinessMatch(level1: number, level2: number): number {
  const diff = Math.abs(level1 - level2);
  // 0 diff = 100, 1 diff = 75, 2 diff = 50, 3 diff = 25, 4 diff = 0
  return Math.max(0, 100 - diff * 25);
}

// Sleep Schedule Match - 20% weight
function calculateSleepScheduleMatch(
  sleep1: string,
  wake1: string,
  sleep2: string,
  wake2: string
): number {
  const sleepMap = { early: 0, normal: 1, late: 2 };
  const wakeMap = { early: 0, normal: 1, late: 2 };

  const sleepDiff = Math.abs(sleepMap[sleep1 as keyof typeof sleepMap] - sleepMap[sleep2 as keyof typeof sleepMap]);
  const wakeDiff = Math.abs(wakeMap[wake1 as keyof typeof wakeMap] - wakeMap[wake2 as keyof typeof wakeMap]);

  // Average the two scores
  const sleepScore = Math.max(0, 100 - sleepDiff * 50);
  const wakeScore = Math.max(0, 100 - wakeDiff * 50);

  return Math.round((sleepScore + wakeScore) / 2);
}

// Food Habits Match - 15% weight
function calculateFoodHabitsMatch(food1: string, food2: string): number {
  if (food1 === food2) return 100;

  // Compatibility matrix
  const compatibility: { [key: string]: { [key: string]: number } } = {
    veg: { veg: 100, egg: 75, vegan: 90, 'non-veg': 40 },
    egg: { veg: 75, egg: 100, vegan: 60, 'non-veg': 80 },
    vegan: { veg: 90, egg: 60, vegan: 100, 'non-veg': 30 },
    'non-veg': { veg: 40, egg: 80, vegan: 30, 'non-veg': 100 },
  };

  return compatibility[food1]?.[food2] || 50;
}

// Smoking & Drinking Match - 15% weight
function calculateSmokingDrinkingMatch(
  smoking1: string,
  drinking1: string,
  smoking2: string,
  drinking2: string
): number {
  const habitMap = { no: 0, occasionally: 1, yes: 2 };

  const smokingDiff = Math.abs(
    habitMap[smoking1 as keyof typeof habitMap] - habitMap[smoking2 as keyof typeof habitMap]
  );
  const drinkingDiff = Math.abs(
    habitMap[drinking1 as keyof typeof habitMap] - habitMap[drinking2 as keyof typeof habitMap]
  );

  // Heavy weight on complete mismatch
  const smokingScore = smokingDiff === 0 ? 100 : smokingDiff === 1 ? 60 : 20;
  const drinkingScore = drinkingDiff === 0 ? 100 : drinkingDiff === 1 ? 60 : 20;

  return Math.round((smokingScore + drinkingScore) / 2);
}

// Noise Tolerance Match - 10% weight
function calculateNoiseToleranceMatch(noise1: string, noise2: string): number {
  const noiseMap = { low: 0, medium: 1, high: 2 };

  const diff = Math.abs(noiseMap[noise1 as keyof typeof noiseMap] - noiseMap[noise2 as keyof typeof noiseMap]);

  return Math.max(0, 100 - diff * 50);
}

// Guests Frequency Match - 10% weight
function calculateGuestsMatch(guests1: string, guests2: string): number {
  const guestsMap = { rare: 0, sometimes: 1, often: 2 };

  const diff = Math.abs(guestsMap[guests1 as keyof typeof guestsMap] - guestsMap[guests2 as keyof typeof guestsMap]);

  return Math.max(0, 100 - diff * 50);
}

// Personality Match - 5% weight
function calculatePersonalityMatch(personality1: number, personality2: number): number {
  const diff = Math.abs(personality1 - personality2);
  // Similar personalities match well, but opposites can also work
  return Math.max(0, 100 - diff * 20);
}

// Generate human-readable explanations
function generateMatchExplanation(
  pref1: UserPreferences,
  pref2: UserPreferences,
  scores: Omit<MatchBreakdown, 'reasons' | 'warnings'>
): { reasons: string[]; warnings: string[] } {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Cleanliness
  if (scores.cleanliness >= 90) {
    reasons.push('🧹 Same cleanliness standards');
  } else if (scores.cleanliness >= 75) {
    reasons.push('🧹 Similar cleanliness levels');
  } else if (scores.cleanliness < 50) {
    warnings.push('⚠️ Very different cleanliness expectations');
  }

  // Sleep Schedule
  if (scores.sleepSchedule >= 90) {
    reasons.push('🌙 Matching sleep schedule');
  } else if (scores.sleepSchedule < 50) {
    warnings.push('⚠️ Different sleep/wake times may cause disturbance');
  }

  // Food Habits
  if (scores.foodHabits >= 90) {
    reasons.push('🍽️ Same food preferences');
  } else if (scores.foodHabits < 50) {
    warnings.push('⚠️ Different food habits might require separate cooking');
  }

  // Smoking & Drinking
  if (scores.smokingDrinking >= 90) {
    reasons.push('🚭 Compatible lifestyle choices');
  } else if (scores.smokingDrinking < 40) {
    warnings.push('⚠️ Major difference in smoking/drinking habits');
  }

  // Noise Tolerance
  if (scores.noiseTolerance >= 90) {
    reasons.push('🔊 Similar noise tolerance');
  } else if (scores.noiseTolerance < 50) {
    warnings.push('⚠️ Different noise tolerance levels');
  }

  // Guests
  if (scores.guests >= 90) {
    reasons.push('👥 Same views on having guests');
  } else if (scores.guests < 50) {
    warnings.push('⚠️ Different expectations for guests');
  }

  // Personality
  if (scores.personality >= 75) {
    reasons.push('🤝 Compatible personalities');
  }

  // Add budget compatibility check
  const budgetOverlap = calculateBudgetOverlap(pref1, pref2);
  if (budgetOverlap > 50) {
    reasons.push('💰 Budget ranges align well');
  } else if (budgetOverlap < 30) {
    warnings.push('⚠️ Limited budget overlap');
  }

  return { reasons, warnings };
}

// Helper: Calculate budget overlap percentage
function calculateBudgetOverlap(pref1: UserPreferences, pref2: UserPreferences): number {
  const min = Math.max(pref1.budgetMin, pref2.budgetMin);
  const max = Math.min(pref1.budgetMax, pref2.budgetMax);

  if (max < min) return 0; // No overlap

  const overlap = max - min;
  const range1 = pref1.budgetMax - pref1.budgetMin;
  const range2 = pref2.budgetMax - pref2.budgetMin;
  const avgRange = (range1 + range2) / 2;

  return Math.min(100, (overlap / avgRange) * 100);
}

// Filter users by hard requirements before matching
export function filterByHardRequirements(
  currentUser: UserWithPreferences,
  allUsers: UserWithPreferences[]
): UserWithPreferences[] {
  const currentPref = currentUser.preferences;

  return allUsers.filter((user) => {
    if (user.profile.id === currentUser.profile.id) return false;

    const userPref = user.preferences;

    // Budget overlap
    const hasBudgetOverlap =
      !(userPref.budgetMax < currentPref.budgetMin || userPref.budgetMin > currentPref.budgetMax);
    if (!hasBudgetOverlap) return false;

    // Same city
    if (user.profile.city !== currentUser.profile.city) return false;

    // Gender preference
    if (currentPref.genderPreference && currentPref.genderPreference !== 'any') {
      if (user.profile.gender !== currentPref.genderPreference) return false;
    }
    if (userPref.genderPreference && userPref.genderPreference !== 'any') {
      if (currentUser.profile.gender !== userPref.genderPreference) return false;
    }

    // Smoking deal-breaker (if one is 'no' and other is 'yes')
    if (
      (currentPref.smoking === 'no' && userPref.smoking === 'yes') ||
      (currentPref.smoking === 'yes' && userPref.smoking === 'no')
    ) {
      return false;
    }

    return true;
  });
}

// Find compatible matches above threshold
export function findMatches(
  currentUser: UserWithPreferences,
  allUsers: UserWithPreferences[],
  minScore: number = 60
): MatchResult[] {
  // First, filter by hard requirements
  const eligible = filterByHardRequirements(currentUser, allUsers);

  // Calculate compatibility with eligible users
  const matches = eligible
    .map((user) => calculateCompatibility(currentUser, user))
    .filter((match) => match.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}
