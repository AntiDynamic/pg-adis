/**
 * PG Owner Utilities
 * Helper functions for owner operations
 */

import { PGListingWithVerification, VerificationStatus, OwnerDashboardStats } from '../types';

// ========== FILTERING FUNCTIONS ==========

/**
 * Get all PGs for a specific owner
 */
export function getPGsByOwner(ownerId: string, pgs: PGListingWithVerification[]): PGListingWithVerification[] {
  return pgs.filter((pg) => pg.ownerId === ownerId);
}

/**
 * Get only verified PGs (for student view)
 */
export function getVerifiedPGs(pgs: PGListingWithVerification[]): PGListingWithVerification[] {
  return pgs.filter(
    (pg) => pg.verificationStatus === 'verified' || 
            (pg.verified && !pg.verificationStatus) // Legacy support
  );
}

/**
 * Get PGs by verification status
 */
export function getPGsByStatus(
  ownerId: string, 
  status: VerificationStatus,
  pgs: PGListingWithVerification[]
): PGListingWithVerification[] {
  return pgs.filter((pg) => pg.ownerId === ownerId && pg.verificationStatus === status);
}

// ========== STATS CALCULATIONS ==========

/**
 * Calculate dashboard statistics for owner
 */
export function calculateOwnerStats(ownerId: string, pgs: PGListingWithVerification[]): OwnerDashboardStats {
  const ownerPGs = getPGsByOwner(ownerId, pgs);
  
  const totalListings = ownerPGs.length;
  const verifiedListings = ownerPGs.filter(pg => pg.verificationStatus === 'verified').length;
  const pendingListings = ownerPGs.filter(pg => pg.verificationStatus === 'pending_verification').length;
  const rejectedListings = ownerPGs.filter(pg => pg.verificationStatus === 'rejected').length;
  
  const totalBeds = ownerPGs.reduce((sum, pg) => sum + pg.totalBeds, 0);
  const occupiedBeds = ownerPGs.reduce((sum, pg) => sum + (pg.totalBeds - pg.availableBeds), 0);
  const occupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
  
  return {
    totalListings,
    verifiedListings,
    pendingListings,
    rejectedListings,
    totalBeds,
    occupiedBeds,
    occupancyRate: Math.round(occupancyRate * 10) / 10 // Round to 1 decimal
  };
}

// ========== VALIDATION FUNCTIONS ==========

/**
 * Validate ownership document
 */
export function validateOwnershipDoc(file: File | null): string | null {
  if (!file) {
    return 'Ownership document is required';
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }
  
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only PDF, JPG, or PNG files are allowed';
  }
  
  return null;
}

/**
 * Validate room photos
 */
export function validateRoomPhotos(files: File[]): string | null {
  if (files.length < 5) {
    return 'Minimum 5 photos required';
  }
  
  if (files.length > 10) {
    return 'Maximum 10 photos allowed';
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB per photo
  for (const file of files) {
    if (file.size > maxSize) {
      return `Photo "${file.name}" exceeds 5MB limit`;
    }
    
    if (!file.type.startsWith('image/')) {
      return `File "${file.name}" is not an image`;
    }
  }
  
  return null;
}

/**
 * Validate video walkthrough
 */
export function validateVideoWalkthrough(file: File | null): string | null {
  if (!file) {
    return 'Video walkthrough is required';
  }
  
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return 'Video size must be less than 100MB';
  }
  
  if (!file.type.startsWith('video/')) {
    return 'File must be a video';
  }
  
  return null;
}

/**
 * Validate all proofs
 */
export function validateAllProofs(proofs: {
  ownershipDoc: File | null;
  roomPhotos: File[];
  videoWalkthrough: File | null;
}): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  
  const ownershipError = validateOwnershipDoc(proofs.ownershipDoc);
  if (ownershipError) errors.ownership = ownershipError;
  
  const photosError = validateRoomPhotos(proofs.roomPhotos);
  if (photosError) errors.photos = photosError;
  
  const videoError = validateVideoWalkthrough(proofs.videoWalkthrough);
  if (videoError) errors.video = videoError;
  
  return errors;
}

// ========== DISTANCE CALCULATION ==========

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if user is near PG (within 50km)
 */
export function isUserNearPG(
  userCoordinates: { lat: number; lng: number } | undefined,
  pgCoordinates: { lat: number; lng: number },
  thresholdKm: number = 50
): boolean {
  if (!userCoordinates) return false;
  
  const distance = calculateDistance(
    userCoordinates.lat,
    userCoordinates.lng,
    pgCoordinates.lat,
    pgCoordinates.lng
  );
  
  return distance < thresholdKm;
}

// ========== FORMATTING FUNCTIONS ==========

/**
 * Format verification status for display
 */
export function formatVerificationStatus(status: VerificationStatus): string {
  const statusMap: Record<VerificationStatus, string> = {
    'pending_verification': 'Pending Review',
    'verified': 'Verified',
    'rejected': 'Rejected',
    'resubmission_required': 'Resubmission Required'
  };
  
  return statusMap[status];
}

/**
 * Get status color class
 */
export function getStatusColorClass(status: VerificationStatus): string {
  const colorMap: Record<VerificationStatus, string> = {
    'verified': 'text-green-600 bg-green-50 border-green-200',
    'pending_verification': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'rejected': 'text-red-600 bg-red-50 border-red-200',
    'resubmission_required': 'text-orange-600 bg-orange-50 border-orange-200'
  };
  
  return colorMap[status];
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// ========== EMAIL/NOTIFICATION HELPERS ==========

/**
 * Get status change message for owner
 */
export function getStatusChangeMessage(status: VerificationStatus): string {
  const messages: Record<VerificationStatus, string> = {
    'pending_verification': 'Your PG listing is under review. You will hear from us within 24-48 hours.',
    'verified': '✓ Congratulations! Your PG is now live and visible to students.',
    'rejected': 'Your submission was rejected. Please check your email for details and resubmit.',
    'resubmission_required': 'Additional information needed. Please update and resubmit your listing.'
  };
  
  return messages[status];
}

/**
 * Mock function to send email (replace with actual implementation)
 */
export async function sendOwnerNotification(
  _ownerId: string,
  email: string,
  status: VerificationStatus,
  additionalInfo?: string
): Promise<void> {
  console.log(`[Email] To: ${email}`);
  console.log(`[Email] Status: ${status}`);
  console.log(`[Email] Message: ${getStatusChangeMessage(status)}`);
  if (additionalInfo) {
    console.log(`[Email] Additional Info: ${additionalInfo}`);
  }
  
  // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
  return Promise.resolve();
}
