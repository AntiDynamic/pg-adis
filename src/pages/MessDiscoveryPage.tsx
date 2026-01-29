import React, { useState } from 'react';
import MessMap from '../components/MessMap';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Rating } from '../components/ui/Rating';
import { Input } from '../components/ui/Input';
import { 
  VerifiedIcon, 
  FoodIcon, 
  SearchIcon,
  LocationIcon,
  ShieldIcon,
  ClockIcon,
  CheckIcon,
  HeartIcon
} from '../components/ui/Icons';
import { MessListing } from '../types';

/**
 * MESS/FOOD DISCOVERY PAGE
 * 
 * Features:
 * - Daily menu preview
 * - Hygiene ratings
 * - Student reviews
 * - Pricing transparency
 * - Subscription options
 */

// Mock data
const mockMessListings: MessListing[] = [
  {
    id: '1',
    name: 'South Indian Delights Mess',
    location: 'Koramangala 5th Block',
    rating: 4.6,
    reviewCount: 342,
    pricing: { monthly: 4500, perMeal: 60 },
    cuisine: ['South Indian', 'North Indian', 'Continental'],
    images: ['mess1.jpg'],
    hygieneRating: 9.2,
    verified: true,
    timings: {
      breakfast: '7:00 AM - 9:30 AM',
      lunch: '12:00 PM - 2:30 PM',
      dinner: '7:00 PM - 9:30 PM'
    },
    menu: [
      {
        day: 'Monday',
        meals: {
          breakfast: ['Idli', 'Vada', 'Sambar', 'Chutney', 'Coffee/Tea'],
          lunch: ['Rice', 'Dal', 'Veg Curry', 'Chapati', 'Curd', 'Salad'],
          dinner: ['Rice', 'Sambar', 'Rasam', 'Dry Veg', 'Chapati', 'Sweet']
        }
      },
      {
        day: 'Tuesday',
        meals: {
          breakfast: ['Dosa', 'Potato Masala', 'Chutney', 'Coffee/Tea'],
          lunch: ['Pulao', 'Paneer Curry', 'Dal', 'Chapati', 'Raita'],
          dinner: ['Rice', 'Mixed Veg', 'Dal Fry', 'Chapati', 'Papad']
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Healthy Bites Mess',
    location: 'HSR Layout Sector 1',
    rating: 4.4,
    reviewCount: 228,
    pricing: { monthly: 4200, perMeal: 55 },
    cuisine: ['North Indian', 'Chinese', 'Continental'],
    images: ['mess2.jpg'],
    hygieneRating: 8.8,
    verified: true,
    timings: {
      breakfast: '7:30 AM - 10:00 AM',
      lunch: '12:30 PM - 3:00 PM',
      dinner: '7:30 PM - 10:00 PM'
    },
    menu: [
      {
        day: 'Monday',
        meals: {
          breakfast: ['Poha', 'Bread Butter', 'Boiled Eggs', 'Milk/Coffee'],
          lunch: ['Rice', 'Dal Tadka', 'Mix Veg', 'Chapati', 'Pickle'],
          dinner: ['Fried Rice', 'Manchurian', 'Soup', 'Spring Rolls']
        }
      }
    ]
  }
];

const MessCard: React.FC<{ mess: MessListing }> = ({ mess }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card hoverable className="overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon/Image */}
        <div className="w-16 h-16 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <FoodIcon className="w-8 h-8 text-white" />
        </div>

        {/* Title and Location */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-100">{mess.name}</h3>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-9 h-9 bg-surface hover:bg-surface-hover rounded-lg flex items-center justify-center transition"
            >
              <HeartIcon filled={isFavorite} className={`w-4 h-4 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <LocationIcon className="w-4 h-4" />
            <span className="text-sm">{mess.location}</span>
          </div>
          {mess.verified && (
            <Badge variant="verified" icon={<VerifiedIcon className="w-3 h-3" />} className="text-xs">
              Verified & Inspected
            </Badge>
          )}
        </div>
      </div>

      {/* Rating and Hygiene */}
      <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-800">
        <div>
          <Rating rating={mess.rating} size="sm" />
          <div className="text-xs text-gray-400 mt-1">{mess.reviewCount} reviews</div>
        </div>
        <div className="h-10 w-px bg-gray-800"></div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldIcon className="w-4 h-4 text-trust-400" />
            <span className="text-sm font-medium text-gray-300">Hygiene</span>
          </div>
          <div className="text-lg font-bold text-trust-400">{mess.hygieneRating}/10</div>
        </div>
      </div>

      {/* Cuisine Tags */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-400 mb-2">Cuisine</div>
        <div className="flex flex-wrap gap-2">
          {mess.cuisine.map((cuisine: string, idx: number) => (
            <span key={idx} className="px-3 py-1 bg-surface-elevated rounded-lg text-xs text-gray-300 border border-gray-700">
              {cuisine}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-4 pb-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-trust-400">₹{mess.pricing.monthly.toLocaleString()}</div>
            <div className="text-xs text-gray-400">per month (3 meals/day)</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-300">₹{mess.pricing.perMeal}</div>
            <div className="text-xs text-gray-400">per meal</div>
          </div>
        </div>
      </div>

      {/* Timings */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          Meal Timings
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Breakfast</span>
            <span className="text-gray-300">{mess.timings.breakfast}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lunch</span>
            <span className="text-gray-300">{mess.timings.lunch}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dinner</span>
            <span className="text-gray-300">{mess.timings.dinner}</span>
          </div>
        </div>
      </div>

      {/* Today's Menu Preview */}
      {mess.menu.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-800">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-full text-left text-sm font-medium text-trust-400 hover:text-trust-300 transition flex items-center justify-between"
          >
            <span>View This Week's Menu</span>
            <span className="text-gray-400">{showMenu ? '▲' : '▼'}</span>
          </button>
          
          {showMenu && (
            <div className="mt-4 space-y-4">
              {mess.menu.slice(0, 2).map((day: { day: string; meals: { breakfast: string[]; lunch: string[]; dinner: string[] } }) => (
                <div key={day.day} className="bg-surface-elevated rounded-lg p-3 border border-gray-800">
                  <div className="font-medium text-gray-200 mb-2 text-sm">{day.day}</div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-500">Breakfast: </span>
                      <span className="text-gray-300">{day.meals.breakfast.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Lunch: </span>
                      <span className="text-gray-300">{day.meals.lunch.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Dinner: </span>
                      <span className="text-gray-300">{day.meals.dinner.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" fullWidth>
          View Details
        </Button>
        <Button variant="primary" size="sm" fullWidth>
          Subscribe
        </Button>
      </div>
    </Card>
  );
};

export const MessDiscoveryPage: React.FC<{ showMessMap: boolean, setShowMessMap: (v: boolean) => void }> = ({ showMessMap, setShowMessMap }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="container-custom py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Discover Quality Mess Food</h1>
            <p className="text-gray-400">Verified messes with hygiene ratings & daily menus</p>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by location, cuisine, or mess name..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              icon={<SearchIcon />}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Messes' },
              { id: 'verified', label: 'Verified Only' },
              { id: 'south', label: 'South Indian' },
              { id: 'north', label: 'North Indian' },
              { id: 'budget', label: 'Under ₹5000' },
              { id: 'hygiene', label: 'High Hygiene' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeFilter === filter.id
                    ? 'bg-trust-500/10 text-trust-400 border border-trust-500/20'
                    : 'bg-surface hover:bg-surface-hover text-gray-300 border border-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom section-padding">
        {/* Trust Banner */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-trust-500/5 to-emerald-500/5 border-trust-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-trust-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShieldIcon className="w-6 h-6 text-trust-400" />
            </div>
            <div>
              <h3 className="font-bold text-trust-400 mb-2">Our Verification Promise</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Every mess is physically inspected by our food safety team. We check kitchen hygiene, ingredient quality, 
                and cooking practices before verification.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-trust-400" />
                  <span>Kitchen Inspection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-trust-400" />
                  <span>Quality Checks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-trust-400" />
                  <span>Student Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-400">
            <span className="text-gray-100 font-semibold">{mockMessListings.length} messes</span> found near you
          </div>
          <select className="bg-surface border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus-ring">
            <option>Highest Rated</option>
            <option>Best Hygiene</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Reviewed</option>
          </select>
        </div>

        {/* Mess Listings */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockMessListings.map((mess) => (
            <MessCard key={mess.id} mess={mess} />
          ))}
        </div>

        {/* Empty State for more results */}
        <div className="mt-12 text-center">
          <Card className="p-12 bg-surface-elevated border-gray-800">
            <FoodIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">Looking for more options?</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              We're constantly adding new verified messes. Check back soon or explore nearby areas.
            </p>
            <Button variant="primary" onClick={() => setShowMessMap(true)}>
              Explore Nearby Areas
            </Button>
          </Card>
        </div>

        {/* MessMap only appears when Explore Nearby Areas is clicked */}
        {showMessMap && (
          <div className="mt-10">
            <MessMap trigger={showMessMap} />
          </div>
        )}
      </div>
    </div>
  );
};


// Add state for showing MessMap
function MessDiscoveryPageWrapper() {
  const [showMessMap, setShowMessMap] = useState(false);
  return <MessDiscoveryPage showMessMap={showMessMap} setShowMessMap={setShowMessMap} />;
}
export default MessDiscoveryPageWrapper;
