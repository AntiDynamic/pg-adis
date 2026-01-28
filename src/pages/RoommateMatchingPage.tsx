import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import ProfileBuilder from '../components/ProfileBuilder';
import { UserProfile, UserPreferences, MatchResult } from '../types';
import { findMatches } from '../utils/matchingAlgorithm';
import { generateMatchInsights } from '../utils/geminiApi';
import { SparklesIcon, LocationIcon } from '../components/ui/Icons';
import { mockUsers, getUsersByCity, getUsersByArea } from '../data/mockUsers';

/**
 * ROOMMATE MATCHING PAGE - V2 with Location-First Matching
 * 
 * Flow:
 * 1. User builds profile
 * 2. Filter by city/area FIRST (location matters most!)
 * 3. Then apply weighted compatibility matching
 * 4. Show matches with AI-enhanced insights
 */

export default function RoommateMatchingPage() {
  const [currentUser, setCurrentUser] = useState<{
    profile: UserProfile;
    preferences: UserPreferences;
  } | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showProfileBuilder, setShowProfileBuilder] = useState(true);
  const [aiInsights, setAiInsights] = useState<{ [key: string]: string }>({});
  const [loadingInsights, setLoadingInsights] = useState<{ [key: string]: boolean }>({});
  const [locationStats, setLocationStats] = useState<{
    totalInCity: number;
    totalInArea: number;
    matchedCount: number;
  } | null>(null);

  // Handle profile completion
  const handleProfileComplete = (profile: UserProfile, preferences: UserPreferences) => {
    const user = { profile, preferences };
    setCurrentUser(user);
    setShowProfileBuilder(false);

    // STEP 1: Filter by location first
    const cityUsers = getUsersByCity(profile.city);
    
    // Get users in preferred areas
    const areaUsers = preferences.preferredAreas.flatMap((area) =>
      getUsersByArea(profile.city, area)
    );
    
    // Remove duplicates
    const uniqueAreaUsers = Array.from(
      new Map(areaUsers.map((u) => [u.profile.id, u])).values()
    );

    // STEP 2: Apply compatibility matching to location-filtered users
    const allCandidates = uniqueAreaUsers.length > 0 ? uniqueAreaUsers : cityUsers;
    const foundMatches = findMatches(user, allCandidates, 60);
    
    setMatches(foundMatches);
    setLocationStats({
      totalInCity: cityUsers.length,
      totalInArea: uniqueAreaUsers.length,
      matchedCount: foundMatches.length,
    });

    // STEP 3: Generate AI insights for top 5 matches
    foundMatches.slice(0, 5).forEach((match) => {
      generateAIInsight(match);
    });
  };

  // Generate AI insights for a match
  const generateAIInsight = async (match: MatchResult) => {
    if (!currentUser) return;

    setLoadingInsights((prev) => ({ ...prev, [match.matchedUserId]: true }));

    try {
      const matchedUser = mockUsers.find(
        (u) => u.profile.id === match.matchedUserId
      );
      if (!matchedUser) return;

      const insight = await generateMatchInsights(
        currentUser.profile.name,
        matchedUser.profile.name,
        match.matchScore,
        match.breakdown.reasons,
        match.breakdown.warnings
      );

      setAiInsights((prev) => ({ ...prev, [match.matchedUserId]: insight }));
    } catch (error) {
      console.error('Error generating AI insight:', error);
    } finally {
      setLoadingInsights((prev) => ({ ...prev, [match.matchedUserId]: false }));
    }
  };

  const handleStartOver = () => {
    setCurrentUser(null);
    setMatches([]);
    setShowProfileBuilder(true);
    setAiInsights({});
    setLocationStats(null);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Show Profile Builder */}
      {showProfileBuilder && (
        <ProfileBuilder onComplete={handleProfileComplete} />
      )}

      {/* Show Matches */}
      {!showProfileBuilder && currentUser && (
        <>
          {/* Header */}
          <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-xl sticky top-0 z-40">
            <div className="container-custom py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Your Roommate Matches</h1>
                  <p className="text-gray-400">
                    Found {matches.length} compatible roommates in your area
                  </p>
                </div>
                <Button variant="outline" onClick={handleStartOver}>
                  Edit Profile
                </Button>
              </div>

              {/* Location Stats */}
              {locationStats && (
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 bg-surface-elevated">
                    <div className="flex items-center gap-3">
                      <LocationIcon className="w-5 h-5 text-trust-400" />
                      <div>
                        <div className="text-2xl font-bold text-gray-100">
                          {locationStats.totalInCity}
                        </div>
                        <div className="text-xs text-gray-400">Users in {currentUser.profile.city}</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-surface-elevated">
                    <div className="flex items-center gap-3">
                      <LocationIcon className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-2xl font-bold text-gray-100">
                          {locationStats.totalInArea}
                        </div>
                        <div className="text-xs text-gray-400">In your preferred areas</div>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-trust-500/10 border-trust-500/20">
                    <div className="flex items-center gap-3">
                      <SparklesIcon className="w-5 h-5 text-trust-400" />
                      <div>
                        <div className="text-2xl font-bold text-trust-400">
                          {locationStats.matchedCount}
                        </div>
                        <div className="text-xs text-trust-300">Compatible Matches</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="container-custom section-padding">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Your Profile Summary */}
              <div className="lg:col-span-1">
                <UserProfileCard profile={currentUser.profile} preferences={currentUser.preferences} />
              </div>

              {/* Matches List */}
              <div className="lg:col-span-2 space-y-6">
                {matches.length > 0 ? (
                  matches.map((match) => {
                    const matchedUser = mockUsers.find(
                      (u) => u.profile.id === match.matchedUserId
                    );
                    if (!matchedUser) return null;

                    return (
                      <MatchCardV2
                        key={match.matchedUserId}
                        match={match}
                        matchedUser={matchedUser}
                        aiInsight={aiInsights[match.matchedUserId]}
                        loadingInsight={loadingInsights[match.matchedUserId]}
                      />
                    );
                  })
                ) : (
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-surface-elevated rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <SparklesIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-300 mb-2">
                      No matches found in your area
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      {locationStats && locationStats.totalInCity > 0
                        ? `We found ${locationStats.totalInCity} users in ${currentUser?.profile.city}, but none match your preferences yet. Try adjusting your budget or area preferences.`
                        : 'Be the first in your city! Share PGLife with friends to grow the community.'}
                    </p>
                    <Button variant="primary" onClick={handleStartOver}>
                      Adjust Preferences
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// User Profile Card Component
interface UserProfileCardProps {
  profile: UserProfile;
  preferences: UserPreferences;
}

function UserProfileCard({ profile, preferences }: UserProfileCardProps) {
  return (
    <Card className="sticky top-24">
      <div className="p-4 border-b border-gray-800 bg-trust-500/5">
        <h3 className="font-semibold text-trust-400">Your Profile</h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <div className="w-16 h-16 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-3">
            {profile.name.charAt(0)}
          </div>
          <h4 className="font-bold text-xl text-gray-100">{profile.name}</h4>
          <p className="text-sm text-gray-400">
            {profile.age} • {profile.city}
          </p>
          {profile.college && (
            <p className="text-sm text-gray-400 mt-1">{profile.college}</p>
          )}
          {profile.company && (
            <p className="text-sm text-gray-400 mt-1">{profile.company}</p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-800 space-y-3 text-sm">
          <div>
            <span className="text-gray-500">Budget:</span>
            <p className="text-gray-200 font-medium">
              ₹{preferences.budgetMin.toLocaleString()} - ₹
              {preferences.budgetMax.toLocaleString()}
            </p>
          </div>

          <div>
            <span className="text-gray-500">Room Type:</span>
            <p className="text-gray-200 font-medium capitalize">{preferences.roomSharing}</p>
          </div>

          <div>
            <span className="text-gray-500">Cleanliness:</span>
            <p className="text-gray-200 font-medium">
              {'⭐'.repeat(preferences.cleanlinessLevel)} Level {preferences.cleanlinessLevel}
            </p>
          </div>

          <div>
            <span className="text-gray-500">Schedule:</span>
            <p className="text-gray-200 font-medium">
              Sleep: {preferences.sleepTime} • Wake: {preferences.wakeTime}
            </p>
          </div>

          <div>
            <span className="text-gray-500">Food:</span>
            <p className="text-gray-200 font-medium capitalize">{preferences.foodPreference}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Badge variant={preferences.smoking === 'no' ? 'verified' : 'default'}>
              {preferences.smoking === 'no' ? '🚭 Non-smoker' : '🚬 Smoker'}
            </Badge>
            <Badge variant={preferences.drinking === 'no' ? 'verified' : 'default'}>
              {preferences.drinking === 'no' ? '🚫 No alcohol' : '🍺 Drinks'}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Enhanced Match Card Component
interface MatchCardV2Props {
  match: MatchResult;
  matchedUser: { profile: UserProfile; preferences: UserPreferences };
  aiInsight?: string;
  loadingInsight?: boolean;
}

function MatchCardV2({ match, matchedUser, aiInsight, loadingInsight }: MatchCardV2Props) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-trust-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Great Match';
    if (score >= 60) return 'Good Match';
    return 'Moderate Match';
  };

  // Check if areas overlap
  const hasCommonArea = matchedUser.preferences.preferredAreas.length > 0;

  return (
    <Card hoverable className="overflow-hidden">
      {/* Header with Score */}
      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-trust-500/5 to-emerald-500/5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {matchedUser.profile.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-100 mb-1">
                {matchedUser.profile.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-gray-400">
                  {matchedUser.profile.age} • {matchedUser.profile.gender}
                </span>
                {matchedUser.profile.college && (
                  <Badge variant="default" className="text-xs">
                    🎓 {matchedUser.profile.college}
                  </Badge>
                )}
                {matchedUser.profile.company && (
                  <Badge variant="default" className="text-xs">
                    💼 {matchedUser.profile.company}
                  </Badge>
                )}
              </div>
              {hasCommonArea && (
                <div className="flex items-center gap-2 mt-2 text-sm text-purple-400">
                  <LocationIcon className="w-4 h-4" />
                  <span>Looking in: {matchedUser.preferences.preferredAreas.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <div className={`text-4xl font-bold ${getScoreColor(match.matchScore)}`}>
              {match.matchScore}%
            </div>
            <div className="text-sm font-medium text-trust-400">
              {getScoreLabel(match.matchScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Match Breakdown */}
      <div className="p-6 space-y-6">
        {/* Why They Match */}
        <div>
          <h4 className="text-sm font-bold text-gray-300 uppercase mb-3">
            ✨ Why You Match
          </h4>
          <div className="space-y-2">
            {match.breakdown.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-300 bg-trust-500/5 p-3 rounded-lg"
              >
                {reason}
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {match.breakdown.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-yellow-400 uppercase mb-3">
              ⚠️ Things to Discuss
            </h4>
            <div className="space-y-2">
              {match.breakdown.warnings.map((warning, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-300 bg-yellow-500/5 p-3 rounded-lg"
                >
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insight */}
        {aiInsight && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-purple-400 uppercase mb-2">
                  AI Insight
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">{aiInsight}</p>
              </div>
            </div>
          </div>
        )}

        {loadingInsight && (
          <div className="bg-surface-elevated rounded-lg p-4 text-center">
            <div className="animate-pulse text-gray-400 text-sm">
              Generating AI insights...
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-trust-400 text-sm hover:text-trust-300 transition"
        >
          {showDetails ? '▲ Hide' : '▼ Show'} detailed compatibility breakdown
        </button>

        {showDetails && (
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <ScoreBar label="Cleanliness Match" score={match.breakdown.cleanliness} weight={25} />
            <ScoreBar label="Sleep Schedule" score={match.breakdown.sleepSchedule} weight={20} />
            <ScoreBar label="Food Habits" score={match.breakdown.foodHabits} weight={15} />
            <ScoreBar label="Smoking/Drinking" score={match.breakdown.smokingDrinking} weight={15} />
            <ScoreBar label="Noise Tolerance" score={match.breakdown.noiseTolerance} weight={10} />
            <ScoreBar label="Guests Frequency" score={match.breakdown.guests} weight={10} />
            <ScoreBar label="Personality" score={match.breakdown.personality} weight={5} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="primary" fullWidth>
            Connect
          </Button>
          <Button variant="outline" fullWidth>
            Save for Later
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Score Bar Component
function ScoreBar({ label, score, weight }: { label: string; score: number; weight: number }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-trust-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300">
          {label} <span className="text-gray-500 text-xs">({weight}% weight)</span>
        </span>
        <span className="text-gray-400 font-medium">{score}%</span>
      </div>
      <div className="w-full bg-surface-elevated rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor(score)} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
