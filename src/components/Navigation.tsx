import React from 'react';
import { Menu, Plus, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/authService';

interface NavigationProps {
  onAddEventClick: () => void;
  onSignInClick: () => void;
  onJoinMovementClick: () => void;
  currentView?: 'events' | 'profile';
  onViewChange?: (view: 'events' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onAddEventClick, 
  onSignInClick, 
  onJoinMovementClick,
  currentView = 'events',
  onViewChange
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  const scrollToEvents = () => {
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        // Optional: Show success message or redirect
        console.log('Signed out successfully');
      } else {
        console.error('Sign out error:', result.error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">ShowGo</h1>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">ShowGo</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {/* Only show Home and Events for unauthenticated users */}
              {!isAuthenticated && (
                <>
                  <a href="#" className="text-purple-400 hover:text-purple-300 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Home
                  </a>
                  <button onClick={scrollToEvents} className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Events
                  </button>
                </>
              )}
              
              {/* Navigation for authenticated users */}
              {isAuthenticated && onViewChange && (
                <>
                  <button 
                    onClick={() => onViewChange('events')}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      currentView === 'events' 
                        ? 'text-purple-400' 
                        : 'text-gray-300 hover:text-purple-400'
                    }`}
                  >
                    Events
                  </button>
                  <button 
                    onClick={() => onViewChange('profile')}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      currentView === 'profile' 
                        ? 'text-purple-400' 
                        : 'text-gray-300 hover:text-purple-400'
                    }`}
                  >
                    Profile
                  </button>
                </>
              )}

              {/* Conditional rendering based on authentication */}
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={onAddEventClick}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-purple-400 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
                  >
                    <Plus size={16} />
                    <span>Add Event</span>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={onJoinMovementClick}
                    className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Join the movement
                  </button>
                  <button 
                    onClick={onSignInClick}
                    className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              {/* Mobile conditional rendering */}
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={onAddEventClick}
                    className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-2 rounded-lg hover:from-purple-500 hover:to-purple-400 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    aria-label="Add Event"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-purple-400 p-2 rounded-lg transition-all duration-200"
                    aria-label="Log Out"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <button 
                  onClick={onSignInClick}
                  className="text-gray-300 hover:text-purple-400 p-2 rounded-lg transition-all duration-200"
                  aria-label="Sign In"
                >
                  <LogIn size={18} />
                </button>
              )}
              <button className="text-gray-300 hover:text-purple-400 p-2">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;