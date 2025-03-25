// client/src/components/ui/LoadingScreen.js
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="mb-4 text-5xl">🐱</div>
      <h1 className="text-2xl font-bold mb-4">Кошачья Империя</h1>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;