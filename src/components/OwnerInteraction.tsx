/**
 * OWNER INTERACTION COMPONENT
 * Handles student requests for video calls and physical visits
 * Based on location distance
 */

import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { OwnerInteraction } from '../types/owner.types';
import { createInteraction, calculateDistance } from '../services/ownerService';

interface OwnerInteractionProps {
  // PG Details
  pgId: string;
  pgName: string;
  pgCoordinates?: { lat: number; lng: number };
  pgCity: string;
  pgAddress: string;
  
  // Owner Details
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  
  // Student Details  
  studentId: string;
  studentLocation?: {
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  
  // Callback when interaction is created
  onInteractionCreated?: (interaction: OwnerInteraction) => void;
}

export default function OwnerInteractionComponent({
  pgId,
  pgName,
  pgCoordinates,
  pgCity,
  pgAddress,
  ownerId,
  ownerName,
  ownerPhone,
  studentId,
  studentLocation,
  onInteractionCreated
}: OwnerInteractionProps) {
  const [showModal, setShowModal] = useState(false);
  const [interactionType, setInteractionType] = useState<'video_call_request' | 'physical_visit_request' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    message: '',
    preferredDate: '',
    preferredTime: ''
  });

  // Calculate if student is nearby (within 10 km)
  const isNearby = React.useMemo(() => {
    if (!pgCoordinates || !studentLocation?.coordinates) {
      // If no coordinates, check city match
      return studentLocation?.city.toLowerCase() === pgCity.toLowerCase();
    }
    
    const distance = calculateDistance(
      studentLocation.coordinates.lat,
      studentLocation.coordinates.lng,
      pgCoordinates.lat,
      pgCoordinates.lng
    );
    
    return distance <= 10; // Within 10 km
  }, [pgCoordinates, studentLocation, pgCity]);

  const handleOpenModal = (type: typeof interactionType) => {
    setInteractionType(type);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!interactionType) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await createInteraction(
        studentId,
        ownerId,
        pgId,
        interactionType,
        {
          message: formData.message,
          scheduledDate: formData.preferredDate ? new Date(formData.preferredDate) : undefined,
          scheduledTime: formData.preferredTime,
          studentLocation
        }
      );
      
      if (result.success && result.interaction) {
        setSubmitted(true);
        setTimeout(() => {
          setShowModal(false);
          setSubmitted(false);
          setFormData({ message: '', preferredDate: '', preferredTime: '' });
          if (onInteractionCreated && result.interaction) {
            onInteractionCreated(result.interaction);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting interaction request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Interaction Buttons */}
      <Card className="p-6 bg-gradient-to-br from-trust-500/5 to-emerald-500/5 border-trust-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-trust-500/10 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h3 className="font-bold text-gray-100">Connect with {ownerName}</h3>
            <p className="text-sm text-gray-400">Get direct answers to your questions</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Video Call Option */}
          {!isNearby && (
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleOpenModal('video_call_request')}
              className="justify-start"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">📹</span>
                <div className="text-left">
                  <div className="font-semibold">Request Video Call</div>
                  <div className="text-xs opacity-80">Perfect for remote viewing</div>
                </div>
              </span>
            </Button>
          )}
          
          {/* Physical Visit Option */}
          {isNearby && (
            <Button
              variant="primary"
              fullWidth
              onClick={() => handleOpenModal('physical_visit_request')}
              className="justify-start"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <div className="text-left">
                  <div className="font-semibold">Schedule Physical Visit</div>
                  <div className="text-xs opacity-80">You're nearby! Visit in person</div>
                </div>
              </span>
            </Button>
          )}
          
          {/* Contact Owner (Always available) */}
          <Button
            variant="outline"
            fullWidth
            onClick={() => ownerPhone && window.open(`tel:${ownerPhone}`)}
            className="justify-start"
            disabled={!ownerPhone}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div className="text-left">
                <div className="font-semibold">Contact Owner</div>
                <div className="text-xs opacity-80">
                  {ownerPhone ? `Call ${ownerPhone}` : 'Phone not available'}
                </div>
              </div>
            </span>
          </Button>
        </div>
        
        {/* Location Info */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-start gap-2 text-sm text-gray-400">
            <span>📍</span>
            <div>
              <div className="font-medium text-gray-300">Location</div>
              <div>{pgAddress}</div>
              {!isNearby && studentLocation && (
                <div className="text-xs mt-1 text-yellow-500">
                  ⚠️ You're in {studentLocation.city}. Video call recommended.
                </div>
              )}
              {isNearby && (
                <div className="text-xs mt-1 text-green-500">
                  ✓ You're nearby! Perfect for a visit.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-lg mx-4 p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">Request Sent!</h3>
                <p className="text-gray-400">
                  {ownerName} will respond shortly
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-100">
                    {interactionType === 'video_call_request' 
                      ? '📹 Request Video Call'
                      : '🏠 Schedule Visit'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {/* PG Info */}
                  <div className="bg-surface-elevated p-4 rounded-lg border border-gray-800">
                    <div className="font-semibold text-gray-100 mb-1">{pgName}</div>
                    <div className="text-sm text-gray-400">{pgAddress}</div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Any specific questions or requirements?"
                      className="w-full px-4 py-3 bg-surface-elevated border border-gray-800 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-trust-500"
                      rows={3}
                    />
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Date
                    </label>
                    <Input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Time
                    </label>
                    <Input
                      type="time"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                    />
                  </div>

                  {/* Information Note */}
                  <div className="bg-trust-500/10 border border-trust-500/20 rounded-lg p-4">
                    <div className="flex gap-2">
                      <span className="text-lg">💡</span>
                      <div className="text-sm text-gray-300">
                        {interactionType === 'video_call_request' ? (
                          <div>
                            <div className="font-medium mb-1">Video Call Tips:</div>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                              <li>Ask for a live walkthrough of rooms</li>
                              <li>Check amenities and facilities</li>
                              <li>Discuss rent and availability</li>
                            </ul>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium mb-1">Visit Tips:</div>
                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                              <li>Visit during daylight hours</li>
                              <li>Bring a friend or family member</li>
                              <li>Check room conditions in person</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setShowModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
