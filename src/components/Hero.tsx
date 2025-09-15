import React from 'react';
import SoundWave from './SoundWave';

interface HeroProps {
  onJoinMovementClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinMovementClick }) => {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <SoundWave />
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Discover Music
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Events
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Find the hottest live music experiences in your area. Connect with artists, discover new sounds, and create unforgettable memories.
        </p>
        
        <button 
          onClick={onJoinMovementClick}
          className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        >
          <span className="relative z-10">Join the movement</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300" />
        </button>
      </div>
    </section>
  );
};

export default Hero;