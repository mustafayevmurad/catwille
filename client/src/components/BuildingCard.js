// client/src/components/BuildingCard.js
// Пример того, как должен выглядеть компонент для отображения здания

import React from 'react';
import { safeGetBuilding, safeGetBuildingLevel, safeCanUpgradeBuilding } from '../utils/building-handler';

// Вспомогательная функция для конвертации benefits в bonuses
const convertBenefitsToBonuses = (benefits) => {
  if (!benefits) return {};
  
  const bonuses = {};
  
  // Прямое конвертирование основных свойств
  if (benefits.storageCapacity && typeof benefits.storageCapacity === 'object') {
    // Если storageCapacity - это объект с отдельными значениями для ресурсов
    bonuses.storageCapacity = Math.max(
      benefits.storageCapacity.wood || 0,
      benefits.storageCapacity.fish || 0,
      benefits.storageCapacity.coins || 0
    );
  }
  
  if (benefits.productionRate && typeof benefits.productionRate === 'object') {
    // Если productionRate - это объект с отдельными значениями для ресурсов
    bonuses.productionRate = benefits.productionRate.wood || benefits.productionRate.fish || 0;
  }
  
  if (benefits.sellRate && typeof benefits.sellRate === 'object') {
    bonuses.sellRate = benefits.sellRate.wood || benefits.sellRate.fish || 0;
  }
  
  // Копирование остальных свойств
  const directProps = [
    'maxBuildingLevel', 'maxCats', 'housingCapacity', 'comfortBonus',
    'energyRecovery', 'happinessBonus', 'craftingSlots', 'craftingSpeed',
    'resourceEfficiency', 'expeditionBonus', 'catStorage', 'expeditionChance'
  ];
  
  directProps.forEach(prop => {
    if (benefits[prop] !== undefined) {
      bonuses[prop] = benefits[prop];
    }
  });
  
  // Специальные свойства
  if (benefits.unlocksResource) {
    bonuses.unlocksResource = benefits.unlocksResource;
  }
  
  return bonuses;
};

const BuildingCard = ({ 
  buildingId, 
  currentLevel = 0, 
  playerLevel, 
  playerResources, 
  buildings, 
  onUpgrade 
}) => {
  // Используем безопасные функции для получения данных
  const building = safeGetBuilding(buildingId);
  
  // Если здание не найдено, показываем сообщение об ошибке
  if (!building) {
    console.error(`BuildingCard: Здание с ID ${buildingId} не найдено`);
    return (
      <div className="building-card building-card-error">
        <h3>Ошибка загрузки</h3>
        <p>Не удалось загрузить данные здания</p>
      </div>
    );
  }
  
  // Безопасно получаем информацию о текущем уровне
  const levelData = safeGetBuildingLevel(buildingId, currentLevel);
  
  // Если данные уровня не найдены, показываем сообщение об ошибке
  if (!levelData) {
    console.error(`BuildingCard: Не найден уровень ${currentLevel} для здания ${buildingId}`);
    return (
      <div className="building-card building-card-error">
        <h3>{building.name || 'Неизвестное здание'}</h3>
        <p>Не удалось загрузить данные уровня</p>
      </div>
    );
  }
  
  // Проверяем возможность улучшения
  const canUpgrade = safeCanUpgradeBuilding(buildingId, playerLevel, playerResources, buildings);
  
  // Определяем следующий уровень и его данные
  const nextLevel = currentLevel + 1;
  const nextLevelData = building.levels[nextLevel];
  
  // Получаем требования для улучшения
  const upgradeCost = levelData.upgradeCost || {};
  
  // Определяем бонусы текущего уровня (предпочитаем bonuses, но используем benefits, если bonuses нет)
  const bonuses = levelData.bonuses || convertBenefitsToBonuses(levelData.benefits || {});
  
  // Безопасно получаем путь к изображению
  const imageUrl = levelData.imageUrl || '/assets/images/buildings/placeholder.png';
  
  // Обработчик нажатия кнопки улучшения
  const handleUpgrade = () => {
    if (canUpgrade && typeof onUpgrade === 'function') {
      try {
        onUpgrade(buildingId, nextLevel);
      } catch (error) {
        console.error(`BuildingCard: Ошибка при улучшении здания ${buildingId}:`, error);
      }
    }
  };
  
  return (
    <div className="building-card">
      <div className="building-image">
        <img src={imageUrl} alt={building.name} onError={(e) => {
          e.target.src = '/assets/images/buildings/placeholder.png';
          console.warn(`Не удалось загрузить изображение для здания ${buildingId}`);
        }} />
      </div>
      
      <div className="building-info">
        <h3>{building.name || 'Неизвестное здание'}</h3>
        <p className="building-description">{building.description || ''}</p>
        <p className="building-level">Уровень: {currentLevel}</p>
        
        {/* Отображаем бонусы текущего уровня */}
        <div className="building-bonuses">
          <h4>Бонусы:</h4>
          <ul>
            {bonuses.storageCapacity && (
              <li>Вместимость хранилища: +{bonuses.storageCapacity}</li>
            )}
            {bonuses.productionRate && (
              <li>Скорость производства: +{bonuses.productionRate}</li>
            )}
            {bonuses.sellRate && (
              <li>Курс продажи: x{bonuses.sellRate}</li>
            )}
            {bonuses.maxCats && (
              <li>Максимум кошек: {bonuses.maxCats}</li>
            )}
            {bonuses.catStorage && (
              <li>Хранилище для кошек: {bonuses.catStorage}</li>
            )}
            {bonuses.expeditionChance && (
              <li>Шанс успешной вылазки: +{bonuses.expeditionChance * 100}%</li>
            )}
            {/* Добавьте другие бонусы по необходимости */}
          </ul>
        </div>
        
        {/* Отображаем информацию о следующем уровне, если он существует */}
        {nextLevelData && (
          <div className="building-next-level">
            <h4>Следующий уровень:</h4>
            <p>{nextLevelData.name || `${building.name} (Уровень ${nextLevel})`}</p>
            
            <h4>Требования:</h4>
            <ul className="upgrade-cost">
              {upgradeCost.wood > 0 && (
                <li className={playerResources.wood >= upgradeCost.wood ? 'has-resource' : 'lacks-resource'}>
                  Дерево: {playerResources.wood}/{upgradeCost.wood}
                </li>
              )}
              {upgradeCost.fish > 0 && (
                <li className={playerResources.fish >= upgradeCost.fish ? 'has-resource' : 'lacks-resource'}>
                  Рыба: {playerResources.fish}/{upgradeCost.fish}
                </li>
              )}
              {upgradeCost.coins > 0 && (
                <li className={playerResources.coins >= upgradeCost.coins ? 'has-resource' : 'lacks-resource'}>
                  Монеты: {playerResources.coins}/{upgradeCost.coins}
                </li>
              )}
            </ul>
          </div>
        )}
        
        {/* Кнопка улучшения */}
        {nextLevelData && (
          <button 
            className={`upgrade-button ${canUpgrade ? 'can-upgrade' : 'cannot-upgrade'}`}
            onClick={handleUpgrade}
            disabled={!canUpgrade}
          >
            {canUpgrade ? 'Улучшить' : 'Недостаточно ресурсов'}
          </button>
        )}
      </div>
    </div>
  );