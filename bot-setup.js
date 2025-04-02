const { Telegraf } = require('telegraf');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Инициализация бота с токеном
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// URL вашего веб-приложения на render.com
const webAppUrl = process.env.WEBAPP_URL || 'https://your-app-name.onrender.com';

// Настройка команды /start
bot.start(async (ctx) => {
  await ctx.reply(
    `Привет, ${ctx.from.first_name}! Добро пожаловать в Catwille - игру о восстановлении кошачьего поселения. Нажми на кнопку ниже, чтобы начать игру.`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🎮 Играть', web_app: { url: webAppUrl } }]
        ]
      }
    }
  );
});

// Настройка команды /help
bot.help((ctx) => {
  ctx.reply(
    'Catwille - игра о восстановлении кошачьего поселения.\n\n' +
    'Доступные команды:\n' +
    '/start - Начать игру\n' +
    '/help - Показать справку'
  );
});

// Обработка данных из WebApp
bot.on('web_app_data', async (ctx) => {
  const data = JSON.parse(ctx.webAppData.data);
  console.log('Received data from WebApp:', data);
  
  // Здесь можно обрабатывать данные от WebApp
  await ctx.reply(`Данные получены! Спасибо за игру!`);
});

// Запуск бота
bot.launch().then(() => {
  console.log('Bot started');
}).catch((err) => {
  console.error('Error starting bot:', err);
});

// Включение graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 