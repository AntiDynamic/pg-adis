import React, { useState } from 'react';
import { getPGReviews, getPGReviewSummary } from '../data/mockData';

interface PGReviewsProps {
  pgId: string;
}

export const PGReviews: React.FC<PGReviewsProps> = ({ pgId }) => {
  const reviews = getPGReviews(pgId);
  const summary = getPGReviewSummary(pgId);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  if (reviews.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <p className="text-blue-900 text-center font-medium">
          No reviews yet. Be the first to review after your stay!
        </p>
      </div>
    );
  }

  const getSortedReviews = () => {
    const sorted = [...reviews];
    if (sortBy === 'recent') {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'helpful') {
      sorted.sort(
        (a, b) =>
          b.helpful - b.unhelpful - (a.helpful - a.unhelpful)
      );
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAspectColor = (score: number): string => {
    if (score >= 4) return 'bg-green-100 text-green-800';
    if (score >= 3) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const sortedReviews = getSortedReviews();

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Average Rating */}
          <div className="text-center">
            <p className="text-xs text-gray-600 uppercase font-semibold mb-2">
              Average Rating
            </p>
            <div
              className={`text-4xl font-bold ${getRatingColor(
                parseFloat(summary.averageRating as string)
              )}`}
            >
              {summary.averageRating}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              ★★★★★ ({summary.totalReviews} reviews)
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="col-span-1 md:col-span-3">
            <p className="text-xs text-gray-600 uppercase font-semibold mb-3">
              Rating Breakdown
            </p>
            <div className="space-y-2">
              {[
                { stars: 5, count: summary.ratingDistribution.five },
                { stars: 4, count: summary.ratingDistribution.four },
                { stars: 3, count: summary.ratingDistribution.three },
                { stars: 2, count: summary.ratingDistribution.two },
                { stars: 1, count: summary.ratingDistribution.one },
              ].map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-700 w-12">
                    {stars} ★
                  </span>
                  <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{
                        width: `${
                          summary.totalReviews > 0
                            ? (count / summary.totalReviews) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sort and Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Student Reviews ({summary.totalReviews})
        </h3>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as 'recent' | 'helpful' | 'rating')
          }
          className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {/* User Avatar Placeholder */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold">
                  {review.userName.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-semibold">
                        ✓ Verified Stay
                      </span>
                    )}
                  </div>

                  {/* Rating and Stay Duration */}
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-xs font-medium text-gray-500">
                      Stayed {review.stayDuration.months} months
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>

            {/* Review Title and Description */}
            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 mb-2">
                {review.title}
              </h5>
              <p
                className={`text-gray-700 text-sm leading-relaxed ${
                  expandedReview === review.id ? '' : 'line-clamp-2'
                }`}
              >
                {review.description}
              </p>

              {review.description.length > 200 && (
                <button
                  onClick={() =>
                    setExpandedReview(
                      expandedReview === review.id ? null : review.id
                    )
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                >
                  {expandedReview === review.id ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {/* Aspect Ratings */}
            {review.aspects && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 pb-4 border-b border-gray-200">
                {[
                  {
                    label: 'Cleanliness',
                    value: review.aspects.cleanliness,
                  },
                  {
                    label: 'Food Quality',
                    value: review.aspects.foodQuality,
                  },
                  {
                    label: 'Owner Behavior',
                    value: review.aspects.ownerBehavior,
                  },
                  {
                    label: 'Maintenance',
                    value: review.aspects.maintenance,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className={`text-xs font-semibold px-2 py-1 rounded text-center ${getAspectColor(
                      value
                    )}`}
                  >
                    <div>{label}</div>
                    <div>{value}/5</div>
                  </div>
                ))}
              </div>
            )}

            {/* Helpful Footer */}
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                👍 Helpful ({review.helpful})
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1">
                👎 ({review.unhelpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-3">
          Lived here? Share your experience!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  );
};
