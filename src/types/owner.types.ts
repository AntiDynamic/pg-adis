/**
 * PG OWNER VERIFICATION SYSTEM - TYPE DEFINITIONS
 * Database-ready type definitions for MongoDB/PostgreSQL
 * 
 * Collection/Table Structure:
 * - pg_owners
 * - pg_listings
 * - verification_proofs
 * - owner_interactions
 */

// ========== VERIFICATION STATUS ==========

export type VerificationStatus = 
  | 'pending_verification'      // Just submitted, awaiting admin review
  | 'under_review'              // Admin is reviewing
  | 'verified'                  // Approved - visible to students
  | 'rejected'                  // Rejected - not shown to students
  | 'resubmission_required';    // Needs corrections

export type ProofType = 
  | 'ownership_document'
  | 'room_photos'
  | 'video_walkthrough';

// ========== DATABASE MODELS ==========

/**
 * PG Owner Profile - Main owner account
 * Collection: pg_owners
 */
export interface PGOwner {
  _id?: string;                  // MongoDB ID or auto-increment for SQL
  id: string;                    // UUID for public reference
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  aadharNumber?: string;         // Optional KYC
  
  // Authentication
  passwordHash?: string;         // For future auth
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // Account status
  accountStatus: 'active' | 'suspended' | 'pending';
  kycStatus: 'not_started' | 'pending' | 'verified' | 'rejected';
  
  // Stats
  totalPGs: number;
  activePGs: number;
  verifiedPGs: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

/**
 * PG Listing - Individual property listing
 * Collection: pg_listings
 */
export interface PGListing {
  _id?: string;
  id: string;                    // UUID for public reference
  ownerId: string;               // Reference to PGOwner.id
  
  // Basic Details
  name: string;
  description?: string;
  genderType: 'male' | 'female' | 'unisex';
  
