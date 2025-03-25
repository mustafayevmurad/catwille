const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

// Получение всех зданий пользователя
router.get('/user/:userId', buildingController.getUserBuildings);

// Добавление нового здания
router.post('/user/:userId', buildingController.addBuilding);

// Улучшение здания
router.patch('/user/:userId/:buildingIndex/upgrade', buildingController.upgradeBuilding);

// Перемещение здания
router.patch('/user/:userId/:buildingIndex/move', buildingController.moveBuilding);

module.exports = router;