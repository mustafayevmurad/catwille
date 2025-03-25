// client/src/components/ui/CatCard.js
import React from 'react';
import Button from './Button';

const CatCard = ({ cat, isActive, onActivate, onDeactivate, isUnlocked = true }) => {
  // Цвета для разных редкостей
  const rarityColors = {
    common: 'border-gray-400 bg-gray-50',
    uncommon: 'border-green-400 bg-green-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-yellow-400 bg-yellow-50'
  };

  // Соответствие бонусов с текстом
  const bonusLabels = {
    wood: 'к добыче дерева',
    fish: 'к добыче рыбы',
    coins: 'к получению монет',
    storage: 'к вместимости хранилища',
    expedition: 'к наградам с вылазок'
  };

  if (!isUnlocked) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col h-48 justify-center items-center">
        <span className="text-3xl mb-2">🔒</span>
        <p className="text-gray-500 text-center">Разблокируется на уровне {cat.unlockLevel}</p>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-4 flex flex-col ${rarityColors[cat.rarity] || 'border-gray-400 bg-gray-50'}`}>
      <div className="flex items-start mb-2">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden mr-3">
          {cat.imageUrl ? (
            <img src={cat.imageUrl} alt={cat.name} className="w-14 h-14" />
          ) : (
            <span className="text-3xl">🐱</span>
          )}
        </div>
        
        <div>
          <h3 className="font-bold">{cat.name}</h3>
          <p className="text-xs text-gray-600">{cat.description}</p>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm">
          <span className="font-medium">Бонус:</span> +{cat.bonus.value}% {bonusLabels[cat.bonus.type] || 'к характеристикам'}
        </p>
      </div>
      
      <div className="mt-auto">
        {isActive ? (
          <Button variant="danger" onClick={onDeactivate} className="w-full">
            Деактивировать
          </Button>
        ) : (
          <Button variant="success" onClick={onActivate} className="w-full">
            Активировать
          </Button>
        )}
      </div>
    </div>
  );
};

export default CatCard;