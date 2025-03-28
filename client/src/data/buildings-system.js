// client/src/data/building-system.js

// Структура здания:
// - id: уникальный идентификатор здания
// - name: название здания
// - description: описание функциональности здания
// - category/type: категория здания (производство, жильё, общественные и т.д.)
// - levels: массив уровней здания, где каждый уровень содержит:
//   - level: номер уровня
//   - name: название здания на данном уровне (опционально)
//   - description: описание улучшений на этом уровне (опционально)
//   - unlockRequirements/upgradeCost: требования для разблокировки уровня
//   - benefits/bonuses: бонусы, которые даёт здание на этом уровне
//   - imageUrl: путь к изображению здания на данном уровне

// Добавляем отладочные функции для диагностики проблем
// Вспомогательная функция для проверки валидности данных здания
export const validateBuilding = (building) => {
  if (!building) return { valid: false, errors: ['Здание не определено'] };
  
  const errors = [];
  
  if (!building.id) errors.push('ID здания не определен');
  if (!building.name) errors.push(`Имя здания ${building.id || 'unknown'} не определено`);
  if (!Array.isArray(building.levels)) errors.push(`Уровни здания ${building.id || 'unknown'} не являются массивом`);
  if (Array.isArray(building.levels) && building.levels.length === 0) errors.push(`У здания ${building.id || 'unknown'} нет уровней`);
  
  // Проверяем структуру каждого уровня
  if (Array.isArray(building.levels)) {
    building.levels.forEach((level, index) => {
      if (!level) {
        errors.push(`Уровень ${index} здания ${building.id || 'unknown'} не определен`);
        return;
      }
      
      if (level.level === undefined && index !== level.level) {
        errors.push(`Несоответствие номера уровня ${index} и level: ${level.level} для здания ${building.id || 'unknown'}`);
      }
      
      if (!level.imageUrl) {
        errors.push(`Отсутствует imageUrl для уровня ${index} здания ${building.id || 'unknown'}`);
      }
      
      if (!level.upgradeCost) {
        errors.push(`Отсутствует upgradeCost для уровня ${index} здания ${building.id || 'unknown'}`);
      }
      
      // Проверяем наличие хотя бы одного из полей benefits или bonuses
      if (!level.benefits && !level.bonuses) {
        errors.push(`Отсутствуют benefits и bonuses для уровня ${index} здания ${building.id || 'unknown'}`);
      }
    });
  }
  
  return { 
    valid: errors.length === 0, 
    errors 
  };
};

// Функция для валидации всех зданий в массиве
export const validateAllBuildings = () => {
  const results = {};
  let isValid = true;
  
  buildings.forEach(building => {
    const result = validateBuilding(building);
    results[building.id] = result;
    if (!result.valid) isValid = false;
  });
  
  return { 
    valid: isValid, 
    results 
  };
};

// Объединение данных из обоих файлов
// Экспорт списка категорий зданий
export const buildingCategories = [
  { id: "core", name: "Основные", description: "Ключевые здания для управления поселением" },
  { id: "production", name: "Производство", description: "Здания для добычи и переработки ресурсов" },
  { id: "housing", name: "Жильё", description: "Жилые здания для кошек" },
  { id: "economy", name: "Экономика", description: "Здания для торговли и экономического развития" },
  { id: "special", name: "Особые", description: "Специализированные здания с уникальными функциями" }
];

// Утилитарные функции для работы со зданиями
export const getBuildingById = (id) => buildings.find(building => building.id === id);

