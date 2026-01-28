// Core Types for PG Living Platform

export interface PGListing {
  id: string;
  name: string;
  location: {
    area: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  pricing: {
    rent: number;
    deposit: number;
    currency: string;
  };
  verified: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  roomTypes: RoomType[];
  foodQuality: FoodQuality;
  areaSafety: SafetyRating;
  ownerInfo: {
    name: string;
    verified: boolean;
    responseRate: number;
  };
  highlights: string[];
}

export interface RoomType {
  type: 'single' | 'double' | 'triple' | 'shared';
  available: number;
  price: number;
}

export interface FoodQuality {
  rating: number;
  messIncluded: boolean;
  menuVariety: 'low' | 'medium' | 'high';
  hygieneScore: number;
}

export interface SafetyRating {
  score: number; // 1-10
  factors: {
    nightSafety: number;
    publicTransport: number;
    localPolicing: number;
    studentFriendly: number;
  };
}

export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: 'student' | 'working';
  avatar?: string;
  verified: boolean;
  lifestyle: LifestylePreferences;
  compatibilityScore?: number;
  bio: string;
  lookingFor: {
    budget: { min: number; max: number };
    areas: string[];
    moveInDate: Date;
  };
}

export interface LifestylePreferences {
  sleepSchedule: 'early-bird' | 'night-owl' | 'flexible';
  cleanliness: 1 | 2 | 3 | 4 | 5; // 1=relaxed, 5=very clean
  socialness: 'introvert' | 'ambivert' | 'extrovert';
  foodHabits: 'veg' | 'non-veg' | 'eggetarian' | 'vegan';
  smoking: boolean;
  drinking: 'no' | 'occasionally' | 'socially';
  pets: boolean;
  workFromHome: boolean;
  studyHours: 'morning' | 'evening' | 'night' | 'flexible';
}

export interface MessListing {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricing: {
    monthly: number;
    perMeal: number;
  };
  cuisine: string[];
  images: string[];
  hygieneRating: number;
  verified: boolean;
  menu: DailyMenu[];
  timings: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface DailyMenu {
  day: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
}

export interface UserDashboard {
  savedPGs: string[]; // PG IDs
  savedRoommates: string[]; // Profile IDs
  matches: RoommateMatch[];
  subscriptions: Subscription[];
  recentViews: RecentView[];
}

export interface RoommateMatch {
  profileId: string;
  compatibilityScore: number;
  matchedFactors: string[];
  status: 'pending' | 'accepted' | 'rejected';
  matchedAt: Date;
}

export interface Subscription {
  id: string;
  type: 'mess' | 'pg';
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expiring' | 'expired';
  amount: number;
}

export interface RecentView {
  type: 'pg' | 'roommate' | 'mess';
  id: string;
  viewedAt: Date;
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export interface BadgeProps {
  variant?: 'verified' | 'premium' | 'new' | 'default';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export interface CardProps {
  elevated?: boolean;
  hoverable?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Ensure React is imported for type usage
import React from 'react';
