import { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface FileWithPreview {
  file: File;
  preview: string;
  category?: string;
}

interface PGProofUploadProps {
  onComplete: (proofs: {
    ownershipDoc: File | null;
    roomPhotos: File[];
    videoWalkthrough: File | null;
  }) => void;
  onBack: () => void;
}

export default function PGProofUpload({ onComplete, onBack }: PGProofUploadProps) {
  const [ownershipDoc, setOwnershipDoc] = useState<FileWithPreview | null>(null);
  const [roomPhotos, setRoomPhotos] = useState<FileWithPreview[]>([]);
  const [videoWalkthrough, setVideoWalkthrough] = useState<FileWithPreview | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOwnershipDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, ownership: 'File size must be less than 5MB' }));
        return;
      }
      const preview = URL.createObjectURL(file);
      setOwnershipDoc({ file, preview });
      setErrors(prev => ({ ...prev, ownership: '' }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (roomPhotos.length + files.length > 10) {
      setErrors(prev => ({ ...prev, photos: 'Maximum 10 photos allowed' }));
      return;
    }

    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setRoomPhotos(prev => [...prev, ...newPhotos]);
    setErrors(prev => ({ ...prev, photos: '' }));
  };

  const removePhoto = (index: number) => {
    setRoomPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, video: 'Video size must be less than 100MB' }));
        return;
      }

      // Check video duration (would need video element to verify 30-90 sec)
      const preview = URL.createObjectURL(file);
      setVideoWalkthrough({ file, preview });
      setErrors(prev => ({ ...prev, video: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!ownershipDoc) {
      newErrors.ownership = 'Ownership document is required';
    }
    if (roomPhotos.length < 5) {
      newErrors.photos = 'Minimum 5 photos required';
    }
    if (!videoWalkthrough) {
      newErrors.video = 'Video walkthrough is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete({
      ownershipDoc: ownershipDoc?.file || null,
      roomPhotos: roomPhotos.map(p => p.file),
      videoWalkthrough: videoWalkthrough?.file || null
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Upload Verification Documents</h2>
        <p className="text-gray-400">All documents are mandatory for verification</p>
      </div>

      {/* Ownership Document */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">
              Ownership Document <span className="text-red-400">*</span>
            </h3>
            <p className="text-sm text-gray-400">
              Upload any one: Electricity bill, Water bill, Property tax receipt, Rental agreement, or Ownership deed
            </p>
          </div>
          <span className="text-trust-400 text-sm font-medium">Required</span>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleOwnershipDocUpload}
            className="hidden"
            id="ownership-doc"
          />
          <label
            htmlFor="ownership-doc"
            className="block w-full border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-trust-500 cursor-pointer transition"
          >
            {ownershipDoc ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">📄</span>
                <div className="text-left">
                  <p className="text-gray-100 font-medium">{ownershipDoc.file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(ownershipDoc.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            ) : (
              <>
                <span className="text-4xl mb-3 block">📄</span>
                <p className="text-gray-300 font-medium mb-1">Click to upload ownership document</p>
                <p className="text-sm text-gray-500">PDF, JPG, or PNG • Max 5MB</p>
              </>
            )}
          </label>
          {errors.ownership && (
            <p className="text-red-400 text-sm">{errors.ownership}</p>
          )}
        </div>
      </Card>

      {/* Room Photos */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">
              Room Photos <span className="text-red-400">*</span>
            </h3>
            <p className="text-sm text-gray-400">
              Upload at least 5 clear photos: rooms, washroom, kitchen, common areas, entrance
            </p>
          </div>
          <span className="text-trust-400 text-sm font-medium">
            {roomPhotos.length}/10 photos
          </span>
        </div>

        <div className="space-y-4">
          {roomPhotos.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {roomPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Room ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
            id="room-photos"
          />
          <label
            htmlFor="room-photos"
            className="block w-full border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-trust-500 cursor-pointer transition"
          >
            <span className="text-3xl mb-2 block">📸</span>
            <p className="text-gray-300 font-medium mb-1">Click to upload photos</p>
            <p className="text-sm text-gray-500">Minimum 5 photos • JPG or PNG</p>
          </label>
          {errors.photos && (
            <p className="text-red-400 text-sm">{errors.photos}</p>
          )}
        </div>
      </Card>

      {/* Video Walkthrough */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">
              Video Walkthrough <span className="text-red-400">*</span>
            </h3>
            <p className="text-sm text-gray-400">
              Record a continuous 30-90 second walkthrough of the entire PG (rooms, facilities, common areas)
            </p>
          </div>
          <span className="text-trust-400 text-sm font-medium">Required</span>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-walkthrough"
          />
          <label
            htmlFor="video-walkthrough"
            className="block w-full border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-trust-500 cursor-pointer transition"
          >
            {videoWalkthrough ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">🎥</span>
                <div className="text-left">
                  <p className="text-gray-100 font-medium">{videoWalkthrough.file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(videoWalkthrough.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            ) : (
              <>
                <span className="text-4xl mb-3 block">🎥</span>
                <p className="text-gray-300 font-medium mb-1">Click to upload video walkthrough</p>
                <p className="text-sm text-gray-500">MP4 or MOV • 30-90 seconds • Max 100MB</p>
              </>
            )}
          </label>
          {errors.video && (
            <p className="text-red-400 text-sm">{errors.video}</p>
          )}
        </div>
      </Card>

      {/* Info Box */}
      <Card className="bg-trust-500/5 border-trust-500/20 p-6">
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-2 text-gray-100">Verification Process</p>
            <ul className="space-y-1 text-gray-400">
              <li>✓ Documents will be reviewed within 24-48 hours</li>
              <li>✓ Verified PGs appear on student search and map</li>
              <li>✓ Unverified listings remain hidden until approved</li>
              <li>✓ Fake/misleading documents lead to permanent ban</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} fullWidth>
          ← Back
        </Button>
        <Button variant="primary" onClick={handleSubmit} fullWidth>
          Submit for Verification
        </Button>
      </div>
    </div>
  );
}
