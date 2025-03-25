// client/src/utils/building-handler.js

import { getBuildingById, canUpgradeBuilding } from '../data/building-system';

/**
 * Обработчик взаимодействия со зданиями
 * Этот модуль содержит функции для безопасного взаимодействия с системой зданий
 */

/**
 * Безопасно получает информацию о здании
 * @param {string} buildingId - ID здания
 * @returns {Object|null} - Объект здания или null в случае ошибки
 */
export const safeGetBuilding = (buildingId) => {
  try {
    if (!buildingId) {
      console.warn('safeGetBuilding: buildingId не указан');
      return null;
    }
    
    const building = getBuildingById(buildingId);
    
    if (!building) {
      console.warn(`safeGetBuilding: Здание с ID ${buildingId} не найдено`);
      return null;
    }
    
    // Проверяем структуру здания перед возвратом
    if (!building.levels || !Array.isArray(building.levels) || building.levels.length === 0) {
      console.error(`safeGetBuilding: Здание ${buildingId} имеет неверную структуру уровней`);
      // Возвращаем копию с добавлением минимальной структуры для предотвращения ошибок
      return {
        ...building,
        levels: building.levels || [{
          level: 0,
          upgradeCost: { wood: 0, fish: 0 },
          bonuses: {},
          benefits: {},
          imageUrl: "/assets/images/buildings/placeholder.png"
        }]
      };
    }
    
    return building;
  } catch (error) {
    console.error(`safeGetBuilding: Ошибка при получении здания ${buildingId}:`, error);
    return null;
  }
};

/**
 * Безопасно получает информацию об уровне здания
 * @param {string} buildingId - ID здания
 * @param {number} level - Уровень здания
 * @returns {Object|null} - Объект уровня здания или null в случае ошибки
 */
export const safeGetBuildingLevel = (buildingId, level = 0) => {
  try {
    const building = safeGetBuilding(buildingId);
    
    if (!building) return null;
    
    // Проверяем существование уровня
    if (level < 0 || level >= building.levels.length) {
      console.warn(`safeGetBuildingLevel: Уровень ${level} для здания ${buildingId} вне допустимого диапазона`);
      // Возвращаем первый уровень как запасной вариант
      return building.levels[0] || null;
    }
    
    const buildingLevel = building.levels[level];
    
    if (!buildingLevel) {
      console.error(`safeGetBuildingLevel: Уровень ${level} для здания ${buildingId} не определен`);
      return null;
    }
    
    // Проверяем структуру уровня
    if (!buildingLevel.upgradeCost) {
      console.warn(`safeGetBuildingLevel: У уровня ${level} здания ${buildingId} отсутствует upgradeCost`);
      buildingLevel.upgradeCost = { wood: 0, fish: 0 };
    }
    
    // Обеспечиваем наличие обоих типов бонусов для совместимости
    if (!buildingLevel.bonuses && buildingLevel.benefits) {
      buildingLevel.bonuses = convertBenefitsToBonuses(buildingLevel.benefits);
    }
    
    if (!buildingLevel.benefits && buildingLevel.bonuses) {
      buildingLevel.benefits = convertBonusesToBenefits(buildingLevel.bonuses);
    }
    
    return buildingLevel;
  } catch (error) {
    console.error(`safeGetBuildingLevel: Ошибка при получении уровня ${level} здания ${buildingId}:`, error);
    return null;
  }
};

/**
 * Безопасно проверяет, можно ли улучшить здание
 * @param {string} buildingId - ID здания
 * @param {number} playerLevel - Уровень игрока
 * @param {Object} playerResources - Ресурсы игрока
 * @param {Array} currentBuildings - Массив текущих зданий
 * @returns {boolean} - true, если здание можно улучшить
 */
export const safeCanUpgradeBuilding = (buildingId, playerLevel, playerResources, currentBuildings) => {
  try {
    // Проверка входных данных
    if (!buildingId) {
      console.warn('safeCanUpgradeBuilding: buildingId не указан');
      return false;
    }
    
    if (!playerResources) {
      console.warn('safeCanUpgradeBuilding: playerResources не указан');
      return false;
    }
    
    if (!Array.isArray(currentBuildings)) {
      console.warn('safeCanUpgradeBuilding: currentBuildings не является массивом');
      return false;
    }
    
    return canUpgradeBuilding(buildingId, playerLevel, playerResources, currentBuildings);
  } catch (error) {
    console.error(`safeCanUpgradeBuilding: Ошибка при проверке возможности улучшения здания ${buildingId}:`, error);
    return false;
  }
};

