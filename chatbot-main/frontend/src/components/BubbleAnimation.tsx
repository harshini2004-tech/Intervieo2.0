import React from 'react';

const BubbleAnimation: React.FC = () => {
  return (
    <div className="flex space-x-2 mt-3 mb-3">
      <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default BubbleAnimation;

