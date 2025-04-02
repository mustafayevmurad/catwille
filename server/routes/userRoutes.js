const express = require('express');
const router = express.Router();
const {
  authUser,
  getUser,
  harvestResource,
  buildOrUpgrade,
  activateCat,
  sellResources,
  completeTutorial
} = require('../controllers/userController');

// Аутентификация пользователя
router.post('/auth', authUser);

// Получение данных пользователя
router.get('/:telegramId', getUser);

// Добыча ресурса
router.post('/resource', harvestResource);

// Постройка или улучшение здания
router.post('/build', buildOrUpgrade);

// Активация/деактивация кошки
router.post('/activate-cat', activateCat);

// Продажа ресурсов
router.post('/sell', sellResources);

// Завершение туториала
router.post('/complete-tutorial', completeTutorial);

module.exports = router;