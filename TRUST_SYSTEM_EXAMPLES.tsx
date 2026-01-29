// Example Integration: How to use the Trust System Components
// Import and use in your pages

import React from 'react';
import { PGDetails } from './components/PGDetails';
import { PGMediaGallery } from './components/PGMediaGallery';
import { PGReviews } from './components/PGReviews';
import { OwnerContactCTA } from './components/OwnerContactCTA';

// ============================================
// Example 1: Full PG Details Page
// ============================================
export function PGDetailPage() {
  // In real app, get from URL params
  const pgId = 'pg-1';
  
  // Get user location (would come from context/state)
  const userCity = 'Mumbai';
  const userCoordinates = { lat: 19.0, lng: 72.8 };

  return (
    <PGDetails
      pgId={pgId}
      userCity={userCity}
      userCoordinates={userCoordinates}
    />
  );
}

// ============================================
// Example 2: Minimal Media Gallery Component
// ============================================
export function MinimalMediaGallery() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">See the PG</h2>
      <PGMediaGallery pgId="pg-1" />
    </div>
  );
}

// ============================================
// Example 3: Embedded Reviews in Listing Card
// ============================================
export function PGListingCardWithReviews() {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Skyrise Apartments</h3>
        <p className="text-gray-600">₹8,500/month • 2.5 km away</p>
      </div>

      {/* Mini Reviews Preview */}
      <div className="p-4">
        <PGReviews pgId="pg-1" />
      </div>

      {/* CTA */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button className="w-full bg-blue-600 text-white py-2 rounded font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}

// ============================================
// Example 4: Trust Banner for Search Results
// ============================================
export function TrustBanner() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-green-900">Why you can trust this PG</h3>
      
      <div className="space-y-2 text-sm text-green-800">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span><strong>5 verified reviews</strong> from real residents</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span><strong>7 verified photos</strong> and 1 video walkthrough</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span><strong>4.8 rating</strong> based on 8-month average stay</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span><strong>Owner verified</strong> by PG ADIS admin</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Example 5: Custom Modal for Media Preview
// ============================================
export function MediaPreviewModal() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-700"
      >
        View Photos & Videos →
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Room Photos & Walkthrough</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <PGMediaGallery pgId="pg-1" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// Example 6: Owner Interaction in Sidebar
// ============================================
export function OwnerContactSidebar() {
  return (
    <div className="sticky top-6 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h3 className="font-semibold text-lg">Interested?</h3>
        <p className="text-blue-100 text-sm mt-1">Talk to the owner directly</p>
      </div>

      {/* Contact Component */}
      <div className="p-4">
        <OwnerContactCTA
          pgId="pg-1"
          pgName="Skyrise Apartments"
          pgCoordinates={{ lat: 19.1334, lng: 72.9133 }}
          pgCity="Mumbai"
          ownerName="Rajesh Kumar"
          userCity="Mumbai"
        />
      </div>
    </div>
  );
}

// ============================================
// Example 7: Search Results with Trust Scores
// ============================================
export function PGSearchResults() {
  const pgIds = ['pg-1', 'pg-2', 'pg-3'];

  return (
    <div className="space-y-4">
      {pgIds.map((pgId) => (
        <div
          key={pgId}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          {/* PG Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Skyrise Apartments
            </h3>
            <p className="text-gray-600">₹8,500/month • 2.5 km • Male</p>
          </div>

          {/* Quick Trust Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">
                Reviews
              </p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                4.8 ★ (5 reviews)
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase font-semibold">
                Media
              </p>
              <p className="text-sm font-bold text-gray-900 mt-1">
                7 photos + 1 video
              </p>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
            View Details & Contact Owner
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Example 8: Writing a Review (Form)
// ============================================
export function WriteReviewForm() {
  const [rating, setRating] = React.useState<1 | 2 | 3 | 4 | 5>(5);
  const [review, setReview] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate user stayed at this PG (backend check)
    const response = await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        pgId: 'pg-1',
        rating,
        description: review,
        stayDuration: { months: 8, from: '2023-06-01', to: '2024-02-01' },
        aspects: {
          cleanliness: 5,
          foodQuality: 4,
          ownerBehavior: 5,
          maintenance: 4,
        },
      }),
    });

    if (response.ok) {
      alert('Review submitted! Thank you for sharing your experience.');
      setReview('');
      setRating(5);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold">Share Your Stay Experience</h3>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
              className={`text-3xl transition-colors ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience... (minimum 50 characters)"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}

// ============================================
// Example 9: Distance-based Recommendations
// ============================================
export function NearbyPGRecommendation() {
  const userLocation = { city: 'Mumbai', coordinates: { lat: 19.0, lng: 72.8 } };

  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🎯 Perfect for You - Nearby PGs
      </h3>

      <div className="space-y-3">
        {/* Filter used: Same city + available for physical visit */}
        <p className="text-sm text-gray-700">
          These PGs are in your city. You can{' '}
          <strong>visit in person</strong> before booking!
        </p>

        {/* List of nearby PGs with physical visit option */}
        <div className="space-y-2">
          <div className="bg-white p-3 rounded border border-green-200">
            <p className="font-medium text-gray-900">Skyrise Apartments</p>
            <p className="text-sm text-gray-600">2.5 km • Schedule visit</p>
          </div>
          <div className="bg-white p-3 rounded border border-green-200">
            <p className="font-medium text-gray-900">BombayBliss</p>
            <p className="text-sm text-gray-600">3.2 km • Schedule visit</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Example 10: Usage in PGListingPage
// ============================================
export function UpdatedPGListingPage() {
  const [selectedPG, setSelectedPG] = React.useState<string | null>(null);

  if (selectedPG) {
    return (
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => setSelectedPG(null)}
          className="mb-4 text-blue-600 hover:text-blue-700"
        >
          ← Back to Listings
        </button>
        <PGDetails pgId={selectedPG} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-6">PGs Near IIT Bombay</h1>

      {/* Cards with trust indicators */}
      {['pg-1', 'pg-2', 'pg-3'].map((pgId) => (
        <div
          key={pgId}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setSelectedPG(pgId)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Skyrise Apartments
              </h3>
              <p className="text-gray-600">₹8,500/month • 2.5 km</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-500">4.8 ★</p>
              <p className="text-sm text-gray-600">5 reviews</p>
            </div>
          </div>

          <p className="text-sm text-green-600 font-medium mt-2">
            ✓ 7 verified photos + 1 video
          </p>
        </div>
      ))}
    </div>
  );
}

export default PGDetailPage;
