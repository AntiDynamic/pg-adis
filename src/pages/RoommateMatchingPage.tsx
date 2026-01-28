import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { students, universities, Student } from '../data/mockData';
import {
  findCompatibleRoommates,
  getCompatibilityLevel,
  CompatibilityResult,
} from '../utils/helpers';

/**
 * ROOMMATE MATCHING PAGE
 * 
 * Logic-based compatibility matching:
 * - Budget overlap
 * - Sleep schedule compatibility
 * - Cleanliness standards
 * - Food habits
 * - Lifestyle preferences (smoking, drinking)
 * - Study hours
 * 
 * Score threshold: 60% minimum for matches
 */

export default function RoommateMatchingPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [matches, setMatches] = useState<
    Array<{ student: Student; compatibility: CompatibilityResult }>
  >([]);

  // For demo, allow user to select themselves from mock students
  const handleSelectProfile = (student: Student) => {
    setSelectedStudent(student);
    const compatibleMatches = findCompatibleRoommates(student, students, 60);
    setMatches(compatibleMatches);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Roommate</h1>
          <p className="text-gray-600 mt-2">
            Smart compatibility matching based on lifestyle, budget, and habits
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedStudent ? (
          // Profile Selection
          <div className="max-w-3xl mx-auto">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select Your Profile (Demo)
                </h2>
                <p className="text-gray-600 mb-6">
                  In production, you would create your own profile. For this demo,
                  select from existing profiles:
                </p>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleSelectProfile(student)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {
                              universities.find((u) => u.id === student.universityId)
                                ?.name
                            }
                          </p>
                          <div className="flex gap-2 mt-2 text-xs">
                            <Badge variant="default">
                              ₹{student.budgetMin.toLocaleString()} - ₹
                              {student.budgetMax.toLocaleString()}
                            </Badge>
                            <Badge variant="default">{student.foodHabit}</Badge>
                            <Badge variant="default">
                              Cleanliness: {student.cleanliness}/5
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm">Select</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Matches Display
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Your Profile */}
            <div className="lg:col-span-1">
              <YourProfileCard
                student={selectedStudent}
                onChangeProfile={() => {
                  setSelectedStudent(null);
                  setMatches([]);
                }}
              />
            </div>

            {/* Right - Matches */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Matches ({matches.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing roommates with 60%+ compatibility
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {matches.length > 0 ? (
                    matches.map(({ student, compatibility }) => (
                      <MatchCard
                        key={student.id}
                        student={student}
                        compatibility={compatibility}
                      />
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-500">
                      <p className="text-lg mb-2">No compatible matches found</p>
                      <p className="text-sm">
                        Try adjusting your preferences or check back later
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Your Profile Card
interface YourProfileCardProps {
  student: Student;
  onChangeProfile: () => void;
}

function YourProfileCard({ student, onChangeProfile }: YourProfileCardProps) {
  const university = universities.find((u) => u.id === student.universityId);

  return (
    <Card className="sticky top-6">
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <h3 className="font-semibold text-gray-900">Your Profile</h3>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-semibold text-lg text-gray-900">{student.name}</h4>
          <p className="text-sm text-gray-600">{university?.name}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Budget:</span>
            <p className="text-gray-600">
              ₹{student.budgetMin.toLocaleString()} - ₹
              {student.budgetMax.toLocaleString()}/month
            </p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Sleep Schedule:</span>
            <p className="text-gray-600">
              {student.sleepSchedule === 1
                ? '🌅 Very Early Bird'
                : student.sleepSchedule === 2
                ? '🌅 Early Bird'
                : student.sleepSchedule === 3
                ? '⏰ Normal'
                : student.sleepSchedule === 4
                ? '🌙 Night Owl'
                : '🌙 Very Late Night'}
            </p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Cleanliness:</span>
            <p className="text-gray-600">
              {'⭐'.repeat(student.cleanliness)} ({student.cleanliness}/5)
            </p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Food Habit:</span>
            <p className="text-gray-600">
              {student.foodHabit === 'veg'
                ? '🥗 Vegetarian'
                : student.foodHabit === 'vegan'
                ? '🌱 Vegan'
                : '🍗 Non-Vegetarian'}
            </p>
          </div>

          <div>
            <span className="font-medium text-gray-700">Lifestyle:</span>
            <div className="flex gap-2 mt-1">
              <Badge variant={student.smoking ? 'premium' : 'default'}>
                {student.smoking ? 'Smokes' : 'No Smoking'}
              </Badge>
              <Badge variant={student.drinking ? 'new' : 'default'}>
                {student.drinking ? 'Drinks' : 'No Drinking'}
              </Badge>
            </div>
          </div>

          <div>
            <span className="font-medium text-gray-700">Study Hours:</span>
            <p className="text-gray-600">
              {student.studyHours === 1
                ? '📚 Light'
                : student.studyHours === 2
                ? '📚 Moderate'
                : student.studyHours === 3
                ? '📚 Regular'
                : student.studyHours === 4
                ? '📚 Intensive'
                : '📚 Very Intensive'}
            </p>
          </div>
        </div>

        <Button onClick={onChangeProfile} variant="outline" className="w-full">
          Change Profile
        </Button>
      </div>
    </Card>
  );
}

// Match Card
interface MatchCardProps {
  student: Student;
  compatibility: CompatibilityResult;
}

function MatchCard({ student, compatibility }: MatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const university = universities.find((u) => u.id === student.universityId);
  const { label, color } = getCompatibilityLevel(compatibility.score);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-600">{university?.name}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {compatibility.score}%
          </div>
          <div className={`text-sm font-medium ${color}`}>{label}</div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Budget:</span>
          <p className="font-medium">
            ₹{student.budgetMin.toLocaleString()} - ₹
            {student.budgetMax.toLocaleString()}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Food:</span>
          <p className="font-medium">{student.foodHabit}</p>
        </div>
        <div>
          <span className="text-gray-600">Cleanliness:</span>
          <p className="font-medium">{'⭐'.repeat(student.cleanliness)}</p>
        </div>
        <div>
          <span className="text-gray-600">Study:</span>
          <p className="font-medium">{student.studyHours}/5 intensity</p>
        </div>
      </div>

      {/* Compatibility Explanation */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Why this match?</h4>
        <ul className="space-y-1 text-sm">
          {compatibility.explanation.slice(0, showDetails ? undefined : 3).map(
            (exp, idx) => (
              <li
                key={idx}
                className={
                  exp.startsWith('✓')
                    ? 'text-green-600'
                    : exp.startsWith('✗')
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }
              >
                {exp}
              </li>
            )
          )}
        </ul>
        {compatibility.explanation.length > 3 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            {showDetails ? 'Show less' : 'Show more details'}
          </button>
        )}
      </div>

      {/* Breakdown (if details shown) */}
      {showDetails && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">
            Compatibility Breakdown:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Budget Match:</span>
              <span className="ml-2 font-medium">
                {Math.round(compatibility.breakdown.budgetMatch)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Sleep Schedule:</span>
              <span className="ml-2 font-medium">
                {Math.round(compatibility.breakdown.sleepScheduleMatch)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Cleanliness:</span>
              <span className="ml-2 font-medium">
                {Math.round(compatibility.breakdown.cleanlinessMatch)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Food Habits:</span>
              <span className="ml-2 font-medium">
                {Math.round(compatibility.breakdown.foodHabitMatch)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Lifestyle:</span>
              <span className="ml-2 font-medium">
                {Math.round(compatibility.breakdown.lifestyleMatch)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Study Hours:</span>
              <span className="ml-2 font-medium">
                {Math.round(compatibility.breakdown.studyHoursMatch)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1">Connect</Button>
        <Button variant="outline">View Full Profile</Button>
      </div>
    </div>
  );
}
