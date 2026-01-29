import { useState } from 'react';
import { PGMediaGallery } from '../components/PGMediaGallery';
import { PGReviews } from '../components/PGReviews';
import { OwnerContactCTA } from '../components/OwnerContactCTA';

/**
 * Demo Page to Show Verification System
 * Shows all three trust features in one page
 */
export function VerificationDemoPage() {
  const [activeTab, setActiveTab] = useState<'media' | 'reviews' | 'contact'>('media');
  const pgId = 'pg-1';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🔒 PG Verification System Demo</h1>
          <p className="text-blue-100 text-lg">
            See how we build trust through verified media, real reviews & owner interaction
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Trust Metrics Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Verified Media</h3>
            <p className="text-4xl font-bold text-green-600">7</p>
            <p className="text-gray-600 text-sm mt-2">✓ Photos & Videos Approved</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Real Reviews</h3>
            <p className="text-4xl font-bold text-yellow-600">5</p>
            <p className="text-gray-600 text-sm mt-2">✓ From Actual Students</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Average Rating</h3>
            <p className="text-4xl font-bold text-blue-600">4.8★</p>
            <p className="text-gray-600 text-sm mt-2">✓ Verified By Residents</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'media', label: '🖼️ Verified Media', icon: '📸' },
              { id: 'reviews', label: '⭐ Student Reviews', icon: '💬' },
              { id: 'contact', label: '📞 Owner Contact', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-900 font-medium">
                    ✓ All images below have been verified by PG ADIS admin
                  </p>
                </div>
                <PGMediaGallery pgId={pgId} />
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-900 font-medium">
                    ✓ All reviews below are from real students who stayed here
                  </p>
                </div>
                <PGReviews pgId={pgId} />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-900 font-medium">
                    ✓ Contact the owner directly for any questions
                  </p>
                </div>
                <OwnerContactCTA
                  pgId={pgId}
                  pgName="Skyrise Apartments"
                  pgCoordinates={{ lat: 19.1334, lng: 72.9133 }}
                  pgCity="Mumbai"
                  ownerName="Rajesh Kumar"
                  userCity="Mumbai"
                />
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* How Verification Works */}
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 How Verification Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Owner Uploads</h3>
                  <p className="text-gray-600 text-sm">PG owner uploads photos and videos</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Admin Reviews</h3>
                  <p className="text-gray-600 text-sm">PG ADIS team checks authenticity</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Get Verified Badge</h3>
                  <p className="text-gray-600 text-sm">✓ Verified badge appears on image</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Students See It</h3>
                  <p className="text-gray-600 text-sm">You trust it because it's verified</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Matters */}
          <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 Why This Matters</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-700">
                  <strong>No Fake Photos:</strong> All images are verified by admin
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-700">
                  <strong>Real Reviews Only:</strong> Only from students who actually lived here
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-700">
                  <strong>Safe Booking:</strong> You know exactly what you're getting
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-700">
                  <strong>Owner Accountability:</strong> Verified owners take responsibility
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <p className="text-gray-700">
                  <strong>Low Bandwidth:</strong> Images load fast even on slow networks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">🎯 3 Trust Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div>
              <div className="bg-green-100 rounded-lg p-4 mb-4">
                <h3 className="text-xl font-bold text-green-900">📸 Verified Media</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Photos verified by admin</li>
                <li>✓ Category badges shown</li>
                <li>✓ View in high quality</li>
                <li>✓ Filter by type</li>
                <li>✓ Upload date displayed</li>
                <li>✓ Lazy loading for speed</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="bg-yellow-100 rounded-lg p-4 mb-4">
                <h3 className="text-xl font-bold text-yellow-900">⭐ Student Reviews</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Real students only</li>
                <li>✓ Rating distribution shown</li>
                <li>✓ Aspect breakdown (4 types)</li>
                <li>✓ Stay duration mentioned</li>
                <li>✓ Sortable reviews</li>
                <li>✓ Helpful/unhelpful votes</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="bg-blue-100 rounded-lg p-4 mb-4">
                <h3 className="text-xl font-bold text-blue-900">📞 Owner Contact</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Video call anytime</li>
                <li>✓ Physical visit (if nearby)</li>
                <li>✓ Easy scheduling</li>
                <li>✓ Distance-aware CTA</li>
                <li>✓ Date/time picker</li>
                <li>✓ Confirmation message</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect PG?</h2>
          <p className="text-blue-100 text-lg mb-6">
            Explore verified PGs with real photos, honest reviews, and direct owner contact
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors">
            Browse All PGs →
          </button>
        </div>
      </div>
    </div>
  );
}
