const { User, Cat } = require('../models/index');

// Получение всех кошек пользователя
exports.getUserCats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cats = await Cat.find({ owner: userId });
    
    res.status(200).json({ cats });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Получение конкретной кошки по ID
exports.getCat = async (req, res) => {
  try {
    const { catId } = req.params;
    
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: 'Кошка не найдена' });
    }
    
    res.status(200).json({ cat });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Добавление новой кошки пользователю (как результат исследования или события)
exports.addCat = async (req, res) => {
  try {
    const { userId } = req.params;
    const { catId, name, rarity, breed, color, personality, skills, stats } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Создание новой кошки
    const newCat = new Cat({
      catId,
      name,
      owner: userId,
      rarity,
      breed,
      color,
      personality,
      skills,
      stats
    });
    
    await newCat.save();
    
    // Добавление кошки пользователю
    user.cats.push(newCat._id);
    await user.save();
    
    res.status(201).json({
      message: 'Кошка успешно добавлена',
      cat: newCat
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Обновление опыта и уровня кошки
exports.updateCatExperience = async (req, res) => {
  try {
    const { catId } = req.params;
    const { experience } = req.body;
    
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: 'Кошка не найдена' });
    }
    
    // Добавление опыта
    cat.experience += experience;
    
    // Расчет нового уровня (простая формула: каждые 100 опыта = 1 уровень)
    const newLevel = Math.floor(cat.experience / 100) + 1;
    
    // Если уровень повысился
    if (newLevel > cat.level) {
      cat.level = newLevel;
      
      // Здесь можно добавить логику для повышения характеристик кошки при повышении уровня
      
      res.status(200).json({
        message: 'Уровень кошки повышен!',
        cat: cat,
        levelUp: true
      });
    } else {
      res.status(200).json({
        message: 'Опыт кошки обновлен',
        cat: cat,
        levelUp: false
      });
    }
    
    await cat.save();
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

// Повышение уровня навыка кошки
exports.upgradeSkill = async (req, res) => {
  try {
    const { catId } = req.params;
    const { skillName } = req.body;
    
    const cat = await Cat.findById(catId);
    if (!cat) {
      return res.status(404).json({ message: 'Кошка не найдена' });
    }
    
    // Поиск навыка
    const skillIndex = cat.skills.findIndex(skill => skill.name === skillName);
    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Навык не найден' });
    }
    
    // Повышение уровня навыка
    cat.skills[skillIndex].level += 1;
    await cat.save();
    
    res.status(200).json({
      message: 'Навык успешно улучшен',
      cat: cat
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};