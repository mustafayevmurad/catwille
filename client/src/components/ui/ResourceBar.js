// client/src/components/ui/ResourceBar.js
import React from 'react';
import ResourceCounter from './ResourceCounter';

const ResourceBar = ({ resources }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md p-2 flex justify-around z-10">
      {resources.wood && (
        <ResourceCounter 
          type="wood" 
          amount={resources.wood.amount} 
          capacity={resources.wood.capacity} 
        />
      )}
      
      {resources.fish && (
        <ResourceCounter 
          type="fish" 
          amount={resources.fish.amount} 
          capacity={resources.fish.capacity} 
        />
      )}
      
      {resources.coins && (
        <ResourceCounter 
          type="coins" 
          amount={resources.coins.amount} 
        />
      )}
      
      {resources.energy && (
        <ResourceCounter 
          type="energy" 
          amount={resources.energy.amount} 
          capacity={resources.energy.capacity} 
        />
      )}
      
      {resources.stars && (
        <ResourceCounter 
          type="stars" 
          amount={resources.stars.amount} 
        />
      )}
    </div>
  );
};

export default ResourceBar;