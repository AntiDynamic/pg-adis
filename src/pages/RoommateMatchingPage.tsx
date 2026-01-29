import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
 * ROOMMATE MATCHING PAGE - V3 with Persistent Profile Storage
 * 
 * Flow:
 * 1. Check if user has saved profile in localStorage
 * 2. If yes: Load profile and show matches automatically
 * 3. If no: Show profile builder form
 * 4. Profile persists across sessions until user clears it
 */

const PROFILE_STORAGE_KEY = 'pglife_user_profile';

export default function RoommateMatchingPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{
    profile: UserProfile;
    preferences: UserPreferences;
  } | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);
  const [aiInsights, setAiInsights] = useState<{ [key: string]: string }>({});
  const [loadingInsights, setLoadingInsights] = useState<{ [key: string]: boolean }>({});
  const [locationStats, setLocationStats] = useState<{
    totalInCity: number;
    totalInArea: number;
    matchedCount: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Connection and messaging state
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
  const [savedMatches, setSavedMatches] = useState<Set<string>>(new Set());
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    user: { profile: UserProfile; preferences: UserPreferences } | null;
  }>({ isOpen: false, user: null });
  const [messages, setMessages] = useState<{ [userId: string]: Array<{ text: string; sender: 'me' | 'them'; time: Date }> }>({});
  const [messageInput, setMessageInput] = useState('');

  // Load saved profile on component mount
  useEffect(() => {
    const loadSavedProfile = () => {
      try {
        const savedData = localStorage.getItem(PROFILE_STORAGE_KEY);
        console.log('Raw localStorage data:', savedData);
        
        if (savedData) {
          const { profile, preferences } = JSON.parse(savedData);
          console.log('Parsed profile:', profile);
          console.log('Parsed preferences:', preferences);
          
          // Convert date strings back to Date objects
          profile.createdAt = new Date(profile.createdAt);
          preferences.moveInDate = new Date(preferences.moveInDate);
          
          const user = { profile, preferences };
          setCurrentUser(user);
          
          // Auto-load matches
          loadMatches(user);
          setShowProfileBuilder(false);
        } else {
          console.log('No saved profile found in localStorage');
          setShowProfileBuilder(true);
        }
      } catch (error) {
        console.error('Error loading saved profile:', error);
        setShowProfileBuilder(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProfile();
  }, []);

  // Helper function to load matches for a user
  const loadMatches = (user: { profile: UserProfile; preferences: UserPreferences }) => {
    console.log('Loading matches for user:', user.profile.name, 'City:', user.profile.city);
    console.log('Preferred areas:', user.preferences.preferredAreas);
    
    const cityUsers = getUsersByCity(user.profile.city);
    console.log('City users found:', cityUsers.length);
    
    const areaUsers = user.preferences.preferredAreas.flatMap((area) =>
      getUsersByArea(user.profile.city, area)
    );
    
    const uniqueAreaUsers = Array.from(
      new Map(areaUsers.map((u) => [u.profile.id, u])).values()
    );
    console.log('Area users found:', uniqueAreaUsers.length);

    const allCandidates = uniqueAreaUsers.length > 0 ? uniqueAreaUsers : cityUsers;
    console.log('All candidates:', allCandidates.length);
    
    const foundMatches = findMatches(user, allCandidates, 60);
    console.log('Matches found after filtering:', foundMatches.length);
    
    setMatches(foundMatches);
    setLocationStats({
      totalInCity: cityUsers.length,
      totalInArea: uniqueAreaUsers.length,
      matchedCount: foundMatches.length,
    });

    // Generate AI insights for top 5 matches
    foundMatches.slice(0, 5).forEach((match) => {
      generateAIInsight(match, user);
    });
  };

  // Handle profile completion and save to localStorage
  const handleProfileComplete = (profile: UserProfile, preferences: UserPreferences) => {
    const user = { profile, preferences };
    
    // Save to localStorage
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
    
    setCurrentUser(user);
    setShowProfileBuilder(false);
    
    // Load matches
    loadMatches(user);
  };

  // Generate AI insights for a match
  const generateAIInsight = async (
    match: MatchResult, 
    user: { profile: UserProfile; preferences: UserPreferences } = currentUser!
  ) => {
    if (!user) return;

    setLoadingInsights((prev) => ({ ...prev, [match.matchedUserId]: true }));

    try {
      const matchedUser = mockUsers.find(
        (u) => u.profile.id === match.matchedUserId
      );
      if (!matchedUser) return;

      // Pass full user profiles for more personalized insights
      const insight = await generateMatchInsights(
        user.profile.name,
        matchedUser.profile.name,
        match.matchScore,
        match.breakdown.reasons,
        match.breakdown.warnings,
        user, // Current user's full profile
        matchedUser // Matched user's full profile
      );

      setAiInsights((prev) => ({ ...prev, [match.matchedUserId]: insight }));
    } catch (error) {
      console.error('Error generating AI insight:', error);
    } finally {
      setLoadingInsights((prev) => ({ ...prev, [match.matchedUserId]: false }));
    }
  };

  const handleEditProfile = () => {
    setShowProfileBuilder(true);
    setMatches([]);
    setAiInsights({});
    setLocationStats(null);
  };

  // Connect with a user
  const handleConnect = (userId: string) => {
    setConnectedUsers(prev => new Set([...prev, userId]));
    // Show success message
    alert('Connection request sent! You can now message them.');
  };

  // Save match for later
  const handleSaveMatch = (userId: string) => {
    setSavedMatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Open chat modal
  const handleOpenChat = (user: { profile: UserProfile; preferences: UserPreferences }) => {
    // Auto-connect if not already connected
    if (!connectedUsers.has(user.profile.id)) {
      setConnectedUsers(prev => new Set([...prev, user.profile.id]));
    }
    setChatModal({ isOpen: true, user });
  };

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !chatModal.user) return;
    
    const userId = chatModal.user.profile.id;
    const newMessage = {
      text: messageInput,
      sender: 'me' as const,
      time: new Date()
    };
    
    setMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage]
    }));
    
    setMessageInput('');
    
    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage = {
        text: "Thanks for reaching out! I'm interested in discussing this roommate opportunity. When would be a good time to chat?",
        sender: 'them' as const,
        time: new Date()
      };
      setMessages(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), responseMessage]
      }));
    }, 2000);
  };

  const handleClearProfile = () => {
    if (confirm('Are you sure you want to clear your profile? You will need to fill it again.')) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      setCurrentUser(null);
      setMatches([]);
      setShowProfileBuilder(true);
      setAiInsights({});
      setLocationStats(null);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Profile is already saved in localStorage
    setTimeout(() => {
      setIsSaving(false);
      navigate('/');
    }, 500);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trust-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-800 bg-dark-900/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleBackToHome}
              className="flex items-center gap-2"
            >
              <span>←</span> Back to Home
            </Button>
            <div className="flex gap-3">
              {!showProfileBuilder && currentUser && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleClearProfile}
                  >
                    Clear Profile
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Exiting...' : 'Exit to Home'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Show Profile Builder */}
      {showProfileBuilder && (
        <ProfileBuilder 
          onComplete={handleProfileComplete}
          initialProfile={currentUser?.profile}
          initialPreferences={currentUser?.preferences}
        />
      )}

      {/* Show Matches */}
      {!showProfileBuilder && currentUser && (
        <>
          {/* Header */}
          <div className="border-b border-gray-800 bg-surface-elevated">
            <div className="container-custom py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Your Roommate Matches</h1>
                  <p className="text-gray-400">
                    Found {matches.length} compatible roommates in your area
                  </p>
                </div>
                <Button variant="outline" onClick={handleEditProfile}>
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
                        isConnected={connectedUsers.has(match.matchedUserId)}
                        isSaved={savedMatches.has(match.matchedUserId)}
                        onConnect={() => handleConnect(match.matchedUserId)}
                        onSave={() => handleSaveMatch(match.matchedUserId)}
                        onMessage={() => handleOpenChat(matchedUser)}
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
                    <Button variant="primary" onClick={handleEditProfile}>
                      Adjust Preferences
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Chat Modal */}
      {chatModal.isOpen && chatModal.user && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-trust-500/10 to-emerald-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {chatModal.user.profile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100">
                      {chatModal.user.profile.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {chatModal.user.profile.college || chatModal.user.profile.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatModal({ isOpen: false, user: null })}
                  className="text-gray-400 hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages[chatModal.user.profile.id]?.length > 0 ? (
                messages[chatModal.user.profile.id].map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'me'
                          ? 'bg-trust-500 text-white'
                          : 'bg-surface-elevated text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'me' ? 'text-trust-200' : 'text-gray-500'
                      }`}>
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                    💬
                  </div>
                  <p className="text-gray-400 text-sm">
                    Start a conversation with {chatModal.user.profile.name}
                  </p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-surface-elevated">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-surface border border-gray-700 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-trust-500"
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
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
  isConnected: boolean;
  isSaved: boolean;
  onConnect: () => void;
  onSave: () => void;
  onMessage: () => void;
}

function MatchCardV2({ match, matchedUser, aiInsight, loadingInsight, isConnected, isSaved, onConnect, onSave, onMessage }: MatchCardV2Props) {
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
          {isConnected ? (
            <Button 
              variant="primary" 
              fullWidth 
              onClick={onMessage}
            >
              💬 Message
            </Button>
          ) : (
            <Button 
              variant="primary" 
              fullWidth
              onClick={onConnect}
            >
              ✓ Connect
            </Button>
          )}
          <Button 
            variant={isSaved ? 'default' : 'outline'} 
            fullWidth
            onClick={onSave}
          >
            {isSaved ? '⭐ Saved' : 'Save for Later'}
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
