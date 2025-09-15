import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Music } from 'lucide-react';
import { Event } from '../types/Event';

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {

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

  return (
    <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 border border-gray-700/50 hover:border-purple-500/30 h-64">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-48 h-48 sm:h-64 overflow-hidden flex-shrink-0">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(event.category)}`}>
            {event.category}
          </div>
        </div>
        
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-200">
                {event.title}
              </h3>
              <Music className="text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity duration-200" size={20} />
            </div>
            
            <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
              {event.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <Calendar size={16} className="mr-3 text-purple-400" />
                <span>{event.date} at {event.time}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <MapPin size={16} className="mr-3 text-purple-400" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <button 
              onClick={onViewDetails}
              className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors duration-200 hover:underline"
            >
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;