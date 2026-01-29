import React, { useState } from 'react';
import { getPGMediaByPGId } from '../data/mockData';

interface Media {
  id: string;
  pgId: string;
  type: 'photo' | 'video';
  title: string;
  description?: string;
  url: string;
  category: 'room' | 'washroom' | 'common-area' | 'food' | 'other';
  uploadedBy: 'owner' | 'verified-admin';
  verified: boolean;
  verifiedAt?: string;
  uploadedAt: string;
}

interface PGMediaGalleryProps {
  pgId: string;
}

export const PGMediaGallery: React.FC<PGMediaGalleryProps> = ({ pgId }) => {
  const mediaList = getPGMediaByPGId(pgId);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  const filteredMedia =
    filter === 'all'
      ? mediaList
      : mediaList.filter((m) => m.type === filter);

  const verifiedCount = mediaList.filter((m) => m.verified).length;

  if (mediaList.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600 text-center">No media uploaded yet</p>
      </div>
    );
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      room: 'bg-blue-100 text-blue-800',
      washroom: 'bg-purple-100 text-purple-800',
      'common-area': 'bg-green-100 text-green-800',
      food: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Header with PROMINENT Trust Badge */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-300 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">🖼️ Media Gallery</h3>
          <p className="text-sm text-gray-600 mt-1">Photos & Videos Proof</p>
        </div>
        {verifiedCount > 0 && (
          <div className="flex flex-col items-center gap-1 bg-white px-4 py-3 rounded-lg border-2 border-green-400 shadow-md">
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <span className="text-xs font-bold text-green-700 uppercase">
              ✓ Verified
            </span>
            <span className="text-xs text-gray-600">Items Approved</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'photo', 'video'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === type
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {type === 'all'
              ? `All (${mediaList.length})`
              : `${type.charAt(0).toUpperCase() + type.slice(1)}s (${
                  mediaList.filter((m) => m.type === type).length
                })`}
          </button>
        ))}
      </div>

      {/* Gallery Grid - Lazy Load */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-200"
            onClick={() => setSelectedMedia(media)}
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-gray-300 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
              {media.type === 'photo' ? (
                <img
                  src={media.url}
                  alt={media.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-4xl">▶</span>
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-end p-2">
              {media.verified && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded text-white font-medium">
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Badge */}
            <div
              className={`absolute top-2 right-2 ${getCategoryColor(
                media.category
              )} text-xs font-semibold px-2 py-1 rounded`}
            >
              {media.category === 'common-area' ? 'Common' : media.category}
            </div>

            {/* Type Indicator */}
            {media.type === 'video' && (
              <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                VIDEO
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal - Detail View */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image/Video */}
            <div className="bg-gray-900 aspect-video flex items-center justify-center">
              {selectedMedia.type === 'photo' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-6xl mb-4">▶</div>
                    <p className="text-gray-400">Video Preview</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {selectedMedia.title}
                  </h4>
                  {selectedMedia.description && (
                    <p className="text-gray-600 mt-2">
                      {selectedMedia.description}
                    </p>
                  )}
                </div>
                {selectedMedia.verified && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Category
                  </p>
                  <p className={`mt-1 ${getCategoryColor(selectedMedia.category)} text-sm font-medium px-2 py-1 rounded inline-block`}>
                    {selectedMedia.category === 'common-area'
                      ? 'Common Area'
                      : selectedMedia.category.charAt(0).toUpperCase() +
                        selectedMedia.category.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Source
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {selectedMedia.uploadedBy === 'owner'
                      ? 'Owner'
                      : 'Verified Admin'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Type
                  </p>
                  <p className="text-sm text-gray-700 mt-1 capitalize">
                    {selectedMedia.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Uploaded
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
