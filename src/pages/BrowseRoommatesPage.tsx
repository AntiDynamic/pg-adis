import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { SearchIcon, LocationIcon, SparklesIcon } from '../components/ui/Icons';
import { mockUsers, getUsersByCity } from '../data/mockUsers';
import { Link } from 'react-router-dom';

/**
 * BROWSE ROOMMATES PAGE
 * 
 * Browse potential roommates by city without creating a profile
 * Great for exploring before committing to sign up
 */

const cities = ['Pune', 'Bangalore', 'Mumbai', 'Delhi'];

export const BrowseRoommatesPage: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [searchQuery, setSearchQuery] = useState('');

  const cityUsers = getUsersByCity(selectedCity);
  
  const filteredUsers = searchQuery
    ? cityUsers.filter((user) =>
        user.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.profile.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.profile.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.preferences.preferredAreas.some((area) =>
          area.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : cityUsers;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-dark-900">
        <div className="container-custom py-8">
          <div className="max-w-3xl">
            <Badge variant="new" icon={<SparklesIcon className="w-4 h-4" />} className="mb-4">
              Explore Without Signing Up
            </Badge>
            <h1 className="text-4xl font-bold mb-3">Browse Roommates</h1>
            <p className="text-xl text-gray-400">
              See who's looking for roommates in your city. Create a profile to see compatibility scores!
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* City Selection & Search */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* City Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select City
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`py-3 px-4 rounded-lg font-medium transition ${
                      selectedCity === city
                        ? 'bg-trust-500 text-white'
                        : 'bg-surface text-gray-300 hover:bg-surface-hover'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Search by name, college, or area
              </label>
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<SearchIcon />}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-trust-400">{cityUsers.length}</div>
              <div className="text-sm text-gray-400">Users in {selectedCity}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {cityUsers.filter((u) => u.profile.gender === 'female').length}
              </div>
              <div className="text-sm text-gray-400">Female</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {cityUsers.filter((u) => u.profile.gender === 'male').length}
              </div>
              <div className="text-sm text-gray-400">Male</div>
            </div>
          </div>
        </Card>

        {/* CTA Card */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-trust-500/10 to-emerald-500/10 border-trust-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Want to see compatibility scores?</h3>
              <p className="text-gray-400">
                Create your profile to find your perfect roommate match with AI-powered compatibility analysis
              </p>
            </div>
            <Link to="/roommate-matching">
              <Button variant="primary" size="lg">
                Create Profile →
              </Button>
            </Link>
          </div>
        </Card>

        {/* User Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <BrowseRoommateCard key={user.profile.id} user={user} />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center">
            <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No users found</h3>
            <p className="text-gray-400">
              Try adjusting your search or select a different city
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Browse Roommate Card
function BrowseRoommateCard({ user }: { user: typeof mockUsers[0] }) {
  const { profile, preferences } = user;

  return (
    <Card hoverable className="overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-br from-trust-500/5 to-surface">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-100 truncate">{profile.name}</h3>
            <div className="text-sm text-gray-400">
              {profile.age} • {profile.gender}
            </div>
          </div>
          {profile.verified && (
            <Badge variant="verified" className="text-xs flex-shrink-0">
              ✓
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Occupation */}
        {profile.college && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-500">🎓</span>
            <span className="text-gray-300 flex-1">{profile.college}</span>
          </div>
        )}
        {profile.company && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-500">💼</span>
            <span className="text-gray-300 flex-1">{profile.company}</span>
          </div>
        )}

        {/* Budget */}
        <div className="pt-2 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-1">Budget Range</div>
          <div className="text-gray-200 font-medium">
            ₹{preferences.budgetMin.toLocaleString()} - ₹{preferences.budgetMax.toLocaleString()}/mo
          </div>
        </div>

        {/* Preferred Areas */}
        {preferences.preferredAreas.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <LocationIcon className="w-3 h-3" />
              <span>Looking in</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {preferences.preferredAreas.slice(0, 2).map((area, idx) => (
                <Badge key={idx} variant="default" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick Highlights */}
        <div className="pt-2 border-t border-gray-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Room Type:</span>
            <span className="text-gray-300 capitalize">{preferences.roomSharing}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Cleanliness:</span>
            <span className="text-gray-300">
              {'⭐'.repeat(preferences.cleanlinessLevel)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Food:</span>
            <span className="text-gray-300 capitalize">{preferences.foodPreference}</span>
          </div>
        </div>

        {/* Lifestyle Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant={preferences.smoking === 'no' ? 'verified' : 'default'} className="text-xs">
            {preferences.smoking === 'no' ? '🚭' : '🚬'}
          </Badge>
          <Badge variant={preferences.drinking === 'no' ? 'verified' : 'default'} className="text-xs">
            {preferences.drinking === 'no' ? '🚫' : '🍺'}
          </Badge>
          {preferences.acPreference && (
            <Badge variant="default" className="text-xs">
              ❄️ AC
            </Badge>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Link to="/roommate-matching">
            <Button variant="outline" size="sm" fullWidth>
              See Compatibility
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default BrowseRoommatesPage;
