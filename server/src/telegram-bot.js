const axios = require('axios');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-domain.com';

// Базовый URL для API Telegram
const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Функция для отправки сообщений через API Telegram
async function sendMessage(chatId, text, extra = {}) {
  try {
    const response = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...extra
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Функция для обработки команды /start
async function handleStartCommand(chatId, username) {
  const welcomeMessage = `
Привет, ${username || 'котолюбитель'}! 😺

Добро пожаловать в <b>Кошачью Империю</b> - игру, где ты сможешь построить собственное кошачье поселение, собрать коллекцию уникальных кошек и исследовать загадочный кошачий мир!
  `;

  const keyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: '🐱 Начать игру',
          web_app: { url: WEBAPP_URL }
        }
      ]
    ]
  };

  await sendMessage(chatId, welcomeMessage, {
    reply_markup: keyboardMarkup
  });
}

// Другие обработчики команд...

// Основная функция для обработки webhook от Telegram
function processUpdate(update) {
  // Проверяем, что это сообщение
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    const username = update.message.from.username || update.message.from.first_name;

    // Обработка команд
    if (text === '/start') {
      return handleStartCommand(chatId, username);
    }
    // Другие обработчики команд...
  }

  return Promise.resolve();
}

// Настройка webhook для получения обновлений
async function setWebhook(url) {
  try {
    const response = await axios.post(`${API_URL}/setWebhook`, {
      url: `${url}/api/telegram/webhook`,
      drop_pending_updates: true
    });
    
    console.log('Webhook установлен:', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при установке webhook:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = {
  processUpdate,
  setWebhook,
  sendMessage
};