export const getAvailableBuildings = (playerLevel, currentBuildings) => {
  // Проверка валидности входных данных
  if (!Array.isArray(currentBuildings)) {
    console.error('currentBuildings должен быть массивом');
    return [];
  }

  return buildings.filter(building => {
    try {
      // Проверка наличия необходимых полей в здании
      if (!building || !building.levels || !Array.isArray(building.levels) || building.levels.length === 0) {
        console.warn(`Здание ${building?.id || 'unknown'} имеет неверную структуру`);
        return false;
      }

      // Получаем информацию о текущем уровне здания, если оно уже построено
      const currentBuilding = currentBuildings.find(b => b.id === building.id);
      const currentLevel = currentBuilding ? currentBuilding.level : 0;

      // Если здание уже на максимальном уровне, то оно недоступно для строительства
      if (currentLevel >= building.levels.length) return false;

      // Проверяем, соответствует ли уровень игрока требованиям для разблокировки здания
      if (building.unlockLevel > playerLevel) return false;

      // Получаем требования для следующего уровня здания
      const nextLevel = building.levels[currentLevel];
      
      // Проверяем наличие nextLevel
      if (!nextLevel) {
        console.warn(`Отсутствует уровень ${currentLevel} для здания ${building.id}`);
        return false;
      }

      // Проверяем требования по уровню игрока (если они есть)
      if (nextLevel.unlockRequirements && nextLevel.unlockRequirements.playerLevel > playerLevel) return false;

      // Проверяем требования по другим зданиям (если они есть)
      if (nextLevel.unlockRequirements && nextLevel.unlockRequirements.buildingsRequired) {
        return nextLevel.unlockRequirements.buildingsRequired.every(req => {
          const reqBuilding = currentBuildings.find(b => b.id === req.id);
          return reqBuilding && reqBuilding.level >= req.minLevel;
        });
      }

      return true;
    } catch (error) {
      console.error(`Ошибка при проверке доступности здания ${building?.id || 'unknown'}:`, error);
      return false;
    }
  });
};

export const canUpgradeBuilding = (buildingId, playerLevel, playerResources, currentBuildings) => {
  try {
    // Проверка валидности входных данных
    if (!buildingId || !playerResources || !Array.isArray(currentBuildings)) {
      console.error('Неверные параметры в canUpgradeBuilding');
      return false;
    }
    
    const building = getBuildingById(buildingId);
    if (!building) {
      console.warn(`Здание с ID ${buildingId} не найдено`);
      return false;
    }

    // Проверка структуры здания
    if (!building.levels || !Array.isArray(building.levels) || building.levels.length === 0) {
      console.warn(`Здание ${buildingId} имеет неверную структуру уровней`);
      return false;
    }

    // Получаем текущий уровень здания
    const currentBuilding = currentBuildings.find(b => b.id === buildingId);
    if (!currentBuilding && buildingId !== 'main-house') {
      // Для main-house делаем исключение, так как оно может быть еще не построено (уровень 0)
      console.warn(`Здание ${buildingId} не найдено в списке текущих зданий`);
      return false;
    }

    // Определяем текущий уровень с учетом особенностей main-house
    const currentLevel = currentBuilding ? currentBuilding.level : 0;

    // Если здание уже на максимальном уровне
    if (currentLevel >= building.levels.length - 1) {
      return false;
    }

    // Получаем информацию о следующем уровне
    const nextLevel = building.levels[currentLevel + 1];
    if (!nextLevel) {
      console.warn(`Следующий уровень (${currentLevel + 1}) для здания ${buildingId} не существует`);
      return false;
    }

    // Проверяем требования по уровню игрока (если они есть)
    if (nextLevel.unlockRequirements && nextLevel.unlockRequirements.playerLevel > playerLevel) {
      return false;
    }

    // Проверяем требования по ресурсам с защитой от undefined
    const wood = nextLevel.upgradeCost?.wood || 0;
    const fish = nextLevel.upgradeCost?.fish || 0;
    const coins = nextLevel.upgradeCost?.coins || 0;
    const specialItem = nextLevel.upgradeCost?.specialItem;

    if (
      (typeof playerResources.wood === 'number' && playerResources.wood < wood) || 
      (typeof playerResources.fish === 'number' && playerResources.fish < fish) || 
      (coins > 0 && typeof playerResources.coins === 'number' && playerResources.coins < coins)
    ) {
      return false;
    }

    // Проверяем наличие специального предмета, если требуется
    if (specialItem && (!playerResources.items || !playerResources.items.includes(specialItem))) {
      return false;
    }

    // Проверяем требования по другим зданиям (если они есть)
    if (nextLevel.unlockRequirements && nextLevel.unlockRequirements.buildingsRequired) {
      return nextLevel.unlockRequirements.buildingsRequired.every(req => {
        if (!req || !req.id) return false;
        const reqBuilding = currentBuildings.find(b => b.id === req.id);
        return reqBuilding && reqBuilding.level >= req.minLevel;
      });
    }

    return true;
  } catch (error) {
    console.error(`Ошибка в canUpgradeBuilding для здания ${buildingId}:`, error);
    return false;
  }
};

