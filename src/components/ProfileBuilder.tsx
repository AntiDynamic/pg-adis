import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { UserProfile, UserPreferences } from '../types';
import { CheckIcon, SparklesIcon } from './ui/Icons';

/**
 * PROFILE BUILDER - Multi-step onboarding for roommate matching
 * 
 * Step 1: Basic Info (name, age, gender, contact)
 * Step 2: Living Preferences (budget, area, room type, move-in)
 * Step 3: Lifestyle Matching (the REAL compatibility factors)
 * 
 * Keep it simple, visual, and fast.
 */

interface ProfileBuilderProps {
  onComplete: (profile: UserProfile, preferences: UserPreferences) => void;
  onCancel?: () => void;
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  
  // Basic Info State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState<'student' | 'working'>('student');
  const [college, setCollege] = useState('');
  const [company, setCompany] = useState('');
  
  // Living Preferences State
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredArea, setPreferredArea] = useState('');
  const [roomSharing, setRoomSharing] = useState<'single' | 'double' | 'triple'>('double');
  const [moveInDate, setMoveInDate] = useState('');
  const [stayDuration, setStayDuration] = useState('6');
  
  // Lifestyle Matching State (MOST IMPORTANT)
  const [cleanlinessLevel, setCleanlinessLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [sleepTime, setSleepTime] = useState<'early' | 'normal' | 'late'>('normal');
  const [wakeTime, setWakeTime] = useState<'early' | 'normal' | 'late'>('normal');
  const [foodPreference, setFoodPreference] = useState<'veg' | 'non-veg' | 'egg' | 'vegan'>('veg');
  const [smoking, setSmoking] = useState<'no' | 'occasionally' | 'yes'>('no');
  const [drinking, setDrinking] = useState<'no' | 'occasionally' | 'yes'>('no');
  const [noiseTolerance, setNoiseTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [guestsFrequency, setGuestsFrequency] = useState<'rare' | 'sometimes' | 'often'>('rare');
  const [introvertExtrovert, setIntrovertExtrovert] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [conflictHandling, setConflictHandling] = useState<'calm' | 'direct' | 'avoidant'>('calm');
  const [acPreference, setAcPreference] = useState(false);
  const [genderPreference, setGenderPreference] = useState<'male' | 'female' | 'any'>('any');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      age: parseInt(age),
      gender,
      phone,
      email,
      city,
      college: occupation === 'student' ? college : undefined,
      company: occupation === 'working' ? company : undefined,
      verified: false,
      createdAt: new Date(),
    };

    const preferences: UserPreferences = {
      userId: profile.id,
      budgetMin: parseInt(budgetMin),
      budgetMax: parseInt(budgetMax),
      preferredAreas: [preferredArea],
      roomSharing,
      moveInDate: new Date(moveInDate),
      stayDuration: parseInt(stayDuration),
      cleanlinessLevel,
      sleepTime,
      wakeTime,
      foodPreference,
      smoking,
      drinking,
      noiseTolerance,
      guestsFrequency,
      introvertExtrovert,
      conflictHandling,
      workSchedule: occupation === 'student' ? 'student' : 'working',
      acPreference,
      languageComfort: ['English', 'Hindi'],
      genderPreference,
    };

    onComplete(profile, preferences);
  };

  const isStep1Valid = name && age && phone && email && city && (occupation === 'student' ? college : company);
  const isStep2Valid = budgetMin && budgetMax && preferredArea && moveInDate;

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="verified" icon={<SparklesIcon className="w-4 h-4" />} className="mb-4">
            Smart Matching
          </Badge>
          <h1 className="text-3xl font-bold mb-2">Build Your Profile</h1>
          <p className="text-gray-400">Help us find your perfect roommate match</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    s < step
                      ? 'bg-trust-500 text-white'
                      : s === step
                      ? 'bg-trust-500 text-white'
                      : 'bg-surface text-gray-500'
                  }`}
                >
                  {s < step ? <CheckIcon className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-trust-500' : 'bg-surface'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={step === 1 ? 'text-trust-400 font-medium' : 'text-gray-500'}>
              Basic Info
            </span>
            <span className={step === 2 ? 'text-trust-400 font-medium' : 'text-gray-500'}>
              Living Needs
            </span>
            <span className={step === 3 ? 'text-trust-400 font-medium' : 'text-gray-500'}>
              Lifestyle Match
            </span>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="p-8">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age *
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 22"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender *
                </label>
                <div className="flex gap-3">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        gender === g
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Pune, Mumbai, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  I am a *
                </label>
                <div className="flex gap-3">
                  {(['student', 'working'] as const).map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setOccupation(occ)}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        occupation === occ
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      {occ === 'student' ? 'Student' : 'Working Professional'}
                    </button>
                  ))}
                </div>
              </div>

              {occupation === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    College/University *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your college name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
              )}

              {occupation === 'working' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Living Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">What are you looking for?</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monthly Budget Range *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min (₹)"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max (₹)"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Area *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Koramangala, Aundh, Lajpat Nagar"
                  value={preferredArea}
                  onChange={(e) => setPreferredArea(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Room Sharing Preference *
                </label>
                <div className="flex gap-3">
                  {(['single', 'double', 'triple'] as const).map((room) => (
                    <button
                      key={room}
                      onClick={() => setRoomSharing(room)}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        roomSharing === room
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      {room.charAt(0).toUpperCase() + room.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Move-in Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-trust-500"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stay Duration (months)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 6"
                    value={stayDuration}
                    onChange={(e) => setStayDuration(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roommate Gender Preference
                </label>
                <div className="flex gap-3">
                  {(['any', 'male', 'female'] as const).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setGenderPreference(pref)}
                      className={`flex-1 py-3 rounded-lg font-medium transition ${
                        genderPreference === pref
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      {pref === 'any' ? 'Any' : pref.charAt(0).toUpperCase() + pref.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acPreference}
                    onChange={(e) => setAcPreference(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-surface text-trust-500 focus:ring-trust-500"
                  />
                  <span className="text-gray-300">I prefer AC rooms</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Lifestyle Matching */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Lifestyle Compatibility</h2>
                <p className="text-gray-400 text-sm">
                  These are the REAL factors that determine if roommates get along
                </p>
              </div>

              {/* Cleanliness - 25% weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Cleanliness Level (Most Important)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setCleanlinessLevel(level as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 py-4 rounded-lg font-medium transition ${
                        cleanlinessLevel === level
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {level === 1 ? '😴' : level === 2 ? '😐' : level === 3 ? '🙂' : level === 4 ? '😊' : '✨'}
                      </div>
                      <div className="text-xs">
                        {level === 1
                          ? 'Relaxed'
                          : level === 2
                          ? 'Casual'
                          : level === 3
                          ? 'Normal'
                          : level === 4
                          ? 'Clean'
                          : 'Very Clean'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep & Wake Schedule - 20% weight each */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Sleep Time
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'early', label: '🌅 Early (10-11 PM)', time: '10-11 PM' },
                      { value: 'normal', label: '🌙 Normal (11-12 AM)', time: '11-12 AM' },
                      { value: 'late', label: '🦉 Late Night (12-2 AM)', time: '12-2 AM' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSleepTime(option.value as any)}
                        className={`p-3 rounded-lg font-medium text-left transition ${
                          sleepTime === option.value
                            ? 'bg-trust-500 text-white'
                            : 'bg-surface text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Wake Time
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'early', label: '🌅 Early (6-7 AM)', time: '6-7 AM' },
                      { value: 'normal', label: '☀️ Normal (7-9 AM)', time: '7-9 AM' },
                      { value: 'late', label: '😴 Late (9+ AM)', time: '9+ AM' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setWakeTime(option.value as any)}
                        className={`p-3 rounded-lg font-medium text-left transition ${
                          wakeTime === option.value
                            ? 'bg-trust-500 text-white'
                            : 'bg-surface text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food Preference - 15% weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Food Preference
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: 'veg', label: '🥗 Vegetarian' },
                    { value: 'egg', label: '🍳 Eggetarian' },
                    { value: 'non-veg', label: '🍗 Non-Veg' },
                    { value: 'vegan', label: '🌱 Vegan' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFoodPreference(option.value as any)}
                      className={`p-3 rounded-lg font-medium transition ${
                        foodPreference === option.value
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smoking & Drinking - 15% weight combined */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Smoking
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'no', label: '🚭 No' },
                      { value: 'occasionally', label: '🤏 Occasionally' },
                      { value: 'yes', label: '🚬 Yes' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSmoking(option.value as any)}
                        className={`p-3 rounded-lg font-medium text-left transition ${
                          smoking === option.value
                            ? 'bg-trust-500 text-white'
                            : 'bg-surface text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Drinking
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'no', label: '🚫 No' },
                      { value: 'occasionally', label: '🥂 Occasionally' },
                      { value: 'yes', label: '🍺 Yes' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDrinking(option.value as any)}
                        className={`p-3 rounded-lg font-medium text-left transition ${
                          drinking === option.value
                            ? 'bg-trust-500 text-white'
                            : 'bg-surface text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Noise & Guests - 10% weight each */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Noise Tolerance
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'low', label: '🤫 Low - Need quiet' },
                      { value: 'medium', label: '🔉 Medium - Normal' },
                      { value: 'high', label: '🔊 High - Don\'t mind' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setNoiseTolerance(option.value as any)}
                        className={`p-3 rounded-lg font-medium text-left transition ${
                          noiseTolerance === option.value
                            ? 'bg-trust-500 text-white'
                            : 'bg-surface text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Guests Frequency
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'rare', label: '👤 Rare - Very occasional' },
                      { value: 'sometimes', label: '👥 Sometimes - Weekends' },
                      { value: 'often', label: '👨‍👩‍👧‍👦 Often - Regularly' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGuestsFrequency(option.value as any)}
                        className={`p-3 rounded-lg font-medium text-left transition ${
                          guestsFrequency === option.value
                            ? 'bg-trust-500 text-white'
                            : 'bg-surface text-gray-300 hover:bg-surface-hover'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personality - 5% weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Personality Type
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntrovertExtrovert(level as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 py-4 rounded-lg font-medium transition ${
                        introvertExtrovert === level
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      <div className="text-xs">
                        {level === 1
                          ? 'Introvert'
                          : level === 2
                          ? 'Mostly In'
                          : level === 3
                          ? 'Balanced'
                          : level === 4
                          ? 'Mostly Out'
                          : 'Extrovert'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Conflict Handling Style
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'calm', label: '🧘 Calm Discussion' },
                    { value: 'direct', label: '💬 Direct & Quick' },
                    { value: 'avoidant', label: '🤐 Prefer to Avoid' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setConflictHandling(option.value as any)}
                      className={`flex-1 p-3 rounded-lg font-medium transition ${
                        conflictHandling === option.value
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface text-gray-300 hover:bg-surface-hover'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-800">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} fullWidth>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                fullWidth
                disabled={
                  (step === 1 && !isStep1Valid) ||
                  (step === 2 && !isStep2Valid)
                }
              >
                Continue
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit} fullWidth>
                Find My Matches
              </Button>
            )}
            {onCancel && step === 1 && (
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileBuilder;
