const User = require('../models/User');
const { CATS } = require('../config/constants');

// @desc    Регистрация или авторизация пользователя
// @route   POST /api/users/auth
// @access  Public
exports.authUser = async (req, res) => {
  try {
    const { telegramId, username, firstName, lastName } = req.body;

    if (!telegramId) {
      return res.status(400).json({ message: 'Не указан Telegram ID' });
    }

    // Ищем пользователя или создаем нового
    let user = await User.findOne({ telegramId });

    if (!user) {
      // Создаем нового пользователя
      user = new User({
        telegramId,
        username,
        firstName,
        lastName
      });

      // Сохраняем пользователя
      await user.save();
    } else {
      // Обновляем данные пользователя, если они изменились
      if (username && username !== user.username) {
        user.username = username;
      }
      if (firstName && firstName !== user.firstName) {
        user.firstName = firstName;
      }
      if (lastName && lastName !== user.lastName) {
        user.lastName = lastName;
      }

      user.lastLogin = Date.now();
      await user.save();
    }

    // Регенерация ресурсов
    user.regenerateResources();
    await user.save();

    res.status(200).json({
      user: {
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        experience: user.experience,
        stars: user.stars,
        resources: user.resources,
        buildings: user.buildings,
        cats: user.cats,
        activeCats: user.activeCats,
        maxActiveCats: user.maxActiveCats,
        storageLimit: user.storageLimit,
        tutorialCompleted: user.tutorialCompleted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Получить данные пользователя
// @route   GET /api/users/me
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Регенерация ресурсов
    user.regenerateResources();
    await user.save();

    res.status(200).json({
      user: {
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        experience: user.experience,
        stars: user.stars,
        resources: user.resources,
        buildings: user.buildings,
        cats: user.cats,
        activeCats: user.activeCats,
        maxActiveCats: user.maxActiveCats,
        storageLimit: user.storageLimit,
        tutorialCompleted: user.tutorialCompleted
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Добыть ресурс
// @route   POST /api/users/resource
// @access  Private
exports.harvestResource = async (req, res) => {
  try {
    const { telegramId, resourceType, amount = 1 } = req.body;

    if (!telegramId || !resourceType) {
      return res.status(400).json({ message: 'Не указаны все необходимые параметры' });
    }

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Регенерация ресурсов перед добычей
    user.regenerateResources();

    // Проверка на тип ресурса
    if (resourceType !== 'wood' && resourceType !== 'fish') {
      return res.status(400).json({ message: 'Недопустимый тип ресурса' });
    }

    // Расчет бонуса от активных кошек
    let bonus = 0;
    user.cats.forEach(cat => {
      if (cat.active) {
        const catInfo = CATS[cat.catId.toUpperCase()];
        if (catInfo && catInfo.bonus.type === 'resource' && catInfo.bonus.resource === resourceType) {
          bonus += catInfo.bonus.value / 100;
        }
      }
    });

    // Расчет итогового количества ресурсов
    const totalAmount = Math.floor(amount * (1 + bonus));

    // Обновление количества ресурсов
    user.resources[resourceType].amount = Math.min(
      user.resources[resourceType].amount + totalAmount,
      user.storageLimit[resourceType]
    );

    await user.save();

    res.status(200).json({
      message: `Добыто ${totalAmount} ${resourceType}`,
      resources: user.resources,
      storageLimit: user.storageLimit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Построить или улучшить здание
// @route   POST /api/users/build
// @access  Private
exports.buildOrUpgrade = async (req, res) => {
  try {
    const { telegramId, buildingType } = req.body;

    if (!telegramId || !buildingType) {
      return res.status(400).json({ message: 'Не указаны все необходимые параметры' });
    }

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка на тип здания
    if (!user.buildings[buildingType]) {
      return res.status(400).json({ message: 'Недопустимый тип здания' });
    }

    const { BUILDINGS } = require('../config/constants');
    const building = BUILDINGS[buildingType.toUpperCase()];
    
    if (!building) {
      return res.status(400).json({ message: 'Здание не найдено в константах' });
    }

    const currentLevel = user.buildings[buildingType].level;
    
    // Проверка на максимальный уровень
    if (currentLevel >= building.maxLevel) {
      return res.status(400).json({ message: 'Здание уже на максимальном уровне' });
    }

    const nextLevel = currentLevel + 1;
    const cost = building.upgradeCosts[currentLevel];

    // Проверка наличия ресурсов
    if (user.resources.wood.amount < cost.wood) {
      return res.status(400).json({ message: 'Недостаточно дерева' });
    }
    if (user.resources.fish.amount < cost.fish) {
      return res.status(400).json({ message: 'Недостаточно рыбы' });
    }
    if (user.resources.coins < cost.coins) {
      return res.status(400).json({ message: 'Недостаточно монет' });
    }

    // Расчет бонуса строительства от активных кошек
    let buildingDiscount = 0;
    user.cats.forEach(cat => {
      if (cat.active) {
        const catInfo = CATS[cat.catId.toUpperCase()];
        if (catInfo && catInfo.bonus.type === 'building') {
          buildingDiscount += catInfo.bonus.value / 100;
        }
      }
    });

    // Применение скидки
    const discountedWood = Math.floor(cost.wood * (1 - buildingDiscount));
    const discountedFish = Math.floor(cost.fish * (1 - buildingDiscount));
    const discountedCoins = Math.floor(cost.coins * (1 - buildingDiscount));

    // Вычитание ресурсов
    user.resources.wood.amount -= discountedWood;
    user.resources.fish.amount -= discountedFish;
    user.resources.coins -= discountedCoins;

    // Обновление уровня здания
    user.buildings[buildingType].level = nextLevel;
    user.buildings[buildingType].built = true;

    // Если это главный дом, обновляем лимиты хранилища
    if (buildingType === 'mainHouse') {
      user.updateStorageLimits();
    }

    // Добавляем опыт за постройку
    user.addExperience(20 * nextLevel);

    await user.save();

    // Проверка, нужно ли разблокировать новую кошку
    let newCat = null;
    if (buildingType === 'mainHouse' && nextLevel === 1) {
      newCat = 'BUILDER_HARRY';
    } else if (buildingType === 'market' && nextLevel === 1) {
      newCat = 'MERCHANT_FELIX';
    } else if (buildingType === 'guestHouse' && nextLevel === 1) {
      newCat = 'KEEPER_OSCAR';
    }

    if (newCat) {
      // Проверяем, есть ли уже такая кошка у пользователя
      const hasCat = user.cats.some(cat => cat.catId === CATS[newCat].id);

      if (!hasCat) {
        user.cats.push({
          catId: CATS[newCat].id,
          active: false
        });
        await user.save();
      }
    }

    res.status(200).json({
      message: `${building.displayName} улучшен до уровня ${nextLevel}`,
      buildings: user.buildings,
      resources: user.resources,
      cats: user.cats,
      level: user.level,
      experience: user.experience,
      storageLimit: user.storageLimit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Активировать кошку
// @route   POST /api/users/activate-cat
// @access  Private
exports.activateCat = async (req, res) => {
  try {
    const { telegramId, catId, activate } = req.body;

    if (!telegramId || !catId) {
      return res.status(400).json({ message: 'Не указаны все необходимые параметры' });
    }

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Находим кошку в коллекции пользователя
    const catIndex = user.cats.findIndex(cat => cat.catId === catId);
    
    if (catIndex === -1) {
      return res.status(404).json({ message: 'Кошка не найдена' });
    }

    // Если активируем кошку
    if (activate) {
      // Проверяем, не превышен ли лимит активных кошек
      if (user.activeCats >= user.maxActiveCats) {
        return res.status(400).json({ message: 'Достигнут лимит активных кошек' });
      }

      // Активируем кошку
      user.cats[catIndex].active = true;
      user.activeCats += 1;
    } else {
      // Деактивируем кошку
      user.cats[catIndex].active = false;
      user.activeCats -= 1;
    }

    await user.save();

    res.status(200).json({
      message: activate ? 'Кошка активирована' : 'Кошка деактивирована',
      cats: user.cats,
      activeCats: user.activeCats,
      maxActiveCats: user.maxActiveCats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Продажа ресурсов
// @route   POST /api/users/sell
// @access  Private
exports.sellResources = async (req, res) => {
  try {
    const { telegramId, resourceType, amount } = req.body;

    if (!telegramId || !resourceType || !amount) {
      return res.status(400).json({ message: 'Не указаны все необходимые параметры' });
    }

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка на тип ресурса
    if (resourceType !== 'wood' && resourceType !== 'fish') {
      return res.status(400).json({ message: 'Недопустимый тип ресурса' });
    }

    // Проверка наличия ресурсов
    if (user.resources[resourceType].amount < amount) {
      return res.status(400).json({ message: `Недостаточно ${resourceType}` });
    }

    // Получаем текущий уровень ларька
    const marketLevel = user.buildings.market.level;
    
    // Проверка, построен ли ларек
    if (marketLevel === 0) {
      return res.status(400).json({ message: 'Сначала нужно построить ларек' });
    }

    const { BUILDINGS } = require('../config/constants');
    
    // Получаем курс обмена
    const tradeRate = BUILDINGS.MARKET.tradeRates[marketLevel - 1][resourceType];
    
    if (!tradeRate) {
      return res.status(400).json({ message: 'Ошибка определения курса обмена' });
    }

    // Расчет количества ресурсов для продажи (кратно tradeRate.amount)
    const sellAmount = Math.floor(amount / tradeRate.amount) * tradeRate.amount;
    
    if (sellAmount <= 0) {
      return res.status(400).json({ 
        message: `Минимальное количество для продажи: ${tradeRate.amount}`
      });
    }

    // Расчет монет к получению
    const batches = sellAmount / tradeRate.amount;
    let coinsToReceive = batches * tradeRate.price;

    // Расчет торгового бонуса от активных кошек
    let tradeBonus = 0;
    user.cats.forEach(cat => {
      if (cat.active) {
        const catInfo = CATS[cat.catId.toUpperCase()];
        if (catInfo && catInfo.bonus.type === 'trade') {
          tradeBonus += catInfo.bonus.value / 100;
        }
      }
    });

    // Применение бонуса
    coinsToReceive = Math.floor(coinsToReceive * (1 + tradeBonus));

    // Обновление ресурсов
    user.resources[resourceType].amount -= sellAmount;
    user.resources.coins += coinsToReceive;

    // Добавляем немного опыта за торговлю
    user.addExperience(batches * 2);

    await user.save();

    res.status(200).json({
      message: `Продано ${sellAmount} ${resourceType} за ${coinsToReceive} монет`,
      resources: user.resources
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// @desc    Завершить туториал
// @route   POST /api/users/complete-tutorial
// @access  Private
exports.completeTutorial = async (req, res) => {
  try {
    const { telegramId } = req.body;

    if (!telegramId) {
      return res.status(400).json({ message: 'Не указан Telegram ID' });
    }

    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.tutorialCompleted = true;
    await user.save();

    res.status(200).json({
      message: 'Туториал завершен',
      tutorialCompleted: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};