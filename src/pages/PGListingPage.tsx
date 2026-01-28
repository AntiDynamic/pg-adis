import { useState } from 'react';
import Map from '../components/Map';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Rating } from '../components/ui/Rating';
import { universities, pgs, University, PG } from '../data/mockData';
import { filterPGsByUniversity, filterPGs, PGFilterOptions } from '../utils/helpers';

/**
 * PG LISTING PAGE
 * 
 * University-first, map-driven PG discovery
 * 
 * Flow:
 * 1. Show all universities on the map
 * 2. Click a university marker
 * 3. View PGs within 5km radius
 * 4. Apply filters (price, rating, gender, etc.)
 */

export default function PGListingPage() {
  // Filter to show only Pune universities for the prototype
  const puneUniversities = universities.filter(uni => uni.city === 'Pune');
  
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [filteredPGs, setFilteredPGs] = useState<PG[]>([]);
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [showPGs, setShowPGs] = useState(false);
  const [filters, setFilters] = useState<PGFilterOptions>({
    maxRent: undefined,
    minRating: undefined,
    verifiedOnly: false,
    gender: undefined,
  });

  const handleUniversityClick = (university: University) => {
    setSelectedUniversity(university);
    setShowPGs(true);
    
    // Find PGs within 5km of this university
    const nearbyPGs = filterPGsByUniversity(pgs, university, 5);
    
    // Apply any existing filters
    const finalPGs = filterPGs(nearbyPGs, filters);
    setFilteredPGs(finalPGs);
    setSelectedPG(null);
  };

  const handlePGClick = (pg: PG) => {
    setSelectedPG(pg);
  };

  const handleResetSearch = () => {
    setSelectedUniversity(null);
    setFilteredPGs([]);
    setSelectedPG(null);
    setShowPGs(false);
    setFilters({
      maxRent: undefined,
      minRating: undefined,
      verifiedOnly: false,
      gender: undefined,
    });
  };

  const handleApplyFilters = (newFilters: PGFilterOptions) => {
    setFilters(newFilters);
    if (selectedUniversity) {
      const nearbyPGs = filterPGsByUniversity(pgs, selectedUniversity, 5);
      const finalPGs = filterPGs(nearbyPGs, newFilters);
      setFilteredPGs(finalPGs);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your PG</h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedUniversity
                  ? `Showing PGs near ${selectedUniversity.name}`
                  : 'Select a university on the map to start'}
              </p>
            </div>
            {selectedUniversity && (
              <Button onClick={handleResetSearch} variant="outline">
                ← Back to Universities
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Filters & Results */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters Card */}
            <FilterPanel
              filters={filters}
              onApplyFilters={handleApplyFilters}
              disabled={!selectedUniversity}
            />

            {/* Results List */}
            {selectedUniversity && (
              <Card className="max-h-[600px] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">
                    {filteredPGs.length} PGs Found
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredPGs.map((pg) => (
                    <PGListItem
                      key={pg.id}
                      pg={pg}
                      isSelected={selectedPG?.id === pg.id}
                      onClick={() => handlePGClick(pg)}
                    />
                  ))}
                  {filteredPGs.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      <p>No PGs match your filters</p>
                      <Button
                        onClick={() => handleApplyFilters({})}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] overflow-hidden">
              <Map
                universities={puneUniversities}
                pgs={showPGs ? filteredPGs : []}
                onUniversityClick={handleUniversityClick}
                onPGClick={handlePGClick}
                selectedUniversityId={selectedUniversity?.id}
                center={[18.5204, 73.8567]}
                zoom={12}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter Panel Component
interface FilterPanelProps {
  filters: PGFilterOptions;
  onApplyFilters: (filters: PGFilterOptions) => void;
  disabled: boolean;
}

function FilterPanel({ filters, onApplyFilters, disabled }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  return (
    <Card>
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-900">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Max Rent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Rent (₹/month)
          </label>
          <input
            type="number"
            value={localFilters.maxRent || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                maxRent: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="e.g. 10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={disabled}
          />
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <select
            value={localFilters.minRating || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                minRating: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={disabled}
          >
            <option value="">Any</option>
            <option value="3">3+ ⭐</option>
            <option value="4">4+ ⭐</option>
            <option value="4.5">4.5+ ⭐</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender Preference
          </label>
          <select
            value={localFilters.gender || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                gender: e.target.value as any,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={disabled}
          >
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Verified Only */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified"
            checked={localFilters.verifiedOnly || false}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                verifiedOnly: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 rounded"
            disabled={disabled}
          />
          <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
            Verified PGs only
          </label>
        </div>

        <Button
          onClick={handleApply}
          className="w-full"
          disabled={disabled}
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}

// PG List Item Component
interface PGListItemProps {
  pg: PG;
  isSelected: boolean;
  onClick: () => void;
}

function PGListItem({ pg, isSelected, onClick }: PGListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{pg.name}</h3>
        {pg.verified && (
          <Badge variant="verified" className="text-xs">
            ✓ Verified
          </Badge>
        )}
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">
            ₹{pg.rent.toLocaleString()}/mo
          </span>
          <div className="flex items-center">
            <Rating rating={pg.rating} size="sm" />
            <span className="ml-1 text-gray-600">{pg.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600">📍 {pg.distance} km away</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant={
              pg.gender === 'male'
                ? 'default'
                : pg.gender === 'female'
                ? 'premium'
                : 'new'
            }
            className="text-xs"
          >
            {pg.gender.charAt(0).toUpperCase() + pg.gender.slice(1)}
          </Badge>
          <span className="text-xs text-gray-500">
            {pg.amenities.slice(0, 2).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}
