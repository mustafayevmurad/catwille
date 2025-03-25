const { User, Cat } = require('../models/index');

// Выполнение действия в игре (рыбалка, охота, исследование и т.д.)
exports.performAction = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, catId, locationId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: 'Кошка не найдена' });
    }
    
    // Проверка энергии
    if (user.energy.current < 10) {
      return res.status(400).json({ message: 'Недостаточно энергии' });
    }
    
    // Расход энергии
    user.energy.current -= 10;
    
    let result = {
      resources: {},
      experience: 0,
      foundCat: null,
      message: ''
    };
    
    // Выполнение действия в зависимости от типа
    switch (action) {
      case 'fishing':
        // Базовая добыча + бонус от навыка кошки
        const fishAmount = 5 + Math.floor(cat.stats.fishing * 0.5);
        user.resources.fish += fishAmount;
        result.resources.fish = fishAmount;
        result.experience = 10;
        result.message = `${cat.name} поймал ${fishAmount} рыбы!`;
        break;
        
      case 'hunting':
        // Охота дает клубки шерсти
        const yarnAmount = 3 + Math.floor(cat.stats.hunting * 0.5);
        user.resources.yarnBalls += yarnAmount;
        result.resources.yarnBalls = yarnAmount;
        result.experience = 10;
        result.message = `${cat.name} собрал ${yarnAmount} клубков шерсти!`;
        break;
        
      case 'exploring':
        // Исследование может дать разные ресурсы и иногда новую кошку
        const exploreExp = 15;
        result.experience = exploreExp;
        
        // Шанс найти игрушки
        if (Math.random() < 0.3) {
          const toysAmount = 1 + Math.floor(Math.random() * 2);
          user.resources.toys += toysAmount;
          result.resources.toys = toysAmount;
          result.message = `${cat.name} нашел ${toysAmount} игрушки!`;
        }
        
        // Шанс найти лакомства
        if (Math.random() < 0.2) {
          const treatsAmount = 1;
          user.resources.treats += treatsAmount;
          result.resources.treats = treatsAmount;
          if (result.message) {
            result.message += ` И ${treatsAmount} лакомство!`;
          } else {
            result.message = `${cat.name} нашел ${treatsAmount} лакомство!`;
          }
        }
        
        // Очень маленький шанс найти кошку (для примера)
        if (Math.random() < 0.05) {
          result.message = `Вау! ${cat.name} нашел новую кошку!`;
          // Логика создания новой кошки может быть добавлена здесь
          // Или можно вернуть флаг, что нужно открыть интерфейс поиска кошки
          result.foundCat = true;
        }
        
        if (!result.message) {
          result.message = `${cat.name} исследовал окрестности, но ничего не нашел.`;
        }
        break;
        
      default:
        return res.status(400).json({ message: 'Неизвестное действие' });
    }
    
    // Добавление опыта кошке
    cat.experience += result.experience;
    
    // Проверка повышения уровня (простая формула)
    const newLevel = Math.floor(cat.experience / 100) + 1;
    if (newLevel > cat.level) {
      cat.level = newLevel;
      result.levelUp = true;
      result.message += ` ${cat.name} достиг ${newLevel} уровня!`;
    }
    
    await cat.save();
    await user.save();
    
    res.status(200).json({
      result,
      user: {
        resources: user.resources,
        energy: user.energy
      },
      cat: {
        experience: cat.experience,
        level: cat.level
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Обновление ежедневных задач
exports.updateDailyTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Проверка, прошел ли день с момента последнего обновления
    const now = new Date();
    const lastReset = new Date(user.dailyTasks.lastReset);
    const daysPassed = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
    
    if (daysPassed < 1) {
      return res.status(200).json({
        message: 'Задачи уже актуальны',
        tasks: user.dailyTasks
      });
    }
    
    // Простые ежедневные задачи
    const dailyTasks = [
      { taskId: 'fishing', progress: 0, completed: false },
      { taskId: 'hunting', progress: 0, completed: false },
      { taskId: 'exploring', progress: 0, completed: false }
    ];
    
    user.dailyTasks = {
      lastReset: now,
      tasks: dailyTasks
    };
    
    await user.save();
    
    res.status(200).json({
      message: 'Ежедневные задачи обновлены',
      tasks: user.dailyTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Получение всех заданий пользователя
exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.status(200).json({ tasks: user.dailyTasks });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Обновление прогресса задания
exports.updateTaskProgress = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { progress } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Поиск задачи
    const taskIndex = user.dailyTasks.tasks.findIndex(task => task.taskId === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }
    
    // Обновление прогресса
    user.dailyTasks.tasks[taskIndex].progress = progress;
    
    // Проверка завершения
    if (progress >= 100 && !user.dailyTasks.tasks[taskIndex].completed) {
      user.dailyTasks.tasks[taskIndex].completed = true;
      
      // Награда за выполнение
      user.resources.fish += 50;
      user.resources.yarnBalls += 10;
      
      await user.save();
      
      return res.status(200).json({
        message: 'Задача выполнена! Получена награда.',
        task: user.dailyTasks.tasks[taskIndex],
        reward: {
          fish: 50,
          yarnBalls: 10
        }
      });
    }
    
    await user.save();
    
    res.status(200).json({
      message: 'Прогресс задачи обновлен',
      task: user.dailyTasks.tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};