/**
 * Безопасно обновляет уровень здания
 * @param {Array} currentBuildings - Массив текущих зданий
 * @param {string} buildingId - ID здания
 * @param {number} newLevel - Новый уровень здания
 * @returns {Array} - Обновленный массив зданий
 */
export const safeUpdateBuildingLevel = (currentBuildings, buildingId, newLevel) => {
  try {
    if (!Array.isArray(currentBuildings)) {
      console.warn('safeUpdateBuildingLevel: currentBuildings не является массивом');
      return currentBuildings || [];
    }
    
    if (!buildingId) {
      console.warn('safeUpdateBuildingLevel: buildingId не указан');
      return currentBuildings;
    }
    
    const building = safeGetBuilding(buildingId);
    
    if (!building) {
      console.warn(`safeUpdateBuildingLevel: Здание с ID ${buildingId} не найдено`);
      return currentBuildings;
    }
    
    // Проверяем, что новый уровень в допустимом диапазоне
    if (newLevel < 0 || newLevel >= building.levels.length) {
      console.warn(`safeUpdateBuildingLevel: Уровень ${newLevel} для здания ${buildingId} вне допустимого диапазона`);
      return currentBuildings;
    }
    
    const buildingIndex = currentBuildings.findIndex(b => b.id === buildingId);
    
    // Если здание не найдено, добавляем его
    if (buildingIndex === -1) {
      return [
        ...currentBuildings,
        { id: buildingId, level: newLevel }
      ];
    }
    
    // Обновляем уровень существующего здания
    return currentBuildings.map(b => {
      if (b.id === buildingId) {
        return { ...b, level: newLevel };
      }
      return b;
    });
  } catch (error) {
    console.error(`safeUpdateBuildingLevel: Ошибка при обновлении уровня здания ${buildingId}:`, error);
    return currentBuildings;
  }
};

/**
 * Конвертирует benefits в формат bonuses
 * @param {Object} benefits - Объект benefits
 * @returns {Object} - Объект bonuses
 */
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
  
  if (benefits.unlocksTerritory) {
    bonuses.unlocksTerritory = benefits.unlocksTerritory;
  }
  
  if (benefits.unlocksTrade) {
    bonuses.unlocksTrade = benefits.unlocksTrade;
  }
  
  if (benefits.specialTraining) {
    bonuses.specialTraining = benefits.specialTraining;
  }
  
  return bonuses;
};

/**
 * Конвертирует bonuses в формат benefits
 * @param {Object} bonuses - Объект bonuses
 * @returns {Object} - Объект benefits
 */
const convertBonusesToBenefits = (bonuses) => {
  if (!bonuses) return {};
  
  const benefits = {};
  
  // Прямое конвертирование основных свойств
  if (bonuses.storageCapacity !== undefined) {
    benefits.storageCapacity = {
      wood: bonuses.storageCapacity,
      fish: bonuses.storageCapacity,
      coins: bonuses.storageCapacity
    };
  }
  
  if (bonuses.productionRate !== undefined) {
    benefits.productionRate = { wood: bonuses.productionRate };
  }
  
  if (bonuses.sellRate !== undefined) {
    benefits.sellRate = { wood: bonuses.sellRate, fish: bonuses.sellRate };
  }
  
  // Копирование остальных свойств
  const directProps = [
    'maxBuildingLevel', 'maxCats', 'housingCapacity', 'comfortBonus',
    'energyRecovery', 'happinessBonus', 'craftingSlots', 'craftingSpeed',
    'resourceEfficiency', 'expeditionBonus', 'catStorage', 'expeditionChance'
  ];
  
  directProps.forEach(prop => {
    if (bonuses[prop] !== undefined) {
      benefits[prop] = bonuses[prop];
    }
  });
  
  // Специальные свойства
  if (bonuses.unlocksResource) {
    benefits.unlocksResource = bonuses.unlocksResource;
  }
  
  if (bonuses.unlocksTerritory) {
    benefits.unlocksTerritory = bonuses.unlocksTerritory;
  }
  
  if (bonuses.unlocksTrade) {
    benefits.unlocksTrade = bonuses.unlocksTrade;
  }
  
  if (bonuses.specialTraining) {
    benefits.specialTraining = bonuses.specialTraining;
  }
  
  return benefits;
};