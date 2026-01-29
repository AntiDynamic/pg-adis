/**
 * PG Owner Module - Main Exports
 * 
 * Import components from this file:
 * import { PGOwnerSignupPage, PGOwnerDashboard, ... } from './pages/pg-owner';
 */

// Pages
export { default as PGOwnerSignupPage } from './pages/PGOwnerSignupPage';
export { default as PGOwnerDashboard } from './pages/PGOwnerDashboard';

// Components
export { default as PGProofUpload } from './components/PGProofUpload';
export { default as VerificationStatusBadge } from './components/VerificationStatusBadge';
export { VerificationStatusBadgeSolid } from './components/VerificationStatusBadge';
export { OwnerContactCTA } from './components/OwnerContactCTA';
export { default as AdminVerificationPanel } from './components/AdminVerificationPanel';

// Types
export type {
  VerificationStatus,
  PGOwnerProfile,
  PGOwnershipProof,
  PGListingWithVerification,
  RoomType,
  PGAddress,
  PGOwnerSignupData,
  OwnerDashboardStats,
  OwnerPGListingCard,
  VerificationBadgeProps,
  OwnerContactRequest,
  OwnerInteractionProps
} from './types';

// Utilities
export {
  getPGsByOwner,
  getVerifiedPGs,
  getPGsByStatus,
  calculateOwnerStats,
  validateOwnershipDoc,
  validateRoomPhotos,
  validateVideoWalkthrough,
  validateAllProofs,
  calculateDistance,
  isUserNearPG,
  formatVerificationStatus,
  getStatusColorClass,
  formatCurrency,
  formatDate,
  getStatusChangeMessage,
  sendOwnerNotification
} from './utils/ownerHelpers';
