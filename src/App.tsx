import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import EventsSection from './components/EventsSection';
import ProfilePage from './components/ProfilePage';
import AddEventModal from './components/AddEventModal';
import SignUpModal from './components/SignUpModal';
import SignInModal from './components/SignInModal';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  const [isAddEventModalOpen, setIsAddEventModalOpen] = React.useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = React.useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'events' | 'profile'>('events');
  const [refreshEvents, setRefreshEvents] = React.useState(0);

  const handleAddEventClick = () => {
    setIsAddEventModalOpen(true);
  };

  const handleCloseAddEventModal = () => {
    setIsAddEventModalOpen(false);
  };

  const handleJoinMovementClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handleSwitchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  const handleEventCreated = () => {
    // Trigger events list refresh
    setRefreshEvents(prev => prev + 1);
  };

  const handleViewChange = (view: 'events' | 'profile') => {
    setCurrentView(view);
  };

  const handleViewEventsFromProfile = () => {
    setCurrentView('events');
  };

  const handleAttendanceChangedInProfile = () => {
    // Don't change view, just trigger a refresh of the current profile data
    setRefreshEvents(prev => prev + 1);
  };
  return (
    <div className="min-h-screen bg-black">
      <Navigation 
        onAddEventClick={handleAddEventClick} 
        onSignInClick={handleSignInClick}
        onJoinMovementClick={handleJoinMovementClick}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      <main>
        {isAuthenticated ? (
          // Authenticated user views
          currentView === 'profile' ? (
            <ProfilePage 
              onCreateEventClick={() => setIsAddEventModalOpen(true)}
              onViewEventsClick={handleViewEventsFromProfile}
              onAttendanceChanged={handleAttendanceChangedInProfile}
            />
          ) : (
            <EventsSection key={refreshEvents} onJoinToAttendClick={handleJoinMovementClick} />
          )
        ) : (
          // Unauthenticated user view
          <>
            <Hero onJoinMovementClick={handleJoinMovementClick} />
            <EventsSection key={refreshEvents} onJoinToAttendClick={handleJoinMovementClick} />
          </>
        )}
      </main>
      <AddEventModal 
        isOpen={isAddEventModalOpen}
        onClose={handleCloseAddEventModal}
        onEventCreated={handleEventCreated}
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen}
        onClose={handleCloseSignUpModal}
        onSignInClick={handleSwitchToSignIn}
      />
      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={handleCloseSignInModal}
        onSignUpClick={handleSwitchToSignUp}
      />
    </div>
  );
}

interface ProfilePageProps {
  onCreateEventClick?: () => void;
  onViewEventsClick?: () => void;
}
export default App;