import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import VerificationStatusBadge from './VerificationStatusBadge';
import { PGListingWithVerification } from '../types';
import { formatCurrency, formatDate } from '../utils/ownerHelpers';

interface AdminVerificationPanelProps {
  pendingPGs: PGListingWithVerification[];
  onVerify: (pgId: string, approved: boolean, reason?: string) => Promise<void>;
  onRefresh: () => void;
}

export default function AdminVerificationPanel({ 
  pendingPGs, 
  onVerify, 
  onRefresh 
}: AdminVerificationPanelProps) {
  const [selectedPG, setSelectedPG] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedPG, setExpandedPG] = useState<string | null>(null);

  const handleVerify = async (pgId: string, approved: boolean) => {
    setIsProcessing(true);
    try {
      await onVerify(pgId, approved, approved ? undefined : rejectionReason);
      setSelectedPG(null);
      setRejectionReason('');
      onRefresh();
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to process verification. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderProofViewer = (pg: PGListingWithVerification) => (
    <div className="space-y-4 mt-4">
      {/* Ownership Document */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Ownership Document</h4>
        {pg.ownershipProof?.ownershipDocument ? (
          <div className="bg-surface-elevated rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📄</span>
              <div>
                <p className="text-gray-100 font-medium">
                  {pg.ownershipProof.ownershipDocument.type.replace(/-/g, ' ').toUpperCase()}
                </p>
                <p className="text-sm text-gray-400">
                  Uploaded: {formatDate(pg.ownershipProof.ownershipDocument.uploadedAt)}
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                View Document
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-sm">No document uploaded</p>
        )}
      </div>

      {/* Room Photos */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">
          Room Photos ({pg.ownershipProof?.roomPhotos.length || 0}/10)
        </h4>
        {pg.ownershipProof?.roomPhotos && pg.ownershipProof.roomPhotos.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {pg.ownershipProof.roomPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-surface-elevated rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    📸
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {photo.category.replace(/-/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-400 text-sm">No photos uploaded</p>
        )}
      </div>

      {/* Video Walkthrough */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Video Walkthrough</h4>
        {pg.ownershipProof?.videoWalkthrough ? (
          <div className="bg-surface-elevated rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎥</span>
              <div>
                <p className="text-gray-100 font-medium">
                  {pg.ownershipProof.videoWalkthrough.duration} seconds
                </p>
                <p className="text-sm text-gray-400">
                  Uploaded: {formatDate(pg.ownershipProof.videoWalkthrough.uploadedAt)}
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Play Video
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-sm">No video uploaded</p>
        )}
      </div>

      {/* Verification Checklist */}
      <div className="bg-trust-500/5 border border-trust-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-100 mb-3">Verification Checklist</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="w-4 h-4" />
            <span>Document is clear and readable</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="w-4 h-4" />
            <span>Document matches PG address</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="w-4 h-4" />
            <span>Minimum 5 photos uploaded</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="w-4 h-4" />
            <span>Photos match video walkthrough</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="w-4 h-4" />
            <span>Video shows all facilities</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" className="w-4 h-4" />
            <span>Location verified on Google Maps</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPGCard = (pg: PGListingWithVerification) => {
    const isExpanded = expandedPG === pg.id;

    return (
      <Card key={pg.id} className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-100 mb-1">{pg.name}</h3>
            <p className="text-sm text-gray-400">
              {pg.address.street}, {pg.address.area}, {pg.address.city}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Submitted: {formatDate(pg.createdAt)}
            </p>
          </div>
          <VerificationStatusBadge status={pg.verificationStatus} />
        </div>

        {/* PG Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Beds</p>
            <p className="text-lg font-semibold text-gray-100">{pg.totalBeds}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Available</p>
            <p className="text-lg font-semibold text-gray-100">{pg.availableBeds}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Rent</p>
            <p className="text-lg font-semibold text-gray-100">{formatCurrency(pg.rent)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Gender</p>
            <p className="text-lg font-semibold text-gray-100 capitalize">{pg.genderType}</p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Amenities:</p>
          <div className="flex flex-wrap gap-2">
            {pg.amenities.map((amenity, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-surface-elevated text-gray-300 text-xs rounded"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <Button 
          variant="outline" 
          size="sm" 
          fullWidth
          onClick={() => setExpandedPG(isExpanded ? null : pg.id)}
          className="mb-4"
        >
          {isExpanded ? '▲ Hide Proofs' : '▼ View Proofs & Verify'}
        </Button>

        {/* Proof Viewer (Expandable) */}
        {isExpanded && renderProofViewer(pg)}

        {/* Verification Actions */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-800 space-y-4">
            {selectedPG === pg.id ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rejection Reason (Optional)
                  </label>
                  <Input
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handleVerify(pg.id, true)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : '✓ Approve & Publish'}
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => handleVerify(pg.id, false)}
                    disabled={isProcessing || !rejectionReason.trim()}
                  >
                    {isProcessing ? 'Processing...' : '✕ Reject'}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setSelectedPG(null);
                    setRejectionReason('');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setSelectedPG(pg.id)}
              >
                Start Verification
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="container-custom max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              Admin Verification Panel
            </h1>
            <p className="text-gray-400">
              Review and verify pending PG listings
            </p>
          </div>
          <Button variant="outline" onClick={onRefresh}>
            🔄 Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-yellow-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingPGs.length}</p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </Card>
          <Card className="p-6 bg-green-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg Review Time</p>
                <p className="text-3xl font-bold text-green-400">24h</p>
              </div>
              <span className="text-4xl">⚡</span>
            </div>
          </Card>
          <Card className="p-6 bg-trust-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Approval Rate</p>
                <p className="text-3xl font-bold text-trust-400">87%</p>
              </div>
              <span className="text-4xl">📊</span>
            </div>
          </Card>
        </div>

        {/* Pending PGs List */}
        <div className="space-y-4">
          {pendingPGs.length === 0 ? (
            <Card className="p-12 text-center">
              <span className="text-6xl mb-4 block">✓</span>
              <h3 className="text-xl font-bold text-gray-100 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-400">
                No pending verifications at this time.
              </p>
            </Card>
          ) : (
            pendingPGs.map(renderPGCard)
          )}
        </div>

        {/* Guidelines */}
        <Card className="mt-8 p-6 bg-trust-500/5 border-trust-500/20">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Verification Guidelines
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>✓ Verify ownership document matches the submitted address</p>
            <p>✓ Ensure minimum 5 clear photos covering all areas</p>
            <p>✓ Check video walkthrough is continuous (30-90 seconds)</p>
            <p>✓ Confirm photos match the video content</p>
            <p>✓ Verify location on Google Maps/Street View</p>
            <p>✓ Look for signs of stock/internet photos</p>
            <p>⚠️ Reject if documents appear fake or suspicious</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
