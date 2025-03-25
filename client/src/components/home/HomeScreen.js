// client/src/components/home/HomeScreen.js
import React from 'react';
import Button from '../ui/Button';
import { getBuildingById, getAvailableBuildings } from '../../data/buildings-system';

const HomeScreen = ({
  buildings,
  resources,
  onCollectResource,
  onUpgradeBuilding,
  playerLevel
}) => {
  // Получение данных о зданиях из импортированного файла
  const buildingData = buildings.map(b => {
    const fullData = getBuildingById(b.id);
    return {
      ...b,
      ...fullData,
      currentData: fullData ? fullData.levels[b.currentLevel || 0] : null
    };
  });
  
  // Фильтрация построенных зданий
  const builtBuildings = buildingData.filter(b => b.isBuilt);
  
  // Главное здание
  const mainHouse = builtBuildings.find(b => b.id === 'townhall');
  
  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Кошачья Империя</h1>
        <p className="text-gray-600">Уровень игрока: {playerLevel}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ваше поселение</h2>
        <div className="relative w-full h-64 bg-green-100 rounded-lg overflow-hidden">
          {/* Отображение зданий на карте */}
          {builtBuildings.map(building => (
            <div 
              key={building.id}
              className="absolute"
              style={{
                left: `${building.positionX || 50}%`,
                top: `${building.positionY || 50}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex flex-col items-center">
                <img 
                  src={building.currentData?.imageUrl || '/assets/images/buildings/house-basic.png'} 
                  alt={building.name} 
                  className="w-16 h-16 object-contain"
                />
                <span className="bg-white px-2 py-1 rounded text-xs mt-1">
                  {building.name} (Ур. {building.currentLevel || 0})
                </span>
              </div>
            </div>
          ))}
          
          {/* Ресурсы на карте */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button
              onClick={() => onCollectResource('wood')}
              className="flex items-center gap-2"
            >
              <span>🪵</span> Собрать дерево
            </Button>
            <Button
              onClick={() => onCollectResource('fish')}
              className="flex items-center gap-2"
            >
              <span>🐟</span> Поймать рыбу
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Доступные улучшения</h2>
        {/* Вывод доступных для улучшения зданий с требованиями */}
        {buildingData
          .filter(b => b.isBuilt && (b.currentLevel < b.levels.length - 1))
          .map(building => {
            const nextLevel = building.levels[(building.currentLevel || 0) + 1];
            return (
              <div key={building.id} className="bg-white p-4 rounded-lg shadow mb-4">
                <h3 className="font-medium">{building.name} → Уровень {(building.currentLevel || 0) + 1}</h3>
                <p className="text-sm text-gray-600 mb-2">{nextLevel.description}</p>
                
                <div className="flex gap-3 mb-3">
                  {nextLevel.upgradeCost.wood > 0 && (
                    <div className="flex items-center gap-1">
                      <span>🪵</span>
                      <span>{nextLevel.upgradeCost.wood}</span>
                    </div>
                  )}
                  {nextLevel.upgradeCost.fish > 0 && (
                    <div className="flex items-center gap-1">
                      <span>🐟</span>
                      <span>{nextLevel.upgradeCost.fish}</span>
                    </div>
                  )}
                  {nextLevel.upgradeCost.coins > 0 && (
                    <div className="flex items-center gap-1">
                      <span>💰</span>
                      <span>{nextLevel.upgradeCost.coins}</span>
                    </div>
                  )}
                  {nextLevel.upgradeCost.specialItem && (
                    <div className="flex items-center gap-1">
                      <span>✨</span>
                      <span>{nextLevel.upgradeCost.specialItem}</span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={() => onUpgradeBuilding(building.id)}
                  disabled={
                    resources.wood.amount < nextLevel.upgradeCost.wood ||
                    resources.fish.amount < nextLevel.upgradeCost.fish ||
                    (nextLevel.upgradeCost.coins && resources.coins.amount < nextLevel.upgradeCost.coins)
                  }
                >
                  Улучшить
                </Button>
              </div>
            );
          })}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Доступные постройки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Использовать функцию getAvailableBuildings для фильтрации доступных зданий */}
          {getAvailableBuildings(
            playerLevel,
            buildings.map(b => ({ id: b.id, level: b.currentLevel || 0 }))
          )
            .filter(building => !buildings.find(b => b.id === building.id)?.isBuilt)
            .map(building => {
              const firstLevel = building.levels[0];
              return (
                <div key={building.id} className="bg-white p-3 rounded-lg shadow">
                  <h3 className="font-medium mb-1">{building.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{building.description}</p>
                  
                  <div className="flex gap-2 mb-2">
                    {firstLevel.upgradeCost.wood > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span>🪵</span>
                        <span>{firstLevel.upgradeCost.wood}</span>
                      </div>
                    )}
                    {firstLevel.upgradeCost.fish > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span>🐟</span>
                        <span>{firstLevel.upgradeCost.fish}</span>
                      </div>
                    )}
                    {firstLevel.upgradeCost.coins > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span>💰</span>
                        <span>{firstLevel.upgradeCost.coins}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => onUpgradeBuilding(building.id)}
                    disabled={
                      resources.wood.amount < firstLevel.upgradeCost.wood ||
                      resources.fish.amount < firstLevel.upgradeCost.fish ||
                      (firstLevel.upgradeCost.coins && resources.coins.amount < firstLevel.upgradeCost.coins)
                    }
                    className="w-full text-xs"
                  >
                    Построить
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;