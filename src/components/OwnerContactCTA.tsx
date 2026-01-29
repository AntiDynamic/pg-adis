import React, { useState } from 'react';
import { calculateDistance } from '../data/mockData';

interface OwnerContactCTAProps {
  pgId: string;
  pgName: string;
  pgCoordinates: { lat: number; lng: number };
  pgCity: string;
  ownerName: string;
  userCity: string;
  userCoordinates?: { lat: number; lng: number };
}

type ContactType = 'video-call' | 'physical-visit' | null;

export const OwnerContactCTA: React.FC<OwnerContactCTAProps> = ({
  pgName,
  pgCoordinates,
  pgCity,
  ownerName,
  userCity,
  userCoordinates,
}) => {
  const [selectedContact, setSelectedContact] = useState<ContactType>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [scheduledData, setScheduledData] = useState<{
    type: ContactType;
    date: string;
    time: string;
  } | null>(null);

  // Determine if user is nearby
  let distanceKm = 0;
  let isNearby = false;

  if (userCoordinates) {
    distanceKm = calculateDistance(
      userCoordinates.lat,
      userCoordinates.lng,
      pgCoordinates.lat,
      pgCoordinates.lng
    );
    isNearby = distanceKm < 50; // Within 50km
  } else {
    // Fallback: Compare cities
    isNearby = userCity.toLowerCase() === pgCity.toLowerCase();
  }

  const handleScheduleClick = (type: ContactType) => {
    setSelectedContact(type);
    setIsScheduling(true);
  };

  const handleConfirmSchedule = (date: string, time: string) => {
    setScheduledData({ type: selectedContact, date, time });
    setScheduled(true);
    setIsScheduling(false);
    // Reset after 3 seconds
    setTimeout(() => {
      setScheduled(false);
      setScheduledData(null);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header with Owner Info */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Meet {ownerName}
        </h3>
        <p className="text-gray-700 text-sm mb-4">
          Interested in this PG? Connect with the owner to learn more and
          schedule a visit.
        </p>

        {/* Distance Info */}
        {userCoordinates && (
          <div className="bg-white rounded px-3 py-2 text-sm text-gray-600 inline-block">
            📍 {distanceKm.toFixed(1)} km away
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Call CTA - Available for Far Students */}
        <button
          onClick={() => handleScheduleClick('video-call')}
          disabled={isScheduling && selectedContact !== 'video-call'}
          className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group ${
            !isNearby 
              ? 'border-trust-500 hover:bg-trust-50 bg-trust-500/5' 
              : 'border-blue-300 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📱</span>
            <h4 className="font-semibold text-gray-900">Request Video Call</h4>
          </div>
          <p className="text-sm text-gray-600 text-left">
            {!isNearby 
              ? '🌟 Recommended - Virtual tour with owner' 
              : 'Talk to owner and see PG virtually'}
          </p>
          <p className="text-xs text-blue-600 font-medium mt-2">
            Schedule Now →
          </p>
        </button>

        {/* Physical Visit CTA - If Nearby */}
        <button
          onClick={() => handleScheduleClick('physical-visit')}
          disabled={
            !isNearby || (isScheduling && selectedContact !== 'physical-visit')
          }
          className={`p-4 rounded-lg border-2 transition-all ${
            isNearby
              ? 'border-green-500 hover:bg-green-50 bg-green-500/5'
              : 'border-gray-300 opacity-50 cursor-not-allowed bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{isNearby ? '🏠' : '🔒'}</span>
            <h4 className="font-semibold text-gray-900">Schedule Visit</h4>
          </div>
          <p className="text-sm text-gray-600 text-left">
            {isNearby
              ? '🌟 Recommended - Visit PG in person'
              : `Only available within 50km (You: ${distanceKm.toFixed(0)}km away)`}
          </p>
          {isNearby && (
            <p className="text-xs text-green-600 font-medium mt-2">
              Schedule Now →
            </p>
          )}
        </button>
      </div>

      {/* Scheduling Form */}
      {isScheduling && (
        <SchedulingForm
          contactType={selectedContact}
          pgName={pgName}
          ownerName={ownerName}
          onConfirm={handleConfirmSchedule}
          onCancel={() => {
            setIsScheduling(false);
            setSelectedContact(null);
          }}
        />
      )}

      {/* Success Message */}
      {scheduled && scheduledData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">✓</span>
            <div>
              <h4 className="font-semibold text-green-900">
                {scheduledData.type === 'video-call'
                  ? 'Video call scheduled!'
                  : 'Visit scheduled!'}
              </h4>
              <p className="text-sm text-green-700 mt-1">
                {scheduledData.date} at {scheduledData.time}. A confirmation
                has been sent to your registered phone number.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trust Indicators */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-900">Trust Indicators</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Verified owner identity</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Real student reviews</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Media verified by admins</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-600">✓</span>
            <span>Secure communication</span>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-blue-900">
          💡 <strong>Tip:</strong> Always video call or visit in person before
          booking. Never share sensitive information over phone.
        </p>
      </div>
    </div>
  );
};

interface SchedulingFormProps {
  contactType: ContactType;
  pgName: string;
  ownerName: string;
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
}

const SchedulingForm: React.FC<SchedulingFormProps> = ({
  contactType,
  ownerName,
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-blue-300 p-5 space-y-4">
      <h4 className="font-semibold text-gray-900">
        Schedule{' '}
        {contactType === 'video-call'
          ? 'Video Call'
          : 'Physical Visit'}{' '}
        with {ownerName}
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select time slot</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="17:00">05:00 PM</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 text-center">
        {contactType === 'video-call'
          ? 'You will receive a video call link via SMS'
          : 'Directions will be sent to your registered phone number'}
      </p>
    </div>
  );
};
