/**
 * PG Owner Module - Type Definitions
 * All types related to PG Owner functionality
 */

// ========== VERIFICATION SYSTEM ==========

export type VerificationStatus = 
  | 'pending_verification'  // Just submitted, awaiting review
  | 'verified'              // Approved and visible to students
  | 'rejected'              // Rejected due to fake/incomplete docs
  | 'resubmission_required'; // Needs corrections

// ========== OWNER PROFILE ==========

export interface PGOwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  aadharNumber?: string; // Optional KYC
  kycVerified: boolean;
  registeredAt: Date;
  totalPGs: number;
  activePGs: number;
}

// ========== OWNERSHIP PROOF ==========

export interface PGOwnershipProof {
  // REQUIRED: Ownership document
  ownershipDocument: {
    type: 'electricity-bill' | 'water-bill' | 'property-tax' | 'rental-agreement' | 'ownership-deed';
    fileUrl: string;
    fileName: string;
    uploadedAt: Date;
  };
  
  // REQUIRED: Minimum 5 photos
  roomPhotos: Array<{
    url: string;
    fileName: string;
    category: 'room' | 'washroom' | 'kitchen' | 'common-area' | 'entrance' | 'exterior';
    uploadedAt: Date;
  }>;
  
  // REQUIRED: 30-90 sec video walkthrough
  videoWalkthrough: {
    url: string;
    fileName: string;
    duration: number; // in seconds
    uploadedAt: Date;
  };
}

// ========== PG LISTING WITH VERIFICATION ==========

export interface RoomType {
  type: 'single' | 'double' | 'triple' | 'dormitory';
  rent: number;
  available: number;
}

export interface PGAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface PGListingWithVerification {
  id: string;
  ownerId: string;
  
  // Basic Details
  name: string;
  genderType: 'male' | 'female' | 'unisex';
  address: PGAddress;
  coordinates?: { lat: number; lng: number };
  
  // Capacity
  totalBeds: number;
  availableBeds: number;
  roomTypes: RoomType[];
  
  // Pricing
  rent: number; // Starting rent
  securityDeposit: number;
  
  // Features
  amenities: string[];
  rules: string[];
  messIncluded: boolean;
  noticePeriod: number; // in days
  
  // Verification
  verificationStatus: VerificationStatus;
  verified: boolean;
  ownershipProof?: PGOwnershipProof;
  lastVerifiedAt?: Date;
  rejectionReason?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ========== OWNER SIGNUP DATA ==========

export interface PGOwnerSignupData {
  ownerInfo: {
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    aadharNumber?: string;
  };
  pgDetails: {
    name: string;
    genderType: 'male' | 'female' | 'unisex';
    address: PGAddress;
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
  proofs: {
    ownershipDoc: File | null;
    roomPhotos: File[];
    videoWalkthrough: File | null;
  };
}

// ========== OWNER DASHBOARD ==========

export interface OwnerDashboardStats {
  totalListings: number;
  verifiedListings: number;
  pendingListings: number;
  rejectedListings: number;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number; // percentage
}

export interface OwnerPGListingCard {
  id: string;
  name: string;
  address: string;
  verificationStatus: VerificationStatus;
  totalBeds: number;
  availableBeds: number;
  rent: number;
  createdAt: Date;
  lastUpdated: Date;
}

// ========== VERIFICATION BADGE ==========

export interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

// ========== OWNER INTERACTION ==========

export interface OwnerContactRequest {
  studentId: string;
  studentName: string;
  pgId: string;
  pgName: string;
  contactType: 'video-call' | 'physical-visit';
  requestedDate: Date;
  requestedTime: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  message?: string;
}

export interface OwnerInteractionProps {
  pgId: string;
  pgName: string;
  pgCoordinates: { lat: number; lng: number };
  pgCity: string;
  ownerName: string;
  userCity: string;
  userCoordinates?: { lat: number; lng: number };
}