  // Address
  address: {
    street: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Capacity & Rooms
  totalBeds: number;
  availableBeds: number;
  roomTypes: Array<{
    type: 'single' | 'double' | 'triple' | 'dormitory';
    count: number;              // Number of rooms of this type
    bedsPerRoom: number;
    rent: number;
    available: number;
  }>;
  
  // Pricing
  rentRange: {
    min: number;
    max: number;
  };
  securityDeposit: number;
  maintenanceCharges?: number;
  
  // Features
  amenities: string[];           // ['WiFi', 'AC', 'Laundry', 'Parking', etc.]
  foodIncluded: boolean;
  foodType?: 'veg' | 'non-veg' | 'both';
  mealsTiming?: string[];
  rules: string[];               // ['No smoking', 'No guests after 10 PM', etc.]
  noticePeriod: number;          // in days
  
  // Verification & Status
  verificationStatus: VerificationStatus;
  verified: boolean;             // Quick boolean for queries
  verifiedAt?: Date;
  verifiedBy?: string;           // Admin ID who verified
  rejectionReason?: string;
  
  // Proofs (Reference to verification_proofs)
  proofsId?: string;
  
  // Visibility
  isActive: boolean;             // Owner can activate/deactivate
  isPublished: boolean;          // Only verified PGs are published
  
  // Engagement Stats
  views: number;
  contactRequests: number;
  bookings: number;
  rating?: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Verification Proofs - Uploaded documents/media
 * Collection: verification_proofs
 */
export interface VerificationProofs {
  _id?: string;
  id: string;
  pgListingId: string;           // Reference to PGListing.id
  ownerId: string;
  
  // Ownership Document (MANDATORY)
  ownershipDocument: {
    type: 'electricity_bill' | 'water_bill' | 'property_tax' | 'rental_agreement' | 'ownership_deed' | 'other';
    fileUrl: string;             // S3/Cloud storage URL
    fileName: string;
    fileSize: number;            // in bytes
    mimeType: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    uploadedAt: Date;
    verifiedAt?: Date;
  };
  
  // Room Photos (MANDATORY - min 5)
  roomPhotos: Array<{
    id: string;
    url: string;
    fileName: string;
    fileSize: number;
    category: 'room' | 'washroom' | 'kitchen' | 'common_area' | 'entrance' | 'exterior' | 'other';
    caption?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    uploadedAt: Date;
    verifiedAt?: Date;
  }>;
  
  // Video Walkthrough (MANDATORY - 30-90 sec)
  videoWalkthrough: {
    url: string;
    fileName: string;
    fileSize: number;
    duration: number;            // in seconds
    thumbnailUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    uploadedAt: Date;
    verifiedAt?: Date;
  };
  
  // Overall Status
  overallStatus: VerificationStatus;
  adminNotes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;           // Admin ID
}

/**
 * Owner Interaction - Student-Owner interactions
 * Collection: owner_interactions
 */
export interface OwnerInteraction {
  _id?: string;
  id: string;
  
  // Parties
  studentId: string;
  ownerId: string;
  pgListingId: string;
  
  // Interaction Type
  type: 'video_call_request' | 'physical_visit_request' | 'contact_request' | 'booking_inquiry';
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  
  // Details
  message?: string;
  scheduledDate?: Date;
  scheduledTime?: string;
  
  // Location context (for visit requests)
  studentLocation?: {
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  distance?: number;             // in km
  
  // Communication
  ownerResponse?: string;
  responseAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * Admin Verification Action - Audit trail
 * Collection: verification_actions
 */
export interface VerificationAction {
  _id?: string;
  id: string;
  
  pgListingId: string;
  proofsId: string;
  adminId: string;
  adminName: string;
  
  action: 'approve' | 'reject' | 'request_resubmission';
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  
  reason?: string;
  notes?: string;
  
  // What was checked
  checksPerformed: {
    ownershipDoc: boolean;
    roomPhotos: boolean;
    videoWalkthrough: boolean;
    addressVerification: boolean;
  };
  
  createdAt: Date;
}

// ========== FORM DATA TYPES ==========

/**
 * Owner Signup Form Data
 */
export interface OwnerSignupFormData {
  // Step 1: Owner Info
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
      landmark?: string;
      city: string;
      state: string;
      pincode: string;
    };
    totalBeds: number;
    roomTypes: Array<{
      type: 'single' | 'double' | 'triple' | 'dormitory';
      count: number;
      rent: number;
      available: number;
    }>;
    securityDeposit: number;
    amenities: string[];
    foodIncluded: boolean;
    rules: string[];
    noticePeriod: number;
  };
  
  // Step 3: Proofs (handled by upload component)
}

// ========== API RESPONSE TYPES ==========

export interface PGOwnerDashboardStats {
  totalPGs: number;
  verifiedPGs: number;
  pendingPGs: number;
  rejectedPGs: number;
  totalViews: number;
  totalContactRequests: number;
  totalBookings: number;
}

export interface VerificationStatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// ========== UTILITY TYPES ==========

export interface FileUpload {
  file: File;
  preview: string;
  category?: string;
  uploadProgress?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ========== API REQUEST/RESPONSE TYPES ==========

export interface CreatePGOwnerRequest {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  aadharNumber?: string;
}

export interface CreatePGOwnerResponse {
  success: boolean;
  data?: {
    owner: PGOwner;
    token?: string;
  };
  error?: string;
}

export interface CreatePGListingRequest {
  ownerId: string;
  pgDetails: OwnerSignupFormData['pgDetails'];
}

export interface CreatePGListingResponse {
  success: boolean;
  data?: {
    listing: PGListing;
  };
  error?: string;
}

export interface UploadProofsRequest {
  pgListingId: string;
  ownerId: string;
  ownershipDocument: File;
  roomPhotos: File[];
  videoWalkthrough: File;
}

export interface UploadProofsResponse {
  success: boolean;
  data?: {
    proofs: VerificationProofs;
  };
  error?: string;
}

// ========== FILTER & SEARCH TYPES ==========

export interface PGListingFilters {
  city?: string;
  area?: string;
  genderType?: 'male' | 'female' | 'unisex';
  rentMin?: number;
  rentMax?: number;
  amenities?: string[];
  foodIncluded?: boolean;
  verifiedOnly: boolean;         // ALWAYS filter by this for students
}

export interface OwnerPGFilters {
  status?: VerificationStatus[];
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'views' | 'contactRequests';
  sortOrder?: 'asc' | 'desc';
}
