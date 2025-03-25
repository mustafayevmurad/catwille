const express = require('express');
const router = express.Router();
const telegramBot = require('../telegram-bot');

// Обработка webhook от Telegram
router.post('/webhook', async (req, res) => {
  try {
    await telegramBot.processUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Ошибка при обработке webhook:', error);
    res.status(500).send('Ошибка при обработке webhook');
  }
});

// Ручная установка webhook (можно использовать для развертывания)
router.post('/set-webhook', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL не указан' });
    }
    
    const result = await telegramBot.setWebhook(url);
    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при установке webhook:', error);
    res.status(500).json({ 
      message: 'Ошибка при установке webhook', 
      error: error.message 
    });
  }
});

// Получение информации о боте
router.get('/info', async (req, res) => {
  try {
    // Здесь можно добавить логику получения информации о боте
    // через Telegram API
    res.status(200).json({ 
      message: 'Бот Кошачьей Империи работает' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Ошибка при получении информации о боте', 
      error: error.message 
    });
  }
});

module.exports = router;