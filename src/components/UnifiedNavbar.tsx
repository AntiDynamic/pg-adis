/**
 * UNIFIED NAVIGATION BAR
 * Provides seamless navigation between Student and PG Owner sections
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';

interface NavbarProps {
  userName?: string;
  userType?: 'student' | 'owner' | 'both';
  isOwner?: boolean;
}

export default function UnifiedNavbar({ userName = 'User', userType = 'student', isOwner = false }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isStudentSection = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/pg-listing') ||
                          location.pathname.includes('/roommate') ||
                          location.pathname.includes('/mess') ||
                          location.pathname.includes('/browse');
  
  const isOwnerSection = location.pathname.includes('/owner');

  return (
    <nav className="sticky top-0 z-50 bg-dark-900 border-b border-gray-800 backdrop-blur-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">🏠</span>
            </div>
            <span className="text-xl font-bold text-gray-100">PGLife</span>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavButton
              label="Find PG"
              icon="🔍"
              active={location.pathname === '/pg-listing'}
              onClick={() => navigate('/pg-listing')}
            />
            <NavButton
              label="Roommates"
              icon="👥"
              active={location.pathname.includes('/roommate') || location.pathname.includes('/browse')}
              onClick={() => navigate('/roommate-matching')}
            />
            <NavButton
              label="Food"
              icon="🍽️"
              active={location.pathname === '/mess-discovery'}
              onClick={() => navigate('/mess-discovery')}
            />
            <NavButton
              label="Dashboard"
              icon="📊"
              active={location.pathname === '/dashboard' && !isOwnerSection}
              onClick={() => navigate('/dashboard')}
            />
          </div>

          {/* Right Section - Mode Switcher */}
          <div className="flex items-center gap-3">
            {/* Student/Owner Toggle */}
            {(userType === 'both' || isOwner) && (
              <div className="hidden md:flex items-center bg-surface-elevated rounded-lg p-1 border border-gray-800">
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    isStudentSection
                      ? 'bg-trust-500 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  🎒 Student
                </button>
                <button
                  onClick={() => navigate('/owner/dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    isOwnerSection
                      ? 'bg-trust-500 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  🏠 Owner
                </button>
              </div>
            )}

            {/* Become Owner CTA (for students only) */}
            {userType === 'student' && !isOwner && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/owner/signup')}
                className="hidden md:flex items-center gap-2"
              >
                <span>🏠</span>
                <span>List Your PG</span>
              </Button>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface-elevated rounded-lg border border-gray-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-trust-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-200">
                {userName}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Mode Switcher */}
        {(userType === 'both' || isOwner) && (
          <div className="md:hidden pb-3">
            <div className="flex bg-surface-elevated rounded-lg p-1 border border-gray-800">
              <button
                onClick={() => navigate('/dashboard')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isStudentSection
                    ? 'bg-trust-500 text-white'
                    : 'text-gray-400'
                }`}
              >
                🎒 Student
              </button>
              <button
                onClick={() => navigate('/owner/dashboard')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                  isOwnerSection
                    ? 'bg-trust-500 text-white'
                    : 'text-gray-400'
                }`}
              >
                🏠 Owner
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavButton({ label, icon, active, onClick }: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
        active
          ? 'bg-trust-500/10 text-trust-400 border border-trust-500/20'
          : 'text-gray-400 hover:text-gray-300 hover:bg-surface-elevated'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Quick Access Floating Button (for mobile)
export function QuickAccessButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = React.useState(false);
  
  const isOwnerSection = location.pathname.includes('/owner');

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-trust-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition md:hidden"
      >
        {showMenu ? '✕' : '☰'}
      </button>

      {/* Menu Overlay */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed bottom-24 right-6 z-40 bg-dark-900 border border-gray-800 rounded-xl p-4 shadow-xl space-y-2 min-w-[200px] md:hidden">
            <QuickMenuItem
              icon="🔍"
              label="Find PG"
              onClick={() => {
                navigate('/pg-listing');
                setShowMenu(false);
              }}
            />
            <QuickMenuItem
              icon="👥"
              label="Roommates"
              onClick={() => {
                navigate('/roommate-matching');
                setShowMenu(false);
              }}
            />
            <QuickMenuItem
              icon="🍽️"
              label="Food"
              onClick={() => {
                navigate('/mess-discovery');
                setShowMenu(false);
              }}
            />
            <QuickMenuItem
              icon="📊"
              label="Dashboard"
              onClick={() => {
                navigate('/dashboard');
                setShowMenu(false);
              }}
            />
            <div className="border-t border-gray-800 pt-2 mt-2">
              <QuickMenuItem
                icon={isOwnerSection ? "🎒" : "🏠"}
                label={isOwnerSection ? "Student Mode" : "Owner Mode"}
                highlight
                onClick={() => {
                  navigate(isOwnerSection ? '/dashboard' : '/owner/dashboard');
                  setShowMenu(false);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function QuickMenuItem({ icon, label, onClick, highlight = false }: {
  icon: string;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
        highlight
          ? 'bg-trust-500 text-white hover:bg-trust-600'
          : 'text-gray-300 hover:bg-surface-elevated'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
