import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import UnifiedNavbar, { QuickAccessButton } from '../../../components/UnifiedNavbar';
import VerificationStatusBadge from '../components/VerificationStatusBadge';
import { PGListingWithVerification, VerificationStatus } from '../types';
import { 
  calculateOwnerStats, 
  getPGsByStatus, 
  formatCurrency, 
  formatDate,
  getStatusChangeMessage 
} from '../utils/ownerHelpers';

interface PGOwnerDashboardProps {
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
}

export default function PGOwnerDashboard({ ownerId, ownerName, ownerEmail }: PGOwnerDashboardProps) {
  // Mock data - Replace with actual API call
  const [pgs] = useState<PGListingWithVerification[]>([
    {
      id: 'pg-1',
      ownerId: ownerId,
      name: 'Sunshine Boys PG',
      genderType: 'male',
      address: {
        street: '123 Main St',
        area: 'Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411038'
      },
      totalBeds: 20,
      availableBeds: 5,
      roomTypes: [
        { type: 'double', rent: 8000, available: 3 },
        { type: 'triple', rent: 6500, available: 2 }
      ],
      rent: 6500,
      securityDeposit: 10000,
      amenities: ['WiFi', 'AC', 'Laundry'],
      rules: ['No smoking', 'No guests after 10 PM'],
      messIncluded: true,
      noticePeriod: 30,
      verificationStatus: 'verified',
      verified: true,
      lastVerifiedAt: new Date('2025-01-15'),
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: 'pg-2',
      ownerId: ownerId,
      name: 'Happy Homes PG',
      genderType: 'unisex',
      address: {
        street: '456 Park Avenue',
        area: 'Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005'
      },
      totalBeds: 15,
      availableBeds: 0,
      roomTypes: [
        { type: 'single', rent: 12000, available: 0 }
      ],
      rent: 12000,
      securityDeposit: 15000,
      amenities: ['WiFi', 'Geyser', 'Security'],
      rules: ['No pets'],
      messIncluded: false,
      noticePeriod: 30,
      verificationStatus: 'pending_verification',
      verified: false,
      createdAt: new Date('2025-01-25'),
      updatedAt: new Date('2025-01-25')
    },
    {
      id: 'pg-3',
      ownerId: ownerId,
      name: 'Green Valley PG',
      genderType: 'female',
      address: {
        street: '789 Garden Road',
        area: 'Baner',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411045'
      },
      totalBeds: 12,
      availableBeds: 8,
      roomTypes: [
        { type: 'double', rent: 9000, available: 4 }
      ],
      rent: 9000,
      securityDeposit: 12000,
      amenities: ['WiFi', 'AC', 'Parking'],
      rules: ['No loud music after 10 PM'],
      messIncluded: true,
      noticePeriod: 30,
      verificationStatus: 'rejected',
      verified: false,
      rejectionReason: 'Photos do not match video walkthrough. Please resubmit with accurate media.',
      createdAt: new Date('2025-01-20'),
      updatedAt: new Date('2025-01-22')
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<VerificationStatus | 'all'>('all');

  const stats = calculateOwnerStats(ownerId, pgs);
  
  const filteredPGs = filterStatus === 'all' 
    ? pgs 
    : getPGsByStatus(ownerId, filterStatus, pgs);

  const renderStatsCard = (label: string, value: string | number, color: string, icon: string) => (
    <Card className={`p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-100">{value}</p>
        </div>
        <span className="text-4xl opacity-70">{icon}</span>
      </div>
    </Card>
  );

  const renderPGCard = (pg: PGListingWithVerification) => (
    <Card key={pg.id} className="p-6 hover:border-trust-500/30 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-100 mb-2">{pg.name}</h3>
          <p className="text-sm text-gray-400">
            {pg.address.area}, {pg.address.city}
          </p>
        </div>
        <VerificationStatusBadge status={pg.verificationStatus} size="md" showLabel />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Beds</p>
          <p className="text-lg font-semibold text-gray-100">{pg.totalBeds}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Available</p>
          <p className="text-lg font-semibold text-gray-100">{pg.availableBeds}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Starting Rent</p>
          <p className="text-lg font-semibold text-gray-100">{formatCurrency(pg.rent)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Occupancy</p>
          <p className="text-lg font-semibold text-gray-100">
            {Math.round(((pg.totalBeds - pg.availableBeds) / pg.totalBeds) * 100)}%
          </p>
        </div>
      </div>

      {/* Status-specific messages */}
      <div className="mb-4">
        {pg.verificationStatus === 'pending_verification' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-sm text-yellow-400">
              ⏳ {getStatusChangeMessage(pg.verificationStatus)}
            </p>
          </div>
        )}
        
        {pg.verificationStatus === 'verified' && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-sm text-green-400">
              ✓ Live and visible to students! Last verified: {formatDate(pg.lastVerifiedAt!)}
            </p>
          </div>
        )}
        
        {pg.verificationStatus === 'rejected' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-2">
            <p className="text-sm text-red-400 font-semibold">
              ✕ Listing Rejected
            </p>
            {pg.rejectionReason && (
              <p className="text-sm text-red-300">
                <strong>Reason:</strong> {pg.rejectionReason}
              </p>
            )}
            <Button variant="outline" size="sm" className="mt-2">
              Resubmit with Corrections
            </Button>
          </div>
        )}
        
        {pg.verificationStatus === 'resubmission_required' && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <p className="text-sm text-orange-400">
              ↻ {getStatusChangeMessage(pg.verificationStatus)}
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Update Submission
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" fullWidth>
          View Details
        </Button>
        {pg.verificationStatus === 'verified' && (
          <Button variant="outline" size="sm" fullWidth>
            Edit Listing
          </Button>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <span>Created: {formatDate(pg.createdAt)}</span>
        <span>Updated: {formatDate(pg.updatedAt)}</span>
      </div>
    </Card>
  );

  return (
    <>
      {/* Unified Navigation Bar */}
      <UnifiedNavbar 
        userName={ownerName}
        userType="owner"
        isOwner={true}
      />
      
      {/* Quick Access Button (Mobile) */}
      <QuickAccessButton />
      
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="container-custom max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">PG Owner Dashboard</h1>
          <p className="text-gray-400">Welcome back, {ownerName}! • {ownerEmail}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatsCard('Total Listings', stats.totalListings, 'bg-surface-elevated', '🏢')}
          {renderStatsCard('Verified', stats.verifiedListings, 'bg-green-500/5', '✓')}
          {renderStatsCard('Pending', stats.pendingListings, 'bg-yellow-500/5', '⏳')}
          {renderStatsCard('Occupancy', `${stats.occupancyRate}%`, 'bg-trust-500/5', '📊')}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-surface-elevated">
            <p className="text-sm text-gray-400 mb-2">Total Capacity</p>
            <p className="text-2xl font-bold text-gray-100">{stats.totalBeds} beds</p>
          </Card>
          <Card className="p-6 bg-surface-elevated">
            <p className="text-sm text-gray-400 mb-2">Currently Occupied</p>
            <p className="text-2xl font-bold text-gray-100">{stats.occupiedBeds} beds</p>
          </Card>
          <Card className="p-6 bg-surface-elevated">
            <p className="text-sm text-gray-400 mb-2">Available Beds</p>
            <p className="text-2xl font-bold text-gray-100">{stats.totalBeds - stats.occupiedBeds} beds</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4">
          <Button variant="primary" size="lg">
            + Add New PG Listing
          </Button>
          <Button variant="outline" size="lg">
            View Contact Requests
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'all'
                ? 'bg-trust-500 text-white'
                : 'bg-surface-elevated text-gray-400 hover:bg-surface-elevated/80'
            }`}
          >
            All ({pgs.length})
          </button>
          <button
            onClick={() => setFilterStatus('verified')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'verified'
                ? 'bg-trust-500 text-white'
                : 'bg-surface-elevated text-gray-400 hover:bg-surface-elevated/80'
            }`}
          >
            Verified ({stats.verifiedListings})
          </button>
          <button
            onClick={() => setFilterStatus('pending_verification')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'pending_verification'
                ? 'bg-trust-500 text-white'
                : 'bg-surface-elevated text-gray-400 hover:bg-surface-elevated/80'
            }`}
          >
            Pending ({stats.pendingListings})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'rejected'
                ? 'bg-trust-500 text-white'
                : 'bg-surface-elevated text-gray-400 hover:bg-surface-elevated/80'
            }`}
          >
            Rejected ({stats.rejectedListings})
          </button>
        </div>

        {/* PG Listings */}
        <div className="space-y-4">
          {filteredPGs.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-6xl mb-4 block">🏢</span>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                No {filterStatus !== 'all' && filterStatus.replace('_', ' ')} listings found
              </h3>
              <p className="text-gray-400 mb-6">
                {filterStatus === 'all' 
                  ? 'Start by adding your first PG listing'
                  : 'Try selecting a different filter'}
              </p>
              {filterStatus === 'all' && (
                <Button variant="primary">
                  + Add Your First PG
                </Button>
              )}
            </Card>
          ) : (
            filteredPGs.map(renderPGCard)
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8 p-6 bg-trust-500/5 border-trust-500/20">
          <div className="flex gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Questions about verification, listing updates, or managing your PGs? We're here to help!
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  View FAQ
                </Button>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
