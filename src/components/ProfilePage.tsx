import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Clock, Tag, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { useUserAttendingEvents } from '../hooks/useUserAttendingEvents';
import { Event } from '../types/Event';
import EventModal from './EventModal';
import EditEventModal from './EditEventModal';
import AddEventModal from './AddEventModal';

interface ProfilePageProps {
  onCreateEventClick?: () => void;
  onViewEventsClick?: () => void;
  onAttendanceChanged?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onCreateEventClick, onViewEventsClick, onAttendanceChanged }) => {
  const { user } = useAuth();
  const { events, loading, error } = useEvents();
  const { attendingEvents, loading: attendingLoading, error: attendingError, refresh: refreshAttendingEvents } = useUserAttendingEvents(user?.id);
  const [activeTab, setActiveTab] = useState<'attending' | 'created'>('created');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // Filter events created by the current user
  const userCreatedEvents = events.filter(event => 
    user && event.email === user.email
  );

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventUpdated = () => {
    window.location.reload();
  };

  const handleEventDeleted = () => {
    // Refresh both events lists after deletion
    window.location.reload();
  };

  const handleEventAttendanceChanged = () => {
    // Refresh the attending events list without changing views
    refreshAttendingEvents();
  };

  const handleCreateEventClick = () => {
    setIsAddEventModalOpen(true);
  };

  const handleCloseAddEventModal = () => {
    setIsAddEventModalOpen(false);
  };

  const handleEventCreated = () => {
    // Refresh events list after creation
    window.location.reload();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Rock': 'bg-red-500',
      'Jazz': 'bg-blue-500',
      'Electronic': 'bg-purple-500',
      'Indie': 'bg-green-500',
      'Hip-Hop': 'bg-orange-500',
      'Acoustic': 'bg-yellow-500'
    };
    return colors[category as keyof typeof colors] || 'bg-purple-500';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-lg">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.user_metadata?.name || user.user_metadata?.full_name || 'User'}
                </h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-0 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('attending')}
                className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'attending'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Attending
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'created'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Created
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'attending' ? (
              /* Attending Tab - Functional */
              <div>
                {attendingLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : attendingError ? (
                  <div className="text-center py-16">
                    <p className="text-red-400 mb-4">Error loading attending events: {attendingError}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : attendingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {attendingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-48 h-32 sm:h-auto overflow-hidden flex-shrink-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Attending
                            </div>
                          </div>
                          
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold text-white">
                                {event.title}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                              <div className="flex items-center text-sm text-gray-400">
                                <MapPin size={14} className="mr-2 text-purple-400" />
                                <span>{event.venue}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Calendar size={14} className="mr-2 text-purple-400" />
                                <span>{event.date}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock size={14} className="mr-2 text-purple-400" />
                                <span>{event.time}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Users size={14} className="mr-2 text-green-400" />
                                <span>Registered {new Date(event.attended_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleOpenModal(event)}
                                className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
                      <Users className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Events Attended</h3>
                      <p className="text-gray-400 mb-6">
                        You haven't registered for any events yet. Browse events and click "Attend Event" to get started!
                      </p>
                      <button 
                        onClick={() => {
                          if (onViewEventsClick) {
                            onViewEventsClick();
                          }
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-200"
                      >
                        Browse Events
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Created Tab - Functional */
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <p className="text-red-400 mb-4">Error loading events: {error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : userCreatedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {userCreatedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-48 h-32 sm:h-auto overflow-hidden flex-shrink-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                          
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold text-white">
                                {event.title}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </span>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                              <div className="flex items-center text-sm text-gray-400">
                                <MapPin size={14} className="mr-2 text-purple-400" />
                                <span>{event.venue}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Calendar size={14} className="mr-2 text-purple-400" />
                                <span>{event.date}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock size={14} className="mr-2 text-purple-400" />
                                <span>{event.time}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400">
                                <Tag size={14} className="mr-2 text-purple-400" />
                                <span>{event.category} Music</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleOpenModal(event)}
                                className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors duration-200"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
                      <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Events Created</h3>
                      <p className="text-gray-400 mb-6">
                        You haven't created any events yet. Start by creating your first event!
                      </p>
                      <button 
                        onClick={handleCreateEventClick}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-200"
                      >
                        Create Your First Event
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modals */}
      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        eventData={selectedEvent}
        isLoading={loading}
        onEditClick={handleEditClick}
        onEventDeleted={handleEventDeleted}
        onAttendanceChanged={handleEventAttendanceChanged}
      />
      
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        eventData={selectedEvent}
        onEventUpdated={handleEventUpdated}
      />
      
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={handleCloseAddEventModal}
        onEventCreated={handleEventCreated}
        defaultOrganizer={user?.user_metadata?.name || user?.user_metadata?.full_name || 'ShowGo Events'}
        defaultEmail={user?.email || 'info@showgo.com'}
      />
    </>
  );
};

export default ProfilePage;