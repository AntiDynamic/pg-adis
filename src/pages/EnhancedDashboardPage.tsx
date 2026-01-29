/**
 * ENHANCED DASHBOARD PAGE
 * Now includes PG Owner Management Section
 * 
 * Features:
 * - Student Dashboard (existing)
 * - PG Owner Section (new - integrated into same view)
 * - Switch between Student/Owner modes
 */

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  VerifiedIcon,
  LocationIcon,
  HeartIcon,
  UsersIcon,
  FoodIcon
} from '../components/ui/Icons';
import UnifiedNavbar, { QuickAccessButton } from '../components/UnifiedNavbar';
import type { PGOwner, PGListing, VerificationStatus } from '../types/owner.types';
import { getStatusColor, formatVerificationStatus } from '../services/ownerService';

type DashboardMode = 'student' | 'owner';

interface Props {
  // Current user info
  userId: string;
  userName: string;
  userType?: 'student' | 'owner' | 'both';  // Can be both!
  
  // Owner info (if applicable)
  ownerProfile?: PGOwner;
}

export default function EnhancedDashboardPage({ 
  userId, 
  userName, 
  userType = 'student',
  ownerProfile 
}: Props) {
  const [mode, setMode] = useState<DashboardMode>(
    userType === 'owner' ? 'owner' : 'student'
  );
  
  // Mock owner data (replace with actual API calls)
  const [ownerStats] = useState({
    totalPGs: 3,
    verifiedPGs: 1,
    pendingPGs: 2,
    rejectedPGs: 0,
    totalViews: 127,
    totalContactRequests: 15,
    totalBookings: 8
  });
  
  const [ownerPGListings] = useState<PGListing[]>([]);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Unified Navigation Bar */}
      <UnifiedNavbar 
        userName={userName}
        userType={userType}
        isOwner={!!ownerProfile}
      />
      
      {/* Quick Access Button (Mobile) */}
      <QuickAccessButton />
      
      {/* Header with Mode Switcher */}
      <div className="border-b border-gray-800 bg-dark-900">
        <div className="container-custom py-6">
          {/* Mode Switcher (if user is both student and owner) - Kept for desktop clarity */}
          {userType === 'both' && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-surface-elevated rounded-lg p-1 border border-gray-800">
                <button
                  onClick={() => setMode('student')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                    mode === 'student'
                      ? 'bg-trust-500 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  🎒 Student Dashboard
                </button>
                <button
                  onClick={() => setMode('owner')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                    mode === 'owner'
                      ? 'bg-trust-500 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  🏠 PG Owner Dashboard
                </button>
              </div>
            </div>
          )}
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {mode === 'student' 
                  ? `Welcome back, ${userName}! 👋`
                  : `PG Owner Dashboard`
                }
              </h1>
              <p className="text-gray-400">
                {mode === 'student'
                  ? "Here's what's happening with your PG search"
                  : 'Manage your properties and verification status'
                }
              </p>
            </div>
            
            {mode === 'owner' && (
              <Button 
                variant="primary"
                onClick={() => window.location.href = '/owner/signup'}
              >
                + Add New PG
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container-custom section-padding">
        {mode === 'student' ? (
          <StudentDashboardView userId={userId} />
        ) : (
          <OwnerDashboardView 
            ownerProfile={ownerProfile}
            stats={ownerStats}
            listings={ownerPGListings}
          />
        )}
      </div>

      {/* CTA Section */}
      {mode === 'student' && userType !== 'owner' && (
        <BecomeOwnerCTA onBecomeOwner={() => setMode('owner')} />
      )}
    </div>
  );
}

// ========== STUDENT DASHBOARD VIEW ==========

function StudentDashboardView({ userId: _userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'saved' | 'matches' | 'subscriptions'>('saved');
  
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={<HeartIcon filled />} value={2} label="Saved PGs" />
        <StatsCard icon={<UsersIcon />} value={5} label="Matches" />
        <StatsCard icon={<FoodIcon />} value={1} label="Subscriptions" />
        <StatsCard icon={<VerifiedIcon />} value={12} label="Verified Views" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <TabButton
          active={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
          label="Saved PGs"
          count={2}
        />
        <TabButton
          active={activeTab === 'matches'}
          onClick={() => setActiveTab('matches')}
          label="Matches"
          count={5}
        />
        <TabButton
          active={activeTab === 'subscriptions'}
          onClick={() => setActiveTab('subscriptions')}
          label="Subscriptions"
          count={1}
        />
      </div>

      {/* Tab Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {activeTab === 'saved' && <SavedPGsTab />}
          {activeTab === 'matches' && <MatchesTab />}
          {activeTab === 'subscriptions' && <SubscriptionsTab />}
        </div>
        
        <div className="lg:col-span-4">
          <StudentSidebar />
        </div>
      </div>
    </>
  );
}

// ========== PG OWNER DASHBOARD VIEW ==========

interface OwnerDashboardViewProps {
  ownerProfile?: PGOwner;
  stats: any;
  listings: PGListing[];
}

function OwnerDashboardView({ ownerProfile: _ownerProfile, stats, listings }: OwnerDashboardViewProps) {
  return (
    <>
      {/* Owner Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <OwnerStatsCard
          label="Total PGs"
          value={stats.totalPGs}
          icon="🏠"
          color="blue"
        />
        <OwnerStatsCard
          label="Verified"
          value={stats.verifiedPGs}
          icon="✅"
          color="green"
        />
        <OwnerStatsCard
          label="Pending"
          value={stats.pendingPGs}
          icon="⏳"
          color="yellow"
        />
        <OwnerStatsCard
          label="Total Views"
          value={stats.totalViews}
          icon="👁️"
          color="purple"
        />
      </div>

      {/* Engagement Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-trust-400 mb-1">
              {stats.totalContactRequests}
            </div>
            <div className="text-sm text-gray-400">Contact Requests</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-trust-400 mb-1">
              {stats.totalBookings}
            </div>
            <div className="text-sm text-gray-400">Total Bookings</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-trust-400 mb-1">
              {((stats.totalContactRequests / stats.totalViews) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Conversion Rate</div>
          </div>
        </Card>
      </div>

      {/* PG Listings */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your PG Listings</h2>
          <Button variant="outline" size="sm">Filter</Button>
        </div>
        
        {listings.length === 0 ? (
          <EmptyStateOwner />
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <OwnerPGCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ========== COMPONENTS ==========

function StatsCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <Card className="p-4 text-center">
      <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
        {React.cloneElement(icon as React.ReactElement, { 
          className: "w-6 h-6 text-trust-400" 
        })}
      </div>
      <div className="text-2xl font-bold text-gray-100 mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </Card>
  );
}

function TabButton({ active, onClick, label, count }: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition ${
        active
          ? 'text-trust-400 border-b-2 border-trust-400'
          : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      {label} ({count})
    </button>
  );
}

function OwnerStatsCard({ label, value, icon, color }: {
  label: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
    green: 'from-green-500/10 to-green-600/10 border-green-500/20',
    yellow: 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
  };
  
  return (
    <Card className={`p-6 bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-gray-100 mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </Card>
  );
}

function OwnerPGCard({ listing }: { listing: PGListing }) {
  return (
    <Card className="p-6 hover:border-trust-500/30 transition">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">{listing.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LocationIcon className="w-4 h-4" />
                <span>{listing.address.area}, {listing.address.city}</span>
              </div>
            </div>
            <VerificationStatusBadge status={listing.verificationStatus} />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Rent Range</div>
              <div className="font-semibold text-gray-200">
                ₹{listing.rentRange.min.toLocaleString()} - ₹{listing.rentRange.max.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Total Beds</div>
              <div className="font-semibold text-gray-200">{listing.totalBeds}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Available</div>
              <div className="font-semibold text-gray-200">{listing.availableBeds}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Views</div>
              <div className="font-semibold text-gray-200">{listing.views}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Edit Details</Button>
            <Button variant="outline" size="sm">View Proofs</Button>
            {listing.verified && (
              <Button variant="primary" size="sm">View Listing</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function VerificationStatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {formatVerificationStatus(status)}
    </div>
  );
}

function EmptyStateOwner() {
  return (
    <Card className="p-12 text-center">
      <div className="text-6xl mb-4">🏠</div>
      <h3 className="text-xl font-bold text-gray-100 mb-2">No PG Listings Yet</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Start by adding your first PG. Complete the verification process to make it visible to students.
      </p>
      <Button 
        variant="primary"
        onClick={() => window.location.href = '/owner/signup'}
      >
        + Add Your First PG
      </Button>
    </Card>
  );
}

// Placeholder components for student tabs
function SavedPGsTab() {
  return <div className="text-gray-400">Saved PGs content...</div>;
}

function MatchesTab() {
  return <div className="text-gray-400">Matches content...</div>;
}

function SubscriptionsTab() {
  return <div className="text-gray-400">Subscriptions content...</div>;
}

function StudentSidebar() {
  return <div className="text-gray-400">Sidebar content...</div>;
}

function BecomeOwnerCTA({ onBecomeOwner }: { onBecomeOwner: () => void }) {
  return (
    <div className="bg-gradient-to-r from-trust-500/10 to-emerald-500/10 border-t border-trust-500/20">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-3xl font-bold mb-4">Own a PG?</h2>
          <p className="text-gray-400 mb-6 text-lg">
            List your property and get verified to reach 50,000+ students
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={onBecomeOwner}
          >
            Become a PG Owner
          </Button>
        </div>
      </div>
    </div>
  );
}
