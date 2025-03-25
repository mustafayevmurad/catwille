const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Создание нового пользователя
router.post('/', userController.createUser);

// Получение данных пользователя по Telegram ID
router.get('/:telegramId', userController.getUser);

// Обновление ресурсов пользователя
router.patch('/:userId/resources', userController.updateResources);

module.exports = router;