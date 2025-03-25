// client/src/components/ui/ResourceCounter.js
import React from 'react';

const ResourceCounter = ({ type, amount, capacity }) => {
  // Иконки ресурсов
  const icons = {
    wood: '🪵',
    fish: '🐟',
    coins: '💰',
    catFood: '🥫',
    stars: '⭐',
    energy: '⚡'
  };

  const percentFilled = capacity ? Math.min((amount / capacity) * 100, 100) : 0;
  
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
      <span className="text-lg">{icons[type] || '📦'}</span>
      <div className="flex flex-col">
        <div className="flex gap-1 text-sm font-medium">
          <span>{amount}</span>
          {capacity && <span className="text-gray-500">/ {capacity}</span>}
        </div>
        
        {capacity && (
          <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-1 bg-blue-500 rounded-full" 
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCounter;