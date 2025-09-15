import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, User, Tag, Phone, Mail, Image, FileText, Upload } from 'lucide-react';
import { createEvent, CreateEventData } from '../lib/eventService';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
  defaultOrganizer?: string;
  defaultEmail?: string;
}

interface FormData {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  organizer: string;
  category: string;
  phone: string;
  email: string;
  image: File | null;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onEventCreated,
  defaultOrganizer = 'ShowGo Events',
  defaultEmail = 'info@showgo.com'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    organizer: defaultOrganizer,
    category: '',
    phone: '(123) 456-7890',
    email: defaultEmail,
    image: null
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Rock', 'Jazz', 'Electronic', 'Indie', 'Hip-Hop', 'Acoustic'];

  // Update form data when default values change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      organizer: defaultOrganizer,
      email: defaultEmail
    }));
  }, [defaultOrganizer, defaultEmail]);

  // Handle ESC key press and focus management
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
        }));
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Event image is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData: CreateEventData = {
        title: formData.title.trim(),
        date: formData.date,
        time: formData.time,
        venue: formData.venue.trim(),
        description: formData.description.trim(),
        organizer: formData.organizer.trim(),
        category: formData.category,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        image: formData.image!
      };

      await createEvent(eventData);

      // Success - reset form and close modal
      setFormData({
        title: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        organizer: defaultOrganizer,
        category: '',
        phone: '(123) 456-7890',
        email: defaultEmail,
        image: null
      });
      setImagePreview(null);
      setErrors({});
      
      // Notify parent component to refresh events list
      if (onEventCreated) {
        onEventCreated();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({
        title: error instanceof Error ? error.message : 'Failed to create event. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-event-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 animate-scale-in overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 sm:p-8">
            <h1 
              id="add-event-title"
              className="text-2xl sm:text-3xl font-bold text-white pr-8"
            >
              Add New Event
            </h1>
            <p className="text-purple-100 mt-2">Create a new music event for the community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <FileText size={20} className="mr-2 text-purple-400" />
                Basic Information
              </h3>
              
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.category ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the event, artists, and what attendees can expect..."
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-vertical ${
                    errors.description ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Calendar size={20} className="mr-2 text-purple-400" />
                Date & Time
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      errors.date ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Event Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      errors.time ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.time && <p className="mt-1 text-sm text-red-400">{errors.time}</p>}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <MapPin size={20} className="mr-2 text-purple-400" />
                Location
              </h3>
              
              {/* Venue */}
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="Enter venue name and address"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.venue ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.venue && <p className="mt-1 text-sm text-red-400">{errors.venue}</p>}
              </div>
            </div>

            {/* Organizer Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <User size={20} className="mr-2 text-purple-400" />
                Organizer Information
              </h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Organizer */}
                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-300 mb-2">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    placeholder="Event organizer name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone size={16} className="inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contact phone number"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Contact email address"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
            </div>

            {/* Image */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Image size={20} className="mr-2 text-purple-400" />
                Event Image
              </h3>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Image *
                </label>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                {/* Upload area */}
                <div 
                  onClick={handleImageClick}
                  className={`relative w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                    errors.image 
                      ? 'border-red-500 bg-red-500/5' 
                      : 'border-gray-600 hover:border-purple-500 bg-gray-800/50 hover:bg-gray-800/70'
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Upload className="mx-auto mb-2 text-white" size={24} />
                          <p className="text-white text-sm">Click to change image</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Upload className="mb-4" size={48} />
                      <p className="text-lg font-medium mb-2">Upload Event Image</p>
                      <p className="text-sm text-center px-4">
                        Click to browse or drag and drop<br />
                        JPEG, PNG, GIF, or WebP (max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                
                {errors.image && <p className="mt-1 text-sm text-red-400">{errors.image}</p>}
                {formData.image && !errors.image && (
                  <p className="mt-1 text-xs text-green-400">
                    ✓ {formData.image.name} ({(formData.image.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-700/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-500 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Event...
                  </div>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;