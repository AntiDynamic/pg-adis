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

// Enhanced User Profile System for Smart Matching
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  city: string;
  college?: string;
  company?: string;
  verified: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface UserPreferences {
  userId: string;
  
  // Living Preferences
  budgetMin: number;
  budgetMax: number;
  preferredAreas: string[];
  roomSharing: 'single' | 'double' | 'triple';
  moveInDate: Date;
  stayDuration: number; // in months
  
  // Lifestyle Matching (Core - weighted heavily)
  cleanlinessLevel: 1 | 2 | 3 | 4 | 5; // 1=messy, 5=very clean - 25% weight
  sleepTime: 'early' | 'normal' | 'late'; // 10-11pm / 11-12am / 12-2am - 20% weight
  wakeTime: 'early' | 'normal' | 'late'; // 6-7am / 7-9am / 9am+ - 20% weight
  foodPreference: 'veg' | 'non-veg' | 'egg' | 'vegan'; // 15% weight
  smoking: 'no' | 'occasionally' | 'yes'; // 15% weight
  drinking: 'no' | 'occasionally' | 'yes'; // 15% weight
  noiseTolerance: 'low' | 'medium' | 'high'; // 10% weight
  guestsFrequency: 'rare' | 'sometimes' | 'often'; // 10% weight
  
  // Personality Layer (Optional - 5% weight)
  introvertExtrovert: 1 | 2 | 3 | 4 | 5; // 1=introvert, 5=extrovert
  conflictHandling: 'calm' | 'direct' | 'avoidant';
  workSchedule: 'student' | 'working' | 'hybrid';
  
  // Additional preferences
  acPreference: boolean;
  languageComfort: string[];
  genderPreference?: 'male' | 'female' | 'any';
}

export interface MatchResult {
  userId: string;
  matchedUserId: string;
  matchScore: number; // 0-100
  breakdown: MatchBreakdown;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface MatchBreakdown {
  cleanliness: number; // 25% weight
  sleepSchedule: number; // 20% weight
  foodHabits: number; // 15% weight
  smokingDrinking: number; // 15% weight
  noiseTolerance: number; // 10% weight
  guests: number; // 10% weight
  personality: number; // 5% weight
  reasons: string[]; // Why they match
  warnings: string[]; // Potential conflicts
}

// Legacy interface for backward compatibility
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

<<<<<<< HEAD
=======
// ========== PG PROOF, REVIEWS & TRUST SYSTEM ==========

export interface PGMedia {
  id: string;
  pgId: string;
  type: 'photo' | 'video';
  title: string;
  description?: string;
  url: string;
  category: 'room' | 'washroom' | 'common-area' | 'food' | 'other';
  uploadedBy: 'owner' | 'verified-admin';
  verified: boolean;
  verifiedAt?: Date;
  uploadedAt: Date;
  views?: number;
}

export interface PGMediaGallery {
  pgId: string;
  photos: PGMedia[];
  videos: PGMedia[];
  verifiedCount: number; // Number of verified media items
  lastUpdated: Date;
}

export interface StudentReview {
  id: string;
  pgId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  stayDuration: {
    months: number;
    from: Date;
    to: Date;
  };
  aspects?: {
    cleanliness: number;
    foodQuality: number;
    ownerBehavior: number;
    maintenance: number;
  };
  photos?: string[]; // Optional photos from stay
  verified: boolean; // Verified that user stayed here
  helpful: number;
  unhelpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PGReviewsSummary {
  pgId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  recentReviews: StudentReview[];
  aspectAverages?: {
    cleanliness: number;
    foodQuality: number;
    ownerBehavior: number;
    maintenance: number;
  };
}

export interface OwnerInteractionState {
  pgId: string;
  userId: string;
  userCity: string;
  userCoordinates?: { lat: number; lng: number };
  pgCoordinates: { lat: number; lng: number };
  pgCity: string;
  distanceKm?: number;
  isNearby: boolean; // Within same city or <50km
  preferredContact: 'video-call' | 'physical-visit' | 'both';
}

export interface OwnerContactLog {
  id: string;
  pgId: string;
  userId: string;
  contactType: 'video-call' | 'physical-visit' | 'message';
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
}

// ========== PG OWNER VERIFICATION SYSTEM ==========

export type VerificationStatus = 'pending_verification' | 'verified' | 'rejected' | 'resubmission_required';

export interface PGOwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  aadharNumber?: string; // For KYC
  verified: boolean;
  verifiedAt?: Date;
  pgListings: string[]; // Array of PG IDs owned
  createdAt: Date;
}

export interface PGOwnershipProof {
  pgId: string;
  ownerId: string;
  
  // Required Documents
  ownershipDocument: {
    type: 'electricity-bill' | 'water-bill' | 'property-tax' | 'rental-agreement' | 'ownership-deed';
    fileUrl: string;
    fileName: string;
    uploadedAt: Date;
  };
  
  // Required Photos (minimum 5)
  roomPhotos: Array<{
    url: string;
    category: 'room' | 'washroom' | 'kitchen' | 'common-area' | 'entrance' | 'exterior';
    description?: string;
    uploadedAt: Date;
  }>;
  
  // Required Video Walkthrough
  videoWalkthrough: {
    url: string;
    duration: number; // in seconds (30-90)
    thumbnailUrl?: string;
    uploadedAt: Date;
  };
  
  verificationStatus: VerificationStatus;
  verifiedBy?: string; // Admin ID who verified
  verificationNotes?: string;
  rejectionReason?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface PGListingWithVerification extends PGListing {
  ownerId: string;
  verificationStatus: VerificationStatus;
  ownershipProof?: PGOwnershipProof;
  lastVerifiedAt?: Date;
  
  // Enhanced details for owner listings
  totalBeds: number;
  availableBeds: number;
  rules: string[];
  securityDeposit: number;
  noticePeriod: number; // in days
}

export interface PGOwnerSignupData {
  // Step 1: Basic Info
  ownerInfo: {
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    aadharNumber?: string;
  };
  
  // Step 2: PG Details
  pgDetails: {
    name: string;
    genderType: 'male' | 'female' | 'unisex';
    address: {
      street: string;
      area: string;
      city: string;
      state: string;
      pincode: string;
      coordinates?: { lat: number; lng: number };
    };
    totalBeds: number;
    availableBeds: number;
    roomTypes: RoomType[];
    rent: number;
    securityDeposit: number;
    amenities: string[];
    rules: string[];
    messIncluded: boolean;
    noticePeriod: number;
  };
  
  // Step 3: Proofs (uploaded files)
  proofs: {
    ownershipDoc: File | null;
    roomPhotos: File[];
    videoWalkthrough: File | null;
  };
}

export interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface OwnerInteractionProps {
  pgId: string;
  ownerId: string;
  userLocation?: { lat: number; lng: number };
  pgLocation: { lat: number; lng: number };
  onRequestVideoCall: () => void;
  onScheduleVisit: () => void;
}

>>>>>>> 50b19ec (feat: Add PG card image carousel, verification, and trust system enhancements (Jan 2026))
// Ensure React is imported for type usage
import React from 'react';

