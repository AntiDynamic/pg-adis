import { University, PG, Student } from '../data/mockData';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Filter PGs within a given radius of a university
 */
export function filterPGsByUniversity(
  pgs: PG[],
  university: University,
  radiusKm: number = 5
): PG[] {
  return pgs
    .filter((pg) => {
      const distance = calculateDistance(
        university.lat,
        university.lng,
        pg.lat,
        pg.lng
      );
      return distance <= radiusKm;
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance
}

/**
 * Filter PGs by various criteria
 */
export interface PGFilterOptions {
  maxRent?: number;
  minRating?: number;
  verifiedOnly?: boolean;
  gender?: 'male' | 'female' | 'unisex';
  amenities?: string[];
}

export function filterPGs(pgs: PG[], filters: PGFilterOptions): PG[] {
  return pgs.filter((pg) => {
    if (filters.maxRent && pg.rent > filters.maxRent) return false;
    if (filters.minRating && pg.rating < filters.minRating) return false;
    if (filters.verifiedOnly && !pg.verified) return false;
    if (filters.gender && pg.gender !== 'unisex' && pg.gender !== filters.gender)
      return false;
    if (
      filters.amenities &&
      !filters.amenities.every((amenity) => pg.amenities.includes(amenity))
    )
      return false;

    return true;
  });
}

/**
 * Roommate Compatibility Score Calculator
 * Returns a score from 0-100 indicating compatibility between two students
 */
export interface CompatibilityResult {
  score: number;
  breakdown: {
    budgetMatch: number;
    sleepScheduleMatch: number;
    cleanlinessMatch: number;
    foodHabitMatch: number;
    lifestyleMatch: number;
    studyHoursMatch: number;
  };
  explanation: string[];
}

export function calculateCompatibility(
  student1: Student,
  student2: Student
): CompatibilityResult {
  const breakdown = {
    budgetMatch: 0,
    sleepScheduleMatch: 0,
    cleanlinessMatch: 0,
    foodHabitMatch: 0,
    lifestyleMatch: 0,
    studyHoursMatch: 0,
  };

  const explanation: string[] = [];

  // 1. Budget compatibility (20% weight)
  const budgetOverlap =
    Math.min(student1.budgetMax, student2.budgetMax) -
    Math.max(student1.budgetMin, student2.budgetMin);
  
  if (budgetOverlap > 0) {
    const avgBudgetRange =
      ((student1.budgetMax - student1.budgetMin) +
        (student2.budgetMax - student2.budgetMin)) /
      2;
    breakdown.budgetMatch = Math.min(100, (budgetOverlap / avgBudgetRange) * 100);
    explanation.push(
      `✓ Budget ranges overlap by ₹${budgetOverlap.toLocaleString()}`
    );
  } else {
    breakdown.budgetMatch = 0;
    explanation.push('✗ Budget ranges do not overlap');
  }

  // 2. Sleep schedule compatibility (15% weight)
  const sleepDiff = Math.abs(student1.sleepSchedule - student2.sleepSchedule);
  breakdown.sleepScheduleMatch = Math.max(0, 100 - sleepDiff * 25);
  
  if (sleepDiff === 0) {
    explanation.push('✓ Identical sleep schedules');
  } else if (sleepDiff <= 1) {
    explanation.push('✓ Very similar sleep schedules');
  } else if (sleepDiff <= 2) {
    explanation.push('~ Somewhat different sleep schedules');
  } else {
    explanation.push('✗ Very different sleep schedules (may cause conflicts)');
  }

  // 3. Cleanliness compatibility (20% weight)
  const cleanlinessDiff = Math.abs(student1.cleanliness - student2.cleanliness);
  breakdown.cleanlinessMatch = Math.max(0, 100 - cleanlinessDiff * 25);
  
  if (cleanlinessDiff === 0) {
    explanation.push('✓ Same cleanliness standards');
  } else if (cleanlinessDiff <= 1) {
    explanation.push('✓ Similar cleanliness standards');
  } else {
    explanation.push('✗ Different cleanliness standards (potential friction)');
  }

  // 4. Food habit compatibility (15% weight)
  if (student1.foodHabit === student2.foodHabit) {
    breakdown.foodHabitMatch = 100;
    explanation.push(`✓ Both prefer ${student1.foodHabit} food`);
  } else if (
    (student1.foodHabit === 'vegan' && student2.foodHabit === 'veg') ||
    (student1.foodHabit === 'veg' && student2.foodHabit === 'vegan')
  ) {
    breakdown.foodHabitMatch = 70;
    explanation.push('✓ Compatible vegetarian preferences');
  } else {
    breakdown.foodHabitMatch = 50;
    explanation.push('~ Different food habits (manageable)');
  }

  // 5. Lifestyle compatibility - smoking & drinking (20% weight)
  let lifestyleScore = 100;
  
  if (student1.smoking !== student2.smoking) {
    lifestyleScore -= 50;
    explanation.push('⚠ Different smoking preferences');
  }
  
  if (student1.drinking !== student2.drinking) {
    lifestyleScore -= 50;
    explanation.push('⚠ Different drinking preferences');
  }
  
  if (lifestyleScore === 100) {
    explanation.push('✓ Identical lifestyle preferences');
  }
  
  breakdown.lifestyleMatch = Math.max(0, lifestyleScore);

  // 6. Study hours compatibility (10% weight)
  const studyDiff = Math.abs(student1.studyHours - student2.studyHours);
  breakdown.studyHoursMatch = Math.max(0, 100 - studyDiff * 25);
  
  if (studyDiff === 0) {
    explanation.push('✓ Similar study intensity');
  } else if (studyDiff >= 3) {
    explanation.push('~ Very different study routines');
  }

  // Calculate weighted final score
  const score = Math.round(
    breakdown.budgetMatch * 0.2 +
      breakdown.sleepScheduleMatch * 0.15 +
      breakdown.cleanlinessMatch * 0.2 +
      breakdown.foodHabitMatch * 0.15 +
      breakdown.lifestyleMatch * 0.2 +
      breakdown.studyHoursMatch * 0.1
  );

  return {
    score,
    breakdown,
    explanation,
  };
}

/**
 * Find compatible roommates for a given student
 * Returns students sorted by compatibility score (highest first)
 */
export function findCompatibleRoommates(
  student: Student,
  allStudents: Student[],
  minScore: number = 60
): Array<{ student: Student; compatibility: CompatibilityResult }> {
  return allStudents
    .filter((s) => s.id !== student.id && s.universityId === student.universityId)
    .map((s) => ({
      student: s,
      compatibility: calculateCompatibility(student, s),
    }))
    .filter((result) => result.compatibility.score >= minScore)
    .sort((a, b) => b.compatibility.score - a.compatibility.score);
}

/**
 * Get compatibility level label
 */
export function getCompatibilityLevel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 85) {
    return { label: 'Excellent Match', color: 'text-green-600' };
  } else if (score >= 70) {
    return { label: 'Great Match', color: 'text-blue-600' };
  } else if (score >= 60) {
    return { label: 'Good Match', color: 'text-yellow-600' };
  } else {
    return { label: 'Poor Match', color: 'text-red-600' };
  }
}
