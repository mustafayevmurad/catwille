const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

// Получение всех кошек пользователя
router.get('/user/:userId', catController.getUserCats);

// Получение конкретной кошки
router.get('/:catId', catController.getCat);

// Добавление новой кошки пользователю
router.post('/user/:userId', catController.addCat);

// Обновление опыта кошки
router.patch('/:catId/experience', catController.updateCatExperience);

// Улучшение навыка кошки
router.patch('/:catId/skill', catController.upgradeSkill);

module.exports = router;