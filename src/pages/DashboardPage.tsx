import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  VerifiedIcon, 
  LocationIcon, 
  HeartIcon,
  UsersIcon,
  FoodIcon,
  SparklesIcon,
  CheckIcon,
  ClockIcon
} from '../components/ui/Icons';
import { UserDashboard } from '../types';

/**
 * USER DASHBOARD
 * 
 * Sections:
 * - Overview stats
 * - Saved PGs
 * - Roommate matches
 * - Active subscriptions
 * - Recent activity
 */

// Mock dashboard data
const mockDashboard: UserDashboard = {
  savedPGs: ['1', '2'],
  savedRoommates: ['1', '3'],
  matches: [
    {
      profileId: '1',
      compatibilityScore: 94,
      matchedFactors: ['Sleep Schedule', 'Cleanliness', 'Food Habits'],
      status: 'pending',
      matchedAt: new Date('2026-01-25')
    },
    {
      profileId: '2',
      compatibilityScore: 87,
      matchedFactors: ['Work Hours', 'Budget', 'Location'],
      status: 'accepted',
      matchedAt: new Date('2026-01-23')
    }
  ],
  subscriptions: [
    {
      id: '1',
      type: 'mess',
      name: 'South Indian Delights Mess',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      status: 'active',
      amount: 4500
    }
  ],
  recentViews: [
    { type: 'pg', id: '1', viewedAt: new Date('2026-01-26') },
    { type: 'roommate', id: '2', viewedAt: new Date('2026-01-26') }
  ]
};

const SavedPGCard: React.FC<{ pgId: string }> = ({ pgId: _pgId }) => {
  return (
    <Card hoverable className="overflow-hidden p-0">
      <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <LocationIcon className="w-12 h-12" />
        </div>
        <Badge variant="verified" icon={<VerifiedIcon className="w-3 h-3" />} className="absolute top-3 left-3">
          Verified
        </Badge>
        <button className="absolute top-3 right-3 w-8 h-8 bg-red-500/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/20 transition">
          <HeartIcon filled className="w-4 h-4 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-gray-100 mb-2">Green Valley PG</h4>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <LocationIcon className="w-4 h-4" />
          <span>Koramangala, Bangalore</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-trust-400">₹12,000/mo</span>
          <Button variant="outline" size="sm">View</Button>
        </div>
      </div>
    </Card>
  );
};

