import React, { useState } from 'react';
import { PGMediaGallery } from './PGMediaGallery';
import { PGReviews } from './PGReviews';
import { OwnerContactCTA } from './OwnerContactCTA';
import { pgs } from '../data/mockData';

interface PGDetailsProps {
  pgId: string;
  userCity?: string;
  userCoordinates?: { lat: number; lng: number };
}

export const PGDetails: React.FC<PGDetailsProps> = ({
  pgId,
  userCity = 'Mumbai',
  userCoordinates,
}) => {
  const pg = pgs.find((p) => p.id === pgId);
  const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'reviews' | 'owner'>('overview');

  if (!pg) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">PG not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pg.name}</h1>
            <p className="text-gray-600 text-lg mt-2">{pg.distance} km from university</p>
          </div>
          {pg.verified && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
              ✓ Verified PG
            </div>
          )}
        </div>

        {/* Key Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Monthly Rent</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{pg.rent}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Rating</p>
            <p className="text-2xl font-bold text-yellow-500 mt-1">
              {pg.rating} ★
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Gender Type</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">
              {pg.gender}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm font-medium">Amenities</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {pg.amenities.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex gap-8">
          {(['overview', 'media', 'reviews', 'owner'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab === 'overview'
                ? 'Overview'
                : tab === 'media'
                ? 'Media & Proof'
                : tab === 'reviews'
                ? 'Reviews'
                : 'Contact Owner'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {pg.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
                  >
                    <p className="text-gray-900 font-medium">{amenity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this PG
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to {pg.name}, a premium student accommodation facility
                designed with your comfort and safety in mind. Located{' '}
                {pg.distance} km from the university, we provide a vibrant
                community of like-minded students from diverse backgrounds.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Our facility features clean, well-maintained rooms,{' '}
                {pg.amenities.join(', ')}, and a supportive community
                atmosphere. We believe in creating a home away from home where
                every student feels secure and welcomed.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Facts
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Verified by PG ADIS
                  admin
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Real photos and video
                  walkthroughs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Reviews from actual
                  residents
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Fast response to
                  queries
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && <PGMediaGallery pgId={pgId} />}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && <PGReviews pgId={pgId} />}

        {/* Owner Contact Tab */}
        {activeTab === 'owner' && (
          <OwnerContactCTA
            pgId={pgId}
            pgName={pg.name}
            pgCoordinates={{ lat: pg.lat, lng: pg.lng }}
            pgCity="Mumbai"
            ownerName="Rajesh Kumar"
            userCity={userCity}
            userCoordinates={userCoordinates}
          />
        )}
      </div>

      {/* Floating Action Button */}
      {activeTab !== 'owner' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setActiveTab('owner')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all hover:shadow-xl"
          >
            <span>📞</span> Contact Owner
          </button>
        </div>
      )}
    </div>
  );
};
