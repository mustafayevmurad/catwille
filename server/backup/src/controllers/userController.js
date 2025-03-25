const { User, Cat } = require('../models/index');

// Создание нового пользователя
exports.createUser = async (req, res) => {
  try {
    const { telegramId, username } = req.body;

    // Проверка на существующего пользователя
    const existingUser = await User.findOne({ telegramId });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким Telegram ID уже существует' });
    }

    // Создание нового пользователя
    const user = new User({
      telegramId,
      username
    });

    // Создание стартовой кошки для пользователя
    const startingCat = new Cat({
      catId: 'c001', // ID Мурзика из нашего набора данных
      name: 'Мурзик',
      owner: user._id,
      rarity: 'common',
      breed: 'Домашняя короткошерстная',
      color: 'orange',
      personality: 'Игривый',
      skills: [
        { name: 'Рыбалка', level: 1 },
        { name: 'Охота', level: 1 }
      ],
      stats: {
        fishing: 3,
        hunting: 1,
        crafting: 1,
        exploring: 1
      }
    });

    await startingCat.save();

    // Добавление кошки к пользователю
    user.cats.push(startingCat._id);

    // Добавление стартовых строений
    user.buildings.push({
      buildingId: 'b001', // ID Кошачьего домика
      level: 1,
      position: { x: 3, y: 3 }
    });

    await user.save();

    res.status(201).json({
      message: 'Пользователь успешно создан',
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        resources: user.resources,
        energy: user.energy
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Получение данных пользователя
exports.getUser = async (req, res) => {
  try {
    const { telegramId } = req.params;

    const user = await User.findOne({ telegramId })
      .populate('cats')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновление времени последней активности
    user.lastActive = Date.now();
    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        resources: user.resources,
        energy: user.energy,
        cats: user.cats,
        buildings: user.buildings,
        dailyTasks: user.dailyTasks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Обновление ресурсов пользователя
exports.updateResources = async (req, res) => {
  try {
    const { userId } = req.params;
    const { resources } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Обновление ресурсов
    if (resources.fish !== undefined) user.resources.fish = resources.fish;
    if (resources.yarnBalls !== undefined) user.resources.yarnBalls = resources.yarnBalls;
    if (resources.toys !== undefined) user.resources.toys = resources.toys;
    if (resources.treats !== undefined) user.resources.treats = resources.treats;
    if (resources.catCoins !== undefined) user.resources.catCoins = resources.catCoins;

    await user.save();

    res.status(200).json({
      message: 'Ресурсы успешно обновлены',
      resources: user.resources
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};