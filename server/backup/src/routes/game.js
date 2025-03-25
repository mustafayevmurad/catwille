const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Выполнение действия в игре
router.post('/action/:userId', gameController.performAction);

// Обновление ежедневных заданий
router.post('/tasks/:userId/reset', gameController.updateDailyTasks);

// Получение заданий пользователя
router.get('/tasks/:userId', gameController.getUserTasks);

// Обновление прогресса задания
router.patch('/tasks/:userId/:taskId', gameController.updateTaskProgress);

module.exports = router;