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
    <div>
      <h1>Коллекция кошек</h1>
      <p>Активно: {activeCats.length}/{maxActiveCats}</p>
      
      <h2>Активные кошки</h2>
      {activeCats.length > 0 ? (
        <div>
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
        <p>У вас нет активных кошек</p>
      )}
      
      <h2>Все кошки</h2>
      <div>
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
  );
};

export default CatsScreen;