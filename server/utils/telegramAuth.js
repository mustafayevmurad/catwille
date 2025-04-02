const crypto = require('crypto');

/**
 * Проверяет данные аутентификации Telegram
 * 
 * @param {Object} data - Данные аутентификации Telegram
 * @returns {Boolean} - Результат валидации
 */
const validateTelegramAuth = (data) => {
  // Данные, которые мы получаем от Telegram WebApp
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = data;
  
  // Создаем строку данных для проверки
  const dataCheckString = Object.keys(data)
    .filter(key => key !== 'hash')
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  // Получаем токен бота из переменных окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN не установлен в .env файле');
    return false;
  }

  // Создаем секретный ключ из токена бота
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();

  // Вычисляем HMAC-SHA-256 хеш
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Проверяем хеш и время аутентификации (не более 24 часов)
  const currentTime = Math.floor(Date.now() / 1000);
  const authTime = parseInt(auth_date);
  const isHashValid = hmac === hash;
  const isTimeValid = currentTime - authTime < 86400; // 24 часа в секундах

  return isHashValid && isTimeValid;
};

module.exports = { validateTelegramAuth };