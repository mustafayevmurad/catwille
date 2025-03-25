// client/src/context/GameContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import catsData from '../data/cats.json';
import expeditionsData from '../data/expeditions.json';
import tasksData from '../data/tasks.json';
import { buildings, getBuildingById, canUpgradeBuilding } from '../data/buildings-system';
import useTelegram from '../hooks/useTelegram';

// Создаем контекст
const GameContext = createContext();

// Время последнего обновления
const LAST_UPDATE_KEY = 'catwille_last_update';
// Ключ для сохранения данных
const GAME_DATA_KEY = 'catwille_game_data';

// Интервал обновления ресурсов (в миллисекундах)
const RESOURCE_REFRESH_INTERVAL = 1000 * 60 * 5; // 5 минут

export const GameProvider = ({ children }) => {
  const { getUser, showAlert } = useTelegram();
  const telegramUser = getUser();
  
  // Начальные данные игры
  const defaultGameData = {
    playerLevel: 1,
    resources: {
      wood: { amount: 0, capacity: 100, lastRefreshTime: Date.now() },
      fish: { amount: 0, capacity: 100, lastRefreshTime: Date.now() },
      coins: { amount: 0 },
      energy: { amount: 10, capacity: 10 },
      stars: { amount: 0 },
      items: [] // Для специальных предметов
    },
    cats: catsData.filter(cat => cat.unlockLevel === 1).map(cat => cat.id),
    activeCats: [],
    buildings: buildings.map(building => ({
      id: building.id,
      isBuilt: building.id === 'townhall', // Начинаем только с ратуши
      currentLevel: building.id === 'townhall' ? 0 : null
    })),
    completedTasks: [],
    lastDailyReset: Date.now(),
    dailyExpeditionDone: false,
    tasksProgress: {}
  };
  
  const [gameData, setGameData] = useState(defaultGameData);
  const [loading, setLoading] = useState(true);
  
  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const loadGameData = () => {
      try {
        const savedDataString = localStorage.getItem(GAME_DATA_KEY);
        
        if (savedDataString) {
          const savedData = JSON.parse(savedDataString);
          setGameData(savedData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading game data:", error);
        setLoading(false);
      }
    };
    
    loadGameData();
  }, []);
  
  // Сохранение данных в localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(GAME_DATA_KEY, JSON.stringify(gameData));
    }
  }, [gameData, loading]);
  
  // Обновление ресурсов с течением времени
  useEffect(() => {
    // Проверка и обновление ресурсов
    const refreshResources = () => {
      const now = Date.now();
      const lastUpdateTime = parseInt(localStorage.getItem(LAST_UPDATE_KEY) || '0');
      
      // Если прошло достаточно времени, обновляем ресурсы
      if (now - lastUpdateTime > RESOURCE_REFRESH_INTERVAL) {
        setGameData(prevData => {
          const newWoodAmount = Math.min(
            prevData.resources.wood.amount + 5,
            prevData.resources.wood.capacity
          );
          
          const newFishAmount = Math.min(
            prevData.resources.fish.amount + 5,
            prevData.resources.fish.capacity
          );
          
          // Обновляем энергию, если она ниже максимума
          const newEnergyAmount = Math.min(
            prevData.resources.energy.amount + 1,
            prevData.resources.energy.capacity
          );
          
          return {
            ...prevData,
            resources: {
              ...prevData.resources,
              wood: {
                ...prevData.resources.wood,
                amount: newWoodAmount,
                lastRefreshTime: now
              },
              fish: {
                ...prevData.resources.fish,
                amount: newFishAmount,
                lastRefreshTime: now
              },
              energy: {
                ...prevData.resources.energy,
                amount: newEnergyAmount
              }
            }
          };
        });
        
        localStorage.setItem(LAST_UPDATE_KEY, now.toString());
      }
      
      // Проверка для сброса ежедневных активностей
      const resetDailyActivities = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastResetDate = new Date(gameData.lastDailyReset);
        lastResetDate.setHours(0, 0, 0, 0);
        
        // Если наступил новый день
        if (today.getTime() > lastResetDate.getTime()) {
          setGameData(prevData => ({
            ...prevData,
            lastDailyReset: today.getTime(),
            dailyExpeditionDone: false,
            // Сбрасываем прогресс ежедневных заданий
            tasksProgress: {
              ...prevData.tasksProgress,
              ...tasksData
                .filter(task => task.type === 'daily')
                .reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {})
            }
          }));
        }
      };
      
      resetDailyActivities();
    };
    
    // Запускаем обновление ресурсов сразу
    refreshResources();
    
    // Затем запускаем интервал для регулярного обновления
    const intervalId = setInterval(refreshResources, 60000); // Проверка каждую минуту
    
    return () => clearInterval(intervalId);
  }, [gameData.lastDailyReset]);
  
  // Функция для добычи ресурсов
  const collectResource = (type) => {
    if (type !== 'wood' && type !== 'fish') return;
    
    setGameData(prevData => {
      // Проверяем, не переполнено ли хранилище
      if (prevData.resources[type].amount >= prevData.resources[type].capacity) {
        showAlert(`Хранилище ${type === 'wood' ? 'дерева' : 'рыбы'} переполнено!`);
        return prevData;
      }
      
      // Применяем бонусы от активных кошек
      const activeBonus = prevData.activeCats.reduce((bonus, catId) => {
        const cat = catsData.find(c => c.id === catId);
        if (cat && cat.bonus.type === type) {
          return bonus + (cat.bonus.value / 100);
        }
        return bonus;
      }, 1);
      
      // Базовое количество ресурса от клика
      const baseAmount = 1;
      // Итоговое количество с учетом бонуса (округляем вверх)
      const bonusAmount = Math.ceil(baseAmount * activeBonus);
      
      // Обновляем прогресс заданий, связанных с ресурсами
      const updatedTasksProgress = { ...prevData.tasksProgress };
      tasksData.forEach(task => {
        if (task.goal.resource === type) {
          updatedTasksProgress[task.id] = (updatedTasksProgress[task.id] || 0) + bonusAmount;
        }
      });
      
      return {
        ...prevData,
        resources: {
          ...prevData.resources,
          [type]: {
            ...prevData.resources[type],
            amount: Math.min(
              prevData.resources[type].amount + bonusAmount,
              prevData.resources[type].capacity
            )
          }
        },
        tasksProgress: updatedTasksProgress
      };
    });
  };
  
  // Функция для улучшения зданий
  const upgradeBuilding = (buildingId) => {
    setGameData(prevData => {
      // Проверка возможности улучшения здания
      const currentBuildings = prevData.buildings.map(b => ({
        id: b.id,
        level: b.currentLevel || 0
      }));
      
      const playerResources = {
        wood: prevData.resources.wood.amount,
        fish: prevData.resources.fish.amount,
        coins: prevData.resources.coins.amount,
        items: prevData.resources.items || []
      };
      
      const buildingToUpgrade = prevData.buildings.find(b => b.id === buildingId);
      const isNewBuilding = !buildingToUpgrade || !buildingToUpgrade.isBuilt;
      
      const buildingData = getBuildingById(buildingId);
      if (!buildingData) {
        showAlert('Здание не найдено!');
        return prevData;
      }
      
      // Определяем текущий уровень здания
      const currentLevel = buildingToUpgrade ? buildingToUpgrade.currentLevel || 0 : -1;
      const nextLevel = isNewBuilding ? 0 : currentLevel + 1;
      
      // Если здание уже на максимальном уровне
      if (nextLevel >= buildingData.levels.length) {
        showAlert('Это здание уже улучшено до максимального уровня!');
        return prevData;
      }
      
      // Получаем требования для следующего уровня
      const levelData = buildingData.levels[nextLevel];
      const { wood = 0, fish = 0, coins = 0, specialItem } = levelData.upgradeCost;
      
      // Проверяем достаточно ли ресурсов
      if (
        prevData.resources.wood.amount < wood ||
        prevData.resources.fish.amount < fish ||
        prevData.resources.coins.amount < coins
      ) {
        showAlert('Недостаточно ресурсов для улучшения!');
        return prevData;
      }
      
      // Проверяем, есть ли специальный предмет, если требуется
      if (specialItem && (!prevData.resources.items || !prevData.resources.items.includes(specialItem))) {
        showAlert(`Требуется специальный предмет: ${specialItem}`);
        return prevData;
      }
      
      // Проверяем требования по зданиям
      if (levelData.unlockRequirements.buildingsRequired) {
        const missingBuildings = levelData.unlockRequirements.buildingsRequired.filter(req => {
          const reqBuilding = prevData.buildings.find(b => b.id === req.id);
          return !reqBuilding || !reqBuilding.isBuilt || (reqBuilding.currentLevel || 0) < req.minLevel;
        });
        
        if (missingBuildings.length > 0) {
          const missingNames = missingBuildings.map(mb => {
            const building = getBuildingById(mb.id);
            return `${building.name} (уровень ${mb.minLevel})`;
          }).join(', ');
          
          showAlert(`Необходимо сначала построить: ${missingNames}`);
          return prevData;
        }
      }
      
      // Обновляем данные здания
      const updatedBuildings = [...prevData.buildings];
      const buildingIndex = updatedBuildings.findIndex(b => b.id === buildingId);
      
      if (buildingIndex !== -1) {
        // Обновляем существующее здание
        updatedBuildings[buildingIndex] = {
          ...updatedBuildings[buildingIndex],
          isBuilt: true,
          currentLevel: nextLevel
        };
      } else {
        // Добавляем новое здание
        updatedBuildings.push({
          id: buildingId,
          isBuilt: true,
          currentLevel: nextLevel
        });
      }
      
      // Получаем бонусы от улучшения
      const benefits = levelData.benefits;
      
      // Обновляем вместимость хранилища, если есть такой бонус
      let newWoodCapacity = prevData.resources.wood.capacity;
      let newFishCapacity = prevData.resources.fish.capacity;
      
      if (benefits.storageCapacity) {
        if (typeof benefits.storageCapacity === 'object') {
          if (benefits.storageCapacity.wood) {
            newWoodCapacity = benefits.storageCapacity.wood;
          }
          if (benefits.storageCapacity.fish) {
            newFishCapacity = benefits.storageCapacity.fish;
          }
        } else {
          newWoodCapacity = benefits.storageCapacity;
          newFishCapacity = benefits.storageCapacity;
        }
      }
      
      // Обновляем энергию, если есть такой бонус
      let newEnergyCapacity = prevData.resources.energy.capacity;
      if (benefits.energyCapacity) {
        newEnergyCapacity = benefits.energyCapacity;
      }
      
      // Возможно изменение уровня игрока на основе постройки
      let newPlayerLevel = prevData.playerLevel;
      if (buildingId === 'townhall' && nextLevel > 0 && nextLevel > currentLevel) {
        newPlayerLevel = Math.max(newPlayerLevel, nextLevel + 1);
      }
      
      // Вычитаем ресурсы и применяем все изменения
      return {
        ...prevData,
        playerLevel: newPlayerLevel,
        buildings: updatedBuildings,
        resources: {
          ...prevData.resources,
          wood: {
            ...prevData.resources.wood,
            amount: prevData.resources.wood.amount - wood,
            capacity: newWoodCapacity
          },
          fish: {
            ...prevData.resources.fish,
            amount: prevData.resources.fish.amount - fish,
            capacity: newFishCapacity
          },
          coins: {
            ...prevData.resources.coins,
            amount: prevData.resources.coins.amount - coins
          },
          energy: {
            ...prevData.resources.energy,
            capacity: newEnergyCapacity
          },
          // Удаляем специальный предмет из инвентаря, если он был использован
          items: specialItem
            ? (prevData.resources.items || []).filter(item => item !== specialItem)
            : (prevData.resources.items || [])
        }
      };
    });
  };
  
  // Активация кошки
  const activateCat = (catId) => {
    setGameData(prevData => {
      // Проверяем, есть ли кот в коллекции
      if (!prevData.cats.includes(catId)) {
        showAlert('У вас нет этой кошки!');
        return prevData;
      }
      
      // Проверяем, не активирована ли уже эта кошка
      if (prevData.activeCats.includes(catId)) {
        showAlert('Эта кошка уже активирована!');
        return prevData;
      }
      
      // Проверяем лимит активных кошек
      const maxActiveCats = 3; // Базовый лимит
      
      if (prevData.activeCats.length >= maxActiveCats) {
        showAlert(`Вы можете активировать максимум ${maxActiveCats} кошек одновременно!`);
        return prevData;
      }
      
      return {
        ...prevData,
        activeCats: [...prevData.activeCats, catId]
      };
    });
  };
  
  // Деактивация кошки
  const deactivateCat = (catId) => {
    setGameData(prevData => {
      // Проверяем, активирована ли эта кошка
      if (!prevData.activeCats.includes(catId)) {
        return prevData;
      }
      
      return {
        ...prevData,
        activeCats: prevData.activeCats.filter(id => id !== catId)
      };
    });
  };
  
  // Начало вылазки
  const startExpedition = (expeditionId) => {
    setGameData(prevData => {
      // Проверяем, завершена ли уже дневная вылазка
      if (prevData.dailyExpeditionDone) {
        showAlert('Вы уже совершили вылазку сегодня. Возвращайтесь завтра!');
        return prevData;
      }
      
      // Проверяем достаточно ли энергии
      if (prevData.resources.energy.amount < 3) {
        showAlert('Недостаточно энергии для вылазки!');
        return prevData;
      }
      
      return {
        ...prevData,
        resources: {
          ...prevData.resources,
          energy: {
            ...prevData.resources.energy,
            amount: prevData.resources.energy.amount - 3
          }
        },
        // Помечаем, что происходит вылазка
        currentExpedition: expeditionId
      };
    });
  };
  
  // Завершение вылазки
  const completeExpedition = (expeditionId, outcome) => {
    setGameData(prevData => {
      const expedition = expeditionsData.find(exp => exp.id === expeditionId);
      if (!expedition) return prevData;
      
      // Рассчитываем награды
      let woodReward = 0;
      let fishReward = 0;
      let coinsReward = 0;
      let starsReward = outcome?.rewards?.stars || 0;
      
      // Гарантированные награды
      if (expedition.rewards.guaranteed.wood) {
        woodReward += Math.floor(
          expedition.rewards.guaranteed.wood.min + 
          Math.random() * (expedition.rewards.guaranteed.wood.max - expedition.rewards.guaranteed.wood.min)
        );
      }
      
      if (expedition.rewards.guaranteed.fish) {
        fishReward += Math.floor(
          expedition.rewards.guaranteed.fish.min + 
          Math.random() * (expedition.rewards.guaranteed.fish.max - expedition.rewards.guaranteed.fish.min)
        );
      }
      
      // Случайные награды
      if (Math.random() < (expedition.rewards.chance.coins?.chance || 0)) {
        coinsReward += Math.floor(
          expedition.rewards.chance.coins.min + 
          Math.random() * (expedition.rewards.chance.coins.max - expedition.rewards.chance.coins.min)
        );
      }
      
      // Дополнительные награды из исхода истории
      if (outcome?.rewards) {
        if (outcome.rewards.wood) woodReward += outcome.rewards.wood;
        if (outcome.rewards.fish) fishReward += outcome.rewards.fish;
        if (outcome.rewards.coins) coinsReward += outcome.rewards.coins;
      }
      
      // Применяем штрафы, если есть
      let energyPenalty = 0;
      if (outcome?.penalties?.energy) {
        energyPenalty = outcome.penalties.energy;
      }
      
      // Обновляем прогресс заданий
      const updatedTasksProgress = { ...prevData.tasksProgress };
      tasksData.forEach(task => {
        if (task.goal.action === 'expedition') {
          updatedTasksProgress[task.id] = (updatedTasksProgress[task.id] || 0) + 1;
        }
      });
      
      // Проверяем, есть ли специальные предметы в награду
      let newItems = [...(prevData.resources.items || [])];
      if (outcome?.rewards?.specialItem) {
        newItems.push(outcome.rewards.specialItem);
      }
      
      return {
        ...prevData,
        dailyExpeditionDone: true,
        currentExpedition: null,
        resources: {
          ...prevData.resources,
          wood: {
            ...prevData.resources.wood,
            amount: Math.min(
              prevData.resources.wood.amount + woodReward,
              prevData.resources.wood.capacity
            )
          },
          fish: {
            ...prevData.resources.fish,
            amount: Math.min(
              prevData.resources.fish.amount + fishReward,
              prevData.resources.fish.capacity
            )
          },
          coins: {
            ...prevData.resources.coins,
            amount: prevData.resources.coins.amount + coinsReward
          },
          energy: {
            ...prevData.resources.energy,
            amount: Math.max(0, prevData.resources.energy.amount - energyPenalty)
          },
          stars: {
            ...prevData.resources.stars,
            amount: prevData.resources.stars.amount + starsReward
          },
          items: newItems
        },
        // Если в награде есть новая кошка, добавляем её в коллекцию
        cats: outcome?.rewards?.cats 
          ? [...new Set([...prevData.cats, ...(outcome.rewards.cats || [])])]
          : prevData.cats,
        tasksProgress: updatedTasksProgress
      };
    });
  };
  
  // Получение награды за задание
  const claimTaskReward = (taskId) => {
    setGameData(prevData => {
      // Проверяем, не получена ли уже награда
      if (prevData.completedTasks.includes(taskId)) {
        showAlert('Вы уже получили награду за это задание!');
        return prevData;
      }
      
      const task = tasksData.find(t => t.id === taskId);
      if (!task) return prevData;
      
      // Проверяем, выполнено ли задание
      const progress = prevData.tasksProgress[taskId] || 0;
      if (progress < task.goal.amount) {
        showAlert('Вы ещё не выполнили это задание!');
        return prevData;
      }
      
      // Рассчитываем награды
      const starsReward = task.rewards.stars || 0;
      const coinsReward = task.rewards.coins || 0;
      
      // Обновляем уровень игрока, если достигнут порог звезд
      let newPlayerLevel = prevData.playerLevel;
      const newStarsTotal = prevData.resources.stars.amount + starsReward;
      
      // Простая логика повышения уровня: каждые 10 звезд = +1 уровень
      const potentialLevel = Math.floor(newStarsTotal / 10) + 1;
      if (potentialLevel > newPlayerLevel) {
        newPlayerLevel = potentialLevel;
        showAlert(`Поздравляем! Вы достигли уровня ${newPlayerLevel}!`);
        
        // Разблокируем новых кошек при повышении уровня
        const newCats = catsData
          .filter(cat => cat.unlockLevel === newPlayerLevel)
          .map(cat => cat.id);
          
        if (newCats.length > 0) {
          showAlert(`Вы разблокировали ${newCats.length} новых кошек!`);
        }
      }
      
      return {
        ...prevData,
        completedTasks: [...prevData.completedTasks, taskId],
        resources: {
          ...prevData.resources,
          stars: {
            ...prevData.resources.stars,
            amount: newStarsTotal
          },
          coins: {
            ...prevData.resources.coins,
            amount: prevData.resources.coins.amount + coinsReward
          }
        },
        playerLevel: newPlayerLevel,
        // Разблокируем новых кошек при повышении уровня
        cats: [
          ...prevData.cats,
          ...catsData
            .filter(cat => cat.unlockLevel === newPlayerLevel && !prevData.cats.includes(cat.id))
            .map(cat => cat.id)
        ]
      };
    });
  };
  
  // Получение истории для вылазки
  const getExpeditionStory = (expeditionId) => {
    const expedition = expeditionsData.find(exp => exp.id === expeditionId);
    if (!expedition || !expedition.stories || expedition.stories.length === 0) {
      return null;
    }
    
    // Выбираем случайную историю из доступных
    const randomIndex = Math.floor(Math.random() * expedition.stories.length);
    return expedition.stories[randomIndex];
  };
  
  // Обновление ресурсов для отображения
  const tasks = tasksData.map(task => ({
    ...task,
    currentProgress: gameData.tasksProgress[task.id] || 0
  }));
  
  return (
    <GameContext.Provider value={{
      loading,
      playerLevel: gameData.playerLevel,
      resources: gameData.resources,
      buildings: gameData.buildings,
      cats: catsData.filter(cat => gameData.cats.includes(cat.id)),
      activeCats: gameData.activeCats,
      expeditions: expeditionsData,
      tasks,
      completedTasks: gameData.completedTasks,
      dailyExpeditionDone: gameData.dailyExpeditionDone,
      currentExpedition: gameData.currentExpedition,
      actions: {
        collectResource,
        upgradeBuilding,
        activateCat,
        deactivateCat,
        startExpedition,
        completeExpedition,
        claimTaskReward,
        getExpeditionStory
      }
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Хук для использования контекста игры
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};