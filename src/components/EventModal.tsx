import React, { useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, User, Tag, Phone, Mail, Trash2, Edit3 } from 'lucide-react';
import { Event } from '../types/Event';
import { deleteEvent } from '../lib/eventService';
import { attendEvent, unattendEvent, checkUserAttendance } from '../lib/attendeeService';
import { useAuth } from '../hooks/useAuth';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: Event | null;
  isLoading?: boolean;
  onEditClick?: (event: Event) => void;
  onEventDeleted?: () => void;
  onAttendanceChanged?: () => void;
  onJoinToAttendClick?: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, 
  onClose, 
  eventData, 
  isLoading = false,
  onEditClick,
  onEventDeleted,
  onAttendanceChanged,
  onJoinToAttendClick
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isAttending, setIsAttending] = React.useState(false);
  const [userIsAttending, setUserIsAttending] = React.useState(false);
  const [checkingAttendance, setCheckingAttendance] = React.useState(false);
  const { user, isAuthenticated } = useAuth();

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      // Focus management - focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Check if user is already attending this event
  useEffect(() => {
    const checkAttendance = async () => {
      if (isOpen && eventData && user && isAuthenticated) {
        setCheckingAttendance(true);
        try {
          const isAttending = await checkUserAttendance(eventData.id, user.id);
          setUserIsAttending(isAttending);
        } catch (error) {
          console.error('Error checking attendance:', error);
        } finally {
          setCheckingAttendance(false);
        }
      }
    };

    checkAttendance();
  }, [isOpen, eventData, user, isAuthenticated]);

  // Handle click outside modal
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Focus trap within modal
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Rock': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Jazz': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Electronic': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Indie': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Hip-Hop': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Acoustic': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[category as keyof typeof colors] || 'bg-purple-500/20 text-purple-400 border-purple-500/30';
  };

  const handleDeleteEvent = async () => {
    if (!eventData) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventData.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteEvent(eventData.id);
      
      // Notify parent component to refresh events list
      if (onEventDeleted) {
        onEventDeleted();
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAttendEvent = async () => {
    if (!eventData || !user) return;

    setIsAttending(true);

    try {
      if (userIsAttending) {
        // Unattend the event
        await unattendEvent(eventData.id, user.id);
        setUserIsAttending(false);
      } else {
        // Attend the event
        await attendEvent({
          event_id: eventData.id,
          user_id: user.id,
          user_email: user.email || ''
        });
        setUserIsAttending(true);
      }
      
      // Notify parent component about attendance change
      if (onAttendanceChanged) {
        onAttendanceChanged();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert(error instanceof Error ? error.message : 'Failed to update attendance. Please try again.');
    } finally {
      setIsAttending(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 animate-scale-in overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : eventData ? (
            <>
              {/* Header Image */}
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img
                  src={eventData.image}
                  alt={eventData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                
                {/* Category Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(eventData.category)}`}>
                  {eventData.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                {/* Title */}
                <h1 
                  id="modal-title"
                  className="text-2xl sm:text-3xl font-bold text-white mb-6 pr-8"
                >
                  {eventData.title}
                </h1>

                {/* Event Details Grid */}
                <div className="grid gap-6 sm:grid-cols-2 mb-8">
                  {/* Date & Time */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Calendar size={20} className="mr-3 text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Date</p>
                        <p className="text-sm text-gray-400">{eventData.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Clock size={20} className="mr-3 text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Time</p>
                        <p className="text-sm text-gray-400">{eventData.time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <div className="flex items-start text-gray-300">
                      <MapPin size={20} className="mr-3 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Venue</p>
                        <p className="text-sm text-gray-400">{eventData.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">About This Event</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {eventData.description}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid gap-6 sm:grid-cols-2 mb-8">
                  {/* Organizer */}
                  <div className="flex items-center text-gray-300">
                    <User size={20} className="mr-3 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Organizer</p>
                      <p className="text-sm text-gray-400">{eventData.organizer}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center text-gray-300">
                    <Tag size={20} className="mr-3 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Category</p>
                      <p className="text-sm text-gray-400">{eventData.category} Music</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t border-gray-700/50 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-gray-300">
                      <Phone size={18} className="mr-3 text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <a href={`tel:${eventData.phone}`} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                          {eventData.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <Mail size={18} className="mr-3 text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a href={`mailto:${eventData.email}`} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                          {eventData.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - At the very bottom */}
                {/* Action Buttons - Only show for authenticated users */}
                {isAuthenticated && user && eventData && user.email === eventData.email && (
                  <div className="border-t border-gray-700/50 pt-6 mt-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteEvent}
                        disabled={isDeleting}
                        className="flex items-center px-4 py-2 bg-red-600/30 text-red-300 text-sm font-medium rounded-lg hover:bg-red-600/50 hover:text-red-200 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} className="mr-2" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                      
                      <button
                        onClick={() => {
                          if (onEditClick && eventData) {
                            onEditClick(eventData);
                          }
                        }}
                        className="flex items-center px-4 py-2 bg-gray-700/50 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600/70 hover:text-gray-200 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200"
                      >
                        <Edit3 size={16} className="mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
                {/* Attend Button - Show for authenticated users who are NOT the event creator */}
                {isAuthenticated && user && eventData && user.email !== eventData.email && (
                  <div className="border-t border-gray-700/50 pt-6 mt-6">
                    <button
                      onClick={handleAttendEvent}
                      disabled={isAttending || checkingAttendance}
                      className={`w-full font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        userIsAttending
                          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 hover:shadow-red-500/25'
                          : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/25'
                      }`}
                    >
                      {isAttending ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {userIsAttending ? 'Leaving Event...' : 'Joining Event...'}
                        </div>
                      ) : checkingAttendance ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Checking...
                        </div>
                      ) : userIsAttending ? (
                        'Leave Event'
                      ) : (
                        'Attend Event'
                      )}
                    </button>
                  </div>
                )}

                {/* Join to Attend Button - Show for non-authenticated users */}
                {!isAuthenticated && eventData && onJoinToAttendClick && (
                  <div className="border-t border-gray-700/50 pt-6 mt-6">
                    <button
                      onClick={onJoinToAttendClick}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-500 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                    >
                      Join to Attend
                    </button>
                  </div>
                )}
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-400">Event not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;