import React from 'react';
import EventCard from './EventCard';
import EventModal from './EventModal';
import EditEventModal from './EditEventModal';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types/Event';

interface EventsSectionProps {
  onJoinToAttendClick?: () => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ onJoinToAttendClick }) => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

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
    setIsModalOpen(false); // Close view modal
    setIsEditModalOpen(true); // Open edit modal
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventUpdated = () => {
    // Refresh events list after update
    window.location.reload();
  };

  const handleEventDeleted = () => {
    // Refresh events list after deletion
    window.location.reload();
  };

  if (loading) {
    return (
      <section id="events-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Don't miss out on these incredible live music experiences happening near you
            </p>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="events-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Don't miss out on these incredible live music experiences happening near you
            </p>
          </div>
          
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">Error loading events: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
      <section id="events-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Don't miss out on these incredible live music experiences happening near you
            </p>
          </div>
          
          <div className="grid gap-8 md:gap-6">
            {events.length > 0 ? events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onViewDetails={() => handleOpenModal(event)}
              />
            )) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No events found</p>
              </div>
            )}
          </div>
          
          {events.length > 0 && (
            <div className="text-center mt-16">
              <button className="group inline-flex items-center px-8 py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-purple-600 transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-purple-500">
                <span className="relative z-10">Load More Events</span>
              </button>
            </div>
          )}
        </div>
      </section>
      
      <EventModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        eventData={selectedEvent}
        isLoading={loading}
        onEditClick={handleEditClick}
        onEventDeleted={handleEventDeleted}
        onJoinToAttendClick={onJoinToAttendClick}
      />
      
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        eventData={selectedEvent}
        onEventUpdated={handleEventUpdated}
      />
    </>
  );
};

export default EventsSection;