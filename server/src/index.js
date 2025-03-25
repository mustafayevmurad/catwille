// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Базовый маршрут для проверки работоспособности API
app.get('/api/status', (req, res) => {
  res.json({ status: 'active', version: '1.0.0' });
});

// Обслуживание статических файлов из клиентской сборки в продакшн
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});