import React from 'react';

const SoundWave = () => {
  return (
    <div className="flex items-end justify-center space-x-1 h-16 mb-8">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-sm animate-pulse"
          style={{
            width: '3px',
            height: `${20 + Math.random() * 40}px`,
            animationDelay: `${i * 100}ms`,
            animationDuration: `${1 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};

export default SoundWave;