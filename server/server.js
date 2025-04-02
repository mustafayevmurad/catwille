const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Импорт конфигурации базы данных
const connectDB = require('./config/db');

// Инициализация Express
const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://127.0.0.1:8080', // или используйте true для разрешения всех источников
  credentials: true // важно для запросов с credentials: 'include'
}));
app.use(morgan('dev'));

// Статические файлы
app.use(express.static(path.join(__dirname, '../client')));

// Определение базового маршрута API
app.get('/api', (req, res) => {
  res.json({ message: 'Добро пожаловать в API Catwille!' });
});

// Определение маршрутов
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/resources', require('./routes/resourceRoutes'));
// app.use('/api/buildings', require('./routes/buildingRoutes'));
// app.use('/api/cats', require('./routes/catRoutes'));

// Обработка запросов к клиентской части
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Определение порта
const PORT = process.env.PORT || 3000;

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT} в режиме ${process.env.NODE_ENV}`);
});

// Обработка неперехваченных исключений
process.on('unhandledRejection', (err) => {
  console.log(`Ошибка: ${err.message}`);
  // Закрытие сервера и выход из процесса
  // server.close(() => process.exit(1));
});