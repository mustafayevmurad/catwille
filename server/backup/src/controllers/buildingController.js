const { User, Cat } = require('../models/index');

// Получение всех зданий пользователя
exports.getUserBuildings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.status(200).json({ buildings: user.buildings });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Добавление нового здания
exports.addBuilding = async (req, res) => {
  try {
    const { userId } = req.params;
    const { buildingId, position } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Проверка на достаточность ресурсов можно добавить здесь
    
    // Добавление нового здания
    user.buildings.push({
      buildingId,
      level: 1,
      position
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'Здание успешно добавлено',
      buildings: user.buildings
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Улучшение здания
exports.upgradeBuilding = async (req, res) => {
  try {
    const { userId, buildingIndex } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    if (buildingIndex >= user.buildings.length) {
      return res.status(404).json({ message: 'Здание не найдено' });
    }
    
    // Проверка на достаточность ресурсов можно добавить здесь
    
    // Улучшение здания
    user.buildings[buildingIndex].level += 1;
    
    await user.save();
    
    res.status(200).json({
      message: 'Здание успешно улучшено',
      buildings: user.buildings
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Перемещение здания
exports.moveBuilding = async (req, res) => {
  try {
    const { userId, buildingIndex } = req.params;
    const { position } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    if (buildingIndex >= user.buildings.length) {
      return res.status(404).json({ message: 'Здание не найдено' });
    }
    
    // Обновление позиции
    user.buildings[buildingIndex].position = position;
    
    await user.save();
    
    res.status(200).json({
      message: 'Позиция здания обновлена',
      buildings: user.buildings
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};