const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

// Импорт конфигурации базы данных
const connectDB = require('./config/db');

// Инициализация Express
const app = express();

// Подключение к базе данных
connectDB();

// Middleware для безопасности и производительности
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "telegram.org", "*.telegram.org", "cdn.jsdelivr.net"],
      connectSrc: ["'self'", "telegram.org", "*.telegram.org"],
      imgSrc: ["'self'", "data:", "telegram.org", "*.telegram.org"],
      styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
    },
  },
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL || 'https://catwille-client.onrender.com'] 
    : 'http://127.0.0.1:8080',
  credentials: true
}));
app.use(morgan('dev'));

// Статические файлы
app.use(express.static(path.join(__dirname, '../client')));

// Определение базового маршрута API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Добро пожаловать в API Catwille!',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

// Маршрут для проверки здоровья сервера (для Render)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Определение маршрутов
app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/resources', require('./routes/resourceRoutes'));
// app.use('/api/buildings', require('./routes/buildingRoutes'));
// app.use('/api/cats', require('./routes/catRoutes'));

// Telegram Bot WebApp integration
app.get('/telegram-app', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Обработка запросов к клиентской части
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Определение порта
const PORT = process.env.PORT || 3000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT} в режиме ${process.env.NODE_ENV}`);
  console.log(`MongoDB ${mongoose.connection.readyState === 1 ? 'подключена' : 'отключена'}`);
});

// Обработка неперехваченных исключений
process.on('unhandledRejection', (err) => {
  console.log(`Ошибка: ${err.message}`);
  // Закрытие сервера и выход из процесса
  // server.close(() => process.exit(1));
});