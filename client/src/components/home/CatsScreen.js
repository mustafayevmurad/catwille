// client/src/components/cats/CatsScreen.js
import React from 'react';
import CatCard from '../ui/CatCard';

const CatsScreen = ({ 
  cats, 
  activeCats, 
  onActivateCat, 
  onDeactivateCat, 
  playerLevel,
  maxActiveCats = 3
}) => {
  const handleActivate = (catId) => {
    if (activeCats.length < maxActiveCats) {
      onActivateCat(catId);
    } else {
      alert(`Вы можете активировать максимум ${maxActiveCats} кошек одновременно!`);
    }
  };
  
  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Коллекция кошек</h1>
        <p className="text-gray-600">
          Активно: {activeCats.length}/{maxActiveCats}
        </p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Активные кошки</h2>
        {activeCats.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {cats
              .filter(cat => activeCats.includes(cat.id))
              .map(cat => (
                <CatCard
                  key={cat.id}
                  cat={cat}
                  isActive={true}
                  onDeactivate={() => onDeactivateCat(cat.id)}
                />
              ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">
            У вас нет активных кошек
          </p>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Все кошки</h2>
        <div className="grid grid-cols-1 gap-4">
          {cats.map(cat => (
            <CatCard
              key={cat.id}
              cat={cat}
              isActive={activeCats.includes(cat.id)}
              isUnlocked={cat.unlockLevel <= playerLevel}
              onActivate={() => handleActivate(cat.id)}
              onDeactivate={() => onDeactivateCat(cat.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};