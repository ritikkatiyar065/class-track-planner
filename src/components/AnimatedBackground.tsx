
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal lines */}
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px] animate-slide-diagonal"></div>
        
        {/* Horizontal lines */}
        <div className="absolute w-full h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_40px] animate-slide-vertical"></div>
        
        {/* Vertical lines */}
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_100%] animate-slide-horizontal"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-[1px]"></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