const RoommateMatchCard: React.FC<{ match: any }> = ({ match }) => {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
          AR
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-100">Ananya Reddy</h4>
            <Badge variant={match.status === 'accepted' ? 'verified' : 'default'} className="text-xs">
              {match.status === 'accepted' ? 'Accepted' : 'Pending'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="w-4 h-4 text-trust-400" />
            <span className="text-sm font-semibold text-trust-400">{match.compatibilityScore}% Match</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {match.matchedFactors.slice(0, 2).map((factor: string, idx: number) => (
              <span key={idx} className="text-xs px-2 py-1 bg-surface-elevated rounded text-gray-300 border border-gray-800">
                {factor}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {match.status === 'pending' ? (
              <>
                <Button variant="primary" size="sm" className="flex-1">Accept</Button>
                <Button variant="outline" size="sm" className="flex-1">Decline</Button>
              </>
            ) : (
              <Button variant="outline" size="sm" fullWidth>Message</Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const SubscriptionCard: React.FC<{ subscription: any }> = ({ subscription }) => {
  const daysLeft = Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="p-4 border-trust-500/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center">
          <FoodIcon className="w-6 h-6 text-trust-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-100">{subscription.name}</h4>
            <Badge variant="verified" className="text-xs">Active</Badge>
          </div>
          <div className="text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="w-4 h-4" />
              <span>{daysLeft} days remaining</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-trust-400">₹{subscription.amount.toLocaleString()}</span>
            <Button variant="outline" size="sm">Renew</Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'matches' | 'subscriptions'>('saved');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-dark-900">
        <div className="container-custom py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Priya! 👋</h1>
              <p className="text-gray-400">Here's what's happening with your PG search</p>
            </div>
            <Button variant="primary">
              <span className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                Complete Profile
              </span>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HeartIcon filled className="w-6 h-6 text-trust-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{mockDashboard.savedPGs.length}</div>
              <div className="text-sm text-gray-400">Saved PGs</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UsersIcon className="w-6 h-6 text-trust-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{mockDashboard.matches.length}</div>
              <div className="text-sm text-gray-400">Matches</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FoodIcon className="w-6 h-6 text-trust-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">{mockDashboard.subscriptions.length}</div>
              <div className="text-sm text-gray-400">Subscriptions</div>
            </Card>

            <Card className="p-4 text-center">
              <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <VerifiedIcon className="w-6 h-6 text-trust-400" />
              </div>
              <div className="text-2xl font-bold text-gray-100 mb-1">5</div>
              <div className="text-sm text-gray-400">Verified Views</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Section */}
          <div className="lg:col-span-8">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-800">
              {[
                { id: 'saved', label: 'Saved Items', count: mockDashboard.savedPGs.length },
                { id: 'matches', label: 'Matches', count: mockDashboard.matches.length },
                { id: 'subscriptions', label: 'Subscriptions', count: mockDashboard.subscriptions.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'text-trust-400 border-b-2 border-trust-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Saved PGs Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Saved PGs</h2>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {mockDashboard.savedPGs.map((pgId) => (
                    <SavedPGCard key={pgId} pgId={pgId} />
                  ))}
                </div>
              </div>
            )}

            {/* Matches Tab */}
            {activeTab === 'matches' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Roommate Matches</h2>
                  <Button variant="outline" size="sm">Find More</Button>
                </div>
                <div className="space-y-4">
                  {mockDashboard.matches.map((match, idx) => (
                    <RoommateMatchCard key={idx} match={match} />
                  ))}
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Active Subscriptions</h2>
                  <Button variant="outline" size="sm">Browse Messes</Button>
                </div>
                <div className="space-y-4">
                  {mockDashboard.subscriptions.map((sub) => (
                    <SubscriptionCard key={sub.id} subscription={sub} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Completion */}
            <Card className="p-6 bg-gradient-to-br from-trust-500/5 to-emerald-500/5 border-trust-500/20">
              <div className="flex items-center gap-3 mb-4">
                <SparklesIcon className="w-6 h-6 text-trust-400" />
                <h3 className="font-bold text-gray-100">Complete Your Profile</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">70% Complete</span>
                  <span className="text-trust-400 font-semibold">7/10</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-trust-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-trust-400" />
                  <span>Basic info added</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-trust-400" />
                  <span>Preferences set</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-700 rounded"></div>
                  <span>Add profile photo</span>
                </li>
              </ul>
              <Button variant="primary" size="sm" fullWidth>
                Complete Now
              </Button>
            </Card>

            {/* Recommendations */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-100 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b border-gray-800">
                  <div className="w-10 h-10 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <LocationIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-100 mb-1">Sunrise PG</h4>
                    <p className="text-xs text-gray-400 mb-2">Whitefield • ₹9,500/mo</p>
                    <Button variant="outline" size="sm" className="text-xs">View</Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-trust-600 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-100 mb-1">Karthik M.</h4>
                    <p className="text-xs text-gray-400 mb-2">87% Match • Working</p>
                    <Button variant="outline" size="sm" className="text-xs">View</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" size="sm" fullWidth className="justify-start">
                  <LocationIcon className="w-4 h-4 mr-2" />
                  Find More PGs
                </Button>
                <Button variant="outline" size="sm" fullWidth className="justify-start">
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Browse Roommates
                </Button>
                <Button variant="outline" size="sm" fullWidth className="justify-start">
                  <FoodIcon className="w-4 h-4 mr-2" />
                  Explore Messes
                </Button>
              </div>
            </Card>

            {/* PG Owner Section */}
            <Card className="p-6 bg-gradient-to-br from-trust-500/10 to-emerald-500/10 border-trust-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-trust-500/20 rounded-lg flex items-center justify-center">
                  <VerifiedIcon className="w-5 h-5 text-trust-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-100 text-sm">PG Owner?</h3>
                  <p className="text-xs text-gray-400">Manage your properties</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                fullWidth 
                onClick={() => window.location.href = '/owner/dashboard'}
              >
                Owner Dashboard
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