// Список зданий
export const buildings = [
  // Основные здания из building-system.js
  {
    id: "townhall",
    name: "Ратуша",
    description: "Центр управления поселением. Определяет максимальный уровень других зданий.",
    category: "core",
    type: "main",
    positionX: 50,
    positionY: 50,
    unlockLevel: 1,
    levels: [
      {
        level: 1,
        name: "Старая Ратуша",
        description: "Основное здание управления поселением. Позволяет строить базовые здания.",
        unlockRequirements: {
          playerLevel: 1
        },
        upgradeCost: {
          wood: 0,
          fish: 0,
          coins: 0
        },
        benefits: {
          maxBuildingLevel: 1,
          maxCats: 3,
          storageCapacity: { wood: 100, fish: 100, coins: 100 }
        },
        bonuses: {
          maxBuildingLevel: 1,
          maxCats: 3,
          storageCapacity: 100
        },
        imageUrl: "/assets/images/buildings/townhall_1.png"
      },
      {
        level: 2,
        name: "Улучшенная Ратуша",
        description: "Расширенная ратуша, позволяющая нанимать больше кошек и строить здания 2-го уровня.",
        unlockRequirements: {
          playerLevel: 2
        },
        upgradeCost: {
          wood: 50,
          fish: 30,
          coins: 20
        },
        benefits: {
          maxBuildingLevel: 2,
          maxCats: 5,
          storageCapacity: { wood: 200, fish: 200, coins: 200 }
        },
        bonuses: {
          maxBuildingLevel: 2,
          maxCats: 5,
          storageCapacity: 200
        },
        imageUrl: "/assets/images/buildings/townhall_2.png"
      },
      {
        level: 3,
        name: "Большая Ратуша",
        description: "Улучшенное здание с расширенными возможностями. Открывает доступ к озеру.",
        unlockRequirements: {
          playerLevel: 3
        },
        upgradeCost: {
          wood: 120,
          fish: 80,
          coins: 50
        },
        benefits: {
          maxBuildingLevel: 3,
          maxCats: 8,
          storageCapacity: { wood: 350, fish: 350, coins: 350 },
          unlocksTerritory: "lake"
        },
        bonuses: {
          maxBuildingLevel: 3,
          maxCats: 8,
          storageCapacity: 350,
          unlocksTerritory: "lake"
        },
        imageUrl: "/assets/images/buildings/townhall_3.png"
      },
      {
        level: 4,
        name: "Кошачий Совет",
        description: "Продвинутый центр управления. Открывает торговлю и доступ к горам.",
        unlockRequirements: {
          playerLevel: 4,
          buildingsRequired: [
            { id: "workshop", minLevel: 3 },
            { id: "fishery", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 250,
          fish: 180,
          coins: 120,
          specialItem: "blueprints"
        },
        benefits: {
          maxBuildingLevel: 4,
          maxCats: 12,
          storageCapacity: { wood: 500, fish: 500, coins: 500 },
          unlocksTerritory: "mountains",
          unlocksTrade: true
        },
        bonuses: {
          maxBuildingLevel: 4,
          maxCats: 12,
          storageCapacity: 500,
          unlocksTerritory: "mountains",
          unlocksTrade: true
        },
        imageUrl: "/assets/images/buildings/townhall_4.png"
      },
      {
        level: 5,
        name: "Кошачье Правительство",
        description: "Центр развитой кошачьей цивилизации. Открывает доступ к заброшенному городу.",
        unlockRequirements: {
          playerLevel: 5,
          buildingsRequired: [
            { id: "academy", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 400,
          fish: 300,
          coins: 250,
          specialItem: "ancientArtifact"
        },
        benefits: {
          maxBuildingLevel: 5,
          maxCats: 15,
          storageCapacity: { wood: 800, fish: 800, coins: 800 },
          unlocksTerritory: "abandonedCity",
          expeditionBonus: 0.2
        },
        bonuses: {
          maxBuildingLevel: 5,
          maxCats: 15,
          storageCapacity: 800,
          unlocksTerritory: "abandonedCity",
          expeditionBonus: 0.2
        },
        imageUrl: "/assets/images/buildings/townhall_5.png"
      }
    ]
  },
  {
    id: "lumberjack",
    name: "Лесопилка",
    description: "Здание для добычи и обработки дерева.",
    category: "production",
    type: "production",
    positionX: 30,
    positionY: 30,
    unlockLevel: 1,
    levels: [
      {
        level: 1,
        name: "Простая Лесопилка",
        description: "Базовое здание для сбора дерева. Один кот может заготавливать +1 дерева в час.",
        unlockRequirements: {
          playerLevel: 1,
          buildingsRequired: [
            { id: "townhall", minLevel: 1 }
          ]
        },
        upgradeCost: {
          wood: 20,
          fish: 10,
          coins: 0
        },
        benefits: {
          productionRate: { wood: 1 },
          maxWorkers: 2
        },
        bonuses: {
          productionRate: 1,
          maxWorkers: 2
        },
        imageUrl: "/assets/images/buildings/lumberjack_1.png"
      },
      {
        level: 2,
        name: "Улучшенная Лесопилка",
        description: "Улучшенная лесопилка с простыми инструментами. +2 дерева в час на каждого кота.",
        unlockRequirements: {
          playerLevel: 2,
          buildingsRequired: [
            { id: "townhall", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 50,
          fish: 20,
          coins: 10
        },
        benefits: {
          productionRate: { wood: 2 },
          maxWorkers: 3
        },
        bonuses: {
          productionRate: 2,
          maxWorkers: 3
        },
        imageUrl: "/assets/images/buildings/lumberjack_2.png"
      },
      {
        level: 3,
        name: "Продвинутая Лесопилка",
        description: "Лесопилка с улучшенными пилами. +3 дерева в час на кота и возможность производства досок.",
        unlockRequirements: {
          playerLevel: 3,
          buildingsRequired: [
            { id: "townhall", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 100,
          fish: 50,
          coins: 30
        },
        benefits: {
          productionRate: { wood: 3 },
          maxWorkers: 4,
          unlocksResource: "planks"
        },
        bonuses: {
          productionRate: 3,
          maxWorkers: 4,
          unlocksResource: "planks"
        },
        imageUrl: "/assets/images/buildings/lumberjack_3.png"
      },
      {
        level: 4,
        name: "Кошачья Мебельная Фабрика",
        description: "Расширенная лесопилка с мебельным цехом. +4 дерева в час и создание мебели для улучшения жилищ.",
        unlockRequirements: {
          playerLevel: 4,
          buildingsRequired: [
            { id: "townhall", minLevel: 4 },
            { id: "workshop", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 200,
          fish: 100,
          coins: 80
        },
        benefits: {
          productionRate: { wood: 4, planks: 2 },
          maxWorkers: 5,
          unlocksResource: "furniture"
        },
        bonuses: {
          productionRate: 4,
          planksRate: 2,
          maxWorkers: 5,
          unlocksResource: "furniture"
        },
        imageUrl: "/assets/images/buildings/lumberjack_4.png"
      },
      {
        level: 5,
        name: "Автоматизированная Лесопромышленность",
        description: "Современная лесопилка с автоматизированными процессами. +6 дерева в час и эффективное производство.",
        unlockRequirements: {
          playerLevel: 5,
          buildingsRequired: [
            { id: "townhall", minLevel: 5 },
            { id: "academy", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 350,
          fish: 180,
          coins: 150,
          specialItem: "engineeringPlans"
        },
        benefits: {
          productionRate: { wood: 6, planks: 3, furniture: 1 },
          maxWorkers: 7,
          resourceEfficiency: 0.2 // 20% шанс не тратить ресурсы при крафте
        },
        bonuses: {
          productionRate: 6,
          planksRate: 3,
          furnitureRate: 1,
          maxWorkers: 7,
          resourceEfficiency: 0.2
        },
        imageUrl: "/assets/images/buildings/lumberjack_5.png"
      }
    ]
  },
  {
    id: "fishery",
    name: "Рыбацкий Причал",
    description: "Здание для ловли и переработки рыбы.",
    category: "production",
    type: "production",
    positionX: 70,
    positionY: 70,
    unlockLevel: 1,
    levels: [
      {
        level: 1,
        name: "Маленький Причал",
        description: "Простой причал для рыбной ловли. Один кот может добывать +1 рыбы в час.",
        unlockRequirements: {
          playerLevel: 1,
          buildingsRequired: [
            { id: "townhall", minLevel: 1 }
          ]
        },
        upgradeCost: {
          wood: 20,
          fish: 0,
          coins: 0
        },
        benefits: {
          productionRate: { fish: 1 },
          maxWorkers: 2
        },
        bonuses: {
          productionRate: 1,
          maxWorkers: 2
        },
        imageUrl: "/assets/images/buildings/fishery_1.png"
      },
      {
        level: 2,
        name: "Улучшенный Причал",
        description: "Расширенный причал с лучшими удочками. +2 рыбы в час на каждого кота.",
        unlockRequirements: {
          playerLevel: 2,
          buildingsRequired: [
            { id: "townhall", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 40,
          fish: 20,
          coins: 10
        },
        benefits: {
          productionRate: { fish: 2 },
          maxWorkers: 3
        },
        bonuses: {
          productionRate: 2,
          maxWorkers: 3
        },
        imageUrl: "/assets/images/buildings/fishery_2.png"
      },
      {
        level: 3,
        name: "Рыбный Рынок",
        description: "Причал с рыбным рынком. +3 рыбы в час и возможность продажи рыбы за монеты.",
        unlockRequirements: {
          playerLevel: 3,
          buildingsRequired: [
            { id: "townhall", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 80,
          fish: 40,
          coins: 30
        },
        benefits: {
          productionRate: { fish: 3 },
          maxWorkers: 4,
          sellRate: { fish: 1.5 } // Продажа рыбы по более выгодному курсу
        },
        bonuses: {
          productionRate: 3,
          maxWorkers: 4,
          sellRate: 1.5
        },
        imageUrl: "/assets/images/buildings/fishery_3.png"
      },
      {
        level: 4,
        name: "Консервный Завод",
        description: "Причал с заводом для консервирования рыбы. +4 рыбы в час и производство рыбных консервов.",
        unlockRequirements: {
          playerLevel: 4,
          buildingsRequired: [
            { id: "townhall", minLevel: 4 },
            { id: "workshop", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 150,
          fish: 100,
          coins: 80
        },
        benefits: {
          productionRate: { fish: 4 },
          maxWorkers: 5,
          unlocksResource: "cannedFish", // Возможность делать рыбные консервы
          sellRate: { fish: 2, cannedFish: 4 }
        },
        bonuses: {
          productionRate: 4,
          maxWorkers: 5,
          unlocksResource: "cannedFish",
          sellRate: 2,
          cannedFishSellRate: 4
        },
        imageUrl: "/assets/images/buildings/fishery_4.png"
      },
      {
        level: 5,
        name: "Морская Империя",
        description: "Современный рыболовный комплекс с кораблями. +6 рыбы в час и разнообразие морепродуктов.",
        unlockRequirements: {
          playerLevel: 5,
          buildingsRequired: [
            { id: "townhall", minLevel: 5 }
          ]
        },
        upgradeCost: {
          wood: 300,
          fish: 200,
          coins: 150,
          specialItem: "navigationalCharts"
        },
        benefits: {
          productionRate: { fish: 6, cannedFish: 2 },
          maxWorkers: 7,
          unlocksResource: "seafood", // Разные морепродукты для особых блюд
          sellRate: { fish: 2.5, cannedFish: 5, seafood: 8 }
        },
        bonuses: {
          productionRate: 6,
          cannedFishRate: 2,
          maxWorkers: 7,
          unlocksResource: "seafood",
          sellRate: 2.5,
          cannedFishSellRate: 5,
          seafoodSellRate: 8
        },
        imageUrl: "/assets/images/buildings/fishery_5.png"
      }
    ]
  },
  {
    id: "workshop",
    name: "Мастерская",
    description: "Здание для крафта предметов и инструментов.",
    category: "production",
    type: "production",
    positionX: 25,
    positionY: 75,
    unlockLevel: 2,
    levels: [
      {
        level: 1,
        name: "Базовая Мастерская",
        description: "Простая мастерская для изготовления базовых предметов.",
        unlockRequirements: {
          playerLevel: 2,
          buildingsRequired: [
            { id: "townhall", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 30,
          fish: 15,
          coins: 10
        },
        benefits: {
          craftingSlots: 1,
          availableRecipes: ["basicTools", "fishingRod", "axe"]
        },
        bonuses: {
          craftingSlots: 1,
          availableRecipes: ["basicTools", "fishingRod", "axe"]
        },
        imageUrl: "/assets/images/buildings/workshop_1.png"
      },
      {
        level: 2,
        name: "Развитая Мастерская",
        description: "Улучшенная мастерская с большим количеством инструментов.",
        unlockRequirements: {
          playerLevel: 3,
          buildingsRequired: [
            { id: "townhall", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 70,
          fish: 40,
          coins: 30
        },
        benefits: {
          craftingSlots: 2,
          availableRecipes: ["advancedTools", "improvedRod", "improvedAxe", "basicFurniture"]
        },
        bonuses: {
          craftingSlots: 2,
          availableRecipes: ["advancedTools", "improvedRod", "improvedAxe", "basicFurniture"]
        },
        imageUrl: "/assets/images/buildings/workshop_2.png"
      },
      {
        level: 3,
        name: "Инженерная Мастерская",
        description: "Продвинутая мастерская с возможностью создания сложных механизмов.",
        unlockRequirements: {
          playerLevel: 4,
          buildingsRequired: [
            { id: "townhall", minLevel: 4 }
          ]
        },
        upgradeCost: {
          wood: 150,
          fish: 80,
          coins: 60
        },
        benefits: {
          craftingSlots: 3,
          craftingSpeed: 1.5, // 50% быстрее базовой скорости
          availableRecipes: ["mechanisms", "traps", "advancedFurniture", "decorations"]
        },
        bonuses: {
          craftingSlots: 3,
          craftingSpeed: 1.5,
          availableRecipes: ["mechanisms", "traps", "advancedFurniture", "decorations"]
        },
        imageUrl: "/assets/images/buildings/workshop_3.png"
      },
      {
        level: 4,
        name: "Фабрика Изобретений",
        description: "Комплекс для создания уникальных изобретений и предметов.",
        unlockRequirements: {
          playerLevel: 5,
          buildingsRequired: [
            { id: "townhall", minLevel: 5 },
            { id: "academy", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 250,
          fish: 150,
          coins: 120,
          specialItem: "techComponents"
        },
        benefits: {
          craftingSlots: 4,
          craftingSpeed: 2.0, // Вдвое быстрее базовой скорости
          resourceEfficiency: 0.25, // 25% шанс не тратить ресурсы при крафте
          availableRecipes: ["uniqueItems", "specialTools", "luxuryFurniture", "tradingGoods"]
        },
        bonuses: {
          craftingSlots: 4,
          craftingSpeed: 2.0,
          resourceEfficiency: 0.25,
          availableRecipes: ["uniqueItems", "specialTools", "luxuryFurniture", "tradingGoods"]
        },
        imageUrl: "/assets/images/buildings/workshop_4.png"
      },
      {
        level: 5,
        name: "Технологический Центр",
        description: "Высокотехнологичный комплекс для создания самых продвинутых изобретений.",
        unlockRequirements: {
          playerLevel: 6,
          buildingsRequired: [
            { id: "townhall", minLevel: 5 },
            { id: "academy", minLevel: 4 }
          ]
        },
        upgradeCost: {
          wood: 400,
          fish: 250,
          coins: 200,
          specialItem: "advancedTech"
        },
        benefits: {
          craftingSlots: 5,
          craftingSpeed: 3.0, // Втрое быстрее базовой скорости
          resourceEfficiency: 0.4, // 40% шанс не тратить ресурсы при крафте
          availableRecipes: ["highTechItems", "automationSystems", "artifactEnhancements", "specializedEquipment"]
        },
        bonuses: {
          craftingSlots: 5,
          craftingSpeed: 3.0,
          resourceEfficiency: 0.4,
          availableRecipes: ["highTechItems", "automationSystems", "artifactEnhancements", "specializedEquipment"]
        },
        imageUrl: "/assets/images/buildings/workshop_5.png"
      }
    ]
  },
  {
    id: "cattery",
    name: "Кошачий Дом",
    description: "Жилье для кошек, увеличивает максимальное количество кошек в поселении.",
    category: "housing",
    type: "housing",
    positionX: 75,
    positionY: 25,
    unlockLevel: 1,
    levels: [
      {
        level: 1,
        name: "Маленькое Общежитие",
        description: "Базовое жилье для кошек. Позволяет разместить 2 дополнительных кошки.",
        unlockRequirements: {
          playerLevel: 1,
          buildingsRequired: [
            { id: "townhall", minLevel: 1 }
          ]
        },
        upgradeCost: {
          wood: 25,
          fish: 10,
          coins: 0
        },
        benefits: {
          housingCapacity: 2
        },
        bonuses: {
          housingCapacity: 2
        },
        imageUrl: "/assets/images/buildings/cattery_1.png"
      },
      {
        level: 2,
        name: "Кошачья Общага",
        description: "Улучшенное жилье с отдельными комнатами. +4 места для кошек.",
        unlockRequirements: {
          playerLevel: 2,
          buildingsRequired: [
            { id: "townhall", minLevel: 2 }
          ]
        },
        upgradeCost: {
          wood: 60,
          fish: 30,
          coins: 15
        },
        benefits: {
          housingCapacity: 4,
          comfortBonus: 0.05 // +5% к производительности кошек
        },
        bonuses: {
          housingCapacity: 4,
          comfortBonus: 0.05
        },
        imageUrl: "/assets/images/buildings/cattery_2.png"
      },
      {
        level: 3,
        name: "Кошачьи Апартаменты",
        description: "Комфортное жилье с удобствами. +6 мест для кошек и бонус к восстановлению энергии.",
        unlockRequirements: {
          playerLevel: 3,
          buildingsRequired: [
            { id: "townhall", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 120,
          fish: 60,
          coins: 40
        },
        benefits: {
          housingCapacity: 6,
          comfortBonus: 0.1, // +10% к производительности кошек
          energyRecovery: 0.1 // +10% к скорости восстановления энергии
        },
        bonuses: {
          housingCapacity: 6,
          comfortBonus: 0.1,
          energyRecovery: 0.1
        },
        imageUrl: "/assets/images/buildings/cattery_3.png"
      },
      {
        level: 4,
        name: "Кошачий Комплекс",
        description: "Современный жилой комплекс с развлечениями. +8 мест и значительные бонусы к комфорту.",
        unlockRequirements: {
          playerLevel: 4,
          buildingsRequired: [
            { id: "townhall", minLevel: 4 },
            { id: "workshop", minLevel: 3 }
          ]
        },
        upgradeCost: {
          wood: 200,
          fish: 120,
          coins: 100,
          specialItem: "luxuryFurniture"
        },
        benefits: {
          housingCapacity: 8,
          comfortBonus: 0.2, // +20% к производительности кошек
          energyRecovery: 0.2, // +20% к скорости восстановления энергии
          happinessBonus: 0.1 // +10% к счастью кошек (влияет на вероятность успеха в вылазках)
        },
        bonuses: {
          housingCapacity: 8,
          comfortBonus: 0.2,
          energyRecovery: 0.2,
          happinessBonus: 0.1
        },
        imageUrl: "/assets/images/buildings/cattery_4.png"
      },
      {
        level: 5,
        name: "Кошачий Рай",
        description: "Элитный жилой комплекс с максимальным комфортом. +10 мест и лучшие бонусы.",
        unlockRequirements: {
          playerLevel: 5,
          buildingsRequired: [
            { id: "townhall", minLevel: 5 }
          ]
        },
        upgradeCost: {
          wood: 350,
          fish: 200,
          coins: 180,
          specialItem: "eliteFurnishings"
        },
        benefits: {
          housingCapacity: 10,
          comfortBonus: 0.3, // +30% к производительности кошек
          energyRecovery: 0.3, // +30% к скорости восстановления энергии
          happinessBonus: 0.2, // +20% к счастью кошек
          specialTraining: true // Возможность особого обучения кошек
        },
        bonuses: {
          housingCapacity: 10,
          comfortBonus: 0.3,
          energyRecovery: 0.3,
          happinessBonus: 0.2,
          specialTraining: true
        },
        imageUrl: "/assets/images/buildings/cattery_5.png"
      }
    ]
  },
  
  // Здания из buildings.json
  {
    id: "main-house",
    name: "Главный дом",
    description: "Основное здание кошачьего поселения",
    category: "core",
    type: "main",
    positionX: 50,
    positionY: 50,
    unlockLevel: 1,
    levels: [
      {
        level: 0,
        upgradeCost: {
          wood: 10,
          fish: 5
        },
        benefits: {
          storageCapacity: { wood: 20, fish: 20, coins: 20 }
        },
        bonuses: {
          storageCapacity: 20
        },
        imageUrl: "/assets/images/buildings/house-broken.png"
      },
      {
        level: 1,
        upgradeCost: {
          wood: 20,
          fish: 10
        },
        benefits: {
          storageCapacity: { wood: 40, fish: 40, coins: 40 }
        },
        bonuses: {
          storageCapacity: 40
        },
        imageUrl: "/assets/images/buildings/house-basic.png"
      },
      {
        level: 2,
        upgradeCost: {
          wood: 40,
          fish: 20
        },
        benefits: {
          storageCapacity: { wood: 80, fish: 80, coins: 80 }
        },
        bonuses: {
          storageCapacity: 80
        },
        imageUrl: "/assets/images/buildings/house-improved.png"
      }
    ]
  },
  {
    id: "market-stall",
    name: "Ларек",
    description: "Позволяет продавать ресурсы за монеты",
    category: "economy",
    type: "utility",
    positionX: 70,
    positionY: 30,
    unlockLevel: 3,
    levels: [
      {
        level: 1,
        upgradeCost: {
          wood: 15,
          fish: 5
        },
        benefits: {
          sellRate: { wood: 1, fish: 1 }
        },
        bonuses: {
          sellRate: 1
        },
        imageUrl: "/assets/images/buildings/market-basic.png"
      },
      {
        level: 2,
        upgradeCost: {
          wood: 30,
          fish: 15
        },
        benefits: {
          sellRate: { wood: 1.25, fish: 1.25 }
        },
        bonuses: {
          sellRate: 1.25
        },
        imageUrl: "/assets/images/buildings/market-improved.png"
      }
    ]
  },
  {
    id: "cat-house",
    name: "Гостевой домик",
    description: "Хранит коллекцию карточек кошек",
    category: "housing",
    type: "utility",
    positionX: 30,
    positionY: 70,
    unlockLevel: 2,
    levels: [
      {
        level: 1,
        upgradeCost: {
          wood: 20,
          fish: 10
        },
        benefits: {
          catStorage: 10
        },
        bonuses: {
          catStorage: 10
        },
        imageUrl: "/assets/images/buildings/cathouse-basic.png"
      },
      {
        level: 2,
        upgradeCost: {
          wood: 35,
          fish: 20
        },
        benefits: {
          catStorage: 20
        },
        bonuses: {
          catStorage: 20
        },
        imageUrl: "/assets/images/buildings/cathouse-improved.png"
      }
    ]
  },
  {
    id: "watchtower",
    name: "Башня наблюдения",
    description: "Открывает доступ к ежедневным вылазкам",
    category: "special",
    type: "utility",
    positionX: 20,
    positionY: 20,
    unlockLevel: 4,
    levels: [
      {
        level: 1,
        upgradeCost: {
          wood: 25,
          fish: 10
        },
        benefits: {
          expeditionChance: 1
        },
        bonuses: {
          expeditionChance: 1
        },
        imageUrl: "/assets/images/buildings/tower-basic.png"
      },
      {
        level: 2,
        upgradeCost: {
          wood: 45,
          fish: 25
        },
        benefits: {
          expeditionChance: 1.5
        },
        bonuses: {
          expeditionChance: 1.5
        },
        imageUrl: "/assets/images/buildings/tower-improved.png"
      }
    ]
  }
];